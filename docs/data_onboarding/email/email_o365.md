---
layout: default
title: Microsoft Office 365 Email
permalink: /data_onboarding/email/email_o365/
nav_order: 1
parent: Email
grand_parent: Data Onboarding
---

## **Microsoft Office 365 Email Data**

The Splunk Add-on for Microsoft Office 365 v4.2.0 supports Email Message Trace data collection

Refer [Microsoft Office 365]({{ site.baseurl }}/data_onboarding/cloud_tenancies/microsoft_o365/) for data onboarding guide.

### App Installation

| App Title | App ID |  Search Head (etc/apps) | Indexer/Intermediate Forwarder (etc/manager-apps or etc/apps) | Heavy Forwarder (etc/apps) | Server / UF / Deployment Server (etc/deployment-apps) | 
| --------- | ------ | ----------------------- | ------------------------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| Splunk Add-on for Microsoft Office 365 (v4.2.0) | 4055 | Required | Required | Required | - |

**Note** : Create an index named **Office 365 Data** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).

[comment]: <> (TODO_LATER: add estimated data size)