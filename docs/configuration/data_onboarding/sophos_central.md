---
layout: default
title: Sophos Central
permalink: /configuration/data_onboarding/sophos_central/
nav_order: 5
parent: Data Onboarding
grand_parent: Configuration
---


## **Sophos Central Events**

The Sophos Central Splunk Add-on is required to collect Sophos Central data. 

Splunkbase Download:
[https://splunkbase.splunk.com/app/4647/](https://splunkbase.splunk.com/app/4647/) 
 
Installation and Configuration Guide:
[https://splunkbase.splunk.com/app/4647/#/details](https://splunkbase.splunk.com/app/4647/#/details) 

## How to Install and Configure the Sophos Central Add-on: 

1. Install the Add-on on the Heavy Forwarder. 

2. Configure the Add-on on the Heavy Forwarder. 
    * Configure the Application. 
    * Create an index named **Sophos** or update the macro definition in the Cyences app (**Settings > Configuration**). 

3. Install the Add-on on the Search Head. 

## Estimated Data Size  
The Sophos Central Add-on consumes around 60-80MB of license usage per day. 

The total amount of data varies based on the size of your organization (our calculations are based on organizations with around thirty users and a few workstations). 

## **Sophos Central Metadata through API**
Cyences version 1.6 utilizes Sophos Central API to collect information about Sophos endpoints. The Sophos Central API data is being used in a number of places throughout the Cyences app, including the Device Inventory dashboard. 

## Sophos Central API Configuration

1. Login to Sophos Central Parner portal. 

2. Click **Settings & Policies**. 

3. Click on the **API Credentials link**.

4. Add a new set of credentials. 

5. Provide a name and description for your credential set, then click **Add**. 

6. Click the **Copy** button at the end of the Client ID.  

7. Click **Show Client Secret**. 

8. Refer to the Sophos Central documentation link below for further assistance.  
    *[https://developer.sophos.com/getting-started](https://developer.sophos.com/getting-started) 

## Sophos Central API Configuration for Cyences  

1. From Cyences' navigation bar, go to **Settings > Configuration**. 

2. Enter the Client ID and Client Secret for **Sophos Endpoint API Configuration**.

3. Click **Save**.

    ![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/CY-283-cyences-doc-migration/docs/assets/sophos_endpoint_api_config.png?raw=true)

## How to verify the Sophos Central API configuration: 

1. From Cyences' navigation bar, click **Search**.

2. Run the following search query: 
    * | sophosinstancedetails all_endpoints=True 

3. If the search results return/s any errors, then there is something wrong with the configuration. 

4. A successful configuration will display the total number of events with no errors.  

    ![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/CY-283-cyences-doc-migration/docs/assets/sophos_endpoint_api_config.png?raw=true)

## Estimated Data Size
Data collected from Sophos will be stored in a KV Store lookup, so it will not affect your Splunk license. 