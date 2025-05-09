---
layout: default
title: Palo Alto
permalink: /data_onboarding/network_devices/palo_alto/
nav_order: 3
parent: Network Devices
grand_parent: Data Onboarding
---

## **Palo Alto Firewall Data**

### App Installation

| App |  Search Head  | Indexer | Heavy Forwarder | UF / Deployment Server | Additional Details |
| ---- | ------ | ------------ | -------------- | -------------------- | ------ |
| [Palo Alto Add-on for Splunk](https://splunkbase.splunk.com/app/2757/) | Required | - | Required | - | [Installation Guide](https://splunk.paloaltonetworks.com/installation.html) & [Configuration Guide](https://pan.dev/splunk/docs/getting-data-in/) |

**Note** : Create an index named **pan_log** or update the **cs_palo** macro definition from Cyences app configuration page (**Cyences Settings > Cyences App Configuration > Products Setup**).


## Estimated Data Size  
The Palo Alto Add-on consumes around 8-10GB of license usage per day. 

The total amount of data varies based on the size of your organization (our calculations are based on organizations with around fifty regular users). 