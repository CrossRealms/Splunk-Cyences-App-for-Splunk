---
layout: default
title: Windows 
permalink: /configuration/data_onboarding/windows/
nav_order: 3
parent: Data Onboarding
grand_parent: Configuration
has_children: true
---

## **Windows Data**

Configure the Splunk Add-on for Windows to collect field extractions related to Active Directory and Windows data. 

Splunkbase Download:
[https://splunkbase.splunk.com/app/742/](https://splunkbase.splunk.com/app/742/) 

Installation and Configuration Guide:
[https://docs.splunk.com/Documentation/AddOns/released/Windows/Installationoverview](https://docs.splunk.com/Documentation/AddOns/released/Windows/Installationoverview)


Enable the input stanzas below for the Splunk Add-on for Windows. Both stanzas are located in the inputs.conf file (create a local directory if necessary): 

    [script://.\bin\win_listening_ports.bat]
    disabled = 0
    index=windows

    [WinEventLog://Security] 
    disabled = 0 
    blacklist3 = EventCode="5156" 
    renderXml=false 
    index=windows 

    [WinEventLog://System] 
    disabled = 0 
    renderXml=false 
    index=windows 

**Note:** CrossRealms has blacklisted the below EventCode from **WinEventLog:Security** (this EventCode's data consumes a ton of licensing usage and is not necessary for this application).
    
* 5156: The Windows Filtering Platform has allowed a connection  

EventCodes 566 & 4662 should already be blacklisted in the default inputs.conf file for the Windows Add-on. 

Windows EventLog from AD servers (security logs) are only tested in plain text format (see renderXml = false in inputs.conf stanza) in the Cyences App.  

Also, Active Directory related dashboards/alerts (Group Changes, Group Policy Changes, and User Changes) only works with plain text formatted events. 

**Note:** Please configure the index value in **WinEventLog Security Data** and **WinEventLog System Data** from **Data Source Macros** section under Cyences Configuration page.

### Estimated Data Size
Data size with updated stanzas:
* WinEventLog:Security:  0.8-1.2GB per host per day 
* WinEventLog:System: 0.1-0.3GB per host per day

**Note:** The data provided for **WinEventLog:Security** tends to vary from host to host as a lot of it is based on the overall usage of the system.
