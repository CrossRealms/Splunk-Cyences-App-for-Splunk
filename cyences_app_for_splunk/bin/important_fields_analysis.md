# Important Fields Analysis — Cyences App for Splunk

**Date:** 2026-04-01
**Analyzed files:**
- `cyences_app_for_splunk/bin/cs_product_list.py`
- `cyences_app_for_splunk/default/macros.conf`
- `cyences_app_for_splunk/default/savedsearches.conf`
- `cyences_app_for_splunk/default/data/ui/views/*.xml` (43 dashboard files)

---

## Methodology

Fields were extracted from every SPL query in dashboard panels and saved searches (alerts/reports) that references each product's macro or sourcetype/source. Fields were ranked by importance based on their SPL usage context:

| SPL Pattern | Importance | Reason |
|---|---|---|
| `stats ... by field` | **HIGH** | Group-by = field drives aggregation logic |
| `dedup field` | **HIGH** | Field identifies uniqueness of records |
| `search field=value` / `where field=` | **HIGH** | Field is used as a detection/filter condition |
| `lookup ... INPUTFIELD` | **HIGH** | Field is a join key in enrichment |
| `timechart ... by field` | **HIGH** | Chart dimension = field is displayed prominently |
| `\| table field` | MEDIUM | Field is shown in results panel |
| `\| rename field as alias` | MEDIUM | Field is normalized for display |
| `eval x=coalesce(field, ...)` | MEDIUM | Field is used for normalization |
| `values(field)` / `dc(field)` | MEDIUM | Field collected for aggregation display |
| `\| top field` | MEDIUM | Frequency analysis field |

Importance percentages in `important_fields` represent estimated field population rate (0–100).
Values set to **100** = field is almost always present (critical).
Values set to **80** = field is commonly present (important).
Values set to **60** = field is sometimes present (useful).

---

## Products — Status Summary

| Product | Macro(s) | Sourcetypes/Sources | Fields Status |
|---|---|---|---|
| CrowdStrike EventStream | cs_crowdstrike_eventstream | CrowdStrike:Event:Streams:JSON | ✅ Populated |
| Kaspersky | cs_kaspersky | kaspersky:leef/klaud/klprci/klbl/klsrv/gnrl/klnag | ✅ Populated |
| Office 365 Defender ATP | cs_o365_defender_atp | ms:defender:atp:alerts | ✅ Populated |
| Office 365 Defender ATP Audit | cs_o365_defender_atp_audit | DefenderATPStatusLog | ✅ Populated |
| Sophos Endpoint Protection | cs_sophos | sophos_events, sophos_endpoints | ✅ Populated |
| Trendmicro | cs_trendmicro | xdr_oat/audit/alerts_wb/detection | ✅ Populated (xdr_detection newly added) |
| Windows Defender | cs_windows_defender | *WinEventLog:…Windows Defender/Operational | ✅ Populated |
| AWS | cs_aws | aws:cloudtrail | ✅ Newly added |
| Google Workspace | cs_gws | gws:reports:admin/login/groups_enterprise/alerts/drive/gmail | ✅ Newly added |
| Office 365 | cs_o365 | o365:management:activity, o365:service:healthIssue, o365:reporting:messagetrace | ✅ Populated |
| Azure Security Score | cs_azure_securityscore | GraphSecurity:Score | ✅ Newly added |
| Azure AAD | cs_azure | azure:aad:audit, azure:aad:signin | ✅ Newly added |
| Email | cs_email_sources | ms:o365:reporting:messagetrace, o365:reporting:messagetrace, gws:gmail | ✅ Newly added |
| Network | cs_network_indexes | tag=network tag=communicate (CIM) | ⬜ Empty (CIM, dynamic sourcetypes) |
| Cisco IOS | cs_cisco_ios | cisco:ios | ✅ Newly added |
| FortiGate | cs_fortigate | fortigate_event/traffic/utm | ✅ Newly added |
| Palo Alto | cs_palo | pan:config/globalprotect/system/threat/traffic | ✅ Newly added |
| Sophos Firewall | cs_sophos_firewall | sophos:xg:firewall/heartbeat/system_health/atp/idp/event | ✅ Newly added |
| Sophos Firewall Events | cs_sophos (sophos_events) | sophos_events | ✅ Populated |
| Cisco Meraki | cs_cisco_meraki | meraki:securityappliances/organizationsecurity/audit/accesspoints/switches/networkdevices/devices | ✅ Newly added |
| F5 BIGIP | cs_f5_bigip | f5:bigip:syslog, f5:bigip:asm:syslog | ✅ Newly added |
| Imperva WAF | cs_imperva_waf | imperva:waf | ✅ Newly added |
| Imperva DAM | cs_imperva_dam | imperva:dam:alerts, imperva:dam:internal_audit | ✅ Newly added |
| Cloudflare | cs_cloudflare | cloudflare:json | ✅ Newly added |
| CrowdStrike Devices | cs_crowdstrike_devices | crowdstrike:device:json | ✅ Newly added |
| Vulnerability | cs_vulnerabilities_indexes | tag=vulnerability tag=report (CIM) | ⬜ Empty (CIM, dynamic sourcetypes) |
| CrowdStrike Spotlight | cs_crowdstrike_vuln | crowdstrike:spotlight:vulnerability | ✅ Newly added |
| Qualys | cs_qualys | qualys:hostDetection | ✅ Newly added |
| Tenable | cs_tenable | tenable:io:assets/vuln, tenable:sc:assets/vuln | ✅ Newly added |
| Nessus | cs_nessus | nessus:pro:vuln, nessus_json | ✅ Newly added |
| Sysmon | cs_sysmon | *WinEventLog:…Sysmon/Operational | ✅ Newly added |
| Windows | cs_windows_idx | WinEventLog:Security/Application/System + sourcetypes | ✅ Newly added |
| Windows AD | cs_windows_idx | WinEventLog:Directory Service + AD sourcetypes | ✅ Newly added |
| Windows DNS | cs_windows_idx | WinEventLog:DNS Server + DNS sourcetypes | ✅ Newly added |
| Lansweeper | cs_lansweeper | lansweeper:asset:* | ✅ Newly added |
| Linux | cs_linux | linux_secure, linux:audit, Unix:*, cyences:linux:* | ✅ Newly added |
| VPN | cs_vpn_indexes | dest_category=vpn_auth (CIM) | ⬜ Empty (CIM, dynamic sourcetypes) |
| Authentication | cs_authentication_indexes | tag=authentication (CIM) | ⬜ Empty (CIM, dynamic sourcetypes) |
| Radius Authentication | cs_radius_authentication_indexes | dest_category=radius_auth (CIM) | ⬜ Empty (CIM, dynamic sourcetypes) |
| MSSQL | cs_mssql | mssql:audit, mssql:audit:json | ✅ Populated + enhanced |
| Oracle | cs_oracle | oracle:audit:xml/unified/text | ✅ Populated |
| DUO | cs_duo | cisco:duo:authentication | ✅ Populated |
| Forcepoint DLP | cs_forcepoint_dlp | FP_DLP | ✅ Populated |

