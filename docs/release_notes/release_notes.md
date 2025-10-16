---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 5
has_children: true
---

# Release Notes

## Version 5.4.0 (October 2025)

* ### New Integration for Forcepoint DLP
    * #### Alerts
        * Forcepoint DLP - Blocked Events
    * #### Dashboard Panels
        * DLP events over Time
        * DLP events by Action
        * DLP events by User
        * Forcepoint DLP Events

* ### Added new alerts for Windows
    * #### Alerts
        * Windows - Multiple Failed Logins by User

* ### Added new alerts for Windows AD
    * #### Alerts
        * AD - User Account Disabled 

* ### Added new alerts for Authentication
    * #### Alerts
        * Authentication - Bruteforce Attempt for the Destination
        * Authentication - Excessive Failed VPN Logins for the Destination

* Added `User Inventory` configuration page.
* Added `Sophos` VPN event support.
* Added `pfSense OpenVPN` event support.
* Added support of `AIX` servers to collect data from it.

* ### Enhancements
    * Added `cs_basic_network_scanning_threshold` to configure the threshold value for each host to visit different destination IPs and ports in an hour.
    * Changes in `cyences_severity` for following alerts:
        * Basic Netowrk Scanning
        * Fortigate - High Threats Alert 
        * Palo Alto - High Threats Alert
        * CrowdStrike - Suspicious Activity or Malware Detected
    * Updated frequency of following alerts:
        * Defender ATP - Alerts : from every hour to every 15 minutes.
    * Enahancement in `O365 - Successful Login From Unusual Country` alert query to filter out successful login events if access is already blocked by Conditional access policies.
    * Updated `ms_obj_user_change_out` macro to include `Target_Account_Name` field.

* ### Bug fixes
    * Fixed the oracle dashboard field issue to populate the dropdown filters.
    * Fixed `Kaspersky Critical Host Found` panel timerange issue of Kaspersky dashboard to populate the panel according to selected timerange.
    * To avoid taking "NA" group into cosideration for `AD - Group Membership Changed` panel, excluded "NA" group from events.
    * Updated User Inventory dashboard to exclude invalid users for `Proofpoint Inc`.


## Upgrade Guide from 5.3.0 to 5.4.0

* Onboard Forcepoint DLP logs to utilize the related alerts. For more details, refer to [Forcepoint DLP Data Onboarding]({{ site.baseurl }}/data_onboarding/antivirus_antimalware/forcepoint_dlp)
* Migrate to new cisco app [Cisco Security Cloud](https://splunkbase.splunk.com/app/7404) in order to collect DUO data as older app [Duo Splunk Connector](https://splunkbase.splunk.com/app/3504) is deprecated.