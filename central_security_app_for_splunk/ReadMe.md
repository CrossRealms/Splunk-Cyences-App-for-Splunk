# Central Security App for Splunk

### Download from Splunkbase
The Splunkbase link is not available yet.


OVERVIEW
--------
The Central Security App for Splunk is an Splunk App to provide complete security to the environment. It does not contain data collection mechanism. It contains useful security alerts/reports and dashboards.


* Author - CrossRealms International Inc.
* Version - 1.0.0
* Build - 1
* Creates Index - False
* Compatible with:
   * Splunk Enterprise version: 8.0, 7.3, 7.2 and 7.1
   * OS: Platform Independent
   * Browser: Google Chrome, Mozilla Firefox, Safari



TOPOLOGY AND SETTING UP SPLUNK ENVIRONMENT
------------------------------------------
This app can be set up in two ways: 
  1. Standalone Mode: 
     * Install the `Central Security App for Splunk`.
  2. Distributed Mode: 
     * Install the `Central Security App for Splunk` on the search head.
     * App do not require on the Indexer or on the forwarder.



INSTALLATION
------------
Follow the below-listed steps to install an App from the bundle:

* Download the App package.
* From the UI navigate to `Apps > Manage Apps`.
* In the top right corner select `Install app from file`.
* Select `Choose File` and select the App package.
* Select `Upload` and follow the prompts.


DEPENDENCIES
------------
This App requires certain dependencies to work.

* [ES Content Update App](https://splunkbase.splunk.com/app/3449/) - Requires for some of the macro definitions.
* [Splunk Add-on for Windows](https://splunkbase.splunk.com/app/742/) - Requires for field extraction.
* [Sysmon Add-on for Splunk](https://splunkbase.splunk.com/app/1914/) - Requires for field extraction.
* [Splunk Add-on for O365](https://splunkbase.splunk.com/app/4055/) - Requires for field extraction.
* All the other Add-ons for data collection and field extraction.


CONFIGURATION
-------------
### Macro Definition Update ###
You have to update the macro definition based on your need.
Find and update all the macro definition:

#### View/Update from UI
* Splunk UI > Settings > Advanced Search > Search macros
* Select `Central Security App for Splunk` from the `App` list.
* Select `Any` in `Owner` list.
* Select `Created in App` option.

OR 

#### View/Update from macros.conf (Backend)

* SSH to the Search Head backend.
* Navigate to `$SPLUNK_HOME/etc/apps/central_security_app_for_splunk/default/macros.conf`.
* For updating the macro, copy paste the macro stanza in the `$SPLUNK_HOME/etc/apps/central_security_app_for_splunk/local/macros.conf`. (Create the file in the local directory if not present already.)



DATA COLLECTION
-------------
The App itself does not collect any data. The App uses data from different Add-ons like `Splunk Add-on for Windows`, `Sysmon Add-on for Splunk`, etc for collecting data for various use-cases.

#### How to find which data to collect for different use-cases
Look for `Detailed` dashboard, which contains the list of alerts/saved-searches and description specifies the `Data Collection` section.


UNINSTALL APP
-------------
To uninstall app, user can follow below steps:
* SSH to the Splunk instance
* Go to folder apps($SPLUNK_HOME/etc/apps).
* Remove the `central_security_app_for_splunk` folder from apps directory
* Restart Splunk


RELEASE NOTES
-------------
Version 1.0.0
* Created App Dashboards, Alerts and Reports.


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
* Copyright - Copyright CrossRealms Internationals, 2020
