---
layout: default
title: MSSQL
permalink: /data_onboarding/database/mssql/
nav_order: 1
parent: Database 
grand_parent: Data Onboarding
---

## **MSSQL Data**

The Splunk Add-on for Microsoft SQL Server is required for the field extraction.

Splunkbase Download: 
[https://splunkbase.splunk.com/app/2648](https://splunkbase.splunk.com/app/2648)

Installation and Configuration Guide: 
[https://docs.splunk.com/Documentation/AddOns/released/MSSQLServer/About](https://docs.splunk.com/Documentation/AddOns/released/MSSQLServer/About)



The Cyences App has support following data collection mechanisms

1. Window Application log using Splunk Add-on for Microsoft Windows (Recommended)
    * [https://www.ultimatewindowssecurity.com/sqlserver/auditlog/auditobject.aspx](https://www.ultimatewindowssecurity.com/sqlserver/auditlog/auditobject.aspx)

2. Audit table using Splunk DB Connect app 
    * [https://docs.splunk.com/Documentation/AddOns/released/MSSQLServer/SQLServerconfiguration](https://docs.splunk.com/Documentation/AddOns/released/MSSQLServer/SQLServerconfiguration)
    * [https://www.ultimatewindowssecurity.com/sqlserver/auditlog/auditobject.aspx](https://www.ultimatewindowssecurity.com/sqlserver/auditlog/auditobject.aspx)

3. Azure MSSQL using Splunk Add-on for Microsoft Cloud Services

    1. Enable Audit Log: [https://learn.microsoft.com/en-us/azure/mysql/single-server/concepts-audit-logs](https://learn.microsoft.com/en-us/azure/mysql/single-server/concepts-audit-logs)

    2. Collect using Azure Event Hub Input: [https://splunk.github.io/splunk-add-on-for-microsoft-cloud-services/Configureeventhubs/](https://splunk.github.io/splunk-add-on-for-microsoft-cloud-services/Configureeventhubs/)

        * Use `mssql:audit:json` as sourcetype when creating input


**Note:** Use both index=**mssql** for data collection or update the macro definition for `cs_mssql` (**Settings > Configuration**). 


## Estimated Data Size

The license usage consumed by the Splunk Add-on for Microsoft SQL Server is based on the audit policy and database usage of your environment