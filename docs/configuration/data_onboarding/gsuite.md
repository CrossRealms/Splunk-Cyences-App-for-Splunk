---
layout: default
title: GSuite
permalink: /configuration/data_onboarding/gsuite/
nav_order: 20
parent: Data Onboarding
grand_parent: Configuration
---


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
