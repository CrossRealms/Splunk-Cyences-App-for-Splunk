---
layout: default
title: Oracle
permalink: /data_onboarding/database/oracle/
nav_order: 2
parent: Database
grand_parent: Data Onboarding
---

## **Oracle Data**

The Splunk Add-on for Oracle Database is required for the field extraction.

Splunkbase Download: 
[https://splunkbase.splunk.com/app/1910](https://splunkbase.splunk.com/app/1910)

Installation and Configuration Guide: 
[https://docs.splunk.com/Documentation/AddOns/latest/Oracle/About](https://docs.splunk.com/Documentation/AddOns/latest/Oracle/About)

The Cyences App has support following data collection mechanisms

1) Unified auditing using Splunk DB Connect app (Recommended)
* [https://docs.splunk.com/Documentation/AddOns/released/Oracle/ConfigureSplunkDBConnectinputsv3](https://docs.splunk.com/Documentation/AddOns/released/Oracle/ConfigureSplunkDBConnectinputsv3)
* Visit the official oracle documentation for more information:
    * [Desupport of Traditional Auditing](https://oracle-base.com/articles/23c/auditing-enhancements-23c)
    * [Monitoring Database Activity with Auditing](https://docs.oracle.com/en/database/oracle/oracle-database/23/dbseg/part_6.html)
    * [Oracle Database Auditing Best practices](https://www.oracle.com/docs/tech/dbsec/oracle-database-auditing-security-and-perf-best-practices.pdf)

* Details needed from DBA Team:
    * IP Address or FQDN of DB server
    * Port number for DB server
    * Unified Audit Trail DB table name
    * Username & Password - Should have Readonly access to the Audit Trail Table
    * Default database name and Database name
    * Timezone on the database server


2) XML logs using File monitoring
* [https://docs.splunk.com/Documentation/AddOns/released/Oracle/Configuremonitorinputs](https://docs.splunk.com/Documentation/AddOns/released/Oracle/Configuremonitorinputs)

* Details needed from DBA Team:
    * XML Log files path on the DB server.
    * And you need to install Splunk UF on the DB server in order to monitor the oracle XML log files.


**Note:** Use both index=**oracle** for data collection or update the macro definition for `cs_oracle` (**Settings > Configuration**). 


## Estimated Data Size

The license usage consumed by the Splunk Add-on for Oracle Database is based on the audit policy and database usage of your environment