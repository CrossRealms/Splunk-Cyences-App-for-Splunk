---
layout: default
title: Microsoft Office 365
permalink: /data_onboarding/cloud_tenancies/microsoft_o365/
nav_order: 3
parent: Cloud Tenancies 
grand_parent: Data Onboarding
---

## **Microsoft Office 365 Data**

The Splunk Add-on for Microsoft Office 365 is required to pull service status, service messages, management activity logs, and Message Trace (from the Add-on version 4.2.0) data from the Office 365 Management API. 

Splunkbase Download:
[https://splunkbase.splunk.com/app/4055](https://splunkbase.splunk.com/app/4055)

Installation and Configuration Guide:
[https://docs.splunk.com/Documentation/AddOns/released/MSO365/Installationsteps](https://docs.splunk.com/Documentation/AddOns/released/MSO365/Installationsteps)

### App Installation

| App Title | App ID |  Search Head (etc/apps) | Indexer/Intermediate Forwarder (etc/manager-apps or etc/apps) | Heavy Forwarder (etc/apps) | Server / UF / Deployment Server (etc/deployment-apps) | 
| --------- | ------ | ----------------------- | ------------------------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| Splunk Add-on for Microsoft Office 365 | 4055 | Required | Required | Required | - |

**Note** : Create an index named **Office 365 Data** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).


* Required inputs to be configured (If input has "Content Type" dropdown then create input for each Content Type):
    * Management Activity
    * Message Trace
    * Service Health & Communications
    * Cloud Application Security
    * Audit Logs

[comment]: <> (TODO_LATER: add estimated data size)