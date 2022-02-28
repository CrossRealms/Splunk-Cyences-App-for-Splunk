---
layout: default
title: App Installation and Configuration
permalink: /configuration/installation/
nav_order: 3
parent: Configuration
---


# App Installation & Configuration [Admin]

## **App Installation**

The Cyences App needs to be installed on the Search Head.  

1. From the Splunk Web home screen, click the gear icon next to **Apps**. 

2. Click on **Browse more apps**. 

3. Search for **Cyences App for Splunk** and click **Install**. 

4. Create an index named **cyences**. 
    * Navigate to **Settings > Indexes**. 
    * Click on **New Index**. 
    * Enter **cyences** for the Index Name. 
    * Click **Save**. 

5. The props.conf sourcetype needs to be changed. 
    * Copy **props.conf** from the default directory of the App ($SPLUNK_HOME/etc/apps/cyences_app_for_splunk/default/props.conf) into local directory ($SPLUNK_HOME/etc/apps/cyences_app_for_splunk/local). 
    * Open the newly copied props.conf file from the local directory. 
    * Update the stanza name from **[cyences_stash]** to **[stash]**. 

6. Restart Splunk after installing all dependencies. 

## **Dependency Installation on Search Head**

There are dependent apps which also need to be installed on the Search Head along with the Cyences app itself (follow the same steps mentioned in the previous section to install the apps).

