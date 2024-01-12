---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 5
has_children: true
---

# Release Notes


## Version 4.6.0 (January 2024)

* ### Data Reviewer Dashboard
    * Added new dashboard to review the onboarded data sources in the splunk environment.
    * It includes panels to review sources, sourcetypes and hosts.

* ### Network Telemetry Dashboard
    * The Network Telemetry dashboard has been completely rewamped to include new charts and panels to show more information regarding network traffic.

* ### Office 365 Azure Active Directory Alerts/Dashboard
    * Updated the azure active directory data source from **Office 365 management activity data (Splunk Add-on for Office 365)** to **azure:aad:audit data (Splunk Add on for Microsoft Azure)** which gives more details of the activities.
    * Added a custom command to simplify the view of the modified properties.
    * Updated the severities based on the important modified properties.
    * Added new fields like failureReason and additionalDetails for Office 365 login activity related alerts and dashboards.

* Added a new alert named **Authentication - Failed VPN Login From Unusual Country**.


* ### Enhancements

    * #### Cyences App Configuration Dashboard
        * Added the capability to show/hide panels and dashboards associated with products that are enabled/disabled from Cyences App Configuration.
        * Improved the time taken by the Product Setup section to enable/disable a product and added a loader.
        * Synchronized the order of dashboards/products on the Cyences App Configuration page, Cyences Overview page and Dashboard navigation menu.
        * Simplified and Categorized the Windows sources into multiple products like Windows AD, Windows DNS on Cyences App Configuration page.

    * Added traffic_info field to the **Network Compromise - Basic Scanning** alert to display the allowed/blocked traffic and based on that updated the severity.

    * Rearranged the fields for **Cyences Digest Email** alert according to their priority.



## Upgrade Guide from 4.5.0 to 4.6.0

* Please install the [Flow Map Viz App](https://splunkbase.splunk.com/app/4657) from Splunkbase for Network Traffic visualization.

* Please install the [Splunk Add on for Microsoft Azure](https://splunkbase.splunk.com/app/3757) and configure it for Office 365 Azure Active Directory alerts/dashboard.

* To get the latest navigation design of the dashboards, disable and re-enable one of the product from the product setup page.
