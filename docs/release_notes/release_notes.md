---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 5
has_children: true
---

# Release Notes


## Version 4.4.0 (November 2023)


* ### Added New Alerts
    * Amazon Web Services
        * AWS - IAM AccessKey Creation or Deletion
        * AWS - IAM Login Profile Change/Update
        * AWS - IAM User Creation or Deletion
        * AWS - IAM Policy Creation or Deletion
        * AWS - IAM Group Change/Update
        * AWS - IAM Group Membership Change/Update
        * AWS - IAM Role Creation or Deletion
        * AWS - Network Access Control List Creation or Deletion
        * AWS - Concurrent Sessions From Different IPs
        * AWS - Multiple Failed MFA Requests For User
        * AWS - Created a Policy Version that allows All Resources to be Accessed
        * AWS - Someone Tries to Retrieve the Encrypted Administrator Password
        * AWS - RDS Master User Password has been Reset
        * AWS - Bucket Versioning is Disabled
        * AWS - Multi Factor Authentication is Disabled for IAM User
        * AWS - Successful Login From Unusual Country
        * AWS - Daily Login Failure
        * AWS - Login Failure From Unusual Country Due To Multi Factor Authentication
    * Google Workspace
        * Google Workspace - User Change/Update
        * Google Workspace - Enterprise Group Change/Update
        * Google Workspace - Enterprise Group Membership Change/Update
        * Google Workspace - Role Change/Update
        * Google Workspace - Successful Login From Unusual Country
        * Google Workspace - Suspicious Login Activity by User
        * Google Workspace - Daily Login Failure
        * Google Workspace - Alerts Center Alert
        * Google Workspace - Google Drive objects shared Outside or with External User
        * Google Workspace - Suspicious File Shared by External User on Google Drive
    * Email:
        * Email - Suspicious Subject or Attachment
        * Email - With Known Abuse Web Service Link
    * Sophos:
        * Sophos - Failed to CleanUp Potentially Unwanted Application by Sophos
    * Ransomware
        * Ransomware - Endpoint Compromise - Malicious Package Found


* ### Enhancements  

    * #### GSuite has been replaced with Google Workspace
        * GSuite Add-on is no longer supported, kindly remove related Add-ons.
        * Install the **Splunk Add-on for Google Workspace** and configure it for data collection. For more details, refer [Google Workspace Data Onboarding]({{ site.baseurl }}/data_onboarding/cloud_tenancies/gws)
        * Removed the below alerts and replaced them with related alerts.
            * **Gsuite - Bulk User Creation or Deletion** is replaced with **Google Workspace - Bulk User Creation or Deletion**
            * **Gsuite - Multiple Password Changes in Short Time Period** is replaced with **Google Workspace - Multiple Password Changes in Short Time Period**
        * Removed the **GSuite** dashboard and replaced it with the **Google Workspace** dashboard.

    * #### Sophos Central Add-on for data collection has been changed
        * Use the [Sophos Central Addon](https://splunkbase.splunk.com/app/6186/) and remove [Sophos Central SIEM Integration Add-on](https://splunkbase.splunk.com/app/4647/)
        * All alerts and dashboard should work seamlessly with the new data.
        * The alerts and dashboard for Sophos Endpoint protection do not guarantee to support old Add-on anymore.
    
    * Added new panels to the Google Workspace and AWS dashboards.

    * Added "User Inventory" panel to the "Intelligence" dashboard.

    * Added "Google Workspace" and "AWS" panels to the "Overview" dashboard.


## Upgrade Guide from 4.3.0 to 4.4.0

  * To onboard the Google Workspace data, Refer [Google Workspace Data Onboarding]({{ site.baseurl }}/data_onboarding/cloud_tenancies/gws)
  * To use the Sophos dashboard and alerts, Install the [Sophos Central Addon](https://splunkbase.splunk.com/app/6186/)