import re
import copy
import json
import concurrent.futures
import splunk.admin as admin
from splunk import rest
import cs_utils
from cs_product_list import PRODUCTS
from splunk.clilib.bundle_paths import make_splunkhome_path


import logging
import logger_manager
logger = logger_manager.setup_logging('rh_cyences_configuration', logging.INFO)


CONF_FILE = 'cs_configurations'
HONEYDB_STANZA = 'honeydb'

APP_CONFIG_STANZA = 'product_config'
PRODUCTS_KEY = 'products'
ENABLED_PRODUCTS_KEY = 'enabled_products'
DISABLED_PRODUCTS_KEY = 'disabled_products'


def parse_nav_item(content):
    '''
    parse dashboard name and products
    i.e. <view name="cs_ad_reports" /><!--abc,xyz -->
    dashboard name=cs_ad_reports and products=set(abc,xyz)
    '''

    m = re.search(r'<view\s+name\s*=\s*"([^"]+)"\s*/>\s*<!--\s*([\w,\s]+)\s*-->', content)
    if m:
        dashboard_name = m.group(1)
        products = cs_utils.convert_to_set(m.group(2))
        return (dashboard_name, products)
    else:
        return (None, None)


def build_new_nav_bar(enabled_products, disabled_products):
    with open(make_splunkhome_path(["etc", "apps", cs_utils.APP_NAME, "default", "data", "ui" ,"nav", "default.xml"])) as fp:
        new_nav_items = []
        for line in fp:
            dashboard_name, products = parse_nav_item(line)
            # Other tags like collection, </collection>, etc..
            if dashboard_name is None:
                # Always add
                new_nav_items.append(line)
            elif len(products&disabled_products)>0:
                # Not adding in nav bar
                new_nav_items.append("\n")
            elif len(products&enabled_products)>0:
                new_nav_items.append(line)
            else:
                # keep enabled for status=unknown
                new_nav_items.append(line)

        return ''.join(new_nav_items)


