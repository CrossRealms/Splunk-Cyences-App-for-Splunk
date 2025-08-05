---
layout: default
title: Linux/Unix
permalink: /data_onboarding/linux/
nav_order: 11
parent: Data Onboarding
---

## **Linux/Unix Data**

Linux/Unix data is collected via the Splunk Add-on for Linux and Unix (*nix).  

Splunkbase Download:
[https://splunkbase.splunk.com/app/833/](https://splunkbase.splunk.com/app/833/) 

Installation and Configuration Guide:
[https://docs.splunk.com/Documentation/AddOns/released/UnixLinux/About](https://docs.splunk.com/Documentation/AddOns/released/UnixLinux/About) 

### App Installation

| App Title | App ID |  Search Head (etc/apps) | Indexer/Intermediate Forwarder (etc/manager-apps or etc/apps) | Heavy Forwarder (etc/apps) | Server / UF / Deployment Server (etc/deployment-apps) | 
| --------- | ------ | ----------------------- | ------------------------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| Splunk Add-on for Linux and Unix | 833 | Required | Required | Required | - |

**Note** : Create an indexes named **os**  and **linux** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).

### Collect Users and Groups related data from Linux

We have created a specific shell script to collect information about which users have sudo privileges via a user list which has normal login privileges. And another script that collects information about groups on the Linux/Unix machines. Download the Cyences Add-on for Splunk to enable this feature.

Splunkbase Download: 
[https://splunkbase.splunk.com/app/5659/](https://splunkbase.splunk.com/app/5659/) 

### App Installation

| App Title | App ID |  Search Head (etc/apps) | Indexer/Intermediate Forwarder (etc/manager-apps or etc/apps) | Heavy Forwarder (etc/apps) | Server / UF / Deployment Server (etc/deployment-apps) | 
| --------- | ------ | ----------------------- | ------------------------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| Cyences Add-on for Splunk | 5659 | Required | Required | Required | - |

**Note** : Create an index named **os** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).

### Collect AuditD logs from Linux

Auditd data is collected via **Linux Auditd Technology Add-On**

Splunkbase Download: 
[https://splunkbase.splunk.com/app/4232/](https://splunkbase.splunk.com/app/4232/) 

### App Installation

| App Title | App ID |  Search Head (etc/apps) | Indexer/Intermediate Forwarder (etc/manager-apps or etc/apps) | Heavy Forwarder (etc/apps) | Server / UF / Deployment Server (etc/deployment-apps) | 
| --------- | ------ | ----------------------- | ------------------------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| Linux Auditd Technology Add-On | 4232 | Required | Required | Required | - |

**Note** : 
* Create an index named **auditd** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).
 
* Refer to `A-TA-linux_inputs` App on [this GitHub Repo](https://github.com/CrossRealms/Cyences-Input-Apps) for inputs.conf reference.


## Estimated Data Size
The total data size with the updated stanzas are less than 100MB per Linux host per day. Exclude inputs that are not relevant to your environment.
