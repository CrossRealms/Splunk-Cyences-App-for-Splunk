---
layout: default
title: DUO
permalink: /data_onboarding/duo/
nav_order: 15
parent: Data Onboarding
---

## **DUO Data**

The Duo Security Add-on is required to collect the data.

Splunkbase Download: 
[https://splunkbase.splunk.com/app/3504](https://splunkbase.splunk.com/app/3504) 

Installation Guide: 
[https://duo.com/docs/splunkapp](https://duo.com/docs/splunkapp) 

### App Installation

| App Title | App ID |  Search Head (etc/apps) | Indexer/Intermediate Forwarder (etc/manager-apps or etc/apps) | Heavy Forwarder (etc/apps) | Server / UF / Deployment Server (etc/deployment-apps) | 
| --------- | ------ | ----------------------- | ------------------------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| Duo Security Add-on | 3504 | Required | Required | Required | - |

**Note** : Create an index named **duo** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).
