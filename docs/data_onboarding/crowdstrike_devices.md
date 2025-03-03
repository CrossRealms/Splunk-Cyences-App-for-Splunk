---
layout: default
title: CrowdStrike Devices
permalink: /data_onboarding/crowdstrike_devices/
nav_order: 14
parent: Data Onboarding
---

## **CrowdStrike Devices Data**

CrowdStrike Falcon Devices Technical Add-On is required to collect information about the assets from CrowdStrike. 

Splunkbase Download: 
[https://splunkbase.splunk.com/app/5570](https://splunkbase.splunk.com/app/5570) 

Installation and Configuration Guide: 
[https://splunkbase.splunk.com/app/5570](https://splunkbase.splunk.com/app/5570) 

### App Installation

| App Title | App ID |  Search Head (etc/apps) | Indexer/Intermediate Forwarder (etc/manager-apps or etc/apps) | Heavy Forwarder (etc/apps) | Server / UF / Deployment Server (etc/deployment-apps) | 
| --------- | ------ | ----------------------- | ------------------------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| CrowdStrike Falcon Devices Technical Add-On | 5570 | Required | Required | Required | - |

**Note** : Create an index named **crowdstrike** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).

## Estimated Data Size

CrowdStrike Falcon Devices Technical Add-On does not consume a ton of license usage since it only collects the assets information, but ultimately it depends on the number of assets that are present in your environment. 