---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 3
has_children: true
---

# Release Notes

## Version 2.3.0 (July 2022)

* ### New Vulnerability Dashboard

    * Replaced `Tenable` and `Qualys` dashboard with a new `Vulnerability` dashboard.

* ### Added New Alerts

   * Authentication
      * `Authentication - Long Running VPN Session Disconnected`

* ### New Cyences_Vulnerabilities and Cyences_Assets datamodel (Important for Splunk Admins Only)

    * Added `Cyences_Vulnerabilities` and `Cyences_Assets` datamodel.

    * Added field extraction, eventtypes and tags for Qualys, Tenable IO, Nessus and CrowdStrike Spotlight vulnerability events to map with `Cyences_Vulnerabilities` datamodel.

    * Added field extraction, eventtypes and tags for Qualys, Tenable IO, Nessus and CrowdStrike Spotlight asset events to map with `Cyences_Assets` datamodel.

    * Added `cs_all_vuln` and `cs_all_assets` KV lookup.

    * Added `Asset Inventory - Vulnerability Lookup Gen` and `Asset Inventory - Lookup Gen` to populate `cs_all_assets` and `cs_all_vuln` lookups from `Cyences_Vulnerabilities` and `Cyences_Assets` datamodel respectively.

    * Updated `Lansweeper` and `Network Reports` dashboard to use `cs_all_vuln` and `cs_all_assets` lookup

    * Replaced `Qualys Host Summary` and `Tenable Host Summary` with a new  `Host Vulnerability Summary` dashboard panel. Similarly replaced `Qualys Vulnerabilities` and `Tenable Vulnerabilities` with a new `Host Vulnerabilities` dashboard panel in the `Asset Intelligence` dashboard.

* ### Enhancements 
    * Active Directory
        * Added more filters in the Active Directory dashboard

    * Network Reports
        * Updated Map chart from `network_telemetry_map` to Splunk Map to show all the traffic instead of top 20 traffic detail.

    * Palo Alto Firewall
        * Added `dvc_name` field in the `List of Firewall Devices` dashboard panel.
    
    * VPN 
        * Added `Elapsed Time Per Session` dashboard panel.

    * Updated splunklib to the latest version (v1.7.0)

    * Renamed below eventtypes to follow consistence naming convention.
        | Before | Now |
        |---|---|
        | cs_palo_gp_old_login | cs_palo_gp_old_vpn_login |
        | cs_palo_gp_old_logout | cs_palo_gp_old_vpn_logout |
        | cs_palo_gp_new_login | cs_palo_gp_new_vpn_login |
        | cs_palo_gp_new_connected | cs_palo_gp_new_vpn_connected |
        | cs_palo_gp_new_logout | cs_palo_gp_new_logout |

    * Added `src_ip`, `src` and `private_ip` field extraction for the Cisco VPN logoff event.

    * Added `cs_fortigate` macro.

* ### Bug Fixes

    * Forensics
        * Resolved the search dropdown issue for `O365 - Azure Active Directory -*` alerts on the `Overview` to `Forensics` dashboard.

    * Office 365
        * Resolved the duplicate event issue for O365 management activity related alerts and dashboard.



## Upgrade Guide from 2.2.0 to 2.3.0

* After App Upgrade, Run the `Asset Inventory - Vulnerability Lookup Gen` and `Asset Inventory - Lookup Gen` with the last 1-year or longer time range as necessary to populate the historical data in the `cs_all_assets` and `cs_all_vuln` lookups. Make sure to use `summariesonly=false` in the search to cover all the data.

* Enable the `Cyences_Vulnerabilities` and `Cyences_Assets` datamodel acceleration to improve the search query performance. For datamodel acceleration steps refer: Doc Home page -> Configuration -> App Installation and Configuration -> Data Model Acceleration & Macros

* The `Tenable` and `Qualys` dashboard will be replaced with a new `Vulnerability` dashboard.
