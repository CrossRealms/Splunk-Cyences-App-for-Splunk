---
layout: default
title: Cyences Email Alerts
permalink: /user_guide/cyences_email/
nav_order: 5
parent: User Guide
---

## **Cyences Email Settings for Alerts**

Refer to Configuration > Installation 

The configuration process for Cyences email alert settings consist of three components. 

1. Send Digest Email - sent once a day, contains all alerts triggered in 24 hours (default - medium and high severity only; users can customize settings), only applicable to the alert that's being configured (add screenshot). **Note** Maximum of 15 notable events per alert & if there are more than 10 alerts triggered than users will receive digest emails in parts (1, 2, etc.). 

2. Cyences Action - Send Email - users won’t have to manually configure their email for every Cyences alert. They’ll be able to add their email address for each alert from a single source (Cyences Configuration page). 

3. Cyences Action - Send Email - Default/Common Configuration - Cyences configuration page to get all emails (default - critical severity; users can customize severity levels). If you want to override the settings for a particular alert, go to the individual alert and remove your email address from the Cyences Action - Send Email Exclude Recipients section. Add email address to Include Additional Recipients if you only want to receive emails for a specific alert. Mention disable email option. 

## **Cyences Action - Send Email - Default/Common Configuration** (email address configuration for Cyences alerts)
 
* <TODO-Ahad/Mahir> - write full details (refer to pre-release 3.0 notes)

(comma separated list of email addresses who wish to receive all Cyences alerts in the form of an email based on the desired severity level(s))

(comma separated list of alert severity levels that are included in the email; default - critical severity only)

* <TODO-Ahad> - add screenshot



* Up until Cyences 2.3.0, users have been able to set up an email notification for alerts via Splunk's default method, even with regular Splunk use-cases. This is not always a good idea as some alerts may contain a lot of false positives which leads to a lot of unnecessary noise. Additionally, not every alert needs to be immediately received via email.

Cyences 3.0.0 introduces two new email settings:

1. Regular Alert Digest Email
    * Sends notification about triggered notable events in the last 24 hours for every Cyences alert in a single email alert.
    * By default, the digest email will include both high and medium severity level notable events, but users can adjust the severity level as needed.
    * The alert will be sent once every day.
        * This configuration can be edited from the **Cyences Action - Send Digest Email** alert action inside of the **Cyences Digest Email** alert.
    ![alt](/assets/digest_email_configuration.png)

**Note:** Users may receive multiple digest emails as there is a limit of ten alerts per digest email and each alert will be limited to fifteen notable events for the total result count information.  

2. Critical Alert Email
    * Sends an immediate email whenever an alert triggers if the notable event is of critical severity.
    * Users receive an immediate notification about important items within the email.
    * Users do not have to configure their email address for every alert in order to receive critical alert emails. Users will be able to configure it through Cyences Configuration page.
        * Navigate to **Cyences App > Settings > Configuration** and add email addresses to the **Cyences Action - Send Email - Default/Common Configuration** section.
        * Users can customize the severity level for this email setting as needed. 
    --><TODO Mahir> add screenshot (ask if the LastPass logo can be removed from default email recipients?)
    * Users also have an option to exclude themselves from specific alerts or include their email addresses for specific alerts.
        * This configuration can be done at the alert level by editing the **Cyences Action - Send Email** alert action for a particular alert.
    ![alt](/assets/cyences_email_configuration.png)

**Note** Users can continue to use the default Splunk email functionality as desired and independently of the aforementioned Cyences email settings.
