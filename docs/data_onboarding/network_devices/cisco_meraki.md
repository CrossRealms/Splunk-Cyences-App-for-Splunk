---
layout: default
title: Cisco Meraki
permalink: /data_onboarding/network_devices/cisco_meraki/
nav_order: 5
parent: Network Devices
grand_parent: Data Onboarding
---

## **Cisco Meraki Data**

The Splunk Add-on for Cisco Meraki is required to collect the data.

Splunkbase Download: 
[https://splunkbase.splunk.com/app/5580](https://splunkbase.splunk.com/app/5580) 

Installation Guide: 
[https://docs.splunk.com/Documentation/AddOns/released/Meraki/AboutAddon](https://docs.splunk.com/Documentation/AddOns/released/Meraki/AboutAddon) 


### App Installation

| App Title | App ID |  Search Head (etc/apps) | Indexer/Intermediate Forwarder (etc/manager-apps or etc/apps) | Heavy Forwarder (etc/apps) | Server / UF / Deployment Server (etc/deployment-apps) | 
| --------- | ------ | ----------------------- | ------------------------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| Splunk Add-on for Cisco Meraki | 5580 | Required | Required | Required | - |

**Note** : Create an index named **cisco_meraki** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).
