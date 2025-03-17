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

### App Installation

| App Title | App ID |  Search Head (etc/apps) | Indexer/Intermediate Forwarder (etc/manager-apps or etc/apps) | Heavy Forwarder (etc/apps) | Server / UF / Deployment Server (etc/deployment-apps) | 
| --------- | ------ | ----------------------- | ------------------------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| Splunk Add-on for Microsoft SQL Server | 2648 | Required | Required | Required | - |

**Note** : Create an index named **mssql** or update the macro definition in Cyences app configuration page (**Cyences Settings > Cyences App Configuration**).


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


## Estimated Data Size

The license usage consumed by the Splunk Add-on for Microsoft SQL Server is based on the audit policy and database usage of your environment