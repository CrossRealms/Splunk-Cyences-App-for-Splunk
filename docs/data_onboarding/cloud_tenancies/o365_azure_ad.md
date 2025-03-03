---
layout: default
title: O365 Azure Active Directory
permalink: /data_onboarding/cloud_tenancies/o365_azure_ad/
nav_order: 4
parent: Cloud Tenancies 
grand_parent: Data Onboarding
---

## **O365 Azure Active Directory Data**

The Splunk Add on for Microsoft Azure is required to collect the O365 Azure Active Directory related activities. 

Splunkbase Download: 
[https://splunkbase.splunk.com/app/3757/](https://splunkbase.splunk.com/app/3757/) 

Installation and Configuration Guide: 
[https://splunkbase.splunk.com/app/3757/#/details](https://splunkbase.splunk.com/app/3757/#/details)

### App Installation

| App Title | App ID |  Search Head (etc/apps) | Indexer/Intermediate Forwarder (etc/manager-apps or etc/apps) | Heavy Forwarder (etc/apps) | Server / UF / Deployment Server (etc/deployment-apps) | 
| --------- | ------ | ----------------------- | ------------------------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| Splunk Add on for Microsoft Azure | 3757 | Required | Required | Required | - |

**Note** : Create an index named **azure** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).

* Required inputs to be configured:
    * Microsoft Entra ID Audit
    * Microsoft Entra ID Interactive Sign-ins

## Estimated Data Size

The license usage consumed by this Add-On is based on the size of your environment, the number of users, and the amount of user activity taking place in your environment.
