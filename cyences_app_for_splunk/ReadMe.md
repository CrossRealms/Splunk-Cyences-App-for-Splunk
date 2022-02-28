# Cyences App for Splunk

### Download from Splunkbase
https://splunkbase.splunk.com/app/5351/


OVERVIEW
--------
The Cyences App for Splunk is a Splunk App to provide complete security to the environment. It does not contain data collection mechanism. It contains useful security alerts/reports and dashboards.


* Author - CrossRealms International Inc.
* Version - 1.11.0
* Build - 1
* Creates Index - False
* Compatible with:
   * Splunk Enterprise version: 8.2, 8.1, 8.0
   * OS: Platform Independent
   * Browser: Google Chrome, Mozilla Firefox, Safari



TOPOLOGY AND SETTING UP SPLUNK ENVIRONMENT
------------------------------------------
This app can be set up in two ways: 
  1. Standalone Mode: 
     * Install the `Cyences App for Splunk`.
  2. Distributed Mode: 
     * Install the `Cyences App for Splunk` on the search head.
     * App does not require on the Indexer or the forwarder.


INSTALLATION, DEPENDENCIES, DATA COLLECTION & CONFIGURATION
------------------------------------------------------------
Visit https://cyences.com/cyences-app-for-splunk/ for the complete configuration guide.


UNINSTALL APP
-------------
To uninstall the app, the users can follow the below steps:
* SSH to the Splunk instance
* Go to folder apps($SPLUNK_HOME/etc/apps).
* Remove the `cyences_app_for_splunk` folder from apps directory
* Restart Splunk


RELEASE NOTES
-------------
Version 1.11.0 (January 2022)
* Kaspersky
  * Added Kaspersky dashboard.
    * Added required extractions required.
  * Added support for Kaspersky in the Device Inventory and Asset Intelligence.
* DNS Dashboard
  * Added DNS Tracker dashboard for following use-cases: Top Categories, Record Types, DNS log volume over time, Top queries, Top non-success queries with reason, Top requesters, Top non-success queries from requesters
  * It supports all DNS data sources that are CIM compliant.
* Microsoft Defender ATP Alert
  * Added alert for security alerts from Microsoft ATP or Office 365 Advanced Threat Protection.
* VPN Dashboard
  * Added support for Cisco VPN (Logs from Cisco ISE and Cisco Estreamer).
  * Change the field usage from field dest to dest_category="vpn_auth" for better CIM compatibility.
    * This field is being used to show correct count of VPN logins.
* Enhancements:
  * Splunk Admin - Missing Indexes Alert
    * Improved query performance for the alert drastically.
  * Splunk Admin Dashboard - Missing Indexes Table
    * Improved drilldown search query for Missing Indexes table under Splunk Admin dashboard for performance.
  * Windows Defender Event Logs
    * Added support for logs coming from Windows 10 hosts. (Resolved field extraction related issues for these logs.)
  * Decommission Hosts from the lookups
    * Added dashboard to remove the decommissioned hosts from the Windows hosts lookup and Linux hosts lookup.
      * This is required to avoid false positive alerts and decommissioned hosts being shown in the dashboard.

