---
layout: default
title: Reports
permalink: /user_guide/reports_dashboard/
nav_order: 4
parent: User Guide
---

# Reports
There are several security related reports to choose from and they are all located under the **Reports** drop-down in the navigation bar (Control > Reports) of the Cyences App. These reports should be reviewed regularly as they can help pinpoint any security risks that may be present in your Splunk environment. Each category contains the following reports: 

* Active Directory & Windows Report
    * AD - Group Changed
    * AD - Group Membership Changed
    * AD - Group Policy Changed
    * AD - User Account Locked Out
    * AD - User Changed
    * AD - Password Change Outside of Working Hours

* Amazon Web Services Reports
    * User Activities on AWS
    * User Activities on Geographic Source information

* Authentication Reports 
    * All Authentications
    * Application Authentication Success Rate
    * Authentication Failure Reasons Over Time
    * User Authentication Activities

* CrowdStrike Reports (Antivirus > CrowdStrike)
    * Suspicious Activity or Malware Detected
    * Suspicious Activity or Malware Prevented

* G Suite Reports
    * Login Challenge
    * Login Failures
    * Login Types
    * Password Updates
    * Successful Logins
    * Other Login Related Events

* Linux/Unix Reports
    * Failed Login by Host, Users
    * Hosts Details
    * Interfaces on Hosts
    * List of Services on Hosts
    * Listening Ports on Hosts
    * Mount Points on Hosts
    * Open Ports
    * Successful Login by Host, Users
    * User List

* Microsoft 365 Defender ATP Reports (Antivirus > Microsoft 365 Defender ATP)
    * Microsoft 365 Defender ATP Alerts

* Network Reports
    * Port Scanning Attempts
    * Top Network Traffic

![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/CY-283-cyences-doc-migration/docs/assets/network_reports.png?raw=true)

* Office 365 Reports
    * Activity Over World (Unique Users)
    * External Users Added to Teams
    * Failed Logins
    * Login from Unknown UserID
    * Security & Compliance Center: Alert Details
    * Service Status
    * Successful Logins

* Palo Alto Firewall Reports
    * DDoS Attack Prevented by Palo Alto Firewall
    * Inbound Traffic from Blocked IPs
    * List of Firewall Devices
    * Outbound Traffic to Blocked IPs
    * Palo Alto Firewall Login Failures

* Sophos Reports (Antivirus > Sophos)
    * Application Blocked
    * Certificate/License Expiration Messages
    * Core Restore Failed
    * Endpoint Out of Date
    * Endpoint Service Not Running
    * Endpoints in Isolation
    * Endpoints Suspended from Central Management
    * Exploit Prevented
    * Malware Detected
    * Real-Time Protection Disabled
    * Update Errors
    * Web Control Violation
    * Web Filtering Blocked

* VPN Reports
    * Connected Workforce by Location
    * Logins by Country
    * Logins by Success/Failure
    * Login Details
    * Successful vs Failed Logins
    * Unique Users by Country

* Windows Defender Reports (Antivirus > Windows Defender)
    * Antimalware Engine Dropped Support for Operating System 
    * Antimalware will Drop Support for Operating System Soon 
    * Antimalware will Expire Soon 
    * Antivirus Expired 
    * Antivirus Scan Failed 
    * Malware Detected 
    * Unable to Download and Configure Offline Scan 
    * Update Errors
    * Windows Defender Health Report 

## Splunk Admin Reports
Splunk Admin reports displays information related to the Splunk environment; which can be useful in checking its overall health status to determine if it is operating properly. 

**Splunk License Usage**
* Provides a visual representation of how much data has been ingested per day, as well as the stack size.

**Instance Disk Usage**
* Provides a visual representation of how much disk usage each host is using.  

**Indexes**
* Notifies the Splunk user if there is any missing data for a particular index. 

**Forwarders**
* Notifies the Splunk user if any hosts have stopped sending data to Splunk. 

**Remove Decommissioned Forwarder**
* Removes forwarders that are no longer in use.  

![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/CY-283-cyences-doc-migration/docs/assets/splunk_admin_dashboard.png?raw=true)

![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/CY-283-cyences-doc-migration/docs/assets/splunk_admin_dashboard_continued.png?raw=true)
