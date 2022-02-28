---
layout: default
title: Qualys
permalink: /configuration/data_onboarding/qualys/
nav_order: 14
parent: Data Onboarding
grand_parent: Configuration
---


## **Qualys Data**

The Qualys Technology Add-on (TA) for Splunk is required to keep track of all the vulnerabilities on the assets/devices.  

Splunkbase Download: 
[https://splunkbase.splunk.com/app/2964/](https://splunkbase.splunk.com/app/2964/) 

Installation and Configuration Guide: 
[https://www.qualys.com/docs/qualys-ta-for-splunk.pdf](https://www.qualys.com/docs/qualys-ta-for-splunk.pdf) 

**Note:** Use index=**qualys** for data collection or update the macro definition for `cs_qualys` (**Settings > Configuration**).

## Estimated Data Size

The Qualys Technology Add-on (TA) for Splunk does not consume a ton of license usage since it only collects information regarding vulnerability scans, but it all depends on the number of devices and vulnerabilities that are present in your environment. For example, CrossRealms had around 300 devices and the total license consumption was less than 10MB. 
