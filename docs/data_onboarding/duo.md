---
layout: default
title: DUO
permalink: /data_onboarding/duo/
nav_order: 15
parent: Data Onboarding
---

## **DUO Data**

The Cisco Security Cloud Add-on is required to collect the data.

### App Installation

| App |  Search Head  | Indexer | Heavy Forwarder | UF / Deployment Server | Additional Details |
| ---- | ------ | ------------ | -------------- | -------------------- | ------ |
| [Cisoco Security Cloud](https://splunkbase.splunk.com/app/7404/) | Required | - | Required | - | [Installation and Configuration Guide](https://www.cisco.com/c/en/us/td/docs/security/cisco-secure-cloud-app/user-guide/cisco-security-cloud-user-guide/m_configure_cisco_products_in_cisco_security_cloud.html#configure-an-application) |


**Note** : 

* Configure Duo app from configuration page of the Cisco Security Cloud Add-on.
* Create an index named **duo** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).
