---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 5
has_children: true
---

# Release Notes


## Version 4.2.0/4.2.1 (August 2023)

* ### Windows Certificates
    * Added "Active Directory Certificate Service Events" dashboard.
    * Added "Windows - Certificate is Expiring Soon" alert.
    * To onboard the Windows Certificate Store data, Refer [Windows Certificate Store Data Onboarding]({{ site.baseurl }}/data_onboarding/windows/certificate)

* ### Windows Firewall Status
    * Added "Windows Firewall Status" dashboard panel in the Windows dashboard. 
    * Added "Windows - Windows Firewall is Disabled" alert.
    * To onboard the Windows Firewall Status data, Refer [Windows Firewall Status Data Onboarding]({{ site.baseurl }}/data_onboarding/windows/firewall_status)


* ### Enhancements  

    * Improved the severity logic for the following alerts:
        * Email - Hourly Increase In Emails Over Baseline
        * Network Compromise - Basic Scanning
        * Authentication - Bruteforce Attempt from a Source
        * Sophos - Failed to clean up threat by Sophos
        * Sophos - Sophos RealTime Protection Disabled

    * Updated the "Microsoft 365 Defender ATP Audit" dashboard to reflect the latest change to the Defender add-on.

    * Updated splunklib to the latest version (v1.7.4).

    * Added a generic search filter in the Forensics and SOC dashboards.

    * Excluded Windows password expired events from the alerts related to brute force.


* ### Bug Fixes

    * Fixed a permissions issue that wouldn't allow users to make use of the notable event assignment functionality.

    * Fixed a Forensics and SOC dashboard compatibility issue with Splunk 9.1.X.


## Upgrade Guide from 4.1.0 to 4.2.0/4.2.1

  * To onboard the Windows Certificate Store data, Refer [Windows Certificate Store Data Onboarding]({{ site.baseurl }}/data_onboarding/windows/certificate)
  * To onboard the Windows Firewall Status data, Refer [Windows Firewall Status Data Onboarding]({{ site.baseurl }}/data_onboarding/windows/firewall_status)
  * Update the [Cyences Add-on for Splunk](https://splunkbase.splunk.com/app/5659) to latest version.