Upgrade Guide from Version 1.10.0 to 1.11.0
•	The Cyences App now supports Kaspersky, see Onboarding document "Kaspersky Logs" if you wish to collect data for Kaspersky.
•	The VPN dashboard now supports Cisco ISE (https://splunkbase.splunk.com/app/1915/) and Cisco Estreamer (https://splunkbase.splunk.com/app/3662/) data to show authentication activities from VPN.
•	The Cyences has a new dashboard called "DNS Tracker". It supports all the DNS related data compatible with CIM data-model. Example, Cisco Umbrella (https://splunkbase.splunk.com/app/3926/).


Version 1.10.0 (November 2021) 
* Azure Active Directory: Office 365 
  * Added Office 365 alerts and dashboard panels to the Office 365 dashboard. 
  * AuthorizationPolicy Change
  * Policy Change
  * Role Change
  * Group Change
  * User Change
  * ServicePrincipal Change
  * Application Change
  * Other Changes
* Splunk Admin Checks Dashboard 
  * Added multiple dashboard panels to identify issues within a Splunk environment, as well as when performing an audit.
    * General
    * Forwarders, Data Inputs and Deployment Server
    * Data Parsing
    * Indexers, Buckets, Data and Indexes
    * Search Head
  * View all of the Splunk Admin Checks dashboards under Cyences Navigation > Settings.
* Enhancements:
  * Splunk Admin - Missing Data in Indexes Alert
    * Provided a way to configure incoming data intervals for each index through a lookup.
    * Visit the "Finetune Splunk Admin related alerts" section for more details.
  * Fake Windows Process Alert - Reduce False Positives
    * Added a lookup to exclude the false positives based on the file hashes.
  * Common Ransomware Extension Alert
    * Improved the alert query to reduce number of results while preserving the information.
* Issues Fixed:
  * Splunk App-Inspect failure (cloud compatibility issue) related to app.conf triggers have been fixed.

Upgrade Guide from Version 1.9.0 to 1.10.0
* Splunk Admin - Missing Data in the Index Alert
  * Please visit "Finetune Splunk Admin related alerts" section in this document to get more information about it.
* Common Ransomware Extension Alert Update
  * As the query of the alert has been updated hence, please check your alert filter still works properly with the updated query post upgrade.
  * For example, the field file_path has been removed, the field top10_file_location has been added, etc.


Version 1.9.0 (October 2021) 
* Sysmon Deployment/Data-Onboarding Guide Updated. Please find more information here in the Upgrade Guide.
* Meraki Firewall Log CIM Compatibility:
  * Meraki logs added props to make network flow data compatibility with CIM data-model.
* Enhancements:
  * Tenable/Qualys vulnerability proper coloring scheme for Device Inventory and Asset Intelligence dashboard.
  * Tenable/Qualys - Active vulnerability count now excludes Information vulnerability.
  * Overview Dashboard:
    * Hide unused products' notable events. For O365 currently not running services and Antivirus current status related notable events.
  * Tenable Dashboard - added panel for "All Traffic on All Vulnerable Hosts".
  * Linux Sudo Access
    * Released Cyences Add-on version 1.0.2.
    * Fixed the issues with inappropriately generated alerts of Sudo access changed alert (Linux - Change in Sudo Access of Local Linux Account).
  * AD - User Changed Alert
    * Added Message field in the alert result and dashboard panel to show what has changed.
  * Windows Dashboard - Windows Users and Privileges (EventCode=4672)
    * Added no. of logins by user along-side the user privileges.
* Issues Fixed:
  * Splunk Admin License Usage Panel:
    * Now license usage is shown in GB.
  * Sysmon Deploy Audit Dashboard:
    * Fixed: shows no hosts with data present even though there is Sysmon data present.
  * Forensics Dashboard:
    * Fixed the issue with missing fields in the "Notable Events" panel.
    * Also fixed the error shown at the top-right of the panel.


Upgrade Guide from Version 1.8.0 to 1.9.0
* Sysmon Deployment/Data-Onboarding Guide Updated
  * We have improved Sysmon deployment and configuration guide by creating a simple TA that has the latest Sysmon binary, latest Sysmon configuration file, all fixed issues with scripts and inputs with all the configuration required for Cyences App.
  * Please remove TA-sysmon-deploy and TA-microsoft-sysmon add-ons installed on your forwarders and deployment server.
  * And follow the new guide from Data Onboarding > Sysmon to configure the Sysmon deployment and the Sysmon data collection.
* Cyences Add-on Upgrade
  * Upgrade Cyences Add-on to newly released Add-on version 1.0.2. (https://splunkbase.splunk.com/app/5659/)



Version 1.8.0 (September 2021) 
* Tenable and Qualys - Correlation between Vulnerabilities and Network Telemetry 
  * Added table that shows traffic on vulnerable ports for both Qualys and Tenable. User can see those details in the Tenable and Qualys dashboard. (New panels added at the last of the panel.) 
* Fortigate VPN Support 
  * Cyences App's VPN dashboard now supports Fortigate VPN logs. 
* New Windows Dashboard 
  * The Windows dashboard is now separated from Active Directory.
  * The Active Directory dashboard now has panels from the original dashboard.
  * The new Windows dashboard has Accesses to privileged objects and services and User Privileges related information. 
* Palo Alto Dashboard: 
  * Added System Events panel and Palo Threats (Incidents) panel in the dashboard. 
  * Added sourcetypes available for each Palo device on Palo Alto Firewall device list panel. 
* Splunk Admin 
  * Added panel Splunk Licensing report and added alert for Splunk licensing violation. 
  * Added panel Splunk Environment Disk usage report and added alert for Splunk instance disk usage more than 85% or disk space less than 6 GB. 
* Enhancements: 
  * Ransomware - Spike in the File Writes Alert 
    * Improved by adding file locations alongside file writes count so we can identify whether the alert is false positive or ransomware right from the email alert. 
  * Tenable: Added CVE and solution field for tenable vulnerabilities. (Tenable dashboard and Asset Intelligence dashboard) 
  * Overview dashboard 
    * Improved drilldown for Splunk Admin panel that now auto set the filters on Splunk Admin dashboard. 
  * Network Reports dashboard 
    * Added drilldown for "Port Scanning Attempts" map. 
  * AD Alerts 
    * Improved search queries for Active Directory related alerts. 
    * Added ComputerName field in the alert results. 
* Issues Fixed: 
  * AWS Dashboard 
    * Fixed the issue with AWS dashboard panel loading. 

Upgrade Guide from Version 1.7.0 to 1.8.0 
* Fortigate VPN Data Collection 
  * If you are using Fortinate Fortigate for VPN then follow the Data Onboarding > Fortigate VPN Logs section from the Guide to see how to collect the data and then you can utilize Cyences App's VPN dashboard. 
* New Splunk Admin Alerts 
  * Enable new Splunk Admin alerts for Splunk licensing and Disk usage. 

 
Version 1.7.0 (August 2021) 
* Added AWS dashboard. 
  * Find it under Control > Reports > AWS. 
* Added GSuite dashboard. 
  * Find it under Control > Reports > GSuite. 
* Added a Microsoft Azure Security Score to the Office 365 dashboard. 
  * Cyences App now shows Azure security score on the Office 365 dashboard directly representing how much secure your Azure configurations are. 
  * Go to Data Onboarding > Microsoft Azure Security Score for more information on how to collect data for this new panel. 
* Added a Microsoft 365 Defender ATP dashboard. (Antivirus > Microsoft 365 Defender ATP) 
  * Cyences App shows alerts from Microsoft 365 Defender ATP alerts information in the dashboard. 
  * Cyences App also has a dashboard Settings > Microsoft 365 Defender ATP Audit for checking configuration status of Defender ATP on Windows machines. 
  * View the Data Onboarding > Microsoft 365 Defender ATP section to see how to collect data for Windows Defender ATP alerts and Windows Defender ATP configuration statuses from Windows machines. 
* Support for Tenable:SC and Nessus on-prem. 
  * You can see vulnerability data into Tenable dashboard and these data also reflects the Device Inventory. 
  * We now support data collected from Tenable:SC with Tenable Add-on for Splunk (https://splunkbase.splunk.com/app/4060 - same that can be used to collect data from Tenable:IO or Tenable Cloud). 
  * We now also supporting data collected by Nessus Data importer Add-on (https://splunkbase.splunk.com/app/2740). We do not recommend using this Add-on as the Add-on itself is archive. 
  * Please see Data Onboarding > Tenable Data section in this document to see how to collect data from this Add-on. 
* Added a new Active Directory related alert: AD - Group Membership Changed 
  * You can also see the panel for Group Membership Changes in the Active Directory and Windows dashboard. 
* Enhancements: 
  * Device Inventory and Asset Intelligence dashboards: 
    * Now we show high vulnerability count and active vulnerability count for Qualys and Tenable which is more important than total vulnerability count that includes already fixed vulnerabilities. 
    * These dashboards now allow to search device with IP mask. For example: 10.1.1.0/24 
  * Overview dashboard: 
    * Hide antivirus alert names which is not present in the environment. 
  * Lansweeper dashboard: 
    * Added Hyper-V, Apple Mac, Web servers and Network Devices into the right category. 
  * Linux/Unix: 
    * Linux/Unix dashboard: Added important input filters to filter the data as required. 
    * Added alert: Change in Sudo Access of Local Linux Account. 
  * Active Directory Alerts: 
    * Active Directory and Windows dashboard: Removed unnecessary duplicate panels. 
    * Group Changed Alert & User Changed Alert: Added ComputerName (host) field in the alert. 
  * Alerts Timestamp: 
    * We have added time-zone information with all the timestamp in the Cyences alert to avoid confusion with time-zone of events and alerts. 
* Issues Fixed: 
  * Fixed minor python error on device inventory gen python custom command: Remove unused Float Validator and better error handling added. 
  * Fixed the python issue with Sophos custom command: variable conflict resolved. 
  * Fixed the issue: Forensic dashboard do not show information about AD - User Locked Out notable events. 

Upgrade Guide from Version 1.6.0 to 1.7.0 
* AWS Data Collection 
  * View the Data Onboarding > AWS section to see how to collect AWS data required by Cyences App. 
* GSuite Data Collection 
  * View the Data Onboarding > GSuite section to see how to collect data for GSuite. 
* Microsoft Security Score Collection 
  * View the Data Onboarding > Microsoft Azure Security Score section to learn how to collect data for the Microsoft Azure/Office 365 Security Score panel. 
* Microsoft 365 Defender ATP Data Collection 
  * View the Data Onboarding > Microsoft 365 Defender ATP section to see how to collect data for Windows Defender ATP alerts and configuration statuses from Windows machines. 
* Sysmon data action field conflict detected, please look at Troubleshooting > Sysmon data action field issue section in the document to make sure your environment does not have the same issue. 
* Cyences Add-on's (https://splunkbase.splunk.com/app/5659/) new version has released 1.0.1 with fix to permission issue in linux sudo access data collection shell script. 
  * Upgrade the Cyences Add-on on the Deployment server/Universal forwarder. 


Version 1.6.1 (July 2021)
 * Bug Fix: Link of Linux Dashboard was not working on Overview Dashboard.


Version 1.6.0 (July 2021)
* Added Sophos Endpoint metadata collection (through Sophos central API) command.
  * Added configuration part in Cyences configuration page's to configure Sophos-central API.
  * See Data Onboarding > Sophos Central Metadata through API section for more information.
* New Device Inventory:
  * It uses better metadata information for endpoints from Sophos-central API. 
  * It merges devices automatically based on information like hostname, mac-address, IP-address to show accurate count of devices.
  * New device inventory assigns unique uuid to each device. 
  * Device Master Table name changed to Device Inventory. 
* Added Linux Reports dashboard.
* Enhancements in Asset Intelligence Dashboard:
  * Asset Intelligence dashboard updated with new device inventory lookup. 
  * Asset Intelligence dashboard now support command separated values in the filter. 
    * This allows you to search machines with multiple IP addresses. Or if user wants to search multiple users at the same time. Etc. 
  * Tenable lookups are enhanced and better connected with device inventory lookup. 
* Enhancements: 
  * Reduce false positives from Ransomware Alerts (Spike in the file writes and ransomware file extension).
  * Added loggers in custom command for better debugging. 
  * Enhancement in Splunk Admin dashboard 
    * Search improvement in the dashboard 
    * Fixed searches of alerts (Missing Forwarders & Missing indexes) 
    * By-default use wildcard (*) in all text filters. 
  * Office 365 Dashboard: Added LogonError filter in the failed login panel. 
  * Enhancement on forensics page drilldown searches. 
    * Changed from index=* to use the datamodel command. 
* Issues Fixed: 
  * Fixed the issue with custom commands: when there is network error search runs indefinitely. 
  * Fixed the issue with long horizontal scrolling on row expansion in Tenable and Qualys dashboard. 
  * Fixed correlation issue of hosts on Lansweeper dashboard. 


Upgrade Guide from Version 1.5.0 to 1.6.0 
* Cyences App now utilize Sophos Central API to collect metadata information about Sophos endpoints. And it is being used in new Device Inventory instead regular sophos central events. 
* Device Master Table renamed to Device Inventory through-out the App. 
  * Follow Data Onboarding > Sophos Central Metadata through API section in this document to configure the API. 
  * Please follow App Installation and Configuration > Device Inventory section for new device inventory configuration.


Version 1.5.0 (June 2021)
* Improved Authentication dashboard.
  * Added user authentication list with user filter capability.
  * Added drilldowns to important panels to view detailed data.
  * Fixed the Authentication CIM mapping for Office365/Azure success logins data.
* Improved Office 365 dashboard.
  * Added Success and Login Failures with user filter and extended information in failure login panel like UserAgent, Location, etc.
* Palo Alto Firewall - Added panel to show list of firewalls with VPN (Global Protect) data availability for auditing.
* Enhancements:
  * Added text selection drilldown to Asset Intelligence dashboard for better navigation through-out App in search for Host, IP Addresses and Usernames. (You can invoke the drilldown from anywhere in the App just by selecting IP Address or Hostname or Username.)
  * Improved Splunk Admin dashboard for missing forwarders. Now dashboard provides a way to remove decommissioned UF directly from the dashboard.
  * Filter some commonly known false positive for multiple alerts to reduce the false positive alerts.
  * Added current status of Windows Defender status.
* Issues Fixed:
  * Fixed the logic for Global Protect VPN login incorrect success and failure count.
  * Fixed the Sysmon Deploy Audit dashboard to show correct data and added more error logs for better auditing.
  * Fixed Device Master Table column width problem when sorting the data. 


Upgrade Guide from Version 1.4.0 to 1.5.0
* N/A (See Release notes for version 1.5.0)


Version 1.4.0 (May 2021)
* Asset Intelligence dashboard added. (See documentation section `Asset Intelligence Dashboard` for details.)
* Added Active Directory related alerts and reports: Group Changes, Group Policy Changes, User Changes, User Locked Out Events (See `Windows WinEventLog` and `Windows Active Directory Logs` section in the documentation for data collection.)
* Added more reports and alerts for Office 365: Service Status & Service not Operational Alert, Activity Over World, External Users Added to Teams
* Alert updated to support time-based filtering. (See `Filter Macros` in the documentation for more details.)
* Enhancements:
  * Improved Antivirus visibility on the `Overview` dashboard. Now Overview page shows disabled/stopped endpoint service and real-time protection.
  * Updated drilldown on the `Device Master Table`.
  * Improved filters on `Globally Detected Malicious IPs` dashboard.
* Issues Fixed:
  * The `Device Master Table` dashboard's Sophos drilldown issue fixed.
  * Malicious Ip lookup gen and upload malicious IP commands fixed for interpolation issue in python.


Upgrade Guide from Version 1.3.0 to 1.4.0
* N/A (See Release notes for version 1.4.0)


Version 1.3.0 (April 2021)
* Added support for Lansweeper On-prem. (Support with only Lansweeper Add-on version 1.1.0.)
* Added dashboard for Sysmon Deployment Audit under Settings section in the App navigation.
* Added new alerts for Authentication category: Bruteforce attempt, Excessive Failed VPN Logins
* Added new Alerts for Palo Alto: High Threats, High System Alerts, WildFire Alert
* Added summary charts for Device Master Table dashboard.
* Added more reports in Sophos Antivirus dashboard.
* Enhancements:
  * Moved Splunk Admin dashboard under Settings on the App navigation.
  * Search improvements on Lansweeper and some other dashboards.
  * Improved search for Forwarder Missing Alert.
* Issues Fixed:
  * Fixed the issue with user field extraction for Sophos central data.
  * Fixed the issue field extraction from WinEventLog data for Windows Firewall Disabled Alert and WinEventLog Cleared Alert.
  * Fixed the issue with dashboard filters on the VPN dashboard.
  * Macro definition update for Ransomware Extension to avoid field value conflicts in Common Ransomware extension search.
  * Fixed the issue with the Configuration page for the macro update where the macro value contains backslash.
  * Fixed search queries for forensics of Fake Windows Processes, Credential Compromise related search queries, and Palo Alto related search queries.
  * Fixed the issue with timerange not being followed while drilldown for Overview page to Forensics page.


Upgrade Guide from version 1.2.0 to 1.3.0
* Cyences version 1.3.0 only supports Lansweeper Add-on version 1.1.0. Please upgrade the Lansweeper Add-on before upgrading the Cyences App to 1.3.0.


Version 1.2.0 (March 2021)
* Added Lansweeper dashboard.
* Added Qualys dashboard.
* Added Tenable dashboard.
* Added Device Master Table dashboard.
* Navigation changes based on the new design, useful for security engineers.
* Improvement on VPN dashboard:
  * Added support for the new version of Palo Alto (which changed the global protect data format)
  * Added user filter.
* Splunk Admin Reports improvements:
  * Splunk Admin alerts on the Overview page now show current missing indexes and current missing forwarders instead of historical-notable events.
  * It also drilldowns from the Overview page to the Splunk Admin Reports dashboard.
  * Improved searches for missing indexes alert query.
* Improvements on Windows Defender Report:
  * Fixed issue with Signature field for Windows Defender data from Windows 10 devices.
  * Added filter for Signature version on Windows Defender Health Report panel.
* Minor issues fixed.
  * Corrected query for Sysmon EventID 25 (process tampering).
  * Minor UI improvements.
  * Fixed configuration page macro name for cs_common_ransomware_extensions_filter.


Upgrade Guide from version 1.1.0 to 1.2.0
* Visit the "Upgrade Guide from version 1.1.0 to 1.2.0" section from the documentation.


Version 1.1.0 (Jan 2021)
* Improved Overview page.
  * Now Overview page shows the number of Notable Events instead of number of alerts triggered which feels more useful to Security engineer.
  * Direct navigation to reports added on top of the Overview page.
* Improved Forensics page.
  * Renamed Details dashboard to Forensics dashboard.
  * Added 4 panels to Forensics dashboard: All Notable Events, _raw data panel (Contributing Events), Compromised System, Signature (Attacker)
  * Added drilldown for Compromised System and Signature panels.
  * Combined open alert query in search in the Alert Details panel.
  * Minor issue with panel visibility fixed.
  * Alerts execution and notable events now being stored in the events (index).
    * So, there is virtually no limit to how long user will be able to see the notable events.
* Improved Configuration page UI.
  * Fixed the issue with the macro update in the Configuration page.
* Added Splunk Admin category.
  * Added two alerts and reports: Missing Index Data & Missing Forwarders
* Sophos alerts renamed.
* Added Antivirus category.
  * Sophos alerts and reports moved under Antivirus category.
  * Added alerts and reports for CrowdStrike.
  * Added alerts and reports for Windows Defender.
* Added panel on top of all the dashboards/reports to show whether the data required for the dashboard is present or not and also if any report/alerts need to be enabled to make dashboard work is enabled or not.
* New alert (Windows Process Tampering Detected) for Windows added based on new release of Sysmon version 13.0.
* Malicious IP List is now updated to upload the data to Cyences Malicious IP server and retrieve back the latest results from the server and update the lookup.


Upgrade Guide from version 1.0.0 to 1.1.0
* Sophos savedsearches/alerts have been renamed.
  * If the alert has been enabled before, it has to be enabled again.
* Alerts notable events now stored in the index under stash sourcetype.
  * So, user has to create index named cyences.
  * Have to copy paste props.conf from default directory to local directory and update the sourcetype name from cyences_stash to stash in the local props.conf file. ([cyences_stash] => [stash])
* Configuration for Malicious IP Collector.
  * Go to `Settings > Configuration > Malicious-IP Collector` Configuration to do so.


Version 1.0.0 (Nov 2020)
* Created App Overview dashboard.
* Added Details/Forensics dashboard for investigating security issues.
* Added multiple security alerts with below categories.
  * Categories: Ransomware, Active Directory & Windows, Office 365, Endpoint Compromise, Network Compromise, Credential Compromise, Sophos and Palo Alto Firewall.
* Added below reports:
  * Active Directory & Windows
  * O365
  * Network Reports
  * Palo Alto
  * Globally Detected Malicious IPs
  * Sophos
  * VPN
  * Authentication
* Added App configuration dashboard.
* Added HoneyDB based blocked IP list and used that list to identify bad traffic.



LOOKUPS
-------
The lookups directory will have lookups from the customer environment.

1. all_windows_hosts.csv
2. cs_ransomware_file_writes_upperbound.csv
3. ip_range_blocked_list.csv (Current file has been taken from http://iplists.firehol.org/)
4. ip_blocked_list.csv (Current file has been taken from https://honeydb.io/ sample list)
5. cs_malicious_ip_list.csv (List contains the bad IP addresses involve in various activities like DDoS attack or it's an already blocked IP address and connecting through multiple firewalls.)
6. cs_indexes.csv (Stores all the indexes present in the data and useful to determine missing data in the index.)
7. cs_forwarders.csv (Stores the list of forwarders present in the environment to determine missing forwarder list.)


OPEN SOURCE COMPONENTS AND LICENSES
------------------------------
* NA


CONTRIBUTORS
------------
* Vatsal Jagani
* Usama Houlila
* Preston Carter
* Ahad Ghani
* Bhavik Bhalodia


SUPPORT
-------
* Contact - CrossRealms International Inc.
  * US: +1-312-2784445
* License Agreement - https://d38o4gzaohghws.cloudfront.net/static/misc/eula.html
* Copyright - Copyright CrossRealms Internationals, 2021
