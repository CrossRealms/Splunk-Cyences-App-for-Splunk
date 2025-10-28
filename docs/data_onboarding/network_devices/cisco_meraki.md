---
layout: default
title: Cisco Meraki
permalink: /data_onboarding/network_devices/cisco_meraki/
nav_order: 5
parent: Network Devices
grand_parent: Data Onboarding
---

## **Cisco Meraki Data**

### App Installation

| App |  Search Head  | Indexer | Heavy Forwarder | UF / Deployment Server | Additional Details |
| ---- | ------ | ------------ | -------------- | -------------------- | ------ |
| [Splunk Add-on for Cisco Meraki](https://splunkbase.splunk.com/app/5580/) | Required | - | Required | - | [Installation and Configuration Guide](https://docs.splunk.com/Documentation/AddOns/released/Meraki/AboutAddon) |

#### Important inputs to be configured

* Organization > Organization Security
* Organization > Audit


**Note** : Create an index named **cisco_meraki** or update the **cs_cisco_meraki** macro definition from Cyences app configuration page (**Cyences Settings > Cyences App Configuration > Products Setup**).


## Estimated Data Size
TODO