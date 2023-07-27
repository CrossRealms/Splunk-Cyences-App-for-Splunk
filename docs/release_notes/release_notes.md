---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 5
has_children: true
---

# Release Notes


## Version 4.1.0 (July 2023)

* ### Added "Network Compromise - DDoS Behavior Detected" alert.

* ### Using a New Input for Office 365 Login Data to Improve Results
    * Improved all of the O365 login related alerts and dashboards to display more information using the O365 audit sign-in logs from the Splunk Add-on for Office 365.

* ### Enhancements  

    * Enhanced the "Windows - Windows Process Tampering Detected" alert to display the source process details that tampered with the Windows process.


    * Updated field order in the Digest Email to show notable_event_id field as last column.

    * Improved cyences_severity logic for "Ransomware - Calculate UpperBound for Spike in File Writes" alert.

    * Added raw filter macro and Improved cyences_severity logic for "Network Compromise - Basic Scanning" alert.

    * Enhanced "Email - Hourly Increase In Emails Over Baseline" alert to display the domain information of the recipient.

    * Improved "Linux - User Added/Updated/Deleted" and "Linux - Group Added/Updated/Deleted" alerts to display the exact changes in detail.
        * Deprecated "Linux - Change in Sudo Access of Local Linux Account" alert.

    * Updated threshold value for the "Network Compromise - Basic Scanning" alert.

* ### Bug Fixes

    * Fixed a fetching issue for the first fifty records for the Sophos endpoint custom command.

    * Fixed a permissions issue that wouldn't allow users to make use of the notable event assignment functionality.


## Upgrade Guide from 4.0.0 to 4.1.0

  * Cyences Authentication data model has been added. Users should accelerate the summary range of the Cyences Authentication data model to at least a 1 month period to improve search performance overall.
