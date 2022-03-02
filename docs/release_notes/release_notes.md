---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 3
has_children: true
---

# Release Notes
This section of the document has all release notes.

## Version 1.11.0 (January 2022)

* ### Added Kaspersky dashboard
    * Added the required field extractions. 
    * Added support for Kaspersky in the Device Inventory and Asset Intelligence dashboards.

    ![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/kaspersky.png?raw=true)

    ![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/kaspersky_part_two.png?raw=true)

    * Added support for Kaspersky in the Device Inventory and Asset Intelligence dashboards.

    ![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/kaspersky_part_three.png?raw=true)

* ### DNS dashboard 
    * Added DNS Tracker dashboard for the following use-cases: Top Categories, Record Types, DNS Log Volume over Time, Record Types over Time, Top queries, Top Non-success Code Queries, Top Requesters, and Top Non-success queries Code Requesters.

    ![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/dns_tracker.png?raw=true)

    ![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/dns_tracker_continued.png?raw=true)

* ### Microsoft Defender ATP Alert
    * Added a security alert for Office 365 Advanced Threat Protection.

    ![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/defender_atp_alert.png?raw=true)

* ### VPN Dashboard
    * Added support for Cisco VPN (logs from Cisco ISE and Estreamer are supported). 
    * Changed the field name from field dest to dest_category="vpn_auth" for better CIM compatibility. 

        * This field is being used to display the correct count of VPN logins.

* ### Enhancements:
    * Splunk Admin - Missing Indexes Alert
        * Improved the performance of the query.
    * Splunk Admin Dashboard - Missing Indexes Table 
        * Reduced the loading time of the search query after performing a drilldown.
    * Windows Defender Event Logs
        * Added support for logs coming from Windows 10 hosts (resolved field extraction related issues). 
    * Decommission Hosts from Lookups 
        * Added dashboard panels to remove the decommissioned hosts from the Windows hosts lookup, as well as the Linux hosts lookup.
            * This is required to avoid false positive alerts. 

    ![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/decommission_host_from_lookups.png?raw=true)

## Upgrade Guide from Version 1.10.0 to 1.11.0

* The Cyences App now supports Kaspersky. Refer to the **Data Onboarding > Kaspersky Logs** section for more information regarding the data collection process. 
* The VPN dashboard now supports [Cisco ISE](https://splunkbase.splunk.com/app/1915/) and [Estreamer](https://splunkbase.splunk.com/app/3662/) data to show authentication activities from VPN. 
* Cyences has a new dashboard called **DNS Tracker**. It supports all types of DNS related data that are compatible with the CIM data model. For example, the [Cisco Umbrella Add-on](https://splunkbase.splunk.com/app/3926/).
