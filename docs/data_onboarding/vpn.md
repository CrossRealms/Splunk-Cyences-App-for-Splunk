---
layout: default
title: VPN
permalink: /data_onboarding/vpn/
nav_order: 12
parent: Data Onboarding
---

## Cisco Anyconnect Data

The Cisco Endpoint Security Analytics (CESA) Add-on and App are both required for Splunk administrators to analyze and correlate user and endpoint behavior in the Cyences app. 

Splunkbase Download Add-on:
[https://splunkbase.splunk.com/app/4221](https://splunkbase.splunk.com/app/4221)

Splunkbase Download App:
[https://splunkbase.splunk.com/app/2992](https://splunkbase.splunk.com/app/2992)

Installation and Configuration Guide:
[https://www.cisco.com/c/en/us/support/docs/security/anyconnect-secure-mobility-client/200600-Install-and-Configure-Cisco-Network-Visi.html](https://www.cisco.com/c/en/us/support/docs/security/anyconnect-secure-mobility-client/200600-Install-and-Configure-Cisco-Network-Visi.html)

### App Installation

| App Title | App ID |  Search Head (etc/apps) | Indexer/Intermediate Forwarder (etc/manager-apps or etc/apps) | Heavy Forwarder (etc/apps) | Server / UF / Deployment Server (etc/deployment-apps) | 
| --------- | ------ | ----------------------- | ------------------------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| Cisco Endpoint Security Analytics (CESA) Add-On for Splunk | 4221 | Required | Required | Required | - |
| Cisco Endpoint Security Analytics (CESA) | 2992 | Required | Not Required | Not Required | - |

**Note** : Create an index **VPN Data** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).

[comment]: <> (TODO_LATER: add estimated data size)


## Fortinet FortiGate Data

If your organization uses FortiGate VPN, then the required data can be collected via Fortigate's logs. Refer to the [Data Onboarding > Network Devices > Fortinet FortiGate]({{ site.baseurl }}/data_onboarding/network_devices/fortinet_fortigate) section for more information regarding the data collection process.


## GlobalProtect (Palo Alto) VPN Data

If your organization is using GlobalProtect VPN, then the required data can be collected via Palo Alto's logs. Refer to the [Data Onboarding > Network Devices > Palo Alto Firewall Logs]({{ site.baseurl }}/data_onboarding/network_devices/palo_alto) section for more information regarding the data collection process.

## Sophos Firewall VPN Data

If your organization is using Sophos Firewall as VPN, then the required data can be collected via sophos firewall's logs. Refer to the [Data Onboarding > Network Devices > Sophos Firewall Logs]({{ site.baseurl }}/data_onboarding/network_devices/sophos_firewall) section for more information regarding the data collection process.