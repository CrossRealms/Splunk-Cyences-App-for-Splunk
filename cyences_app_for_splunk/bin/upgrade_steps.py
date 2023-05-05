import time
import cs_utils

import splunklib.client as client
import splunklib.results as results


def handle_results(response, logger):
    reader = results.JSONResultsReader(response)
    count = 0
    for result in reader:
        if isinstance(result, results.Message):
            logger.warning("{}: {}".format(result.type, result.message))
        if isinstance(result, dict):
            count += 1
    logger.info("Total {} rows".format(count))


def upgrade_4_0_0(session_key, logger):
    SEARCH_QUERY = '| savedsearch "Authentication - Usual Login Location Lookup Gen"'

    service = client.connect(token=session_key, app=cs_utils.APP_NAME)

    logger.info("Running Login Location Lookup Gen search for -12w to -8w timerange")
    response = service.jobs.oneshot(SEARCH_QUERY, output_mode="json", earliest_time='-12w@w', latest_time='-8w@w')
    handle_results(response, logger)
    time.sleep(60)
    logger.info("Running Login Location Lookup Gen search  for -8w to -4w timerange")
    response = service.jobs.oneshot(SEARCH_QUERY, output_mode="json", earliest_time='-8w@w', latest_time='-4w@w')
    handle_results(response, logger)
    time.sleep(60)
    logger.info("Running Login Location Lookup Gen search  for -4w to w timerange")
    response = service.jobs.oneshot(SEARCH_QUERY, output_mode="json", earliest_time='-4w@w', latest_time='@w')
    handle_results(response, logger)


version_upgrade = (
    ('3.1.0', None),
    ('4.0.0', upgrade_4_0_0),
)
