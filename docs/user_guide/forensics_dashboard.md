---
layout: default
title: Forensics Dashboard 
permalink: /user_guide/forensics_dashboard/
nav_order: 3
parent: User Guide
---

# Forensics 
The Forensics dashboard is designed to give security engineers insightful information associated with their security investigation. This is mainly a drilldown dashboard from the Overview dashboard, but it is also useful for finding additional information about the various kinds of alerts Cyences has to offer and their matching descriptions. Select any alert from the dropdown and the Forensics dashboard will provide more information about the alert.

![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/forensics_dashboard.png?raw=true)

## Forensics Dashboard Features:

### Notable Events
* The events displayed within this section highlight events that are linked to the selected alert. 
* They help determine what the problem is and where the problem has occurred.  
* It contains valuable information that provides more insight about the matter such as: destination, file extensions, file names, file paths, IP addresses, sourcetypes, and much more.  

## All Contributing Events
* The remainder of events that aren't classified as notable events will fall under this category. 

## Compromised Systems
* This section outlines which systems the issue was detected on and includes relevant information like which hosts or sourcetypes have been affected.  
* The count column informs Splunk users as to how many events are tied to the compromised system(s). 
* Splunk users can also drilldown to see relevant _raw events on the search page.  

## Signature 
* The signature details who or what could be causing the security concern and which file names or source IP addresses are involved in the matter. 
* The count column is also applied here. 
* Splunk users can also drilldown to see relevant _raw events on the search page. 

## Alert Details 
* Describes what the purpose of the alert is, the severity of the alert, and scheduling details. 
* This panel is useful if you are new to the Cyences App and want more information about the security use case or alert. 

**Note**: The Forensics dashboard helps with investigating a security issue or to complete a forensics report, as it shows pertinent information about the compromised systems and signatures involved in their respective panels. If a Splunk user drilldowns on either of these dashboard panels, it'll provide additional details about what other events were involved or where a similar problem is present. A broader way to access these events is to drilldown from the Alert Details dashboard panel to view the activity that was responsible for triggering the alert. For example, the following screenshot highlights a security breach.

![alt](https://github.com/VatsalJagani/Splunk-Cyences-App-for-Splunk/blob/master/docs/assets/forensics_dashboard_drilldown.png?raw=true) 