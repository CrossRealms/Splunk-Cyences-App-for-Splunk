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

    SOPHOS_DEVICE_INVENTORY_SEARCH = '| cyencesinventorybackfill search_prefix="Device Inventory - Sophos Endpoint Protection" earliest_time="-1d@m" latest_time="now"'
    logger.info("Running Device Inventory - Sophos search to add sophos devices to Device Inventory table")
    response = service.jobs.oneshot(SOPHOS_DEVICE_INVENTORY_SEARCH, output_mode="json", earliest_time='-1d@m', latest_time='now')
    handle_results(response, logger)
    time.sleep(60)

    SOPHOS_USERS_CLEANUP_SEARCH = '| makeresults count=1 | eval time=now() | map search="| cyencesusermanager operation="cleanup" products_to_cleanup="Sophos" minindextime=$time$"'
    logger.info("Cleaning up the sophos users from User Inventory, as the product name is changing from sophos to sophos endpoint protection")
    response = service.jobs.oneshot(SOPHOS_USERS_CLEANUP_SEARCH, output_mode="json", earliest_time='now', latest_time='+1m')
    handle_results(response, logger)
    time.sleep(60)

    USER_INVENTORY_LOOKUP_GEN_SEARCH = '| savedsearch "User Inventory - Lookup Gen"'
    logger.info("Running User Inventory - Lookup Gen search to add sophos endpoint protection users to User Inventory table")
    response = service.jobs.oneshot(USER_INVENTORY_LOOKUP_GEN_SEARCH, output_mode="json", earliest_time='now', latest_time='+1m')
    handle_results(response, logger)


def upgrade_4_8_0(session_key, logger):
    service = client.connect(token=session_key, app=cs_utils.APP_NAME)

    CROWDSTRIKE_DEVICES_CLEANUP_SEARCH = '| makeresults count=1 | eval time=now() | map search="| cyencesdevicemanager operation="cleanup" products_to_cleanup="CrowdStrike" minindextime=$time$"'
    logger.info("Cleaning up the old Crowdstrike devices, As the new sourcetype is giving actual asset information")
    response = service.jobs.oneshot(CROWDSTRIKE_DEVICES_CLEANUP_SEARCH, output_mode="json", earliest_time='now', latest_time='+1m')
    handle_results(response, logger)
    time.sleep(60)

    CROWDSTRIKE_USERS_CLEANUP_SEARCH = '| makeresults count=1 | eval time=now() | map search="| cyencesusermanager operation="cleanup" products_to_cleanup="CrowdStrike" minindextime=$time$"'
    logger.info("Cleaning up the old Crowdstrike users, As the new sourcetype is giving actual asset information")
    response = service.jobs.oneshot(CROWDSTRIKE_USERS_CLEANUP_SEARCH, output_mode="json", earliest_time='now', latest_time='+1m')
    handle_results(response, logger)
    time.sleep(60)


def upgrade_4_9_0(session_key, logger):
    service = client.connect(token=session_key, app=cs_utils.APP_NAME)

    SPLUNK_DEVICES_CLEANUP_SEARCH = '| makeresults count=1 | eval time=now() | map search="| cyencesdevicemanager operation="cleanup" products_to_cleanup="Splunk Internal" minindextime=$time$"'
    logger.info("Cleaning up the Splunk devices from the device inventory due to field names changes")
    response = service.jobs.oneshot(SPLUNK_DEVICES_CLEANUP_SEARCH, output_mode="json", earliest_time='now', latest_time='+1m')
    handle_results(response, logger)


def upgrade_5_0_0(session_key, logger):
    conf_manager = cs_utils.ConfigHandler(logger, session_key)
    default_emails = conf_manager.get_conf_stanza('alert_actions', 'cyences_send_email_action')[0]["content"]["param.email_to_default"]

    SOC_EMAIL_CONFIG_MACRO = 'cs_soc_email'
    conf_manager.update_macro(SOC_EMAIL_CONFIG_MACRO, {"definition": default_emails})
    logger.info("Updated the {} macro with the default emails configured for the cyences_send_email_action.".format(SOC_EMAIL_CONFIG_MACRO))


# Note:
# When the new alerts are introduced, we need to manually check whether the product is enabled for that alert. 
# If product is enabled then, we need to manually enable the alert in the upgrade steps.


version_upgrade = (
    ('3.1.0', None),
    ('4.0.0', upgrade_4_0_0),
    ('4.3.0', upgrade_4_3_0),
    ('4.4.0', None),
    ('4.5.0', upgrade_4_5_0),
    ('4.8.0', upgrade_4_8_0),
    ('4.9.0', upgrade_4_9_0),
    ('5.0.0', upgrade_5_0_0),
)
