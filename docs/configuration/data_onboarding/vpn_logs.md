---
layout: default
title: VPN Logs
permalink: /configuration/data_onboarding/vpn_logs/
nav_order: 
parent: Data Onboarding
grand_parent: Configuration
---

## **VPN Data Logs**

## Global Protect VPN 
If your organization is using GlobalProtect VPN, then the required data can be collected via Palo Alto's logs. Refer to the **Data Onboarding > Palo Alto Firewall Logs** section for more information regarding the data collection process. 

## FortiGate VPN 
If your organization uses FortiGate VPN, then the required data can be collected via Fortigate's logs. Refer to the **Data Onboarding > FortiGate VPN Logs** section for more information regarding the data collection process. 

Make sure to update the **VPN data** macro in the **Cyences > Settings > Configuration** page from **index=pan_log** to **index=fortigate**.