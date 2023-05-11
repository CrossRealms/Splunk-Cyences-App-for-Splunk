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
    * User can assign notable events to the user on Splunk for further investigation of the incident. User can also update the status of the notable event based on the investigation phase.
    * Added the new SOC Dashboard to get overview of notable events by the alert, assignee, status and severity.
    * Updated Overview dashboard to filter the result based on the Status value.

![alt]({{ site.baseurl }}/assets/notable_event_assignment.png)

* ### New Cyences Settings Page
    * Users can use Cyences' new App Configuration page to customize the dashboards they want to see/hide and the alerts they want to enable/disable.
    * The new Cyences App Configuration page also allows you to see if the data-source configuration (index macro) is accurate and if your Splunk environment has data for it or not and modify the configuration if required.
    * All the old configurations (Cyences default email configuration, Macro Setup, Sophos endpoint data collection creds, etc) are migrated to the new Cyences App Configuration Page.

![alt]({{ site.baseurl }}/assets/data_source_macros.png)

* ### Alerts for Logins from New Country
    * O365 - Login Failure From New Country Due To Multi Factor Authentication
    * O365 - Successful Login From New Country
    * Authentication - Successful VPN Login From New Country (This alert is vastly improved to make it login from a new Country instead of a static country name. This also reduces false positives drastically. The same applies to the other two newly added alerts as well.)

* ### Added "Vulnerability - Detected Vulnerabilities" alert and updated overview dashboard to show Vulnerability related notable event count. 

* ### Enhancements
    * Enhanced MultiSelect functionality
        * MultiSelect input will automatically select/unselect All option based on the user selection in all the dashboards.
    
    * Support for email messagetrace event using Splunk Add-on for Office 365. 
        * Updated Email related alerts to support email messagetrace event collected using Splunk Add-on for Office 365..

    * Reduced severity level for the already blocked events for Palo High Threat alert.

    * Windows - Windows Process Tampering Detected alert
        * Added internal filter macro to reduce the false positives.



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