> **Note on CIM-based products (Network, VPN, Authentication, Radius, Vulnerability):** These products use Splunk's Common Information Model (CIM) and match data across many sourcetypes dynamically via index macros and tags. Important fields are defined at the sourcetype level for each individual product feeding that CIM model (e.g., Palo Alto fields cover pan:traffic which feeds Network/VPN). `important_fields` is left empty `{}` for the composite macro entries.

---

## Detailed Field Analysis by Product

---

### CrowdStrike EventStream
**Macro:** `cs_crowdstrike_eventstream`
**Sourcetype:** `CrowdStrike:Event:Streams:JSON`
**Macro definition:** `index=crowdstrike sourcetype="CrowdStrike:Event:Streams:JSON"`

| Field | Importance Perc | Importance | Context |
|---|---|---|---|
| ComputerName | 100 | HIGH | stats by, filter |
| action | 100 | HIGH | stats by, filter |
| DetectionName | 100 | HIGH | stats by, table |
| event.LocalIP | 100 | HIGH | stats by, filter |
| event.UserName | 100 | HIGH | stats by, filter |

**Additional fields found in dashboard queries (not yet in important_fields):**
- `event.Hostname` — coalesce with ComputerName, stats by
- `event.CommandLine` — dedup, table
- `event.MD5String`, `event.SHA256String` — table, filter
- `event.SeverityName`, `event.Tactic`, `event.Technique` — table
- `metadata.eventType` — filter
- `event.IncidentID`, `event.IncidentDescription` — dedup, table

---

### Kaspersky
**Macro:** `cs_kaspersky`
**Sourcetypes:** `kaspersky:leef`, `kaspersky:klaud`, `kaspersky:klprci`, `kaspersky:klbl`, `kaspersky:klsrv`, `kaspersky:gnrl`, `kaspersky:klnag`

| Sourcetype | Field | Importance Perc | Importance |
|---|---|---|---|
| kaspersky:leef | EVC_EV_DISP_HOST_NAME | 100 | HIGH |
| kaspersky:leef | EVC_EV_GROUP_NAME | 100 | HIGH |
| kaspersky:leef | EVC_EV_KL_PRODUCT_DISPVER | 100 | HIGH |
| kaspersky:leef | EVC_EV_KL_PRODUCT_NAME | 100 | HIGH |
| kaspersky:leef | EVC_EV_TASK_ID | 100 | HIGH |
| kaspersky:klaud | (same as leef) | | |
| kaspersky:klprci | (same as leef) | | |
| kaspersky:klbl | (same as leef) | | |
| kaspersky:klsrv | EVC_EV_DESC | 100 | HIGH |
| kaspersky:klsrv | EVC_EV_GROUP_NAME | 100 | HIGH |
| kaspersky:klsrv | EVC_EV_DISP_HOST_NAME | 100 | HIGH |
| kaspersky:klsrv | EVC_EV_KL_PRODUCT_DISPVER | 100 | HIGH |
| kaspersky:gnrl | EVC_EV_DESC | 100 | HIGH |
| kaspersky:gnrl | usrName | 100 | HIGH |
| kaspersky:gnrl | EVC_EV_GROUP_NAME | 100 | HIGH |
| kaspersky:gnrl | EVC_EV_EXT_DEV_ID | 100 | HIGH |
| kaspersky:gnrl | EVC_EV_TASK_NAME | 100 | HIGH |
| kaspersky:klnag | EVC_EV_APPL_NAME | 100 | HIGH |
| kaspersky:klnag | EVC_EV_DESC | 100 | HIGH |
| kaspersky:klnag | EVC_EV_DISP_HOST_NAME | 100 | HIGH |
| kaspersky:klnag | EVC_EV_GROUP_NAME | 100 | HIGH |
| kaspersky:klnag | EVC_EV_KL_PRODUCT_DISPVER | 100 | HIGH |

---

### Office 365 Defender ATP
**Macros:** `cs_o365_defender_atp`, `cs_o365_defender_atp_audit`

| Sourcetype | Field | Importance Perc | Importance | Context |
|---|---|---|---|---|
| ms:defender:atp:alerts | computerDnsName | 100 | HIGH | stats by, dedup |
| ms:defender:atp:alerts | category | 100 | HIGH | stats by, filter |
| ms:defender:atp:alerts | threatName | 100 | HIGH | stats by, table |
| ms:defender:atp:alerts | threatFamilyName | 100 | HIGH | table |
| ms:defender:atp:alerts | incidentId | 100 | HIGH | dedup, table |
| DefenderATPStatusLog | OnboardingState | 100 | HIGH | stats by, filter |
| DefenderATPStatusLog | status | 100 | HIGH | stats by |
| DefenderATPStatusLog | LastConnected | 100 | HIGH | table |
| DefenderATPStatusLog | host | 100 | HIGH | stats by |

---

### Sophos Endpoint Protection
**Macro:** `cs_sophos`
**Sourcetypes:** `sophos_events`, `sophos_endpoints`

| Sourcetype | Field | Importance Perc | Importance | Context |
|---|---|---|---|---|
| sophos_events | source_info.ip | 100 | HIGH | stats by, filter |
| sophos_events | user | 100 | HIGH | stats by |
| sophos_events | location | 100 | HIGH | stats by |
| sophos_events | type | 100 | HIGH | stats by, filter |
| sophos_events | dhost | 100 | HIGH | stats by |
| sophos_endpoints | id | 100 | HIGH | dedup |
| sophos_endpoints | tenant.id | 100 | HIGH | stats by |
| sophos_endpoints | type | 100 | HIGH | stats by, filter |
| sophos_endpoints | associatedPerson.viaLogin | 100 | HIGH | stats by |
| sophos_endpoints | health.overall | 100 | HIGH | stats by, filter |

---

### Trendmicro
**Macro:** `cs_trendmicro`
**Sourcetypes:** `xdr_oat`, `xdr_audit`, `xdr_alerts_wb`, `xdr_detection`

