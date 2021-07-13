# Cyences App for Splunk

### Download from Splunkbase
https://splunkbase.splunk.com/app/5351/


OVERVIEW
--------
The Cyences App for Splunk is a Splunk App to provide complete security to the environment. It does not contain data collection mechanism. It contains useful security alerts/reports and dashboards.


* Author - CrossRealms International Inc.
* Version - 1.6.0
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
Version 1.6.0 (July 2021)
* Added Sophos Endpoint metadata collection (through Sophos central API) command.
  * Added configuration part in Cyences configuration page’s to configure Sophos-central API.
  * See Data Onboarding > Sophos Central Metadata through API section for more information.
* New Device Inventory:
  * It uses better metadata information for endpoints from Sophos-central API. 
  * It merges devices automatically based on information like hostname, mac-address, IP-address to show accurate count of devices.
  * As you can see above two screenshots now Cyences App intelligently merge entries which are for same device. 
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
* Palo Alto Firewall – Added panel to show list of firewalls with VPN (Global Protect) data availability for auditing.
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
