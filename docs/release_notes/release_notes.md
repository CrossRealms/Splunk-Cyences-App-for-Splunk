---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 5
has_children: true
---

# Release Notes


## Version 4.2.0 (August 2023)

* ### Windows Certificates
    * Added "Active Directory Certificate Service Events" dashboard. 
    * Added "Windows - Certificate is Expiring Soon" alert
    * Install [Windows Certificate Store Add-on for Splunk](https://splunkbase.splunk.com/app/7013) to collect the required data.

* ### Windows Firewall Status
    * Added "Windows Firewall Status" dashboard panel in the Windows dashboard. 
    * Added "Windows - Windows Firewall is Disabled" alert.
    * Install [Windows Firewall Status Check Add-on](https://splunkbase.splunk.com/app/7012) to collect the required data.


* ### Enhancements  

    * Improved severity logic for below alerts
        * Email - Hourly Increase In Emails Over Baseline
        * Network Compromise - Basic Scanning
        * Authentication - Bruteforce Attempt from a Source
        * Sophos - Failed to clean up threat by Sophos
        * Sophos - Sophos RealTime Protection Disabled

    * Updated "Microsoft 365 Defender ATP Audit" dashboard as per latest Defender addon change.

    * Updated splunklib to latest version (v1.7.4)

    * Added filter in the Forensics and SOC dashboard.

    * Excluded Windows password expired events from the Bruteforce alerts.

* ### Bug Fixes

    * Fixed the cyences alert action permission issue.

    * Fixed Forensics and SOC dashboard issue on Splunk 9.1.X 


## Upgrade Guide from 4.1.0 to 4.2.0

  * Install [Windows Certificate Store Add-on for Splunk](https://splunkbase.splunk.com/app/7013) to collect the windows certificate related data.
  * Install [Windows Firewall Status Check Add-on](https://splunkbase.splunk.com/app/7012) to collect the windows firewall status data.
