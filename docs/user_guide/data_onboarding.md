---
layout: default
title: Data Onboarding 
permalink: /user_guide/data_onboarding/
nav_order: 8
parent: User Guide
---

# Data Onboarding [Admin]

The Cyences App uses data from multiple add-ons and the process for collecting this data will be outlined below. 

**Note:** This data collection process does not cover an end-to-end configuration guide for third party add-ons. For any third-party add-ons, please visit their own configuration guide for complete details. 

## **Sysmon**

### Sysmon Overview

Sysmon, a component of Microsoft’s Sysinternals suite of Windows utilities, is a very powerful host-level tool that can assist in detecting advanced threats on a network by providing intricate host-operation details in real-time. In contrast to common Antivirus/Host-Based Intrusion-detection (HIDS) solutions, Sysmon performs deep monitoring on system activity and logs high-confidence indicators on advanced attacks. 

This is a fantastic way to collect detailed information about your Windows endpoints in Splunk. Sysmon is free of charge, installs painlessly on many variants of Windows, and integrates well with Splunk deployments. In fact, Mark Russinovich (Sysmon’s author) has spoken about Sysmon at the past two RSA conferences and showcases Splunk as an excellent mechanism for the collection and analysis of Sysmon data. 

### Prerequisites 
* This method will require a Splunk Heavy Forwarder or Universal Forwarder to be installed and running on the Windows server. 
* Data Forwarding is configured from the Forwarder to the Splunk Indexer(s). 

### How to Install and Configure Microsoft Sysmon with Deployment Server 

Instead of having to manually install Microsoft Sysmon on each and every Windows server in your environment, it would be optimal to install Sysmon on Windows machines via the Deployment Server (to learn more about the deployment server, click here). You can still manually install Sysmon, but that would be an exhaustive and time-consuming task if your environment contains tons of Windows servers. 