| Sourcetype | Field | Importance Perc | Importance |
|---|---|---|---|
| xdr_oat | filter.level | 100 | HIGH |
| xdr_oat | endpoint.name | 100 | HIGH |
| xdr_oat | filter.techniques{} | 100 | HIGH |
| xdr_oat | filter.tactics{} | 100 | HIGH |
| xdr_oat | detail.processFilePath | 100 | HIGH |
| xdr_audit | activity | 100 | HIGH |
| xdr_audit | role | 100 | HIGH |
| xdr_audit | user | 100 | HIGH |
| xdr_audit | category | 100 | HIGH |
| xdr_audit | loggedTime | 100 | HIGH |
| xdr_alerts_wb | incidentId | 100 | HIGH |
| xdr_alerts_wb | score | 100 | HIGH |
| xdr_alerts_wb | status | 100 | HIGH |
| xdr_alerts_wb | dest | 100 | HIGH |
| xdr_alerts_wb | app | 100 | HIGH |
| xdr_detection | endpointHostName | 100 | HIGH |
| xdr_detection | endpointIp | 100 | HIGH |
| xdr_detection | severityValue | 100 | HIGH |
| xdr_detection | filePath | 80 | MEDIUM |
| xdr_detection | objectHashId | 80 | MEDIUM |

> **Note:** `xdr_detection` was previously empty `{}` in the colleague's analysis. Fields added from inspection of Trendmicro detection event schema.

---

### Windows Defender
**Macro:** `cs_windows_defender`
**Source:** `*WinEventLog:Microsoft-Windows-Windows Defender/Operational`

| Field | Importance Perc | Importance | Context |
|---|---|---|---|
| EventCode | 100 | HIGH | filter (1116, 1117, 1006, etc.) |
| AVSignature_version | 20 | MEDIUM | table |
| Platform_version | 35 | MEDIUM | table |
| action | 2 | MEDIUM | filter |
| Threat_Name | 2 | MEDIUM | table |

---

### AWS
**Macro:** `cs_aws`
**Sourcetype:** `aws:cloudtrail`
**Macro definition:** `index IN (aws,summary) sourcetype="aws:cloudtrail"`

| Field | Importance Perc | Importance | Query Count | Context |
|---|---|---|---|---|
| user | 100 | HIGH | 20+ | stats by, dedup, filter |
| eventName | 100 | HIGH | 15+ | stats by, filter |
| src_ip | 100 | HIGH | 10+ | stats by, filter |
| errorCode | 100 | HIGH | 12+ | filter |
| aws_account_id | 100 | HIGH | 8+ | stats by, filter |
| eventSource | 100 | HIGH | 8+ | filter |

**Additional fields observed (not set as important_fields due to lower frequency):**
- `region` / `awsRegion` — stats by (8+ queries)
- `userAgent` — stats by (4+ queries)
- `additionalEventData.MFAUsed` — filter (3+ queries)
- `requestParameters.userName` / `requestParameters.groupName` — eval/filter (10+ queries)

---

### Google Workspace
**Macro:** `cs_gws`
**Sourcetypes:** `gws:reports:admin`, `gws:reports:login`, `gws:reports:groups_enterprise`, `gws:alerts`, `gws:reports:drive`, `gws:gmail`

| Sourcetype | Field | Importance Perc | Importance | Query Count | Context |
|---|---|---|---|---|---|
| gws:reports:admin | user | 100 | HIGH | 15+ | stats by, filter |
| gws:reports:admin | event.name | 100 | HIGH | 18+ | stats by, filter |
| gws:reports:admin | actor.email | 100 | HIGH | 8+ | stats by, dedup |
| gws:reports:admin | role_name | 100 | HIGH | 5+ | stats by, dedup |
| gws:reports:admin | action | 100 | HIGH | 8+ | stats by |
| gws:reports:login | user | 100 | HIGH | 15+ | stats by, filter |
| gws:reports:login | ipAddress | 100 | HIGH | 12+ | stats by, table |
| gws:reports:login | event.name | 100 | HIGH | 18+ | filter |
| gws:reports:login | action | 100 | HIGH | 8+ | stats by |
| gws:reports:login | login_challenge_method | 80 | MEDIUM | 4+ | stats by, values |
| gws:reports:groups_enterprise | user | 100 | HIGH | 15+ | stats by |
| gws:reports:groups_enterprise | event.name | 100 | HIGH | 18+ | filter |
| gws:reports:groups_enterprise | group_id | 100 | HIGH | 6+ | stats by |
| gws:reports:groups_enterprise | member_id | 100 | HIGH | 4+ | stats by |
| gws:reports:groups_enterprise | actor.email | 100 | HIGH | 8+ | stats by |
| gws:alerts | user | 100 | HIGH | 15+ | stats by |
| gws:alerts | alertId | 100 | HIGH | 2+ | dedup |
| gws:alerts | event.name | 100 | HIGH | 18+ | filter |
| gws:reports:drive | user | 100 | HIGH | 15+ | stats by |
| gws:reports:drive | event.name | 100 | HIGH | 18+ | filter |
| gws:reports:drive | actor.email | 100 | HIGH | 8+ | stats by |
| gws:gmail | user | 100 | HIGH | 15+ | stats by |
| gws:gmail | event.name | 100 | HIGH | 18+ | filter |

---

### Office 365
**Macro:** `cs_o365`
**Sourcetypes:** `o365:management:activity`, `o365:service:healthIssue`, `o365:reporting:messagetrace`

| Sourcetype | Field | Importance Perc | Importance | Context |
|---|---|---|---|---|
| o365:management:activity | Operation | 100 | HIGH | stats by, filter |
| o365:management:activity | app | 100 | HIGH | stats by |
| o365:management:activity | ClientIP | 40 | MEDIUM | stats by, filter |
| o365:management:activity | user | 100 | HIGH | stats by, filter |
| o365:management:activity | user_type | 95 | HIGH | filter, stats by |
| o365:service:healthIssue | status | 100 | HIGH | stats by |
| o365:service:healthIssue | service | 100 | HIGH | stats by |
| o365:service:healthIssue | Status | 100 | HIGH | filter |
| o365:service:healthIssue | WorkloadDisplayName | 100 | HIGH | stats by |
| o365:service:healthIssue | title | 100 | HIGH | table |
| o365:reporting:messagetrace | SenderAddress | 100 | HIGH | stats by, filter |
| o365:reporting:messagetrace | MessageId | 100 | HIGH | dc() count |
| o365:reporting:messagetrace | RecipientAddress | 100 | HIGH | stats by |
| o365:reporting:messagetrace | Subject | 100 | HIGH | values |
| o365:reporting:messagetrace | Status | 100 | HIGH | filter (spam) |

---

### Azure Security Score
**Macro:** `cs_azure_securityscore`
**Sourcetype:** `GraphSecurity:Score`

| Field | Importance Perc | Importance | Notes |
|---|---|---|---|
| currentScore | 100 | HIGH | The current compliance score value |
| maxScore | 100 | HIGH | Maximum achievable score |
| controlName | 100 | HIGH | Security control identifier |
| controlCategory | 80 | MEDIUM | Category of the security control |

---

