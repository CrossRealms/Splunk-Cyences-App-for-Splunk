---
layout: default
title: Sophos Firewall
permalink: /data_onboarding/network_devices/sophos_firewall/
nav_order: 4
parent: Network Devices
grand_parent: Data Onboarding
---

## **Sophos Firewall Data**

The Sophos Next-Gen Firewall is required to collect the logs from the Sophos Firewall. 

Splunkbase Download: 
[https://splunkbase.splunk.com/app/6187](https://splunkbase.splunk.com/app/6187) 

Installation Guide: 
[https://community.sophos.com/sophos-integrations/w/integrations/106/splunk-add-on-for-sophos-next-gen-firewall](https://community.sophos.com/sophos-integrations/w/integrations/106/splunk-add-on-for-sophos-next-gen-firewall) 

### App Installation

| App Title | App ID |  Search Head (etc/apps) | Indexer/Intermediate Forwarder (etc/manager-apps or etc/apps) | Heavy Forwarder (etc/apps) | Server / UF / Deployment Server (etc/deployment-apps) | 
| --------- | ------ | ----------------------- | ------------------------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| Sophos Next-Gen Firewall | 6187 | Required | Required | Required | - |

**Note** : Create an index named **Sophos Firewall Data** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).
