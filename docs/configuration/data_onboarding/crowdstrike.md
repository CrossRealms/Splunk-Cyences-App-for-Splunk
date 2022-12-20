---
layout: default
title: CrowdStrike Event Stream
permalink: /configuration/data_onboarding/antivirus_antimalware/crowdstrike/
nav_order: 1
parent: Antivirus Antimalware
grand_parent: Data Onboarding
---

## **CrowdStrike Event Streams Data**

In order to collect CrowdStrike's Event Streams logs, the [CrowdStrike Falcon Event Streams Technical Add-On](https://splunkbase.splunk.com/app/5082/) is required for data parsing and field extraction. 

There are two main components that need to be configured for the CrowdStrike Add-on: 

1. Add Account: 

    ![alt](https://github.com/CrossRealms/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/crowdstrike_config_add_account.png?raw=true)

2. Create New Input: 

    ![alt](https://github.com/CrossRealms/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/crowdstrike_config_new_input.png?raw=true)

3. Refer to the [CrowdStrike Resource Center: CrowdStrike Falcon Event Streams Add-On Guide](https://www.crowdstrike.com/resources/guides/how-to-install-falcon-event-streams-splunk-add-on/) for the Add-on's configuration steps.