The Sysmon Deploy Add-on for Cyences App (https://github.com/VatsalJagani/Splunk-App-Sysmon-deploy-for-Cyences-App) installs and updates Sysmon on Windows machines. Also, it updates the Sysmon config file if there are any changes made to the Sysmon file. 

### Install and Maintain Sysmon on Windows Machines from deployment-server 

1. Use **Sysmon Deploy Add-on for Cyences App** to install Microsoft Sysmon on Windows machines. 

2. Download the latest Add-on build file named **TA-sysmon-deploy-for-cyences.tgz** (https://github.com/VatsalJagani/Splunk-App-Sysmon-deploy-for-Cyences-App/releases/) 

3. Extract the file under the deployment apps directory on the deployment server. 

4. Create a server class in the deployment server and deploy this Add-on to the required Windows hosts. 

5. From Cyences’ navigation bar, go to **Settings > Sysmon Deploy Audit** for Sysmon deployment, auditing, and reporting. 

6. This will start forwarding the Sysmon events to the indexer(s). Lastly, create an index named **epintel** in the indexer(s) in order to receive data. 

**Note:** The Sysmon Deploy Add-on for Cyences App generates auditing logs in index=**windows** and actual Sysmon data in index=**epintel**. Sysmon collects several types of EventCodes from the Windows hosts. For the Cyences app, we will need to incorporate the following EventCodes: 1, 2, 5, 10, 11, and 25. 

## Sysmon EventCodes:

![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/CY-283-cyences-doc-migration/docs/assets/sysmon_event_codes.png?raw=true)

* Enable EventCode 10 to detect credential dumping on Windows with LSASS access. Please be aware that Event Code 10 may consume a large portion of your daily license usage. 

* EventCode 25 has been added to Sysmon since version 13.0 (released in January 2021). If an earlier version of Sysmon is being used you will not be able to take advantage of the **Window Process Tampering Detected** alert. 

* Sysmon logs are only tested in XML format (see renderXml = 1 in inputs.conf stanza). 

## Verify Data Collection 

Run the search query below to verify that the data is being ingested:

    index=epintel source=”XmlWinEventLog:Microsoft-Windows-Sysmon/Operational” 

Currently, the idea is to use Sysmon data on Windows to get different file operations performed on the Windows hosts (https://splunkbase.splunk.com/app/1914/). 

References: 
*[https://docs.microsoft.com/en-us/sysinternals/downloads/sysmon](https://docs.microsoft.com/en-us/sysinternals/downloads/sysmon) 
*[https://docs.splunksecurityessentials.com/data-onboarding-guides/microsoft-sysmon/](https://docs.splunksecurityessentials.com/data-onboarding-guides/microsoft-sysmon/) 

**Note:** Sysmon data action field conflict detected, please look at **Troubleshooting > Sysmon data action field issue** section in the document to make sure your environment does not have the same issue.

## **Windows WinEventLog**

View the Splunk Add-on for Windows documentation to learn how to enable Security WinEventLog data (https://docs.splunk.com/Documentation/WindowsAddOn/latest/User/AbouttheSplunkAdd-onforWindows). 

Enable the input stanzas below for the Splunk Add-on for Windows. Both stanzas are located in the inputs.conf file (create a local directory if necessary): 

    [WinEventLog://Security] 
    disabled = 0 
    blacklist3 = EventCode="5156" 
    renderXml=false 
    index=windows 

    [WinEventLog://System] 
    disabled = 0 
    renderXml=false 
    index=windows 

**Note:** CrossRealms has blacklisted the below EventCode from **WinEventLog:Security** (this EventCode’s data consumes a ton of licensing usage and is not necessary for this application).
    
* 5156: The Windows Filtering Platform has allowed a connection  

EventCodes 566 & 4662 should already be blacklisted in the default inputs.conf file for the Windows Add-on. 

Windows EventLog from AD servers (security logs) are only tested in plain text format (see renderXml = false in inputs.conf stanza) in the Cyences App.  

Also, Active Directory related reports/alerts (Group Changes, Group Policy Changes, and User Changes) only works with plain text formatted events. 

## Estimated Data Size
Data size with updated stanzas:

* WinEventLog:Security:  0.8-1.2GB per host per day 

* WinEventLog:System: 0.1-0.3GB per host per day

**Note:** The data provided for **WinEventLog:Security** tends to vary from host to host as a lot of it is based on the overall usage of the system.

## **Windows Active Directory Logs**

Use the Windows Add-on to collect Active Directory related logs (https://docs.splunk.com/Documentation/WindowsAddOn/latest/User/AbouttheSplunkAdd-onforWindows).  

This data is required for Active Directory related reports/alerts (Group Changes, Group Policy Changes and User Changes) and it is only compatible with plain text formatted events. 

Enable the input stanzas below for the Splunk Add-on for Windows. Both stanzas are located in the inputs.conf file (create a local directory if necessary): 

    ## Health and Topology Information NT6 
    [script://.\bin\runpowershell.cmd nt6-health.ps1] 
    disabled=0 
    renderXml=false 
    index=msad 

    ## Health and Topology Information 2012r2 and 2016 
    [powershell://AD-Health] 
    disabled = 0 
    renderXml=false 
    index=msad 

    ## Active Directory (Admon Logs) 
    [admon://<name of stanza>] 
    disabled = 0 
    renderXml = false 
    index = msad 
    targetDc = <The unique name of the domain controller you want to use for AD monitoring.> 

Reference for admon input creation:[https://docs.splunk.com/Documentation/Splunk/8.1.3/Data/MonitorActiveDirectory](https://docs.splunk.com/Documentation/Splunk/8.1.3/Data/MonitorActiveDirectory) 

**Note:** Use **renderXml=false** as field extraction may not work with XML format.

## Estimated Data Size
Data size with updated stanzas: 

* MSAD Health and Active Directory both use < 10 MB per day. 

**Note:** The data size tends to vary based on how large the Active Directory environment is, but generally it consumes very little license usage overall.

## **Microsoft Office 365 Management Activities**

The Splunk Add-on for Microsoft Office 365 will be required in order to collect management activity data. 

Splunkbase Download: 
https://splunkbase.splunk.com/app/4055/ 

Installation Guide: 
https://docs.splunk.com/Documentation/AddOns/released/MSO365/Installationsteps 

## How to Install and Configure the Splunk Add-on for Microsoft Office 365: 

1. Install the Add-on on the Heavy Forwarder (https://docs.splunk.com/Documentation/AddOns/released/MSO365/Install). 

2. Configure the Add-on on the Heavy Forwarder. 
    * Configure Integration Application (https://docs.splunk.com/Documentation/AddOns/released/MSO365/ConfigureappinAzureAD). 
    * Configure Tenant (https://docs.splunk.com/Documentation/AddOns/released/MSO365/Configuretenant). 

3. Configure the Inputs on the Heavy Forwarder. 
    * Configure Management Activity input -[https://docs.splunk.com/Documentation/AddOns/released/MSO365/Configureinputs](https://docs.splunk.com/Documentation/AddOns/released/MSO365/Configureinputs) and[https://docs.splunk.com/Documentation/AddOns/released/MSO365/ConfigureinputsmanagementAPI.](https://docs.splunk.com/Documentation/AddOns/released/MSO365/ConfigureinputsmanagementAPI.) 
        * For the input use o365 as the index name.  
        * The index can be renamed, but the default value for this app is o365. 
    * Enable other inputs based on your needs, but in order for Office 365 reports to work only the input data for Management Activity is required. 

4. Install the Add-on on the Search Head. 

## Estimated Data Size
It consumes around 80-100MB of license usage per day. 

The total amount of data varies based on the size of your organization (our calculations are based on organizations with around thirty Office 365 users). 

## **Sophos Central Events**

The Sophos Central Splunk Add-on is required to collect Sophos Central data. 

Splunkbase Download:
https://splunkbase.splunk.com/app/4647/ 
 
Installation and Configuration Guide:
https://splunkbase.splunk.com/app/4647/#/details 

## How to Install and Configure the Sophos Central Add-on: 

1. Install the Add-on on the Heavy Forwarder. 

2. Configure the Add-on on the Heavy Forwarder. 
    * Configure the Application. 
    * Create an index named **Sophos** or update the macro definition in the Cyences app (**Settings > Configuration**). 

3. Install the Add-on on the Search Head. 

## Estimated Data Size  
The Sophos Central Add-on consumes around 60-80MB of license usage per day. 

The total amount of data varies based on the size of your organization (our calculations are based on organizations with around thirty users and a few workstations). 

## **Sophos Central Metadata through API**
Cyences version 1.6 utilizes Sophos Central API to collect information about Sophos endpoints. The Sophos Central API data is being used in a number of places throughout the Cyences app, including the Device Inventory dashboard. 

## Sophos Central API Configuration

1. Login to Sophos Central Parner portal. 

2. Click **Settings & Policies**. 

3. Click on the **API Credentials link**.

4. Add a new set of credentials. 

5. Provide a name and description for your credential set, then click **Add**. 

6. Click the **Copy** button at the end of the Client ID.  

7. Click **Show Client Secret**. 

8. Refer to the Sophos Central documentation link below for further assistance.  
    *[https://developer.sophos.com/getting-started](https://developer.sophos.com/getting-started) 

## Sophos Central API Configuration for Cyences  

1. From Cyences’ navigation bar, go to **Settings > Configuration**. 

2. Enter the Client ID and Client Secret for **Sophos Endpoint API Configuration**.

3. Click **Save**.

    ![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/CY-283-cyences-doc-migration/docs/assets/sophos_endpoint_api_config.png?raw=true)

## How to verify the Sophos Central API configuration: 

1. From Cyences’ navigation bar, click **Search**.

2. Run the following search query: 
    * | sophosinstancedetails all_endpoints=True 

3. If the search results return/s any errors, then there is something wrong with the configuration. 

4. A successful configuration will display the total number of events with no errors.  

    ![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/CY-283-cyences-doc-migration/docs/assets/sophos_endpoint_api_config.png?raw=true)

## Estimated Data Size
Data collected from Sophos will be stored in a KV Store lookup, so it will not affect your Splunk license. 

## **Windows Defender**

To collect the Windows defender data, we’ll be using below input stanza to collect the data. This data collection requires **TA for Microsoft Windows Defender** (https://splunkbase.splunk.com/app/3734/) for data parsing and field extraction. 

Enable the input stanzas below for the Microsoft Windows Defender TA. Both stanzas are located in the inputs.conf file (create a local directory if necessary): 

    [WinEventLog://Microsoft-Windows-Windows Defender/Operational] 
    index = windefender 
    disabled = 0 
    renderXml = 1 

**Note:** Windows Defender logs are only tested in XML format (see renderXml = 1 in inputs.conf stanza).

## Estimated Data Size
The estimated data size depends on the number of hosts that are sending Windows Defender data. 

* Events: 150-300 per Windows machine (daily) 
* Licensing: < 5MB per Windows machine (daily)

## **CrowdStrike Event Streams Logs**

In order to collect CrowdStrike’s Event Streams logs, the **CrowdStrike Falcon Event Streams Technical Add-On** (https://splunkbase.splunk.com/app/5082/) is required for data parsing and field extraction. 

There are two main components that need to be configured for the CrowdStrike Add-on: 

1. Add Account: 

    ![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/CY-283-cyences-doc-migration/docs/assets/crowdstrike_config_add_account.png?raw=true)

2. Create New Input: 

    ![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/CY-283-cyences-doc-migration/docs/assets/crowdstrike_config_new_input.png?raw=true)

3. Refer to the **CrowdStrike Resource Center: CrowdStrike Falcon Event Streams Add-On Guide** for the Add-on's configuration steps (https://www.crowdstrike.com/resources/guides/how-to-install-falcon-event-streams-splunk-add-on/).

## **Kaspersky Logs**

Use the following Add-on to collect the data from Kaspersky. 

Splunkbase Download: 
https://splunkbase.splunk.com/app/4656/   

Installation Guide: 
https://splunkbase.splunk.com/app/4656/#/details 

## Estimated Data Size
The Kaspersky data is not large in terms of license and storage usage but it depends on the number of hosts connected in Kaspersky. 

## **Palo Alto Firewall Logs**

The Palo Alto Add-on for Splunk is required to collect the firewall logs from the Palo Alto. 

Splunkbase Download: 
https://splunkbase.splunk.com/app/2757/ 

Installation Guide: 
https://splunk.paloaltonetworks.com/installation.html 

## How to Install and Configure the Palo Alto Add-on: 

1. Install the Add-on on the Heavy Forwarder (Reference). (TODO - incorrect reference link)   

2. Configure the Add-on on the Heavy Forwarder. 
    * Getting data into Splunk (https://splunk.paloaltonetworks.com/getting-data-in.html).	 
    * Create an index named **pan_log** or update the macro definition in Cyences’ configuration page.  

3. Install the Add-on on the Search Head. 

## Estimated Data Size  
The Palo Alto Add-on consumes around 8-10GB of license usage per day. 

The total amount of data varies based on the size of your organization (our calculations are based on organizations with around fifty regular users). 

## **FortiGate VPN Logs**

The Fortinet FortiGate Add-On for Splunk is required to collect firewall logs from FortiGate servers. 

Splunkbase Download: 
https://splunkbase.splunk.com/app/2846/ 

Installation Guide: 
https://splunkbase.splunk.com/app/2846/#/details 

## How to Install and Configure the FortiGate Add-on: 

1. Install the Add-on on the Heavy Forwarder (Reference) (TODO - incorrect reference link).   

2. Configure the Add-on on the Heavy Forwarder. 
    * Getting data into Splunk (Reference) (TODO - incorrect reference link).
    * Create an index named **fortigate** or update the macro definition in Cyences’ configuration page.  

3. Install the Add-on on the Search Head. 

## FortiGate VPN Support and issue with action field extraction 

* Due to a field extraction issue in the Fortinet FortiGate Add-On for Splunk (field=**action**). 

* Verify that the FortiGate VPN data is supported by the Cyences App by following the instructions below. 

**How to fix the problem?**

1. From Splunk’s navigation bar, go to **Settings > Data models**. 

2. Search for the **Authentication** data model and click on it. 

3. Click **Edit > Edit Acceleration**. 

4. Uncheck the Acceleration box, then click **Save**. 

5. Under the **Calculated** fields section, click **Edit** for the **action** field. 

    ![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/CY-283-cyences-doc-migration/docs/assets/edit_action_field.png?raw=true)

6. Your current configuration should look similar to this: 
    * if(isnull(action) OR action="","unknown",action) 

7. Replace the above configuration/eval expression with the contents below: 
    * case(sourcetype="fgt_event" AND subtype="vpn" AND vendor_action IN ("tunnel-up", "phase2-up"), "success", sourcetype="fgt_event" AND subtype="vpn" AND vendor_action="ssl-login-fail", "failure", isnull(action) OR action="", "unknown", 1==1, action) 

8. Click **Save**. 

9. Click **Edit > Edit Acceleration**. 

10. Enable the Acceleration, then click **Save**.  

    ![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/CY-283-cyences-doc-migration/docs/assets/edit_acceleration.png?raw=true)

## **Network/Firewall Logs**
View the **Data Onboarding > Palo Alto Firewall Logs** section to see how to collect the network traffic logs from Palo Alto Firewall. 

If your organization is using another firewall network device like Cisco, Meraki, etc. please follow the appropriate Splunk integration (Add-on) steps for data collection purposes.  

Install the relevant Add-on to the search head for field extractions. 

Make sure that the integration that’s being used is mapped with the CIM **Network_Traffic** data model. 

## **VPN Data Logs**

## Global Protect VPN 
If your organization is using GlobalProtect VPN, then the required data can be collected via Palo Alto’s logs. Refer to the **Data Onboarding > Palo Alto Firewall Logs** section for more information regarding the data collection process. 

## FortiGate VPN 
If your organization uses FortiGate VPN, then the required data can be collected via Palo Alto’s logs. Refer to the **Data Onboarding > FortiGate VPN Logs** section for more information regarding the data collection process. 

Make sure to update the **VPN data** macro in the **Cyences > Settings > Configuration** page from index=pan_log to **index=fortigate**.

## **Lansweeper Data**

The Lansweeper Add-on for Splunk is required to collect information about the assets from Lansweeper. 

Splunkbase Download: 
https://splunkbase.splunk.com/app/5418/ 

Installation and Configuration Guide: 
https://splunkbase.splunk.com/app/5418/#/details 

**Note:** Use index=**lansweeper** for data collection or update the macro definition for `cs_lansweeper` (**Settings > Configuration**).

## Estimated Data Size

The Lansweeper Add-on does not consume a ton of license usage since it only collects the assets information, but ultimately it depends on the number of assets that are present in your environment. 

## **Qualys Data**

The Qualys Technology Add-on (TA) for Splunk is required to keep track of all the vulnerabilities on the assets/devices.  

Splunkbase Download: 
https://splunkbase.splunk.com/app/2964/ 

Installation and Configuration Guide: 
https://www.qualys.com/docs/qualys-ta-for-splunk.pdf 

**Note:** Use index=**qualys** for data collection or update the macro definition for `cs_qualys` (**Settings > Configuration**).

## Estimated Data Size

The Qualys Technology Add-on (TA) for Splunk does not consume a ton of license usage since it only collects information regarding vulnerability scans, but it all depends on the number of devices and vulnerabilities that are present in your environment. For example, CrossRealms had around 300 devices and the total license consumption was less than 10MB. 

## **Tenable Data**

The Tenable Add-on for Splunk is required to collect the vulnerabilities for each IT asset/device. 

Splunkbase Download: 
https://splunkbase.splunk.com/app/4060/ 

Installation and Configuration Guide: 
https://docs.tenable.com/integrations/Splunk/Content/Splunk%20Add%20On.htm 

**Note:** Use index=**tenable** for data collection or update the macro definition for `cs_tenable` (**Settings > Configuration**).

## Estimated Data Size

The Tenable Add-on for Splunk does not consume a ton of license usage, since it only collects vulnerability scan related information from all of your devices, but it is contingent on the number of devices and vulnerabilities that are present in your environment. For example, CrossRealms had around 400 devices and the total license consumption was less than 150MB. 

## Nessus Data Importer Add-on

Nessus Data Importer Add-on (https://splunkbase.splunk.com/app/2740) can be used to collect vulnerability related data from Nessus on-premise, but we do not recommend this Add-on since it has been archived by the developer. 

Installation and Configuration Guide: 
https://splunkbase.splunk.com/app/2740/#/details 

**Note:** Use **sourcetype=nessus_json** for inputs.conf (file monitoring input). Use index=**tenable** for data collection or update the macro definition for `cs_tenable` (**Settings > Configuration**).

Limitations with Nessus Data Importer Add-on: 
* Data collected by this Add-on may not have all of the necessary fields. 

* Vulnerabilities do not have a status field information like open, reopen, or fixed, so we are considering all types of vulnerabilities as open. Meaning, Cyences might not display the correct active vulnerability count.  

* These vulnerabilities do not contain protocol:port information, similar to what we have for Tenable:IO or Tenable:SC.  

## **Linux/Unix Data**

Linux/Unix data is collected via the Splunk Add-on for Linux and Unix (*nix).  

Splunkbase Download:
https://splunkbase.splunk.com/app/833/ 

Installation and Configuration Guide:
https://docs.splunk.com/Documentation/AddOns/released/UnixLinux/About 

Insert the input stanzas below for the Splunk Add-on for Linux and Unix (*nix) to collect auditing data. Each stanza should be placed in the inputs.conf file (create a local directory if necessary): 

    [script://./bin/openPorts.sh] 
    interval = 3600 
    sourcetype = openPorts 
    source = openPorts 
    disabled = 0 
    index = os 

    [script://./bin/df.sh] 
    interval = 3600 
    sourcetype = df 
    source = df 
    disabled = 0 
    index = os 

    # Lists users who could login (i.e., they are assigned a login shell) 
    [script://./bin/usersWithLoginPrivs.sh] 
    sourcetype = usersWithLoginPrivs 
    source = usersWithLoginPrivs 
    interval = 3600 
    disabled = 0 
    index = os

    # Shows stats per link-level Etherner interface (simply, NIC) 
    [script://./bin/interfaces.sh] 
    sourcetype = interfaces 
    source = interfaces 
    interval = 60 
    disabled = 0 
    index = os 

    [script://./bin/hardware.sh] 
    sourcetype = hardware 
    source = hardware 
    interval = 36000 
    disabled = 0 
    index=os   

    # May require Splunk forwarder to run as root on some platforms. 
    [script://./bin/openPortsEnhanced.sh] 
    disabled = 0 
    interval = 3600 
    source = Unix:ListeningPorts 
    sourcetype = Unix:ListeningPorts 
    index = os 

    # Currently only supports SunOS, Linux, OSX. May require Splunk forwarder to run as root on some platforms. 
    [script://./bin/service.sh] 
    disabled = 0 
    interval = 3600 
    source = Unix:Service 
    sourcetype = Unix:Service 
    index = os 

    [script://./bin/uptime.sh] 
    disabled = 0 
    interval = 86400 
    source = Unix:Uptime 
    sourcetype = Unix:Uptime 
    index = os 

    [script://./bin/version.sh] 
    disabled = 0 
    interval = 86400 
    source = Unix:Version 
    sourcetype = Unix:Version 
    index = os

**Privileged Accessed Data:**

We have created a specific shell script to collect information about which users have sudo privileges via a user list which has normal login privileges. Download the Cyences Add-on for Splunk to enable this feature. 

Splunkbase Download: 
https://splunkbase.splunk.com/app/5659/ 

Insert the input stanza below for the Cyences Add-on for Splunk. The stanza should be placed in the inputs.conf file (create a local directory if necessary): 

    [script://./bin/sudousers.sh] 
    disabled = 0 

**Note:** Use index=**linux** or index=**os**, for data collection or update the macro definition for Linux Data (**Settings > Configuration**).

## Estimated Data Size

## **Microsoft Azure Security Score**

The Microsoft Graph Security Score Add-on for Splunk is required to collect the Microsoft Azure/O365 Security Score information. 

Splunkbase Download: 
https://splunkbase.splunk.com/app/5693/ 

Installation and Configuration Guide: 
https://splunkbase.splunk.com/app/5693/#/details 

**Note:** Use index=**o365** for data collection or update the macro definition for `cs_azure_securityscore` (**Settings > Configuration**).

## Estimated Data Size

The Microsoft Graph Security Score Add-on should consume around 5-10MB per day. 

## **Microsoft 365 Defender ATP**

The Microsoft 365 Defender Add-on for Splunk will be used to collect Windows Defender ATP alert logs. 

Splunkbase Download: 
https://splunkbase.splunk.com/app/4959/ 

Installation and Configuration Guide: 
https://splunkbase.splunk.com/app/4959/#/details 

**Note:** Use index=**defenderatp** for data collection or update the macro definition for `cs_o365_defender_atp` (**Settings > Configuration**).

## Collect Defender ATP Configuration Status Logs from Windows Servers 

The Defender ATP Status Check Add-On will be used to collect Defender ATP Configuration Status check logs. 

Splunkbase Download: 
https://splunkbase.splunk.com/app/5691 

Installation and Configuration Guide: 
https://splunkbase.splunk.com/app/5691/#/details 

Install the Defender ATP Status Check Add-On on a heavy forwarder and universal forwarders (Windows).

Add the following stanza to inputs.conf in the local directory for the **TA-defender-atp-status-check** add-on:

    [powershell://generate_defender_atp_status_logs] 
    disabled = 0 

    [monitor://$SPLUNK_HOME\var\log\TA-defender-atp-status-check \DefenderATPStatus.log] 
    disabled = 0 
    index = defenderatp 

**Note:** Use index=defenderatp for data collection or update the macro definition for `cs_o365_defender_atp_audit` (**Settings > Configuration**).

## Audit Defender ATP Configuration Status 

Use the Microsoft Defender ATP Audit dashboard (**Settings > Microsoft 365 Defender ATP**) to audit the configuration status for Defender ATP.

## **AWS**

The Splunk Add-on for Amazon Web Services is required to collect Amazon Web Services data. 

Splunkbase Download: 
https://splunkbase.splunk.com/app/1876/ 

Installation and Configuration Guide: 
http://docs.splunk.com/Documentation/AddOns/latest/AWS/Description 

**Note:** Use both index=**aws** and index=**summary** for data collection or update the macro definition for `cs_aws` (**Settings > Configuration**). 

## Estimated Data Size

The license usage consumed by the Splunk Add-On for Amazon Web Services is based on the size of your environment, the number of users, and the amount of user activity taking place in your environment. 

## **G Suite**

The Input Add On for G Suite App is required to collect Google Suite data. 

Splunkbase Download: 
https://splunkbase.splunk.com/app/3793/ 

Installation and Configuration Guide:
https://docs.google.com/document/d/1HLCLtJ0Kvb5AZUrJQ2pDbRul_mB400xbeRqzaIUicPY/edit 

The Cyences app only needs **Activity – Login** service data from the Input Add On for G Suite App. 

The following items should not be installed on a Search Head if the Cyences app is already present due to authentication tagging issues:
* G Suite For Splunk 
(https://splunkbase.splunk.com/app/3791/) 
* TA for G Suite App 
(https://splunkbase.splunk.com/app/3792/) 

**Note:** Use index=**gsuite** for data collection or update the macro definition for `cs_gsuite` (**Settings > Configuration**).

## Estimated Data Size

The license usage consumed by this Add-On is based on the size of your environment, the number of users, and the amount of user activity taking place in your environment.