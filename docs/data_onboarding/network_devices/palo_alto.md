---
layout: default
title: Palo Alto
permalink: /data_onboarding/network_devices/palo_alto/
nav_order: 3
parent: Network Devices
grand_parent: Data Onboarding
---

## **Palo Alto Firewall Data**

The Palo Alto Add-on for Splunk is required to collect the firewall logs from the Palo Alto. 

Splunkbase Download: 
[https://splunkbase.splunk.com/app/2757/](https://splunkbase.splunk.com/app/2757/) 

Installation Guide: 
[https://splunk.paloaltonetworks.com/installation.html](https://splunk.paloaltonetworks.com/installation.html) 

### App Installation

| App Title | App ID |  Search Head (etc/apps) | Indexer/Intermediate Forwarder (etc/manager-apps or etc/apps) | Heavy Forwarder (etc/apps) | Server / UF / Deployment Server (etc/deployment-apps) | 
| --------- | ------ | ----------------------- | ------------------------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| Palo Alto Add-on for Splunk | 2757 | Required | Required | Required | - |

**Note** : Create an index named **pan_log** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).

## How to Configure the Palo Alto Add-on: 

* Configure the Add-on on the Heavy Forwarder.
    * Getting data into Splunk [https://splunk.paloaltonetworks.com/getting-data-in.html](https://splunk.paloaltonetworks.com/getting-data-in.html).

## Estimated Data Size  
The Palo Alto Add-on consumes around 8-10GB of license usage per day. 

The total amount of data varies based on the size of your organization (our calculations are based on organizations with around fifty regular users). 