---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 5
has_children: true
---

# Release Notes


## Version 5.0.0 (October 2024)

* ### Alert Categorization
    * Categorized the alerts into SOC and Compliance teams.
    * Added **Team** filter on Overview dashboard.
    * Added team configuration for SOC and Compliance teams under **Cyences Settings > Cyences App Configuration > Cyences Alerts Configuration** section.
    * Updated the alerting logic (for regular and digest alerts) based on the teams.

* ### BlockShield Integration
    <!-- TODO - Add detailed info on this section. -->
    * Removed everything related to honeyDB, blocked IPs.

* ### F5 BIGIP
    * Added new dashboard named **F5 BIGIP ASM**.
    * Added new alert named **F5 BIGIP - Not Blocked Attacks**.

* Added new alerts for the **Sophos Firewall**:
    * Sophos Firewall - Lost Connection to Sophos Central
    * Sophos Firewall - VPN Tunnel Down
    * Sophos Firewall - Gateway Down
    * Sophos Firewall - Advanced Threat Detected

* Added new alerts for **MSSQL** Database and **Oracle** Database:
    * MSSQL - Database Changes
    * MSSQL - Role Changes
    * Oracle - Database Changes
    * Oracle - Role Changes

* Added new alerts for the **Defender ATP**:
    * Defender ATP - System is Offboarded
    * Defender ATP - System is not Connected since a Week

* Added new alert for the **Office 365**:
    * O365 - Risky Login Detected by Microsoft

* Added "Object Type" and "Object Name" filter on **MSSQL** and **Oracle** dashboards.

* Removed the following deprecated alerts:
    * O365 - Login Failure Outside Home Country Due To Multi Factor Authentication
    * O365 - Successful Login Outside Home Country
    * Authentication - Successful VPN Login Outside Home Country
    * Linux - Change in Sudo Access of Local Linux Account

* Removed **Google Workspace - Suspicious File Shared by External User on Google Drive** alert and related panel from **Google Workspace** dashboard as it contains static lookup causing many false positives.

* Removed the [Splunk Add-on for RWI - Executive Dashboard](https://splunkbase.splunk.com/app/5063/) app dependency.


* ### Enhancements

    * #### Cyences App Configuration UI changes
        * Added **Cyences Dependencies** section to show the dependent app installation status, enable/disable status along with splunk base link.
        * Added **App Dependecies** table for each product present under **Products Setup** section.

    * #### Cyences Alert Name Changes
        <!-- TODO - add list of alerts and other details. -->

    * Added option to exclude informational vulnerability by default from the **Vulnerability** dashboard.

    * Enhanced the **Vulnerability - Detected Vulnerabilities** alert to detect new vulnerabilities in case of delayed ingestion of events.

    * Updated the **Network Compromise - Unusual Outbound Traffic** alert logic of traffic calculation for each source instead of entire network.

    * Removed failed authentication user related events and unnecessary sourcetypes from the **User Inventory - Lookup Gen** search.

    * Enhanced the "Data Availability" panel present on each dashboard by generalizing the panel search.

    * Moved the splunk python sdk to the **lib** folder for better folder structure.

    * Added **All Windows Update Events** panel to the **Window Patch** dashboard.


* ### Bug Fixes

    * Fixed the display issue of failure action for the Radius Authentication logs.

    * For **Forensics** and **SOC** dashboards, fixed the field display issue which has dot(.) in the field name.

    * Fixed the informational severity typo for the nessus:pro:vuln sourcetype.

    * Fixed the typo in the macro name from **cs_authentication_vpn_login_attemps_outside_working_hour_filter** to **cs_authentication_vpn_login_attempts_outside_working_hour_filter**

<!-- TODO - we might need to check this before release and discuss and possibly remove it. -->
* ### For Splunk Admins

    * Removed the following other app dependent macros and defined related macro in app itself:
        * Added **cs_drop_dm_object_name** macro to replace the **drop_dm_object_name** macro.
        * Removed **cim_Authentication_indexes** macro and used the **cs_authentication_indexes** macro.
        * Renamed the macro **cs_cim_assets_indexes** to **cs_assets_indexes**.
        * Renamed the macro **cs_cim_vulnerabilities_indexes** to **cs_vulnerabilities_indexes**.


## Upgrade Guide from 4.9.0 to 5.0.0

* After upgrade, only SOC related alerts will be received to existing configured critical emails. To make more changes, configure the SOC and Compliance teams related configs under **Cyences Settings > Cyences App Configuration > Cyences Alerts Configuration** section.

* In order to use the sophos firewall alerts, onboard the **sophos_events** data from [Sophos Central Addon for Splunk](https://splunkbase.splunk.com/app/6186/). For more details, refer [Sophos Firewall Data Onboarding]({{ site.baseurl }}/data_onboarding/network_devices/sophos_firewall)

**NOTE:** Please go through every section of the **Cyences Settings > Cyences App Configuration** page to ensure it is configured according to how the user wants the app to behave.
