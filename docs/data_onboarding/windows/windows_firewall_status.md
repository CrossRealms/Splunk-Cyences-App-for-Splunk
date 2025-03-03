---
layout: default
title: Windows Firewall Status 
permalink: /data_onboarding/windows/firewall_status
nav_order: 3
parent: Windows
grand_parent: Data Onboarding
---

## **Windows Firewall Status Data**

Configure the Windows Firewall Status Check Add-on to collect windows firewall status data. 


Splunkbase Download:
[https://splunkbase.splunk.com/app/7012](https://splunkbase.splunk.com/app/7012)

Installation and Configuration Guide:
[https://splunkbase.splunk.com/app/7012](https://splunkbase.splunk.com/app/7012)

### App Installation

| App Title | App ID |  Search Head (etc/apps) | Indexer/Intermediate Forwarder (etc/manager-apps or etc/apps) | Heavy Forwarder (etc/apps) | Server / UF / Deployment Server (etc/deployment-apps) | 
| --------- | ------ | ----------------------- | ------------------------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| Windows Firewall Status Check Add-on | 7012 | Required | Required | Required | - |

**Note** : Create an index named **windows** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).
