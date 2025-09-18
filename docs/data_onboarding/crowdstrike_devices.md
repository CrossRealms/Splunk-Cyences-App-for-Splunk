---
layout: default
title: CrowdStrike Devices
permalink: /data_onboarding/crowdstrike_devices/
nav_order: 14
parent: Data Onboarding
---

## **CrowdStrike Devices Data**

### App Installation

| App |  Search Head  | Indexer | Heavy Forwarder | UF / Deployment Server | Additional Details |
| ---- | ------ | ------------ | -------------- | -------------------- | ------ |
| [CrowdStrike Falcon Devices Technical Add-On](https://splunkbase.splunk.com/app/5570/) | Required | - | Required | - | [Installation and Configuration Guide](https://splunkbase.splunk.com/app/5570/#/details) |

**Note** : Create an index named **crowdstrike** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).

## Estimated Data Size

CrowdStrike Falcon Devices Technical Add-On does not consume a ton of license usage since it only collects the assets information, but ultimately it depends on the number of assets that are present in your environment. 