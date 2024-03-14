---
layout: default
title: Alerts and Dashboards
permalink: /user_guide/alerts_dashboards/
nav_order: 5
parent: User Guide
---

# Alerts & Dashboards (security use-cases)

There are several security related alerts to choose from and they are all located under the **Settings** drop-down in the navigation bar (**Settings > Settings > Searches, Reports and Alerts**) of the Cyences App (alerts are disabled by default). There are also several security related dashboards to choose from and they are all located under the **Dashboards** drop-down in the navigation bar of the Cyences App. Alerts and dashboards should be reviewed regularly as they can help pinpoint any security risks that may be present in your Splunk environment. Each category contains the following alerts and dashboards (as dashboard panels):


## Authentication (for all authentication related activities)
* Alerts:
    * Authentication - Bruteforce Attempt for a User
    * Authentication - Bruteforce Attempt from a Source
    * Authentication - Excessive Failed VPN Logins for a User
    * Authentication - Excessive Failed VPN Logins from a Source
    * Authentication - Long Running VPN Session Disconnected
    * Authentication - Successful VPN Login From Unusual Country
    * Authentication - Successful VPN Login Outside Home Country
    * Authentication - VPN Login Attempts Outside Working Hours
    * Authentication - Failed VPN Login From Unusual Country
* Dashboard panels:
    * All Authentications
    * Application Authentication Success Rate
    * Authentication Failure Reasons Over Time
    * User Authentication Activities 


## Antivirus / Antimalware
* CrowdStrike Alerts:
    * CrowdStrike - Suspicious Activity or Malware Detected by CrowdStrike
* CrowdStrike Dashboard panels:
    * Suspicious Activity or Malware Detected
    * Suspicious Activity or Malware Prevented 
* Kaspersky Dashboard panels:
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
* Office 365 Defender ATP Dashboard panels:
    * All Alerts
* Sophos Endpoint Protection Alerts:
    * Sophos Endpoint Protection - Endpoint Not Protected by Sophos Endpoint Protection
    * Sophos Endpoint Protection - Sophos Endpoint RealTime Protection Disabled 
    * Sophos Endpoint Protection - Sophos Endpoint Protection Service is not Running 
    * Sophos Endpoint Protection - Failed to CleanUp Threat by Sophos Endpoint Protection
    * Sophos Endpoint Protection - Failed to CleanUp Potentially Unwanted Application by Sophos
* Sophos Endpoint Protection Dashboard panels:
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
    * Windows Defender - Malware Detected
* Windows Defender Dashboard panels:
    * Antimalware Dropped Support for OS or Antimalware Engine Dropped Support for OS
    * Antimalware will Drop Support for Operating System Soon 
    * Antimalware will Expire Soon 
    * Antivirus Expired
    * Antivirus Scan Failed
    * Malware Detected
    * Unable to Download and Configure Offline Scan
    * Update Errors
    * Windows Defender Health Report


## Cloud Tenancies
* Amazone Web Services Alerts:
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
    * AWS - Failed Login From Unusual Country
* Amazone Web Services Dashboard panels:
    * Active Users
    * Login Types
    * Login by Location
    * Successful Logins
    * Failed Logins
    * AWS - IAM - Policy Creation/Deletion
    * AWS - IAM - Role Creation/Deletion
    * AWS - IAM - AccessKey Creation/Deletion
    * AWS - IAM - Login Profile Change/Update
    * AWS - IAM - Group Change/Update
    * AWS - IAM - GroupMembership Change/Update
    * AWS - IAM - User Creation/Deletion
    * AWS - Network Access Control List Creation/Deletion
    * Most Recent User Activity Grouped by Event Name
    * Total Activities 
    * Error Activities
    * Unauthorized Activities
    * User Activity by Event Name Over Time
    * User Activity by User Name Over Time
* Google Workspace Alerts:
    * Google Workspace - Bulk User Creation or Deletion
    * Google Workspace - User Change/Update
    * Google Workspace - Enterprise Group Change/Update
    * Google Workspace - Enterprise Group Membership Change/Update
    * Google Workspace - Role Change/Update
    * Google Workspace - Multiple Password Changes in Short Time Period
    * Google Workspace - Successful Login From Unusual Country
    * Google Workspace - Suspicious Login Activity by User
    * Google Workspace - Daily Login Failure
    * Google Workspace - Alerts Center Alert
    * Google Workspace - Google Drive objects shared Outside or with External User
    * Google Workspace - Google Drive objects accessed by External User
    * Google Workspace - Suspicious File Shared by External User on Google Drive
    * Google Workspace - Failed Login From Unusual Country
