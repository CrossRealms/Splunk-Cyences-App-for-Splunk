---
layout: default
title: F5 BIGIP
permalink: /data_onboarding/network_devices/f5_bigip/
nav_order: 6
parent: Network Devices
grand_parent: Data Onboarding
---

## **F5 BIGIP ASM Data**

### App Installation

| App |  Search Head  | Indexer | Heavy Forwarder | UF / Deployment Server | Additional Details |
| ---- | ------ | ------------ | -------------- | -------------------- | ------ |
| [Splunk Add-on for F5 BIG-IP](https://splunkbase.splunk.com/app/2680/) | Required | - | Required | - | [Installation and Configuration Guide](https://splunkbase.splunk.com/app/2680/#/details) |

* Important sourcetypes to be collected
    * f5:bigip:syslog
    * f5:bigip:asm:syslog

**Note** : Create an index named **f5** or update the **cs_f5_bigip** macro definition from Cyences app configuration page (**Cyences Settings > Cyences App Configuration > Products Setup**).


## Estimated Data Size
TOOD