| App Name | Splunkbase Link | What is this used for? |            
|--------|--------|-------------|
| ES Content Update App | [https://splunkbase.splunk.com/app/3449](https://splunkbase.splunk.com/app/3449) | For some macro definitions and lookups |
| Splunk Common Information Model (CIM) | [https://splunkbase.splunk.com/app/1621/](https://splunkbase.splunk.com/app/1621/) | For data models 
| Missile Map (Visualization) | [https://splunkbase.splunk.com/app/3511/](https://splunkbase.splunk.com/app/3511/) | For custom map visualization (view network traffic on map) 
| Splunk Add-on for RWI - Executive Dashboard | [https://splunkbase.splunk.com/app/5063/](https://splunkbase.splunk.com/app/5063/) | For field extraction (VPN data) 
| Splunk Add-on for Windows | [https://splunkbase.splunk.com/app/742/](https://splunkbase.splunk.com/app/742/) | For field extraction (AD/Windows data) 
| Microsoft Sysmon Add-on | [https://splunkbase.splunk.com/app/1914/](https://splunkbase.splunk.com/app/1914/) | For field extraction (Sysmon data) 
| Splunk Add-on for O365 | [https://splunkbase.splunk.com/app/4055/](https://splunkbase.splunk.com/app/4055/) | For field extraction (O365 audit data) 
| Splunk Add-on for Palo Alto | [https://splunkbase.splunk.com/app/2757/](https://splunkbase.splunk.com/app/2757/) | For field extraction (network traffic and GlobalProtect VPN data) 
| Sophos Central Splunk Add-on | [https://splunkbase.splunk.com/app/4647/](https://splunkbase.splunk.com/app/4647/) | For field extraction (Sophos data) 
| TA for Microsoft Windows Defender | [https://splunkbase.splunk.com/app/3734/](https://splunkbase.splunk.com/app/3734/) | For field extraction (Windows Defender data) 
| CrowdStrike Falcon Event Streams Technical Add-On | [https://splunkbase.splunk.com/app/5082/](https://splunkbase.splunk.com/app/5082/) | For field extraction (CrowdStrike Event Stream data) 
| Lansweeper Add-on for Splunk | [https://splunkbase.splunk.com/app/5418/](https://splunkbase.splunk.com/app/5418/) | For field extraction (Lansweeper assets data) 
| Qualys Technology Add-on (TA) for Splunk | [https://splunkbase.splunk.com/app/2964/](https://splunkbase.splunk.com/app/2964/) | For field extraction and to receive mapped information about Qualys vulnerabilities (signature, severity, category, etc.) 
| Tenable Add-on for Splunk | [https://splunkbase.splunk.com/app/4060/](https://splunkbase.splunk.com/app/4060/) | For field extraction and to receive mapped information about Tenable vulnerabilities
| Splunk Add-on for Linux and Unix | [https://splunkbase.splunk.com/app/833](https://splunkbase.splunk.com/app/833) | For field extraction for data from Linux hosts 
| Microsoft 365 Defender Add-on for Splunk | [https://splunkbase.splunk.com/app/4959](https://splunkbase.splunk.com/app/4959) | For field extraction for alerts from Office 365 Defender ATP 
| Splunk Add-on for Amazon Web Services | [https://splunkbase.splunk.com/app/1876](https://splunkbase.splunk.com/app/1876) | For field extraction (AWS data) 
| Fortinet FortiGate Add-On for Splunk | [https://splunkbase.splunk.com/app/2846](https://splunkbase.splunk.com/app/2846) | For field extraction (FortiGate VPN data) 
| Other add-ons from which you are collecting data for in your environment | N/A | For field extraction 

## **Data Model Acceleration & Macros**

For optimal performance, it is recommended to enable the data model acceleration for the CIM data models which are being used. 

| Data Model | Macro Name | Data-model Acceleration Time  |            
|--------|--------|-------------|
| Endpoint | cs_summariesonly_endpoint | 7 days (Minimum) 
| Network Traffic | cs_summariesonly_network_traffic | 7 day (Minimum)
| Authentication | cs_summariesonly_authentication | 7 day (Minimum) 

Once the data models are accelerated, update the macro definitions next, so that Splunk can take full advantage of the accelerated data models which will improve search performance overall.   

The default definition for the data model macros is summariesonly=**false** and it needs to be changed to summariesonly=**true** (**Settings > Configuration**).

## **Data Source Macros**

Navigate to **Settings > Configuration** and underneath the **Data Source Macros** section is where you can view and update several macro definitions. Verify that the macro definitions match the data source (index) used in your Splunk environment.

## **Other Macros**

Navigate to **Settings > Configuration** and in the **Other Macros** section is where you can view and update several macro definitions. These macros are used in various alerts, dashboards, searches, and reports. Verify that the macro definitions match the data source (index) used in your environment. 

| Macro Name | Description | Default Value |            
|--------|--------|-------------|
| cs_ad_password_change_outside_working_hour_definition | Definition of outside working hours (default setting is set to the weekend plus any weekday before 6am and after 7pm). | where date_wday="Saturday" OR date_wday="Sunday" OR date_hour<6 OR date_hour>19 
| cs_home_country | Used to determine and filter the home location in the VPN dashboard and to identify O365 logins outside of country. (Add quotes around the value in the macro definition. The country name should be compatible with the iplocation command). | "United States"
| Home Location Latitude (for Network Traffic Map) | Private IP's (10.x.x.x, 192.168.x.x, 172.16.x.x) will be shown at this latitude on the map. | 41.881832 
| Home Location Longitude (for Network Traffic Map) | Private IP's (10.x.x.x, 192.168.x.x, 172.16.x.x) will be shown at this longitude on the map. | -87.623177 
| cs_palo_search_blocked_ip_lookup_name | Lookup for blocked IP list (default is ip_blocked_list, which is storing the blocked IP list from HoneyDB). | ip_blocked_list 
| cs_palo_malicious_ip_list_filter_old_results | Update the value between the quotes only (the default value is -7d@h, which means the list of Globally Detected Malicious IPs keeps any IP address for seven days since the last appearance of any IP address). | cs_palo_malicious_ip_list_filter_previous_results("-7d@h")
| cs_lansweeper_timerange | The Lansweeper dashboard searches Lansweeper data in the last four hours by default. | earliest=-4h@h latest=now 
| cs_wineventlog_security_timerange | The Lansweeper dashboard searches the WinEventLog:Security data in the last four hours by default to see if the asset collects WinEventLog:Security data. | earliest=-4h@h latest=now 
| cs_wineventlog_system_timerange | The Lansweeper dashboard searches the WinEventLog:Security data in the last 4 hours by default to see if the asset collects WinEventLog:Security data. | earliest=-4h@h latest=now 
| cs_sysmon_timerange | The Lansweeper dashboard searches the WinEventLog:Security data in the last four hours by default to see if the asset collects WinEventLog:Security data. | earliest=-4h@h latest=now 
| cs_qualys_timerange | The Cyences App searches Qualys data in the last twenty-four hours for vulnerability information regarding the assets. | earliest=-7d@h latest=now 
| cs_qualys_linux_os | The Qualys data has different Linux versions in the logs to identify them as Linux OS, so this condition is being used in the Lansweeper dashboard. | `("*Ubuntu*", "*Linux*", "*CentOS*")`

## **Filter Macros**

Certain macros are being used to whitelist (filter) a specific set of results. This is useful for when an alert/report provides a result which is previously known in your environment. The benefit of this macro is that it filters the result set without having to make a copy of the alert/report/search, which will prevent any potential problems from arising when upgrading the Cyences App.  

Locate a search in which a filter of the result set is needed and obtain the macro name from this list. Update the macro definition based on the use case. The default value for all macros is:

    | search *

This would return all results pertaining to the macro of interest. 

Navigate to **Settings > Configuration** and scroll down to the **Filter Macros** section to view and update several macro definitions pertaining to the categorized alerts.  

## Filter alert results based on the time of the event

Since version 1.4.0, time-based filtering has been made available to every alert in the Cyences App. Let's go over a use case to understand what that is, why you need it, and how to apply it. 

Example - A user has a system (ex. 192.168.2.2) in their environment which conducts a penetration test every night between 1-2 AM via brute force password attempts to different systems. Due to these events, the user receives a ton of false positive alerts, which could easily by avoided. 

The first course of action would be to filter the events that are coming in from that IP address.

Filter examples: 

* For the **Authentication - Bruteforce Attempt for a User** alert: 

        | search NOT sources="192.168.2.2."

* For the **Authentication - Bruteforce Attempt from a Source** alert: 

        | search NOT src="192.168.2.2."

The downside to this is that the time range of the filter itself is very wide, because the system is only making an attempt at midnight, but the user is filtering the system as a whole (which is critical for security). What if that machine was compromised? The more optimal solution would be to filter for that specific system, but only during a certain period of time. 

Filter example: 

* For the **Authentication - Bruteforce Attempt for a User** alert: 

        | `cs_generate_time_fields_for_filter` | search NOT (((firstTime_hour>=1) OR (firstTime_hour<2)) ((lastTime_hour>=1) OR (lastTime_hour<2)) sources="192.168.2.2") | `cs_remove_time_fields_for_filter`

* For the **Authentication - Bruteforce Attempt from a Source** alert: 

        | `cs_generate_time_fields_for_filter` | search NOT (((firstTime_hour>=1) OR (firstTime_hour<2)) ((lastTime_hour>=1) OR (lastTime_hour<2)) src="192.168.2.2") | `cs_remove_time_fields_for_filter` 

Both the **firstTime_hour** and **lastTime_hour** fields are generated by the `cs_generate_time_fields_for_filter` macro. There are other fields that the user could use, such as:
* firstTime_ptime (epoch time for firstTime) 
* firstTime_date, firstTime_hour, firstTime_minute 
* firstTime_wday (which day of the week)
* similar fields for lastTime  

The above two alerts are generating **firstTime** and **lastTime** fields, which indicates the first and last event time during the course of the selected time range. In some cases, the alert time field could be **event_time** instead of **_time**. If necessary, Splunk users can substitute one of these fields for one of the following: event_ptime, event_date, etc.

**Note:** Basic knowledge of Splunk's Search Processing Language (SPL) is required.

## **Honey DB Configuration**

We are using an IP block list from HoneyDB to detect malicious IP addresses coming in and out of the firewall. HoneyDB is a paid service that is used to obtain the list of blocked hosts/IPs. We are using API calls to get the most recent lists and then we correlate it with firewall logs. 

A scheduled saved search is used to update the blocklist every two hours. Internally, the search query uses custom commands to make API calls to HoneyDB's API to update the blocked list lookup. 

Saved search: **Dynamically Update Blocked IPs with HoneyDB**

Custom command: **honeydblookupgen**

Lookup to store the blocked IP/host: **ip_blocked_list (ip_blocked_list.csv)**

The two accelerated reports below are used to identify problematic firewall traffic, which are either coming from a blocked-listed IP address or going out to a blocked-listed IP address.

## Globally Detected Malicious IPs

The problematic firewall traffic data is used to create our own malicious IP address list. If a blocked IP address is connecting with three or more firewall devices, then we categorize and add it to the list of Globally Detected Malicious IPs. 

This list also adds IP addresses which are trying to make DDoS attacks on the Palo Alto firewall. The name of the saved search that generates the Globally Detected Malicious IPs is **PaloAlto Firewall - Malicious IP List Gen**.

**Note:** Another source can be substituted for HoneyDB to get the blocked IP address list. If you have enough knowledge on Splunk commands, lookups, and searches then you can switch to your own trusted source.

## **Configuration of API and Secret Key for HoneyDB**

The Splunk user has to add the API ID and API key to make HoneyDB API calls to retrieve the blocked IP list. Follow these steps to update the API ID and API key for the Cyences App:

1. Navigate to the Cyences app and from the navigation bar go to **Settings > Configuration**.

2. At the top of the dashboard there is a section for **HoneyDB Configuration**. 

3. Update the **API ID** and **API Key** for the HoneyDB API. 

![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/CY-283-cyences-doc-migration/docs/assets/honeydb_config.png?raw=true)

## **Configuration of Malicious IP Collector Server**

The Splunk user has to add the API URL and Auth token to make API calls to Cyences Malicious IP List server to create malicious IP list and retrieve the latest malicious IP list from the server. Follow these steps to update the same for the Cyences App: 

1. Navigate to the Cyences app and from the navigation bar go to **Settings > Configuration**.  

2. At the top of the dashboard there is a section for **Malicious IP Server Configuration**. 

3. Update the **API URL** and **Auth Token** for the Cyences Server API. 

![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/CY-283-cyences-doc-migration/docs/assets/malicious_ip_collector_config.png?raw=true)



**Note:** Contact the CrossRealms Cyences team to get API URL and Authentication Token.

How to test whether the configuration is functioning correctly? 

Run the search below and it should return events with no errors: 

        | maliciousiplookupgen update_lookup=False generate_events=True 

![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/CY-283-cyences-doc-migration/docs/assets/malicious_ip_lookupgen_search.png?raw=true)

## **Sophos Central API Endpoints Configuration**

Refer to the **Data Onboarding > Sophos Central Metadata through API** section for more information. 

## **Finetune Splunk Admin Related Alerts**

Currently, there is no way for Splunk search to distinguish between a missing forwarder and a forwarder which was permanently removed. For example, if a Splunk admin/user has intentionally removed a forwarder, then the Splunk users will continuously get an alert about the missing forwarder in the Missing Forwarder List. The same scenario applies to the Missing Indexes List.  

Use the **Remove Decommissioned Forwarder** dashboard panel in the Splunk Admin dashboard to remove the decommissioned forwarder from the list. 

Alternatively, users can use the query below to achieve the same goal. 

        | inputlookup cs_forwarders.csv | search NOT hostname="<hostname>" | outputlookup cs_forwarders.csv  

* Replace the field value for **hostname** with the host name of the forwarder which is being removed. 

To **remove an index from the list**, run the following search query: 

        | inputlookup cs_indexes.csv | search NOT index="<index>" | outputlookup cs_indexes.csv 

* Replace the field value for **index** with the index name which is being removed. 

**Fine-tune missing indexes alert:**

* Users can update the `cs_missing_indexes_time_duration.csv` lookup to specify time-internal for incoming data on each index so there will be not whole lot of unnecessary alert emails. 

* For example, Lansweeper collects data every four hours, so users can run the query below to fine-tune the **lansweeper** index. 

        | inputlookup cs_missing_indexes_time_duration.csv 

        | append [| makeresults | eval index="lansweeper", max_time_duration=14400] 

        | stats last(max_time_duration) as max_time_duration by index 

        | outputlookup cs_missing_indexes_time_duration.csv 

**Note:** The **max_time_duration** field is based on seconds.

## **Device Inventory**

The Device Inventory Table is generated based on live data coming into Splunk. View the Device Inventory section for more information. 

## Backfill Device Inventory 

To backfill all of the lookups related to device inventory, follow the directions below to execute the necessary search query. 

Navigate to **Cyences App for Splunk > Settings > Settings > Searches, reports and alerts**. Use the search filter to find a savedsearch named **Device Inventory Lookup CleanUp** and click on **Run** to execute the search. 

Use an appropriate time range to backfill all of the lookups, since that determines the search range for all devices (the default time range is set to Last 30 days). 

List of Device Inventory related searches that users can execute individually to backfill specific lookups: 
* Device Inventory - CrowdStrike 
* Device Inventory - Lansweeper 
* Device Inventory - Qualys 
* Device Inventory - Sophos 
* Device Inventory - Tenable 
* Device Inventory - Tenable Vun 
* Device Inventory - Windows Defender 

## CleanUp Device Inventory Related Lookups 

To clean up the lookups related to Device Inventory, follow the directions below to execute the necessary search query. 

Navigate to **Cyences App for Splunk > Settings > Settings > Searches, reports and alerts**. Use the search filter to find a savedsearch named **Device Inventory Lookup CleanUp** and click on **Run** to execute the search. 

**Caution:** We highly recommend that users run the search in the Last 60 days or another time range that is better suited for their environment, since the time range of the search will define which devices will be kept and the rest will be automatically removed.
