---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 5
has_children: true
---

# Release Notes


## Version 4.7.0 (March 2024)

* ### RSA Radius Authentication
    * Added new dashboard named **RSA Radius Authentication**.
    * Added new alert named **RSA Radius Authentication - Excessive Failed Logins for a User**.

* ### Office 365 Alerts/Dashboard
    * Added new alerts:
        * O365 - OneDrive or SharePoint File Sharing with External User
        * O365 - OneDrive or SharePoint Link Accessed By External User
    * Added panels related to mentioned alerts on **Office 365** dashboard.

* ### Google Workspace Alerts/Dashboard
    * Added new alerts:
        * Google Workspace - Google Drive objects accessed by External User
    * Added panels related to mentioned alerts on **Google Workspace** dashboard.

* Added feature to include environment name as a subject prefix of alert emails to make filtering easier. To configure the environment name, navigate to **Cyences Settings > Cyences App Configuration > Cyences General Configuration**.


* ### Enhancements

    * Utilized the Network Traffic datamodel for the **Network Compromise - Basic Scanning** alert to improve search performance.

    * For **O365 - Login Failure From Unusual Country Due To Multi Factor Authentication** alert, reduced the severity if user not available.

    * Added Target_userPrincipalName field to the Azure AD changes related alerts.

    * Added src_ip field to the **Fortigate Firewall - Network Compromise - Fortigate High System Alert** alert.

    * Fixed the issue as mentioned in following screenshot after upgrading to Splunk 9.2.0.1

    ![alt]({{ site.baseurl }}/assets/splunk_upgrade_9_2_0_1_error.png)


## Upgrade Guide from 4.6.0 to 4.7.0

* To configure the environment name, Navigate to **Cyences Settings > Cyences App Configuration > Cyences General Configuration**.