---
layout: default
title: Microsoft Office 365 Email
permalink: /data_onboarding/email/email_o365/
nav_order: 1
parent: Email
grand_parent: Data Onboarding
---

## **Microsoft Office 365 Email Data**

The Splunk Add-on for Microsoft Office 365 v4.2.0 supports Email Message Trace data collection

### App Installation

| App |  Search Head  | Indexer | Heavy Forwarder | UF / Deployment Server | Additional Details |
| ---- | ------ | ------------ | -------------- | -------------------- | ------ |
| [Splunk Add-on for Microsoft Office 365](https://splunkbase.splunk.com/app/4055/) | Required | - | Required | - | Check [Microsoft Office 365 data onboarding]({{ site.baseurl }}/data_onboarding/cloud_tenancies/microsoft_o365/) |

#### Important inputs to be configured
* Message Trace

**Note** : Create an index named **o365** or update the **cs_o365** macro definition from Cyences app configuration page (**Cyences Settings > Cyences App Configuration > Products Setup**).

## Estimated Data Size
TODO