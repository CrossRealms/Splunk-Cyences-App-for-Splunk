import cs_imports
import time
import json
import cs_utils

import splunklib.client as client
import splunklib.results as results
from splunk import rest


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

    vpn_login_attempt_old_macro_name = "cs_authentication_vpn_login_attemps_outside_working_hour_filter"
    new_alert_name = "Authentication - VPN Login Attempts Outside Working Hours"
    try:
        old_macro_definition = conf_manager.get_macro(vpn_login_attempt_old_macro_name)
        conf_manager.update_savedsearch(new_alert_name, {"action.cyences_notable_event_action.param.filter_macro_value": old_macro_definition})
        logger.info("Macro value (cs_authentication_vpn_login_attempts_outside_working_hour_filter) has been successfully migrated to the renamed macro.")
    except:
        logger.info("Old macro value for (cs_authentication_vpn_login_attemps_outside_working_hour_filter) in the user environment does not exist, skipping the upgrade step.")

    old_macro_name = "cs_o365_failed_login_due_to_mfs_filter"
    new_alert_name = "O365 - Login Failure Due To MFA"
    try:
        old_macro_definition = conf_manager.get_macro(old_macro_name)
        conf_manager.update_savedsearch(new_alert_name, {"action.cyences_notable_event_action.param.filter_macro_value": old_macro_definition})
        logger.info("Macro value (cs_o365_failed_login_due_to_mfa_filter) has been successfully migrated to the renamed macro.")
    except:
        logger.info("Old macro value for (cs_o365_failed_login_due_to_mfs_filter) in the user environment does not exist, skipping the upgrade step.")


    old_macro_name = "cs_o365_failed_login_due_to_mfs_from_unusual_country_filter"
    new_alert_name = "O365 - Login Failure From Unusual Country Due To MFA"
    try:
        old_macro_definition = conf_manager.get_macro(old_macro_name)
        conf_manager.update_savedsearch(new_alert_name, {"action.cyences_notable_event_action.param.filter_macro_value": old_macro_definition})
        logger.info("Macro value (cs_o365_failed_login_due_to_mfa_from_unusual_country_filter) has been successfully migrated to the renamed macro.")
    except:
        logger.info("Old macro value for (cs_o365_failed_login_due_to_mfs_from_unusual_country_filter) in the user environment does not exist, skipping the upgrade step.")


    old_macro_name = "cs_aws_failed_login_due_to_mfs_from_unusual_country_filter"
    new_alert_name = "AWS - Login Failure From Unusual Country Due To MFA"
    try:
        old_macro_definition = conf_manager.get_macro(old_macro_name)
        conf_manager.update_savedsearch(new_alert_name, {"action.cyences_notable_event_action.param.filter_macro_value": old_macro_definition})
        logger.info("Macro value (cs_aws_failed_login_due_to_mfa_from_unusual_country_filter) has been successfully migrated to the renamed macro.")
    except:
        logger.info("Old macro value for (cs_aws_failed_login_due_to_mfs_from_unusual_country_filter) in the user environment does not exist, skipping the upgrade step.")


    try:
        enabled_product = conf_manager.get_conf_stanza("cs_configurations", "product_config")[0]["content"].get("enabled_products")
        product = enabled_product.split(",")[0].strip()

        if product:
            payload = {
                "product": product,
                "enabled": 0,
            }
            rest.simpleRequest(
                "/servicesNS/nobody/{}/CyencesProductConfiguration/product_config?output_mode=json".format(
                    cs_utils.APP_NAME),
                postargs={"data": json.dumps(payload)},
                method="POST",
                sessionKey=session_key,
                raiseAllErrors=True,
            )

            logger.info("Disabled the product={}".format(product))

            time.sleep(10)

            payload = {
                "product": product,
                "enabled": 1,
            }

            rest.simpleRequest(
                "/servicesNS/nobody/{}/CyencesProductConfiguration/product_config?output_mode=json".format(
                    cs_utils.APP_NAME
                ),
                postargs={"data": json.dumps(payload)},
                method="POST",
                sessionKey=session_key,
                raiseAllErrors=True,
            )

            logger.info("Re-enabled the product={}".format(product))
    except Exception as e:
        logger.error("Error while product={} enable/disable. Please manually disable/enable the product on Cyences App Configuration > Product Setup page. error={}".format(product, str(e)))

    # Renamed the following alerts and it might be present in apps/cyences_app_for_splunk/local/savedsearches.conf, which would constantly generate errors or run searches in all times etc. To avoid this we are disabling all these alerts if they present in the local folder.
    alerts_to_disable = [
        "CrowdStrike - Suspicious Activity or Malware Detected by CrowdStrike",
        "Defender ATP - Defender ATP Alerts",
        "Sophos Endpoint Protection - Endpoint Not Protected by Sophos Endpoint Protection",
        "Sophos Endpoint Protection - Sophos Endpoint RealTime Protection Disabled",
        "Sophos Endpoint Protection - Sophos Endpoint Protection Service is not Running",
        "Sophos Endpoint Protection - Failed to CleanUp Threat by Sophos Endpoint Protection",
        "Sophos Endpoint Protection - Failed to CleanUp Potentially Unwanted Application by Sophos",
        "Windows Defender - Endpoint Not Protected by Windows Defender",
        "Windows Defender - Windows Defender RealTime Protection Disabled or Failed",
        "AWS - IAM AccessKey Creation or Deletion",
        "AWS - IAM Login Profile Change/Update",
        "AWS - IAM User Creation or Deletion",
        "AWS - IAM Policy Creation or Deletion",
        "AWS - IAM Group Change/Update",
        "AWS - IAM Group Membership Change/Update",
        "AWS - IAM Role Creation or Deletion",
        "AWS - Network Access Control List Creation or Deletion",
        "AWS - Multi Factor Authentication is Disabled for IAM User",
        "AWS - Login Failure From Unusual Country Due To Multi Factor Authentication",
        "Google Workspace - User Change/Update",
        "Google Workspace - Enterprise Group Change/Update",
        "Google Workspace - Enterprise Group Membership Change/Update",
        "Google Workspace - Role Change/Update",
        "Google Workspace - Multiple Password Changes in Short Time Period",
        "O365 - Login Failure Due To Multi Factor Authentication",
        "O365 - Login Failure From Unusual Country Due To Multi Factor Authentication",
        "O365 - DLP event in Exchange",
        "O365 - DLP event in SharePoint",
        "O365 - O365 Service is not Operational",
        "O365 - Azure Active Directory - AuthorizationPolicy Change/Update",
        "O365 - Azure Active Directory - Policy Change/Update",
        "O365 - Azure Active Directory - Role Change/Update",
        "O365 - Azure Active Directory - Group Change/Update",
        "O365 - Azure Active Directory - GroupMembership Change/Update",
        "O365 - Azure Active Directory - User Change/Update",
        "O365 - Azure Active Directory - ServicePrincipal Change/Update",
        "O365 - Azure Active Directory - Application Change/Update",
        "Email - Calculate UpperBound for Spike In Emails",
        "Email - Hourly Increase In Emails Over Baseline",
        "Email - Daily Spam Email",
        "Network Compromise - Calculate UpperBound for Spike in Network Traffic",
        "Network Compromise - Calculate UpperBound for Spike in Outbound Network Traffic",
        "Network Compromise - DDoS Behavior Detected",
        "Network Compromise - Unusual Outbound Traffic",
        "Network Compromise - Basic Scanning",
        "Network Compromise - Inbound Vulnerable Traffic",
        "Fortigate Firewall - Network Compromise - Fortigate DNS Sinkhole",
        "Fortigate Firewall - Network Compromise - Fortigate High Threats Alert",
        "Fortigate Firewall - Network Compromise - Fortigate High System Alert",
        "Palo Alto Firewall - Network Compromise - Palo Alto DNS Sinkhole",
        "Palo Alto Firewall - Network Compromise - Palo Alto High Threats Alert",
        "Palo Alto Firewall - Network Compromise - Palo Alto High System Alert",
        "Palo Alto Firewall - Network Compromise - Palo Alto WildFire Alert",
        "Palo Alto Firewall - Network Compromise - DDoS Attack Prevented",
        "Palo Alto Firewall - Network Compromise - Inbound Traffic from Blocked IPs",
        "Palo Alto Firewall - Network Compromise - Outbound Traffic to Blocked IPs",
        "Palo Alto Firewall - Commits",
        "Dynamically Update Blocked IPs with HoneyDB",
        "Palo Alto Firewall - Malicious IP List Gen",
        "Sophos Firewall - Firewall Lost Connection to Sophos Central",
        "Sophos Firewall - Firewall VPN Tunnel Down",
        "Sophos Firewall - Firewall Gateway Down",
        "Vulnerability - Detected Vulnerabilities",
        "Windows - Hosts Missing Update",
        "Windows - Endpoint Compromise - Windows Firewall Disabled Event",
        "Windows - Windows Process Tampering Detected",
        "Windows - Windows Firewall is Disabled",
        "AD - Group Changed",
        "AD - Group Membership Changed",
        "AD - Group Policy Changed",
        "AD - User Changed",
        "AD - Password Change Outside Working Hour",
        "AD - Multiple Password Changes in Short Time Period",
        "Ransomware - Endpoint Compromise - Fake Windows Processes",
        "Ransomware - Endpoint Compromise - Network Compromise - TOR Traffic",
        "Ransomware - Scheduled tasks used in BadRabbit ransomware",
        "Ransomware - Endpoint Compromise - USN Journal Deletion on Windows",
        "Ransomware - Windows - Windows Event Log Cleared",
        "Ransomware - Endpoint Compromise - Windows - WMI Lateral Movement",
        "Credential Compromise - Windows - Credential Dumping through LSASS Access",
        "Credential Compromise - Windows - Credential Dumping via Symlink to Shadow Copy",
        "Credential Compromise - Windows - Credential Dumping via Copy Command from Shadow Copy",
        "Credential Compromise - Windows - Credential Dump From Registry via Reg exe",
        "Authentication - VPN Login Attemps Outside Working Hours",
        "Linux - User Added/Updated/Deleted",
        "Linux - Group Added/Updated/Deleted"
    ]

    for alert in alerts_to_disable:
        try:
            conf_manager.update_savedsearch(alert, {"disabled": 1})
        except Exception as e:
            logger.info("Not able to disable the alert={} error={}".format(alert, str(e)))


# Note:
# When the new alerts are introduced, we need to manually check whether the product is enabled for that alert.
# If product is enabled then, we need to manually enable the alert in the upgrade steps.


version_upgrade = (
    ("3.1.0", None),
    ("4.0.0", upgrade_4_0_0),
    ("4.3.0", upgrade_4_3_0),
    ("4.4.0", None),
    ("4.5.0", upgrade_4_5_0),
    ("4.8.0", upgrade_4_8_0),
    ("4.9.0", upgrade_4_9_0),
    ("5.0.0", upgrade_5_0_0),
)
