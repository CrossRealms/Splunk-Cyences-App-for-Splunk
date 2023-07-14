---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 5
has_children: true
---

# Release Notes


## Version 4.1.0 (July 2023)

* ### Added "Network Compromise - DDoS Behavior Detected" new alert.

* ### Enhancements  
    * Improved all the O365 Login related alerts and dashboards to show more information using the O365 Audit Signin Logs.

    * Enhanced "Windows - Windows Process Tampering Detected" alert to show the source process details that tempered the process.

    * Updated field order in the Digest Email to show notable_event_id field as last column.

    * Improved cyences_severity logic for "Ransomware - Calculate UpperBound for Spike in File Writes" alert.

    * Added raw filter macro for "Network Compromise - Basic Scanning" alert.

    * Enhanced "Email - Hourly Increase In Emails Over Baseline" alert to show domain wise recipient information.

    * Improved "Linux - User Added/Updated/Deleted" and "Linux - Group Added/Updated/Deleted" alerts to show exact changes detail.
        * Deprecated "Linux - Change in Sudo Access of Local Linux Account" alert.

    * Updated threshold value for the "Network Compromise - Basic Scanning" alert.

* ### Bug Fixes
    * Fixed fetching first 50 records multiple times issue for sophos endpoint custom command.

    * Fixed the permission issue to allow normal user to use notable event assignment functionality.


## Upgrade Guide from 4.0.0 to 4.1.0
    * New Cyences_Authentication Data model is added. User should accelerate Cyences_Authentication with minimum 1 month period to improve search performance.