### Azure AAD
**Macro:** `cs_azure`
**Sourcetypes:** `azure:aad:audit`, `azure:aad:signin`

| Sourcetype | Field | Importance Perc | Importance | Query Count | Context |
|---|---|---|---|---|---|
| azure:aad:audit | Actor | 100 | HIGH | 10+ | stats by, dedup |
| azure:aad:audit | Command | 100 | HIGH | 15+ | stats by, filter |
| azure:aad:audit | user | 100 | HIGH | 20+ | stats by, filter |
| azure:aad:audit | Target_DisplayName | 100 | HIGH | 6+ | stats by, filter |
| azure:aad:audit | modified_properties | 80 | MEDIUM | 8+ | table, eval |
| azure:aad:signin | user | 100 | HIGH | 20+ | stats by, filter |
| azure:aad:signin | ClientIP | 100 | HIGH | 12+ | stats by, filter |
| azure:aad:signin | status.errorCode | 100 | HIGH | 8+ | filter |
| azure:aad:signin | riskState | 80 | MEDIUM | 2+ | filter |
| azure:aad:signin | user_type | 80 | MEDIUM | 8+ | filter, stats by |

---

### Email
**Macro:** `cs_email_sources`
**Sourcetypes:** `ms:o365:reporting:messagetrace`, `o365:reporting:messagetrace`, `gws:gmail`

| Sourcetype | Field | Importance Perc | Importance | Query Count |
|---|---|---|---|---|
| ms:o365:reporting:messagetrace | SenderAddress | 100 | HIGH | 5+ |
| ms:o365:reporting:messagetrace | RecipientAddress | 100 | HIGH | 4+ |
| ms:o365:reporting:messagetrace | MessageId | 100 | HIGH | 4+ |
| ms:o365:reporting:messagetrace | Subject | 100 | HIGH | 3+ |
| ms:o365:reporting:messagetrace | Status | 100 | HIGH | 3+ |
| o365:reporting:messagetrace | SenderAddress | 100 | HIGH | 5+ |
| o365:reporting:messagetrace | RecipientAddress | 100 | HIGH | 4+ |
| o365:reporting:messagetrace | MessageId | 100 | HIGH | 4+ |
| o365:reporting:messagetrace | Subject | 100 | HIGH | 3+ |
| o365:reporting:messagetrace | Status | 100 | HIGH | 3+ |
| gws:gmail | SenderAddress | 100 | HIGH | 4+ |
| gws:gmail | RecipientAddress | 100 | HIGH | 4+ |
| gws:gmail | MessageId | 100 | HIGH | 3+ |
| gws:gmail | Subject | 100 | HIGH | 3+ |

---

### Cisco IOS
**Macro:** `cs_cisco_ios`
**Sourcetype:** `cisco:ios`

| Field | Importance Perc | Importance | Query Count | Context |
|---|---|---|---|---|
| host | 100 | HIGH | 3+ | stats by, filter |
| src | 100 | HIGH | 2+ | filter, dedup, stats by |
| dest | 100 | HIGH | 2+ | filter, dedup, stats by |
| mnemonic | 100 | HIGH | 1+ | filter (event classification) |
| message | 80 | MEDIUM | 2+ | table, filter |

---

### FortiGate
**Macro:** `cs_fortigate`
**Sourcetypes:** `fortigate_event`, `fortigate_traffic`, `fortigate_utm`

| Sourcetype | Field | Importance Perc | Importance | Query Count | Context |
|---|---|---|---|---|---|
| fortigate_event | dvc | 100 | HIGH | 8+ | stats by |
| fortigate_event | severity | 100 | HIGH | 8+ | stats by, filter |
| fortigate_event | subtype | 100 | HIGH | 6+ | stats by, filter |
| fortigate_event | action | 100 | HIGH | 6+ | stats by |
| fortigate_event | user | 100 | HIGH | 2+ | stats by |
| fortigate_traffic | src | 100 | HIGH | 8+ | stats by, filter |
| fortigate_traffic | dvc | 100 | HIGH | 8+ | stats by |
| fortigate_traffic | subtype | 100 | HIGH | 6+ | stats by |
| fortigate_traffic | action | 100 | HIGH | 6+ | stats by |
| fortigate_traffic | app | 100 | HIGH | 4+ | stats by, values |
| fortigate_traffic | rule | 100 | HIGH | 4+ | stats by |
| fortigate_utm | dvc | 100 | HIGH | 8+ | stats by |
| fortigate_utm | severity | 100 | HIGH | 8+ | stats by, filter |
| fortigate_utm | subtype | 100 | HIGH | 6+ | stats by, filter |
| fortigate_utm | action | 100 | HIGH | 6+ | stats by |
| fortigate_utm | app | 100 | HIGH | 4+ | stats by |
| fortigate_utm | signature | 80 | MEDIUM | 4+ | table |

---

### Palo Alto
**Macro:** `cs_palo`
**Sourcetypes:** `pan:config`, `pan:globalprotect`, `pan:system`, `pan:threat`, `pan:traffic`

| Sourcetype | Field | Importance Perc | Importance | Query Count | Context |
|---|---|---|---|---|---|
| pan:config | dvc | 100 | HIGH | 10+ | stats by |
| pan:config | user | 100 | HIGH | 3+ | stats by, table |
| pan:config | log_subtype | 100 | HIGH | 6+ | stats by, filter |
| pan:config | action | 100 | HIGH | 6+ | stats by |
| pan:globalprotect | dvc | 100 | HIGH | 10+ | stats by |
| pan:globalprotect | user | 100 | HIGH | 3+ | stats by |
| pan:globalprotect | log_subtype | 100 | HIGH | 6+ | filter |
| pan:globalprotect | action | 100 | HIGH | 6+ | stats by |
| pan:system | dvc | 100 | HIGH | 10+ | stats by |
| pan:system | severity | 100 | HIGH | 8+ | filter, stats by |
| pan:system | log_subtype | 100 | HIGH | 6+ | stats by |
| pan:system | signature | 100 | HIGH | 6+ | table |
| pan:system | action | 100 | HIGH | 6+ | stats by |
| pan:threat | dvc | 100 | HIGH | 10+ | stats by |
| pan:threat | severity | 100 | HIGH | 8+ | filter, stats by |
| pan:threat | log_subtype | 100 | HIGH | 6+ | stats by, filter |
| pan:threat | action | 100 | HIGH | 6+ | stats by |
| pan:threat | app | 100 | HIGH | 5+ | stats by |
| pan:threat | signature | 100 | HIGH | 6+ | table |
| pan:threat | threat_category | 80 | MEDIUM | 3+ | table |
| pan:traffic | dvc | 100 | HIGH | 10+ | stats by |
| pan:traffic | src_ip | 100 | HIGH | 8+ | stats by, filter |
| pan:traffic | log_subtype | 100 | HIGH | 6+ | stats by |
| pan:traffic | action | 100 | HIGH | 6+ | stats by |
| pan:traffic | app | 100 | HIGH | 5+ | stats by |
| pan:traffic | rule | 100 | HIGH | 4+ | stats by |

