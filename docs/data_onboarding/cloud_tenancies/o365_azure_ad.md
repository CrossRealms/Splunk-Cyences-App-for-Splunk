---
layout: default
title: O365 Azure Active Directory
permalink: /data_onboarding/cloud_tenancies/o365_azure_ad/
nav_order: 4
parent: Cloud Tenancies 
grand_parent: Data Onboarding
---

## **O365 Azure Active Directory Data**

### App Installation

| App |  Search Head  | Indexer | Heavy Forwarder | UF / Deployment Server | Additional Details |
| ---- | ------ | ------------ | -------------- | -------------------- | ------ |
| [Splunk Add on for Microsoft Azure](https://splunkbase.splunk.com/app/3757/) | Required | - | Required | - | [Installation and Configuration Guide](https://splunkbase.splunk.com/app/3757/#/details) |

#### Important inputs to be configured:
* Microsoft Entra ID Audit
* Microsoft Entra ID Interactive Sign-ins

**Note** : Create an index named **azure** or update the **cs_azure** macro definition from Cyences app configuration page (**Cyences Settings > Cyences App Configuration > Products Setup**).

## Estimated Data Size

The license usage consumed by this Add-On is based on the size of your environment, the number of users, and the amount of user activity taking place in your environment.
