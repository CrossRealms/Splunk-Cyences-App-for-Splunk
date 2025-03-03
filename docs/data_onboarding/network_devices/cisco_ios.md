---
layout: default
title: Cisco IOS
permalink: /data_onboarding/network_devices/cisco_ios/
nav_order: 1
parent: Network Devices
grand_parent: Data Onboarding
---

## Cisco IOS Data

The Cisco Networks Add-on for Splunk Enterprise is required for the Cisco IOS logs collection. 

Splunkbase Download: [https://splunkbase.splunk.com/app/1467](https://splunkbase.splunk.com/app/1467)

Installation and Configuration Guide: [https://splunkbase.splunk.com/app/1467](https://splunkbase.splunk.com/app/1467)

### App Installation

| App Title | App ID |  Search Head (etc/apps) | Indexer/Intermediate Forwarder (etc/manager-apps or etc/apps) | Heavy Forwarder (etc/apps) | Server / UF / Deployment Server (etc/deployment-apps) | 
| --------- | ------ | ----------------------- | ------------------------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| Cisco Networks Add-on for Splunk Enterprise | 1467 | Required | Required | Required | - |

**Note** : Create an index named **Cisco IOS Data** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).

[comment]: <> (TODO_LATER: add estimated data size)