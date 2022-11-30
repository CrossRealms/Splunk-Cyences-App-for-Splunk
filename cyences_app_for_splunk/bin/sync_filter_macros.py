import sys
import json

from splunklib.searchcommands import (
    dispatch,
    GeneratingCommand,
    Configuration,
    Option,
    validators,
)
from splunk import rest
import cs_utils

import logging
import logger_manager

logger = logger_manager.setup_logging("sync_filter_macros", logging.INFO)

FILTER_MACRO_NAME_KEY = "action.cyences_notable_event_action.param.filter_macro_name"
FILTER_MACRO_VALUE_KEY = "action.cyences_notable_event_action.param.filter_macro_value"


@Configuration()
class SyncFilterMacros(GeneratingCommand):

    reverse = Option(
        name="reverse", require=False, validate=validators.Boolean(), default=False
    )

    def get_saved_searches(self):
        logger.info("Getting savedsearches")
        _, serverContent = rest.simpleRequest(
            "/servicesNS/-/{}/saved/searches?output_mode=json&count=0".format(
                cs_utils.APP_NAME
            ),
            sessionKey=self.session_key,
            raiseAllErrors=True,
        )
        data = json.loads(serverContent)["entry"]

        results = {}
        for item in data:
            if item["content"].get("action.cyences_notable_event_action") == "1":
                results[item["name"]] = item["content"]
        logger.debug("savedsearches={}".format(results))
        return results

    def get_macros(self):
        logger.info("Getting macros")
        _, serverContent = rest.simpleRequest(
            "/servicesNS/-/{}/admin/macros?output_mode=json&count=0".format(
                cs_utils.APP_NAME
            ),
            sessionKey=self.session_key,
            raiseAllErrors=True,
        )
        data = json.loads(serverContent)["entry"]

        results = {}
        for item in data:
            results[item["name"]] = item["content"]["definition"]
        logger.debug("macros={}".format(results))
        return results

    def update_macro(self, macro_name, data):
        logger.info("Updating macro {} with data {}".format(macro_name, data))
        _, serverContent = rest.simpleRequest(
            "/servicesNS/nobody/{}/admin/macros/{}?output_mode=json&count=0".format(
                cs_utils.APP_NAME, macro_name
            ),
            sessionKey=self.session_key,
            raiseAllErrors=True,
            method="POST",
            postargs=data,
        )

    def update_savedsearch(self, savedsearch_name, data):
        logger.info(
            "Updating savedsearch {} with data {}".format(savedsearch_name, data)
        )
        rest.simpleRequest(
            "/servicesNS/nobody/{}/saved/searches/{}?output_mode=json&count=0".format(
                cs_utils.APP_NAME, savedsearch_name
            ),
            sessionKey=self.session_key,
            raiseAllErrors=True,
            method="POST",
            postargs=data,
        )

    def generate(self):
        try:
            self.session_key = self.search_results_info.auth_token

            savedsearches = self.get_saved_searches()
            macros = self.get_macros()

            for name, content in savedsearches.items():
                param_name = content.get(FILTER_MACRO_NAME_KEY)
                param_value = content.get(
                    FILTER_MACRO_VALUE_KEY, "search *"
                )  # The savedsearch endpoint does not provide default alert action param values

                current_macro_value = macros[param_name]
                logger.debug(
                    "param_name={}, param_value={}, current_macro_value={}".format(
                        param_name,
                        param_value,
                        current_macro_value,
                    )
                )

                # filter macro is not configured
                if not param_name:
                    continue

                # macro is in sync
                if param_value == current_macro_value:
                    continue

                if self.reverse:
                    # Update the savedsearch param with macro value
                    self.update_savedsearch(
                        name, {FILTER_MACRO_VALUE_KEY: current_macro_value}
                    )
                else:
                    # Update the macro with savedsearch param value
                    self.update_macro(param_name, {"definition": param_value})

            yield {"msg": "Successfully completed"}
        except Exception as e:
            logger.exception("Error in sync_filter_macros command: {}".format(e))
            raise e


dispatch(SyncFilterMacros, sys.argv, sys.stdin, sys.stdout, __name__)
