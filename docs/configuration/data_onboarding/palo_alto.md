---
layout: default
title: Palo Alto
permalink: /configuration/data_onboarding/palo_alto/
nav_order: 9
parent: Data Onboarding
grand_parent: Configuration
---


## **Palo Alto Firewall Logs**

The Palo Alto Add-on for Splunk is required to collect the firewall logs from the Palo Alto. 

Splunkbase Download: 
[https://splunkbase.splunk.com/app/2757/](https://splunkbase.splunk.com/app/2757/) 

Installation Guide: 
[https://splunk.paloaltonetworks.com/installation.html](https://splunk.paloaltonetworks.com/installation.html) 

## How to Install and Configure the Palo Alto Add-on: 

1. Install the Add-on on the Heavy Forwarder.

2. Configure the Add-on on the Heavy Forwarder.
    * Getting data into Splunk [https://splunk.paloaltonetworks.com/getting-data-in.html](https://splunk.paloaltonetworks.com/getting-data-in.html).
    * Create an index named **pan_log** or update the macro definition in Cyences' configuration page.  

3. Install the Add-on on the Search Head.

## Estimated Data Size  
The Palo Alto Add-on consumes around 8-10GB of license usage per day. 

The total amount of data varies based on the size of your organization (our calculations are based on organizations with around fifty regular users). 

