WINDOWS_SOURCES = '"*WinEventLog:Application","*WinEventLog:Security","*WinEventLog:System","powershell://generate_windows_update_logs"'
WINDOWS_SOURCE_TYPES = '"Script:ListeningPorts","WinRegistry","WindowsFirewallStatus","windows:certstore:local","DhcpSrvLog","WindowsUpdateLog"'
WINDOWS_AD_SOURCES = '"WinEventLog:DFS Replication","WinEventLog:Directory Service","WinEventLog:Microsoft-AzureADPasswordProtection-DCAgent/Admin"'
WINDOWS_AD_SOURCE_TYPES = '"MSAD:NT6:Netlogon","MSAD:NT6:Replication","MSAD:NT6:Health","MSAD:NT6:SiteInfo","windows:certstore:ca:issued","ActiveDirectory"'
WINDOWS_DNS_SOURCES = '"WinEventLog:DNS Server"'
WINDOWS_DNS_SOURCE_TYPES = '"MSAD:NT6:DNS","MSAD:NT6:DNS-Health","MSAD:NT6:DNS-Zone-Information"'


def build_search_query(macro, by, values, first_call=True):
    search = ""
    values = values.split(",")

    for index in range(len(values)):
        if index > 0 or first_call is False:
            search += " | append ["
        search += """| tstats count where `{macro}` {by} IN ("{value}") | eval {by}="{value}" | rename {by} as sources | table sources count""".format(
            macro=macro, by=by, value=values[index].strip('"')
        )
        if index > 0 or first_call is False:
            search += "]"
    return search


def build_host_reviewer_search(by, values):
    return "| tstats count where index=* {by} IN ({values}) by {by} host | rename {by} as sources".format(
        by=by, values=values
    )


def build_metadata_count_search(by, values):
    return "{by} IN ({values}) OR ".format(by=by, values=values)


def build_source_reviewer_search(by, values, first_call=True):
    search = ""
    values = values.split(",")

    for index in range(len(values)):
        if index > 0 or first_call is False:
            search += " | append ["
        search += """| tstats values(host) as hosts where index=* {by} IN ("{value}") by {by} index
        | stats count values(*) as * dc(hosts) as host_count by {by}
        | stats count values(*) as * sum(host_count) as host_count
        | eval {by}=if(count>0,{by},"{value}")
        | rename {by} as sources""".format(
            by=by, value=values[index].strip('"')
        )
        if index > 0 or first_call is False:
            search += "]"
    return search


