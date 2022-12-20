---
layout: default
title: Home
permalink: /
nav_order: 1
---

# Cyences Documentation

## Download
Download the Cyences App for Splunk from Splunkbase: [https://splunkbase.splunk.com/app/5351/](https://splunkbase.splunk.com/app/5351/)


--> <TODO-Ahad> - Below two sections we'll be copy pasting as it is on the Splunkbase's details page, so please write it accordingly. - https://splunkbase.splunk.com/app/5351

## Overview
The Cyences App for Splunk was designed to allow users complete visibility of their system's security status. It was created with the intention of becoming a seamless piece of the Blue team arsenal; continuous quarterly enhancements are occurring towards achieving that goal. (update if neccessary?)

The Cyences App for Splunk was designed to allow users complete visibility of their system's security status. Our vision is a single dashboard showcasing the entire security profile of any user's environment from the office to the cloud and everything else in between. The forensic interface based on the MITRE ATT&CK framework is well equipped to quickly identify areas of concern with first to market countermeasures. These measures that are commonly used in security incidents allow Splunk users to take swift action against hackers. Cyences was created with the intention of becoming a seamless piece of the Blue team arsenal for security engineers and administrators; continuous quarterly enhancements will occur to achieve that goal. These updates will continue to improve tool customization and scalability with advanced search features, alerting, machine learning, and AI. (update if necessary?)

By default, the Cyences app provides a multitude of alerts and reports in the following categories:

* Active Directory / Azure Active Directory 
* Linux / Unix 
* Windows
    * Windows Patch
    * Sysmon

* Antivirus / Antimalware
    * CrowdStrike  
    * Kaspersky
    * Office 365 Defender ATP
    * Sophos Central
    * Windows Defender 

* Authentication 

* Cloud Tenancies
    * Amazon Web Services 
    * G Suite
    * Microsoft Office 365
        * Microsoft Azure Graph Security Score

* DNS Tracker

* Email
    * Microsoft Office 365

* Lansweeper 

* Network Devices 
    * Cisco IOS
    * Fortinet FortiGate 
    * Palo Alto Networks
    --> <TODO-Mahir> - please validate, add if anything is missing

* Ransomware

* VPN
    * Cisco Anyconnect 
    * Fortinet FortiGate
    * GlobalProtect (Palo Alto)
    --> <TODO-Mahir> - please validate, add if anything is missing

* Vulnerability
    * CrowdStrike Spotlight
    * Qualys
    * Tenable 


--> <TODO-Mahir> - Let's categorize the navigation as above if not yet 


Apart from alerts and reports, the Cyences App also integrates with some other well-known tools to create important dashboards that would add intelligence to your security investigation and auditing processes:

* Asset Intelligence 
* Device Inventory Table
* Globally Detected Malicious IPs


--> <TODO-Mahir> - let's keep only above 3 in the intelligence section, rest move to reports section in the navigation. (which is where?)

How does the Cyences app differentiate itself from Enterprise Security?

For new Splunk users, Enterprise Security requires a lot of fine tuning in order to get the most optimal experience and they may have trouble doing so as there's so much to learn before even reaching that point. For example, users have to configure several correlation searches within Enterprise Security and understand how it ties into specific use cases as well. On the other hand, the Cyences app was created with having one goal in mind and that is to provide an out of the box end-to-end security solution. Meaning, Splunk users don't have to configure all that much in order to get things started right away. Additionally, the alerting feature found within the Cyences app allows users to receive alerts via Slack or by email all while keeping the false positives at a bare minimum.

--> <TODO-Ahad/Vatsal> - Please add what we are doing with Network Telemetry dashboard. (Correlation of vulnerabilities data with Network data.)

--> <TODO-Ahad/Vatsal> - Please add high level paragraph for Device Inventory and Asset Intelligence here. Remove it's relevant details from the below paragraph to avoid duplication.

--> <TODO-Mahir> - Please rename Network Reports (dashboard) to Network Telemetry (dashboard).

We're always looking to improve the Cyences app by incorporating new features when possible. The first build came equipped with the Globally Detected Malicious IPs dashboard, which is one of the more prominent features of the Cyences app. This dashboard helps monitor bad traffic and it contains other insightful information such as if an IP address is associated with a distributed denial-of-service (DDoS) attack. For more information, please refer to the **Globally Detected Malicious IPs** section. Version 1.2.0 of the Cyences app features a new component and that is the Device Inventory Table. It's a vital tool that helps with the security audit process and requires zero configuration. It lists all the different devices present in an environment by correlating data from CrowdStrike, Lansweeper, Kaspersky, Qualys, Sophos, Tenable, and Windows Defender. For more information, please refer to the **Device Inventory** section.

The Cyences App is a contribution-based project that anyone can provide suggestions for. Refer to the following link to offer general feedback or to report an issue: [https://github.com/CrossRealms/Splunk-Cyences-App-for-Splunk/issues](https://github.com/CrossRealms/Splunk-Cyences-App-for-Splunk/issues)

Visit the Cyences repository on GitHub for more information: [https://github.com/CrossRealms/Splunk-Cyences-App-for-Splunk](https://github.com/CrossRealms/Splunk-Cyences-App-for-Splunk)