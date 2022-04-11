---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 3
has_children: true
---

# Release Notes
This section of the document has all release notes.

## Version 2.0.0 (April 2022)

* ### New Documentation
    * [This](https://vatsaljagani.github.io/Splunk-Cyences-App-for-Splunk) new documentation is created.

* ### New Network Telemetry
    * A new in-app Network traffic map visualization added to enhance the functionality of the network traffic maps.
        * Users can now click on the traffic arrow and drilldown on them to see details about particular traffic.
        * The "Network Reports" and "Asset Intelligence" dashboard now uses the newly added custom visualization "Network Telemetry Map".
        ![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/network_telemetry_map.png?raw=true)
    * Removed the "Top Network Traffic" panel from the "Network Reports" dashboard and added following new panels to show the network traffic in better way.
        * Inbound Network Telemetry
        * Outbound Network Telemetry
        * Internal Traffic

* ### Removed following panels and added link to "Network Reports" dashbaord 
    * Removed "Network Traffic to/from Vulnerable Ports (Detected from Qualys)" and "Network Traffic to/from Vulnerable Ports (Detected from Tenable)" panels from the "Asset Intelligence" dashboard.
    * Removed "Traffic on Vulnerable Ports" panel from the "Qualys" dashboard.
    * Removed "Traffic on Vulnerable Ports" and "All Traffic on All Vulnerable Hosts" panels from the "Tenable" dashboard.

* ### Removed Splunk Admin related items
    * Removed all the Splunk Admin related alerts and dashboards from the App.

* ### Added New Alerts
    * Office 365 Related
        * O365 - Login Failure Due To Multi Factor Authentication
        * O365 - Login Failure Outside Home Country Due To Multi Factor Authentication
        * O365 - Login From Unknown User
        * O365 - Successful Login Outside Home Country
        * O365 - Authentication Blocked By Conditional Access Policy
        * O365 - Daily Login Failure
        * O365 - Security Compliance Alert
    * Office 365 Active Directory
        * O365 - Azure Active Directory - GroupMembership Change/Update
    * Active Directory
        * AD - Password Change Outside Working Hour
    * Palo Alto
        * Palo Alto Firewall - Commits
    * Office 365 Emails
        * Email- Hourly Increase In Emails Over Baseline
        * Email- Daily Spam Email
    * VPN
        * Authentication - Successful VPN Login Outside Home Country
    * Cisco IOS
        * Cisco IOS - New Connection For User
        * Cisco IOS - Device Failed Login



* ### Enhancements
    * Office 365 Dashboard
        * Added new panel "Azure Active Directory - GroupMembership Change/Update" under the "Office 365" dashboard. Also updated dashboard to show the GroupMembership change related details.

    * Antivirus detail in Lansweeper Dashboard
        * Added Active Antivirus detail in the Lansweeper Dashboard.
        * User needs to have x.y.z (TODO) version of Lansweeper Add-on to collect the Antivirus related data.

    * Enhanced search query of "Windows Defender - Windows Defender RealTime Protection Disabled or Failed" alert to reduce the false positives.
        * Changed cron job from every 15 minutes to every hour.

    * Updated "Dynamically Update Blocked IPs with HoneyDB" cron schedule from every 2 hour to every 8 hour to fix the api limit exceed issue.

    * Bruteforce related alerts
        * Added dest fields in the result of bruteforce related all 4 alerts for better forensic investigation.
            * Authentication - Bruteforce Attempt for a User
            * Authentication - Bruteforce Attempt from a Source
            * Authentication - Excessive Failed VPN Logins for a User
            * Authentication - Excessive Failed VPN Logins from a Source

    * Better support for DNS logs
        * Added props/field extraction for the Windows DNS Logs (MSAD:NT6:DNS, isc:bind:query, isc:bind:queryerror sourcetypes)



* ### Bug Fixes and Typos
    * Renamed the "0365 - O365 Service is not Operational" alert to "O365 - O365 Service is not Operational" to fix the type.
        * User will require to reconfigure the new alert.
    
    * Improvement in Office 365 Active Directory related alerts and dashboard. It now shows some of the missing events.

    * Fixed the issues Python commands.
        * Fixed the issues with to handling the empty ip field scenario in device_inventory_gen command.
        * Fixed the issue without time-out issue with Malicious IP upload and download command.

    * Renamed following panel title in the "DNS Tracker" dashboard.
        * Top Non-success Code Queries -> Most Unsuccessful Code Queries
        * Top Non-success Code Requesters -> Most Unsuccessful Code Requesters

    * Renamed following panel title in the "Kaspersky" dashboard.
        * Assets Status in Kaspersky -> Status of Assets
        * Virus Found and Passwd -> Virus Found and Passed
        * Virus Found and Bloacked -> Virus Found and Blocked
        * Application Database out of Date -> Application Database Out of Date

    * Fixed the drilldown issue for Antivirus panel of the Overview dashboard.


## Upgrade Guide from 1.11.0 to 2.0.0

* ### Removed all the Splunk Admin related alerts and dashboards from the App
    * The existing splunk admin related alerts might not work after addon upgrade as all the admin related alerts and dashboard are removed in the v2.0.0

* ### Renamed the "0365 - O365 Service is not Operational" alert to "O365 - O365 Service is not Operational" to fix the type.
    * User will require to reconfigure the new alert.

* ### Antivirus detail in Lansweeper Dashboard
    * Added Active Antivirus detail in the Lansweeper Dashboard.
    * User needs to have x.y.z (TODO) version of Lansweeper Add-on to collect the Antivirus related data.


Docs
----
TODO - Need to check doc for each of these items:
- add/remove/update content
- add/remote/update screenshots