---

### Sophos Firewall
**Macro:** `cs_sophos_firewall`
**Sourcetypes:** `sophos:xg:firewall`, `sophos:xg:heartbeat`, `sophos:xg:system_health`, `sophos:xg:atp`, `sophos:xg:idp`, `sophos:xg:event`

| Sourcetype | Field | Importance Perc | Importance | Context |
|---|---|---|---|---|
| sophos:xg:firewall | host | 100 | HIGH | stats by, filter |
| sophos:xg:firewall | log_subtype | 100 | HIGH | stats by (renamed to action) |
| sophos:xg:firewall | src_ip | 100 | HIGH | stats by, table |
| sophos:xg:firewall | severity | 100 | HIGH | stats by, filter |
| sophos:xg:firewall | message | 80 | MEDIUM | table |
| sophos:xg:heartbeat | host | 100 | HIGH | stats by |
| sophos:xg:heartbeat | device_name | 100 | HIGH | stats by, table |
| sophos:xg:heartbeat | device_serial_id | 100 | HIGH | stats by, table |
| sophos:xg:heartbeat | device_model | 80 | MEDIUM | table |
| sophos:xg:system_health | host | 100 | HIGH | stats by |
| sophos:xg:system_health | device_name | 100 | HIGH | stats by, table |
| sophos:xg:system_health | device_serial_id | 100 | HIGH | stats by |
| sophos:xg:atp | src_ip | 100 | HIGH | stats by, table |
| sophos:xg:atp | user_name | 100 | HIGH | stats by, filter |
| sophos:xg:atp | malware | 100 | HIGH | stats by, fillnull |
| sophos:xg:atp | message | 100 | HIGH | stats by |
| sophos:xg:atp | severity | 80 | MEDIUM | filter |
| sophos:xg:idp | src_ip | 100 | HIGH | stats by, table |
| sophos:xg:idp | classification | 100 | HIGH | stats by, fillnull |
| sophos:xg:idp | log_subtype | 100 | HIGH | stats by |
| sophos:xg:idp | severity | 80 | MEDIUM | filter |
| sophos:xg:event | src_ip | 100 | HIGH | stats by |
| sophos:xg:event | user_name | 100 | HIGH | stats by, filter |
| sophos:xg:event | severity | 100 | HIGH | stats by, filter |
| sophos:xg:event | message | 100 | HIGH | table |

---

### Cisco Meraki
**Macro:** `cs_cisco_meraki`
**Sourcetypes:** `meraki:securityappliances`, `meraki:organizationsecurity`, `meraki:audit`, `meraki:accesspoints`, `meraki:switches`, `meraki:networkdevices`, `meraki:devices`

| Sourcetype | Field | Importance Perc | Importance | Query Count | Context |
|---|---|---|---|---|---|
| meraki:securityappliances | srcIp | 100 | HIGH | 2+ | stats by, filter |
| meraki:securityappliances | destIp | 100 | HIGH | 2+ | stats by |
| meraki:securityappliances | eventType | 100 | HIGH | 2+ | dedup, filter |
| meraki:securityappliances | priority | 80 | MEDIUM | 1+ | filter |
| meraki:organizationsecurity | srcIp | 100 | HIGH | 2+ | stats by, filter |
| meraki:organizationsecurity | destIp | 100 | HIGH | 2+ | stats by |
| meraki:organizationsecurity | eventType | 100 | HIGH | 2+ | dedup, filter |
| meraki:organizationsecurity | priority | 100 | HIGH | 1+ | filter |
| meraki:organizationsecurity | blocked | 80 | MEDIUM | 1+ | table |
| meraki:audit | adminEmail | 100 | HIGH | 2+ | dedup, stats by |
| meraki:audit | networkName | 100 | HIGH | 3+ | dedup, stats by |
| meraki:audit | page | 100 | HIGH | 2+ | dedup, stats by |
| meraki:audit | adminName | 80 | MEDIUM | 1+ | table |
| meraki:accesspoints | networkName | 100 | HIGH | — | key grouping field |
| meraki:switches | networkName | 100 | HIGH | — | key grouping field |
| meraki:networkdevices | networkName | 100 | HIGH | — | key grouping field |
| meraki:devices | networkName | 100 | HIGH | — | key grouping field |

---

### F5 BIGIP
**Macro:** `cs_f5_bigip`
**Sourcetypes:** `f5:bigip:syslog`, `f5:bigip:asm:syslog`

| Sourcetype | Field | Importance Perc | Importance | Query Count | Context |
|---|---|---|---|---|---|
| f5:bigip:syslog | ip_client | 100 | HIGH | 3+ | stats by, filter |
| f5:bigip:syslog | dest_ip | 100 | HIGH | 2+ | stats by |
| f5:bigip:syslog | severity | 100 | HIGH | 2+ | filter |
| f5:bigip:syslog | attack_type | 80 | MEDIUM | 3+ | top |
| f5:bigip:asm:syslog | attack_type | 100 | HIGH | 3+ | top, filter |
| f5:bigip:asm:syslog | ip_client | 100 | HIGH | 3+ | top, stats by |
| f5:bigip:asm:syslog | dest_ip | 100 | HIGH | 2+ | stats by, timechart |
| f5:bigip:asm:syslog | enforcement_action | 100 | HIGH | 2+ | timechart, filter |
| f5:bigip:asm:syslog | severity | 100 | HIGH | 2+ | filter, table |
| f5:bigip:asm:syslog | policy_name | 80 | MEDIUM | 1+ | timechart |

---

### Imperva WAF
**Macro:** `cs_imperva_waf`
**Sourcetype:** `imperva:waf`

| Field | Importance Perc | Importance | Query Count | Context |
|---|---|---|---|---|
| src | 100 | HIGH | 3+ | stats by, filter, dedup |
| severity | 100 | HIGH | 2+ | stats by, filter |
| category | 100 | HIGH | 2+ | stats by |
| action | 100 | HIGH | 1+ | filter |
| ccode | 80 | MEDIUM | 1+ | stats by (country code) |

---

### Imperva DAM
**Macro:** `cs_imperva_dam`
**Sourcetypes:** `imperva:dam:alerts`, `imperva:dam:internal_audit`

