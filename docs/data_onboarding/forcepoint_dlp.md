---
layout: default
title: Forcepoint DLP
permalink: /data_onboarding/duo/
nav_order: 16
parent: Data Onboarding
---

## **Forcepoint DLP Data**

The Forcepoint DLP Add-on is required to collect the data.

Splunkbase Download: 
[https://splunkbase.splunk.com/app/6507](https://splunkbase.splunk.com/app/6507) 

* Forcepoint DLP logs can be forwarded via UDP/TCP : [steps to perform on forcepoint portal](https://dnif.it/kb/device-integration/forcepoint-dlp/)

### App Installation

| App Title | App ID |  Search Head (etc/apps) | Indexer/Intermediate Forwarder (etc/manager-apps or etc/apps) | Heavy Forwarder (etc/apps) | Server / UF / Deployment Server (etc/deployment-apps) | 
| --------- | ------ | ----------------------- | ------------------------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| Forcepoint DLP | 6507 | Required | Required | Required | - |

**Note** : Create an index named **forcepoint_dlp** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).