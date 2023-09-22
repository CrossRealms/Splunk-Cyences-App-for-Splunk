---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 5
has_children: true
---

# Release Notes


## Version 4.3.0 (September 2023)

* ### User Inventory
    * Added the "User Inventory" dashboard.
    * Added the following saved seraches to maintain `cs_user_inventory` KV lookup:
        * User Inventory - Lookup Gen
        * User Inventory - Lookup CleanUp
        * User Inventory - Merge Similar Users
        * User Inventory - Lookup Backfill
    * Added macros for filtering and matching user data without prefixes and postfixes.


* ### Enhancements  

    * #### Device Inventory
        * Enhanced the device inventory logic by: 
            * Updating the device matching and hostname matching logic.
            * Modifying its data structure.
            * Adding the functionality to auto merge devices.
            * Updating the functionality to manual merge devices.
        * Updated the following dashboards by updating its searches:
            * Device Inventory
            * Asset Intelligence
            * DNS Tracker
        * Improved the searches for the following saved searches:
            * Device Inventory - Lansweeper
            * Device Inventory - Tenable
            * Device Inventory - Tenable Vuln
            * Device Inventory - Qualys
            * Device Inventory - Sophos
            * Device Inventory - Windows Defender
            * Device Inventory - CrowdStrike
            * Device Inventory - Kaspersky
            * Device Inventory Backfill
            * Device Inventory Lookup CleanUp
        * Added the "Device Inventory - Splunk Internal" saved search to collect the forwarder information available in splunk.
        * Added the "Device Inventory Merge Similar Devices" saved search to auto merge the similar devices.

    * Improved the raw expansion table design by removing empty raws and adding borders to the table.

    * Reduced the severity of the "Authentication - Excessive Failed VPN Logins for a User" alert for unknown user.

    * The "O365 - Azure Active Directory - Group Change/Update" and "O365 - Azure Active Directory - GroupMembership Change/Update" alerts have been updated to capture the appropriate events.


* ### Bug Fixes

    * The lansweeper duplicate assets issue has been fixed since similar devices come from different sources.

    * Fixed the order of the filter macro. 


## Upgrade Guide from 4.2.0/4.2.1 to 4.3.0

  * Visit the [Cyences App Configuration]({{ site.baseurl }}/install_configure/configuration/#macro-setup) page to make changes in Device/User inventory related macros.