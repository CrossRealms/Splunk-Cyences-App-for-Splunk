---
layout: default
title: Forcepoint DLP
permalink: /data_onboarding/forcepoint_dlp/
nav_order: 16
parent: Data Onboarding
---

## **Forcepoint DLP Data**

The Forcepoint DLP Add-on is required to collect the data.

* Splunkbase Download: 
[https://splunkbase.splunk.com/app/6507](https://splunkbase.splunk.com/app/6507) 


### App Installation

| App |  Search Head | Indexer | Heavy Forwarder | UF / Deployment Server | Additional Details |
| ---------  | ----------------------- | ------------------------------------------------------------- | -------------------------- | ----------------------------------------------------- | ------------------------ |
| [Forcepoint DLP](https://splunkbase.splunk.com/app/6507/) | Required | - | Required | - | [Steps to perform on forcepoint portal to forward the DLP logs via UDP/TCP](https://dnif.it/kb/device-integration/forcepoint-dlp/)

**Note** : Create an index named **forcepoint_dlp** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).

### Estimated Data Size

TODO