---
layout: default
title: Microsoft Office 365
permalink: /data_onboarding/cloud_tenancies/microsoft_o365/
nav_order: 3
parent: Cloud Tenancies 
grand_parent: Data Onboarding
---

## **Microsoft Office 365 Data**

### App Installation

| App |  Search Head  | Indexer | Heavy Forwarder | UF / Deployment Server | Additional Details |
| ---- | ------ | ------------ | -------------- | -------------------- | ------ |
| [Splunk Add-on for Microsoft Office 365](https://splunkbase.splunk.com/app/4055/) | Required | - | Required | - | [Installation and Configuration Guide](https://docs.splunk.com/Documentation/AddOns/released/MSO365/Installationsteps) |

* Important inputs to be configured (If input has "Content Type" dropdown then create input for each Content Type):
    * Management Activity - Audit.AzureActiveDirectory, Audit.Exchange, Audit.SharePoint, Audit.General, DLP.All
    * Message Trace
    * Service Health & Communications - Service Health
    * Audit Logs

**Note** : Create an index named **o365** or update the **cs_o365** macro definition from Cyences app configuration page (**Cyences Settings > Cyences App Configuration > Products Setup**).


## Estimated Data Size
TOOD