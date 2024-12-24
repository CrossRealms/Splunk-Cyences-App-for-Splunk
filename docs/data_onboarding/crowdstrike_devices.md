---
layout: default
title: CrowdStrike Devices
permalink: /data_onboarding/crowdstrike_devices/
nav_order: 14
parent: Data Onboarding
---

## **CrowdStrike Devices Data**

CrowdStrike Falcon Devices Technical Add-On is required to collect information about the assets from CrowdStrike. 

Splunkbase Download: 
[https://splunkbase.splunk.com/app/5570](https://splunkbase.splunk.com/app/5570) 

Installation and Configuration Guide: 
[https://splunkbase.splunk.com/app/5570](https://splunkbase.splunk.com/app/5570) 

**Note:** Use index=**crowdstrike** for data collection or update the macro definition for `cs_crowdstrike_devices` (**Settings > Configuration**).

## Estimated Data Size

CrowdStrike Falcon Devices Technical Add-On does not consume a ton of license usage since it only collects the assets information, but ultimately it depends on the number of assets that are present in your environment. 