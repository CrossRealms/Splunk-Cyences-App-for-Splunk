# Cyences Add-on for Splunk

### Download from Splunkbase
https://splunkbase.splunk.com/app/5659/


OVERVIEW
--------
The Cyences Add-on for Splunk is a Splunk Add-on/App to provide some custom input that is being used in Cyences App for Splunk (https://splunkbase.splunk.com/app/5351/). It contains required inputs and data parsing. It does not contain alerts/reports and dashboards.

* Author - CrossRealms International Inc.
* Build - 1
* Creates Index - False
* Compatible with:
   * Splunk Enterprise version: 10.0, 9.4, 9.3, 9.2, 9.1, 9.0
   * OS: Platform Independent


## What's inside the Add-on

* No of Custom Inputs: **2**



TOPOLOGY AND SETTING UP SPLUNK ENVIRONMENT
------------------------------------------
* Install this Add-on on every Linux/Unix server from which user would like to collect local account and privileges data.
* Add-on can be installed on both full Splunk server and Splunk universal forwarder.
* Splunk should be running as root user.


INSTALLATION, DEPENDENCIES, DATA COLLECTION & CONFIGURATION
------------------------------------------------------------
Visit https://cyences.com for the complete configuration guide.


UNINSTALL APP
-------------
To uninstall the app, the users can follow the below steps:
* SSH to the Splunk instance
* Go to folder apps($SPLUNK_HOME/etc/apps).
* Remove the `TA-cyences` folder from apps directory
* Restart Splunk


RELEASE NOTES
-------------
Version 1.1.2 (August 2023)
* Fixed groups.sh shell script permission issue.

Version 1.1.1 (March 2023)
* Fixed shell script permission issue.

Version 1.1.0 (March 2023)
* Added users.sh and groups.sh scripted inputs.

Version 1.0.2 (October 2021)
* Updated shell script to cover other files under sudoers.d directory to check for sudo access.

Version 1.0.1 (August 2021)
* The shell script permission issue fixed.

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
  * US: +1-312-278-4445
* License Agreement - https://cdn.splunkbase.splunk.com/static/misc/eula.html
* Copyright - Copyright CrossRealms Internationals, 2025
