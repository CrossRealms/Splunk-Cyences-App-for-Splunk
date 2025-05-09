---
layout: default
title: Home
permalink: /
nav_order: 1
---

# Cyences Documentation

Splunkbase Download Add-on:
[https://splunkbase.splunk.com/app/5659](https://splunkbase.splunk.com/app/5659)

Splunkbase Download App:
[https://splunkbase.splunk.com/app/5351/](https://splunkbase.splunk.com/app/5351/)

## Overview
The Cyences App for Splunk was designed to allow users complete visibility of their system's security status. It was created with the intention of becoming a seamless piece of the Blue team arsenal for security engineers and administrators. The forensic interface based on the MITRE ATT&CK framework to quickly identify areas of concern. continuous quarterly enhancements are occurring towards achieving that goal. These updates will continue to improve tool customization and scalability with advanced search features, alerting, machine learning, and AI.

@CrossRealms International, We utilize the cyences as a part of our Unified Cyber Management Center (UCMC). For more detail, refer [UCMC Blog](https://crossrealms.com/ucmc/).

By default, the Cyences app provides a multitude of alerts and dashboards in the following categories:

* Antivirus / Antimalware
    * CrowdStrike  
    * Kaspersky
    * Office 365 Defender ATP
    * Sophos Endpoint Protection
    * Windows Defender 

* Cloud Tenancies
    * Amazon Web Services 
    * Google Workspace
    * Microsoft Office 365
        * Microsoft Azure Graph Security Score

* Email
    * Microsoft Office 365

* Database
    * MSSQL
    * Oracle

* Network Devices 
    * Cisco IOS
    * Fortinet FortiGate
    * Palo Alto Networks
    * Sophos Firewall
    * Cisco Meraki
    * F5 BIGIP
    * Cloudflare
    * Appgate SDP

* Vulnerability Scanners
    * CrowdStrike Spotlight
    * Qualys
    * Tenable
    * Nessus:Pro (Nessus Professional)

* Active Directory / Azure Active Directory 

* Windows
    * Windows Patch
    * Sysmon
    * Ransomware

* Linux / Unix 

* Authentication 

* VPN
    * Cisco Anyconnect
    * Fortinet FortiGate
    * GlobalProtect (Palo Alto)

* DNS Tracker

* Lansweeper 

* DUO

* RSA Radius Authentication
    * From Palo Alto system logs


Apart from alerts and dashboards, the Cyences App also integrates with some other well-known tools to create important dashboards that would add intelligence to your security investigation and auditing processes:

* Intelligence
* Device Inventory Table
* User Inventory Table


Cyences has other unique first in the market features on Splunk, like Alert Digest, Device Inventory, User Inventory, Network Telemetry, SOC AI Integration etc.

* **Alert Digest and Critical Email Alert**: In Cyences 3.0.0, we introduce a better way to look at alerts from Splunk so user don't get spammed by so many alerts from Splunk and get the critical alerts immediately while keeping the inbox clean. In Cyences user can configure their email address at once and get all the critical events from all the alerts without configuring their email on all of them separately. In addition to that Cyences has an alert called Digest Alert which sends all the medium and high severity notable events from all the alerts as a digest email only once a day. Please refer to [Cyences Email Settings for Alerts]({{ site.baseurl }}/install_configure/configuration/#cyences-email-settings-for-alerts) section for configuration guide and more information.

* **Device Inventory and Intelligence**: Version 1.2.0 of the Cyences app features a new component and that is the Device Inventory Table. It is a vital tool that helps with the security audit process and requires zero configuration. The Device Inventory Table lists all of the different devices present in an environment by correlating data from CrowdStrike, Lansweeper, Kaspersky, Qualys, Sophos, Tenable, Nessus:Pro, Windows Defender, etc. And there is one more dashboard called "Intelligence" which is very helpful for investigating a security incident. For more information, please refer to the [Device Inventory and Intelligence]({{ site.baseurl }}/user_guide/intelligence_dashboard/) section for more details.

* **User Inventory**: Version 4.3.0 of the Cyences app features a new component and that is the User Inventory Table. It provides information about users in an environment and user-related metadata, such as the number of users by their type, users associated with each product, etc. For more information, please refer to the [User Inventory]({{ site.baseurl }}/user_guide/intelligence_dashboard/) section for more details.

* **Network Telemetry**: Cyences has a dashboard called "Network Telemetry" which shows a very important information for security team. It shows if there is active traffic on a port on a machine which is vulnerable (or has known vulnerability), showing if vulnerability in your environment is actively being exploited. This is very critical information for security team.

* **SOC AI Integration**: Usually, Splunk events are hard to understand for any user without event logging/domain knowledge. This feature is useful to see the meaningful and human readable interpretation of the compliacted splunk events. Please refer to [SOC AI Integration]({{ site.baseurl }}/install_configure/configuration/#soc-ai-api-configuration) section for configuration guide and more information.

The Cyences App is a contribution-based project that anyone can provide suggestions for. Refer to the following link to offer general feedback or to report an issue: [https://github.com/CrossRealms/Splunk-Cyences-App-for-Splunk/issues](https://github.com/CrossRealms/Splunk-Cyences-App-for-Splunk/issues)

Visit the Cyences repository on GitHub for more information: [https://github.com/CrossRealms/Splunk-Cyences-App-for-Splunk](https://github.com/CrossRealms/Splunk-Cyences-App-for-Splunk)
