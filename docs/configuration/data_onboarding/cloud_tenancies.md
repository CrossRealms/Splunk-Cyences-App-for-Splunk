---
layout: default
title: Cloud Tenancies
permalink: /configuration/data_onboarding/cloud_tenancies/
nav_order: 6
parent: Data Onboarding
grand_parent: Configuration
has_children: true
---

## **Cloud Tenancies**

## **Amazon Web Services**

The Splunk Add-on for Amazon Web Services is required to collect Amazon Web Services data. 

Splunkbase Download: 
[https://splunkbase.splunk.com/app/1876/](https://splunkbase.splunk.com/app/1876/) 

Installation and Configuration Guide: 
[https://docs.splunk.com/Documentation/AddOns/latest/AWS/Description](https://docs.splunk.com/Documentation/AddOns/latest/AWS/Description) 

**Note:** Use both index=**aws** and index=**summary** for data collection or update the macro definition for `cs_aws` (**Settings > Configuration**). 

## Estimated Data Size

The license usage consumed by the Splunk Add-On for Amazon Web Services is based on the size of your environment, the number of users, and the amount of user activity taking place in your environment.


## **G Suite**

The Input Add On for G Suite App is required to collect Google Suite data. 

Splunkbase Download: 
[https://splunkbase.splunk.com/app/3793/](https://splunkbase.splunk.com/app/3793/) 

Installation and Configuration Guide:
[https://docs.google.com/document/d/1HLCLtJ0Kvb5AZUrJQ2pDbRul_mB400xbeRqzaIUicPY/edit](https://docs.google.com/document/d/1HLCLtJ0Kvb5AZUrJQ2pDbRul_mB400xbeRqzaIUicPY/edit) 

The Cyences app only needs **Activity - Login** service data from the Input Add On for G Suite App. 

The following items should not be installed on a Search Head if the Cyences app is already present due to authentication tagging issues:
* G Suite For Splunk - 
[https://splunkbase.splunk.com/app/3791/](https://splunkbase.splunk.com/app/3791/) 
* TA for G Suite App - 
[https://splunkbase.splunk.com/app/3792/](https://splunkbase.splunk.com/app/3792/) 

**Note:** Use index=**gsuite** for data collection or update the macro definition for `cs_gsuite` (**Settings > Configuration**).

## Estimated Data Size

The license usage consumed by this Add-On is based on the size of your environment, the number of users, and the amount of user activity taking place in your environment.


## **Microsoft Office 365** 

--> <TODO> look at link as reference (https://splunkbase.splunk.com/app/4055)


## **Microsoft Azure Security Score**

The Microsoft Graph Security Score Add-on for Splunk is required to collect the Microsoft Azure/O365 Security Score information. 

Splunkbase Download: 
[https://splunkbase.splunk.com/app/5693/](https://splunkbase.splunk.com/app/5693/) 

Installation and Configuration Guide: 
[https://splunkbase.splunk.com/app/5693/#/details](https://splunkbase.splunk.com/app/5693/#/details) 

**Note:** Use index=**o365** for data collection or update the macro definition for `cs_azure_securityscore` (**Settings > Configuration**).

## Estimated Data Size
The Microsoft Graph Security Score Add-on should consume around 5-10MB per day. 