---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 5
has_children: true
---

# Release Notes


## Version 3.1.0 (March 2023) :TODO:

* ### Notable Event Assignment
    * User can assign a notable event to user and update the notable event status based the investigation from the Forensic dashboard.
    * Added SOC Dashboard to get overview of notable events by the alert, assignee, status and severity.
    * Updated Overview dashboard to filter the result based on the Status value.
    :TODO: screenshot

* ### New Cyences Settings Page
    * User can easily enable/disable the products as per their Splunk environment from the Product Setup page to enable/disable savedsearch and dashboards accordingly.
    * All the old configurations are migrated to the new Cyences Configuration Page. 
    :TODO: screenshot

* ### Enhancements
    * Enhanced MultiSelect functionality
        * MultiSelect input will automatically select/unselect All option based on the user selection in all the dashboards.
    
    * Support for email messagetrace event using O365 addon 
        * Updated Email related alerts to support email messagetrace event collected using the O365 addon.

    * Reduced severity level for the already blocked events for Palo High Threat alert.


* ### Bug Fixes
    * Fixed minor issue in the DNS Tracker dashboard for zero event.

    * Fixed windows decommissioned host reappearing issue.

    * Fixed "Windows Defender RealTime Protection Disabled or Failed" alert search query.

    * Fixed severity inconsistency between alert and overview dashboard for antivirus service stop alerts.

    * Fixed Cyences logo issue.


## Upgrade Guide from 3.0.0 to 3.1.0 :TODO:

* ### Cyences Settings
    * Go through the Cyences Settings and make required changes
    :TODO: Link to configuration page
