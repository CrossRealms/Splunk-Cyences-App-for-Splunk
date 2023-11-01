---
layout: default
title: Google Workspace
permalink: /data_onboarding/cloud_tenancies/gws/
nav_order: 2
parent: Cloud Tenancies 
grand_parent: Data Onboarding
---

## **Google Workspace Data**

The "Splunk Add-on for Google Workspace" App is required to collect Google Workspace data. 

Splunkbase Download: 
[https://splunkbase.splunk.com/app/5556/](https://splunkbase.splunk.com/app/5556/) 


## How to Install and Configure the Splunk Add-on for Google Workspace: 

1. Install the Add-on on the Heavy Forwarder. 

2. Configure the Add-on on the Heavy Forwarder. 
    * Configure the Application. 
    * Create an index named **google** or update the macro **cs_gws** in the Cyences app (**Settings > Configuration**). 

3. Install the Add-on on the Search Head.

The following Apps/Add-ons should not be installed on a Search Head if the Cyences app is already present due to authentication tagging issues:
* G Suite For Splunk - 
[https://splunkbase.splunk.com/app/3791/](https://splunkbase.splunk.com/app/3791/) 
* TA for G Suite App - 
[https://splunkbase.splunk.com/app/3792/](https://splunkbase.splunk.com/app/3792/) 


## Estimated Data Size

The license usage consumed by this Add-On is based on the size of your environment, the number of users, and the amount of user activity taking place in your environment.


## Google Side Configuration

Configure your Google Cloud Service account, this guide will configure reports for Google Workspace Activity Reports, Gmail Headers, Google Workspace User Identity Report, and Google Workspace Alert Center.

### Prerequisites

Create a new project in your GCP deployment

* Open [https://console.cloud.google.com/](https://console.cloud.google.com/) then go to menu and choose IAM & Admin -> Manage Resources

    ![alt]({{ site.baseurl }}/assets/gws_configuration_1.png)
 
* Click on the Create Project.

    ![alt]({{ site.baseurl }}/assets/gws_configuration_2.png)

* Add your project name, and choose your organization > Create

    ![alt]({{ site.baseurl }}/assets/gws_configuration_3.png)

### Setup Google Workspace Credentials

Perform the following steps to set up Google Workspace Credentials on your Google Console:

* Navigate to [https://console.cloud.google.com/](https://console.cloud.google.com/), and log into the Google account where you want to set up your Google Workspace credentials.

    ![alt]({{ site.baseurl }}/assets/gws_configuration_4.png)

#### Enable APIs

1. Navigate to APIs & Services > Library.
 
    ![alt]({{ site.baseurl }}/assets/gws_configuration_5.png)

2. Search for the Admin SDK API. Select and enable it (Making calls to this API lets you view and manage resources such as user, groups, and audit and usage reports of your domain).
 
    ![alt]({{ site.baseurl }}/assets/gws_configuration_6.png)

3. Search for the BigQuery API. Select and enable it.
 
    ![alt]({{ site.baseurl }}/assets/gws_configuration_7.png)

4. Search for the Google Workspace Alert Center API. Select and enable it.

    ![alt]({{ site.baseurl }}/assets/gws_configuration_8.png)


#### Create Service Account

1. Navigate to APIs & Services > Credentials. 
2. Click Create Credentials > Service account. 
3. Only name your service account and click create and continue. All the other steps are optional (we don’t usually fill them). Click Done.

    ![alt]({{ site.baseurl }}/assets/gws_configuration_9.png)

4. In Credentials, navigate to your new service account name, and click on your new service account name.

    ![alt]({{ site.baseurl }}/assets/gws_configuration_10.png)

5. Navigate to Keys tab, Click Add Key > Create new key > JSON key type > Create.

    ![alt]({{ site.baseurl }}/assets/gws_configuration_11.png)

    *Save the JSON key in your device.

6. In the Service account details page for your new service account, navigate to the Unique ID, and copy the contents of the Unique ID.
 
    ![alt]({{ site.baseurl }}/assets/gws_configuration_12.png)

7. Navigate to [https://admin.google.com/](https://admin.google.com/), login to your administrator Google account.
8. On the Google Admin home page, navigate to Security > Access and data control > API controls.
9. In API Controls, navigate to Domain wide delegation, and click Manage Domain Wide Delegation.
 
    ![alt]({{ site.baseurl }}/assets/gws_configuration_13.png)

10. In Manage Domain Wide Delegation, click Add new to add a new client ID.
11. In the Client ID field, paste the Unique ID that you copied from the Service account details page.
12. In the OAuth scopes (comma-delimited) field, add the [https://www.googleapis.com/auth/admin.reports.audit.readonly](https://www.googleapis.com/auth/admin.reports.audit.readonly) This gives read-only access when retrieving an activity report.
[https://www.googleapis.com/auth/admin.directory.user.readonly](https://www.googleapis.com/auth/admin.directory.user.readonly) This gives read-only access when retrieving the user identity
[https://www.googleapis.com/auth/apps.alerts](https://www.googleapis.com/auth/apps.alerts) This gives read-only access when retrieving an activity report.
13. Click Authorize.

    ![alt]({{ site.baseurl }}/assets/gws_configuration_14.png)
 

#### For Gmail Logs

You can collect gmail logs only if you have one of these subscriptions (Enterprise Standard, Enterprise Plus, Education standard or Education plus)

1. Go back to the "Details" tab and copy the service account email.
 
    ![alt]({{ site.baseurl }}/assets/gws_configuration_15.png)

2. Navigate to IAM.
 
    ![alt]({{ site.baseurl }}/assets/gws_configuration_16.png)

3. Click Grant Access > Paste service account email into new principals’ field.
4. Click Select a role > Type BigQuery Job User > Click on BigQuery Job User > Save

    ![alt]({{ site.baseurl }}/assets/gws_configuration_17.png)

5. Navigate to [https://admin.google.com/](https://admin.google.com/)
6. Go to Apps > Google Workspace > Gmail
7. Click Setup > Click Email Logs in BigQuery > Click Enable
8. In Select the BigQuery project to use find a Google Cloud project where service account was created
9. You can optionally specify a different name of the dataset under Specify the name for a new dataset to be created within your project. Later you can configure this dataset name during the input configuration steps > Save
10. Navigate to [https://console.cloud.google.com/](https://console.cloud.google.com/)
11. Search for BigQuery in the search bar and click BigQuery.
12. On the left side of the screen, you should see the Google Cloud project, click on it.
13. Click on View actions > Open (three dots) near gmail_logs_dataset. By default, you may see something else depending on the name you chose in the previous step.
14. Click on Sharing > Permissions.
15. Click on Add principal.
16. Paste service account email into new principals’ field > Select a role > Type BigQuery Data Viewer > Click on BigQuery Data Viewer > Click save.


#### For the User Identity

1. Navigate to [https://admin.google.com/](https://admin.google.com/)
2. In the Admin console, navigate to Menu > Directory > Directory settings > Click Sharing settings > Contact sharing > Check the Enable contact sharing box
 
    ![alt]({{ site.baseurl }}/assets/gws_configuration_18.png)

3. Select which email addresses to include in the Directory > Show all email addresses—Show the user's primary email address and any alias addresses.
4. Select which profiles appear in the Directory in Contacts on the web. If you have many domain profiles or external contacts, show only certain types of profiles to find addresses faster and help the Directory load faster > Show only domain profiles — Include profiles of internal users (people with addresses in your domains) and exclude any external contacts. Note: This setting still shows domain shared contacts in autocomplete and search
5. Click on the Save.

    ![alt]({{ site.baseurl }}/assets/gws_configuration_19.png)
 

**Notes:**
1. Sometimes you will need to create a JSON key again, just make sure to delete the older JSON key.
2. Make sure the user has Super Admin privileges, and he is the owner of the service account.
3. You can create a service account for every report, and you can include them in the same service account as I did in this document.
