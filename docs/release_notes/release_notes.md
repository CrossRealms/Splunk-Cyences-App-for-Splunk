---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 3
has_children: true
---

# Release Notes

## Version 2.2.0 (Jun 2022)


* ### New dashboard `Windows Patch` for the windows update events.

* ### VPN dashboard improvement
    * Added `Successful Session` panel.
    * Added drilldown on `Connected Workforce by Location` map

* ### Ransomware alert improvement
    * Enhanced filters for paths to reduce false positives for both report `Ransomware - Calculate UpperBound for Spike in File Writes` and alert `Ransomware - Spike in File Writes`.

* ### Network Reports dashboard improvement 
    * Added drilldown for `Port Scanning Attempts` map in `Network Reports` dashboard

* ### Linux/Unix dashboard improvement
    * Added time field in the `Success Login by Host, Users` and `Failed Login by Host, Users` panels in the `Linux/Unix` dashboard
    * Removed the `Open Ports` panel as `Listening Ports on Host` panel provides same details with more fields.

* ### Windows Reports dashboard improvement
    * Added `Listening Ports on Host` panel in the `Windows Reports` dashboard. For the data collection, User need to enable the `win_listening_ports` scripted input.

* ### Office 365 alert and dashboard improvement
    * Updated the alerts and dashboard to use the new `o365:service:healthIssue` sourcetype (as the `o365:service:status` sourcetype is retired by the Add-on)
    * Added `Login by location` map in the `Office 365` dashboard.
    * Added `authentication_method` and `user_type` fields in the o365 login related alerts and panels.

* ### Active Directory alert and dashboard improvement
    * Added new alert `AD - Multiple Password Changes in Short Time Period` to find the mulitple password change in the short time period.
    * Added new alert `AD - Bulk User Creation or Deletion` to find the bulk user creation or deletion.
    * Added 
    * Enhanced the `AD - Password Change Outside Working Hour` alert and panel to show adiitional improtant fields.

* ### G Suite new alert
    * Added new alert `G Suite - Multiple Password Changes in Short Time Period` to find the mulitple password change in the short time period.
    * Added new alert `G Suite - Bulk User Creation or Deletion` to find the bulk user creation or deletion.
    * Added `User Created` and `User Deleted` panels in the G Suite dashboard.


* ### Bug Fixes
    * Fixed a drilldown issue for the `Login Details` panel in the `VPN` dashboard.

    * Fixed the source value in the `cs_sysmon macro` macro.


## Upgrade Guide from 2.1.0 to 2.2.0

* User need to enable the `win_listening_ports` scripted input from the Splunk Add-on for Windows to populate the `Listening Ports on Host` panel of `Windows Reports` dashboard.

* The `openPorts.sh` scripted input is no longer reqired for Cyences App. User can disable the input from the Splunk Add-on for Linux and Unix addon.
