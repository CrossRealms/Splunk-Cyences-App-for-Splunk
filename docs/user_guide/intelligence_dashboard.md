---
layout: default
title: Intelligence
permalink: /user_guide/intelligence_dashboard/
nav_order: 5
parent: User Guide
---

# Intelligence 

Cyences version 1.2.0 introduces a new drop-down option named Intelligence in the app's navigation bar and it contains the following items:

* Asset Intelligence
* Device Inventory
* Globally Detected Malicious IPs
* Lansweeper
* Qualys
* Tenable

## Globally Detected Malicious IPs

The Globally Detected Malicious IPs list is generated from a combination of reports, scheduled reports, and a paid service through HoneyDB's APIs. It goes into extensive detail by providing the location of the bad IP address to the last seen time. This list covers the following topics: 

* DDoS attacks on Palo Alto firewalls
* Inbound traffic from blocked IPs
* Outbound traffic to blocked IPs

If an IP address is involved in any of the above scenarios, then it will automatically be added to the list. The goal of Globally Detected Malicious IPs is to assist Splunk users to learn even more about their environment and to help identify suspicious activity in order to take the appropriate security measures to strengthen their network. Do not let your business become the next victim. For more information, please refer to the **Globally Detected Malicious IPs** dashboard. 

![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/malicious_ip.png?raw=true)

Beginning with version 1.1.0, the Globally Detected Malicious IPs list is now being generated on the Malicious IP list server, which is deployed by CrossRealms International. This list is based on bad IP address activity that's detected in Splunk environments across all installations where Cyences is configured. This list provides Splunk users with the latest globally detected malicious IP list and stores it back into the lookup within the Cyences app. This will result in a more robust list for Splunk users to rely on. For Splunk Admins, please refer to the **Configuration of Access Token for Malicious IP List** section to learn more about the API configuration process. 

**Note**: The Malicious IP List Gen does not disclose any private information from a Splunk user's environment.

## Lansweeper

The Lansweeper dashboard is powered by Lansweeper's data [https://www.lansweeper.com](https://www.lansweeper.com). The Cyences App mainly uses this data for IT discovery and inventory.  

The Lansweeper dashboard in the Cyences app displays information about every IT asset present in your environment. Here are some of the various types of IT assets which are acknowledged by Lansweeper: 

* Apple Macintosh 
* ESXi servers
* Hyper-V Guests
* Location
* Linux
* Monitor
* Network devices
* Other devices
* VMware Guests
* VMware vCenter services
* Web Servers
* Windows

The Lansweeper dashboard also provides information about whether the IT asset is sending useful security logs based on the type of asset. For example, Windows assets should send Sysmon, WinEventLog:Security, and WinEventLog:System for improved security on those assets. 

## Qualys and Tenable

Qualys and Tenable are security solutions that are designed to detect vulnerabilities present in your environment.  

The Qualys dashboard is powered by Qualys' data [https://www.qualys.com/](https://www.qualys.com/) and the Tenable dashboard is powered by Tenable's data [https://www.tenable.com/](https://www.tenable.com/). 

The Cyences app utilizes the data provided by Qualys and Tenable to obtain information pertaining to any vulnerabilities that may exist on an IT asset within your environment.

![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/qualys_dashboard.png?raw=true)

![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/tenable_dashboard.png?raw=true)

Both of the dashboards that were designed for Qualys and Tenable let Splunk users expand any row within the table to view all of the potential vulnerabilities that are associated with the selected device. 

![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/vulnerabilities_table.png?raw=true)

## Device Inventory

The Device Inventory dashboard contains a list of every asset or device present in an environment. 

![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/device_inventory.png?raw=true)

It is populated from a lookup which is built by scheduled reports. The lookup is generated from the following data sources (the table can still function even if one or more categories of data are not present): 

* CrowdStrike
* Lansweeper
* Qualys
* Sophos
* Tenable
* Windows Defender

The Device Inventory dashboard was built based on the above categories, but it will still be able to recognize the majority of assets or devices present in any environment. This dashboard can be a great tool to rely on during a security audit or while gathering information about assets. It can even identify if a device is not sending a particular type of data (i.e., Windows Defender). This will be incredibly useful for when security engineers are trying to gain a better understanding of something like an attack vector. Users can see the status of the device from the antivirus perspective as well.  

The Device Inventory dashboard has several drilldown options, which allows Splunk users to see the whole picture regarding any device from the Asset Intelligence dashboard  

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

![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/merge_device_ids.png?raw=true)

The **Product Device ID Conflicts Auto Merged** dashboard panel was designed for troubleshooting purposes by Splunk Administrators only. 

## Asset Intelligence Dashboard

This dashboard shows detailed information about a specific asset or device. The Asset Intelligence dashboard is an extension of the Device Inventory dashboard. Splunk users can drilldown from the Device Inventory to see the complete picture about a particular device. 

This dashboard displays the following information about devices: 

* Lansweeper information 
* Qualys or Tenable information and vulnerabilities 
    * Also, if there is any traffic on the vulnerable ports for a device 
* Sophos + Windows Defender (Antivirus) status and related events 
* Network traffic information to/from the asset
    * Additionally, the color red is used to show bad traffic on the map, so Splunk users can immediately identify where the bad traffic is coming from.
* VPN activities from the device or by the selected user
* Various authentication activities like RDP and Linux logins 
* If an asset is involved in any kind of Splunk security alert

![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/asset_intelligence_dashboard.png?raw=true)

(The screenshot above does not include the full dashboard)

The Asset Intelligence dashboard has been added to the Cyences app in version 1.4.0.