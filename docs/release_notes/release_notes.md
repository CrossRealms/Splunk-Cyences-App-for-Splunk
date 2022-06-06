---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 3
has_children: true
---

# Release Notes

## Version 2.2.0 (June 2022)


* ### New Windows Dashboard 
    * Added `Windows Patch` dashboard to monitor for Windows update related events.

* ### Added New Alerts

   * Active Directory
      * `AD - Multiple Password Changes in Short Time Period` 
      * `AD - Bulk User Creation or Deletion` 
           
   * G Suite
      * `G Suite - Multiple Password Changes in Short Time Period` 
      * `G Suite - Bulk User Creation or Deletion` alert to find bulk user creation or deletion.

* ### Enhancements 

* Active Directory 
    * Made improvements to the `AD - Password Change Outside Working Hour` alert and dashboard panel to display additional fields.

* G Suite
    * Added `User Created` and `User Deleted` dashboard panels to the G Suite dashboard.

* Linux/Unix 
    * Added the time field for both the `Success Login by Host, Users` and `Failed Login by Host, Users` dashboard panels in the `Linux/Unix` dashboard
    * Removed the `Open Ports` dashboard panel as the `Listening Ports on Host` dashboard panel provides the same information with additional fields.

* Network Reports   
    * Added drilldown to the `Port Scanning Attempts` map.

* Office 365
    * Updated the alerts and dashboard to use the new `o365:service:healthIssue` sourcetype (`o365:service:status` sourcetype has been retired by the Add-on).
    * Added `Login by location` map to the `Office 365` dashboard.
    * Added `authentication_method` and `user_type` fields for O365 login related alerts and dashboard panels.

* Ransomware Alerts
    * Enhanced filters for paths to reduce false positives for both `Ransomware - Calculate UpperBound for Spike in File Writes` and `Ransomware - Spike in File Writes`.

* VPN 
    * Added `Successful Session` dashboard panel.
    * Added drilldown to the `Connected Workforce by Location` map.

* Windows Reports 
    * Added `Listening Ports on Host` dashboard panel to the `Windows Reports` dashboard. For data collection, users need to enable the `win_listening_ports` scripted input.


* ### Bug Fixes
    * Fixed a drilldown issue for the `Login Details` dashboard panel in the `VPN` dashboard.

    * Fixed the source value in the `cs_sysmon macro` macro.


## Upgrade Guide from 2.1.0 to 2.2.0

* Users need to enable the `win_listening_ports` scripted input from the Splunk Add-on for Windows to populate the `Listening Ports on Host` dashboard panel in the `Windows Reports` dashboard.

* The `openPorts.sh` scripted input is no longer reqired for the Cyences App. Users can disable the input from Splunk Add-on for Linux and Unix.
