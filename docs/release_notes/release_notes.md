---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 5
has_children: true
---

# Release Notes


## Version 4.8.0 (May 2024)

* ### Cisco Meraki
    * Added new alerts:
        * Cisco Meraki - Organizational Security Events
        * Cisco Meraki - Config Changes
    * Added new dashboard named **Cisco Meraki**

* ### Databases
    * #### MSSQL
        * Added new alert named **MSSQL - User Changes**
        * Added new dashboard named **MSSQL**
    * #### Oracle
        * Added new alert named **Oracle - User Changes**
        * Added new dashboard named **Oracle**

* Added Tenable SC support along with Tenable IO.

* Added new report/alert:
    * Network Compromise - Calculate UpperBound for Spike in Outbound Network Traffic
    * Network Compromise - Unusual Outbound Traffic


* ### Enhancements

    * #### App UI Changes
        * Enhanced the view, style and color contrast for the inputs like multiselect, dropdown, textbox and checkbox.
        * Enhanced the navigation panel view on the Overview dashboard.
        * Enhanced the Label fonts and Table headers.
        * Drilldown text's color changes when hovered over.
        * Synced the color combination across all dashboards.

    * #### CrowdStrike Devices
        * **Device Inventory - CrowdStrike** search is now using [CrowdStrike Falcon Devices Technical Add-On](https://splunkbase.splunk.com/app/5570) to get detailed information of crowdstrike devices.
        * Made crowdstrike devices related changes to **Device Inventory** and **Intelligence** dashboard.
    
    * Removed internal IPs from **Network Compromise - DDoS Behavior Detected** alert.

    * For Office 365 login related alerts, excluded the events having field value user="not available".

    * Updated Splunk-python-sdk to the latest version.

    * For **O365 - Login Failure From Unusual Country Due To Multi Factor Authentication** alert, the severity was reduced for new users who attempted to login the first time.


* ### Bug Fixes

    * Fixed the dashboard show/hide issue for the fortigate.

    * For **Cyences Digest Email** alert, fixed the field display issue which has dot(.) in the field name.

    * Fixed the current week login count logic for VPN login related alerts.


## Upgrade Guide from 4.7.0 to 4.8.0

* To collect the crowdstrike devices information, install and configure the [CrowdStrike Falcon Devices Technical Add-On](https://splunkbase.splunk.com/app/5570).