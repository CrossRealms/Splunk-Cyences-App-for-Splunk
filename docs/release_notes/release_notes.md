---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 5
has_children: true
---

# Release Notes


## Version 5.0.0 (September 2024)

* ### Alert Categorization


* Removed the following deprecated alerts:
    * O365 - Login Failure Outside Home Country Due To Multi Factor Authentication
    * O365 - Successful Login Outside Home Country
    * Authentication - Successful VPN Login Outside Home Country
    * Linux - Change in Sudo Access of Local Linux Account

* Removed the [Splunk Add-on for RWI - Executive Dashboard](https://splunkbase.splunk.com/app/5063/) dependency.


* ### Alert Renaming

    * Multiple Alerts have renamed as below, if you have any custom setting like sending email and stuff, that needs to be re-configured.

| Old Alert Name | New Alert Name |
|--------|--------|
| CrowdStrike - Suspicious Activity or Malware Detected by CrowdStrike | CrowdStrike - Suspicious Activity or Malware Detected |
| Defender ATP - Defender ATP Alerts | Defender ATP - Alerts |
| Sophos Endpoint Protection - Endpoint Not Protected by Sophos Endpoint Protection | Sophos - Endpoint Not Protected |
| Sophos Endpoint Protection - Sophos Endpoint RealTime Protection Disabled | Sophos - Endpoint RealTime Protection Disabled |
| Sophos Endpoint Protection - Sophos Endpoint Protection Service is not Running | Sophos - Endpoint Protection Service is Not Running |
| Sophos Endpoint Protection - Failed to CleanUp Threat by Sophos Endpoint Protection | Sophos - Failed to CleanUp Threat |
| Sophos Endpoint Protection - Failed to CleanUp Potentially Unwanted Application by Sophos | Sophos - Failed to CleanUp Potentially Unwanted Application |
| Windows Defender - Endpoint Not Protected by Windows Defender | Windows Defender - Endpoint Not Protected |
| Windows Defender - Windows Defender RealTime Protection Disabled or Failed | Windows Defender - RealTime Protection Disabled or Failed |
| AWS - IAM AccessKey Creation or Deletion | AWS - IAM Access Key Changes |
| AWS - IAM Login Profile Change/Update | AWS - IAM Login Profile Changes |
| AWS - IAM User Creation or Deletion | AWS - IAM User Changes |
| AWS - IAM Policy Creation or Deletion | AWS - IAM Policy Changes |
| AWS - IAM Group Change/Update | AWS - IAM Group Changes |
| AWS - IAM Group Membership Change/Update | AWS - IAM Group Membership Changes |
| AWS - IAM Role Creation or Deletion | AWS - IAM Role Changes |
| AWS - Network Access Control List Creation or Deletion | AWS - Network Access Control List Changes |
| AWS - Multi Factor Authentication is Disabled for IAM User | AWS - MFA is Disabled for IAM User |
| AWS - Login Failure From Unusual Country Due To Multi Factor Authentication | AWS - Login Failure From Unusual Country Due To MFA |
| Google Workspace - User Change/Update | Google Workspace - User Changes |
| Google Workspace - Enterprise Group Change/Update | Google Workspace - Group Changes |
| Google Workspace - Enterprise Group Membership Change/Update | Google Workspace - Group Membership Changes |
| Google Workspace - Role Change/Update | Google Workspace - Role Changes |
| Google Workspace - Multiple Password Changes in Short Time Period | Google Workspace - Multiple Password Changes in a Short Period of Time |
| O365 - DLP event in Exchange | O365 - DLP Event in Exchange |
| O365 - DLP event in SharePoint | O365 - DLP Event in SharePoint |
| O365 - O365 Service is not Operational | O365 - O365 Service is Not Operational |
| O365 - Azure Active Directory - AuthorizationPolicy Change/Update | Azure AD - AuthorizationPolicy Changes |
| O365 - Azure Active Directory - Policy Change/Update | Azure AD - Policy Changes |
| O365 - Azure Active Directory - Role Change/Update | Azure AD - Role Changes |
| O365 - Azure Active Directory - Group Change/Update | Azure AD - Group Changes |
| O365 - Azure Active Directory - GroupMembership Change/Update | Azure AD - GroupMembership Changes |
| O365 - Azure Active Directory - User Change/Update | Azure AD - User Changes |
| O365 - Azure Active Directory - ServicePrincipal Change/Update | Azure AD - ServicePrincipal Changes |
| O365 - Azure Active Directory - Application Change/Update | Azure AD - Application Changes |
| O365 - Login Failure Due To Multi Factor Authentication | O365 - Login Failure Due To MFA |
| O365 - Login Failure From Unusual Country Due To Multi Factor Authentication | O365 - Login Failure From Unusual Country Due To MFA |
| Email - Calculate UpperBound for Spike In Emails | Calculate UpperBound for Spike In Emails |
| Email - Hourly Increase In Emails Over Baseline | Hourly Increase In Emails Over Baseline |
| Email - Daily Spam Email | Daily Spam Emails |
| Network Compromise - Calculate UpperBound for Spike in Network Traffic | Calculate UpperBound for Spike in Network Traffic |
| Network Compromise - Calculate UpperBound for Spike in Outbound Network Traffic | Calculate UpperBound for Spike in Outbound Network Traffic |
| Network Compromise - DDoS Behavior Detected | DDoS Behavior Detected on the Network |
| Network Compromise - Unusual Outbound Traffic | Unusual Outbound Traffic |
| Network Compromise - Basic Scanning | Basic Network Scanning |
| Network Compromise - Inbound Vulnerable Traffic | Inbound Vulnerable Traffic |
| Fortigate Firewall - Network Compromise - Fortigate DNS Sinkhole | Fortigate - DNS Sinkhole |
| Fortigate Firewall - Network Compromise - Fortigate High Threats Alert | Fortigate - High Threats Alert |
| Fortigate Firewall - Network Compromise - Fortigate High System Alert | Fortigate - High System Alert |
| Palo Alto Firewall - Network Compromise - Palo Alto DNS Sinkhole | Palo Alto - DNS Sinkhole |
| Palo Alto Firewall - Network Compromise - Palo Alto High Threats Alert | Palo Alto - High Threats Alert |
| Palo Alto Firewall - Network Compromise - Palo Alto High System Alert | Palo Alto - High System Alert |
| Palo Alto Firewall - Network Compromise - Palo Alto WildFire Alert | Palo Alto - WildFire Alert |
| Palo Alto Firewall - Network Compromise - DDoS Attack Prevented | Palo Alto - DDoS Attack Prevented |
| Palo Alto Firewall - Network Compromise - Inbound Traffic from Blocked IPs | Palo Alto Firewall - Network Compromise - Inbound Traffic from Blocked IPs |
| Palo Alto Firewall - Network Compromise - Outbound Traffic to Blocked IPs | Palo Alto Firewall - Network Compromise - Outbound Traffic to Blocked IPs |
| Palo Alto Firewall - Commits | Palo Alto - Commits |
| Dynamically Update Blocked IPs with HoneyDB | Dynamically Update Blocked IPs with HoneyDB |
| Palo Alto Firewall - Malicious IP List Gen | Palo Alto Firewall - Malicious IP List Gen |
| Sophos Firewall - Firewall Lost Connection to Sophos Central | Sophos Firewall - Lost Connection to Sophos Central |
| Sophos Firewall - Firewall VPN Tunnel Down | Sophos Firewall - VPN Tunnel Down |
| Sophos Firewall - Firewall Gateway Down | Sophos Firewall - Gateway Down |
| Vulnerability - Detected Vulnerabilities | Detected New Vulnerabilities |
| Windows - Hosts Missing Update | Windows - Host is Missing Windows Updates |
| Windows - Endpoint Compromise - Windows Firewall Disabled Event | Windows - Firewall Disabled Event |
| Windows - Windows Process Tampering Detected | Windows - Process Tampering Detected |
| Windows - Windows Firewall is Disabled | Windows - Firewall is Disabled |
| AD - Group Changed | AD - Group Changes |
| AD - Group Membership Changed | AD - Group Membership Changes |
| AD - Group Policy Changed | AD - Group Policy Changes |
| AD - User Changed | AD - User Changes |
| AD - Password Change Outside Working Hour | AD - Password Change Outside Working Hours |
| AD - Multiple Password Changes in Short Time Period | AD - Multiple Password Changes in a Short Period of Time |
| Ransomware - Endpoint Compromise - Fake Windows Processes | Windows - Fake Windows Process |
| Ransomware - Endpoint Compromise - Network Compromise - TOR Traffic | TOR Traffic detected by Firewall |
| Ransomware - Common Ransomware File Extensions | Ransomware - Common Ransomware File Extensions |
| Ransomware - Scheduled tasks used in BadRabbit ransomware | Ransomware - Scheduled Tasks Used in BadRabbit Ransomware |
| Ransomware - Endpoint Compromise - USN Journal Deletion on Windows | USN Journal Deletion on Windows |
| Ransomware - Windows - Windows Event Log Cleared | Windows Event Log Cleared |
| Ransomware - Endpoint Compromise - Windows - WMI Lateral Movement | Windows WMI Lateral Movement |
| Credential Compromise - Windows - Credential Dumping through LSASS Access | Windows - Credential Dumping through LSASS Access |
| Credential Compromise - Windows - Credential Dumping via Symlink to Shadow Copy | Windows - Credential Dumping via Symlink to Shadow Copy |
| Credential Compromise - Windows - Credential Dumping via Copy Command from Shadow Copy | Windows - Credential Dumping via Copy Command from Shadow Copy |
| Credential Compromise - Windows - Credential Dump From Registry via Reg exe | Windows - Credential Dump From Registry via Reg exe |
| Authentication - VPN Login Attemps Outside Working Hours | Authentication - VPN Login Attempts Outside Working Hours |
| Linux - User Added/Updated/Deleted | Linux - User Changes |
| Linux - Group Added/Updated/Deleted | Linux - Group Changes |





* ### Enhancements

    * Added option to exclude informational vulnerability by default from the **Vulnerability** dashboard.

    * Enhanced the **Vulnerability - Detected Vulnerabilities** alert to detect new vulnerabilities in case of delayed ingestion of events.




## Upgrade Guide from 4.9.0 to 5.0.0

* Multiple rename has been reconfigured, please find the full list in the above release-notes section.
    * Run the below search to find-out any custom email configuration has been setup in your environment to be reconfigured in the new alert.
        ```
        | rest /servicesNS/-/cyences_app_for_splunk/saved/searches count=0 splunk_server=local
        | search title IN ("CrowdStrike - Suspicious Activity or Malware Detected by CrowdStrike", 
"Defender ATP - Defender ATP Alerts", 
"Sophos Endpoint Protection - Endpoint Not Protected by Sophos Endpoint Protection", 
"Sophos Endpoint Protection - Sophos Endpoint RealTime Protection Disabled", 
"Sophos Endpoint Protection - Sophos Endpoint Protection Service is not Running", 
"Sophos Endpoint Protection - Failed to CleanUp Threat by Sophos Endpoint Protection", 
"Sophos Endpoint Protection - Failed to CleanUp Potentially Unwanted Application by Sophos", 
"Windows Defender - Endpoint Not Protected by Windows Defender", 
"Windows Defender - Windows Defender RealTime Protection Disabled or Failed", 
"AWS - IAM AccessKey Creation or Deletion", 
"AWS - IAM Login Profile Change/Update", 
"AWS - IAM User Creation or Deletion", 
"AWS - IAM Policy Creation or Deletion", 
"AWS - IAM Group Change/Update", 
"AWS - IAM Group Membership Change/Update", 
"AWS - IAM Role Creation or Deletion", 
"AWS - Network Access Control List Creation or Deletion", 
"AWS - Multi Factor Authentication is Disabled for IAM User",
"AWS - Login Failure From Unusual Country Due To Multi Factor Authentication",
"Google Workspace - User Change/Update", 
"Google Workspace - Enterprise Group Change/Update", 
"Google Workspace - Enterprise Group Membership Change/Update", 
"Google Workspace - Role Change/Update", 
"Google Workspace - Multiple Password Changes in Short Time Period", 
"O365 - Login Failure Due To Multi Factor Authentication",
"O365 - Login Failure From Unusual Country Due To Multi Factor Authentication",
"O365 - DLP event in Exchange", 
"O365 - DLP event in SharePoint", 
"O365 - O365 Service is not Operational", 
"O365 - Azure Active Directory - AuthorizationPolicy Change/Update", 
"O365 - Azure Active Directory - Policy Change/Update", 
"O365 - Azure Active Directory - Role Change/Update", 
"O365 - Azure Active Directory - Group Change/Update", 
"O365 - Azure Active Directory - GroupMembership Change/Update", 
"O365 - Azure Active Directory - User Change/Update", 
"O365 - Azure Active Directory - ServicePrincipal Change/Update", 
"O365 - Azure Active Directory - Application Change/Update", 
"Email - Calculate UpperBound for Spike In Emails", 
"Email - Hourly Increase In Emails Over Baseline", 
"Email - Daily Spam Email", 
"Network Compromise - Calculate UpperBound for Spike in Network Traffic", 
"Network Compromise - Calculate UpperBound for Spike in Outbound Network Traffic", 
"Network Compromise - DDoS Behavior Detected", 
"Network Compromise - Unusual Outbound Traffic", 
"Network Compromise - Basic Scanning", 
"Network Compromise - Inbound Vulnerable Traffic", 
"Fortigate Firewall - Network Compromise - Fortigate DNS Sinkhole", 
"Fortigate Firewall - Network Compromise - Fortigate High Threats Alert", 
"Fortigate Firewall - Network Compromise - Fortigate High System Alert", 
"Palo Alto Firewall - Network Compromise - Palo Alto DNS Sinkhole", 
"Palo Alto Firewall - Network Compromise - Palo Alto High Threats Alert", 
"Palo Alto Firewall - Network Compromise - Palo Alto High System Alert", 
"Palo Alto Firewall - Network Compromise - Palo Alto WildFire Alert", 
"Palo Alto Firewall - Network Compromise - DDoS Attack Prevented", 
"Palo Alto Firewall - Network Compromise - Inbound Traffic from Blocked IPs", 
"Palo Alto Firewall - Network Compromise - Outbound Traffic to Blocked IPs", 
"Palo Alto Firewall - Commits", 
"Dynamically Update Blocked IPs with HoneyDB", 
"Palo Alto Firewall - Malicious IP List Gen", 
"Sophos Firewall - Firewall Lost Connection to Sophos Central", 
"Sophos Firewall - Firewall VPN Tunnel Down", 
"Sophos Firewall - Firewall Gateway Down", 
"Vulnerability - Detected Vulnerabilities", 
"Windows - Hosts Missing Update", 
"Windows - Endpoint Compromise - Windows Firewall Disabled Event", 
"Windows - Windows Process Tampering Detected", 
"Windows - Windows Firewall is Disabled", 
"AD - Group Changed", 
"AD - Group Membership Changed", 
"AD - Group Policy Changed", 
"AD - User Changed", 
"AD - Password Change Outside Working Hour", 
"AD - Multiple Password Changes in Short Time Period", 
"Ransomware - Endpoint Compromise - Fake Windows Processes", 
"Ransomware - Endpoint Compromise - Network Compromise - TOR Traffic", 
"Ransomware - Common Ransomware File Extensions", 
"Ransomware - Scheduled tasks used in BadRabbit ransomware", 
"Ransomware - Endpoint Compromise - USN Journal Deletion on Windows", 
"Ransomware - Windows - Windows Event Log Cleared", 
"Ransomware - Endpoint Compromise - Windows - WMI Lateral Movement", 
"Credential Compromise - Windows - Credential Dumping through LSASS Access", 
"Credential Compromise - Windows - Credential Dumping via Symlink to Shadow Copy", 
"Credential Compromise - Windows - Credential Dumping via Copy Command from Shadow Copy", 
"Credential Compromise - Windows - Credential Dump From Registry via Reg exe", 
"Authentication - VPN Login Attemps Outside Working Hours", 
"Linux - User Added/Updated/Deleted", 
"Linux - Group Added/Updated/Deleted")
        | fields title, "action.email*"
        | where 'action.email'!=0
        ```
