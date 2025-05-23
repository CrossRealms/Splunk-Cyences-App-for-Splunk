---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 5
has_children: true
---

# Release Notes

## Version 5.3.0 (May 2025)

* ### New Integration for TrendMicro
    * #### Alerts
        * Trendmicro - Agent Removed
        * Trendmicro - Ransomware Bahavior Detected
        * Trendmicro - Remote Shell Used
        * Trendmicro - Deletion of Critical Security Artifacts
        * Trendmicro - Critical Observered Attack Technique Detected
    * #### Dashboard Panels
        * Obeserved Attack Techniques
        * Audit Logs
        * Trendmicro - Agent Removed
        * Trendmicro - Ransomware Bahavior Detected
        * Trendmicro - Remote Shell Used
        * Trendmicro - Deletion of Critical Security Artifacts
        * Trendmicro - Critical Observered Attack Technique Detected

* ### New Integration for Imperva WAF
    * #### Alerts
        * Imperva WAF - High volume of attacks from a source IP
        * Imperva WAF - Not Blocked Attacks
    * #### Dashboard Panels
        * Imperva WAF - Audit Logs

* ### New Integration for Imperva DAM
    * #### Alerts
        * Imperva DAM - Logins Outside Working Hours
    * #### Dashboard Panels
        * Imperva - DAM Alerts
        * Imperva DAM - Logins Outside Working Hours
        * Imperva DAM - Failed Logins by User

* ### Added new dashboards panels/alerts for Windows
    * #### Alerts
        * Windows - Disable or Uninstall Software or Agent
        * Windows - Shared Network Object Accessed with Privilege
    * #### Dashboard Panels
        * Windows RDP Successful Logons
        * Windows - Disable or Uninstall Software or Agent
        * Windows - End users tried to open CMD or PowerShell
        * Windows - Shared Network Object Accessed with Privilege

* ### Added new dashboards panels/alerts for O365
    * #### Alerts
        * O365 - Rejected/Quarantined Emails
        * O365 - External URL was Accessed
        * O365 - User Deleted Security Info 
    * #### Dashboard Panels
        * O365: Rejected/Quarantined Emails
        * O365: External URL was Accessed
        * O365: User Deleted Security Info

* ### Added new dashboards panels/alerts for Kaspersky
    * #### Alerts
        * Kaspersky - Critical Host Found
    * #### Dashboard Panels
        * Critical Host Found

* ### Added new dashboard panels for Windows AD
    * AD - Bulk User Creation or Deletion

* ### Added new dashboard panels for VPN
    * Failed VPN Logins by Users

* ### Added new dashboards panels for Palo Alto Networks
    * Palo Alto Configuration Changes

* ### Added new dashboards panels for Fortigate Firewall
    * Firewall Configuration Changes

* ### Enhancements
    * Added Windows EventCode-User_Action mapping lookup.
    * Added support of leef format logs for kaspersky.
    * Added fortigate success login source for **Usual Login Location Lookup Gen** alert.
    * Removed service principal user logins from O365 alrts.
    * Removed dependency from content update app.
    * Added report that assigns the privileges to the active directory domain admin group members if not assigned already.
    * Added version hotfix information in windows patch dashboard.
    * Added privilege activity panel and alert for oracle and linux.
    * Updated frequency of following alerts:
        * O365 authentication blocked by conditional access policy : from every hour to every half an hour.
        * AD password change outside working hours: from every day to every half an hour.
    * Excluded VPN logs from bruteforce alerts.
    * Added Appgate SDP VPN event support.

* ### Bug fixes
    * Fixed SERVICE_START and SERVICE_STOP event consideration issue for linux system firewall alert.
    * Fixed O365 success loign from unusual location alert by adding entries if we have diff country for same IP.