class CyencesProductConfigurationHandler(admin.MConfigHandler):

    def setup(self):
        for arg in ['data']:
            self.supportedArgs.addOptArg(arg)

    def get_saved_searches(self):
        data = self.conf_manager.get_saved_searches()

        results = {}
        for item in data:
            if item["content"].get("action.cyences_notable_event_action.products") is not None and cs_utils.is_true(
                item["content"].get(
                    "action.cyences_notable_event_action.param.alert_state_change_from_setup_page",
                    "1",  # The savedsearch endpoint does not provide default alert action param values hence returning default value 1
                )
            ):
                results[item["name"]] = item["content"]
        return results

    def configure_saved_searches(self, enabled_products, disabled_products):
        savedsearches = self.get_saved_searches()

        changed_savedsearches = []
        messages_to_display = []
        errors = []
        for name, content in savedsearches.items():
            products = cs_utils.convert_to_set(content["action.cyences_notable_event_action.products"])
            current_disabled = cs_utils.is_true(content["disabled"])

            if len(products - disabled_products) == 0:
                new_disabled = True
            elif len(products & enabled_products) > 0:
                new_disabled = False
            else:
                new_disabled = current_disabled

            if current_disabled != new_disabled:
                changed_savedsearches.append([name, new_disabled])
                messages_to_display.append(name + " => " + ("Disabled" if new_disabled else "Enabled"))

        if len(changed_savedsearches) > 0:
            with concurrent.futures.ThreadPoolExecutor(max_workers=min(len(changed_savedsearches), 15)) as executor:
                futures = {
                    executor.submit(self.conf_manager.update_savedsearch, changes[0], {"disabled": changes[1]}): changes for changes in changed_savedsearches
                }
                for future in concurrent.futures.as_completed(futures):
                    try:
                        future.result()
                    except Exception as e:
                        errors.append(str(e))

            if len(errors) > 0:
                raise Exception(errors)

        return '\n'.join(messages_to_display)

    def configure_nav_bar(self, enabled_products, disabled_products):

        nav_bar_xml = build_new_nav_bar(enabled_products, disabled_products)

        rest.simpleRequest(
            "/servicesNS/nobody/{}/data/ui/nav/default?output_mode=json".format(cs_utils.APP_NAME),
            postargs={"eai:data": nav_bar_xml},
            method='POST',
            sessionKey=self.getSessionKey(),
            raiseAllErrors=True,
        )

        self.conf_manager.update_conf_stanza(
            CONF_FILE,
            APP_CONFIG_STANZA,
            data={
                ENABLED_PRODUCTS_KEY: ', '.join(enabled_products),
                DISABLED_PRODUCTS_KEY: ', '.join(disabled_products)
            }
        )

    def get_product_configuration(self):
        data = self.conf_manager.get_conf_stanza(CONF_FILE, APP_CONFIG_STANZA)

        product_config = {}
        for i in data:
            if i['name'] == APP_CONFIG_STANZA:
                product_config= i['content']
                break
        enabled_products = cs_utils.convert_to_set(product_config[ENABLED_PRODUCTS_KEY])
        disabled_products = cs_utils.convert_to_set(product_config[DISABLED_PRODUCTS_KEY])
        return enabled_products, disabled_products

    def handleList(self, conf_info):
        self.conf_manager = cs_utils.ConfigHandler(logger, self.getSessionKey())

        try:
            enabled_products, disabled_products = self.get_product_configuration()
            macros = self.conf_manager.get_macros_definitions()

            all_products = copy.deepcopy(PRODUCTS)

            for product in all_products:
                if product["name"].lower() in enabled_products:
                    product["enabled"] = True
                elif product["name"].lower() in disabled_products:
                    product["enabled"] = False
                else:
                    product["enabled"] = "Unknown"

                for macro_item in product["macro_configurations"]:
                    macro_item["macro_definition"] = macros[macro_item["macro_name"]]

            conf_info[APP_CONFIG_STANZA][PRODUCTS_KEY] = json.dumps(all_products)

        except Exception as e:
            logger.exception('Unable to fetch product_config {}'.format(e))
            raise admin.ArgValidationException('Unable to fetch product_config {}'.format(e))

    def handleEdit(self, conf_info):
        self.conf_manager = cs_utils.ConfigHandler(logger, self.getSessionKey())

        try:
            data = json.loads(self.callerArgs['data'][0])
            logger.debug("data=>{}".format(data))
            product = data["product"]
            product_enabled = data.get("enabled")
            macro_configurations = data.get("macro_configurations")
        except Exception as e:
            logger.exception("Unable to parsed the payload")
            raise admin.ArgValidationException('Data is not in proper format. {} - {}'.format(e, self.callerArgs["data"]))

        if product_enabled is None and not macro_configurations:
            raise admin.ArgValidationException("Provide either enabled or macro_configurations")

        try:
            if product_enabled is not None:
                product = product.lower()
                product_enabled = cs_utils.is_true(product_enabled)
                enabled_products, disabled_products = self.get_product_configuration()

                if product_enabled:
                    enabled_products.add(product)
                    disabled_products.discard(product)
                if not product_enabled:
                    disabled_products.add(product)
                    enabled_products.discard(product)

                logger.info("final enabled_product={} and disabled_products={}".format(enabled_products, disabled_products))

                self.configure_nav_bar(enabled_products, disabled_products)
                output = self.configure_saved_searches(enabled_products, disabled_products)

                conf_info["result"]['message'] = output

        except Exception as e:
            logger.exception("Unable to update Cyences app configuration.")
            raise admin.ArgValidationException('Unable to update Cyences app configuration. {} - {}'.format(e, self.callerArgs["data"]))

        try:
            if macro_configurations is not None:
                macros = self.conf_manager.get_macros_definitions()

                for macro_item in macro_configurations:
                    macro_name = macro_item["macro_name"]
                    macro_definition = macro_item["macro_definition"]

                    current_macro_value = macros.get(macro_name)
                    if current_macro_value == macro_definition:
                        continue

                    self.conf_manager.update_macro(macro_name, {"definition": macro_definition})

                conf_info["result"]['message'] = "Updated Cyences app configuration successfully"

        except Exception as e:
            logger.exception("Unable to update Cyences app configuration.")
            raise admin.ArgValidationException('Unable to update Cyences app configuration. {} - {}'.format(e, self.callerArgs["data"]))


if __name__ == "__main__":
    admin.init(CyencesProductConfigurationHandler, admin.CONTEXT_APP_AND_USER)
