---
layout: default
title: Previous Release Notes
permalink: /release_notes/old_release_notes/
nav_order: 2
parent: Release Notes
---



## Version 4.2.0/4.2.1 (August 2023)

* ### Windows Certificates
    * Added "Active Directory Certificate Service Events" dashboard.
    * Added "Windows - Certificate is Expiring Soon" alert.
    * To onboard the Windows Certificate Store data, Refer [Windows Certificate Store Data Onboarding]({{ site.baseurl }}/data_onboarding/windows/certificate)

* ### Windows Firewall Status
    * Added "Windows Firewall Status" dashboard panel in the Windows dashboard. 
    * Added "Windows - Windows Firewall is Disabled" alert.
    * To onboard the Windows Firewall Status data, Refer [Windows Firewall Status Data Onboarding]({{ site.baseurl }}/data_onboarding/windows/firewall_status)


* ### Enhancements  

    * Improved the severity logic for the following alerts:
        * Email - Hourly Increase In Emails Over Baseline
        * Network Compromise - Basic Scanning
        * Authentication - Bruteforce Attempt from a Source
        * Sophos - Failed to clean up threat by Sophos
        * Sophos - Sophos RealTime Protection Disabled

    * Updated the "Microsoft 365 Defender ATP Audit" dashboard to reflect the latest change to the Defender add-on.

    * Updated splunklib to the latest version (v1.7.4).

    * Added a generic search filter in the Forensics and SOC dashboards.

    * Excluded Windows password expired events from the alerts related to brute force.


* ### Bug Fixes

    * Fixed a permissions issue that wouldn't allow users to make use of the notable event assignment functionality.

    * Fixed a Forensics and SOC dashboard compatibility issue with Splunk 9.1.X.


