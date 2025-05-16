---
layout: default
title: Imperva WAF
permalink: /data_onboarding/network_devices/imperva_waf/
nav_order: 9
parent: Network Devices
grand_parent: Data Onboarding
---

## **Imperva WAF Data**

### App Installation

| App |  Search Head  | Indexer | Heavy Forwarder | UF / Deployment Server | Additional Details |
| ---- | ------ | ------------ | -------------- | -------------------- | ------ |
| [Splunk Add-on for Imperva SecureSphere WAF](https://splunkbase.splunk.com/app/2874/) | Required | - | Required | - | [Installation and Configuration Guide](https://splunkbase.splunk.com/app/2874/#/details) |

**Note** : Create an index named **imperva_waf** or update the **cs_imperva_waf** macro definition from Cyences app configuration page (**Cyences Settings > Cyences App Configuration > Products Setup**).


## Estimated Data Size

* Events: 2500-3000 (daily)
* Licensing: less than 100 MB (daily)