---
layout: default
title: Linux/Unix
permalink: /configuration/data_onboarding/linux/
nav_order: 16
parent: Data Onboarding
grand_parent: Configuration
---


## **Linux/Unix Data**

Linux/Unix data is collected via the Splunk Add-on for Linux and Unix (*nix).  

Splunkbase Download:
[https://splunkbase.splunk.com/app/833/](https://splunkbase.splunk.com/app/833/) 

Installation and Configuration Guide:
[https://docs.splunk.com/Documentation/AddOns/released/UnixLinux/About](https://docs.splunk.com/Documentation/AddOns/released/UnixLinux/About) 

Insert the input stanzas below for the Splunk Add-on for Linux and Unix (*nix) to collect auditing data. Each stanza should be placed in the inputs.conf file (create a local directory if necessary): 


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
[https://splunkbase.splunk.com/app/5659/](https://splunkbase.splunk.com/app/5659/) 

Insert the input stanza below for the Cyences Add-on for Splunk. The stanza should be placed in the inputs.conf file (create a local directory if necessary): 

    [script://./bin/sudousers.sh] 
    disabled = 0 

**Note:** Use index=**linux** or index=**os**, for data collection or update the macro definition for Linux Data (**Settings > Configuration**).

## Estimated Data Size
The total data size with the updated stanzas are less than 100MB per Linux host per day. Exclude inputs that are not relevant to your environment.
