---
layout: default
title: DNS Tracker
permalink: /data_onboarding/dns_tracker/
nav_order: 9
parent: Data Onboarding
---

## **DNS Tracker Data**

Add-ons that have CIM compatibility with the **Network_Resolution** datamodel will also work with Cyences' DNS related alerts and dashboards.

Refer to `A-TA-dns_inputs` App on [this GitHub Repo](https://github.com/CrossRealms/Cyences-Input-Apps) for inputs.conf reference for Windows based DNS servers. This is not complete inputs set for DNS.

#### Important sourcetypes to be collected
* WinEventLog:DNS Server
* MSAD:NT6:DNS
* MSAD:NT6:DNS-Health
* MSAD:NT6:DNS-Zone-Information
