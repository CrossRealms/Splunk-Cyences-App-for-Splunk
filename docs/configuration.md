---
layout: default
title: Installation/Configuration
permalink: /configuration/
nav_order: 4
---

# App Installation & Configuration [Admin]

## **App Installation**

The Cyences App needs to be installed on the Search Head only.

1. From the Splunk Web home screen, click the gear icon next to **Apps**. 

2. Click on **Browse more apps**. 

3. Search for **Cyences App for Splunk** and click **Install**. 

4. Create an index named **cyences**. 
    * Navigate to **Settings > Indexes**. 
    * Click on **New Index**. 
    * Enter **cyences** for the Index Name. 
    * Click **Save**.

6. Restart Splunk after installing all dependencies. 

## **Dependency Installation on Search Head**

There are dependent apps which also need to be installed on the Search Head along with the Cyences app itself (follow the same steps mentioned in the previous section to install the apps).

| App Name | Splunkbase Link | What is this used for? |
|--------|--------|-------------|
| ES Content Update App | [https://splunkbase.splunk.com/app/3449](https://splunkbase.splunk.com/app/3449) | For some lookups
| Splunk Common Information Model (CIM) | [https://splunkbase.splunk.com/app/1621/](https://splunkbase.splunk.com/app/1621/) | For data models 
| Splunk Add-on for RWI - Executive Dashboard | [https://splunkbase.splunk.com/app/5063/](https://splunkbase.splunk.com/app/5063/) | For field extraction (VPN data) 

* Note - Additional add-ons are necessary depending on the data present in your Splunk environment. For example, if there is Windows data present, then you need to install and configure the Splunk Add-on for Windows. Please visit the Data Onboarding section for more information.

## **Data Model Acceleration and Macros**

For optimal performance, it is recommended to enable the data model acceleration for the CIM data models which are being used. 

| Data Model | Macro Name | Data-model Acceleration Time  |            
|--------|--------|-------------|
| Endpoint | cs_summariesonly_endpoint | 7 days (Minimum) |
| Network Traffic | cs_summariesonly_network_traffic | 7 day (Minimum) |
| Authentication | cs_summariesonly_authentication | 7 day (Minimum) |
| Network Resolution (DNS) | cs_summariesonly_network_resolution_dns | 7 day (Minimum) |
| Cyences_Vulnerabilities | cs_summariesonly_cyences_vulnerabilities | 1 month (Minimum) |
| Cyences_Assets | cs_summariesonly_cyences_assets |  1 month (Minimum) |

Once the data models are accelerated, update the macro definitions next, so that Splunk can take full advantage of the accelerated data models which will improve search performance overall.   

![alt](/assets/data_models_acceleration.png)

The default definition for the data model macros is summariesonly=**false** and it needs to be changed to summariesonly=**true** (**Settings > Configuration**).

## **Data Source Macros**

Navigate to **Settings > Configuration** and underneath the **Data Source Macros** section is where you can view and update several macro definitions. Verify that the macro definitions match the data source (index) used in your Splunk environment.

![alt](/assets/data_source_macros.png)

## **Other Macros**

Navigate to **Settings > Configuration** and in the **Other Macros** section is where you can view and update several macro definitions. These macros are used in various alerts, dashboards, searches, and reports. Verify that the macro definitions match the data source (index) used in your environment. 

| Macro Name | Description | Default Value |            
|--------|--------|-------------|
| cs_ad_password_change_outside_working_hour_definition | Definition for outside working hours (default setting is set to the weekend plus any weekday before 6am and after 7pm). | where date_wday="Saturday" OR date_wday="Sunday" OR date_hour<6 OR date_hour>19 
| cs_home_country (enclosed in double quotes) | Used to determine and filter the home location in the VPN dashboard and to identify O365 logins outside of home country. The country name should be compatible with the iplocation command (add quotes around the value in the macro definition). | "United States"
| Home Location Latitude (for Network Traffic Map) | Private IP's (10.x.x.x, 192.168.x.x, 172.16.x.x) will be displayed at this latitude on the map. | 41.881832 
| Home Location Longitude (for Network Traffic Map) | Private IP's (10.x.x.x, 192.168.x.x, 172.16.x.x) will be displayed at this longitude on the map. | -87.623177 
| cs_palo_search_blocked_ip_lookup_name | Lookup for blocked IP list (default is ip_blocked_list, which stores the blocked IP list from HoneyDB). | ip_blocked_list 
| cs_palo_malicious_ip_list_filter_old_results | Only update the value between the quotes (the default value is -7d@h, which means the list of Globally Detected Malicious IPs keeps any IP address for seven days since the last appearance of any IP address). | cs_palo_malicious_ip_list_filter_previous_results("-7d@h")
| cs_lansweeper_timerange | The Lansweeper dashboard searches Lansweeper data in the specified timerange. | earliest=-4h@h latest=now 
| cs_wineventlog_security_timerange | The Lansweeper dashboard searches the WinEventLog:Security data in the specified timerange to see if the asset collects WinEventLog:Security data. | earliest=-4h@h latest=now 
| cs_wineventlog_system_timerange | The Lansweeper dashboard searches the WinEventLog:System data in the specified timerange to see if the asset collects WinEventLog:System data. | earliest=-4h@h latest=now 
| cs_sysmon_timerange | The Lansweeper dashboard searches the WinEventLog:Microsoft-Windows-Sysmon/Operational data in the specified timerange to see if the asset collects WinEventLog:Microsoft-Windows-Sysmon/Operational data. | earliest=-4h@h latest=now 
| cs_qualys_timerange | The Cyences App searches Qualys data in the specified timerange for vulnerability information regarding the assets. | earliest=-7d@h latest=now 
| cs_qualys_linux_os | Qualys data contains different Linux versions in the logs to identify them as Linux OS, so this condition is being used in the Lansweeper dashboard. | `("*Ubuntu*", "*Linux*", "*CentOS*")`
| cs_ad_important_role (e.g. "val1","val2") | List of important roles | ""
| cs_ad_important_policy (e.g. "val1","val2") | List of important policies | ""
| cs_ad_important_user (e.g. "val1","val2") | List of important users | ""
| cs_ad_important_group (e.g. "val1","val2") | List of important groups | ""

![alt](/assets/other_macros.png)

## **Filter Macros**

Certain macros are being used to whitelist (filter) a specific set of results. This is useful for when an alert/report provides a result which is previously known in your environment. The benefit of this macro is that it filters the result set without having to make a copy of the alert/report/search, which will prevent any potential problems from arising when upgrading the Cyences App.  

### How to Update Filter Value
1. Open the **Cyences App for Splunk**.
2. Navigate to **Settings > Searches, reports, and alerts** and select **All** for the **Owner** filter.
3. Find the alert for which you would like to update filter for and Click **Edit > Edit Alert**.
4. Update the **Filter Macro Value** field under **When triggered > Cyences Action - Notable Event**.
**Note:** The default value for every macro is: `search *` (this would return all results). 

Filter example:
* In order to filter the events related to a service account, users can add `search NOT user="service-user"` to the filter macro.

![alt](/assets/filter_macro.png)

**Note:** Macro updates may not happen in real-time as we are performing updates every five minutes.

## Filter Alert Results Based on the Time of the Event

Since version 1.4.0, time-based filtering has been made available to every alert in the Cyences App. Let's go over a use case to understand what that is, why you need it, and how to apply it. 

Example - A user has a system (ex. 192.168.2.2) in their environment which conducts a penetration test every night between 1-2 AM via brute force password attempts to different systems. Due to these events, the user receives a ton of false positive alerts, which could easily by avoided. 

The first course of action would be to filter the events that are coming in from that IP address.

Filter examples: 

* For the **Authentication - Bruteforce Attempt for a User** alert: 

        search NOT sources="192.168.2.2"

* For the **Authentication - Bruteforce Attempt from a Source** alert: 

        search NOT src="192.168.2.2"

The downside to this is that the time range of the filter itself is very wide, because the system is only making an attempt at midnight, but the user is filtering the system as a whole (which is critical for security). What if that machine was compromised? The more optimal solution would be to filter for that specific system, but only during a certain period of time. 

Filter example: 

* For the **Authentication - Bruteforce Attempt for a User** alert: 

        `cs_generate_time_fields_for_filter` | search NOT (((firstTime_hour>=1) OR (firstTime_hour<2)) ((lastTime_hour>=1) OR (lastTime_hour<2)) sources="192.168.2.2") | `cs_remove_time_fields_for_filter`

* For the **Authentication - Bruteforce Attempt from a Source** alert: 

        `cs_generate_time_fields_for_filter` | search NOT (((firstTime_hour>=1) OR (firstTime_hour<2)) ((lastTime_hour>=1) OR (lastTime_hour<2)) src="192.168.2.2") | `cs_remove_time_fields_for_filter` 

Both the **firstTime_hour** and **lastTime_hour** fields are generated by the `cs_generate_time_fields_for_filter` macro. There are other fields that the user could use, such as:
* firstTime_ptime (epoch time for firstTime) 
* firstTime_date, firstTime_hour, firstTime_minute 
* firstTime_wday (which day of the week)
* similar fields for lastTime  

The above two alerts are generating **firstTime** and **lastTime** fields, which indicates the first and last event time during the course of the selected time range. In some cases, the alert time field could be **event_time** instead of **_time**. If necessary, Splunk users can substitute one of these fields for one of the following: event_ptime, event_date, etc.

**Note:** Basic knowledge of Splunk's Search Processing Language (SPL) is required.


## **Cyences Email Settings for Alerts**

The way Splunk currently handles alerts, users are only able to set up email notifications, which is not always optimal as some alerts may generate a lot of false positives. Not every alert needs to be received by email, especially those labeled with lower severity levels. 

Cyences 3.0.0 contains two new email settings to reduce noise:
1. Regular Alert Digest Email
    * Sends notifications about triggered notable events in the last twenty-four hours for each Cyences alert in a single email. 
    * By default, this will include both high and medium severity notable events, but users can adjust the severity level as needed.  
    * This configuration can be edited from the **Cyences Action - Send Digest Email** alert action inside of the **Cyences Digest Email** alert. 
    ![alt](/assets/digest_email_configuration.png)
    * The alert digest email will be sent once a day.
        * Users may receive multiple digest emails as there is a limit of ten alerts per digest email and each alert will be limited to fifteen notable events for the total result count information. 
2. Critical Alert Email
    * Sends an email immediately after an alert gets triggered if the notable event has been labeled with a critical severity level (default setting). Users can customize the severity level for this email setting as needed. 
    * Users will receive an immediate notification about important items within the email.
    * Users will no longer have to manually configure their email for every Cyences alert. Users can add their email address to each alert from a single source. Navigate to **Cyences App > Settings > Configuration** and add email addresses to the **Cyences Action - Send Email - Default/Common Configuration** section.  
    ![alt](/assets/cyences_action_send_email_default_common_config.png)
    * Users have an option to exclude themselves from specific alerts, to include their email addresses for specific alerts, or to disable an email altogether. This configuration can be done at the alert level by editing the **Cyences Action - Send Email** alert action for a particular alert.
    ![alt](/assets/cyences_email_configuration.png)
    * To override the email setting for a particular alert, go to the individual alert and remove the email address from the **Exclude Recipients** section. 
    * Add an email address to the **Include Additional Recipients** section if you only want to receive emails for a specific alert.

**Note** Users can continue to use Splunk's default email functionality as desired for any alert and independently of the aforementioned Cyences email settings.


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

![alt](/assets/honeydb_config.png)

## **Configuration of Malicious IP Collector Server**

The Splunk user has to add the API URL and Auth token to make API calls to Cyences Malicious IP List server to create malicious IP list and retrieve the latest malicious IP list from the server. Follow these steps to update the same for the Cyences App: 

1. Navigate to the Cyences app and from the navigation bar go to **Settings > Configuration**.  

2. At the top of the dashboard there is a section for **Malicious IP Server Configuration**. 

3. Update the **API URL** and **Auth Token** for the Cyences Server API. 

![alt](/assets/malicious_ip_collector_config.png)

**Note:** Contact the CrossRealms Cyences team to get API URL and Authentication Token.

How to test whether the configuration is functioning correctly? 

Run the search below and it should return events with no errors: 

        | maliciousiplookupgen update_lookup=False generate_events=True 

![alt](/assets/malicious_ip_lookupgen_search.png)

## **Sophos Central API Endpoints Configuration**

Refer to the **Data Onboarding > Sophos Central Metadata through API** section for more information. 

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