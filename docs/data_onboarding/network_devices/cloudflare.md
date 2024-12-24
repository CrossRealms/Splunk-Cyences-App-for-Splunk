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

* For Field Extraction, Install the App on Heavy Forwarder and Search Head both.

**Note:** Create an index named **cloudflare** to collect the logs or update the macro definition with your index in Cyences' configuration page.

