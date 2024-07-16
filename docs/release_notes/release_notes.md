---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 5
has_children: true
---

# Release Notes


## Version 4.9.0 (July 2024)

* Added support for Nessus:Pro (Nessus Professional). Check the upgrade guide to onboard the logs.

* Added checkbox on alert page to prevent the alert state from being updated from the Cyences setup page. Check the upgrade guide for more details.

* Added the following panels for user login activity on the **Windows** dashboard.
    * Successful Login Events
    * Failed Login Attempts by User

* Added a separate alert for password expired events called **AD - Login Failure due to Password Expired** and filtered out the password expired events from authentication alerts.

* Added a section to configure the digest email configs on **Cyences Settings > Cyences App Configuration > Cyences Email Action Configuration**.

* Removed the following alerts as it contains static lookup which is not maintainable and causes false positives:
    * Email - Suspicious Subject or Attachment
    * Email - With Known Abuse Web Service Link
    * Ransomware - Endpoint Compromise - Malicious Package Found


* ### Enhancements

    * #### Sophos Endpoint data
        * Removed the Sophos UI configuration from Cyences configuration page & sophosinstancedetails custom command to fetch sophos endpoints.
        * Sophos device inventory alert will now support the 'sophos_endpoints' source. Check upgrade guide to collect the sophos endpoint logs.

    * #### Device Inventory dashboard
        * On **Possible Merge UUIDs (Devices) in Device Inventory** panel, added possible combinations of devices that can be merged based on hostname matching.
        * Added forwarder type information for the splunk devices to the **Device Inventory** table.
        * Added more details of the splunk devices like os, host, version, forwarder type to compare with other devices on **Possible Merge UUIDs (Devices) in Device Inventory** panel.
        * Added splunk devices panel on Intelligence dashboard.

    * #### Network Telemetry dashboard
        * Added filter to search port number.
        * Added reporting device IP information as well as vulnerability information for the vulnerable traffic.

    * Added the following panels to the **Vulnerability** dahboard:
        * Total Vulnerability Count By Severity
        * New Total Vulnerability Found Over Time

    * Enhanced the **O365 - OneDrive or SharePoint File Sharing with External User** and **O365 - OneDrive or SharePoint Link Accessed By External User** alerts to get accurate results.

    * Converted the detection time format as per the local timezone for **Windows Defender - Malware Detected** alert.

    * Filtered out events having the user "Not Available" from **Authentication - Bruteforce Attempt for a User** and **Authentication - Bruteforce Attempt from a Source** alerts.

    * Filtered out compliance related events from vulnerability alerts like **Asset Inventory - Vulnerability Lookup Gen** & **Device Inventory - Tenable Vuln**.

    * Added location information to the **Authentication activities** & **Radius Authentication activities** panels on the Intelligence dashboard.

    * Reduced the severity to "low" for **Authentication - Excessive Failed VPN Logins for a User** alert.

    * Reduced the severity of the **Email - Hourly Increase In Emails Over Baseline** alert.

    * Updated the upperbound value calculation for the **Network Compromise - Calculate UpperBound for Spike in Network Traffic** and **Network Compromise - Calculate UpperBound for Spike in Outbound Network Traffic** alerts.

    * Updated Splunk-python-sdk to the latest version.


## Upgrade Guide from 4.8.0 to 4.9.0

* To onboard the nessus pro logs, configure the [Nessus Professional Add-On for Splunk](https://splunkbase.splunk.com/app/7464/)

* Check all the cyences alerts and if the user wants to keep it enabled/disabled permanently then perform the steps mentioned [here]({{ site.baseurl }}/install_configure/alert_configuration/#how-to-disable-the-alert-state-changes-performed-from-the-cyences-setup-page)

* To onboard the sophos endpoint logs, configure the sophos endpoint input on [Sophos Central Add-on for Splunk](https://splunkbase.splunk.com/app/6186/)
