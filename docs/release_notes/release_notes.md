---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 3
has_children: true
---

# Release Notes

--> <TODO Ahad> review release notes to cover all points

## Version 3.0.0 (December 2022)

* ### Alert Severity and Categorization
    * From Cyences 3.0.0 each alert that comes with Cyences will have a field called cyences_severity in the results which will allow to categorize the notable events and help users prioritize the notable event to focus on.
    * Below is how the Overview page will look now:
        <TODO - Screenshot>
    * Overview page also has filter to filter to see notable events for specific severities.
        <TODO -Screenshot>


* ### Custom Alert Digest Email
    * Till not with Cyences 2.3.0 and earlier and even with regular Splunk use-cases users can set an email notification. Which is not a good idea always as some alerts may have a lot of false positives which bombard the Inbox. Also, not all severity alerts need to be received by email immediately all the time.
    * Cyences 3.0.0 introduced 2 things to resolve this:
        1. Regular Alert Digest Email
            * Which will send notifications about triggered notable events for all the alerts of Cyences in a single alert.
            * We by default will include High and Medium severity notable events in this email. But the user can change this preference.
            * The alert will be sent once every day.
            ![alt](/assets/digest_email_configuration.png)
        2. Critical Alert Email
            * We'll be sending email immediately when an alert triggers if the notable event has Critical severity as this is what user would want to see.
            * So, users get immediate notification on important items in the email.
            * Another enhancement is that user don't have to configure their email addresses on all the alerts to get critical alerts. The users should be able to configure it through Cyences Configuration page.
            * Also, user has option to exclude themselves from specific alerts or include their email addresses to only specific address.
            ![alt](/assets/cyences_email_configuration.png)
        3. Users can continue to use regular Splunk email functionality independently of above two.

        --><TODO Mahir> add screenshot how we show clearly on the email that message is truncated.
    * Refer to the [Configuration > App Installation and Configuration](/configuration/installation/#cyences-alert-email-configuration) section for more information regarding the email configuration process for Cyences.

* ### Alert Filter Configuration from Searches, Reports and Alerts Page 
    * Now Cyences will allow to configure the filter macros (to filter the the false positives of alert) right from Splunk's "Searches, Reports and Alerts" page instead of from the Cyences Configuration page.
    ![alt](/assets/filter_macro.png)
    * This is much less confusing as earlier users had to find which macro is related to which alert. Now user can see the configuration right underneath the alert configuration.
    * Your macro update may not happen in real-time as we are doing the update every 5 minutes.
    * We also handled Cyences App upgrade scenario programmatically, so users don't have to worry about configuring all those macros again at the new place.

* ### Enhancements

    * Windows - Fake Windows Processes alert
        * Added more filter to reduce the false positives.
    
    * VPN Dashboard/Alert
        * We'll be adding device (dest) details on VPN dashboard and alert.
            * So, for example, if you are using Global Protect, you should be able to see which Palo Alto generated that event.
        * Added the Reason field into "Elapsed Time Per Session" panel to show reason of VPN session termination.
        <TODO - vpn_dashboard_enhancement_300.png>

    * Authentication Dashboard
        * Added last successful and last failed login timestamp in the table. 
        * <TODO - Screenshot>
    
    * Vulnerability Dashboard
        * It now supports CrowdStrike Spotlight data.
    
    * AD - User Change alert
        * Added filter to reduce number of false positives.
    
    * Forensics Page
        * Some alerts were missing the searches for drilldowns and contributing events panel. Added now.


* ### Bug Fixes

* Windows Patch dashboard and Windows Host Missing Update alert
    * In some cases, alert and dashboard were including data which wasn't related to Windows Update Events due to EventCode conflict. Fixed the issue.

* Fixed the issue with some notable events showing the wrong timestamp information.
    * Cyences notable events data is now logged under sourcetype="cyences:notable:events".

* [For Admins only] Improved logging.
    * Fixed the issue of truncated internal Cyences logs.
    * Moved default log level for custom commands to INFO to reduce number logs in the internal index.
    * Added more info logs to custom commands for better troubleshooting.



## Upgrade Guide from 2.3.0 to 3.0.0

* Overview Dashboard
    * By default, non-triggered alerts will remain hidden. 
    * Users can still view every alert by unchecking the **Hide Not Triggered Alerts** filter. 

* Custom Alert Digest Email
    * Users must configure their email address in order to use this feature. Refer to the [Configuration > App Installation and Configuration](/configuration/installation/#cyences-alert-email-configuration) section for more information. 
