---
layout: default
title: Lansweeper
permalink: /data_onboarding/lansweeper/
nav_order: 10
parent: Data Onboarding
---

## **Lansweeper Data**

The Lansweeper Add-on for Splunk is required to collect information about the assets from Lansweeper. 

### App Installation

| App |  Search Head  | Indexer | Heavy Forwarder | UF / Deployment Server | Additional Details |
| ---- | ------ | ------------ | -------------- | -------------------- | ------ |
| [Lansweeper Add-on for Splunk](https://splunkbase.splunk.com/app/5418/) | Required | - | Required | - | [Installation and Configuration Guide](https://splunkbase.splunk.com/app/5418/#/details) |

#### Important inputs to be configured
* Lansweeper Input

**Note** : Create an index named **lansweeper** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).

## Estimated Data Size

The Lansweeper Add-on does not consume a ton of license usage since it only collects the assets information, but ultimately it depends on the number of assets that are present in your environment. 