---
layout: default
title: Configuration
permalink: /install_configure/configuration/
nav_order: 3
parent: Installation/Configuration
---

# Configuration

## Data Model Acceleration and Macros

For optimal performance, it is recommended to enable the data model acceleration for the CIM data models which are being used. 

| Data Model | Data-model Acceleration Time  |            
|--------|--------|-------------|
| Endpoint | 7 days (Minimum) |
| Network Traffic | 7 day (Minimum) |
| Cyences_Authentication | 1 month (Minimum) |
| Network Resolution (DNS) | 7 day (Minimum) |
| Cyences_Vulnerabilities | 1 month (Minimum) |
| Cyences_Assets |  1 month (Minimum) |

![alt]({{ site.baseurl }}/assets/data_models_acceleration.png)


## Cyences General Setup 
This section contains the general settings for the Cyences app. For ex. environment name. It will be used in the alert emails sent by Cyences and other places.
![alt]({{ site.baseurl }}/assets/cs_general_setup.png)

## Products Setup (Data Source Macros)
Users can use the Products Setup page to customize the dashboards they want to see/hide, Overview page panels to show/hide and the alerts they want to enable/disable. There is a toggle button on the configuration page on each product page to do that. Users can enable or disable it. Showing status as "Unknown" means it's enabled and dashboards are visible. It's recommended to move toggle it to either "Enabled" or "Disabled" status.

The Products Setup page allows you to see if the data-source configuration (index macro) is accurate and if your Splunk environment has data for it or not and modify the configuration if required.

Navigate to **Cyences Settings > Cyences App Configuration** and **Products Setup** section where you can view and update several macro definitions. Verify that the macro definitions match the data source (index) used in your Splunk environment.

Also, **App Dependencies** table shows you the product specific dependent app installation status, enabled/disabled status if it's installed and app installation link information.

![alt]({{ site.baseurl }}/assets/data_source_macros.png)

## Macro Setup

Navigate to **Cyences Settings > Cyences App Configuration > Macro Setup** where you can view and update several macro definitions. These macros are used in various alerts, dashboards, searches, and reports. 

![alt]({{ site.baseurl }}/assets/other_macros.png)


## Cyences Alerts Configuration

The way Splunk currently handles alerts, users are only able to set up email notifications, which is not always optimal as some alerts may generate a lot of false positives. Not every alert needs to be received by email, especially those labeled with lower severity levels. 

Cyences 5.0.0 categorizes all alerts into two teams SOC and Compliance.

* Users can do separate alert configuration for SOC related alerts and Compliance related alerts.
* Navigate to **Cyences Settings > Cyences App Configuration > Cyences Alerts Configuration** section where you can configure the following alert configs for SOC or Compliance alerts separately:

    * Receipients to receive alerts 
    * Alert severities to consider for the immediate alerts
    * Alert severities to consider for the digest alert
    * Specific alerts' list to exclude from the digest alert
    * Any receipient to exclude from the digest alert
    * Toggle button to receive separate digest alert for the common recipients of SOC and Compliance.

![alt]({{ site.baseurl }}/assets/soc_and_compliance_conf.png)


Cyences 3.0.0 contains two new email settings to reduce noise:

### 1. Regular Alert Digest Email

* Daily sends single email which includes each cyence alert triggered in the last twenty-four hours.
* By default, digest alerts include both high and medium severity notable events, but users can adjust the severity level as needed.  
* Users may receive multiple digest emails as there is a limit of ten alerts per digest email and each alert will be limited to fifteen notable events for the total result count information. 

### 2. Critical Alert Email

* Sends an email immediately after an alert gets triggered if the notable event has been labeled with a critical severity level (default setting). Users can customize the severity level for this email setting as needed. 
* Users will no longer have to manually configure their email for every Cyences alert. Users can configure their emails for SOC and Compliance related alerts as mentioned in the above section.
* Users have an option to exclude or include receipient emails and alert severities for specific alerts. This configuration can be done at the alert level by editing the **Cyences Action - Send Email** alert action for a particular alert.
![alt]({{ site.baseurl }}/assets/cyences_email_configuration.png)

**Note** Users can continue to use Splunk's default email functionality as desired for any alert and independently of the above mentioned Cyences email settings.


## BlockShield API Configuration

* Navigate to **Cyences Settings > Cyences App Configuration > BlockShield API Configuration** section to configure the Username and Password of the BlockShield API to get the IP related information. Contact the BlockShield team in order to get the credentials.
![alt]({{ site.baseurl }}/assets/blockshield_api_conf.png)

## Cyences Dependencies

* Navigate to **Cyences Settings > Cyences App Configuration > Cyences Dependencies** section to see the Cyences dependent app installation status.
![alt]({{ site.baseurl }}/assets/cs_app_dependency.png)


## Device Inventory

The Device Inventory Table is generated based on live data coming into Splunk. View the Device Inventory section for more information. 

### Backfill Device Inventory 

To backfill all of the lookups related to device inventory, follow the directions below to execute the necessary search query. 

Navigate to **Cyences App for Splunk > Settings > Searches, reports and alerts**. Use the search filter to find a savedsearch named **Device Inventory Backfill** and click on **Run** to execute the search. 

Use an appropriate time range to backfill all of the lookups, since that determines the search range for all devices (the default time range is set to Last 30 days). 

List of Device Inventory related searches that users can execute individually to backfill specific lookups: 
* Device Inventory - CrowdStrike 
* Device Inventory - Lansweeper 
* Device Inventory - Qualys 
* Device Inventory - Sophos Endpoint Protection 
* Device Inventory - Tenable 
* Device Inventory - Tenable Vuln
* Device Inventory - Nessus 
* Device Inventory - Nessus Vuln
* Device Inventory - Windows Defender 
* Device Inventory - Kaspersky
* Device Inventory - Splunk Internal 

### CleanUp Device Inventory Related Lookups 

To clean up the lookups related to Device Inventory, follow the directions below to execute the necessary search query. 

Navigate to **Cyences App for Splunk > Settings > Searches, reports and alerts**. Use the search filter to find a savedsearch named **Device Inventory Lookup CleanUp** and click on **Run** to execute the search. 

**Caution:** We highly recommend that users run the search in the Last 60 days or another time range that is better suited for their environment, since the time range of the search will define which devices will be kept and the rest will be automatically removed.


## User Inventory

The User Inventory Table is generated based on user related data coming into Splunk. View the User Inventory section for more information. 

### Backfill User Inventory 

To backfill the user inventory lookup, follow the directions below to execute the search query. 

Navigate to **Cyences App for Splunk > Settings > Searches, reports and alerts**. Use the search filter to find a savedsearch named **User Inventory - Lookup Backfill** and click on **Run** to execute the search.

Use an appropriate time range to backfill the lookup, since that determines the search range for all users (the default time range is set to Last 7 days). 


### CleanUp User Inventory Lookups 

To clean up the User Inventory lookup, follow the directions below to execute the necessary search query. 

Navigate to **Cyences App for Splunk > Settings > Searches, reports and alerts**. Use the search filter to find a savedsearch named **User Inventory - Lookup CleanUp** and click on **Run** to execute the search. 

**Caution:** We highly recommend that users run the search in the Last 60 days or another time range that is better suited for their environment, since the time range of the search will define which users will be kept and the rest will be automatically removed.
