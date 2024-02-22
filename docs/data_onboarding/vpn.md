---
layout: default
title: VPN
permalink: /data_onboarding/vpn/
nav_order: 25
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

**Note:** Configure the index value for **VPN Data** under the **Data Source Macros** section in Cyences' Configuration page.

[comment]: <> (TODO_LATER: add estimated data size)


## Fortinet FortiGate Data

If your organization uses FortiGate VPN, then the required data can be collected via Fortigate's logs. Refer to the [Data Onboarding > Network Devices > Fortinet FortiGate]({{ site.baseurl }}/data_onboarding/network_devices/fortinet_fortigate) section for more information regarding the data collection process.


## GlobalProtect (Palo Alto) VPN Data

If your organization is using GlobalProtect VPN, then the required data can be collected via Palo Alto's logs. Refer to the [Data Onboarding > Network Devices > Palo Alto Firewall Logs]({{ site.baseurl }}/data_onboarding/network_devices/palo_alto) section for more information regarding the data collection process.