---
layout: default
title: Alerts and Dashboards
permalink: /user_guide/alerts_dashboards/
nav_order: 4
parent: User Guide
---

# Alerts & Dashboards (security use-cases)

There are several security related alerts to choose from and they are all located under the **Settings** drop-down in the navigation bar (Settings > Settings > Searches, Reports and Alerts) of the Cyences App (alerts are disabled by default). There are also several security related reports to choose from and they are all located under the **Reports** drop-down in the navigation bar (Control > Reports) of the Cyences App. Alerts and reports should be reviewed regularly as they can help pinpoint any security risks that may be present in your Splunk environment. Each category contains the following alerts and reports (as dashboard panels):


## Active Directory
* Alerts:
    * AD - Bulk User Creation or Deletion
    * AD - Group Changed
    * AD - Group Membership Changed
    * AD - Group Policy Changed
    * AD - Multiple Password Changes in Short Time Period (in a Short Period of Time*)
    * AD - Password Change Outside Working Hour (Hours*)
    * AD - User Changed
    * AD - User Locked Out
* Dashboards:
    * AD - Group Changed
    * AD - Group Membership Changed
    * AD - Group Policy Changed
    * AD - Password Change Outside of Working Hours 
    * AD - User Account Locked Out
    * AD - User Changed
    * Failed Logons
    * Successful Logons

## Antivirus / Antimalware
* CrowdStrike Alerts:
    * CrowdStrike - Suspicious Activity or Malware Detected by CrowdStrike
* CrowdStrike Dashboards:
    * Suspicious Activity or Malware Detected
    * Suspicious Activity or Malware Prevented 
* Kaspersky Alerts:
    * N/A
* Kaspersky Dashboards:
    * Attack Detected
    * Application Database Out of Date
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
* Office 365 Defender ATP Alerts:
    * Defender ATP - Defender ATP Alerts
* Office 365 Defender ATP Dashboards:
    * All Alerts
* Sophos Alerts:
    * Sophos - Endpoint Not Protected by Sophos
    * Sophos - Failed to clean up threat by Sophos (Clean Up Threat*)
    * Sophos - Sophos RealTime Protection Disabled 
    * Sophos - Sophos Service is not Running (Not*)
* Sophos Dashboards:
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
* Windows Defender Alerts:
    * Windows Defender - Endpoint Not Protected by Windows Defender
    * Windows Defender - Windows Defender RealTime Protection Disabled or Failed
* Windows Defender Dashboards:
    * Antimalware Dropped Support for OS or Antimalware Engine Dropped Support for OS
    * Antimalware will Drop Support for Operating System Soon (Will*)
    * Antimalware will Expire Soon (Will*)
    * Antivirus Expired
    * Antivirus Scan Failed
    * Malware Detected
    * Unable to Download and Configure Offline Scan
    * Update Errors
    * Windows Defender Health Report

## Authentication (for all authentication related activities)
* Alerts:
    * Authentication - Bruteforce Attempt for a User
    * Authentication - Bruteforce Attempt from a Source
    * Authentication - Excessive Failed VPN Logins for a User
    * Authentication - Excessive Failed VPN Logins from a Source
    * Authentication - Long Running VPN Session Disconnected
    * Authentication - Successful VPN Login From New Location
    * Authentication - Successful VPN Login Outside Home Country
    * Authentication - VPN Login Attempts Outside Working Hours
* Dashboards:
    * All Authentications
    * Application Authentication Success Rate
    * Authentication Failure Reasons Over Time
    * User Authentication Activities 

## Cloud Tenancies
* Amazon Web Services Alerts:
    * N/A
* Amazone Web Services Dashboards:
    * Active Users
    * Error Activities
    * Most Recent User Activity Grouped by Event Name
    * Unauthorized Activities
    * User Activity by Event Name Over Time
    * User Activity by User Name Over Time
    * Total Activities 
* G Suite Alerts:
    * G Suite - Bulk User Creation or Deletion
    * G Suite - Multiple Password Changes in Short Time Period (in a Short Period of Time*)
* G Suite Dashboards:
    * Login Challenged
    * Login Failures
    * Login Types
    * Other Login Related Events
    * Password Updated
    * Successful Logins
    * User Created
    * User Deleted
* Microsoft Office 365 Alerts:
    * O365 - Authentication Blocked by Conditional Access Policy
    * O365 - Azure Active Directory - Application Change/Update 
    * O365 - Azure Active Directory - AuthorizationPolicy Change/Update
    * O365 - Azure Active Directory - Group Change/Update
    * O365 - Azure Active Directory - GroupMembership Change/Update
    * O365 - Azure Active Directory - Policy Change/Update 
    * O365 - Azure Active Directory - Role Change/Update
    * O365 - Azure Active Directory - ServicePrincipal Change/Update
    * O365 - Azure Active Directory - User Change/Update 
    * O365 - DLP event in Exchange (Event*)
    * O365 - DLP event in SharePoint (Event*) 
    * O365 - Daily Login Failure
    * O365 - External User Added to Microsoft Teams
    * O365 - Login Failure Due To Multi Factor Authentication
    * O365 - Login Failure Outside Home Country Due To Multi Factor Authentication
    * O365 - Login From Unknown User
    * O365 - O365 Service is not Operational (Not*)
    * O365 - Security Compliance Alert
    * O365 - Successful Login Outside Home Country
* Microsoft Office 365 Dashboards: 
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
    * Azure - Current Security Score(In Percentage) (Percentage*)
    * External Users Added to Teams
    * Login by Location
    * O365: Activity Over World (Unique Users)
    * O365: Security & Compliance Center: Alert Details
    * Office 365: Service Status (O365*)
    * Office 365/Azure - Failed Logins
    * Office 365/Azure - Login from Unknown UserId (UserID*)
    * Office 365/Azure - Successful Logins
    * 

