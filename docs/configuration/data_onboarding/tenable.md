---
layout: default
title: Tenable
permalink: /configuration/data_onboarding/vulnerability/tenable/
nav_order: 3
parent: Vulnerability
grand_parent: Data Onboarding
---

## **Tenable Data**

The Tenable Add-on for Splunk is required to collect the vulnerabilities for each IT asset/device. 

Splunkbase Download: 
[https://splunkbase.splunk.com/app/4060/](https://splunkbase.splunk.com/app/4060/) 

Installation and Configuration Guide: 
[https://docs.tenable.com/integrations/Splunk/Content/Splunk%20Add%20On.htm](https://docs.tenable.com/integrations/Splunk/Content/Splunk%20Add%20On.htm) 

**Note:** Use index=**tenable** for data collection or update the macro definition for `cs_tenable` (**Settings > Configuration**).

## Estimated Data Size

The Tenable Add-on for Splunk does not consume a ton of license usage, since it only collects vulnerability scan related information from all of your devices, but it is contingent on the number of devices and vulnerabilities that are present in your environment. For example, CrossRealms had around 400 devices and the total license consumption was less than 150MB. 

## Nessus Data Importer Add-on

[Nessus Data Importer Add-on](https://splunkbase.splunk.com/app/2740) can be used to collect vulnerability related data from Nessus on-premise, but we do not recommend this Add-on since it has been archived by the developer. 

Installation and Configuration Guide: 
[https://splunkbase.splunk.com/app/2740/#/details](https://splunkbase.splunk.com/app/2740/#/details) 

**Note:** Use **sourcetype=nessus_json** for inputs.conf (file monitoring input). Use index=**tenable** for data collection or update the macro definition for `cs_tenable` (**Settings > Configuration**).

Limitations with Nessus Data Importer Add-on: 
* Data collected by this Add-on may not have all of the necessary fields. 

* Vulnerabilities do not have a status field information like open, reopen, or fixed, so we are considering all types of vulnerabilities as open. Meaning, Cyences might not display the correct active vulnerability count.  

* These vulnerabilities do not contain protocol:port information, similar to what we have for Tenable:IO or Tenable:SC.