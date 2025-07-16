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

2. By reading Audit table using Splunk DB Connect app 
    * [https://docs.splunk.com/Documentation/AddOns/released/MSSQLServer/SQLServerconfiguration](https://docs.splunk.com/Documentation/AddOns/released/MSSQLServer/SQLServerconfiguration)
    * [https://www.ultimatewindowssecurity.com/sqlserver/auditlog/auditobject.aspx](https://www.ultimatewindowssecurity.com/sqlserver/auditlog/auditobject.aspx)

    * Details needed from DBA Team to configure identity and connection on DB connect app:
        * IP Address or FQDN of DB server
        * Port number for DB server
        * DB table name that contains Audit Trail data
        * Username & Password - Should have Readonly access to the Audit Trail Table in the DB
        * Default database name and Database name
        * Timezone on the database server


* Make sure that you have installed `Splunk_JDBC_mssql` Add-on [https://splunkbase.splunk.com/app/6150](https://splunkbase.splunk.com/app/6150) on your HF (where DB connect is installed). This is requirement for DB Connect App for database driver availability for Oracle.
* Make sure that you have installed `Splunk_TA_microsoft-sqlserver` Add-on [https://splunkbase.splunk.com/app/2648](https://splunkbase.splunk.com/app/2648) on both your HF (where DB connect is installed) & on the SH.
* Make sure to use `mssql:audit` sourcetype when configuring the data input in DB Connect App.

3. By reading ***.sqlaudit** files using Splunk DB Connect app.
    * Audit logs stored in *.sqlaudit files are in binary format hence we can't read it using splunk monitor input and need to read it via DB connect app.

    * Details needed from DBA Team to configure identity and connection on DB connect app:
        * IP Address or FQDN of DB server
        * Port number for DB server
        * Username & Password - Should have permission as mentioned [here](https://learn.microsoft.com/en-us/sql/relational-databases/system-functions/sys-fn-get-audit-file-transact-sql?view=sql-server-ver17&tabs=sqlserver#permissions)
        * Default Database name
        * Timezone on the database server
        * File path where *.sqlaudit files are located

    **NOTE:** While creating input on DB connect app, use the following search to read the logs from *.sqlaudit files.

    ```
    SELECT *
    FROM sys.fn_get_audit_file(
    '<<FILE_PATH>>',
    DEFAULT,
    DEFAULT
    )
    ```
    * Replace **<<FILE_PATH>>** with appropriate path where *.sqlaudit files are located.

* Make sure that you have installed `Splunk_JDBC_mssql` Add-on [https://splunkbase.splunk.com/app/6150](https://splunkbase.splunk.com/app/6150) on your HF (where DB connect is installed). This is requirement for DB Connect App for database driver availability for Oracle.
* Make sure that you have installed `Splunk_TA_microsoft-sqlserver` Add-on [https://splunkbase.splunk.com/app/2648](https://splunkbase.splunk.com/app/2648) on both your HF (where DB connect is installed) & on the SH.
* Make sure to use `mssql:audit` sourcetype when configuring the data input in DB Connect App.


4. Azure MSSQL using Splunk Add-on for Microsoft Cloud Services

    1. Enable Audit Log: [https://learn.microsoft.com/en-us/azure/mysql/single-server/concepts-audit-logs](https://learn.microsoft.com/en-us/azure/mysql/single-server/concepts-audit-logs)

    2. Collect using Azure Event Hub Input: [https://splunk.github.io/splunk-add-on-for-microsoft-cloud-services/Configureeventhubs/](https://splunk.github.io/splunk-add-on-for-microsoft-cloud-services/Configureeventhubs/)

        * Use `mssql:audit:json` as sourcetype when creating input


**Note:** Use both index=**mssql** for data collection or update the macro definition for `cs_mssql` (**Settings > Configuration**). 


## Estimated Data Size

The license usage consumed by the Splunk Add-on for Microsoft SQL Server is based on the audit policy and database usage of your environment