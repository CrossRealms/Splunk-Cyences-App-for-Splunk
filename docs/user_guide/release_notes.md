---
layout: default
title: Release Notes 
permalink: /user_guide/release_notes/
nav_order: 7
parent: User Guide
---

# Release Notes

## Version 1.11.0 (January 2022)

* ### Added Kaspersky dashboard
    * Added the required field extractions. 
    * Added support for Kaspersky in the Device Inventory and Asset Intelligence dashboards.

    ![ ]()

    ![ ]()

    * Added support for Kaspersky in the Device Inventory and Asset Intelligence dashboards.

    ![ ]()

* ### DNS dashboard 
    * Added DNS Tracker dashboard for the following use-cases: Top Categories, Record Types, DNS Log Volume over Time, Record Types over Time, Top queries, Top Non-success Code Queries, Top Requesters, and Top Non-success queries Code Requesters.

    ![ ]()

    ![ ]()

* ### Microsoft Defender ATP Alert
    * Added a security alert for Office 365 Advanced Threat Protection.

    ![]()

* ### VPN Dashboard
    * Added support for Cisco VPN (logs from Cisco ISE and Estreamer are supported). 
    * Changed the field name from field dest to dest_category=”vpn_auth” for better CIM compatibility. 

        * This field is being used to display the correct count of VPN logins.

* ### Enhancements:
    * Splunk Admin - Missing Indexes Alert
        * Improved the performance of the query.
    * Splunk Admin Dashboard – Missing Indexes Table 
        * Reduced the loading time of the search query after performing a drilldown.
    * Windows Defender Event Logs
        * Added support for logs coming from Windows 10 hosts (resolved field extraction related issues). 
    * Decommission Hosts from Lookups 
        * Added dashboard panels to remove the decommissioned hosts from the Windows hosts lookup, as well as the Linux hosts lookup.
            * This is required to avoid false positive alerts. 

    ![]()

## Upgrade Guide from Version 1.10.0 to 1.11.0

