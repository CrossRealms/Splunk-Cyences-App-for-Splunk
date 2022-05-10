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
    * Added filters for paths to reduce false positives for both report `Ransomware - Calculate UpperBound for Spike in File Writes` and alert `Ransomware - Spike in File Writes`.

    * Increased minimun file write limit from 20 to 3000 to reduce the false positive.

    * Added `top5_file_extension`, `avg`, and `stdev` field in the `Ransomware - Spike in File Writes` alert.

    * Added `parent_process_path` field in the `Ransomware - Endpoint Compromise - Fake Windows Processes` alert.

* ### Palo Alto Firewall System alert and dashboard improvement
    * Excluded the License related events from the `Palo Alto High System Alert` alert and `System Events` panel in the Palo Alto dashboard.
    * Added a new `License Events` panel to show all Palo Alto license-related events.

* ### Palo Alto Firewall DNS Sinkhole improvement
    * Added `url` field in the `Palo Alto DNS Sinkhole` alert and forensic searches.

* ### DNS Tracker dashboard improvement.
    * Added hostname details for any IP field to easily identify the machine based on the information available in Device Inventory lookup.
    * Separated panels to show information about `actual hosts making DNS requests` vs `DNS servers making DNS requests to other internal DNS servers` vs `DNS servers requesting external DNS servers`. 
        * This will give more clarity about who is the actual requester, how well each internal DNS server is performing, any malicious behavior by a client/source, lots of malicious/incorrect responses received from a specific external DNS server, etc.


* ### Bug Fixes
    * Fixed a drilldown issue for the `Antivirus` panel in the `Overview` dashboard.

    * Fixed the token name to populate the `PowerShell Script Execution Error` panel of `Microsoft 365 Defender ATP Audit` dashboard.

    * Fixed the `Linux/Unix` dashboard to show results when some fields in the data are not present.

* ### Cloud Compatibility Issue Fixed
   * Fixed the cloud vetting issue to make addon cloud compatible by validating that the App only makes requests to secure HTTPS URLs.


## Upgrade Guide from 2.0.0 to 2.1.0

* No upgrade guide needed.