## Upgrade Guide from 4.1.0 to 4.2.0/4.2.1

  * To onboard the Windows Certificate Store data, Refer [Windows Certificate Store Data Onboarding]({{ site.baseurl }}/data_onboarding/windows/certificate)
  * To onboard the Windows Firewall Status data, Refer [Windows Firewall Status Data Onboarding]({{ site.baseurl }}/data_onboarding/windows/firewall_status)
  * Update the [Cyences Add-on for Splunk](https://splunkbase.splunk.com/app/5659) to latest version.



## Version 4.1.0 (July 2023)

* ### Added "Network Compromise - DDoS Behavior Detected" alert.

* ### Using a New Input for Office 365 Login Data to Improve Results
    * Improved all of the O365 login related alerts and dashboards to display more information using the O365 audit sign-in logs from the Splunk Add-on for Office 365.

* ### Enhancements  

    * Enhanced the "Windows - Windows Process Tampering Detected" alert to display the source process details that tampered with the Windows process.

    * Updated field order in the Digest Email to show notable_event_id field as last column.

    * Improved cyences_severity logic for "Ransomware - Calculate UpperBound for Spike in File Writes" alert.

    * Added raw filter macro and Improved cyences_severity logic for "Network Compromise - Basic Scanning" alert.

    * Enhanced "Email - Hourly Increase In Emails Over Baseline" alert to display the domain information of the recipient.

    * Improved "Linux - User Added/Updated/Deleted" and "Linux - Group Added/Updated/Deleted" alerts to display the exact changes in detail.
        * Deprecated "Linux - Change in Sudo Access of Local Linux Account" alert.

    * Updated threshold value for the "Network Compromise - Basic Scanning" alert.

* ### Bug Fixes

    * Fixed a fetching issue for the first fifty records for the Sophos endpoint custom command.

    * Fixed a permissions issue that wouldn't allow users to make use of the notable event assignment functionality.


## Upgrade Guide from 4.0.0 to 4.1.0

  * Cyences Authentication data model has been added. Users should accelerate the summary range of the Cyences Authentication data model to at least a 1 month period to improve search performance overall.



## Version 4.0.0 (June 2023)

* ### Notable Event Assignment
    * Notable events can now be assigned to Splunk users to better facilitate investigations for an incident. Users can also update the status for a notable event based on where it is in the investigation phase.
    * Added a SOC Dashboard which provides a summary of notable events pertaining to specific alerts, as well as who is assigned to a notable event, the status of the notable event and the severity level of the notable event.
    * Updated the Overview dashboard to filter results based on the values selected for the status filter.

![alt]({{ site.baseurl }}/assets/notable_event_assignment.png)

* ### Added Cyences Settings Page
    * Users can utilize the Cyences App Configuration page to customize which dashboards and alerts are enabled/disabled to their liking.
    * The Cyences App Configuration page also allows users to see if the data source configuration (index macro) is applied accurately for each security product and if their Splunk environment has data present for it or not. Users can edit the product's configuration from this page as well.
    * All of the previous configurations (Cyences Default Email Configuration, Macro Setup, etc.) have been migrated to the new Cyences App Configuration page.

![alt]({{ site.baseurl }}/assets/data_source_macros.png)

* ### Added Alerts for Logins from an Unusual Country
    * O365 - Login Failure From Unusual Country Due To Multi Factor Authentication
    * O365 - Successful Login From Unusual Country
    * Authentication - Successful VPN Login From Unusual Country (Enhanced)

* ### Added "Vulnerability - Detected Vulnerabilities" alert and a Vulnerability dashboard panel in the Overview dashboard.

* ### Enhancements
    * Enhanced the MultiSelect functionality overall.
        * MultiSelect input will automatically select/unselect the "All" option based on the user's selection across all of the dashboards.
    
    * Support for email messagetrace event has been added using the Splunk Add-on for Office 365. 
        * Updated email related alerts to support email messagetrace events using the Splunk Add-on for Office 365.

    * Reduced the severity level of notable events that are already blocked by the Palo High Threats alert.

    * Windows - Windows Process Tampering Detected alert
        * Added internal filter macro to reduce the number of false positives.

    * Added ApplicationId field to all of the O365 login related alerts.

    * Improved "O365 - Login From Unknown User" alert to consider both "Unknown" and "Not Available" user values.

    * Improved the readability for the "O365 - Daily Login Failure" alert.

    * Excluded TriggerBrowserCapabilitiesInterrupt error events from "O365 - Daily Login Failure" alert to reduce the number of false positives.
        * For more information related to the error: https://login.microsoftonline.com/error?code=501314
    
    * Improved the severity logic for "Email - Hourly Increase In Emails Over Baseline" alert to reduce the number of false positives.

* ### Bug Fixes
    * Fixed a minor issue in the DNS Tracker dashboard where events wouldn't populate as expected.

    * Fixed an issue for when a Windows decommissioned host would reappear after removing it.

    * Fixed the search query for the "Windows Defender RealTime Protection Disabled or Failed" alert.

    * Fixed an inconsistency between the severity level of alerts and the Overview dashboard for antivirus service stop alerts.

    * Fixed Cyences logo issue.


## Upgrade Guide from 3.1.0 to 4.0.0

* ### Cyences Settings
    * Visit the [Cyences App Configuration]({{ site.baseurl }}/install_configure/configuration/#products-setup-data-source-macros) page to make changes.

    * The "Microsoft 365 Defender Add-on for Splunk" has been deprecated. Use the "Splunk Add-on for Microsoft Security" instead for O365 Defender ATP data collection.



## Version 3.1.0 (March 2023)

* ### Monitor Linux Groups & Users (Linux/Unix)
    * Added savedsearch and dashboard panels to track the group and user changes for the Linux environment.

* ### Sophos Firewall Integration
    * Mapped Sophos Firewall Traffic data with the Network_Traffic Model.
    * Added new Sophos Firewall dashboard
    ![alt]({{ site.baseurl }}/assets/sophos_firewall.png)
    * To onboard the Sophos Firewall data, Refer [Sophos Firewall Data Onboarding]({{ site.baseurl }}/data_onboarding/network_devices/sophos_firewall/)

* ### Inbound Vulnerable Traffic Alerts
    * Added new "Network Compromise - Inbound Vulnerable Traffic" to alerts the incoming traffic on the vulnerable port.

* ### Enhancements
    * VPN
        * Added more filters to filter results by Users (Multiselect), Host, Public IP Address and Private IP Address.
    
    * Bruteforce Alerts
        * Improved search query to show the count for src, user and dest fields.
        * Reduced severity from critical to high for windows event if src field value is unknown.

    * AD Password Change Alerts and Dashboard
        * Improved search query to show the count for ComputerName, status and Actor fields.
        * Added Probable Sources field to show the IP Address detail.


* ### Bug Fixes
    * Fixed the filter issue for the Windows Patch dashboard.

    * Fixed the permission issue for the cyences alert actions.

    * Fixed the auto extraction of additional fields for the cyences:notable:events sourcetype.

    * Fixed the search query for the Linux Successful login.

    * Fixed the Windows - Hosts Missing Update alert to handle hostname case sensitivity issue.
    
    * Fixed the "Email - Hourly Increase In Emails Over Baseline" alert to handle the data ingestion delay and fixed percentage calculation logic.


## Upgrade Guide from 3.0.0 to 3.1.0

* ### Monitor Linux Groups & Users (Linux/Unix)
    * Update TA-cyences Addon to latest version (v1.1.1) and enable the users.sh and groups.sh scripted inputs.


* ### Sophos Firewall Integration
    * To onboard the Sophos Firewall data, Refer [Sophos Firewall Data Onboarding]({{ site.baseurl }}/data_onboarding/network_devices/sophos_firewall/)



## Version 3.0.0 (January 2023)

* ### Alert Severity and Categorization
    * The Overview dashboard will now display different colors for notable events based on their severity level. This way users can prioritize their security investigation at a quick glance. 
        ![alt]({{ site.baseurl }}/assets/overview_dashboard_severity_level_colors.png)
    * A new filter has been added to the Overview dashboard which allows users to filter notable events based on the severity level.  
        ![alt]({{ site.baseurl }}/assets/overview_dashboard_severity_level_filter.png)


* ### Custom Alert Digest Email
    * The way Splunk currently handles alerts, users are only able to set up email notifications, which is not always optimal as some alerts may generate a lot of false positives. Not every alert needs to be received by email, especially those labeled with lower severity levels. 
    * Cyences 3.0.0 has introduced two new email settings to reduce noise:
        1. Regular Alert Digest Email
            * Sends notifications about triggered notable events for each Cyences alert in a single email. 
            * By default, this will include both high and medium severity notable events, but users can adjust the severity level to their desired preference.  
            * The alert digest email will be sent once a day. 
            ![alt]({{ site.baseurl }}/assets/digest_email_configuration.png)
        2. Critical Alert Email
            * Sends an email immediately after an alert gets triggered if the notable event has been labeled with a critical severity level.
            * Users will receive an immediate notification about important items within the email.
            * Another enhancement is that users will not have to manually configure their email for every Cyences alert. Users can add their email address to each alert from a single source (Cyences Configuration page).  
            ![alt]({{ site.baseurl }}/assets/cyences_action_send_email_default_common_config.png)
            * Also, users have an option to exclude themselves from specific alerts or to include their email addresses for only specific alerts.
            ![alt]({{ site.baseurl }}/assets/cyences_email_configuration.png)
        3. Users can continue to use the default email notification method that Splunk provides if they want to for any specific alert.  

    * Refer to the [Cyences Email Settings for Alerts]({{ site.baseurl }}/install_configure/configuration/#cyences-email-settings-for-alerts) section for more information regarding the email configuration process for Cyences.

* ### Alert Filter Configuration from Searches, Reports and Alerts Page 
    * Users are now able to configure Cyences’ filter macros (to filter out the false positives of an alert) right from Splunk’s navigation bar (Settings > Searches, Reports, and Alerts) instead of from Cyences’ configuration page. (**Note:** Do not update the macro directly)
    ![alt]({{ site.baseurl }}/assets/filter_macro.png)
    * This change was made to avoid confusion, as users had to figure out which macro is related to which alert. Users can now view the configuration right underneath the alert configuration section.  
    * Macro updates may not happen in real-time as App is performing the update every five minutes.
    * CrossRealms has also handled the Cyences app upgrade scenario for this, so users do not have to worry about configuring every macro again.

* ### Enhancements

    * AD - User Changed Alert
        * Added a filter to reduce the number of false positives.

     * Authentication Dashboard
        * Added the last successful login and last failed login timestamps to the table. 
        * ![alt]({{ site.baseurl }}/assets/user_authentication_activity_timestamps.png)

    * Forensics Dashboard
        * Added search queries for specific alerts which are necessary to perform drilldowns and to populate the contributing events dashboard panel.

    * VPN Alert & Dashboard
        * Added a Destination field to the VPN dashboard and alert. 
            * For example (if you are using Global Protect), users can see which Palo device generated a particular event. 
        * Added a Reason field to the “Elapsed Time Per Session” dashboard panel to display the reason for a VPN session termination. 
        ![alt]({{ site.baseurl }}/assets/vpn_dashboard_enhancement_v300.png)

    * Vulnerability Dashboard
        * CrowdStrike Spotlight data is now supported.

     * Windows - Fake Windows Processes Alert
        * Added filters to reduce the number of false positives.


* ### Bug Fixes

    * Windows Host Missing Update Alert & Windows Patch Dashboard 
        * In some cases, both the alert and dashboard included data that were not related to Windows Update Events due to an EventCode conflict. This issue has been resolved.  

    * Fixed an issue where some notable events displayed the incorrect timestamp information.  
        * The data for Cyences notable events are now logged under sourcetype="cyences:notable:events".

    * Improved Logging [For Admins Only]
        * Fixed an issue where Cyences internal logs were being truncated.
        * Moved the default log level for custom commands to INFO in order to reduce the number of logs in the internal index.
        * Added more info logs to custom commands for improved troubleshooting.



## Upgrade Guide from 2.3.0 to 3.0.0

* Overview Dashboard
    * By default, non-triggered alerts will remain hidden. 
    * Users can still view every alert by unchecking the **Hide Not Triggered Alerts** filter. 

* Custom Alert Digest Email
    * Users must configure their email address in order to use this feature. Refer to the [Cyences Email Settings for Alerts]({{ site.baseurl }}/install_configure/configuration/#cyences-email-settings-for-alerts) section for more information. 

* "Network Reports" dashboard is now renamed as "Network Telemetry".



## Version 2.3.0 (July 2022)

* ### New Vulnerability Dashboard

    * Replaced `Tenable` and `Qualys` dashboard with a new `Vulnerability` dashboard.

    * Replaced `Qualys Host Summary` and `Tenable Host Summary` with a new  `Host Vulnerability Summary` dashboard panel. Similarly replaced `Qualys Vulnerabilities` and `Tenable Vulnerabilities` with a new `Host Vulnerabilities` dashboard panel in the `Asset Intelligence` dashboard.

* ### VPN Related Enhancements

    * Added `Authentication - Long Running VPN Session Disconnected` alert.

    * Added `Elapsed Time Per Session` dashboard panel in the `VPN` dashboard.

* ### Enhancements

    * Active Directory
        * Added more filters in the Active Directory dashboard

    * Network Reports
        * Updated Map chart from `network_telemetry_map` to Splunk Map to show all the traffic instead of top 20 traffic detail.

    * Palo Alto Firewall
        * Added `dvc_name` field in the `List of Firewall Devices` dashboard panel.

* ### Bug Fixes

    * Forensics
        * Resolved the search dropdown issue for `O365 - Azure Active Directory -*` alerts on the `Overview` to `Forensics` dashboard.

    * Office 365
        * Resolved the duplicate event issue for O365 management activity related alerts and dashboard.

* ### For Splunk Admins Only

    * Updated splunklib to the latest version (v1.7.0)

    * Added `Cyences_Vulnerabilities` and `Cyences_Assets` datamodel.

    * Added `cs_all_vuln` and `cs_all_assets` KV lookup.

    * Added `Asset Inventory - Vulnerability Lookup Gen` and `Asset Inventory - Lookup Gen` to populate `cs_all_assets` and `cs_all_vuln` lookups from `Cyences_Vulnerabilities` and `Cyences_Assets` datamodel respectively.

    * Updated `Lansweeper` and `Network Reports` dashboard to use `cs_all_vuln` and `cs_all_assets` lookup

## Upgrade Guide from 2.2.0 to 2.3.0

* After App Upgrade, Run the `Asset Inventory - Vulnerability Lookup Gen` and `Asset Inventory - Lookup Gen` with the last 1-year or longer time range as necessary to populate the historical data in the `cs_all_assets` and `cs_all_vuln` lookups. Make sure to use `summariesonly=false` in the search to cover all the data.

* Enable the `Cyences_Vulnerabilities` and `Cyences_Assets` datamodel acceleration to improve the search query performance. For datamodel acceleration steps refer: Doc Home page -> Configuration -> App Installation and Configuration -> Data Model Acceleration & Macros

* The `Tenable` and `Qualys` dashboard will be replaced with a new `Vulnerability` dashboard.



## Version 2.2.0 (June 2022)

* ### New Windows Dashboard 
    * Added `Windows Patch` dashboard to monitor for Windows update related events.

* ### Added New Alerts

   * Active Directory
      * `AD - Multiple Password Changes in Short Time Period` 
      * `AD - Bulk User Creation or Deletion` 
           
   * G Suite
      * `G Suite - Multiple Password Changes in Short Time Period` 
      * `G Suite - Bulk User Creation or Deletion` 

* ### Enhancements 

    * Active Directory 
        * Made improvements to the `AD - Password Change Outside Working Hour` alert and dashboard panel to display additional fields.

    * G Suite
        * Added `User Created` and `User Deleted` dashboard panels to the G Suite dashboard.

    * Linux/Unix 
        * Added the time field for both the `Success Login by Host, Users` and `Failed Login by Host, Users` dashboard panels in the `Linux/Unix` dashboard
        * Removed the `Open Ports` dashboard panel as the `Listening Ports on Host` dashboard panel provides the same information with additional fields.

    * Network Reports 
        * Added drilldown to the `Port Scanning Attempts` map.

    * Office 365
        * Updated the alerts and dashboard to use the new `o365:service:healthIssue` sourcetype (`o365:service:status` sourcetype has been retired by the Add-on).
        * Added `Login by location` map to the `Office 365` dashboard.
        * Added `authentication_method` and `user_type` fields for O365 login related alerts and dashboard panels.

    * Ransomware Alerts
        * Enhanced filters for paths to reduce false positives for both `Ransomware - Calculate UpperBound for Spike in File Writes` and `Ransomware - Spike in File Writes`.

    * VPN 
        * Added `Successful Session` dashboard panel.
        * Added drilldown to the `Connected Workforce by Location` map.

    * Windows Reports 
        * Added `Listening Ports on Host` dashboard panel to the `Windows Reports` dashboard. For data collection, users need to enable the `win_listening_ports` scripted input.


* ### Bug Fixes
    * Fixed a drilldown issue for the `Login Details` dashboard panel in the `VPN` dashboard.

    * Fixed the source value in the `cs_sysmon macro` macro.


## Upgrade Guide from 2.1.0 to 2.2.0

* Users need to enable the `win_listening_ports` scripted input from the Splunk Add-on for Windows to populate the `Listening Ports on Host` dashboard panel in the `Windows Reports` dashboard.

* The `openPorts.sh` scripted input is no longer reqired for the Cyences App. Users can disable the input from Splunk Add-on for Linux and Unix.



## Version 2.1.0 (May 2022)

* ### Ransomware alert improvement
    * Added filters for paths to reduce false positives for both report `Ransomware - Calculate UpperBound for Spike in File Writes` and alert `Ransomware - Spike in File Writes`.

    * Increased minimun file write limit from 20 to 3000 to reduce the false positive.

    * Added `top5_file_extension`, `avg`, and `stdev` field in the `Ransomware - Spike in File Writes` alert.

    * Added `parent_process_path` field in the `Ransomware - Endpoint Compromise - Fake Windows Processes` alert.

* ### Palo Alto Firewall System alert and dashboard improvement
    * Excluded the License related events from the `Palo Alto High System Alert` alert and `System Events` panel in the Palo Alto dashboard.
    * Added a new `License Events` panel to show all Palo Alto license-related events.

* ### Palo Alto Firewall DNS Sinkhole improvement
    * Added `url` field in the `Palo Alto DNS Sinkhole` alert and forensic searches.

* ### DNS Tracker dashboard improvement.
    * Added hostname details for any IP field to easily identify the machine based on the information available in Device Inventory lookup.
    * Separated panels to show information about `actual hosts making DNS requests` vs `DNS servers making DNS requests to other internal DNS servers` vs `DNS servers requesting external DNS servers`. 
        * This will give more clarity about who is the actual requester, how well each internal DNS server is performing, any malicious behavior by a client/source, lots of malicious/incorrect responses received from a specific external DNS server, etc.


* ### Bug Fixes
    * Fixed a drilldown issue for the `Antivirus` panel in the `Overview` dashboard.

    * Fixed the token name to populate the `PowerShell Script Execution Error` panel of `Microsoft 365 Defender ATP Audit` dashboard.

    * Fixed the `Linux/Unix` dashboard to show results when some fields in the data are not present.

* ### Cloud Compatibility Issue Fixed
   * Fixed the cloud vetting issue to make addon cloud compatible by validating that the App only makes requests to secure HTTPS URLs.


## Upgrade Guide from 2.0.0 to 2.1.0

* No upgrade guide needed.


## Version 2.0.0 (April 2022)

* ### New Documentation Location
    * The new location for the documentation can be found here: [This](https://crossrealms.github.io/Splunk-Cyences-App-for-Splunk).

* ### New Network Telemetry
    * Network traffic map visualizations have been added to enhance the functionality of the network traffic maps.
        * Users can now click on the network traffic arrow itself, which will result in a drilldown showing the details relevant to that traffic.
        * The `Network Reports` and `Asset Intelligence` dashboards are now utilising the newly added custom visualizations from the `Network Telemetry Map`.
        ![alt]({{ site.baseurl }}/assets/network_telemetry_map.png)

    * Removed the `Top Network Traffic` dashboard panel from the `Network Reports` dashboard.
        * The network traffic display has been enhanced by adding the following new dashboard panels:
            * Inbound Network Telemetry
            * Outbound Network Telemetry
            * Internal Traffic
    
    * Removed the following dashboard panels from various dashboards. User can see alternative panels on the `Network Reports` dashboard as mentioned above. User would also see link on the origial dashboard to let them to new location.
        * Removed the `Network Traffic to/from Vulnerable Ports (Detected from Qualys)` and `Network Traffic to/from Vulnerable Ports (Detected from Tenable)` dashboard panels from the `Asset Intelligence` dashboard.
        * Removed the `Traffic on Vulnerable Ports` dashboard panel from the `Qualys` dashboard.
        * Removed the `Traffic on Vulnerable Ports` and `All Traffic on All Vulnerable Hosts` dashboard panels from the `Tenable` dashboard.

* ### Removed Splunk Admin related alerts and dashboards
    * Removed all of the Splunk Admin related alerts and dashboards from the Cyences app.
    * Contact CrossRealms' support team to get the enhanced Admin Dashboards and Alerts.
        * Email: info@crossrealms.com / support@crossrealms.com

* ### Added New Alerts
    * Active Directory
        * AD - Password Change Outside Working Hour
    * Cisco IOS
        * Cisco IOS - New Connection For User
        * Cisco IOS - Device Failed Login
    * Office 365
        * O365 - Authentication Blocked By Conditional Access Policy
        * O365 - Daily Login Failure
        * O365 - Login Failure Due To Multi Factor Authentication
        * O365 - Login Failure Outside Home Country Due To Multi Factor Authentication
        * O365 - Login From Unknown User
        * O365 - Security Compliance Alert
        * O365 - Successful Login Outside Home Country
    * Office 365 Active Directory
        * O365 - Azure Active Directory - GroupMembership Change/Update
    * Office 365 Emails
        * Email- Hourly Increase In Emails Over Baseline
        * Email- Daily Spam Email
    * Palo Alto
        * Palo Alto Firewall - Commits
    * VPN
        * Authentication - Successful VPN Login Outside Home Country


* ### Enhancements
    * Office 365 Dashboard
        * Added a new alert and dashboard panel called `Azure Active Directory - GroupMembership Change/Update`.

    * Antivirus details have been added to the Lansweeper Dashboard.
        * Added an `active_antivirus` column to multiple dashboard panels.
        * Users needs to have version 1.3.0 of the Lansweeper Add-on to collect the Antivirus related data.

    * Updated the following Antivirus releated alerts to reduce the number of false positives using Lansweeper's asset data. The updated alerts will filter the host if it has any other antivirus enabled on it.
        * Sophos - Endpoint Not Protected by Sophos
        * Sophos - Sophos Service is not Running
        * Windows Defender - Windows Defender RealTime Protection Disabled or Failed

    * Enhanced the search query for the `Windows Defender - Windows Defender RealTime Protection Disabled or Failed` alert to reduce the number of false positives.
        * Changed the default cron job from every 15 minutes to every hour.

    * Bruteforce alerts
        * Added the dest field to the results of the following bruteforce related alerts for a more thorough forensic investigation:
            * Authentication - Bruteforce Attempt for a User
            * Authentication - Bruteforce Attempt from a Source
            * Authentication - Excessive Failed VPN Logins for a User
            * Authentication - Excessive Failed VPN Logins from a Source

    * Better support for DNS logs
        * Added props and field extractions for Windows DNS Logs (MSAD:NT6:DNS, isc:bind:query, & isc:bind:queryerror sourcetypes).


* ### Bug Fixes and Typos
    * Renamed the `0365 - O365 Service is not Operational` alert to `O365 - O365 Service is not Operational` since there was an accidental typo present.
        * Users will be required to reconfigure the new alert.
    
    * Improvements to Office 365 Active Directory related alerts and dashboards. It now displays some of the missing events.

    * Fixed some issues with Python commands.
        * Fixed an issue when handling an empty ip field for the device_inventory_gen command.
        * Fixed a time-out issue with Malicious IP upload and download commands.

    * Renamed the some of the panel titles in the `DNS Tracker`, `GSuite` `Kaspersky`, `Office 365` and `Windows Defender` dashboard.

    * Fixed a drilldown issue for the Antivirus dashboard panel in the Overview dashboard.


## Upgrade Guide from 1.11.0 to 2.0.0

* ### Removed Splunk Admin related alerts and dashboards
    * The pre-existing Splunk Admin related alerts will not work after upgrading the app.
    * Contact CrossRealms' support team to get the enhanced Admin Dashboards and Alerts.
        * Email: info@crossrealms.com / support@crossrealms.com

* ### Lansweeper Add-on Version 1.3.0
    * Users need to have version 1.3.0 of the Lansweeper Add-on to collect antivirus related data.

* ### The `O365 - O365 Service is not Operational` alert needs to be reconfigured.
    * Users will be required to reconfigure the new alert as it has been renamed.


## Version 1.11.0 (January 2022)

* ### Added Kaspersky dashboard
    * Added the required field extractions. 
    * Added support for Kaspersky in the Device Inventory and Asset Intelligence dashboards.

    ![alt]({{ site.baseurl }}/assets/kaspersky.png)

    ![alt]({{ site.baseurl }}/assets/kaspersky_part_two.png)

    * Added support for Kaspersky in the Device Inventory and Asset Intelligence dashboards.

    ![alt]({{ site.baseurl }}/assets/kaspersky_part_three.png)

* ### DNS dashboard 
    * Added DNS Tracker dashboard for the following use-cases: Top Categories, Record Types, DNS Log Volume over Time, Record Types over Time, Top queries, Top Non-success Code Queries, Top Requesters, and Top Non-success queries Code Requesters.

    ![alt]({{ site.baseurl }}/assets/dns_tracker.png)

    ![alt]({{ site.baseurl }}/assets/dns_tracker_continued.png)

* ### Microsoft Defender ATP Alert
    * Added a security alert for Office 365 Advanced Threat Protection.

    ![alt]({{ site.baseurl }}/assets/defender_atp_alert.png)

* ### VPN Dashboard
    * Added support for Cisco VPN (logs from Cisco ISE and Estreamer are supported). 
    * Changed the field name from field dest to dest_category="vpn_auth" for better CIM compatibility. 

        * This field is being used to display the correct count of VPN logins.

* ### Enhancements:
    * Splunk Admin - Missing Indexes Alert
        * Improved the performance of the query.
    * Splunk Admin Dashboard - Missing Indexes Table 
        * Reduced the loading time of the search query after performing a drilldown.
    * Windows Defender Event Logs
        * Added support for logs coming from Windows 10 hosts (resolved field extraction related issues). 
    * Decommission Hosts from Lookups 
        * Added dashboard panels to remove the decommissioned hosts from the Windows hosts lookup, as well as the Linux hosts lookup.
            * This is required to avoid false positive alerts. 

    ![alt]({{ site.baseurl }}/assets/decommission_host_from_lookups.png)

## Upgrade Guide from Version 1.10.0 to 1.11.0

* The Cyences App now supports Kaspersky. Refer to the **Data Onboarding > Kaspersky Logs** section for more information regarding the data collection process. 
* The VPN dashboard now supports [Cisco ISE](https://splunkbase.splunk.com/app/1915/) and [Estreamer](https://splunkbase.splunk.com/app/3662/) data to show authentication activities from VPN. 
* Cyences has a new dashboard called **DNS Tracker**. It supports all types of DNS related data that are compatible with the CIM data model. For example, the [Cisco Umbrella Add-on](https://splunkbase.splunk.com/app/3926/).


## Version 1.10.0 (November 2021)

* ### Azure Active Directory: Office 365
    * Added Office 365 alerts and dashboard panels to the Office 365 dashboard. 

        ![alt]({{ site.baseurl }}/assets/azure_ad_authorization_policy.png)

        ![alt]({{ site.baseurl }}/assets/azure_ad_group_change.png)

        ![alt]({{ site.baseurl }}/assets/azure_ad_user_change.png)

        * AuthorizationPolicy Change/Update 
        * Policy Change/Update 
        * Role Change/Update 
        * Group Change/Update 
        * User Change/Update 
        * ServicePrincipal Change/Update 
        * Application Change/Update 
        * Other Change/Update

* ### Splunk Admin Checks Dashboards 
    *  Added multiple dashboard panels to identify issues within a Splunk environment, as well as when performing an audit. 
        * Splunk Admin - Checks - General 

         ![alt]({{ site.baseurl }}/assets/splunk_admin_checks_general.png)

        * Splunk Admin - Checks - Forwarders, Inputs, Deployment Server 

        ![alt]({{ site.baseurl }}/assets/splunk_admin_checks_forwarders.png)

        * Splunk Admin - Checks - Parsing and Timestamp

        ![alt]({{ site.baseurl }}/assets/splunk_admin_checks_parsing.png)

        * Splunk Admin - Checks - Indexer  

        ![alt]({{ site.baseurl }}/assets/splunk_admin_checks_indexer.png)

        * Splunk Admin - Checks - Search Head 

        ![alt]({{ site.baseurl }}/assets/splunk_admin_checks_search_head.png)

    *   From Cyences' navigation bar, go to **Settings > Splunk Admin Checks** to view all of the Splunk Admin Checks dashboards. 

* ### Enhancements: 

    * Splunk Admin - Missing Data in Indexes Alert 
        * Provided a way to configure incoming data intervals for each index through a lookup. 
        * View the **Finetune Splunk Admin Related Alerts** section for more details.   

    * Fake Windows Process Alert - Reduce False Positives 
        * Added a lookup to exclude the false positives based on the file hashes.

    * Common Ransomware File Extensions Alert 
        * Improved the alert query to reduce the number of results while preserving the necessary information. 

* ### Issues Fixed:

    * A cloud compatibility issue related to app.conf triggers has been resolved.

## Upgrade Guide from Version 1.9.0 to 1.10.0

* ### Splunk Admin - Missing Data in the Index Alert 
    * View the **Finetune Splunk Admin Related Alerts** section for additional details.

* ### Common Ransomware File Extensions Alert  
    * The query for this alert has been updated and it may affect any filters placed on the alert. 
    * After upgrading the app, check to see if this alert continues to work properly. 
    * For example, the file_path field has been removed, top10_file_location field has been added, etc. 

## Version 1.9.0 (October 2021)

* ### Updated Sysmon Deployment and Data Onboarding Guide 
    * Please find more information below in the Upgrade Guide section.

* ### Meraki Firewall Log CIM Compatibility: 
    * Added props to Meraki firewall logs to make network flow data compatible with the CIM data-model. 

* ### Enhancements: 
    * The coloring scheme for vulnerability related information for Tenable/Qualys has been updated for the Device Inventory and Asset Intelligence dashboards. 
    * The Active vulnerability count displayed for Tenable/Qualys now excludes informational related vulnerabilities. 
    * Overview Dashboard: 
        * Individual alerts can now be hidden from the dashboard. 
        * Office 365 alerts are data dependent. If there is no data coming under this index, then the following alerts will not populate notable events:  
            * Currently not Operational O365 Services
            * Currently Disabled/Stopped Sophos Services 
            * Currently Stopped/Disabled Sophos RealTime Protection 
            * Currently Disabled/Stopped Windows Defender Services 
            * Currently Stopped/Disabled Windows Defender RealTime Protection 
    * Tenable Dashboard  
        * Added a dashboard panel for **All Traffic on All Vulnerable Hosts**
    
    ![alt]({{ site.baseurl }}/assets/all_traffic_on_all_vulnerable_hosts.png)

    * Linux Sudo Access / Change in Sudo Access of Local Linux Account Alert
        * Released Cyences Add-on version 1.0.2. 
        * Fixed an issue where an inappropriate number of alerts was generated for the **Linux - Change in Sudo Access of Local Linux Account** alert. 

    * Active Directory - User Changed Alert 
        *   Added a Message field to the alert results and dashboard panel to display what has changed. 

    ![alt]({{ site.baseurl }}/assets/ad_user_changed.png)

    * Windows Dashboard - Windows Users and Privileges (EventCode=4672) 
        * Added user privilege information and number of logins by user to dashboard panel 
    
    ![alt]({{ site.baseurl }}/assets/windows_users_and_privileges.png)

* ### Issues Fixed: 

    * Splunk Admin License Usage Panel 
        * License usage is now displayed in GB. 
        * Old: 

        ![alt]({{ site.baseurl }}/assets/splunk_license_usage_old.png)

        * New:

        ![alt]({{ site.baseurl }}/assets/splunk_license_usage_new.png)

    * Sysmon Deploy Audit Dashboard 
        * Previously displayed that no hosts with data are present even though there is Sysmon data available. 

    * Forensics Dashboard 
        * Fixed an issue with missing fields in the **Notable Events** dashboard panel.
        * Fixed an error displayed at the top right-hand corner of the dashboard panel. 
        * Old: 

        ![alt]({{ site.baseurl }}/assets/notable_events_old.png)

        * New:

        ![alt]({{ site.baseurl }}/assets/notable_events_new.png)

## Upgrade Guide from Version 1.8.0 to 1.9.0

 * ### Sysmon Deployment/Data-Onboarding Guide Updated 
    * We have improved the Sysmon deployment and configuration guide by creating a simple Sysmon TA that has the latest binary, configuration file, and all known issues fixed with scripts and inputs for the Cyences App. 
    * Remove both the **TA-sysmon-deploy** and **TA-microsoft-sysmon** add-ons if they are installed on any forwarders, as well as the deployment server. 
    * Refer to the **Data Onboarding > Sysmon** section to configure the Sysmon deployment and data collection process. 

* ### Cyences Add-on Version 1.0.2 
    * Update the Cyences Add-on to version 1.0.2 - [https://splunkbase.splunk.com/app/5659/](https://splunkbase.splunk.com/app/5659/).

## Version 1.8.0 (September 2021)

* ### Tenable and Qualys: Correlation Between Vulnerabilities and Network Telemetry
    * Added a new dashboard panel named Traffic on Vulnerable Ports that displays traffic on vulnerable ports for both Qualys and Tenable. Users can view these details in the Tenable and Qualys dashboard.

    ![alt]({{ site.baseurl }}/assets/traffic_on_vulnerable_ports.png)

* ### FortiGate VPN Support 
    * The VPN dashboard now supports FortiGate VPN logs.

* ### Added **Windows** dashboard:
    * The new dashboard for Windows has been separated from Active Directory. 
    * The Active Directory dashboard now uses dashboard panels from its original dashboard. 
    * The new Windows dashboard has access to privileged objects and services, as well as user privilege related information. 

    ![alt]({{ site.baseurl }}/assets/windows_dashboard.png)

    ![alt]({{ site.baseurl }}/assets/windows_dashboard_part2.png)

    ![alt]({{ site.baseurl }}/assets/windows_dashboard_part3.png)

* ### Palo Alto dashboard: 
    * Added **System Events** and **Threat Events** dashboard panels.

    ![alt]({{ site.baseurl }}/assets/system_alerts_and_threats.png)

    ![alt]({{ site.baseurl }}/assets/system_events.png)

    * Added information about available sourcetypes for each Palo device in the **List of Firewall Devices** dashboard panel. 

    ![alt]({{ site.baseurl }}/assets/list_of_firewall_devices.png)

* ### Splunk Admin dashboard:
    * Added a **Splunk License Usage** dashboard panel. 
    * Added an alert for license violations. 

    ![alt]({{ site.baseurl }}/assets/splunk_license_usage.png)

    * Added another dashboard panel named **Instance Disk Usage**. 
    * Added an alert for when disk usage exceeds 85% or when disk space is less than 6GB. 

    ![alt]({{ site.baseurl }}/assets/instance_disk_usage.png)

* ### Enhancements:
    * Ransomware - Spike in the File Writes Alert 
        * Added file locations (top 5) alongside the file writes count, so that users can identify whether the alert is a false positive or a legitimate ransomware attack right from the email notification itself.
        * Old: 

        ![alt]({{ site.baseurl }}/assets/spike_in_file_writes_old.png)

        * New:

        ![alt]({{ site.baseurl }}/assets/spike_in_file_writes_new.png)

    * Asset Intelligence and Tenable dashboards  
        * Added CVE and a solution field for tenable related vulnerabilities. 
    * Overview dashboard 
        * Improved the drilldown action for the Splunk Admin dashboard panel, so that it automatically applies the same set of search filters from the Overview dashboard to the Splunk Admin dashboard. 
    * Network Reports dashboard 
        * Added a drilldown option to the **Port Scanning Attempts** map. 
    * Active Directory alerts 
        * Improved search queries for Active Directory related alerts. 
        * The alert results will now display a field for ComputerName. 

* ### Issues Fixed: 
    * Amazon Web Services dashboard 
        * Fixed a loading issue in the AWS dashboard panel. 

## Upgrade Guide from Version 1.7.0 to 1.8.0 

* FortiGate VPN Data Collection 
    * If you are using Fortinet FortiGate VPN, then refer to the **Data Onboarding > FortiGate VPN Logs** section to see how to collect VPN data which can be populated in the VPN dashboard. 
* New Splunk Admin alerts 
    * Enable both Splunk Admin alerts to monitor for Splunk licensing and disk usage (Settings > Settings > Searches, Reports and Alerts). 

## Version 1.7.0 (August 2021)

* ### Added **AWS** dashboard
    * From Cyences' navigation bar, go to **Control > Reports > AWS**. 

    ![alt]({{ site.baseurl }}/assets/aws_dashboard_part1.png)

    ![alt]({{ site.baseurl }}/assets/aws_dashboard_part2.png)

    ![alt]({{ site.baseurl }}/assets/aws_dashboard_part3.png)

* ### Added **G Suite** dashboard
    * From Cyences' navigation bar, go to **Control > Reports > G Suite**. 

    ![alt]({{ site.baseurl }}/assets/g_suite_dashboard_part1.png)

    ![alt]({{ site.baseurl }}/assets/g_suite_dashboard_part2.png)

    ![alt]({{ site.baseurl }}/assets/g_suite_dashboard_part3.png)

* ### Added Microsoft **Azure Security Score** to the Office 365 dashboard
    * Displays the Azure security score on the Office 365 dashboard, which represents how secure your Azure configurations are within your environment. 

    ![alt]({{ site.baseurl }}/assets/azure_security_score.png)

    * Go to **Data Onboarding > Microsoft Azure Security Score** section for more information on how to collect data for this dashboard panel. 

* ### Added **Microsoft 365 Defender ATP** dashboard  
    * From Cyences' navigation bar, go to **Antivirus > Microsoft 365 Defender ATP**. 
    * Displays alert information for Microsoft 365 Defender ATP alerts.  

    ![alt]({{ site.baseurl }}/assets/microsoft365_defenderatp_dashboard.png)

    * To check the configuration status for Defender ATP on Windows machines, go to **Settings > Microsoft 365 Defender ATP Audit**. 

    ![alt]({{ site.baseurl }}/assets/microsoft365_defenderatp_audit.png)

    * View the **Data Onboarding > Microsoft 365 Defender ATP** section to see how to collect data for Windows Defender ATP alerts and configuration statuses from Windows machines. 

* ### Added support for Tenable:SC and Nessus on-prem. 
    * Vulnerability related data can be found in the Tenable dashboard. 
    * Cyences now supports data collected from Tenable:SC with the [Tenable Add-on for Splunk](https://splunkbase.splunk.com/app/4060) - can be used to collect data from Tenable:IO or Tenable Cloud). 
    * Cyences also supports data collected from [Nessus Data Importer Add-on](https://splunkbase.splunk.com/app/2740). We do not recommend using this Add-on because the app has been archived by Splunk. 
    * View the **Data Onboarding > Tenable Data** section to see how to collect data from this Add-on. 

* ### Added an alert for Active Directory: **AD - Group Membership Changed**
    * The dashboard panel for this alert is located in the Active Directory and Windows dashboard. 

* ### Enhancements: 
    * Device Inventory and Asset Intelligence dashboards: 
        * The Total Vulnerability Count column has been replaced by two different columns: **High Vulnerability Count** and **Active Vulnerability Count**. 
        * Both of these dashboards are now capable of searching devices with an IP address mask (i.e., 10.1.1.0/24). 
    * Overview dashboard: 
        * Hidden antivirus alerts which are not present in the environment. 
    * Lansweeper dashboard: 
        * Added Hyper-V, Apple Mac, web servers and network devices into the appropriate categories. 
    * Linux/Unix: 
        * Linux/Unix dashboard: Added multiple input filters. 
        * Added alert: Change in Sudo Access of Local Linux Account. 
    * Active Directory Alerts: 
        * Active Directory and Windows dashboard: Removed duplicate dashboard panels. 
        * Group Changed & User Changed Alerts: Added ComputerName (host) field. 
    * Alerts Timestamp: 
        * Added time zone information with every timestamp for each Cyences alert to avoid confusion with time zone of events and alerts.  

* ### Issues Fixed:
    * Fixed a minor Python error for device inventory gen python custom command: Removed unused Float Validator and improved error handling was added. 
    * Fixed a Python issue with Sophos custom command: Variable conflict has been resolved. 
    * Fixed an issue where the Notable Events dashboard panel was incorrectly displaying information for the AD - User Locked Out alert in the Forensics dashboard. 
        * Old: 

        ![alt]({{ site.baseurl }}/assets/forensics_dashboard_old.png)

        * New:

        ![alt]({{ site.baseurl }}/assets/forensics_dashboard_new.png)

## Upgrade Guide from Version 1.6.0 to 1.7.0 

* ### AWS Data Collection 
    * View the **Data Onboarding > AWS** section to see how to collect AWS data required by the Cyences App. 
* ### G Suite Data Collection 
    * View the **Data Onboarding > G Suite** section to see how to collect data for G Suite. 
* ### Microsoft Security Score Data Collection 
    * View the **Data Onboarding > Microsoft Azure Security Score** section to learn how to collect data for the Microsoft Azure/Office 365 Security Score panel. 
* ### Microsoft 365 Defender ATP Data Collection 
    * View the **Data Onboarding > Microsoft 365 Defender ATP** section to see how to collect data for Windows Defender ATP alerts and configuration statuses from Windows machines. 
* ### Sysmon data action field conflict detected  
    * View the **Troubleshooting > Sysmon data action field issue** section to resolve this issue if it is present in your environment. 
* ### Cyences Add-on for Splunk has been updated to version 1.0.1 - [https://splunkbase.splunk.com/app/5659/](https://splunkbase.splunk.com/app/5659/).
    * New update fixes a permission issue with the Linux sudo access data collection shell script. 
    * Upgrade the Cyences Add-on for Splunk on the deployment server/universal forwarder. 

## Version 1.6.0 (July 2021) 

* ### Added a Sophos Endpoint metadata collection command (via Sophos Central API). 
    * Added a configuration section for Sophos Central API. 
    * Go to **Data Onboarding > Sophos Central Metadata through API** for more information. 

* ### New Device Inventory dashboard: 
    * Improved metadata information for endpoints from Sophos Central API. 
    * Automatically merges devices based on information provided (i.e., hostname, mac-address, IP-address) to accurately display the device count. 
        * Old: 

        ![alt]({{ site.baseurl }}/assets/device_master_table_old.png)

        * New:

        ![alt]({{ site.baseurl }}/assets/device_inventory_table_new.png)

        * It is now capable of merging multiple entries which are used for the same device. 
    * Device Master Table has been renamed to Device Inventory Table. 
    * The Device Inventory Table assigns unique UUID to each device.

* ### Added a Linux/Unix dashboard that contains a variety of information such as: hosts, users, users with privilege access, services, open ports, etc. 

    ![alt]({{ site.baseurl }}/assets/linux_unix_dashboard.png)

    * Please visit the **Data Onboarding > Linux/Unix Data** section to understand the data collection process for this dashboard. 

* ### Enhancements:
    * Asset Intelligence dashboard enhancements: 
        * Added a new lookup for device inventory. 
        * Supports comma separated values within search filters.  
        * This will allow users to search machines with multiple IP addresses, or if the user wants to search for multiple users simultaneously. 

        ![alt]({{ site.baseurl }}/assets/asset_intelligence_ipaddress.png)

    * Tenable lookups have been enhanced and linked to the device inventory lookup.  
    * Reduced false positives for Ransomware related alerts (Spike in File Writes and Common Ransomware File Extensions). 
    * Added loggers to the custom command for improved debugging. 
    * Splunk Admin dashboard enhancements: 
        * Search improvements have been made to the dashboard.
        * Improved searches for two alerts (Missing Forwarders & Missing Indexes). 
        * By default, use wildcard (*) for all text related search filters. 
    * Office 365 dashboard enhancements:  
        * Added a Logon Error search filter to the Failed Logins dashboard panel. 

        ![alt]({{ site.baseurl }}/assets/o365_dashboard_logon_error.png)
    
    * Forensics dashboard enhancements: 
        * Drilldown searches made from this dashboard will automatically use the appropriate data model command instead of **index=*** for the query. 

* ### Issues Fixed: 
    * Custom commands tied to a network error will no longer result in a search to run indefinitely. 
    * Field values with a large amount of text will no longer result in a disproportionate column size when scrolling horizontally in a table. 
        * Old: 

        ![alt]({{ site.baseurl }}/assets/horizontal_scrolling_table_old.png)

        * New:

        ![alt]({{ site.baseurl }}/assets/horizontal_scrolling_table_new.png)

    * Fixed a correlation issue with hosts on the Lansweeper dashboard. 

## Upgrade Guide from Version 1.5.0 to 1.6.0 

* ### The Device Inventory Table now utilizes Sophos Central API to collect metadata information about Sophos endpoints.  
    * View the **Data Onboarding > Sophos Central Metadata through API** section to configure the Sophos Central API.	

* ### The Device Master Table has been renamed to Device Inventory Table throughout the app. 
    * View the **App Installation and Configuration > Device Inventory** section for configuration instructions. 

* ### Linux Data Collection 
    * View the **Data Onboarding > Linux/Unix Data** section to learn how to collect data for the Linux/Unix dashboard. 

## Version 1.5.0 (June 2021) 

* ### Made improvements to the Authentication Report dashboard. 
    * Added a user filter and a user authentication list. 

        ![alt]({{ site.baseurl }}/assets/user_authentication_activities.png)
    
    * Added drilldowns to dashboard panels. 
    * Fixed the Authentication CIM mapping for Office365/Azure successful logins data. 

* ### Made improvements to the Office 365 Report dashboard. 
    * Added a user filter to the Successful and Failed Logins dashboard panels. 
    * Added an extended properties column to the Failed Logins dashboard panel (UserAgent, Location, etc.). 

        ![alt]({{ site.baseurl }}/assets/o365_successful_and_failed_logins.png)

* ### Made improvements to the Palo Alto Firewall Report dashboard 
    * Added the List of Firewall Devices dashboard panel with VPN (Global Protect) data availability for auditing purposes.  

        ![alt]({{ site.baseurl }}/assets/list_firewall_devices_global_protect.png)
    
* ### Enhancements: 
    * Added a feature to the Asset Intelligence dashboard when highlighting text.  
    * Allows users to drilldown for better navigation throughout the Cyences app.  
    * Invoke the drilldown from anywhere in the app by selecting hostname, IP address, or username. 

        ![alt]({{ site.baseurl }}/assets/highlighting_text_drilldown.png)
    
    * Added a dashboard panel named Remove Decommissioned Forwarder to the Splunk Admin Report dashboard, which provides users a way to remove decommissioned UFs directly from the dashboard panel itself.  

        ![alt]({{ site.baseurl }}/assets/remove_decommissioned_forwarder.png)

    * We have filtered some commonly known false positives for several alerts to reduce the number of false positive alerts all around.  
    * Added a Current Defender Status column to the Windows Defender Health Report. 

        ![alt]({{ site.baseurl }}/assets/current_windows_defender_status.png)
    
* ### Issues Fixed: 
    * Fixed the logic for the VPN Reports dashboard, as it was reporting incorrect values for both the success and failure count/percentage. 
    * Fixed the Sysmon Deploy Audit dashboard to display the appropriate data and added more error logs for improved auditing. 
    * Fixed the column width problem for the Device Master Table when sorting through data. 

## Upgrade Guide from Version 1.4.0 to 1.5.0 

* ### N/A (view the Release Notes for Version 1.5.0)

## Version 1.4.0 (May 2021) 

* ### Added Asset Intelligence dashboard (view the **Asset Intelligence Dashboard** section for additional details). 

* ### Added Active Directory related alerts and reports: Group Changes, Group Policy Changes, User Changes, & User Locked Out Events (view the **Windows WinEventLog** and **Windows Active Directory Logs** section under **Data Onboarding** for data collection details). 

* ### Added more alerts and reports for Office 365: Service Status & Service not Operational Alert, Activity Over World, & External Users Added to Teams. 

* ### Alerts have been updated to support time-based filtering (view the **Filter Macros** section for more details). 

* ### Enhancements: 
    * Improved Antivirus visibility on the **Overview** dashboard. It now displays disabled/stopped endpoint services and real-time protection. 
    * Updated the drilldown function for the **Device Master Table**. 
    * Improved search filters for the **Globally Detected Malicious IPs** dashboard. 

* ### Issues Fixed: 
    * Sophos drilldown issue on the **Device Master Table** dashboard.  
    * Malicious IP lookup gen and uploading malicious IP commands have been fixed for the python interpolation issue. 

## Upgrade Guide from Version 1.3.0 to 1.4.0 

* ### N/A (view the Release Notes for Version 1.4.0) 

## Version 1.3.0 (April 2021) 

* ### Added support for Lansweeper on-prem (only compatible with Lansweeper Add-on version 1.1.0). 

* ### Added dashboard for Sysmon Deployment Audit under the Settings dropdown in the navigation bar. 

* ### Added new alerts for Authentication: Bruteforce Attempts, Excessive Failed VPN Logins. 

* ### Added new alerts for Palo Alto: High Threats, High System, and WildFire. 

* ### Added summary charts to the Device Master Table dashboard. 

* ### Added reports to the Sophos Antivirus dashboard. 

* ### Enhancements: 
    * Relocated the Splunk Admin dashboard under the Settings dropdown in the navigation bar. 
    * Search improvements for Lansweeper and some other dashboards. 
    * Improved search query for Forwarder Missing Alert. 

* ### Issues Fixed: 
    * Fixed a user field extraction issue for Sophos Central data. 
    * Fixed a field extraction issue from WinEventLog data for Windows Firewall Disabled Alert and WinEventLog Cleared Alert. 
    * Fixed an issue with the VPN dashboard's search filters. 
    * Updated the macro definition for Common Ransomware File Extensions to avoid field value conflicts in the Common Ransomware File Extensions search. 
    * Fixed an issue with the Configuration page for macro updates where the macro value contains a backslash. 
    * Fixed the following search queries: Fake Windows Processes, Credential Compromise related search queries, and Palo Alto related search queries. 
    * Fixed an issue where the selected time range wasn't being applied during a drilldown from the Overview dashboard to the Forensics dashboard. 

## Upgrade Guide from Version 1.2.0 to 1.3.0 

* ### Cyences app version 1.3.0 only supports Lansweeper Add-on version 1.1.0. Please upgrade the Lansweeper Add-on before upgrading the Cyences App to 1.3.0. 

## Version 1.2.0 (March 2021) 

* ### Added Lansweeper dashboard. 

* ### Added Qualys dashboard. 

* ### Added Tenable dashboard. 

* ### Added Device Master Table dashboard. 

* ### Updated the navigation menu.  

* ### VPN dashboard improvements: 
    * Added support for the latest version of Palo Alto (which changed the GlobalProtect data format). 
    * Added a user filter. 

* ### Splunk Admin Reports improvements: 
    * The Splunk Admin alerts on the Overview dashboard now displays the current number of missing indexes and forwarders instead of the notable events. 
    * Can drilldown from Overview dashboard to the Splunk Admin Reports dashboard. 
    * Improved search query for the Missing Indexes alert. 

* ### Windows Defender Reports improvements: 
    * Fixed an issue with the Signature field for Windows Defender data from Windows 10 devices. 
    * Added a filter for Signature version on Windows Defender Health Report panel. 

* ### Other Changes:
    * Fixed query for Sysmon EventID 25 (process tampering). 
    * Minor UI improvements. 
    * Updated the configuration page macro name for cs_common_ransomware_extensions_filter. 

## Upgrade Guide from Version 1.1.0 to 1.2.0 

* ### Refer to the **Backfill Tenable Lookups** section for more information. 

* ### Refer to the **Backfill the Device Master Table** section for more information. 

* ### View the release notes for version 1.2.0. 

## Version 1.1.0 (January 2021)

* ### Overview dashboard improvements: 
    * Overview dashboard now shows the number of Notable Events (instead of the number of alerts triggered), which will be more useful to security engineers. 
    * Direct navigation to reports added to the top of the Overview dashboard. 

* ### Forensics dashboard improvements: 
    * Renamed Details dashboard to **Forensics** dashboard. 
    * Added four dashboard panels to the Forensics dashboard: All Notable Events, _raw data panel (Contributing Events), Compromised System, and Signature (Attacker).
    * Added a drilldown option for Compromised System and Signature dashboard panels. 
    * Combined open alert query in search in the Alert Details panel. 
    * A minor issue with panel visibility was fixed. 
    * Alert's execution and notable events are now being stored in the events under the cyences index. 
        * There is no limit for how long a user will be able to view the notable events. 

* ### Configuration page UI improvements: 
    * Fixed an issue with the macro updates. 

* ### New alerts and reports for Splunk Admin: 
    * Added two alerts and reports: Missing Index Data & Missing Forwarders. 

* ### Renamed Sophos alerts. 

* ### New Antivirus category found under the Reports drop-down: 
    * Sophos alerts and reports have moved to the Antivirus section. 
    * Added alerts and reports for CrowdStrike. 
    * Added alerts and reports for Windows Defender. 

* ### Added a data section at the top of every dashboard/report to show whether the data required for the dashboard/report is present or not, as well as if any report/alert needs to be enabled. 

* ### New Windows alert: 
    * Windows Process Tampering Detected (based on new release of Sysmon version 13.0).

* ### Malicious IP List updates:  
    * The report name has been changed to Globally Detected Malicious IPs. 
    * The report now uploads data to Cyences' Malicious IP server and retrieves back the latest results from the server, in addition to updating the lookup.

## Upgrade Guide from version 1.0.0 to 1.1.0 

* ### Sophos' saved searches and alerts have been renamed: 
    * If one or more alerts have been previously enabled, it will need to be re-enabled in order to function properly. 1.0 alerts will need to be removed altogether. 

* ### Notable events for alerts are now stored in the index named **cyences** and its corresponding sourcetype is named **stash**: 
    * Create an index named cyences. 
    * Copy and paste props.conf from the default directory to the local directory and update the sourcetype name from "cyences_stash" to "stash" in the local props.conf file.  

* ### Configure the Malicious-IP Collector: 
    * Go to **Settings > Configuration > Malicious-IP Collector**.

## Version 1.0.0 (November 2020) 

* ### Added App Overview dashboard. 

* ### Added Details dashboard for investigating security issues. 

* ### Added multiple security alerts which fall under the following categories: 
    * Active Directory & Windows, Credential Compromise, Endpoint Compromise, Network Compromise, Office 365, Palo Alto Firewall, Ransomware, and Sophos. 

* ### Added the following reports:
    * Active Directory & Windows 
    * Authentication 
    * Malicious IP List 
    * Network Reports
    * Office 365 
    * Palo Alto 
    * Sophos 
    * VPN 

* ### Added App Configuration dashboard.