| Sourcetype | Field | Importance Perc | Importance | Query Count | Context |
|---|---|---|---|---|---|
| imperva:dam:alerts | src_ip | 100 | HIGH | 2+ | stats by, filter |
| imperva:dam:alerts | src | 100 | HIGH | 1+ | dedup, table |
| imperva:dam:alerts | dst | 100 | HIGH | 1+ | dedup, table |
| imperva:dam:alerts | Severity | 100 | HIGH | 1+ | table |
| imperva:dam:alerts | Policy | 80 | MEDIUM | 1+ | table |
| imperva:dam:alerts | ServerGroup | 80 | MEDIUM | 1+ | dedup, table |
| imperva:dam:internal_audit | suser | 100 | HIGH | 2+ | stats by, filter |
| imperva:dam:internal_audit | src_ip | 100 | HIGH | 2+ | stats by |
| imperva:dam:internal_audit | event_type | 100 | HIGH | 1+ | filter |

---

### Cloudflare
**Macro:** `cs_cloudflare`
**Sourcetype:** `cloudflare:json`

| Field | Importance Perc | Importance | Query Count | Context |
|---|---|---|---|---|
| ClientIP | 100 | HIGH | 2+ | stats by, filter |
| Action | 100 | HIGH | 1+ | eval, table |
| LeakedCredentialCheckResult | 80 | MEDIUM | 1+ | filter |
| ClientCountry | 80 | MEDIUM | 1+ | table |

---

### CrowdStrike Devices
**Macro:** `cs_crowdstrike_devices`
**Sourcetype:** `crowdstrike:device:json`

| Field | Importance Perc | Importance | Context |
|---|---|---|---|
| falcon_device.device_id | 100 | HIGH | dedup |
| falcon_device.hostname | 100 | HIGH | rename → host, table |
| falcon_device.local_ip | 100 | HIGH | rename → ip, table |
| falcon_device.status | 100 | HIGH | table, filter |
| falcon_device.platform_name | 80 | MEDIUM | table |

---

### CrowdStrike Spotlight
**Macro:** `cs_crowdstrike_vuln`
**Sourcetype:** `crowdstrike:spotlight:vulnerability`

| Field | Importance Perc | Importance | Context |
|---|---|---|---|
| severity | 100 | HIGH | stats by, filter |
| status | 100 | HIGH | stats by, filter |
| vul_id | 100 | HIGH | dedup, stats by |
| cve | 80 | MEDIUM | table |

---

### Qualys
**Macro:** `cs_qualys`
**Sourcetype:** `qualys:hostDetection`

| Field | Importance Perc | Importance | Context |
|---|---|---|---|
| severity | 100 | HIGH | stats by, filter |
| status | 100 | HIGH | stats by, filter |
| vul_id | 100 | HIGH | dedup, stats by |
| cve | 80 | MEDIUM | table |

---

### Tenable
**Macro:** `cs_tenable`
**Sourcetypes:** `tenable:io:assets`, `tenable:io:vuln`, `tenable:sc:assets`, `tenable:sc:vuln`

| Sourcetype | Field | Importance Perc | Importance |
|---|---|---|---|
| tenable:io:assets | severity | 100 | HIGH |
| tenable:io:assets | status | 100 | HIGH |
| tenable:io:vuln | severity | 100 | HIGH |
| tenable:io:vuln | status | 100 | HIGH |
| tenable:io:vuln | vul_id | 100 | HIGH |
| tenable:io:vuln | cve | 80 | MEDIUM |
| tenable:sc:assets | severity | 100 | HIGH |
| tenable:sc:assets | status | 100 | HIGH |
| tenable:sc:vuln | severity | 100 | HIGH |
| tenable:sc:vuln | status | 100 | HIGH |
| tenable:sc:vuln | vul_id | 100 | HIGH |
| tenable:sc:vuln | cve | 80 | MEDIUM |

---

### Nessus
**Macro:** `cs_nessus`
**Sourcetypes:** `nessus:pro:vuln`, `nessus_json`

| Sourcetype | Field | Importance Perc | Importance |
|---|---|---|---|
| nessus:pro:vuln | severity | 100 | HIGH |
| nessus:pro:vuln | status | 100 | HIGH |
| nessus:pro:vuln | vul_id | 100 | HIGH |
| nessus:pro:vuln | cve | 80 | MEDIUM |
| nessus_json | severity | 100 | HIGH |
| nessus_json | status | 100 | HIGH |
| nessus_json | vul_id | 100 | HIGH |

---

### Sysmon
**Macro:** `cs_sysmon`
**Source:** `*WinEventLog:Microsoft-Windows-Sysmon/Operational`

| Field | Importance Perc | Importance | Query Count | Context |
|---|---|---|---|---|
| EventCode | 100 | HIGH | 3+ | filter (1, 10, 11, 25) |
| Computer | 100 | HIGH | 3+ | stats by, filter, dedup |
| Image | 100 | HIGH | 2+ | dedup, stats by |
| User | 100 | HIGH | 2+ | stats by, table |
| CommandLine | 100 | HIGH | 2+ | filter, table |
| TargetFilename | 80 | MEDIUM | 2+ | dedup, table |

**Key EventCode values referenced in queries:**
- `1` — Process creation
- `10` — Process memory access (credential theft detection)
- `11` — File created
- `25` — Process tampering

---

### Windows
**Macro:** `cs_windows_idx`
**Sources:** `*WinEventLog:Application`, `*WinEventLog:Security`, `*WinEventLog:System`, `powershell://generate_windows_update_logs`
**Sourcetypes:** `Script:ListeningPorts`, `WinRegistry`, `WindowsFirewallStatus`, `windows:certstore:local`, `DhcpSrvLog`, `WindowsUpdateLog`, `WMI:Version`, `WMI:InstalledUpdates`

| Source / Sourcetype | Field | Importance Perc | Importance | Context |
|---|---|---|---|---|
| *WinEventLog:Security | user | 100 | HIGH | stats by, filter |
| *WinEventLog:Security | ComputerName | 100 | HIGH | stats by, filter, dedup |
| *WinEventLog:Security | EventCode | 100 | HIGH | filter (4624/4625/4688/5140…) |
| *WinEventLog:Security | Logon_Type | 100 | HIGH | stats by, filter |
| *WinEventLog:Security | Account_Domain | 80 | MEDIUM | stats by |
| *WinEventLog:Security | status | 80 | MEDIUM | stats by, filter |
| *WinEventLog:Application | host | 100 | HIGH | stats by |
| *WinEventLog:Application | EventCode | 100 | HIGH | filter |
| *WinEventLog:System | host | 100 | HIGH | stats by |
| *WinEventLog:System | EventCode | 100 | HIGH | filter |
| powershell://generate_windows_update_logs | host | 100 | HIGH | stats by |
| Script:ListeningPorts | host | 100 | HIGH | stats by, dedup |
| Script:ListeningPorts | transport | 100 | HIGH | stats by, dedup |
| Script:ListeningPorts | dest_port | 100 | HIGH | stats by, dedup |
| Script:ListeningPorts | appname | 100 | HIGH | stats by, dedup |
| WinRegistry | host | 100 | HIGH | stats by |
| WindowsFirewallStatus | host | 100 | HIGH | stats by, filter |
| WindowsFirewallStatus | Domain_Profile_Status | 100 | HIGH | filter, table |
| WindowsFirewallStatus | Private_Profile_Status | 80 | MEDIUM | table |
| WindowsFirewallStatus | Public_Profile_Status | 80 | MEDIUM | table |
| windows:certstore:local | host | 100 | HIGH | stats by |
| DhcpSrvLog | host | 100 | HIGH | stats by |
| WindowsUpdateLog | host | 100 | HIGH | stats by |
| WMI:Version | host | 100 | HIGH | stats by |
| WMI:InstalledUpdates | host | 100 | HIGH | stats by |

