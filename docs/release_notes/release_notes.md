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

* ### Renamed the "0365 - O365 Service is not Operational" alert to "O365 - O365 Service is not Operational" to fix the type.
    * User will require to reconfigure the new alert. 

* ### Fixed type in "cs_o365_categories.csv" lookup and Removed the incorrect filter from the macro "cs_o365_managementactivity_change(1)"

* ### Added new panel "Azure Active Directory - GroupMembership Change/Update" under the "Office 365" dashboard. Also updated dashbaord to show the GroupMembership change related details

* ### Added props/field extraction for the Windows DNS Logs (MSAD:NT6:DNS, isc:bind:query, isc:bind:queryerror sourcetypes) 

* ### Enhaced search query of "Windows Defender - Windows Defender RealTime Protection Disabled or Failed" alert and changed cron job from every 15 minutes to every hour

* ### Added dest fields in the result of bruteforce related all 4 alerts.
    * Authentication - Bruteforce Attempt for a User
    * Authentication - Bruteforce Attempt from a Source
    * Authentication - Excessive Failed VPN Logins for a User
    * Authentication - Excessive Failed VPN Logins from a Source

* ### Added Antivirus Status to Lansweeper Dashboard

* ### Added following new alerts. (by default they are disabled)
    | Alert Name | Cron Schedule |
    |------------|---------------|
    | O365 - Login Failure Due To Multi Factor Authentication | Runs every hour |
    | O365 - Login Failure Outside Home Country Due To Multi Factor Authentication | Runs every 30 minute |
    | O365 - Login From Unknown User | Runs every 30 minute |
    | O365 - Successful Login Outside Home Country | Runs every 30 minute |
    | O365 - Authentication Blocked By Conditional Access Policy | Runs every hour |
    | O365 - Daily Login Failure | Runs every day |
    | AD - Password Change Outside Working Hour | Runs every day |
    | Palo Alto Firewall - Commits | Runs every 15 minutes |
    | O365 - Security Compliance Alert | Runs every hour | 
    | Email- Hourly Increase In Emails Over Baseline | Runs evert hour |
    | Email- Daily Spam Email | Runs every day |
    | Authentication - Successful VPN Login Outside Home Country | Runs every hour |
    | Cisco IOS - New Connection For User | Runs every 30 minute |
    | Cisco IOS - Device Failed Login | Runs every 30 minute |
    | O365 - Azure Active Directory - GroupMembership Change/Update | Runs every 30 minute | 


* ### The "Network Reports" and "Asset Intelligence" dashboard now uses the newly added custom vizualization "Network Telemetry Map" which has support for drilldown functionality to show the actual traffic details in the table format 

    ![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/network_telemetry_map.png?raw=true)

* ### Removed the Splunk Admin related alerts and dashboards from the Cyences app

* ### Fixed the device_inventory_gen command to handle the empy ip scenario

* ### Updated "Dynamically Update Blocked IPs with HoneyDB" cronscedule from every 2 hour to every 8 hour to fix the api limit exceed issue.

