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

* ### Added new dashboards panels for for oracle.
    * #### Alerts
        * Oracle - Privilege Activities
    * #### Dashboard Panels
        * Privilege Activities

* ### Added new dashboards panels for for linux.
    * #### Alerts
        * Linux - Privilege Activities
    * #### Dashboard Panels
        * Privilege Activities

* Added Appgate SDP VPN event support.

* ### Enhancements
    * Added lookup `cs_windows_defender_eventcode_mapping` to map Windows EventCode to User Action and Description.
    * Added support of leef format logs for kaspersky.
    * Removed service principal user logins from Office 365 alerts.
    * Removed the ES Content Update app dependency and added useful lookup for **Windows - Fake Windows Process** alert.
    * Added report that assigns the privileges to the active directory domain admin group members if not assigned already.
    * Added version hotfix information in windows patch dashboard.
    * Updated frequency of following alerts:
        * O365 authentication blocked by conditional access policy : from every hour to every half an hour.
        * AD password change outside working hours: from every day to every half an hour.
    * Excluded VPN logs from bruteforce alerts as we already have a separate alert for the VPN logins.
    * Enhanced the **Linux - System Firewall Service Stopped** alert by removing system restart incident which generates the false positives.

* ### Bug fixes
    * Fixed the usual login location details by adding FortiGate success login source to Usual Login Location Lookup Gen report.
    * To avoid false positives, added additional entry to the Usual Login Location Lookup for the same IP for which we have diff country names in event and output of iplocation command.
