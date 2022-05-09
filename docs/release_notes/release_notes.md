---
layout: default
title: Release Notes
permalink: /release_notes/
nav_order: 3
has_children: true
---

# Release Notes

## Version 2.1.0 (May 2022)


* ### Ransomware alert improvement
    * Ignored below file paths in the `Ransomware - Calculate UpperBound for Spike in File Writes` and `Ransomware - Spike in File Writes` alerts to reduce the false positive.
        * `C:\Program Files\*`
        * `C:\Program Files (x86)\*`
        * `C:\Windows\Temp\*`
        * `C:\ProgramData\Tenable\Nessus\nessus\plugins\*`
        * `C:\Windows\ServiceProfiles\LocalService\AppData\Local\Temp\*`
        * `C:\Users\*\AppData\Local\Temp\*`

    * Increased minimun file write limit from 20 to 3000 to reduce the false positive.

    * Added `top5_file_extension`, `avg`, and `stdev` field in the `Ransomware - Spike in File Writes` alert.

    * Added `parent_process_path` field in the `Ransomware - Endpoint Compromise - Fake Windows Processes` alert.

* ### Palo Alto Firewall System alert and dashboard improvement
    * Excluded the License related events from the `Palo Alto High System Alert` and `System Events` panel. 
    * Addded new `License Events` panel to show the all license events.

* ### Palo Alto Firewall DNS Sinkhole improvement
    * Added `url` field in the `Palo Alto DNS Sinkhole` alert and forensic searches.

* ### DNS Tracker dashboard improvement.
    * Added hostname detail in the Requester field to easily identify the machine.
    * Added new panels to show information on DNS to DNS traffic.

* ### Bug Fixes and Typos
    * Fixed a drilldown issue for the `Antivirus` panel in the `Overview` dashboard.

    * Fixed the token name to populate the `PowerShell Script Execution Error` panel of `Microsoft 365 Defender ATP Audit` dashboard.

    * Fixed the `Linux/Unix` dashboard to show results with null field values when "All" is selected in the filter. 

    * Fixed the cloud vetting issue to make addon cloud compatible


## Upgrade Guide from 2.0.0 to 2.1.0

* No upgrade guide needed.
