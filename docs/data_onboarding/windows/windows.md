---
layout: default
title: Windows 
permalink: /data_onboarding/windows/
nav_order: 7
parent: Data Onboarding
has_children: true
---

## **Windows Data**

Configure the Splunk Add-on for Windows to collect field extractions related to Active Directory and Windows data. 

Splunkbase Download:
[https://splunkbase.splunk.com/app/742/](https://splunkbase.splunk.com/app/742/) 

Installation and Configuration Guide:
[https://docs.splunk.com/Documentation/AddOns/released/Windows/Installationoverview](https://docs.splunk.com/Documentation/AddOns/released/Windows/Installationoverview)

Refer to `A-TA-windows_inputs` App on [this GitHub Repo](https://github.com/CrossRealms/Cyences-Input-Apps) for inputs.conf reference.

### App Installation

| App Title | App ID |  Search Head (etc/apps) | Indexer/Intermediate Forwarder (etc/manager-apps or etc/apps) | Heavy Forwarder (etc/apps) | Server / UF / Deployment Server (etc/deployment-apps) | 
| --------- | ------ | ----------------------- | ------------------------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| Splunk Add-on for Windows | 742 | Required | Required | Required | - |

**Note** : 
- Create an indexes named **wineventlog** **windows** and **msad** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).
- Configure the index value `index IN (wineventlog, windows, msad)` for both **WinEventLog Security Data** and **WinEventLog System Data** under the **Data Source Macros** section in Cyences' Configuration page.

### Estimated Data Size
Data size with updated stanzas:
* WinEventLog:Security: 0.8-1.2GB per host per day 
* WinEventLog:System: 0.1-0.3GB per host per day

**Note:** The data provided for **WinEventLog:Security** tends to vary from host to host as a lot of it is based on the overall usage of the system.