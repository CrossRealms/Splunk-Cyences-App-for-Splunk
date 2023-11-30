---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 5
has_children: true
---

# Release Notes


## Version 4.5.0 (December 2023)

* ### Fortigate Firewall

    * Added new alerts:
        * Fortigate Firewall - Network Compromise - Fortigate DNS Sinkhole
        * Fortigate Firewall - Network Compromise - Fortigate High Threats Alert
        * Fortigate Firewall - Network Compromise - Fortigate High System Alert

    * Added new dashboard named **Fortigate Firewall**

* ### Added new alert for O365, AWS and Google Workspace

    * O365 - Failed Login From Unusual Country
    * AWS - Failed Login From Unusual Country
    * Google Workspace - Failed Login From Unusual Country

* ### User Privilege Option

    * Added option to privilege the user on **User Inventory** dashboard.
    * Added the IsPrivilegedUser field to the User Inventory table to identify privileged users.
    * Modified the severity of all the user activity related alerts based on the privileged user.


* ### Enhancements  

    * For **Network Compromise - DDoS Behavior Detected** alert, A new is_internal_top5_src_ip field was added to identify whether the source IP is internal or external, and the severity has been updated accordingly.

    * Hiding the security components from **Device Inventory** dashboard that are not relevent to the splunk environment.

    * Renamed **Sophos** to the more specific product name **Sophos Endpoint Detection**


* ### Bug Fixes

    * Fixed the issue where Sophos devices were being merged in device inventory unnecessarily. It's caused by multiple devices sharing the same mac address.

    * Fixed an issue with selecting a checkbox while paginating the Forensics dashboard table.


## Upgrade Guide from 4.4.0 to 4.5.0

  * To grant privileges to the user, refer [User Inventory]({{ site.baseurl }}/user_guide/intelligence_dashboard/) section.