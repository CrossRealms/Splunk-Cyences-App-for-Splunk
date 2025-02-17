---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 5
has_children: true
---

# Release Notes


## Version 5.2.0 (February 2025)

* ### Added new alert for Office 365
    * O365 - MFA got Disabled for User

* ### Added new alert for Cisco IOS
    * Cisco IOS - CPU Utilization Exceeds the Threshold

* Added field alias for the xml format of windows logs to comply with the standard windows logs.

* Removed the "Content Update" app dependency and added useful lookups for the ransomware alerts.

* ### Enhancements

    * Enhanced the **O365 - Risky Login Detected by Microsoft** alert by updating the data source from o365 audit signin logs to azure audit signin logs & renamed the alert to **Azure AD - Risky Login Detected**

    * Updated the configs to get accurate results for the Fortigate VPN success authentication logs.

    * Enhanced the Bruteforce alert search by removing unnecessary source.


* ### Bug Fixes

    * Fixed the data availability panel search for vulnerability, vpn and authentication data.

    * Fixed the action field extraction for the fortigate VPN logs.


## Upgrade Guide from 5.1.0 to 5.2.0

*
