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
        * Trendmicro - Agent Removed by Non-Admin User
        * Trendmicro - Ransomware Bahavior Detected
        * Trendmicro - Remote Shell Used by Non-Admin User
        * Trendmicro - Deletion of Critical Security Artifacts
        * Trendmicro - Critical Observered Attack Technique Detected
    * #### Dashboard Panels
        * Obeserved Attack Techniques
        * Audit Logs
        * Agent Removed By Non-Admin User
        * Ransomware Bahavior Detected
        * Remote Shell Used by Non-Admin User
        * Deletion of Critical Security Artifacts
        * Critical Observered Attack Technique Detected

* ### New Integration for Imperva WAF
    * #### Alerts
        * Imperva WAF - High volume of attacks from a source IP
        * Imperva WAF - Not Blocked Attacks
    * #### Dashboard Panels
        * Audit Logs

* ### New Integration for Imperva DAM
    * #### Alerts
        * Imperva DAM - Logins Outside Working Hours
        * Imperva DAM - Multiple Failed Logins
    * #### Dashboard Panels
        * Alerts
        * Logins Outside Working Hours

* ### Added new dashboards panels/alerts for Windows
    * #### Alerts
        * Windows - Uninstall Attempt for Software or Agent
        * Windows - Privileged Network shared object was Accessed
    * #### Dashboard Panels
        * Uninstall Attempt for Software or Agent (EventCode="11724,11725")
        * End users tried to open CMD or PowerShell (EventCode=4688)
        * Privileged Network shared object was Accessed (EventCode=5140)

* ### Added new dashboards panels/alerts for O365
    * #### Alerts
        * O365 - Rejected/Quarantined Emails
        * O365 - External URL was Accessed
        * Azure AD - User Deleted Security Info 
    * #### Dashboard Panels
        * Rejected/Quarantined Emails
        * External URL was Accessed
        * User Deleted Security Info

* ### Added new dashboards panels/alerts for Kaspersky
    * #### Alerts
        * Kaspersky - Critical Host Found
    * #### Dashboard Panels
        * Kaspersky Critical Host Found

* ### Added new dashboard panels for Windows AD
    * AD - Bulk User Creation or Deletion

* ### Added new dashboard panels for VPN
    * Failed VPN Logins by Users

* ### Added new dashboards panels for Palo Alto Networks
    * Palo Alto Configuration Changes

* ### Added new dashboards panels for Fortigate Firewall
    * Firewall Configuration Changes

* ### Enhancements
    * Added lookup `cs_windows_defender_eventcode_mapping` to map Windows EventCode to User Action.
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
