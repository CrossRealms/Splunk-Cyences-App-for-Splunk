---
layout: default
title: Active Directory
permalink: /data_onboarding/active_directory/
nav_order: 8
parent: Data Onboarding
---

# **Active Directory / Azure Active Directory**

## **Windows Active Directory Data** 

Use the Windows Add-on to collect Active Directory related logs [https://docs.splunk.com/Documentation/WindowsAddOn/latest/User/AbouttheSplunkAdd-onforWindows](https://docs.splunk.com/Documentation/WindowsAddOn/latest/User/AbouttheSplunkAdd-onforWindows).

This data is required for Active Directory related alerts/dashboards (Group Changes, Group Policy Changes, and User Changes) and it is only compatible with plain text formatted events. 

Refer to `A-TA-ad_inputs` App on [this GitHub Repo](https://github.com/CrossRealms/Cyences-Input-Apps) for inputs.conf reference.

Reference for add-on input creation:[https://docs.splunk.com/Documentation/Splunk/8.1.3/Data/MonitorActiveDirectory](https://docs.splunk.com/Documentation/Splunk/8.1.3/Data/MonitorActiveDirectory) 

### App Installation

| App Title | App ID |  Search Head (etc/apps) | Indexer/Intermediate Forwarder (etc/manager-apps or etc/apps) | Heavy Forwarder (etc/apps) | Server / UF / Deployment Server (etc/deployment-apps) | 
| --------- | ------ | ----------------------- | ------------------------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| Splunk Add-on for Windows | 742 | Required | Required | Required | - |

**Note** : 
- Create an index named **wineventlog, windows, msad** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).
- Configure the index value `index IN (wineventlog, windows, msad)` for both **WinEventLog Security Data** and **WinEventLog System Data** under the **Data Source Macros** section in Cyences' Configuration page.


## Estimated Data Size
Data size with updated stanzas: 

* MSAD Health and Active Directory both use < 10 MB per day. 

**Note:** The data size tends to vary based on how large the Active Directory environment is, but generally it consumes very little license usage overall.

## **Microsoft Office 365 Management Activities Data**

The Splunk Add-on for Microsoft Office 365 will be required in order to collect management activity data. 

Splunkbase Download: 
[https://splunkbase.splunk.com/app/4055/](https://splunkbase.splunk.com/app/4055/) 

Installation Guide: 
[https://docs.splunk.com/Documentation/AddOns/released/MSO365/Installationsteps](https://docs.splunk.com/Documentation/AddOns/released/MSO365/Installationsteps) 

### App Installation

| App Title | App ID |  Search Head (etc/apps) | Indexer/Intermediate Forwarder (etc/manager-apps or etc/apps) | Heavy Forwarder (etc/apps) | Server / UF / Deployment Server (etc/deployment-apps) | 
| --------- | ------ | ----------------------- | ------------------------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| Splunk Add-on for Microsoft Office 365 | 4055 | Required | Required | Required | - |

**Note** : Create an index named **0365** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).

## How to Configure the Splunk Add-on for Microsoft Office 365: 

1. Configure the Add-on on the Heavy Forwarder. 
    * Configure Integration Application: [https://docs.splunk.com/Documentation/AddOns/released/MSO365/ConfigureappinAzureAD](https://docs.splunk.com/Documentation/AddOns/released/MSO365/ConfigureappinAzureAD). 
    * Configure Tenant: [https://docs.splunk.com/Documentation/AddOns/released/MSO365/Configuretenant](https://docs.splunk.com/Documentation/AddOns/released/MSO365/Configuretenant). 

2. Configure the Inputs on the Heavy Forwarder. 
    * Configure Management Activity input: [https://docs.splunk.com/Documentation/AddOns/released/MSO365/Configureinputs](https://docs.splunk.com/Documentation/AddOns/released/MSO365/Configureinputs) and [https://docs.splunk.com/Documentation/AddOns/released/MSO365/ConfigureinputsmanagementAPI](https://docs.splunk.com/Documentation/AddOns/released/MSO365/ConfigureinputsmanagementAPI). 
        * For the input use o365 as the index name.  
        * The index can be renamed, but the default value for this app is o365. 
    * Enable other inputs based on your needs, but in order for Office 365 dashboards to work only the input data for Management Activity is required. 

## Estimated Data Size
It consumes around 80-100MB of license usage per day. 

The total amount of data varies based on the size of your organization (our calculations are based on organizations with around thirty Office 365 users).
