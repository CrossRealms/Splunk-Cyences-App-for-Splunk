---
layout: default
title: Alerts and Dashboards
permalink: /user_guide/alerts_dashboards/
nav_order: 4
parent: User Guide
---

# Alerts & Dashboards (Security Use-cases)

## Alerts
There are several security related alerts to choose from and they are all located under the **Settings** drop-down in the navigation bar (Settings > Settings > Searches, Reports and Alerts) of the Cyences App. Alerts are disabled by default. Alerts should be reviewed regularly as they can help pinpoint any security risks that may be present in your Splunk environment. Each category contains the following alerts: 

* Active Directory Alerts
    * AD - Group Changed
    * AD - Group Membership Changed
    * AD - Group Policy Changed
    * AD - User Changed
    * AD - User Locked Out
    
* Authentication Alerts
    * Authentication - Bruteforce Attempt for a User
    * Authentication - Bruteforce Attempt from a Source
    * Authentication - Excessive Failed VPN Logins for a User
    * Authentication - Excessive Failed VPN Logins from a Source

* Credentials Compromised Alerts
    * Credential Compromise - Windows - Credential Dump From Registry via Reg exe
    * Credential Compromise - Windows - Credential Dumping through LSASS Access
    * Credential Compromise - Windows - Credential Dumping via Copy Command from Shadow Copy
    * Credential Compromise - Windows - Credential Dumping via Symlink to Shadow Copy

* CrowdStrike Alert
    * CrowdStrike - Suspicious Activity or Malware Detected by CrowdStrike

* Defender ATP Alert
    * Defender ATP Alerts

* Linux Alert
    * Linux - Change in Sudo Access of Local Linux Account

* Network Compromised Alert
    * Network Compromise - Basic Scanning
    * Ransomware - Endpoint Compromise - Network Compromise - TOR Traffic

* Office 365 Alerts
    * O365 - Azure Active Directory - Application Change/Update
    * O365 - Azure Active Directory - AuthorizationPolicy Change/Update
    * O365 - Azure Active Directory - Group Change/Update
    * O365 - Azure Active Directory - Policy Change/Update
    * O365 - Azure Active Directory - Role Change/Update
    * O365 - Azure Active Directory - ServicePrincipal Change/Update
    * O365 - Azure Active Directory - User Change/Update
    * O365 - DLP event in Exchange
    * O365 - DLP event in SharePoint
    * O365 - External User Added to Microsoft Teams

* Palo Alto Firewall Alerts
    * Palo Alto Firewall - Network Compromise - Palo Alto DNS Sinkhole
    * Palo Alto Firewall - Network Compromise - Palo Alto High System Alert
    * Palo Alto Firewall - Network Compromise - Palo Alto High Threats Alert
    * Palo Alto Firewall - Network Compromise - Palo Alto WildFire Alert

* Ransomware Alerts
    * Ransomware - Common Ransomware File Extensions
    * Ransomware - Common Ransomware Notes 
    * Ransomware - Scheduled tasks used in BadRabbit ransomware
    * Ransomware - Spike in File Writes

* Sophos Alerts
    * Sophos - Endpoint Not Protected by Sophos
    * Sophos - Failed to clean up threat by Sophos
    * Sophos - Sophos RealTime Protection Disabled
    * Sophos - Sophos Service is not Running

* Windows Alerts
    * Windows - Endpoint Compromise - Windows Firewall Disabled Event
    * Ransomware - Endpoint Compromise - Windows - WMI Lateral Movement
    * Ransomware - Endpoint Compromise - USN Journal Deletion on Windows
    * Ransomware - Endpoint Compromise - Fake Windows Processes
    * Ransomware - Windows - Windows Event Log Cleared
    * Windows - Hosts Missing Update
    * Windows - Windows Process Tampering Detected

* Windows Defender Alerts
    * Windows Defender - Endpoint Not Protected by Windows Defender
    * Windows Defender - Windows Defender RealTime Protection Disabled or Failed


## Dashboard Panels
There are several security related reports to choose from and they are all located under the **Reports** drop-down in the navigation bar (Control > Reports) of the Cyences App. Reports should be reviewed regularly as they can help pinpoint any security risks that may be present in your Splunk environment. Each category contains the following reports(as dashboard panels): 

* Active Directory & Windows Reports
    * AD - Group Changed
    * AD - Group Membership Changed
    * AD - Group Policy Changed
    * AD - Password Change Outside of Working Hours
    * AD - User Account Locked Out
    * AD - User Changed

* Amazon Web Services Reports
    * Active Users
    * Error Activities
    * Most Recent User Activity Grouped by Event Name
    * Total Activities
    * Unauthorized Activities
    * User Activity by Event Name Over Time
    * User Activity by User Name Over Time

