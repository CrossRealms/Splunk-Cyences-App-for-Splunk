import cs_imports
import sys

from splunklib.searchcommands import (
    dispatch,
    GeneratingCommand,
    Configuration,
    Option,
    validators,
)
import cs_utils
from upgrade_steps import version_upgrade

import logging
import logger_manager

logger = logger_manager.setup_logging("upgrade", logging.INFO)

CY_VERSION_MACRO = "cy_cyences_version"

@Configuration()
class CyencesUpgrade(GeneratingCommand):

    def generate(self):
        try:
            self.session_key = cs_utils.GetSessionKey(logger).from_custom_command(self)
            self.conf_manger = cs_utils.ConfigHandler(logger, self.session_key)

            macro_app_version = self.conf_manger.get_macro(CY_VERSION_MACRO)
            latest_app_version = self.conf_manger.get_conf_stanza('app', 'launcher')[0]["content"]["version"]

            macro_app_version = macro_app_version.strip()
            latest_app_version = latest_app_version.strip()
            if macro_app_version == "":
                macro_app_version = "3.1.0" # When upgrade command was introduced

            if macro_app_version == latest_app_version:
                yield {"msg": "Nothing to do"}
            else:
                index = list(map(lambda x: x[0], version_upgrade)).index(macro_app_version)

                for version, func in version_upgrade[index+1:]:
                    if func is None:
                        if version == latest_app_version:
                            self.conf_manger.update_macro(CY_VERSION_MACRO, {"definition": version})
                            break
                        continue
                    logger.info("Performing upgrade steps for version {}".format(version))
                    try:
                        func(self.session_key, logger)
                        self.conf_manger.update_macro(CY_VERSION_MACRO, {"definition": version})
                    except Exception as err:
                        logger.exception("Error occurred while performing upgrade steps for version {}".format(version))
                        raise err

                    if version == latest_app_version:
                        break

                yield {"msg": "Successfully completed"}

        except Exception as e:
            logger.exception("Error in sync_filter_macros command: {}".format(e))
            raise e


dispatch(CyencesUpgrade, sys.argv, sys.stdin, sys.stdout, __name__)
