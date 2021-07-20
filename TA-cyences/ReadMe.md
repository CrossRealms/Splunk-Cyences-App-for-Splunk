# Cyences Add-on for Splunk

### Download from Splunkbase
https://splunkbase.splunk.com/app/5659/


OVERVIEW
--------
The Cyences Add-on for Splunk is a Splunk Add-on/App to provide some custom input that is being used in Cyences App for Splunk (https://splunkbase.splunk.com/app/5351/). It contains required inputs and data parsing. It does not contain alerts/reports and dashboards.


* Author - CrossRealms International Inc.
* Version - 1.0.0
* Build - 1
* Creates Index - False
* Compatible with:
   * Splunk Enterprise version: 8.2, 8.1, 8.0
   * OS: Platform Independent



TOPOLOGY AND SETTING UP SPLUNK ENVIRONMENT
------------------------------------------
This app can be set up in two ways: 
  1. Standalone Mode: 
     * Install the `Cyences Add-on for Splunk`.
  2. Distributed Mode: 
     * Install the `Cyences Add-on for Splunk` on the search head.
     * App does not require on the Indexer or the forwarder.


INSTALLATION, DEPENDENCIES, DATA COLLECTION & CONFIGURATION
------------------------------------------------------------
Visit https://cyences.com/cyences-app-for-splunk/ for the complete configuration guide.


UNINSTALL APP
-------------
To uninstall the app, the users can follow the below steps:
* SSH to the Splunk instance
* Go to folder apps($SPLUNK_HOME/etc/apps).
* Remove the `TA-cyences` folder from apps directory
* Restart Splunk


RELEASE NOTES
-------------
Version 1.0.0 (July 2021)
* Created Add-on for Cyences App with sudo-users linux inputs.


OPEN SOURCE COMPONENTS AND LICENSES
------------------------------
* NA


CONTRIBUTORS
------------
* Vatsal Jagani
* Bhavik Bhalodia


SUPPORT
-------
* Contact - CrossRealms International Inc.
  * US: +1-312-2784445
* License Agreement - https://d38o4gzaohghws.cloudfront.net/static/misc/eula.html
* Copyright - Copyright CrossRealms Internationals, 2021
