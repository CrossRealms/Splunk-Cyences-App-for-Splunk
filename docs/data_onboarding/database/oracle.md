---
layout: default
title: Oracle
permalink: /data_onboarding/database/oracle/
nav_order: 2
parent: Database
grand_parent: Data Onboarding
---

## **Oracle Data**

## The Cyences app supports following data collection mechanisms:

### 1. Unified auditing using Splunk DB Connect app (Recommended)

#### App Installation

| App |  Search Head  | Indexer | Heavy Forwarder | UF / Deployment Server | Additional Details |
| ---- | ------ | ------------ | -------------- | -------------------- | ------ |
| [Splunk DB Connect](https://splunkbase.splunk.com/app/2686/) | - | - | Required | - | [Installation and Configuration Guide](https://docs.splunk.com/Documentation/AddOns/released/Oracle/ConfigureSplunkDBConnectinputsv3) & Make sure to use `oracle:audit:unified` sourcetype when configuring the data input. |
| [Splunk DBX Add-on for Oracle JDBC](https://splunkbase.splunk.com/app/6151/) | - | - | Required | - | This addon is DB Connect App's requirement for database driver availability of Oracle. |
| [Splunk Add-on for Oracle Database](https://splunkbase.splunk.com/app/1910/) | Required | - | Required | - | [Installation and Configuration Guide](https://docs.splunk.com/Documentation/AddOns/latest/Oracle/About) |

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


### 2. XML logs using File monitoring

#### App Installation

| App |  Search Head  | Indexer | Heavy Forwarder | UF / Deployment Server | Additional Details |
| ---- | ------ | ------------ | -------------- | -------------------- | ------ |
| [Splunk Add-on for Oracle Database](https://splunkbase.splunk.com/app/1910/) | Required | - | Required | Required (On DB server) | [Installation and Configuration Guide](https://docs.splunk.com/Documentation/AddOns/released/Oracle/Configuremonitorinputs) |

* Details needed from DBA Team:
    * XML Log files path on the DB server.

* Important sourcetypes to be collected
    * oracle:audit:xml
    * oracle:audit:unified

**Note** : Create an index named **oracle** or update the **cs_oracle** macro definition from Cyences app configuration page (**Cyences Settings > Cyences App Configuration > Products Setup**).


## Estimated Data Size

The license usage consumed by the Splunk Add-on for Oracle Database is based on the audit policy and database usage of your environment