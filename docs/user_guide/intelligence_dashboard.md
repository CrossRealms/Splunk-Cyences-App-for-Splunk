---
layout: default
title: Intelligence
permalink: /user_guide/intelligence_dashboard/
nav_order: 6
parent: User Guide
---

# Intelligence 

* Cyences introduces a new drop-down option named Intelligence in the app's navigation bar and it contains the following items:

    * Intelligence
    * Device Inventory
    * User Inventory

* The "Intelligence" dashboard has been added to the Cyences app in version 1.4.0, initially named "Asset Intelligence", later renamed to "Intelligence" in version 4.3.0.

## Device Inventory

The Device Inventory dashboard contains a list of every asset or device present in an environment. 

![alt]({{ site.baseurl }}/assets/device_inventory.png)

It is populated from a lookup which is built by scheduled reports. The lookup is generated from the following data sources (the table can still function even if one or more categories of data are not present): 

* CrowdStrike Falcon Devices
* Lansweeper
* Qualys
* Sophos Endpoint Protection
* Tenable
* Nessus:Pro (Nessus Professional)
* Windows Defender
* Kaspersky
* Splunk Internal Logs

The Device Inventory dashboard was built based on the above categories, but it will still be able to recognize the majority of assets or devices present in any environment. This dashboard can be a great tool to rely on during a security audit or while gathering information about assets. It can even identify if a device is not sending a particular type of data (i.e., Windows Defender). This will be incredibly useful for when security engineers are trying to gain a better understanding of something like an attack vector. Users can see the status of the device from the antivirus perspective as well.  

The Device Inventory dashboard has several drilldown options, which allows Splunk users to see the whole picture regarding any device from the "Intelligence" dashboard  

**Note**: Click on a device to perform a drilldown. 

The **Device Master Table** has been renamed to **Device Inventory Table** in version 1.6.0. Several improvements have been made, such as (refer to the Release Notes section for more information):

* It automatically merges devices based on information like hostname, MAC address, or IP address to show an accurate count of devices. 
    * Cyences intelligently merges entries that apply to the same device. 
* Assigns unique UUID to each device. 

**Note**: The remaining portion of the Device Inventory dashboard guide is meant for Administrators only.

Sometimes it is confusing for Cyences' algorithm to automatically merge two device entries together. In this case, Cyences will prompt the user to identify any device entries that can be merged together and the Splunk user will then be asked to manually merge these device entries together. This process is located in the **Possible Merge UUIDs (Devices) in Device Inventory** dashboard panel.

* Expand any row to view more information about the device entry. 
* Expanding a row will reveal the **Merge** button. 
* Device entries can be merged by using the checkboxes in the **Select** row. 
* Click **Merge** to combine the selected device entries.  
* This change will be reflected after the **Device Inventory** dashboard is refreshed. 

![alt]({{ site.baseurl }}/assets/merge_device_ids.png)


## User Inventory

The User Inventory dashboard contains a list of users present in an environment.

![alt]({{ site.baseurl }}/assets/user_inventory.png)

It is populated from a lookup which is built by scheduled report. The lookup is generated from all the data sources.

The User Inventory dashboard was built by scanning the user data from all the sources available in the splunk environment. This dashboard is very useful to check the user related metadata information such as number of users by its type, users associated to each products. It will showcase the list of users with their associated roles/types and products. 

The User Inventory dashboard has several drilldown options, which allows Splunk users to see the user related statistics and related logs.

**Note**: Click on a "View Related Logs" column to see the user related logs in last 24 hours. 

* It automatically merges the users based on its name. Also, It compares the user by removing the prefixes and postfixes configured in macros. 
* It assigns unique UUID to each user.

To grant the privileges to the user from **User Inventory** dashboard, navigate to the **User Inventory Table** panel.

![alt]({{ site.baseurl }}/assets/privilege_the_users.png)

The Cyences alerts will use this information to determine severity based on the user involved, whether they are privileged or usual.

## Intelligence Dashboard

This dashboard shows detailed information about a specific asset or device. The "Intelligence" dashboard is an extension of the Device Inventory dashboard. Splunk users can drilldown from the Device Inventory to see the complete picture about a particular device. 

This dashboard displays the following information about devices: 

* Lansweeper information 
* Host Vulnerability Summary
* Host Vulnerabilities
* Sophos Endpoint Protection + Windows Defender (Antivirus) status and related events 
* VPN activities from the device or by the selected user
* RSA Radius activities from the device or by the selected user
* Various authentication activities like RDP and Linux logins
* If an asset is involved in any kind of Splunk security alert

![alt]({{ site.baseurl }}/assets/asset_intelligence_dashboard.png)

(The screenshot above does not include the full dashboard)

The "Intelligence" dashboard has been added to the Cyences app in version 1.4.0, initially named "Asset Intelligence", later renamed to "Intelligence" in version 4.3.0.