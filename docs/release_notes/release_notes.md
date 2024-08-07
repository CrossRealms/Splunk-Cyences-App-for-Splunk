---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 5
has_children: true
---

# Release Notes


## Version 5.0.0 (September 2024)

* ### Alert Categorization


* Removed the following deprecated alerts:
    * O365 - Login Failure Outside Home Country Due To Multi Factor Authentication
    * O365 - Successful Login Outside Home Country
    * Authentication - Successful VPN Login Outside Home Country
    * Linux - Change in Sudo Access of Local Linux Account

* Removed the [Splunk Add-on for RWI - Executive Dashboard](https://splunkbase.splunk.com/app/5063/) dependency.

* ### Enhancements

    * Added option to exclude informational vulnerability by default from the **Vulnerability** dashboard.

    * Enhanced the **Vulnerability - Detected Vulnerabilities** alert to detect new vulnerabilities in case of delayed ingestion of events.




## Upgrade Guide from 4.9.0 to 5.0.0
