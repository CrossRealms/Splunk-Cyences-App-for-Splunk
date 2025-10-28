---
layout: default
title: Linux/Unix
permalink: /data_onboarding/linux/
nav_order: 11
parent: Data Onboarding
---

## **Linux/Unix Data**

Linux/Unix data is collected via the Splunk Add-on for Linux and Unix (*nix).  

### App Installation

| App |  Search Head  | Indexer | Heavy Forwarder | UF / Deployment Server | Additional Details |
| ---- | ------ | ------------ | -------------- | -------------------- | ------ |
| [Splunk Add-on for Linux and Unix](https://splunkbase.splunk.com/app/833/) | Required | - | Required | - | [Installation and Configuration Guide](https://docs.splunk.com/Documentation/AddOns/released/UnixLinux/About) |


**Note** : Create an indexes named **os**  and **linux** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).

### Collect Users and Groups related data from Linux

We have created a specific shell script to collect information about which users have sudo privileges via a user list which has normal login privileges. And another script that collects information about groups on the Linux/Unix machines. Download the Cyences Add-on for Splunk to enable this feature.

### App Installation

| App |  Search Head  | Indexer | Heavy Forwarder | UF / Deployment Server | Additional Details |
| ---- | ------ | ------------ | -------------- | -------------------- | ------ |
| [Cyences Add-on for Splunk](https://splunkbase.splunk.com/app/5659/) | Required | - | Required | - | [Installation and Configuration Guide](https://splunkbase.splunk.com/app/5659/) |

**Note** : Create an index named **os** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).

### Collect AuditD logs from Linux

### App Installation

| App |  Search Head  | Indexer | Heavy Forwarder | UF / Deployment Server | Additional Details |
| ---- | ------ | ------------ | -------------- | -------------------- | ------ |
| [Linux Auditd Technology Add-On](https://splunkbase.splunk.com/app/4232/) | Required | - | Required | - | [Installation and Configuration Guide](https://splunkbase.splunk.com/app/4232/) |

**Note** : 
* Create an index named **auditd** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).
 
* Refer to `A-TA-linux_inputs` App on [this GitHub Repo](https://github.com/CrossRealms/Cyences-Input-Apps) for inputs.conf reference.

## Estimated Data Size
The total data size with the updated stanzas are less than 100MB per Linux host per day. Exclude inputs that are not relevant to your environment.
