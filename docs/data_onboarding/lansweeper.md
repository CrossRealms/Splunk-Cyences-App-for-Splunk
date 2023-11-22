---
layout: default
title: Lansweeper
permalink: /data_onboarding/lansweeper/
nav_order: 10
parent: Data Onboarding
---

## **Lansweeper Data**

The Lansweeper Add-on for Splunk is required to collect information about the assets from Lansweeper. 

Splunkbase Download: 
[https://splunkbase.splunk.com/app/5418/](https://splunkbase.splunk.com/app/5418/) 

Installation and Configuration Guide: 
[https://splunkbase.splunk.com/app/5418/#/details](https://splunkbase.splunk.com/app/5418/#/details) 

**Note:** Use index=**lansweeper** for data collection or update the macro definition for `cs_lansweeper` (**Settings > Configuration**).

## Estimated Data Size

The Lansweeper Add-on does not consume a ton of license usage since it only collects the assets information, but ultimately it depends on the number of assets that are present in your environment. 