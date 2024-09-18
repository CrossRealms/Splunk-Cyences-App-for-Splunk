#!/usr/bin/env python

import cs_imports
import sys
import time

from splunklib.searchcommands import (
    dispatch,
    GeneratingCommand,
    Configuration,
    Option,
    validators,
)

import splunklib.client as client
import splunklib.results as results
import cs_utils
import logging
import logger_manager

logger = logger_manager.setup_logging("inventory_backfill", logging.INFO)


def handle_results(response):
    reader = results.JSONResultsReader(response)
    for result in reader:
        if isinstance(result, results.Message):
            logger.warning("{}: {}".format(result.type, result.message))


@Configuration()
class CyencesInventoryBackfill(GeneratingCommand):
    search_prefix = Option(name="search_prefix", require=False, default="-")
    earliest_time = Option(name="earliest_time", require=False, default="-24h")
    latest_time = Option(name="latest_time", require=False, default="now")

    def generate(self):
        try:
            self.session_key = cs_utils.GetSessionKey(logger).from_custom_command(self)
            self.conf_manger = cs_utils.ConfigHandler(logger, self.session_key)

            saved_searches = self.conf_manger.get_saved_searches()

            for saved_search in saved_searches:
                name = saved_search["name"]
                if name.startswith(self.search_prefix) and (not cs_utils.is_true(saved_search["content"].get("disabled"))):

                    if name == "Device Inventory - Windows Defender":
                        SEARCH_QUERY = '| search `cs_windows_defender` EventCode=1151 `cs_windows_defender_max_timerange` | `cs_windows_defender_inventory_fill_search` | where SEARCHNOTHING="SEARCHNOTHING"'
                    else:
                        SEARCH_QUERY = '| savedsearch "{}" | where SEARCHNOTHING="SEARCHNOTHING"'.format(name)
                    service = client.connect(token=self.session_key, app=cs_utils.APP_NAME)

                    logger.info("Running the {} search for {} to {} timerange".format(SEARCH_QUERY, self.earliest_time, self.latest_time))
                    response = service.jobs.oneshot(SEARCH_QUERY, output_mode="json", earliest_time=self.earliest_time, latest_time=self.latest_time)
                    handle_results(response)
                    time.sleep(5)

            yield {"msg": "Execution successfully completed"}

        except Exception as e:
            logger.exception("Unexpected error while running the command: {}".format(e))
            raise e


dispatch(CyencesInventoryBackfill, sys.argv, sys.stdin, sys.stdout, __name__)
