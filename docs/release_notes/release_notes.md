---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 5
has_children: true
---

# Release Notes


## Version 5.1.0 (December 2024)

* ### SOC AI Integration
    * Added **SOC AI API Configuration** section under **Cyences Settings > Cyences App Configuration > Cyences Alerts Configuration** to configure the SOC AI API credentials.
    * Added workflow action to display the log/event interpretation. You can view the interpretation of any event by clicking on **Event Actions > SOC AI Interpretation** on the Search page.

    ![alt]({{ site.baseurl }}/assets/soc_ai_workflow.png)

* ### Added new alerts for Cloudflare
    * Cloudflare - Credential Leaked
    * Cloudflare - BOT Traffic

* ### Added new alerts for DUO
    * DUO - User is Locked Out
    * DUO - User Login Failure

* Added **Sources/Sourcetypes Latency** panel on the **Data Reviewer** dashboard to show maximum and average latency in data ingestion.

* Added new alert **Windows - Event Logging Service Shut Down**.


* ### Enhancements

    * Updated the **Windows - Event Log Cleared** alert by removing event logging service shout down events.

    * To display error information, improved the error message on the **Cyences App Configuration** page.

    * Added **LogonType** field to the successful and failed logon panels on the **Active Directory** dashboard.

    * On **Network Telemetry** dashboard, Updated data source panel search to see all network sources availability.

    * Renamed the field **dst** to **dest_ip** for **Kaspersky** alerts and dashboard searches. 

    * Updated Splunk-python-sdk to the latest version.


* ### Bug Fixes

    * Fixed the configuration to extract the action field for the cisco:ise:syslog sourcetype. 

    * Fixed the drilldown search of **All Inbound Traffic** panel on the **Network Telemetry** dashboard.


## Upgrade Guide from 5.0.1 to 5.1.0

* Configure the **SOC AI API Configuration** section under **Cyences Settings > Cyences App Configuration > Cyences Alerts Configuration** to see the AI interpretation of any events.