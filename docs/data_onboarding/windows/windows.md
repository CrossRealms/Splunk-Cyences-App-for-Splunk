---
layout: default
title: Windows 
permalink: /data_onboarding/windows/
nav_order: 7
parent: Data Onboarding
has_children: true
---

## **Windows Data**

### App Installation

| App |  Search Head  | Indexer | Heavy Forwarder | UF / Deployment Server | Additional Details |
| ---- | ------ | ------------ | -------------- | -------------------- | ------ |
| [Splunk Add-on for Windows](https://splunkbase.splunk.com/app/742/) | Required | - | - | Required (only for Windows) | [Installation and Configuration Guide](https://docs.splunk.com/Documentation/AddOns/released/Windows/Installationoverview) |
| [A-TA-windows_inputs](https://github.com/CrossRealms/Cyences-Input-Apps) | - | - | - | Required (only for Windows) | [Installation and Configuration Guide](https://docs.splunk.com/Documentation/AddOns/released/Windows/Installationoverview) |

* Refer to `A-TA-windows_inputs` App on [this GitHub Repo](https://github.com/CrossRealms/Cyences-Input-Apps) for inputs.conf reference.

**Note** : Create an index named **wineventlog** **windows** and **msad** or update the **cs_windows_idx** macro definition from Cyences app configuration page (**Cyences Settings > Cyences App Configuration > Products Setup**).


### Estimated Data Size
Data size with updated stanzas:
* WinEventLog:Security: 0.8-1.2GB per host per day 
* WinEventLog:System: 0.1-0.3GB per host per day

**Note:** The data provided for **WinEventLog:Security** tends to vary from host to host as a lot of it is based on the overall usage of the system.