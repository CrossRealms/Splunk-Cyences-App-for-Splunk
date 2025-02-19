---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 5
has_children: true
---

# Release Notes


## Version 5.2.0 (February 2025)

* ### Added new alerts for Linux
    * Linux - Access To Sudoers File
    * Linux - System Firewall Service Stopped

* ### Added new alert for Office 365
    * O365 - MFA got Disabled for User

* ### Added new alert for Cisco IOS
    * Cisco IOS - CPU Utilization Exceeds the Threshold

* Added field aliases for the XML windows event logs to correlate with the standard windows event logs.

* Removed the **ES Content Update** app dependency and added useful lookups for ransomware alerts.


* ### Enhancements

    * Enhanced the **O365 - Risky Login Detected by Microsoft** alert by updating the data source from office 365 audit signin logs to azure audit signin logs & Renamed the alert to **Azure AD - Risky Login Detected**.

    * Updated the configs to get accurate results for the Fortigate VPN success authentication logs.

    * Enhanced the Bruteforce alert search by removing unnecessary sources.


* ### Bug Fixes

    * Fixed the data availability panel search for vulnerability, VPN and authentication data.

    * Fixed the **action** field extraction for the Fortigate VPN logs.


## Upgrade Guide from 5.1.0 to 5.2.0

* Onboard Azure Audit SignIn logs to utilize the related alerts. For more details, refer to [Azure Active Directory Data Onboarding]({{ site.baseurl }}/data_onboarding/cloud_tenancies/o365_azure_ad)

* Onboard Auditd logs if service is enabled for the Linux server in order to utilize the related alerts. For more details, refer to [Linux Data Onboarding]({{ site.baseurl }}/data_onboarding/linux)
