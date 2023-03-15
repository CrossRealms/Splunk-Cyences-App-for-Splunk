---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 5
has_children: true
---

# Release Notes


## Version 3.1.0 (March 2023)

* ### Monitor Linux Groups & Users (Linux/Unix)
    * Added savedsearch and dashboard panels to track the group and user changes for the Linux environment.

* ### Sophos Firewall Integration
    * Mapped Sophos Firewall Traffic data with the Network_Traffic Model.
    * Added new Sophos Firewall dashboard
    ![alt]({{ site.baseurl }}/assets/sophos_firewall.png)
    * To onboard the Sophos Firewall data, Refer [Sophos Firewall Data Onboarding]({{ site.baseurl }}/data_onboarding/network_devices/sophos_firewall/)

* ### Inbound Vulnerable Traffic Alerts
    * Added new "Network Compromise - Inbound Vulnerable Traffic" to alerts the incoming traffic on the vulnerable port.

* ### Enhancements
    * VPN
        * Added more filters to filter results by Users (Multiselect), Host, Public IP Address and Private IP Address.
    
    * Bruteforce Alerts
        * Improved search query to show the count for src, user and dest fields.
        * Reduced severity from critical to high for windows event if src field value is unknown.

    * AD Password Change Alerts and Dashboard
        * Improved search query to show the count for ComputerName, status and Actor fields.
        * Added Probable Sources field to show the IP Address detail.


* ### Bug Fixes
    * Fixed the filter issue for the Windows Patch dashboard.

    * Fixed the permission issue for the cyences alert actions.

    * Fixed the auto extraction of additional fields for the cyences:notable:events sourcetype.

    * Fixed the search query for the Linux Successful login.

    * Fixed the Windows - Hosts Missing Update alert to handle hostname case sensitivity issue.
    
    * Fixed the "Email - Hourly Increase In Emails Over Baseline" alert to handle the data ingestion delay and fixed percentage calculation logic.


## Upgrade Guide from 3.0.0 to 3.1.0

* ### Monitor Linux Groups & Users (Linux/Unix)
    * Update TA-cyences Addon to latest version (v1.1.0) and enable the users.sh and groups.sh scripted inputs.


* ### Sophos Firewall Integration
    * To onboard the Sophos Firewall data, Refer [Sophos Firewall Data Onboarding]({{ site.baseurl }}/data_onboarding/network_devices/sophos_firewall/)
