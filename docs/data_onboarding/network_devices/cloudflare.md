---
layout: default
title: Cloudflare
permalink: /data_onboarding/network_devices/cloudflare/
nav_order: 7
parent: Network Devices
grand_parent: Data Onboarding
---

## **Cloudflare Data**

### App Installation

| App |  Search Head  | Indexer | Heavy Forwarder | UF / Deployment Server | Additional Details |
| ---- | ------ | ------------ | -------------- | -------------------- | ------ |
| [Cloudflare App for Splunk](https://splunkbase.splunk.com/app/4501/) | Required | - | - | - | [Refer the guide to onboard the logs](https://developers.cloudflare.com/logs/get-started/enable-destinations/splunk/) |

* Important sourcetypes to be collected
    * cloudflare:json

**Note** : Create an index named **cloudflare** or update the **cs_cloudflare** macro definition from Cyences app configuration page (**Cyences Settings > Cyences App Configuration > Products Setup**).


## Estimated Data Size
TOOD