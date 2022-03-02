---
layout: default
title: Troubleshooting
permalink: /troubleshooting/
nav_order: 5
has_children: false
---


# Troubleshooting [Admin]

## VPN dashboard is not loading even though cs_vpn_indexes has data.

![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/vpn_dashboard_not_loading.png?raw=true)

* Verify that the [Splunk Add-on for RWI - Executive Dashboard](https://splunkbase.splunk.com/app/5063/) is installed.

* Verify that the [Splunk CIM](https://splunkbase.splunk.com/app/1621/) is installed and the Authentication data model is accelerated.

* Verify that the CIM Authentication data model does not filter the VPN index (check the macro definition for `cim_Authentication_indexes`). 

## FortiGate VPN data:

* If you already have FortiGate VPN data ingested into Splunk, but you are unable to populate the VPN dashboard. 

* Follow the instructions under the **Data Onboarding > FortiGate VPN Logs** section. 

## Windows machines are not generating events about firewall changes.

In other words, Windows machines are not generating WinEventLog Event ID 4950. 

* Verify that the policy changes audit is enabled on your Windows machine. 

* If not, execute the command below with Administrator rights to enable the policy (or you can do it with a group policy instead). 

        auditpol.exe /set /category:"Policy Change" /subcategory:"MPSSVC rule-level Policy Change" /success:enable /failure:enable 

* Reference: [https://www.eventsentry.com/kb/429](https://www.eventsentry.com/kb/429)  

## Windows firewall was disabled but the alert did not generate in the Cyences app. 

* Verify that the Event is generated from a Windows machine through Event Viewer (search for Event ID 4950). 

* If you can see the generated events on Event Viewer, then the next step would be to verify that you are collecting the WinEventLogs in XML format. 

* If not, update the search query to: 

        `cs_wineventlog_security` EventCode=4950 Type="Enable Windows Defender Firewall" Value=No | rename Changed_Profile AS ProfileChanged, Type AS SettingType, Value as SettingValue | table host, EventCode, ProfileChanged, SettingType, SettingValue 
        | `cs_windows_firewall_disabled_filter` 

## The Tenable dashboard does not display every asset and vulnerability by default. 

Refer to the **App Installation and Configuration > Device Inventory** section for more information. 

## The Device Inventory dashboard does not display every device by default. 

Refer to the **App Installation and Configuration > Device Inventory** section for more information.

## Sysmon data action field issue

* Due to a conflict in props.conf for both the [Sysmon Add-on](https://splunkbase.splunk.com/app/1914/) and [Windows Add-on](https://splunkbase.splunk.com/app/742/), the **action** field is displaying incorrect values for Sysmon related data. 

* The correct value for the **action** field should be **created**, but instead we are receiving **unknown** as the value for every event coming from Sysmon EventCode=11. 

* Ransomware related alerts will not work until this issue is resolved. 

**How to check whether the issue is present in your environment or not?** 

1. Execute the search below in the Cyences App (from Cyences' navigation bar, click **Search**).

        | datamodel Endpoint Filesystem search strict_fields=false | search EventCode=11 | rename "Filesystem.tag" as tag, "Filesystem.action" as action
        | fields index, sourcetype, source, EventCode, EventDescription, action, tag, eventtype | table index, sourcetype, source, EventCode, EventDescription, action, tag, eventtype

2. Look for the **action** field in the table. The field value should be created. If not, follow the steps below to resolve the issue.

**How to fix the problem?**

1. From Splunk's navigation bar, go to **Settings > Data models**.

2. Search for the **Endpoint** data model and click on it. 

3. Click **Edit > Edit Acceleration**. 

4. Uncheck the **Accelerate** box, then click **Save**.

5. Under Datasets, click **Filesystem** (on the left-hand side). 

6. Under the **Calculated** fields section, click **Edit** for the **action** field. 

![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/filesystem_calculated_fields_action_edit.png?raw=true)

7. Your current configuration should look similar to this: 

        if(isnull(action) OR action="","unknown",action) 

8. Replace the above configuration/eval expression with the contents below: 

        case((source="WinEventLog:Microsoft-Windows-Sysmon/Operational" OR source="XmlWinEventLog:Microsoft-Windows-Sysmon/Operational") AND EventCode=="1", "allowed", (source="WinEventLog:Microsoft-Windows-Sysmon/Operational" OR source="XmlWinEventLog:Microsoft-Windows-Sysmon/Operational") AND EventCode=="12" AND EventType=="CreateKey", "created", (source="WinEventLog:Microsoft-Windows-Sysmon/Operational" OR source="XmlWinEventLog:Microsoft-Windows-Sysmon/Operational") AND EventCode=="12" AND (EventType=="DeleteKey" OR EventType=="DeleteValue"), "deleted", (source="WinEventLog:Microsoft-Windows-Sysmon/Operational" OR source="XmlWinEventLog:Microsoft-Windows-Sysmon/Operational") AND EventCode=="13" AND EventType=="SetValue", "modified", (source="WinEventLog:Microsoft-Windows-Sysmon/Operational" OR source="XmlWinEventLog:Microsoft-Windows-Sysmon/Operational") AND EventCode=="11", "created", isnull(action) OR action="", "unknown", 1==1, action)

9. Click **Save**.

10. Click **Edit > Edit Acceleration**.

11. Check the **Accelerate** box, then click **Save**.  

![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/endpoint_edit_acceleration.png?raw=true)

## Reducing False Positives for the "Authentication - Bruteforce Attempt for a User" Alert 

* Recently, we found false positives for this alert that are tied to sourcetype=linux:audit. 

* This will continue to occur in environments where the **Linux Auditd Technology Add-On (TA-linux_auditd)** is being used.  

**How to check whether the issue is present in your environment or not?**

1. Run the following search query and check the values present for the **Type** field: 

        index=* `cs_authentication_indexes` action="failure" user="*" tag=authentication 

2. If the field contains a value named **USER_CMD**, then follow the steps below to fix the issue. 

**How to resolve the issue?**

1. If **type=USER_CMD** is present, then go to **Settings > Event types**. 

2. Search for **auditd_authentication**. 

3. Click **auditd_authentication** (the default values should match with the following image). 

![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/auditd_authentication_before.png?raw=true)

4. Update the search string with the following contents, then click **Save**. 

![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/auditd_authentication_after.png?raw=true)