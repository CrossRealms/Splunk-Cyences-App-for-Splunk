---
layout: default
title: Active Directory
permalink: /configuration/data_onboarding/active_directory/
nav_order: 4
parent: Data Onboarding
grand_parent: Configuration
---


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
[https://splunkbase.splunk.com/app/4055/](https://splunkbase.splunk.com/app/4055/) 

Installation Guide: 
[https://docs.splunk.com/Documentation/AddOns/released/MSO365/Installationsteps](https://docs.splunk.com/Documentation/AddOns/released/MSO365/Installationsteps) 

## How to Install and Configure the Splunk Add-on for Microsoft Office 365: 

1. Install the Add-on on the Heavy Forwarder [https://docs.splunk.com/Documentation/AddOns/released/MSO365/Install](https://docs.splunk.com/Documentation/AddOns/released/MSO365/Install). 

2. Configure the Add-on on the Heavy Forwarder. 
    * Configure Integration Application [https://docs.splunk.com/Documentation/AddOns/released/MSO365/ConfigureappinAzureAD](https://docs.splunk.com/Documentation/AddOns/released/MSO365/ConfigureappinAzureAD). 
    * Configure Tenant [https://docs.splunk.com/Documentation/AddOns/released/MSO365/Configuretenant](https://docs.splunk.com/Documentation/AddOns/released/MSO365/Configuretenant). 

3. Configure the Inputs on the Heavy Forwarder. 
    * Configure Management Activity input -[https://docs.splunk.com/Documentation/AddOns/released/MSO365/Configureinputs](https://docs.splunk.com/Documentation/AddOns/released/MSO365/Configureinputs) and[https://docs.splunk.com/Documentation/AddOns/released/MSO365/ConfigureinputsmanagementAPI.](https://docs.splunk.com/Documentation/AddOns/released/MSO365/ConfigureinputsmanagementAPI.) 
        * For the input use o365 as the index name.  
        * The index can be renamed, but the default value for this app is o365. 
    * Enable other inputs based on your needs, but in order for Office 365 reports to work only the input data for Management Activity is required. 

4. Install the Add-on on the Search Head. 

## Estimated Data Size
It consumes around 80-100MB of license usage per day. 

The total amount of data varies based on the size of your organization (our calculations are based on organizations with around thirty Office 365 users).
