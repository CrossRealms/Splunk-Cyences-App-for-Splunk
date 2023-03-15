---
layout: default
title: Fortinet FortiGate
permalink: /data_onboarding/network_devices/fortinet_fortigate/
nav_order: 2
parent: Network Devices
grand_parent: Data Onboarding
---

## **Fortinet FortiGate VPN Data**

The Fortinet FortiGate Add-On for Splunk is required to collect firewall logs from FortiGate servers. 

Splunkbase Download: 
[https://splunkbase.splunk.com/app/2846/](https://splunkbase.splunk.com/app/2846/) 

Installation Guide: 
[https://splunkbase.splunk.com/app/2846/#/details](https://splunkbase.splunk.com/app/2846/#/details) 

## How to Install and Configure the FortiGate Add-on: 

1. Install the Add-on on the Heavy Forwarder.

2. Configure the Add-on on the Heavy Forwarder.
    * Getting data into Splunk [Reference](https://splunkbase.splunk.com/app/2846/#/details).
    * Create an index named **fortigate** or update the macro definition in Cyences' configuration page.

3. Install the Add-on on the Search Head.

**Note:** Update the index value for **VPN data** macro definition in the **Data Source Macros** section in Cyences Configuration page.

## FortiGate VPN Support and issue with action field extraction 

* Due to a field extraction issue in the Fortinet FortiGate Add-On for Splunk (field=**action**). 

* Verify that the FortiGate VPN data is supported by the Cyences App by following the instructions below. 

**How to fix the problem?**

1. From Splunk's navigation bar, go to **Settings > Data models**. 

2. Search for the **Authentication** data model and click on it. 

3. Click **Edit > Edit Acceleration**. 

4. Uncheck the Acceleration box, then click **Save**. 

5. Under the **Calculated** fields section, click **Edit** for the **action** field. 

    ![alt]({{ site.baseurl }}/assets/edit_action_field.png)

6. Your current configuration should look similar to this: 
    
        if(isnull(action) OR action="","unknown",action) 

7. Replace the above configuration/eval expression with the contents below: 
    
        case(sourcetype="fgt_event" AND subtype="vpn" AND vendor_action IN ("tunnel-up", "phase2-up"), "success", sourcetype="fgt_event" AND subtype="vpn" AND vendor_action="ssl-login-fail", "failure", isnull(action) OR action="", "unknown", 1==1, action) 

8. Click **Save**. 

9. Click **Edit > Edit Acceleration**. 

10. Enable the Acceleration, then click **Save**.  

    ![alt]({{ site.baseurl }}/assets/edit_acceleration.png)