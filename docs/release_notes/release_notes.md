---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 5
has_children: true
---

# Release Notes


## Version 3.0.0 (January 2023)

## Monitor Linux Groups & Users (Linux/Unix)
    * Added savedsearch and dashobard panels to track the group and user changes for the Linux environment.
    TODO: Need to update TA-cyences Apps and enable new inputs.
    TODO: Update Dashboards page with list of new panels.

## Inbound Vulnerable Traffic Alerts
    * Added new "Network Compromise - Inbound Vulnerable Traffic" to alerts the incoming traffic on the vulnerable port.

* ### Enhancements
    * VPN
        * Added more filters to filter results by Users (Multiselect), Host, Public IP Address and Private IP Address.
    
    * Bruteforce Alerts
        * Improved search query to show the count for src, user and dest fields.

    * AD Password Change Alerts and Dashboard
        * Improved search query to show the count for ComputerName, status and Actor fields.
        * Added Probable Sources field to show the IP Address detail.


* ### Bug Fixes
    * Fixed the filter issue for the Windows Patch dashboard.

    * Fixed the permission issue for the cyences alert actions.

    * Fixed the auto extraction of additional fields for the cyences:notable:events sourcetype.

    * Fixed the search query for the Linux Successful login.

    * Fixed the Windows - Hosts Missing Update alert to handle hostname case sensitivity issue.

## Upgrade Guide from 2.3.0 to 3.0.0