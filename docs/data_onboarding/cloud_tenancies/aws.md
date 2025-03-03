---
layout: default
title: Amazon Web Services
permalink: /data_onboarding/cloud_tenancies/aws/
nav_order: 1
parent: Cloud Tenancies
grand_parent: Data Onboarding
---

## **Amazon Web Services Data**

The Splunk Add-on for Amazon Web Services is required to collect Amazon Web Services data. 

Splunkbase Download: 
[https://splunkbase.splunk.com/app/1876/](https://splunkbase.splunk.com/app/1876/) 

Installation and Configuration Guide: 
[https://docs.splunk.com/Documentation/AddOns/latest/AWS/Description](https://docs.splunk.com/Documentation/AddOns/latest/AWS/Description) 

### App Installation

| App Title | App ID |  Search Head (etc/apps) | Indexer/Intermediate Forwarder (etc/manager-apps or etc/apps) | Heavy Forwarder (etc/apps) | Server / UF / Deployment Server (etc/deployment-apps) | 
| --------- | ------ | ----------------------- | ------------------------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| Splunk Add-on for Amazon Web Services | 1876 | Required | Required | Required | - |

**Note** : 

- Create an index named ***aws*** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).
- Use both index=**aws** and index=**summary** for data collection.
## Estimated Data Size

The license usage consumed by the Splunk Add-On for Amazon Web Services is based on the size of your environment, the number of users, and the amount of user activity taking place in your environment.