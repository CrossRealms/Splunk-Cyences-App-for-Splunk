---
layout: default
title: User Guide
permalink: /user_guide/
nav_order: 2
has_children: true
---

# User Guide
This section of the document is about how to utilize the Cyences App.

---

### Data Collection
The following sources and their respective data need to be onboarded into your Splunk environment in order to get the most security benefits out of the Cyences App: 
* Amazon Web Services
* CrowdStrike EventStream Data (Antivirus)
* Firewall Logs
* Fortigate VPN Logs
* G Suite
* Lansweeper
* Linux
* Microsoft Graph Security Score (Azure)
* Network Logs
* Office 365 Defender ATP (Advanced Threat Protection)
* Office 365 Management Events 
* Palo Alto Logs
* Qualys 
* Sophos Central (Antivirus) 
* Sysmon
* Tenable
* Unix
* VPN
* Windows Defender Logs (Antivirus)
* WinEventLog

View the **Data Onboarding [Admin]** section for more information.

### Configuration 

View the **App Installation & Configuration [Admin]** section for installation and configuration information regarding the following topics:
* App installation
* Dependency installation
* Macro configurations

### Enable Alerts and Reports

Security use cases will vary depending on the needs of the individual user as Splunk users utilize different combinations of devices and firewalls. For this reason, all of the alerts and reports that come with the Cyences app will be disabled by default.  

Please follow the steps below to enable various alerts and reports in Splunk.

1. Go to **Settings > Searches, reports, and alerts**.
2. In the App dropdown select **Cyences App for Splunk (cyences_app_for_splunk)**. 
3. Each alert and report has an **Edit** button present underneath the **Actions** column.
4. Click on **Edit > Enable** to enable the desired alert/report.

A few of the included alerts and reports are dependent on other reports being enabled. The additional reports that are essential for these three dependent reports to function are outlined below:
* Palo Alto Firewall - Malicious IP List Gen
    * Palo Alto Firewall - Network Compromise - DDoS Attack Prevented
    * Palo Alto Firewall - Network Compromise - Inbound Traffic from Blocked IPs
    * Palo Alto Firewall - Network Compromise - Outbound Traffic to Blocked IPs
        * Dynamically Update Blocked IPs with HoneyDB
    * Ransomware - Spike in File Writes 
        * Ransomware - Calculate UpperBound for Spike in File Writes
    * Windows - Hosts Missing Update
        * Windows - Hosts Lookup Gen (this report is enabled by default)
    * Device Inventory Gen 
        * View the **App Installation and Configuration > Device Inventory** section for more details.

### Enable Email Notifications with Alerts
Email notifications are disabled by default for all alerts. 

#### How to enable email notifications for alerts: 
1. Navigate to **Settings > Searches, reports, and alerts**. 
2. Under **Type**: select **Alerts**.
3. Under **App**: select **Cyences App for Splunk (cyences_app_for_splunk)**. 
4. Click **+ Add Actions** and in the dialog box select the **Send email** action.

![alt](https://github.com/CrossRealms/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/edit_alert_send_email_action.png?raw=true)

5. Complete the necessary field values (i.e., "To", "Subject", "Message", etc.)
6. Click **Save**.