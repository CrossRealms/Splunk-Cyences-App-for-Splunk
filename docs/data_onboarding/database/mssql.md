---
layout: default
title: MSSQL
permalink: /data_onboarding/database/mssql/
nav_order: 1
parent: Database 
grand_parent: Data Onboarding
---

## **MSSQL Data**

* To utilize the MSSQL alerts and dashboards, ensure that the database server is configured to log DDL (Data Definition Language) command activities, privileged activities, and database authentication events.

## The Cyences app supports following data collection mechanisms:

### 1. Window Application log using Splunk Add-on for Microsoft Windows (Recommended)

#### App Installation

| App |  Search Head  | Indexer | Heavy Forwarder | UF / Deployment Server | Additional Details |
| ---- | ------ | ------------ | -------------- | -------------------- | ------ |
| [Splunk Add-on for Microsoft Windows](https://splunkbase.splunk.com/app/742/) | Required | - | - | Required (On DB server) | [Installation and Configuration Guide](https://www.ultimatewindowssecurity.com/sqlserver/auditlog/auditobject.aspx) |
| [Splunk Add-on for Microsoft SQL Server](https://splunkbase.splunk.com/app/2648/) | Required | - | Required | - | [Installation and Configuration Guide](https://docs.splunk.com/Documentation/AddOns/released/MSSQLServer/About) |


### 2. By reading Audit table using Splunk DB Connect app 

#### App Installation

| App |  Search Head  | Indexer | Heavy Forwarder | UF / Deployment Server | Additional Details |
| ---- | ------ | ------------ | -------------- | -------------------- | ------ |
| [Splunk DB Connect](https://splunkbase.splunk.com/app/2686/) | - | - | Required | - | Make sure to use `mssql:audit` sourcetype when configuring the data input. |
| [Splunk DBX Add-on for Microsoft SQL Server JDBC](https://splunkbase.splunk.com/app/6150/) | - | - | Required | - | This addon is DB Connect App's requirement for database driver availability of MSSQL. |
| [Splunk Add-on for Microsoft SQL Server](https://splunkbase.splunk.com/app/2648/) | Required | - | Required | - | [Installation and Configuration Guide](https://docs.splunk.com/Documentation/AddOns/released/MSSQLServer/SQLServerconfiguration) |

* [https://www.ultimatewindowssecurity.com/sqlserver/auditlog/auditobject.aspx](https://www.ultimatewindowssecurity.com/sqlserver/auditlog/auditobject.aspx)

* Details needed from DBA Team to configure identity and connection on DB connect app:
    * IP Address or FQDN of DB server
    * Port number for DB server
    * DB table name that contains Audit Trail data
    * Username & Password - Should have Readonly access to the Audit Trail Table in the DB
    * Default database name and Database name
    * Timezone on the database server

* While creating input on DB connect app, follow the below steps:
    1. Select the appropriate **Connection** form left hand side panel.
    2. Try to build query by selecting  Catalog, Schema and Table values from dropdown OR write query manually as mentioned below and run it.
        ```
        SELECT *
        FROM <<TABLE_NAME>>;
        ```
        * Replace **<<TABLE_NAME>>** with table name.
    3. Once query runs successfully, select Type "Rising" on right hand side panel. (This step is required to get only latest data).
    4. After selecting type "Rising", follow the all steps mentioned on the right hand side panel and run the search and click on "Next".
    5. Set appropriate index, source and sourcetype and execution frequency (interval after which input invokes everytime) and click on "Finish".
    
* Make sure that you have installed `Splunk_JDBC_mssql` Add-on [https://splunkbase.splunk.com/app/6150](https://splunkbase.splunk.com/app/6150) on your HF (where DB connect is installed). This is requirement for DB Connect App for database driver availability for Oracle.
* Make sure that you have installed `Splunk_TA_microsoft-sqlserver` Add-on [https://splunkbase.splunk.com/app/2648](https://splunkbase.splunk.com/app/2648) on both your HF (where DB connect is installed) & on the SH.
* Make sure to use `mssql:audit` sourcetype when configuring the data input in DB Connect App.

### 3. By reading ***.sqlaudit** files using Splunk DB Connect app.

#### App Installation

| App |  Search Head  | Indexer | Heavy Forwarder | UF / Deployment Server | Additional Details |
| ---- | ------ | ------------ | -------------- | -------------------- | ------ |
| [Splunk DB Connect](https://splunkbase.splunk.com/app/2686/) | - | - | Required | - | Make sure to use `mssql:audit` sourcetype when configuring the data input. |
| [Splunk DBX Add-on for Microsoft SQL Server JDBC](https://splunkbase.splunk.com/app/6150/) | - | - | Required | - | This addon is DB Connect App's requirement for database driver availability of MSSQL. |
| [Splunk Add-on for Microsoft SQL Server](https://splunkbase.splunk.com/app/2648/) | Required | - | Required | - | [Installation and Configuration Guide](https://docs.splunk.com/Documentation/AddOns/released/MSSQLServer/SQLServerconfiguration) |

* Audit logs stored in *.sqlaudit files are in binary format hence we can't read it using splunk monitor input and need to read it via DB connect app.

* Details needed from DBA Team to configure identity and connection on DB connect app:
    * IP Address or FQDN of DB server
    * Port number for DB server
    * Username & Password - Should have permission as mentioned [here](https://learn.microsoft.com/en-us/sql/relational-databases/system-functions/sys-fn-get-audit-file-transact-sql?view=sql-server-ver17&tabs=sqlserver#permissions)
    * Default Database name
    * Timezone on the database server
    * File path where *.sqlaudit files are located

* While creating input on DB connect app, follow the below steps:
    1. Select the appropriate **Connection** form left hand side panel.
    2. Add following search and run it.
        ```
        SELECT *
        FROM sys.fn_get_audit_file(
        '<<FILE_PATH>>',
        DEFAULT,
        DEFAULT
        )
        ```
        * Replace **<<FILE_PATH>>** with appropriate path where *.sqlaudit files are located.
    3. Once query runs successfully, select Type "Rising" on right hand side panel. (This step is required to get only latest data.)
    4. After selecting type "Rising", follow the all steps mentioned on the right hand side panel and run the search and click on "Next".
    5. Set appropriate index, source and sourcetype and execution frequency (interval after which input invokes everytime) and click on "Finish".

### 4. Azure MSSQL using Splunk Add-on for Microsoft Cloud Services

#### App Installation

| App |  Search Head  | Indexer | Heavy Forwarder | UF / Deployment Server | Additional Details |
| ---- | ------ | ------------ | -------------- | -------------------- | ------ |
| [Splunk Add-on for Microsoft Cloud Services](https://splunkbase.splunk.com/app/3110/) | Required | - | Required | - | [Enable Audit Log](https://learn.microsoft.com/en-us/azure/mysql/single-server/concepts-audit-logs) & [Collect using Azure Event Hub input](https://splunk.github.io/splunk-add-on-for-microsoft-cloud-services/Configureeventhubs/) & * Use `mssql:audit:json` as sourcetype when creating input |

**Note** : Create an index named **mssql** or update the **cs_mssql** macro definition from Cyences app configuration page (**Cyences Settings > Cyences App Configuration > Products Setup**).

## Estimated Data Size

The license usage consumed by the Splunk Add-on for Microsoft SQL Server is based on the audit policy and database usage of your environment
