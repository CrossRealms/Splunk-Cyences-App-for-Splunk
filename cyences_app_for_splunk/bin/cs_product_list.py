def build_search_query(macro, by, values, more=''):
    SEARCH_QUERY_TEMPLATE = '''`{macro}` {more} | stats count by {by} 
| append [| makeresults | eval {by}=split("{values}", ","), count=0 | mvexpand {by}] 
| stats sum(count) as count by {by}'''
    return SEARCH_QUERY_TEMPLATE.format(macro=macro, by=by, values=values, more=more)


PRODUCTS = [
{
    'name': 'AWS',
    'macro_configurations': [
        {
            'macro_name': 'cs_aws',
            'label': 'AWS Data',
            'search': build_search_query(
                        macro='cs_aws',
                        by='sourcetype',
                        values='aws:cloudtrail'
                        ),
            'earliest_time': '-1d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Cisco IOS',
    'macro_configurations': [
        {
            'macro_name': 'cs_cisco_ios',
            'label': 'Cisco IOS Data',
            'search': build_search_query(
                        macro='cs_cisco_ios',
                        by='sourcetype',
                        values='cisco:ios'
                        ),
            'earliest_time': '-4h@h',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'CrowdStrike EventStream',
    'macro_configurations': [
        {
            'macro_name': 'cs_crowdstrike_eventstream',
            'label': 'CrowdStrike EventStream Data',
            'search': build_search_query(
                        macro='cs_crowdstrike_eventstream',
                        by='sourcetype',
                        values='CrowdStrike:Event:Streams:JSON'
                        ),
            'earliest_time': '-7d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'CrowdStrike Spotlight',
    'macro_configurations': [
        {
            'macro_name': 'cs_crowdstrike_vuln',
            'label': 'CrowdStrike Spotlight Data',
            'search': build_search_query(
                        macro='cs_crowdstrike_vuln',
                        by='sourcetype',
                        values='crowdstrike:spotlight:vulnerability'
                        ),
            'earliest_time': '-7d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'FortiGate',
    'macro_configurations': [
        {
            'macro_name': 'cs_fortigate',
            'label': 'FortiGate Data',
            'search': build_search_query(
                        macro='cs_fortigate',
                        by='sourcetype',
                        values='fortigate_event,fortigate_traffic,fortigate_utm'
                        ),
            'earliest_time': '-4h@h',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Google Workspace',
    'macro_configurations': [
        {
            'macro_name': 'cs_gws',
            'label': 'Google Workspace Data',
            'search': build_search_query(
                        macro='cs_gws',
                        by='sourcetype',
                        values='gws:reports:admin,gws:reports:login,gws:reports:groups_enterprise,gws:alerts,gws:reports:drive,gws:gmail'
                        ),
            'earliest_time': '-7d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Kaspersky',
    'macro_configurations': [
        {
            'macro_name': 'cs_kaspersky',
            'label': 'Kaspersky Data',
            'search': build_search_query(
                        macro='cs_kaspersky',
                        by='sourcetype',
                        values='kaspersky:leef,kaspersky:klaud,kaspersky:klprci,kaspersky:klbl,kaspersky:klsrv,kaspersky:gnrl,kaspersky:klnag'
                        ),
            'earliest_time': '-1d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Lansweeper',
    'macro_configurations': [
        {
            'macro_name': 'cs_lansweeper',
            'label': 'Lansweeper Data',
            'search': build_search_query(
                        macro='cs_lansweeper',
                        by='sourcetype',
                        values='lansweeper:asset:onprem,lansweeper:asset:v2'
                        ),
            'earliest_time': '-2d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Linux',
    'label': 'Linux/Unix',
    'macro_configurations': [
        {
            'macro_name': 'cs_linux',
            'label': 'Linux Data',
            'search': build_search_query(
                        macro='cs_linux',
                        by='sourcetype',
                        values='usersWithLoginPrivs,cyences:linux:groups,cyences:linux:users,sudousers,openPorts,interfaces,df,Unix:ListeningPorts,Unix:Service,Unix:UserAccounts,Unix:Version,Unix:Uptime,package,hardware,lsof,linux_secure,linux:audit,syslog',
                        more='sourcetype IN (usersWithLoginPrivs,cyences:linux:groups,cyences:linux:users,sudousers,openPorts,interfaces,df,Unix:ListeningPorts,Unix:Service,Unix:UserAccounts,Unix:Version,Unix:Uptime,package,hardware,lsof,linux_secure,linux:audit,syslog)'
                        ),
            'earliest_time': '-2d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Office 365',
    'macro_configurations': [
        {
            'macro_name': 'cs_o365',
            'label': 'Office 365 Data',
            'search': build_search_query(
                        macro='cs_o365',
                        by='sourcetype',
                        values='o365:management:activity,o365:service:healthIssue,o365:reporting:messagetrace'
                        ),
            'earliest_time': '-1d@d',
            'latest_time': 'now',
        },
        {
            'macro_name': 'cs_azure_securityscore',
            'label': 'Azure Security Score Data',
            'search': build_search_query(
                        macro='cs_azure_securityscore',
                        by='sourcetype',
                        values='GraphSecurity:Score',
                        more='sourcetype="GraphSecurity:Score"'
                        ),
            'earliest_time': '-2d@d',
            'latest_time': 'now',
        },
        {
            'macro_name': 'cs_azure',
            'label': 'Azure Active Directory Data',
            'search': build_search_query(
                        macro='cs_azure',
                        by='sourcetype',
                        values='azure:aad:audit'
                        ),
            'earliest_time': '-2d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Office 365 Defender ATP',
    'macro_configurations': [
        {
            'macro_name': 'cs_o365_defender_atp',
            'label': 'Microsoft 365 Defender ATP Data',
            'search': build_search_query(
                        macro='cs_o365_defender_atp',
                        by='sourcetype',
                        values='ms:defender:atp:alerts'
                        ),
            'earliest_time': '-7d@d',
            'latest_time': 'now',
        },
        {
            'macro_name': 'cs_o365_defender_atp_audit',
            'label': 'Microsoft 365 Defender ATP Audit Data',
            'search': build_search_query(
                        macro='cs_o365_defender_atp_audit',
                        by='sourcetype',
                        values='DefenderATPStatusLog'
                        ),
            'earliest_time': '-1d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Palo Alto',
    'macro_configurations': [
        {
            'macro_name': 'cs_palo',
            'label': 'Palo Alto Data',
            'search': build_search_query(
                        macro='cs_palo',
                        by='sourcetype',
                        values='pan:config,pan:globalprotect,pan:system,pan:threat,pan:traffic'
                        ),
            'earliest_time': '-1d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Qualys',
    'macro_configurations': [
        {
            'macro_name': 'cs_qualys',
            'label': 'Qualys Data',
            'search': build_search_query(
                        macro='cs_qualys',
                        by='sourcetype',
                        values='qualys:hostDetection'
                        ),
            'earliest_time': '-7d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Sophos Endpoint Protection',
    'macro_configurations': [
        {
            'macro_name': 'cs_sophos',
            'label': 'Sophos Endpoint Protection Data',
            'search': build_search_query(
                        macro='cs_sophos',
                        by='sourcetype',
                        values='sophos_events'
                        ),
            'earliest_time': '-7d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Sophos Firewall',
    'macro_configurations': [
        {
            'macro_name': 'cs_sophos_firewall',
            'label': 'Sophos Firewall Data',
            'search': build_search_query(
                        macro='cs_sophos_firewall',
                        by='sourcetype',
                        values='sophos:xg:firewall,sophos:xg:heartbeat,sophos:xg:system_health,sophos:xg:atp,sophos:xg:idp'
                        ),
            'earliest_time': '-1d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Sysmon',
    'macro_configurations': [
        {
            'macro_name': 'cs_sysmon',
            'label': 'Sysmon Data',
            'search': build_search_query(
                        macro='cs_sysmon',
                        by='source',
                        values='XmlWinEventLog:Microsoft-Windows-Sysmon/Operational'
                        ),
            'earliest_time': '-4h@h',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Tenable',
    'macro_configurations': [
        {
            'macro_name': 'cs_tenable',
            'label': 'Tenable Data',
            'search': build_search_query(
                        macro='cs_tenable',
                        by='sourcetype',
                        values='tenable:io:assets,tenable:io:plugin,tenable:io:vuln'
                        ),
            'earliest_time': '-7d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'VPN',
    'macro_configurations': [
        {
            'macro_name': 'cs_vpn_indexes',
            'label': 'VPN Data (indexes)',
            'search': '`cs_vpn_indexes` dest_category="vpn_auth" | stats count by index, sourcetype',
            'earliest_time': '-1d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Windows',
    'macro_configurations': [
        {
            'macro_name': 'cs_windows_idx',
            'label': 'Windows Data',
            'search': r'''`cs_windows_idx` | stats count | eval label="Windows" 
| append [| search `cs_windows_idx` sourcetype="*WinEventLog" source="*WinEventLog:Security" | stats count | eval label="Windows Security", search="sourcetype=\"*WinEventLog\" source=\"*WinEventLog:Security\""] 
| append [| search `cs_windows_idx` sourcetype="*WinEventLog" source="*WinEventLog:System" | stats count | eval label="Windows System", search="sourcetype=\"*WinEventLog\" source=\"*WinEventLog:System\""] 
| append [| search `cs_windows_idx` sourcetype="ActiveDirectory" | stats count | eval label="Windows AD", search="sourcetype=\"ActiveDirectory\""] 
| append [| search `cs_windows_idx` source=powershell sourcetype="MSAD:*:Health" | stats count | eval label="Windows AD Health", search="source=powershell sourcetype=\"MSAD:*:Health\""] 
| table label search count''',
            'earliest_time': '-1d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Windows Defender',
    'macro_configurations': [
        {
            'macro_name': 'cs_windows_defender',
            'label': 'Windows Defender Data',
            'search': build_search_query(
                        macro='cs_windows_defender',
                        by='source',
                        values='XmlWinEventLog:Defender'
                        ),
            'earliest_time': '-1d@d',
            'latest_time': 'now',
        }
    ]
},
]

PRODUCTS.sort(key=lambda x: x["name"].lower())
