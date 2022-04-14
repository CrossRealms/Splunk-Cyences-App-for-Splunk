---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 3
has_children: true
---

# Release Notes

## Version 2.0.0 (April 2022)

* ### New Documentation Location
    * The new location for the documentation can be found here: [This](https://vatsaljagani.github.io/Splunk-Cyences-App-for-Splunk).

* ### New Network Telemetry
    * Network traffic map visualizations have been added to enhance the functionality of the network traffic maps.
        * Users can now click on the network traffic arrow itself, which will result in a drilldown showing the details relevant to that traffic.
        * The `Network Reports` and `Asset Intelligence` dashboards are now utilising the newly added custom visualizations from the `Network Telemetry Map`.
        ![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/network_telemetry_map.png?raw=true)

    * Removed the `Top Network Traffic` dashboard panel from the `Network Reports` dashboard.
        * The network traffic display has been enhanced by adding the following new dashboard panels:
            * Inbound Network Telemetry
            * Outbound Network Telemetry
            * Internal Traffic

    * Added a link to the `Qualys` dashboard.
        * The link redirects users to the `Network` dashboard which offers additional insight about network telemetry for a specified device.  
    
    * Removed the following dashboard panels from various dashboards:
        * Removed the `Network Traffic to/from Vulnerable Ports (Detected from Qualys)` and `Network Traffic to/from Vulnerable Ports (Detected from Tenable)` dashboard panels from the `Asset Intelligence` dashboard.
        * Removed the `Traffic on Vulnerable Ports` dashboard panel from the `Qualys` dashboard.
        * Removed the `Traffic on Vulnerable Ports` and `All Traffic on All Vulnerable Hosts` dashboard panels from the `Tenable` dashboard.

* ### Removed Splunk Admin related alerts and dashboards
    * Removed all of the Splunk Admin related alerts and dashboards from the Cyences app.
    * Contact CrossRealms' support team to get the enhanced Admin Dashboards and Alerts.
        * Email: info@crossrealms.com / support@crossrealms.com

* ### Added New Alerts
    * Active Directory
        * AD - Password Change Outside Working Hour
    * Cisco IOS
        * Cisco IOS - New Connection For User
        * Cisco IOS - Device Failed Login
    * Office 365:
        * O365 - Authentication Blocked By Conditional Access Policy
        * O365 - Daily Login Failure
        * O365 - Login Failure Due To Multi Factor Authentication
        * O365 - Login Failure Outside Home Country Due To Multi Factor Authentication
        * O365 - Login From Unknown User
        * O365 - Security Compliance Alert
        * O365 - Successful Login Outside Home Country
    * Office 365 Active Directory
        * O365 - Azure Active Directory - GroupMembership Change/Update
    * Office 365 Emails
        * Email- Hourly Increase In Emails Over Baseline
        * Email- Daily Spam Email
    * Palo Alto
        * Palo Alto Firewall - Commits
    * VPN
        * Authentication - Successful VPN Login Outside Home Country



* ### Enhancements
    * Office 365 Dashboard
        * Added a new alert and dashboard panel called `Azure Active Directory - GroupMembership Change/Update`.

    * Antivirus details have been added to the Lansweeper Dashboard.
        * Added an `active_antivirus` column to multiple dashboard panels.
        * Users needs to have version 1.3.0 of the Lansweeper Add-on to collect the Antivirus related data.

    * Updated the following Antivirus releated alerts to reduce the number of false positives using Lansweeper's asset data. The updated alerts will filter the host if it has any other antivirus enabled on it.
        * Sophos - Endpoint Not Protected by Sophos
        * Sophos - Sophos Service is not Running
        * Windows Defender - Windows Defender RealTime Protection Disabled or Failed

    * Enhanced the search query for the `Windows Defender - Windows Defender RealTime Protection Disabled or Failed` alert to reduce the number of false positives.
        * Changed the default cron job from every 15 minutes to every hour.

    * Bruteforce alerts
        * Added the dest field to the results of the following bruteforce related alerts for a more thorough forensic investigation:
            * Authentication - Bruteforce Attempt for a User
            * Authentication - Bruteforce Attempt from a Source
            * Authentication - Excessive Failed VPN Logins for a User
            * Authentication - Excessive Failed VPN Logins from a Source

    * Better support for DNS logs
        * Added props and field extractions for Windows DNS Logs (MSAD:NT6:DNS, isc:bind:query, & isc:bind:queryerror sourcetypes).



* ### Bug Fixes and Typos
    * Renamed the `0365 - O365 Service is not Operational` alert to `O365 - O365 Service is not Operational` since there was an accidental typo present.
        * Users will be required to reconfigure the new alert.
    
    * Improvements to Office 365 Active Directory related alerts and dashboards. It now displays some of the missing events.

    * Fixed some issues with Python commands.
        * Fixed an issue when handling an empty ip field for the device_inventory_gen command.
        * Fixed a time-out issue with Malicious IP upload and download commands.

    * Renamed the following dashboard panel titles in the `DNS Tracker` dashboard:
        * Top Non-success Code Queries -> Most Unsuccessful Code Queries.
        * Top Non-success Code Requesters -> Most Unsuccessful Code Requesters.

    * Renamed the following dashboard panel titles in the `Kaspersky` dashboard.
        * Assets Status in Kaspersky -> Status of Assets.
        * Virus Found and Passwd -> Virus Found and Passed.
        * Virus Found and Bloacked -> Virus Found and Blocked.
        * Application Database out of Date -> Application Database Out of Date.

    * Fixed a drilldown issue for the Antivirus dashboard panel in the Overview dashboard.


## Upgrade Guide from 1.11.0 to 2.0.0

* ### Removed Splunk Admin related alerts and dashboards
    * The pre-existing Splunk Admin related alerts will not work after upgrading the app.
    * Contact CrossRealms' support team to get the enhanced Admin Dashboards and Alerts.
        * Email: info@crossrealms.com / support@crossrealms.com

* ### Lansweeper Add-on Version 1.3.0
    * Users need to have version 1.3.0 of the Lansweeper Add-on to collect antivirus related data.

* ### The `O365 - O365 Service is not Operational` alert needs to be reconfigured.
    * Users will be required to reconfigure the new alert as it has been renamed.