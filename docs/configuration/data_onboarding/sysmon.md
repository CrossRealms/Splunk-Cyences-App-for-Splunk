---
layout: default
title: Sysmon Data
permalink: /configuration/data_onboarding/sysmon/
nav_order: 2
parent: Data Onboarding
grand_parent: Configuration
---


## **Sysmon**

### Sysmon Overview

Sysmon, a component of Microsoft's Sysinternals suite of Windows utilities, is a very powerful host-level tool that can assist in detecting advanced threats on a network by providing intricate host-operation details in real-time. In contrast to common Antivirus/Host-Based Intrusion-detection (HIDS) solutions, Sysmon performs deep monitoring on system activity and logs high-confidence indicators on advanced attacks. 

This is a fantastic way to collect detailed information about your Windows endpoints in Splunk. Sysmon is free of charge, installs painlessly on many variants of Windows, and integrates well with Splunk deployments. In fact, Mark Russinovich (Sysmon's author) has spoken about Sysmon at the past two RSA conferences and showcases Splunk as an excellent mechanism for the collection and analysis of Sysmon data. 

### Prerequisites 
* This method will require a Splunk Heavy Forwarder or Universal Forwarder to be installed and running on the Windows server. 
* Data Forwarding is configured from the Forwarder to the Splunk Indexer(s). 

### How to Install and Configure Microsoft Sysmon with Deployment Server 

Instead of having to manually install Microsoft Sysmon on each and every Windows server in your environment, it would be optimal to install Sysmon on Windows machines via the Deployment Server (to learn more about the deployment server, click here). You can still manually install Sysmon, but that would be an exhaustive and time-consuming task if your environment contains tons of Windows servers. 

[The Sysmon Deploy Add-on for Cyences App](https://github.com/VatsalJagani/Splunk-App-Sysmon-deploy-for-Cyences-App) installs and updates Sysmon on Windows machines. Also, it updates the Sysmon config file if there are any changes made to the Sysmon file. 

### Install and Maintain Sysmon on Windows Machines from deployment-server 

1. Use **Sysmon Deploy Add-on for Cyences App** to install Microsoft Sysmon on Windows machines. 

2. Download the latest Add-on build file named **TA-sysmon-deploy-for-cyences.tgz** - [https://github.com/VatsalJagani/Splunk-App-Sysmon-deploy-for-Cyences-App/releases/](https://github.com/VatsalJagani/Splunk-App-Sysmon-deploy-for-Cyences-App/releases/) 

3. Extract the file under the deployment apps directory on the deployment server. 

4. Create a server class in the deployment server and deploy this Add-on to the required Windows hosts. 

5. From Cyences' navigation bar, go to **Settings > Sysmon Deploy Audit** for Sysmon deployment, auditing, and reporting. 

6. This will start forwarding the Sysmon events to the indexer(s). Lastly, create an index named **epintel** in the indexer(s) in order to receive data. 

**Note:** The Sysmon Deploy Add-on for Cyences App generates auditing logs in index=**windows** and actual Sysmon data in index=**epintel**. Sysmon collects several types of EventCodes from the Windows hosts. For the Cyences app, we will need to incorporate the following EventCodes: 1, 2, 5, 10, 11, and 25. 

### Sysmon EventCodes:

![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/sysmon_event_codes.png?raw=true)

* Enable EventCode 10 to detect credential dumping on Windows with LSASS access. Please be aware that Event Code 10 may consume a large portion of your daily license usage. 

* EventCode 25 has been added to Sysmon since version 13.0 (released in January 2021). If an earlier version of Sysmon is being used you will not be able to take advantage of the **Window Process Tampering Detected** alert. 

* Sysmon logs are only tested in XML format (see renderXml = 1 in inputs.conf stanza). 

### Verify Data Collection 

Run the search query below to verify that the data is being ingested:

    index=epintel source="XmlWinEventLog:Microsoft-Windows-Sysmon/Operational"

Currently, the idea is to use Sysmon data on Windows to get different file operations performed on the Windows hosts [https://splunkbase.splunk.com/app/1914/](https://splunkbase.splunk.com/app/1914/). 

References: 
*[https://docs.microsoft.com/en-us/sysinternals/downloads/sysmon](https://docs.microsoft.com/en-us/sysinternals/downloads/sysmon) 
*[https://docs.splunksecurityessentials.com/data-onboarding-guides/microsoft-sysmon/](https://docs.splunksecurityessentials.com/data-onboarding-guides/microsoft-sysmon/) 

**Note:** Sysmon data action field conflict detected, please look at **Troubleshooting > Sysmon data action field issue** section in the document to make sure your environment does not have the same issue.