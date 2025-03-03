---
layout: default
title: Cloudflare
permalink: /data_onboarding/network_devices/cloudflare/
nav_order: 7
parent: Network Devices
grand_parent: Data Onboarding
---

## **Cloudflare Data**

Cloudflare logs are collected via HEC (HTTP Event Collector) input. Refer the guide to onboard the logs: [https://developers.cloudflare.com/logs/get-started/enable-destinations/splunk/](https://developers.cloudflare.com/logs/get-started/enable-destinations/splunk/)

Splunkbase Download: 
[https://splunkbase.splunk.com/app/4501](https://splunkbase.splunk.com/app/4501)

### App Installation

| App Title | App ID |  Search Head (etc/apps) | Indexer/Intermediate Forwarder (etc/manager-apps or etc/apps) | Heavy Forwarder (etc/apps) | Server / UF / Deployment Server (etc/deployment-apps) | 
| --------- | ------ | ----------------------- | ------------------------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| Cloudflare App for Splunk | 4501 | Required | Required | Required | - |

**Note** : Create an index named **cloudflare** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).
