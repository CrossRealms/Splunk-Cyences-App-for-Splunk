---
layout: default
title: Lansweeper
permalink: /data_onboarding/lansweeper/
nav_order: 10
parent: Data Onboarding
---

## **Lansweeper Data**

The Lansweeper Add-on for Splunk is required to collect information about the assets from Lansweeper. 

Splunkbase Download: 
[https://splunkbase.splunk.com/app/5418/](https://splunkbase.splunk.com/app/5418/) 

Installation and Configuration Guide: 
[https://splunkbase.splunk.com/app/5418/#/details](https://splunkbase.splunk.com/app/5418/#/details) 

### App Installation

| App Title | App ID |  Search Head (etc/apps) | Indexer/Intermediate Forwarder (etc/manager-apps or etc/apps) | Heavy Forwarder (etc/apps) | Server / UF / Deployment Server (etc/deployment-apps) | 
| --------- | ------ | ----------------------- | ------------------------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| Lansweeper Add-on for Splunk | 5418 | Required | Required | Required | - |

**Note** : Create an index named **lansweeper** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).

## Estimated Data Size

The Lansweeper Add-on does not consume a ton of license usage since it only collects the assets information, but ultimately it depends on the number of assets that are present in your environment. 