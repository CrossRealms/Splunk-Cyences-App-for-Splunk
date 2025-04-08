---
layout: default
title: Microsoft Azure Security Score
permalink: /data_onboarding/cloud_tenancies/o365_security_score/
nav_order: 5
parent: Cloud Tenancies 
grand_parent: Data Onboarding
---

## **Microsoft Azure Security Score Data**

### App Installation

| App |  Search Head  | Indexer | Heavy Forwarder | UF / Deployment Server | Additional Details |
| ---- | ------ | ------------ | -------------- | -------------------- | ------ |
| [Microsoft Graph Security Score Add-on for Splunk](https://splunkbase.splunk.com/app/5693/) | Required | - | Required | - | [Installation and Configuration Guide](https://splunkbase.splunk.com/app/5693/#/details) |

**Note** : Create an index named **o365** or update the **cs_azure_securityscore** macro definition from Cyences app configuration page (**Cyences Settings > Cyences App Configuration > Products Setup**).


## Estimated Data Size
The Microsoft Graph Security Score Add-on should consume around 5-10MB per day. 