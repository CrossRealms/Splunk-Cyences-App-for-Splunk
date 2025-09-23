---
layout: default
title: Sophos Firewall
permalink: /data_onboarding/network_devices/sophos_firewall/
nav_order: 4
parent: Network Devices
grand_parent: Data Onboarding
---

## **Sophos Firewall Data**


### App Installation

| App |  Search Head  | Indexer | Heavy Forwarder | UF / Deployment Server | Additional Details |
| ---- | ------ | ------------ | -------------- | -------------------- | ------ |
| [Sophos Next-Gen Firewall](https://splunkbase.splunk.com/app/6187/) | Required | - | Required | - | [Installation Guide](https://community.sophos.com/sophos-integrations/w/integrations/106/splunk-add-on-for-sophos-next-gen-firewall) |
| [Sophos Central](https://splunkbase.splunk.com/app/6186/) | Required | - | Required | - | [Installation and Configuration Guide](https://community.sophos.com/sophos-integrations/w/integrations/109/splunk-add-on-for-sophos-central) (only required for sophos_events) |

#### Important sourcetypes to be collected
* sophos:xg:firewall
* sophos:xg:heartbeat
* sophos:xg:system_health
* sophos:xg:atp
* sophos:xg:idp
* sophos:xg:event
* sophos_events

**Note** : Create an index named **sophos_firewall** or update the **cs_sophos_firewall** macro definition from Cyences app configuration page (**Cyences Settings > Cyences App Configuration > Products Setup**).


## Estimated Data Size
TODO