---
layout: default
title: Installation
permalink: /install_configure/installation/
nav_order: 2
parent: Installation/Configuration
---

# Installation 

## App Installation

The Cyences App needs to be installed on the Search Head only.

1. From the Splunk Web home screen, click the gear icon next to **Apps**. 

2. Click on **Browse more apps**. 

3. Search for **Cyences App for Splunk** and click **Install**. 

4. Create an index named **cyences**. 
    * Navigate to **Settings > Indexes**. 
    * Click on **New Index**. 
    * Enter **cyences** for the Index Name. 
    * Click **Save**.

6. Restart Splunk after installing all dependencies. 

## Dependency Installation on Search Head

There are dependent apps which also need to be installed on the Search Head along with the Cyences app itself (follow the same steps mentioned in the previous section to install the apps).

User can check the dependent app list and installtion status on the **Cyences Settings > Cyences App Configuration > Cyences Dependencies** section.

| App Name | Splunkbase Link | What is this used for? |
|--------|--------|-------------|
| Splunk Common Information Model (CIM) | [https://splunkbase.splunk.com/app/1621/](https://splunkbase.splunk.com/app/1621/) | For data models 
| Flow Map Viz | [https://splunkbase.splunk.com/app/4657](https://splunkbase.splunk.com/app/4657) | For internal network traffic visualization |

* Note - Additional add-ons are necessary depending on the data present in your Splunk environment. For example, if there is Windows data present, then you need to install and configure the Splunk Add-on for Windows. Please visit the Data Onboarding section for more information. You can check the dependent app installation status for each products under the **App Dependencies** table on **Cyences Settings > Cyences App Configuration > Products Setup** section.