* Authentication Reports 
    * All Authentications
    * Application Authentication Success Rate
    * Authentication Failure Reasons Over Time
    * User Authentication Activities

* CrowdStrike Reports 
    * Suspicious Activity or Malware Detected
    * Suspicious Activity or Malware Prevented

* Device Inventory Reports
    * Device Inventory Table 
    * Number of Devices That Are Connected To A Specific Security Component
    * Number of Devices That Contain A Specific Security Component
    * Number of Devices That Lack A Specific Security Component
    * Possible Merge UUIDs (Devices) in Device Inventory
    * Product Device ID Conflicts Auto Merged

* DNS Tracker Reports
    * DNS Log Volume over Time
    * Most Unsuccessful Code Queries
    * Most Unsuccessful Code Requesters
    * Record Types
    * Record Types over Time
    * Top Categories
    * Top Queries
    * Top Requesters

* G Suite Reports
    * Login Challenged
    * Login Failures
    * Login Types
    * Password Updated 
    * Successful Logins 
    * Other Login Related Events

* Kaspersky Reports
    * Application Database Out of Date
    * Attack Detected
    * Kaspersky Centralized Server Errors
    * Kaspersky Runtime Errors
    * Object Blocked
    * Object Deleted
    * Object Not Cured
    * Status of Assets
    * Suspicious Object Found
    * Virus Found
    * Virus Found and Blocked
    * Virus Found and Passed

* Lansweeper Reports
    * Apple Mac Devices
    * Linux Devices
    * Location
    * Monitor
    * Network Devices
    * Other Devices
    * VMware/Hyper-V Guests - Linux
    * VMware/Hyper-V Guests - Other
    * VMware/Hyper-V Guests - Windows
    * VMware vCenter server and ESXi server
    * Web Servers
    * Windows Devices

* Linux/Unix Reports
    * Failed Login by Host, Users
    * Hosts Details
    * Interfaces on Hosts
    * List of Services on Hosts
    * Listening Ports on Hosts
    * Mount Points on Hosts
    * Open Ports
    * Password Change (unix/linux)
    * Successful Login by Host, Users
    * User List

* Malicious IP List Reports
    * Globally Detected Malicious IPs
    * Malicious IPs on Map 

* Microsoft 365 Defender ATP Reports 
    * All Alerts

* Network Reports
    * Inbound Network Telemetry
    * Internal Traffic
    * Outbound Network Telemetry
    * Port Scanning Attempts
  
![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/network_reports.png?raw=true)

* Office 365 Reports
    * Azure Active Directory - Application Change/Update
    * Azure Active Directory - AuthorizationPolicy Change/Update
    * Azure Active Directory - Group Change/Update
    * Azure Active Directory - GroupMembership Change/Update
    * Azure Active Directory - Other Change/Update
    * Azure Active Directory - Policy Change/Update
    * Azure Active Directory - Role Change/Update
    * Azure Active Directory - ServicePrincipal Change/Update
    * Azure Active Directory - User Change/Update
    * Azure - Current Security Score
    * Azure - Current Security Score(In Percentage)
    * External Users Added to Teams
    * O365: Activity Over World (Unique Users)  
    * O365: Security & Compliance Center: Alert Details 
    * Office 365: Service Status
    * Office 365/Azure - Failed Logins
    * Office 365/Azure - Login from Unknown UserId
    * Office 365/Azure - Successful Logins

* Palo Alto Firewall Reports
    * DDoS Attack Prevented by Palo Alto Firewall
    * Inbound Traffic from Blocked IPs
    * List of Firewall Devices
    * Outbound Traffic to Blocked IPs
    * Palo Alto Firewall Login Failures
    * System Alerts and Threats

* Qualys Report

* Sophos Reports 
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

* Tenable Report

* VPN Reports
    * Connected Workforce by Location
    * Logins by Country
    * Logins by Success/Failure
    * Login Details
    * Successful vs Failed Logins
    * Unique Users by Country

* Windows Reports
    * Operation Attempted on Privileged Object (EventCode=4674)
    * Privileged Service Accessed (EventCode=4673)
    * Windows Users and Privileges (EventCode=4672)

* Windows Defender Reports 
    * Antimalware Dropped Support for OS or Antimalware Engine Dropped Support for OS
    * Antimalware will Drop Support for Operating System Soon 
    * Antimalware will Expire Soon 
    * Antivirus Expired 
    * Antivirus Scan Failed 
    * Malware Detected 
    * Unable to Download and Configure Offline Scan 
    * Update Errors
    * Windows Defender Health Report 