* Google Workspace Dashboard panels:
    * Login Types
    * Login by Location
    * Login Challenged
    * Login Failures
    * Successful Logins
    * Password Updated
    * Other Login Related Events
    * Google Workspace - Alerts Center Details
    * Google Workspace - Role Change/Update
    * Google Workspace - Enterprise Group Change/Update
    * Google Workspace - Enterprise GroupMembership Change/Update
    * Google Workspace - User Change/Update
    * Google Drive objects shared Outside or with External User
    * Google Drive objects accessed by External User
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
    * O365 - DLP event in Exchange 
    * O365 - DLP event in SharePoint 
    * O365 - Daily Login Failure
    * O365 - External User Added to Microsoft Teams
    * O365 - Login Failure Due To Multi Factor Authentication
    * O365 - Login Failure From Unusual Country Due To Multi Factor Authentication
    * O365 - Login Failure Outside Home Country Due To Multi Factor Authentication
    * O365 - Login From Unknown User
    * O365 - O365 Service is not Operational 
    * O365 - Security Compliance Alert
    * O365 - Successful Login From Unusual Country
    * O365 - Successful Login Outside Home Country
    * O365 - Failed Login From Unusual Country
    * O365 - OneDrive or SharePoint File Sharing with External User
    * O365 - OneDrive or SharePoint Link Accessed By External User
* Microsoft Office 365 Dashboard panels: 
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
    * Login by Location
    * O365: Activity Over World (Unique Users)
    * O365: Security & Compliance Center: Alert Details
    * Office 365: Service Status 
    * Office 365/Azure - Failed Logins
    * Office 365/Azure - Login from Unknown UserId 
    * Office 365/Azure - Successful Logins
    * OneDrive or SharePoint File Sharing with External User
    * OneDrive or SharePoint Link Accessed By External User


## Email
* Alerts:
    * Email - Daily Spam Email 
    * Email - Hourly Increase in Emails Over Baseline
    * Email - Suspicious Subject or Attachment
    * Email - With Known Abuse Web Service Link


## Network Devices
* General alerts for all Network Data:
    * Network Compromise - Basic Scanning
    * Network Compromise - Inbound Vulnerable Traffic
    * Network Compromise - DDoS Behavior Detected

* Cisco IOS Alerts:
    * Cisco IOS - Device Failed Login
    * Cisco IOS - New Connection For User
* Fortigate Firewall Alerts:
    * Fortigate Firewall - Network Compromise - Fortigate DNS Sinkhole
    * Fortigate Firewall - Network Compromise - Fortigate High Threats Alert
    * Fortigate Firewall - Network Compromise - Fortigate High System Alert
* Fortigate Firewall Dashboard panels:
    * List of Firewall Devices
    * Fortigate Firewall Login Failures
    * System Alerts and Threats
* Palo Alto Networks Alerts:
    * Palo Alto Firewall - Commits 
    * Palo Alto Firewall - Network Compromise - Palo Alto DNS Sinkhole
    * Palo Alto Firewall - Network Compromise - Palo Alto High System Alert
    * Palo Alto Firewall - Network Compromise - Palo Alto High Threats Alert
    * Palo Alto Firewall - Network Compromise - Palo Alto WildFire Alert
* Palo Alto Networks Dashboard panels:
    * DDoS Attack Prevented by Palo Alto Firewall
    * Inbound Traffic from Blocked IPs 
    * License Events
    * List of Firewall Devices
    * Outbound Traffic to Blocked IPs
    * Palo Alto Firewall Login Failures
    * System Alerts and Threats
* Sophos Firewall Dashboard panels:
    * ATP & IPS Events
    * List of Firewall Devices
    * System Events


## Network Telemetry
Cyences has a dashboard called "Network Telemetry" which shows if there is active traffic on a port on a machine which is vulnerable (or has known vulnerability detected by vulnerability scanner in your environment), showing if vulnerability in your environment is actively being exploited. This is very critical information for security team.
(Basically we correlate data from vulnerability tools like Qualys or Tenable and correlate with Network Traffic logs from Palo Alto or Fortigate to show if the target is being actively exploited. This would have been very difficult to implement with traditional security tools.)

* Dashboard panels:
    * Port Scanning Attempts
    * Inbound Network Telemetry
    * Outbound Network Telemetry
    * Internal Traffic


## Vulnerability

* Alerts:
    * Vulnerability - Detected Vulnerabilities

Supported vendor products include: CrowdStrike Spotlight, Nessus, Qualys & Tenable IO

These vendor security solutions are designed to detect vulnerabilities present in your environment.

The Cyences app utilizes the data provided by the aforementioned vendor products to obtain information pertaining to any vulnerabilities that may exist on an IT asset within your environment.

The Vulnerability dashboard is designed to view the vulnerability count by severity, new vulnerabilities found over time, a vulnerability summary based on host(s), and a list of vulnerabilities. Splunk users can further use the drilldown capability to view a vulnerability list for a single host or a list of hosts affected by a vulnerability.

