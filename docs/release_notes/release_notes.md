---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 5
has_children: true
---

# Release Notes


## Version 3.0.0 (January 2023)

* ### Alert Severity and Categorization
    * The Overview dashboard will now display different colors for notable events based on their severity level. This way users can prioritize their security investigation at a quick glance. 
        ![alt]({{ site.baseurl }}/assets/overview_dashboard_severity_level_colors.png)
    * A new filter has been added to the Overview dashboard which allows users to filter notable events based on the severity level.  
        ![alt]({{ site.baseurl }}/assets/overview_dashboard_severity_level_filter.png)


* ### Custom Alert Digest Email
    * The way Splunk currently handles alerts, users are only able to set up email notifications, which is not always optimal as some alerts may generate a lot of false positives. Not every alert needs to be received by email, especially those labeled with lower severity levels. 
    * Cyences 3.0.0 has introduced two new email settings to reduce noise:
        1. Regular Alert Digest Email
            * Sends notifications about triggered notable events for each Cyences alert in a single email. 
            * By default, this will include both high and medium severity notable events, but users can adjust the severity level to their desired preference.  
            * The alert digest email will be sent once a day. 
            ![alt]({{ site.baseurl }}/assets/digest_email_configuration.png)
        2. Critical Alert Email
            * Sends an email immediately after an alert gets triggered if the notable event has been labeled with a critical severity level.
            * Users will receive an immediate notification about important items within the email.
            * Another enhancement is that users will not have to manually configure their email for every Cyences alert. Users can add their email address to each alert from a single source (Cyences Configuration page).  
            ![alt]({{ site.baseurl }}/assets/cyences_action_send_email_default_common_config.png)
            * Also, users have an option to exclude themselves from specific alerts or to include their email addresses for only specific alerts.
            ![alt]({{ site.baseurl }}/assets/cyences_email_configuration.png)
        3. Users can continue to use the default email notification method that Splunk provides if they want to for any specific alert.  

    * Refer to the [Installation/Configuration]({{ site.baseurl }}/configuration/#cyences-email-settings-for-alerts) section for more information regarding the email configuration process for Cyences.

* ### Alert Filter Configuration from Searches, Reports and Alerts Page 
    * Users are now able to configure Cyences’ filter macros (to filter out the false positives of an alert) right from Splunk’s navigation bar (Settings > Searches, Reports, and Alerts) instead of from Cyences’ configuration page. (**Note:** Do not update the macro directly)
    ![alt]({{ site.baseurl }}/assets/filter_macro.png)
    * This change was made to avoid confusion, as users had to figure out which macro is related to which alert. Users can now view the configuration right underneath the alert configuration section.  
    * Macro updates may not happen in real-time as App is performing the update every five minutes.
    * CrossRealms has also handled the Cyences app upgrade scenario for this, so users do not have to worry about configuring every macro again.

* ### Enhancements

    * AD - User Changed Alert
        * Added a filter to reduce the number of false positives.

     * Authentication Dashboard
        * Added the last successful login and last failed login timestamps to the table. 
        * ![alt]({{ site.baseurl }}/assets/user_authentication_activity_timestamps.png)

    * Forensics Dashboard
        * Added search queries for specific alerts which are necessary to perform drilldowns and to populate the contributing events dashboard panel.

    * VPN Alert & Dashboard
        * Added a Destination field to the VPN dashboard and alert. 
            * For example (if you are using Global Protect), users can see which Palo device generated a particular event. 
        * Added a Reason field to the “Elapsed Time Per Session” dashboard panel to display the reason for a VPN session termination. 
        ![alt]({{ site.baseurl }}/assets/vpn_dashboard_enhancement_v300.png)

    * Vulnerability Dashboard
        * CrowdStrike Spotlight data is now supported.

     * Windows - Fake Windows Processes Alert
        * Added filters to reduce the number of false positives.


* ### Bug Fixes

    * Windows Host Missing Update Alert & Windows Patch Dashboard 
        * In some cases, both the alert and dashboard included data that were not related to Windows Update Events due to an EventCode conflict. This issue has been resolved.  

    * Fixed an issue where some notable events displayed the incorrect timestamp information.  
        * The data for Cyences notable events are now logged under sourcetype="cyences:notable:events".

    * Improved Logging [For Admins Only]
        * Fixed an issue where Cyences internal logs were being truncated.
        * Moved the default log level for custom commands to INFO in order to reduce the number of logs in the internal index.
        * Added more info logs to custom commands for improved troubleshooting.



## Upgrade Guide from 2.3.0 to 3.0.0

* Overview Dashboard
    * By default, non-triggered alerts will remain hidden. 
    * Users can still view every alert by unchecking the **Hide Not Triggered Alerts** filter. 

* Custom Alert Digest Email
    * Users must configure their email address in order to use this feature. Refer to the [Installation/Configuration]({{ site.baseurl }}/configuration/#cyences-email-settings-for-alerts) section for more information. 

* "Network Reports" dashboard is now renamed as "Network Telemetry".
