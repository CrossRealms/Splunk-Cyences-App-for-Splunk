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

    * Details needed from DBA Team:
        * IP Address or FQDN of DB server
        * Port number for DB server
        * DB table name that contains Audit Trail data
        * Username & Password - Should have Readonly access to the Audit Trail Table in the DB
        * Default database name and Database name
        * Timezone on the database server


* Make sure that you have installed `Splunk_JDBC_mssql` Add-on [https://splunkbase.splunk.com/app/6150](https://splunkbase.splunk.com/app/6150) on your HF (where DB connect is installed). This is requirement for DB Connect App for database driver availability for Oracle.
* Make sure that you have installed `Splunk_TA_microsoft-sqlserver` Add-on [https://splunkbase.splunk.com/app/2648](https://splunkbase.splunk.com/app/2648) on both your HF (where DB connect is installed) & on the SH.
* Make sure to use `mssql:audit` sourcetype when configuring the data input in DB Connect App.


3. Azure MSSQL using Splunk Add-on for Microsoft Cloud Services

    1. Enable Audit Log: [https://learn.microsoft.com/en-us/azure/mysql/single-server/concepts-audit-logs](https://learn.microsoft.com/en-us/azure/mysql/single-server/concepts-audit-logs)

    2. Collect using Azure Event Hub Input: [https://splunk.github.io/splunk-add-on-for-microsoft-cloud-services/Configureeventhubs/](https://splunk.github.io/splunk-add-on-for-microsoft-cloud-services/Configureeventhubs/)

        * Use `mssql:audit:json` as sourcetype when creating input


## Estimated Data Size

The license usage consumed by the Splunk Add-on for Microsoft SQL Server is based on the audit policy and database usage of your environment