* The Cyences App now supports Kaspersky. Refer to the **Data Onboarding > Kaspersky Logs** section for more information regarding the data collection process. 
* The VPN dashboard now supports Cisco ISE (https://splunkbase.splunk.com/app/1915/) and Estreamer (https://splunkbase.splunk.com/app/3662/) data to show authentication activities from VPN. 
* Cyences has a new dashboard called **DNS Tracker**. It supports all types of DNS related data that are compatible with the CIM data model. For example, the Cisco Umbrella Add-on (https://splunkbase.splunk.com/app/3926/).

## Version 1.10.0 (November 2021)

* ### Azure Active Directory: Office 365
    * Added Office 365 alerts and dashboard panels to the Office 365 dashboard. 

        ![]()

        ![]()

        ![]()

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

         ![]()

        * Splunk Admin - Checks - Forwarders, Inputs, Deployment Server 

        ![]()

        * Splunk Admin - Checks - Parsing and Timestamp

        ![]()

        * Splunk Admin - Checks - Indexer  

        ![]()

        * Splunk Admin - Checks - Search Head 

        ![]()

    *   From Cyences’ navigation bar, go to **Settings > Splunk Admin Checks** to view all of the Splunk Admin Checks dashboards. 

* ### Enhancements: 

    * Splunk Admin – Missing Data in Indexes Alert 
        * Provided a way to configure incoming data intervals for each index through a lookup. 
        * View the **Finetune Splunk Admin Related Alerts** section for more details.   

    * Fake Windows Process Alert – Reduce False Positives 
        * Added a lookup to exclude the false positives based on the file hashes.

    * Common Ransomware File Extensions Alert 
        * Improved the alert query to reduce the number of results while preserving the necessary information. 

* ### Issues Fixed:

    * A cloud compatibility issue related to app.conf triggers has been resolved.

## Upgrade Guide from Version 1.9.0 to 1.10.0

* ### Splunk Admin – Missing Data in the Index Alert 
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
    
        ![]()

    * Linux Sudo Access / Change in Sudo Access of Local Linux Account Alert
        * Released Cyences Add-on version 1.0.2. 
        * Fixed an issue where an inappropriate number of alerts was generated for the **Linux - Change in Sudo Access of Local Linux Account** alert. 

    * Active Directory – User Changed Alert 
        *   Added a Message field to the alert results and dashboard panel to display what has changed. 

        ![]()

    * Windows Dashboard - Windows Users and Privileges (EventCode=4672) 
        * Added user privilege information and number of logins by user to dashboard panel 
    
        ![]()

* ### Issues Fixed: 

    * Splunk Admin License Usage Panel 
        * License usage is now displayed in GB. 
        * Old: 

        ![]()

        * New:

        ![]()

    * Sysmon Deploy Audit Dashboard 
        * Previously displayed that no hosts with data are present even though there is Sysmon data available. 

    * Forensics Dashboard 
        * Fixed an issue with missing fields in the **Notable Events** dashboard panel.
        * Fixed an error displayed at the top right-hand corner of the dashboard panel. 
        * Old: 

        ![]()

        * New:

        ![]()

 ## Upgrade Guide from Version 1.8.0 to 1.9.0

 * ### Sysmon Deployment/Data-Onboarding Guide Updated 
    * We have improved the Sysmon deployment and configuration guide by creating a simple Sysmon TA that has the latest binary, configuration file, and all known issues fixed with scripts and inputs for the Cyences App. 
    * Remove both the **TA-sysmon-deploy** and **TA-microsoft-sysmon** add-ons if they are installed on any forwarders, as well as the deployment server. 
    * Refer to the **Data Onboarding > Sysmon** section to configure the Sysmon deployment and data collection process. 

* ### Cyences Add-on Version 1.0.2 
    * Update the Cyences Add-on to version 1.0.2 (https://splunkbase.splunk.com/app/5659/).

## Version 1.8.0 (September 2021)

* ### Tenable and Qualys: Correlation Between Vulnerabilities and Network Telemetry
    * Added a new dashboard panel named Traffic on Vulnerable Ports that displays traffic on vulnerable ports for both Qualys and Tenable. Users can view these details in the Tenable and Qualys dashboard.

        ![]()

* ### FortiGate VPN Support 
    * The VPN dashboard now supports FortiGate VPN logs.

* ### Added **Windows** dashboard:
    * The new dashboard for Windows has been separated from Active Directory. 
    * The Active Directory dashboard now uses dashboard panels from its original dashboard. 
    * The new Windows dashboard has access to privileged objects and services, as well as user privilege related information. 

        ![]()

        ![]()

        ![]()

* ### Palo Alto dashboard: 
    * Added **System Events** and **Threat Events** dashboard panels.

        ![]()

        ![]()

    * Added information about available sourcetypes for each Palo device in the **List of Firewall Devices** dashboard panel. 

        ![]()

* ### Splunk Admin dashboard:
    * Added a **Splunk License Usage** dashboard panel. 
    * Added an alert for license violations. 

        ![]()

    * Added another dashboard panel named **Instance Disk Usage**. 
    * Added an alert for when disk usage exceeds 85% or when disk space is less than 6GB. 

        ![]()

* ### Enhancements:
    * Ransomware – Spike in the File Writes Alert 
        * Added file locations (top 5) alongside the file writes count, so that users can identify whether the alert is a false positive or a legitimate ransomware attack right from the email notification itself.
        * Old: 

        ![]()

        * New:

        ![]()

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
    * From Cyences’ navigation bar, go to **Control > Reports > AWS**. 

        ![]()

        ![]()

        ![]()

* ### Added **G Suite** dashboard
    * From Cyences’ navigation bar, go to **Control > Reports > G Suite**. 

        ![]()

        ![]()

        ![]()

* ### Added Microsoft **Azure Security Score** to the Office 365 dashboard
    * Displays the Azure security score on the Office 365 dashboard, which represents how secure your Azure configurations are within your environment. 

        ![]()

    * Go to **Data Onboarding > Microsoft Azure Security Score** section for more information on how to collect data for this dashboard panel. 

* ### Added **Microsoft 365 Defender ATP** dashboard  
    * From Cyences’ navigation bar, go to **Antivirus > Microsoft 365 Defender ATP**. 
    * Displays alert information for Microsoft 365 Defender ATP alerts.  

        ![]()

    * To check the configuration status for Defender ATP on Windows machines, go to **Settings > Microsoft 365 Defender ATP Audit**. 

        ![]()

    * View the **Data Onboarding > Microsoft 365 Defender ATP** section to see how to collect data for Windows Defender ATP alerts and configuration statuses from Windows machines. 

* ### Added support for Tenable:SC and Nessus on-prem. 
    * Vulnerability related data can be found in the Tenable dashboard. 
    * Cyences now supports data collected from Tenable:SC with the Tenable Add-on for Splunk (https://splunkbase.splunk.com/app/4060 - can be used to collect data from Tenable:IO or Tenable Cloud). 
    * Cyences also supports data collected from Nessus Data Importer Add-on (https://splunkbase.splunk.com/app/2740). We do not recommend using this Add-on because the app has been archived by Splunk. 
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
    * Fixed an issue where the Notable Events dashboard panel was incorrectly displaying information for the AD – User Locked Out alert in the Forensics dashboard. 
        * Old: 

        ![]()

        * New:

        ![]()

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
* ### Cyences Add-on for Splunk has been updated to version 1.0.1 (https://splunkbase.splunk.com/app/5659/).  
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

        ![]()

        * New:

        ![]()

        * It is now capable of merging multiple entries which are used for the same device. 
    * Device Master Table has been renamed to Device Inventory Table. 
    * The Device Inventory Table assigns unique UUID to each device.

* ### Added a Linux/Unix dashboard that contains a variety of information such as: hosts, users, users with privilege access, services, open ports, etc. 

        ![]()

    * Please visit the **Data Onboarding > Linux/Unix Data** section to understand the data collection process for this dashboard. 

* ### Enhancements:
    * Asset Intelligence dashboard enhancements: 
        * Added a new lookup for device inventory. 
        * Supports comma separated values within search filters.  
        * This will allow users to search machines with multiple IP addresses, or if the user wants to search for multiple users simultaneously. 

        ![]()

    * Tenable lookups have been enhanced and linked to the device inventory lookup.  
    * Reduced false positives for Ransomware related alerts (Spike in File Writes and Common Ransomware File Extensions). 
    * Added loggers to the custom command for improved debugging. 
    * Splunk Admin dashboard enhancements: 
        * Search improvements have been made to the dashboard.
        * Improved searches for two alerts (Missing Forwarders & Missing Indexes). 
        * By default, use wildcard (*) for all text related search filters. 
    * Office 365 dashboard enhancements:  
        * Added a Logon Error search filter to the Failed Logins dashboard panel. 

        ![]()
    
    * Forensics dashboard enhancements: 
        * Drilldown searches made from this dashboard will automatically use the appropriate data model command instead of **index=*** for the query. 

* ### Issues Fixed: 
    * Custom commands tied to a network error will no longer result in a search to run indefinitely. 
    * Field values with a large amount of text will no longer result in a disproportionate column size when scrolling horizontally in a table. 
        * Old: 

        ![]()

        * New:

        ![]()

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

        ![]()
    
    * Added drilldowns to dashboard panels. 
    * Fixed the Authentication CIM mapping for Office365/Azure successful logins data. 

* ### Made improvements to the Office 365 Report dashboard. 
    * Added a user filter to the Successful and Failed Logins dashboard panels. 
    * Added an extended properties column to the Failed Logins dashboard panel (UserAgent, Location, etc.). 

        ![]()

* ### Made improvements to the Palo Alto Firewall Report dashboard 
    * Added the List of Firewall Devices dashboard panel with VPN (Global Protect) data availability for auditing purposes.  

        ![]()
    
* ### Enhancements: 
    * Added a feature to the Asset Intelligence dashboard when highlighting text.  
    * Allows users to drilldown for better navigation throughout the Cyences app.  
    * Invoke the drilldown from anywhere in the app by selecting hostname, IP address, or username. 

        ![]()
    
    * Added a dashboard panel named Remove Decommissioned Forwarder to the Splunk Admin Report dashboard, which provides users a way to remove decommissioned UFs directly from the dashboard panel itself.  

        ![]()

    * We have filtered some commonly known false positives for several alerts to reduce the number of false positive alerts all around.  
    * Added a Current Defender Status column to the Windows Defender Health Report. 

        ![]()
    
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
    * Fixed an issue with the VPN dashboard’s search filters. 
    * Updated the macro definition for Common Ransomware File Extensions to avoid field value conflicts in the Common Ransomware File Extensions search. 
    * Fixed an issue with the Configuration page for macro updates where the macro value contains a backslash. 
    * Fixed the following search queries: Fake Windows Processes, Credential Compromise related search queries, and Palo Alto related search queries. 
    * Fixed an issue where the selected time range wasn’t being applied during a drilldown from the Overview dashboard to the Forensics dashboard. 

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
    * Alert’s execution and notable events are now being stored in the events under the cyences index. 
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
    * The report now uploads data to Cyences’ Malicious IP server and retrieves back the latest results from the server, in addition to updating the lookup.

## Upgrade Guide from version 1.0.0 to 1.1.0 

* ### Sophos’ saved searches and alerts have been renamed: 
    * If one or more alerts have been previously enabled, it will need to be re-enabled in order to function properly. 1.0 alerts will need to be removed altogether. 

* ### Notable events for alerts are now stored in the index named **cyences** and its corresponding sourcetype is named **stash**: 
    * Create an index named cyences. 
    * Copy and paste props.conf from the default directory to the local directory and update the sourcetype name from “cyences_stash” to “stash” in the local props.conf file.  

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