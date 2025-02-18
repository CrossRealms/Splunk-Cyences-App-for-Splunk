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


### Collect Users and Groups related data from Linux

We have created a specific shell script to collect information about which users have sudo privileges via a user list which has normal login privileges. And another script that collects information about groups on the Linux/Unix machines. Download the Cyences Add-on for Splunk to enable this feature.

Splunkbase Download: 
[https://splunkbase.splunk.com/app/5659/](https://splunkbase.splunk.com/app/5659/) 


### Collect AuditD logs from Linux

Auditd data is collected via **Linux Auditd Technology Add-On**

Splunkbase Download: 
[https://splunkbase.splunk.com/app/4232/](https://splunkbase.splunk.com/app/4232/) 

App should be installed on both Heavy Forwarder and Search Head instances.

**Note:** 

* Refer to `A-TA-linux_inputs` App on [this GitHub Repo](https://github.com/CrossRealms/Cyences-Input-Apps) for inputs.conf reference.

* Use index=`os`, for data collection or update the macro definition for Linux Data (**Settings > Configuration**).


## Estimated Data Size
The total data size with the updated stanzas are less than 100MB per Linux host per day. Exclude inputs that are not relevant to your environment.
