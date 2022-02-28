---
layout: default
title: Microsoft 365 Defender ATP
permalink: /configuration/data_onboarding/o365_defender_atp/
nav_order: 18
parent: Data Onboarding
grand_parent: Configuration
---


## **Microsoft 365 Defender ATP**

The Microsoft 365 Defender Add-on for Splunk will be used to collect Windows Defender ATP alert logs. 

Splunkbase Download: 
[https://splunkbase.splunk.com/app/4959/](https://splunkbase.splunk.com/app/4959/) 

Installation and Configuration Guide: 
[https://splunkbase.splunk.com/app/4959/#/details](https://splunkbase.splunk.com/app/4959/#/details) 

**Note:** Use index=**defenderatp** for data collection or update the macro definition for `cs_o365_defender_atp` (**Settings > Configuration**).

## Collect Defender ATP Configuration Status Logs from Windows Servers 

The Defender ATP Status Check Add-On will be used to collect Defender ATP Configuration Status check logs. 

Splunkbase Download: 
[https://splunkbase.splunk.com/app/5691](https://splunkbase.splunk.com/app/5691) 

Installation and Configuration Guide: 
[https://splunkbase.splunk.com/app/5691/#/details](https://splunkbase.splunk.com/app/5691/#/details) 

Install the Defender ATP Status Check Add-On on a heavy forwarder and universal forwarders (Windows).

Add the following stanza to inputs.conf in the local directory for the **TA-defender-atp-status-check** add-on:

    [powershell://generate_defender_atp_status_logs] 
    disabled = 0 

    [monitor://$SPLUNK_HOME\var\log\TA-defender-atp-status-check \DefenderATPStatus.log] 
    disabled = 0 
    index = defenderatp 

**Note:** Use index=defenderatp for data collection or update the macro definition for `cs_o365_defender_atp_audit` (**Settings > Configuration**).

## Audit Defender ATP Configuration Status 

Use the Microsoft Defender ATP Audit dashboard (**Settings > Microsoft 365 Defender ATP**) to audit the configuration status for Defender ATP.
