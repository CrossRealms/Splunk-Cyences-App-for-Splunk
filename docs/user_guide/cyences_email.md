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