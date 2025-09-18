---
layout: default
title: Amazon Web Services
permalink: /data_onboarding/cloud_tenancies/aws/
nav_order: 1
parent: Cloud Tenancies
grand_parent: Data Onboarding
---

## **Amazon Web Services Data**

### App Installation

| App |  Search Head  | Indexer | Heavy Forwarder | UF / Deployment Server | Additional Details |
| ---- | ------ | ------------ | -------------- | -------------------- | ------ |
| [Splunk Add-on for Amazon Web Services (AWS)](https://splunkbase.splunk.com/app/1876/) | Required | - | Required | - | [Installation and Configuration Guide](https://docs.splunk.com/Documentation/AddOns/latest/AWS/Description) |

* Important inputs to be configured
    * Cloudtrail

**Note**:
* Create an index named **aws** or update the **cs_aws** macro definition from Cyences app configuration page (**Cyences Settings > Cyences App Configuration > Products Setup**).


## Estimated Data Size

The license usage consumed by the Splunk Add-On for Amazon Web Services is based on the size of your environment, the number of users, and the amount of user activity taking place in your environment.