---

### Windows AD
**Macro:** `cs_windows_idx`
**Sources:** `WinEventLog:DFS Replication`, `WinEventLog:Directory Service`, `WinEventLog:Microsoft-AzureADPasswordProtection-DCAgent/Admin`
**Sourcetypes:** `MSAD:NT6:Netlogon`, `MSAD:NT6:Replication`, `MSAD:NT6:Health`, `MSAD:NT6:SiteInfo`, `windows:certstore:ca:issued`, `ActiveDirectory`

| Source / Sourcetype | Field | Importance Perc | Importance | Context |
|---|---|---|---|---|
| WinEventLog:DFS Replication | host | 100 | HIGH | stats by |
| WinEventLog:DFS Replication | EventCode | 100 | HIGH | filter |
| WinEventLog:Directory Service | host | 100 | HIGH | stats by |
| WinEventLog:Directory Service | EventCode | 100 | HIGH | filter |
| WinEventLog:Microsoft-AzureADPasswordProtection-DCAgent/Admin | host | 100 | HIGH | stats by |
| MSAD:NT6:Netlogon | host | 100 | HIGH | stats by |
| MSAD:NT6:Netlogon | session_id | 100 | HIGH | stats by |
| MSAD:NT6:Netlogon | src_user | 100 | HIGH | stats by, filter |
| MSAD:NT6:Replication | host | 100 | HIGH | stats by |
| MSAD:NT6:Health | host | 100 | HIGH | stats by |
| MSAD:NT6:SiteInfo | host | 100 | HIGH | stats by |
| windows:certstore:ca:issued | host | 100 | HIGH | stats by |
| ActiveDirectory | host | 100 | HIGH | stats by |
| ActiveDirectory | Account_Name | 100 | HIGH | stats by, filter |
| ActiveDirectory | msad_action | 100 | HIGH | stats by, table |
| ActiveDirectory | group_obj_nm | 100 | HIGH | stats by |
| ActiveDirectory | member | 80 | MEDIUM | stats by, eval |
| ActiveDirectory | AdminUser | 80 | MEDIUM | stats by, table |

---

### Windows DNS
**Macro:** `cs_windows_idx`
**Source:** `WinEventLog:DNS Server`
**Sourcetypes:** `MSAD:NT6:DNS`, `MSAD:NT6:DNS-Health`, `MSAD:NT6:DNS-Zone-Information`

| Source / Sourcetype | Field | Importance Perc | Importance | Context |
|---|---|---|---|---|
| WinEventLog:DNS Server | host | 100 | HIGH | stats by |
| WinEventLog:DNS Server | EventCode | 100 | HIGH | filter |
| WinEventLog:DNS Server | query_name | 100 | HIGH | stats by, table |
| WinEventLog:DNS Server | query_type | 100 | HIGH | stats by |
| WinEventLog:DNS Server | client_ip | 100 | HIGH | stats by, filter |
| WinEventLog:DNS Server | response_code | 80 | MEDIUM | stats by |
| MSAD:NT6:DNS | host | 100 | HIGH | stats by |
| MSAD:NT6:DNS | query_name | 100 | HIGH | stats by |
| MSAD:NT6:DNS | client_ip | 100 | HIGH | stats by |
| MSAD:NT6:DNS-Health | host | 100 | HIGH | stats by |
| MSAD:NT6:DNS-Zone-Information | host | 100 | HIGH | stats by |

---

### Lansweeper
**Macro:** `cs_lansweeper`
**Sourcetype:** `lansweeper:asset:*`

| Field | Importance Perc | Importance | Query Count | Context |
|---|---|---|---|---|
| Name | 100 | HIGH | 8+ | stats by, dedup, join |
| IPAddress | 100 | HIGH | 6+ | join, filter, table |
| AssetType | 100 | HIGH | 6+ | filter, table |
| State | 100 | HIGH | 5+ | filter, table |
| mac_address | 100 | HIGH | 4+ | join, table |
| OS | 80 | MEDIUM | 4+ | filter, table |
| Site | 80 | MEDIUM | 4+ | stats by, table |

---

### Linux
**Macro:** `cs_linux`
**Sourcetypes:** `usersWithLoginPrivs`, `cyences:linux:groups`, `cyences:linux:users`, `cyences:aix:groups`, `interfaces`, `df`, `Unix:ListeningPorts`, `Unix:Service`, `Unix:Version`, `Unix:Uptime`, `hardware`, `linux_secure`, `linux:audit`

| Sourcetype | Field | Importance Perc | Importance | Context |
|---|---|---|---|---|
| linux_secure | host | 100 | HIGH | stats by, filter |
| linux_secure | user | 100 | HIGH | stats by, filter |
| linux_secure | app | 100 | HIGH | stats by |
| linux_secure | src | 100 | HIGH | stats by, filter |
| linux_secure | action | 80 | MEDIUM | stats by |
| linux:audit | host | 100 | HIGH | stats by |
| linux:audit | user | 100 | HIGH | stats by, filter |
| linux:audit | comm | 100 | HIGH | stats by (process name) |
| linux:audit | app | 100 | HIGH | stats by |
| linux:audit | src | 80 | MEDIUM | stats by, filter |
| Unix:ListeningPorts | host | 100 | HIGH | stats by, dedup |
| Unix:ListeningPorts | dest_port | 100 | HIGH | stats by, dedup |
| Unix:ListeningPorts | transport | 100 | HIGH | stats by, dedup |
| Unix:ListeningPorts | app | 100 | HIGH | stats by |
| Unix:ListeningPorts | user | 80 | MEDIUM | stats by |
| Unix:Service | host | 100 | HIGH | stats by |
| Unix:Service | UNIT | 100 | HIGH | stats by, dedup |
| Unix:Service | status | 100 | HIGH | stats by, table |
| Unix:Version | host | 100 | HIGH | stats by |
| Unix:Version | os_name | 100 | HIGH | stats by, table |
| Unix:Version | os_version | 100 | HIGH | stats by, table |
| Unix:Uptime | host | 100 | HIGH | stats by |
| hardware | host | 100 | HIGH | stats by |
| cyences:linux:groups | host | 100 | HIGH | stats by |
| cyences:linux:groups | group_name | 100 | HIGH | stats by |
| cyences:linux:groups | users | 80 | MEDIUM | table, eval |
| cyences:linux:users | host | 100 | HIGH | stats by |
| cyences:linux:users | USERNAME | 100 | HIGH | stats by, filter |
| cyences:linux:users | UID | 100 | HIGH | stats by, dedup |
| cyences:linux:users | SUDOACCESS | 80 | MEDIUM | filter, table |
| usersWithLoginPrivs | host | 100 | HIGH | stats by |
| usersWithLoginPrivs | user | 100 | HIGH | stats by |
| interfaces | host | 100 | HIGH | stats by |
| interfaces | Name | 100 | HIGH | stats by, table |
| df | host | 100 | HIGH | stats by |
| df | Filesystem | 100 | HIGH | stats by, table |
| df | MountedOn | 80 | MEDIUM | table |
| cyences:aix:groups | host | 100 | HIGH | stats by |
| cyences:aix:groups | group_name | 100 | HIGH | stats by |

