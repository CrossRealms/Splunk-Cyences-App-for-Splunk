---
layout: default
title: F5 BIGIP
permalink: /data_onboarding/network_devices/f5_bigip/
nav_order: 6
parent: Network Devices
grand_parent: Data Onboarding
---

## **F5 BIGIP Data**

The **Splunk Add-on for F5 BIG-IP** addon is required to collect the F5 BIGIP ASM logs. 

Splunkbase Download: 
[https://splunkbase.splunk.com/app/2680/](https://splunkbase.splunk.com/app/2680/) 

Installation Guide: 
[https://splunkbase.splunk.com/app/2680/#/details](https://splunkbase.splunk.com/app/2680/#/details) 

### App Installation

| App Title | App ID |  Search Head (etc/apps) | Indexer/Intermediate Forwarder (etc/manager-apps or etc/apps) | Heavy Forwarder (etc/apps) | Server / UF / Deployment Server (etc/deployment-apps) | 
| --------- | ------ | ----------------------- | ------------------------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| Splunk Add-on for F5 BIG-IP | 2680 | Required | Required | Required | - |

**Note** : Create an index named **f5** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).

## Estimated Data Size  

[comment]: <> (TODO_LATER: add estimated data size)