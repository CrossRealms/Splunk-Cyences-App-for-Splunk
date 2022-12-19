---
layout: default
title: Microsoft Azure Security Score
permalink: /configuration/data_onboarding/cloud_tenancies/microsoft_o365/o365_security_score/
nav_order: 1
parent: Microsoft Office 365
grand_parent: Cloud Tenancies
---

## **Microsoft Azure Security Score**

The Microsoft Graph Security Score Add-on for Splunk is required to collect the Microsoft Azure/O365 Security Score information. 

Splunkbase Download: 
[https://splunkbase.splunk.com/app/5693/](https://splunkbase.splunk.com/app/5693/) 

Installation and Configuration Guide: 
[https://splunkbase.splunk.com/app/5693/#/details](https://splunkbase.splunk.com/app/5693/#/details) 

**Note:** Use index=**o365** for data collection or update the macro definition for `cs_azure_securityscore` (**Settings > Configuration**).

## Estimated Data Size
The Microsoft Graph Security Score Add-on should consume around 5-10MB per day. 