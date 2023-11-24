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


def upgrade_4_3_0(session_key, logger):
    service = client.connect(token=session_key, app=cs_utils.APP_NAME)

    DEVICE_INVENTORY_SEARCH_QUERY = '| savedsearch "Device Inventory Backfill"'
    logger.info("Running Device Inventory Backfill search for last 30 day timerange")
    response = service.jobs.oneshot(DEVICE_INVENTORY_SEARCH_QUERY, output_mode="json", earliest_time='-30d@m', latest_time='now')
    handle_results(response, logger)
    time.sleep(60)

    USER_INVENTORY_SEARCH_QUERY = '| savedsearch "User Inventory - Lookup Backfill"'
    logger.info("Running User Inventory Backfill search for last 1 day timerange")
    response = service.jobs.oneshot(USER_INVENTORY_SEARCH_QUERY, output_mode="json", earliest_time='-1d@m', latest_time='now')
    handle_results(response, logger)


def upgrade_4_5_0(session_key, logger):
    service = client.connect(token=session_key, app=cs_utils.APP_NAME)

    SOPHOS_DEVICES_CLEANUP_SEARCH = '| makeresults count=1 | eval time=now() | map search="| cyencesdevicemanager operation="cleanup" products_to_cleanup="Sophos" minindextime=$time$"'
    logger.info("Cleaning up the Sophos devices from Device Inventory, as they were merged wrongly due to similar Mac addresses assigned to the devices")
    response = service.jobs.oneshot(SOPHOS_DEVICES_CLEANUP_SEARCH, output_mode="json", earliest_time='now', latest_time='+1m')
    handle_results(response, logger)
    time.sleep(60)

    SOPHOS_DEVICE_INVENTORY_SEARCH = '| savedsearch "Device Inventory - Sophos"'
    logger.info("Running Device Inventory - Sophos search to add sophos devices to Device Inventory table")
    response = service.jobs.oneshot(SOPHOS_DEVICE_INVENTORY_SEARCH, output_mode="json", earliest_time='-1d@m', latest_time='now')
    handle_results(response, logger)

# Note:
# When the new alerts are introduced, we need to manually check whether the product is enabled for that alert. 
# If product is enabled then, we need to manually enable the alert in the upgrade steps.


version_upgrade = (
    ('3.1.0', None),
    ('4.0.0', upgrade_4_0_0),
    ('4.3.0', upgrade_4_3_0),
    ('4.4.0', None),
    ('4.5.0', upgrade_4_5_0),
)
