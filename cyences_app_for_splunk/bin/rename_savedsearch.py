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

logger = logger_manager.setup_logging("rename_savedsearch", logging.DEBUG)  # TODO: INFO

SAVEDSEARCH_MAPPING = {
    "mahir test alert 1": "AD - test alert 1",
}


@Configuration()
class RenameSavedSearch(GeneratingCommand):
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
            results[item["name"]] = item["content"]
        logger.debug("savedsearches={}".format(results))
        return results

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

    def delete_savedsearch(self, savedsearch_name):
        logger.info("Deleting savedsearch {}".format(savedsearch_name))
        rest.simpleRequest(
            "/servicesNS/nobody/{}/saved/searches/{}?output_mode=json&count=0".format(
                cs_utils.APP_NAME, savedsearch_name
            ),
            sessionKey=self.session_key,
            raiseAllErrors=True,
            method="DELETE",
        )

    def generate(self):
        try:
            self.session_key = cs_utils.GetSessionKey(logger).from_custom_command(self)

            savedsearches = self.get_saved_searches()

            for old_savedsearch, new_savedsearch in SAVEDSEARCH_MAPPING.items():
                # Skip if savedsearch is already renamed and migrated
                if old_savedsearch not in savedsearches:
                    continue

                logger.info(
                    "Migrating {} => {}".format(old_savedsearch, new_savedsearch)
                )
                old_content = savedsearches[old_savedsearch]
                new_content = savedsearches[new_savedsearch]
                logger.debug(
                    "{} savedsearch content={}".format(old_savedsearch, old_content)
                )
                logger.debug(
                    "{} savedsearch content={}".format(new_savedsearch, new_content)
                )

                diff = set(old_content.items()) - set(new_content.items())
                payload = {item[0]: item[1] for item in diff}

                if payload:
                    self.update_savedsearch(new_savedsearch, payload)

                self.delete_savedsearch(old_savedsearch)

            success_msg = "Successfully completed"
            logger.info(success_msg)
            yield {"_raw": success_msg, "msg": success_msg}
        except Exception as e:
            logger.exception("Error in rename_savedsearch command: {}".format(e))
            raise e


dispatch(RenameSavedSearch, sys.argv, sys.stdin, sys.stdout, __name__)