PRODUCTS = [
    {
        "name": "CrowdStrike EventStream",
        "macro_configurations": [
            {
                "macro_name": "cs_crowdstrike_eventstream",
                "label": "CrowdStrike EventStream Data",
                "search_by": "sourcetype",
                "search_values": "CrowdStrike:Event:Streams:JSON",
                "earliest_time": "-7d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "Kaspersky",
        "macro_configurations": [
            {
                "macro_name": "cs_kaspersky",
                "label": "Kaspersky Data",
                "search_by": "sourcetype",
                "search_values": "kaspersky:leef,kaspersky:klaud,kaspersky:klprci,kaspersky:klbl,kaspersky:klsrv,kaspersky:gnrl,kaspersky:klnag",
                "earliest_time": "-1d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "MSSQL",
        "macro_configurations": [
            {
                "macro_name": "cs_mssql",
                "label": "MSSQL Data",
                "search_by": "sourcetype",
                "search_values": "mssql:audit,mssql:audit:json",
                "earliest_time": "-1d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "Oracle",
        "macro_configurations": [
            {
                "macro_name": "cs_oracle",
                "label": "Oracle Data",
                "search_by": "sourcetype",
                "search_values": "oracle:audit:xml",
                "earliest_time": "-1d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "Office 365 Defender ATP",
        "macro_configurations": [
            {
                "macro_name": "cs_o365_defender_atp",
                "label": "Microsoft 365 Defender ATP Data",
                "search_by": "sourcetype",
                "search_values": "ms:defender:atp:alerts",
                "earliest_time": "-7d@d",
                "latest_time": "now",
            },
            {
                "macro_name": "cs_o365_defender_atp_audit",
                "label": "Microsoft 365 Defender ATP Audit Data",
                "search_by": "sourcetype",
                "search_values": "DefenderATPStatusLog",
                "earliest_time": "-1d@d",
                "latest_time": "now",
            },
        ],
    },
    {
        "name": "Sophos Endpoint Protection",
        "macro_configurations": [
            {
                "macro_name": "cs_sophos",
                "label": "Sophos Endpoint Protection Data",
                "search_by": "sourcetype",
                "search_values": "sophos_events",
                "earliest_time": "-7d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "Windows Defender",
        "macro_configurations": [
            {
                "macro_name": "cs_windows_defender",
                "label": "Windows Defender Data",
                "search_by": "source",
                "search_values": '"*WinEventLog:Microsoft-Windows-Windows Defender/Operational"',
                "earliest_time": "-1d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "AWS",
        "macro_configurations": [
            {
                "macro_name": "cs_aws",
                "label": "AWS Data",
                "search_by": "sourcetype",
                "search_values": "aws:cloudtrail",
                "earliest_time": "-1d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "Google Workspace",
        "macro_configurations": [
            {
                "macro_name": "cs_gws",
                "label": "Google Workspace Data",
                "search_by": "sourcetype",
                "search_values": "gws:reports:admin,gws:reports:login,gws:reports:groups_enterprise,gws:alerts,gws:reports:drive,gws:gmail",
                "earliest_time": "-7d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "Office 365",
        "macro_configurations": [
            {
                "macro_name": "cs_o365",
                "label": "Office 365 Data",
                "search_by": "sourcetype",
                "search_values": "o365:management:activity,o365:service:healthIssue,o365:reporting:messagetrace",
                "earliest_time": "-1d@d",
                "latest_time": "now",
            },
            {
                "macro_name": "cs_azure_securityscore",
                "label": "Azure Security Score Data",
                "search_by": "sourcetype",
                "search_values": "GraphSecurity:Score",
                "earliest_time": "-2d@d",
                "latest_time": "now",
            },
            {
                "macro_name": "cs_azure",
                "label": "Azure Active Directory Data",
                "search_by": "sourcetype",
                "search_values": "azure:aad:audit",
                "earliest_time": "-2d@d",
                "latest_time": "now",
            },
        ],
    },
    {
        "name": "Cisco IOS",
        "macro_configurations": [
            {
                "macro_name": "cs_cisco_ios",
                "label": "Cisco IOS Data",
                "search_by": "sourcetype",
                "search_values": "cisco:ios",
                "earliest_time": "-4h@h",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "FortiGate",
        "macro_configurations": [
            {
                "macro_name": "cs_fortigate",
                "label": "FortiGate Data",
                "search_by": "sourcetype",
                "search_values": "fortigate_event,fortigate_traffic,fortigate_utm",
                "earliest_time": "-4h@h",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "Palo Alto",
        "macro_configurations": [
            {
                "macro_name": "cs_palo",
                "label": "Palo Alto Data",
                "search_by": "sourcetype",
                "search_values": "pan:config,pan:globalprotect,pan:system,pan:threat,pan:traffic",
                "earliest_time": "-1d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "Sophos Firewall",
        "macro_configurations": [
            {
                "macro_name": "cs_sophos_firewall",
                "label": "Sophos Firewall Data",
                "search_by": "sourcetype",
                "search_values": "sophos:xg:firewall,sophos:xg:heartbeat,sophos:xg:system_health,sophos:xg:atp,sophos:xg:idp",
                "earliest_time": "-1d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "CrowdStrike Devices",
        "macro_configurations": [
            {
                "macro_name": "cs_crowdstrike_devices",
                "label": "CrowdStrike Devices Data",
                "search_by": "sourcetype",
                "search_values": "crowdstrike:device:json",
                "earliest_time": "-3d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "CrowdStrike Spotlight",
        "macro_configurations": [
            {
                "macro_name": "cs_crowdstrike_vuln",
                "label": "CrowdStrike Spotlight Data",
                "search_by": "sourcetype",
                "search_values": "crowdstrike:spotlight:vulnerability",
                "earliest_time": "-7d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "Qualys",
        "macro_configurations": [
            {
                "macro_name": "cs_qualys",
                "label": "Qualys Data",
                "search_by": "sourcetype",
                "search_values": "qualys:hostDetection",
                "earliest_time": "-7d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "Tenable",
        "macro_configurations": [
            {
                "macro_name": "cs_tenable",
                "label": "Tenable Data",
                "search_by": "sourcetype",
                "search_values": "tenable:io:assets,tenable:io:plugin,tenable:io:vuln",
                "earliest_time": "-7d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "Sysmon",
        "macro_configurations": [
            {
                "macro_name": "cs_sysmon",
                "label": "Sysmon Data",
                "search_by": "source",
                "search_values": "*WinEventLog:Microsoft-Windows-Sysmon/Operational",
                "earliest_time": "-4h@h",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "Windows",
        "metadata_count_search": """| tstats count where index=* sourcetype IN ({windows_sourcetypes}) OR source IN ({windows_sources}) """.format(
            windows_sourcetypes=WINDOWS_SOURCE_TYPES,
            windows_sources=WINDOWS_SOURCES,
        ),
        "macro_configurations": [
            {
                "macro_name": "cs_windows_idx",
                "label": "Windows Data",
                "search": build_search_query(macro="cs_windows_idx", by="source", values=WINDOWS_SOURCES) + build_search_query(macro="cs_windows_idx", by="sourcetype", values=WINDOWS_SOURCE_TYPES, first_call=False),
                "host_reviewer_search": build_host_reviewer_search(by="source", values=WINDOWS_SOURCES) + " | append [" + build_host_reviewer_search(by="sourcetype", values=WINDOWS_SOURCE_TYPES) + "]",
                "sources_reviewer_search": build_source_reviewer_search(by="source", values=WINDOWS_SOURCES) + build_source_reviewer_search(by="sourcetype", values=WINDOWS_SOURCE_TYPES, first_call=False),
                "earliest_time": "-1d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "Windows AD",
        "metadata_count_search": """| tstats count where index=* source IN ({ad_sources}) OR sourcetype IN ({ad_sourcetypes}) """.format(
            ad_sources=WINDOWS_AD_SOURCES, ad_sourcetypes=WINDOWS_AD_SOURCE_TYPES
        ),
        "macro_configurations": [
            {
                "macro_name": "cs_windows_idx",
                "label": "Windows AD Data",
                "search": build_search_query(macro="cs_windows_idx", by="source", values=WINDOWS_AD_SOURCES) + build_search_query(macro="cs_windows_idx", by="sourcetype", values=WINDOWS_AD_SOURCE_TYPES, first_call=False),
                "host_reviewer_search": build_host_reviewer_search(by="source", values=WINDOWS_AD_SOURCES) + " | append [" + build_host_reviewer_search(by="sourcetype", values=WINDOWS_AD_SOURCE_TYPES) + "]",
                "sources_reviewer_search": build_source_reviewer_search(by="source", values=WINDOWS_AD_SOURCES) + build_source_reviewer_search(by="sourcetype", values=WINDOWS_AD_SOURCE_TYPES, first_call=False),
                "earliest_time": "-1d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "Windows DNS",
        "metadata_count_search": """| tstats count where index=* source IN ({dns_sources}) OR sourcetype IN ({dns_sourcetypes}) """.format(
            dns_sources=WINDOWS_DNS_SOURCES,
            dns_sourcetypes=WINDOWS_DNS_SOURCE_TYPES,
        ),
        "macro_configurations": [
            {
                "macro_name": "cs_windows_idx",
                "label": "Windows DNS Data",
                "search": build_search_query(macro="cs_windows_idx", by="source", values=WINDOWS_DNS_SOURCES) + build_search_query(macro="cs_windows_idx", by="sourcetype", values=WINDOWS_DNS_SOURCE_TYPES, first_call=False),
                "host_reviewer_search": build_host_reviewer_search(by="source", values=WINDOWS_DNS_SOURCES) + " | append [" + build_host_reviewer_search(by="sourcetype", values=WINDOWS_DNS_SOURCE_TYPES) + "]",
                "sources_reviewer_search": build_source_reviewer_search(by="source", values=WINDOWS_DNS_SOURCES) + build_source_reviewer_search(by="sourcetype", values=WINDOWS_DNS_SOURCE_TYPES, first_call=False),
                "earliest_time": "-1d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "Lansweeper",
        "macro_configurations": [
            {
                "macro_name": "cs_lansweeper",
                "label": "Lansweeper Data",
                "search_by": "sourcetype",
                "search_values": "lansweeper:asset:*",
                "earliest_time": "-2d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "Linux",
        "label": "Linux/Unix",
        "macro_configurations": [
            {
                "macro_name": "cs_linux",
                "label": "Linux Data",
                "search_by": "sourcetype",
                "search_values": "usersWithLoginPrivs,cyences:linux:groups,cyences:linux:users,interfaces,df,Unix:ListeningPorts,Unix:Service,Unix:Version,Unix:Uptime,hardware,linux_secure,linux:audit",
                "earliest_time": "-2d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "VPN",
        "metadata_count_search": '`cs_vpn_indexes` dest_category="vpn_auth" | stats count ',
        "macro_configurations": [
            {
                "macro_name": "cs_vpn_indexes",
                "label": "VPN Data (indexes)",
                "search": '`cs_vpn_indexes` dest_category="vpn_auth" | stats count by index, sourcetype',
                "host_reviewer_search": '`cs_vpn_indexes` dest_category="vpn_auth" | stats count by sourcetype host | rename sourcetype as sources',
                "sources_reviewer_search": '`cs_vpn_indexes` dest_category="vpn_auth" | stats dc(host) as host_count values(index) as index by sourcetype | rename sourcetype as sources',
                "earliest_time": "-1d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        'name': 'Radius Authentication',
        "metadata_count_search": '`cs_radius_authentication_indexes` dest_category="radius_auth" | stats count ',
        "macro_configurations": [
            {
                "macro_name": "cs_radius_authentication_indexes",
                "label": "Radius Authentication Data (indexes)",
                "search": '`cs_radius_authentication_indexes` dest_category="radius_auth" | stats count by index, sourcetype',
                "host_reviewer_search": '`cs_radius_authentication_indexes` dest_category="radius_auth" | stats count by sourcetype host | rename sourcetype as sources',
                "sources_reviewer_search": '`cs_radius_authentication_indexes` dest_category="radius_auth" | stats dc(host) as host_count values(index) as index by sourcetype | rename sourcetype as sources',
                "earliest_time": "-7d@d",
                "latest_time": "now",
            }
        ],
    },
]

for product in PRODUCTS:
    metadata_count_search = "| tstats count where index=* "
    for macro_config in product["macro_configurations"]:
        if not macro_config.get("search"):
            macro_config["search"] = build_search_query(
                macro=macro_config["macro_name"],
                by=macro_config["search_by"],
                values=macro_config["search_values"],
            )
        if not macro_config.get("host_reviewer_search"):
            macro_config["host_reviewer_search"] = build_host_reviewer_search(
                by=macro_config["search_by"],
                values=macro_config["search_values"],
            )
        if not macro_config.get("sources_reviewer_search"):
            macro_config["sources_reviewer_search"] = build_source_reviewer_search(
                by=macro_config["search_by"],
                values=macro_config["search_values"],
            )
        if not product.get("metadata_count_search"):
            metadata_count_search += build_metadata_count_search(
                by=macro_config["search_by"],
                values=macro_config["search_values"],
            )
    if not product.get("metadata_count_search"):
        product["metadata_count_search"] = metadata_count_search[:-3]
