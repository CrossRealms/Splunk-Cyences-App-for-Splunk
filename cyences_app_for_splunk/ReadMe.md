# Cyences App for Splunk

### Download from Splunkbase
https://splunkbase.splunk.com/app/5351/


OVERVIEW
--------
The Cyences App for Splunk is an Splunk App to provide complete security to the environment. It does not contain data collection mechanism. It contains useful security alerts/reports and dashboards.


* Author - CrossRealms International Inc.
* Version - 1.2.0
* Build - 1
* Creates Index - False
* Compatible with:
   * Splunk Enterprise version: 8.1, 8.0
   * OS: Platform Independent
   * Browser: Google Chrome, Mozilla Firefox, Safari



TOPOLOGY AND SETTING UP SPLUNK ENVIRONMENT
------------------------------------------
This app can be set up in two ways: 
  1. Standalone Mode: 
     * Install the `Cyences App for Splunk`.
  2. Distributed Mode: 
     * Install the `Cyences App for Splunk` on the search head.
     * App do not require on the Indexer or on the forwarder.


INSTALLATION, DEPENDENCIES, DATA COLLECTION & CONFIGURATION
------------------------------------------------------------
Visit https://cyences.com/cyences-app-for-splunk/ for complete configuration guide.


UNINSTALL APP
-------------
To uninstall app, user can follow below steps:
* SSH to the Splunk instance
* Go to folder apps($SPLUNK_HOME/etc/apps).
* Remove the `cyences_app_for_splunk` folder from apps directory
* Restart Splunk


RELEASE NOTES
-------------
Version 1.2.0 (March 2021)
* Added Lansweeper dashboard.
* Added Qualys dashboard.
* Added Tenable dashboard.
* Added Device Master Table dashboard.
* Navigation changes based on new design useful for security engineers.
* Improvement on VPN dashboard:
  * Added support for new version of Palo Alto (which changed the global protect data format)
  * Added user filter.
* Splunk Admin Reports improvements:
  * Splunk Admin alerts on overview page now shows current missing indexes and current missing forwarders instead of historical notable events.
  * It also drilldowns from Overview page to Splunk Admin Reports dashboard.
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
  * Now Overview page shows number of Notable Events instead of number of alerts triggered which feels more useful to Security engineer.
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


SUPPORT
-------
* Contact - CrossRealms International Inc.
  * US: +1-312-2784445
* License Agreement - https://d38o4gzaohghws.cloudfront.net/static/misc/eula.html
* Copyright - Copyright CrossRealms Internationals, 2021
