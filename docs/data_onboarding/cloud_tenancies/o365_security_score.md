---
layout: default
title: Microsoft Azure Security Score
permalink: /data_onboarding/cloud_tenancies/o365_security_score/
nav_order: 5
parent: Cloud Tenancies 
grand_parent: Data Onboarding
---

## **Microsoft Azure Security Score Data**

The Microsoft Graph Security Score Add-on for Splunk is required to collect the Microsoft Azure/O365 Security Score information. 

Splunkbase Download: 
[https://splunkbase.splunk.com/app/5693/](https://splunkbase.splunk.com/app/5693/) 

Installation and Configuration Guide: 
[https://splunkbase.splunk.com/app/5693/#/details](https://splunkbase.splunk.com/app/5693/#/details) 

### App Installation

| App Title | App ID |  Search Head (etc/apps) | Indexer/Intermediate Forwarder (etc/manager-apps or etc/apps) | Heavy Forwarder (etc/apps) | Server / UF / Deployment Server (etc/deployment-apps) | 
| --------- | ------ | ----------------------- | ------------------------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| Microsoft Graph Security Score Add-on for Splunk | 5693 | Required | Required | Required | - |

**Note** : Create an index named **0365** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).

## Estimated Data Size
The Microsoft Graph Security Score Add-on should consume around 5-10MB per day. 