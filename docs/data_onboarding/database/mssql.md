---
layout: default
title: MSSQL
permalink: /data_onboarding/database/mssql/
nav_order: 1
parent: Database 
grand_parent: Data Onboarding
---

## **MSSQL Data**

## The Cyences app supports following data collection mechanisms:

### 1. Window Application log using Splunk Add-on for Microsoft Windows (Recommended)

#### App Installation

| App |  Search Head  | Indexer | Heavy Forwarder | UF / Deployment Server | Additional Details |
| ---- | ------ | ------------ | -------------- | -------------------- | ------ |
| [Splunk Add-on for Microsoft Windows](https://splunkbase.splunk.com/app/742/) | Required | - | - | Required (On DB server) | [Installation and Configuration Guide](https://www.ultimatewindowssecurity.com/sqlserver/auditlog/auditobject.aspx) |
| [Splunk Add-on for Microsoft SQL Server](https://splunkbase.splunk.com/app/2648/) | Required | - | Required | - | [Installation and Configuration Guide](https://docs.splunk.com/Documentation/AddOns/released/MSSQLServer/About) |


### 2. Audit table using Splunk DB Connect app 

* Details needed from DBA Team:
    * IP Address or FQDN of DB server
    * Port number for DB server
    * DB table name that contains Audit Trail data
    * Username & Password - Should have Readonly access to the Audit Trail Table in the DB
    * Default database name and Database name
    * Timezone on the database server

#### App Installation

| App |  Search Head  | Indexer | Heavy Forwarder | UF / Deployment Server | Additional Details |
| ---- | ------ | ------------ | -------------- | -------------------- | ------ |
| [Splunk DB Connect](https://splunkbase.splunk.com/app/2686/) | - | - | Required | - | Make sure to use `mssql:audit` sourcetype when configuring the data input. |
| [Splunk DBX Add-on for Microsoft SQL Server JDBC](https://splunkbase.splunk.com/app/6150/) | - | - | Required | - | This addon is DB Connect App's requirement for database driver availability of MSSQL. |
| [Splunk Add-on for Microsoft SQL Server](https://splunkbase.splunk.com/app/2648/) | Required | - | Required | - | [Installation and Configuration Guide](https://docs.splunk.com/Documentation/AddOns/released/MSSQLServer/SQLServerconfiguration) |


### 3. Azure MSSQL using Splunk Add-on for Microsoft Cloud Services

#### App Installation

| App |  Search Head  | Indexer | Heavy Forwarder | UF / Deployment Server | Additional Details |
| ---- | ------ | ------------ | -------------- | -------------------- | ------ |
| [Splunk Add-on for Microsoft Cloud Services](https://splunkbase.splunk.com/app/3110/) | Required | - | Required | - | [Enable Audit Log](https://learn.microsoft.com/en-us/azure/mysql/single-server/concepts-audit-logs) & [Collect using Azure Event Hub input](https://splunk.github.io/splunk-add-on-for-microsoft-cloud-services/Configureeventhubs/) & * Use `mssql:audit:json` as sourcetype when creating input |
    

**Note** : Create an index named **mssql** or update the **cs_mssql** macro definition from Cyences app configuration page (**Cyences Settings > Cyences App Configuration > Products Setup**).

## Estimated Data Size

The license usage consumed by the Splunk Add-on for Microsoft SQL Server is based on the audit policy and database usage of your environment