---

### MSSQL
**Macro:** `cs_mssql`
**Sourcetypes:** `mssql:audit`, `mssql:audit:json`

| Sourcetype | Field | Importance Perc | Importance | Context |
|---|---|---|---|---|
| mssql:audit | database_principal_name | 100 | HIGH | stats by, table (db_user) |
| mssql:audit | server_principal_name | 100 | HIGH | stats by, filter (user) |
| mssql:audit | client_ip | 100 | HIGH | table (→ src) |
| mssql:audit | application_name | 100 | HIGH | table (→ client_app) |
| mssql:audit | server_instance_name | 100 | HIGH | table (→ db_host) |
| mssql:audit | action_name | 100 | HIGH | stats by, filter |
| mssql:audit | class_type_desc | 80 | MEDIUM | stats by |
| mssql:audit:json | database_principal_name | 100 | HIGH | stats by, table |
| mssql:audit:json | server_principal_name | 100 | HIGH | stats by, filter |
| mssql:audit:json | client_ip | 100 | HIGH | table |
| mssql:audit:json | application_name | 100 | HIGH | table |
| mssql:audit:json | server_instance_name | 100 | HIGH | table |
| mssql:audit:json | action_name | 100 | HIGH | stats by, filter |
| mssql:audit:json | class_type_desc | 80 | MEDIUM | stats by |

---

### Oracle
**Macro:** `cs_oracle`
**Sourcetypes:** `oracle:audit:xml`, `oracle:audit:unified`, `oracle:audit:text`

| Sourcetype | Field | Importance Perc | Importance | Context |
|---|---|---|---|---|
| oracle:audit:xml | ACTION_NAME | 100 | HIGH | stats by, filter |
| oracle:audit:xml | database_name | 100 | HIGH | stats by, table |
| oracle:audit:xml | DBUSERNAME | 100 | HIGH | stats by, filter |
| oracle:audit:xml | SQL_TEXT | 100 | HIGH | table (→ statement) |
| oracle:audit:xml | RETURN_CODE | 100 | HIGH | eval (→ status) |
| oracle:audit:unified | vendor_action | 100 | HIGH | stats by, filter |
| oracle:audit:unified | DB_UNIQUE_NAME | 100 | HIGH | table (→ database_name) |
| oracle:audit:unified | DB_User | 100 | HIGH | stats by |
| oracle:audit:unified | command | 100 | HIGH | table (→ statement) |
| oracle:audit:unified | RETURNCODE | 100 | HIGH | eval (→ status) |
| oracle:audit:text | ACTION_NAME | 100 | HIGH | stats by, filter |
| oracle:audit:text | database_name | 100 | HIGH | stats by |
| oracle:audit:text | DBUSERNAME | 100 | HIGH | stats by, filter |
| oracle:audit:text | SQL_TEXT | 100 | HIGH | table |
| oracle:audit:text | RETURN_CODE | 100 | HIGH | eval |

---

### DUO
**Macro:** `cs_duo`
**Sourcetype:** `cisco:duo:authentication`

| Field | Importance Perc | Importance | Context |
|---|---|---|---|
| user | 100 | HIGH | filter, stats by |
| result | 100 | HIGH | filter (FAILURE, FRAUD, ERROR) |
| reason | 100 | HIGH | filter (Locked out) |
| factor | 100 | HIGH | stats by, table |
| integration | 100 | HIGH | stats by |

---

### Forcepoint DLP
**Macro:** `cs_forcepoint_dlp`
**Sourcetype:** `FP_DLP`

| Field | Importance Perc | Importance | Context |
|---|---|---|---|
| SourceIP | 100 | HIGH | stats by, filter |
| Destination | 100 | HIGH | stats by |
| User | 100 | HIGH | stats by, filter |
| Action | 100 | HIGH | stats by, filter |
| MessageDetails | 100 | HIGH | table |

---

## Cross-Product Field Patterns

### Most Universally Important Fields

| Field | Products | Typical Context |
|---|---|---|
| `host` | Windows, Linux, Sysmon, Cisco IOS, Sophos Firewall, Lansweeper, FortiGate | stats by, dedup, join |
| `user` | AWS, GWS, O365, Azure, Linux, Auth, MSSQL, Oracle, DUO, Kaspersky, Sophos | stats by, filter |
| `severity` | FortiGate, Palo Alto, Sophos Firewall, F5, Imperva WAF, Vulnerability tools | filter, stats by |
| `action` | FortiGate, Palo Alto, AWS, O365, Sophos, Auth/VPN, Forcepoint | stats by, filter |
| `EventCode` | Windows, Windows AD, Windows DNS, Sysmon | filter |
| `src_ip` | FortiGate, Palo Alto, Sophos, F5, Imperva, Meraki | stats by, filter |

### CIM-Based Products (fields vary by underlying sourcetype)

- **Network** (`cs_network_indexes`): tag=network, tag=communicate — fields from Palo Alto, FortiGate, Sophos, etc.
- **VPN** (`cs_vpn_indexes`): dest_category=vpn_auth — CIM Authentication model
- **Authentication** (`cs_authentication_indexes`): tag=authentication — CIM Authentication model
- **Radius Authentication** (`cs_radius_authentication_indexes`): dest_category=radius_auth — CIM Authentication model
- **Vulnerability** (`cs_vulnerabilities_indexes`): tag=vulnerability, tag=report — CIM Vulnerability model

These are intentionally left with `important_fields: {}` since their field importance depends on which underlying sourcetypes are feeding each CIM model in the customer's environment.
