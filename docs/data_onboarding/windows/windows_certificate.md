---
layout: default
title: Windows Certificate Store
permalink: /data_onboarding/windows/certificate
nav_order: 2
parent: Windows
grand_parent: Data Onboarding
---

## **Windows Certificate Store Data**


Configure the Windows Certificate Store Add-on to collect windows certificate store data. 

Splunkbase Download:
[https://splunkbase.splunk.com/app/7013](https://splunkbase.splunk.com/app/7013)

Installation and Configuration Guide:
[https://splunkbase.splunk.com/app/7013/#/details](https://splunkbase.splunk.com/app/7013/#/details)

### App Installation

| App Title | App ID |  Search Head (etc/apps) | Indexer/Intermediate Forwarder (etc/manager-apps or etc/apps) | Heavy Forwarder (etc/apps) | Server / UF / Deployment Server (etc/deployment-apps) | 
| --------- | ------ | ----------------------- | ------------------------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| Windows Certificate Store Add-on for Splunk | 7013 | Required | Required | Required | - |

**Note** : Create an index named **wincerts** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).