---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 5
has_children: true
---

# Release Notes


## Version 4.0.0 (May 2023)

* ### Notable Event Assignment
    * User can assign a notable event to user and update the notable event status based the investigation from the Forensic dashboard.
    * Added SOC Dashboard to get overview of notable events by the alert, assignee, status and severity.
    * Updated Overview dashboard to filter the result based on the Status value.

![alt]({{ site.baseurl }}/assets/notable_event_assignment.png)

* ### New Cyences Settings Page
    * User can easily enable/disable the products as per their Splunk environment from the Product Setup page to enable/disable savedsearch and dashboards accordingly.
    * All the old configurations are migrated to the new Cyences App Configuration Page. 

![alt]({{ site.baseurl }}/assets/data_source_macros.png)


* ### Enhancements
    * Enhanced MultiSelect functionality
        * MultiSelect input will automatically select/unselect All option based on the user selection in all the dashboards.
    
    * Support for email messagetrace event using O365 addon 
        * Updated Email related alerts to support email messagetrace event collected using the O365 addon.

    * Reduced severity level for the already blocked events for Palo High Threat alert.

    * Windows - Windows Process Tampering Detected alert
        * Added internal filter macro to reduce the false positives.

    * New alerts for Successful Login from new location
        * O365 - Login Failure From New Location Due To Multi Factor Authentication
        * O365 - Successful Login From New Location

    * Added "Vulnerability - Detected Vulnerabilities" alert and updated overview dashboard to show Vulnerability related notable event count. 

    * Excluded TriggerBrowserCapabilitiesInterrupt error events from "O365 - Daily Login Failure" alert to reduce false positives.
        * More information for the error: https://login.microsoftonline.com/error?code=501314
    
    * Improved severity logic for "Email - Hourly Increase In Emails Over Baseline" alert to reduce false positives.

* ### Bug Fixes
    * Fixed minor issue in the DNS Tracker dashboard for zero event.

    * Fixed windows decommissioned host reappearing issue.

    * Fixed "Windows Defender RealTime Protection Disabled or Failed" alert search query.

    * Fixed severity inconsistency between alert and overview dashboard for antivirus service stop alerts.

    * Fixed Cyences logo issue.


## Upgrade Guide from 3.1.0 to 4.0.0

* ### Cyences Settings
    * Go through the [Cyences App Configuration]({{ site.baseurl }}/configuration/#products-setup-data-source-macros) and make required changes