Dashboard panels:
* New Vulnerability Found Over Time
* Vulnerabilities
* Vulnerability Count By Severity

![alt]({{ site.baseurl }}/assets/vulnerability_dashboard.png)


## Windows

* Alerts:
    * Windows - Hosts Missing Update
    * Windows - Endpoint Compromise - Windows Firewall Disabled Event
    * Windows - Windows Process Tampering Detected
    * Windows - Windows Firewall is Disabled
    * Windows - Certificate is Expiring Soon
* Dashboard panels:
    * Windows Users and Privileges
    * Privileged Service Accessed
    * Operation Attempted on Privileged Object 
    * Listening Ports on Host
    * Windows Firewall Status
    * Windows Update Events
    * Microsoft Endpoint Protection/Microsoft Defender Antivirus Update Events
    * Approved Certificate Request
    * Issued Certificates on CA
    * Local Certificates On Servers


## Active Directory
* Alerts:
    * AD - Bulk User Creation or Deletion
    * AD - Group Changed
    * AD - Group Membership Changed
    * AD - Group Policy Changed
    * AD - Multiple Password Changes in Short Time Period 
    * AD - Password Change Outside Working Hour 
    * AD - User Changed
    * AD - User Locked Out
* Dashboard panels:
    * AD - Group Changed
    * AD - Group Membership Changed
    * AD - Group Policy Changed
    * AD - Password Change Outside of Working Hours 
    * AD - User Account Locked Out
    * AD - User Changed
    * Failed Logons
    * Successful Logons


## DNS Tracker
* Dashboard panels:
    * DNS Log Volume Over Time
    * DNS Rquesters 
    * DNS Server
    * DNS Server No. of Queries Received 
    * DNS Server No. of Queries Send to External DNS Server 
    * Internal DNS Server to DNS Server Requests
    * Record Types 
    * Record Types over Time 
    * Top Categories
    * Top External DNS Servers being Queried 
    * Top Non-success Code Queries 
    * Top Non-success Code Requesters 
    * Top Queries
    * Top Requesters 


## Ransomware
* Ransomware Alerts:
    * Ransomware - Common Ransomware File Extensions
    * Ransomware - Common Ransomware Notes
    * Ransomware - Endpoint Compromise - Fake Windows Processes
    * Ransomware - Endpoint Compromise - Network Compromise - TOR Traffic
    * Ransomware - Endpoint Compromise - USN Journal Deletion on Windows 
    * Ransomware - Endpoint Compromise - Windows - WMI Lateral Movement
    * Ransomware - Scheduled tasks used in BadRabbit ransomware 
    * Ransomware - Spike in File Writes
    * Ransomware - Windows - Windows Event Log Cleared
    * Ransomware - Endpoint Compromise - Malicious Package Found


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

* Dashboard panels:
    * Apple Mac Devices
    * Linux Devices
    * Location
    * Monitor
    * Network Devices
    * Other Devices
    * VMWare/Hyper-V Guests - Linux
    * VMWare/Hyper-V Guests - Other
    * VMWare/Hyper-V Guests - Windows
    * VMWare vCenter server and ESXi server 
    * Web Servers
    * Windows Devices


## Linux/Unix
* Alerts:
    * Linux - User Added/Updated/Deleted
    * Linux - Group Added/Updated/Deleted
* Dashboard panels:
    * Hosts Details
    * Linux Group Added/Updated/Removed
    * Linux User Added/Updated/Removed
    * Success Login by Host, Users
    * Failed Login by Host, Users
    * Password Change(unix/linux)
    * Interfaces on Hosts
    * Mount Points on Hosts
    * Listening Ports on Host
    * List of Services on Hosts


## VPN
* Supported Systems:
    * Cisco Anyconnect
    * Fortinet FortiGate
    * GlobalProtect (Palo Alto)
* Alerts:
    * Authentication - Bruteforce Attempt for a User
    * Authentication - Bruteforce Attempt from a Source
    * Authentication - Excessive Failed VPN Logins for a User
    * Authentication - Excessive Failed VPN Logins from a Source
    * Authentication - Long Running VPN Session Disconnected
    * Authentication - Successful VPN Login From Unusual Country
    * Authentication - Successful VPN Login Outside Home Country
    * Authentication - VPN Login Attempts Outside Working Hours
* Dashboard panels: 
    * Connected Workforce by Location
    * Elapsed Time Per Session
    * Login Details
    * Logins by Country
    * Logins by Success/Failure 
    * Successful Session
    * Successful vs Failed Logins
    * Unique Users by Country


## RSA Radius Authentication
* Supported Systems
    * Palo Alto system logs
* Alerts:
    * RSA Radius Authentication - Excessive Failed Logins for a User
* Dashboard panels:
    * RSA Radius Authentications
    * RSA Radius Authentication Success Rate
    * RSA Radius Authentication Activities