## DNS Tracker
* Alerts:
    * N/A
* Dashboards:
    * DNS Log Volume Over Time
    * DNS Rquesters (Requesters*)
    * DNS Server
    * DNS Server No. of Queries Received 
    * DNS Server No. of Queries Send to External DNS Server (Sent*)
    * Internal DNS Server to DNS Server Requests
    * Record Types 
    * Record Types over Time (Over*)
    * Top Categories
    * Top External DNS Servers being Queried (Being*)
    * Top Non-success Code Queries (Unsuccessful*)
    * Top Non-success Code Requesters (Unsuccessful*)
    * Top Queries
    * Top Requesters 

## Email
* Microsoft Office 365 Alerts:
    * Email - Daily Spam Email 
    * Email - Hourly Increase in Emails Over Baseline 
* Microsoft Office 365 Dashboards:
    * N/A

## Lansweeper (asset management tool)
The Lansweeper dashboard is powered by Lansweeper's data [https://www.lansweeper.com](https://www.lansweeper.com). The Cyences app mainly uses this data for IT discovery and inventory. This dashboard displays information about every IT asset present in your environment. Here are some of the various types of IT assets which are acknowledged by Lansweeper: 

* Apple Macintosh 
* ESXi servers
* Hyper-V Guests
* Location
* Linux
* Monitor
* Network devices
* Other devices
* VMware Guests
* VMware vCenter services
* Web Servers
* Windows

The Lansweeper dashboard also provides information about whether the IT asset is sending useful security logs based on the type of asset. For example, Windows assets should send Sysmon, WinEventLog:Security, and WinEventLog:System logs for improved security on those assets.

* Alerts:
    * N/A
* Dashboards:
    * Apple Mac Devices
    * Linux Devices
    * Location
    * Monitor
    * Network Devices
    * Other Devices
    * VMWare/Hyper-V Guests - Linux
    * VMWare/Hyper-V Guests - Other
    * VMWare/Hyper-V Guests - Windows
    * VMWare vCenter server and ESXi server (Server* Server*)
    * Web Servers
    * Windows Devices 

## Network Devices (network reports dashboard)
* Cisco IOS Alerts:
    * Cisco IOS - Device Failed Login
    * Cisco IOS - New Connection For User
* Cisco IOS Dashboards:
    * N/A
* Fortinet FortiGate Alerts:
    * N/A
* Fortinet FortiGate Dashboards:
    * N/A
* Palo Alto Networks Alerts:
    * Palo Alto Firewall - Commits 
    * Palo Alto Firewall - Network Compromise - Palo Alto DNS Sinkhole
    * Palo Alto Firewall - Network Compromise - Palo Alto High System Alert
    * Palo Alto Firewall - Network Compromise - Palo Alto High Threats Alert
    * Palo Alto Firewall - Network Compromise - Palo Alto WildFire Alert
* Palo Alto Networks Dashboards:
    * DDoS Attack Prevented by Palo Alto Firewall
    * Inbound Traffic from Blocked IPs 
    * License Events
    * List of Firewall Devices
    * Outbound Traffic to Blocked IPs
    * Palo Alto Firewall Login Failures
    * System Alerts and Threats

## Ransomware
* Ransomware Alerts:
    * Ransomware - Common Ransomware File Extensions
    * Ransomware - Common Ransomware Notes
    * Ransomware - Endpoint Compromise - Fake Windows Processes
    * Ransomware - Endpoint Compromise - Network Compromise - TOR Traffic
    * Ransomware - Endpoint Compromise - USN Journal Deletion on Windows 
    * Ransomware - Endpoint Compromise - Windows - WMI Lateral Movement
    * Ransomware - Scheduled tasks used in BadRabbit ransomware (Tasks Used in BadRabbit Ransomware*)
    * Ransomware - Spike in File Writes
    * Ransomware - Windows - Windows Event Log Cleared
* Ransomware Dashboards:
    * N/A

## VPN
* Cisco Anyconnect Alerts: (duplicate alerts from authentication section for all 3)
    * N/A
* Cisco Anyconnect Dashboards: (use VPN dashboard panels for all 3)
    * N/A
* Fortinet FortiGate Alerts:
    * N/A
* Fortinet FortiGate Dashboards:
    * N/A
* GlobalProtect (Palo Alto) Alerts:
    * N/A
* GlobalProtect (Palo Alto) Dashboards:
    * N/A

## Vulnerability 

Supported vendor products include: CrowdStrike Spotlight, Nessus, Qualys & Tenable IO

These vendor security solutions are designed to detect vulnerabilities present in your environment.  

The Cyences app utilizes the data provided by the aforementioned vendor products to obtain information pertaining to any vulnerabilities that may exist on an IT asset within your environment.

The Vulnerability dashboard is designed to view the vulnerability count by severity, new vulnerabilities found over time, a vulnerability summary based on host(s), and a list of vulnerabilities. Splunk users can further use the drilldown capability to view a vulnerability list for a single host or a list of hosts affected by a vulnerability.


![alt](https://github.com/CrossRealms/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/vulnerability_dashboard.png?raw=true)


* CrowdStrike Spotlight Alerts:
    * N/A
* CrowdStrike Spotlight Dashboards: 
    * List Vulnerability dashboard panels
* Qualys Alerts:
    * N/A
* Qualys Dashboards:
    * List Vulnerability dashboard panels
* Tenable Alerts:
    * N/A
* Tenable Dashboards:
    * List Vulnerability dashboard panels
