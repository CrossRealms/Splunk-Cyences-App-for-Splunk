WINDOWS_SOURCES = '"*WinEventLog:Security","*WinEventLog:System"'
WINDOWS_SOURCE_TYPES = '"powershell*"'
WINDOWS_AD_SOURCES = '"WinEventLog:DFS Replication","WinEventLog:Directory Service","WinEventLog:Microsoft-AzureADPasswordProtection-DCAgent/Admin","PerfmonMk:DFS_Replicated_Folders"'
WINDOWS_AD_SOURCE_TYPES = '"MSAD:NT6:Netlogon","MSAD:NT6:Replication","MSAD:NT6:Health","MSAD:NT6:SiteInfo","windows:certstore:ca:issued","ActiveDirectory"'
WINDOWS_DNS_SOURCES = '"WinEventLog:DNS Server"'
WINDOWS_DNS_SOURCE_TYPES = '"MSAD:NT6:DNS","MSAD:NT6:DNS-Health","MSAD:NT6:DNS-Zone-Information","PerfmonMk:DNS"'


def build_windows_append_search():
    search_to_append = ""
    for source in WINDOWS_SOURCES.split(","):
        search_to_append += "| append [ | tstats count where index=* source={source} | eval sources={source} ]".format(
            source=source
        )

    for sourcetype in WINDOWS_SOURCE_TYPES.split(","):
        search_to_append += "| append [ | tstats count where index=* sourcetype={sourcetype} | eval sources={sourcetype} ] ".format(
            sourcetype=sourcetype
        )

    return search_to_append


def build_windows_append_source_reviewer_search():
    search_to_append = ""
    for source in WINDOWS_SOURCES.split(","):
        search_to_append += "| append [ | tstats values(host) as hosts where index=* source={source} by source index | rename source as sources | stats values(index) as index dc(hosts) as host_count by sources | stats count values(*) as * sum(host_count) as host_count | eval sources=if(count>0,sources,{source})] ".format(
            source=source
        )

    for sourcetype in WINDOWS_SOURCE_TYPES.split(","):
        search_to_append += "| append [ | tstats values(host) as hosts where index=* sourcetype={sourcetype} by sourcetype index | rename sourcetype as sources | stats values(index) as index dc(hosts) as host_count by sources | stats count values(*) as * sum(host_count) as host_count | eval sources=if(count>0,sources,{sourcetype})] ".format(
            sourcetype=sourcetype
        )

    return search_to_append


def build_search_query(macro, by, values, more=""):
    SEARCH_QUERY_TEMPLATE = """`{macro}` {more} | stats count by {by} 
| append [| makeresults | eval {by}=split("{values}", ","), count=0 | mvexpand {by}] 
| stats sum(count) as count by {by}"""
    return SEARCH_QUERY_TEMPLATE.format(macro=macro, by=by, values=values, more=more)


def build_host_reviewer_search(by, values):
    return "| tstats count where index=* {by} IN ({values}) by {by} host | rename {by} as sources".format(
        by=by, values=values
    )


def build_metadata_count_search(by, values):
    return "{by} IN ({values}) OR ".format(by=by, values=values)


def build_source_reviewer_search(by, values):
    search = ""
    values = values.split(",")

    for index in range(len(values)):
        if index > 0:
            search += " | append ["
        search += """| tstats values(host) as hosts where index=* {by} IN ("{value}") by {by} index
        | stats count values(*) as * dc(hosts) as host_count by {by}
        | stats count values(*) as * sum(host_count) as host_count
        | eval {by}=if(count>0,{by},"{value}")
        | rename {by} as sources""".format(
            by=by, value=values[index].strip('"')
        )
        if index > 0:
            search += "]"
    return search


PRODUCTS = [
    {
        "name": "CrowdStrike EventStream",
        "macro_configurations": [
            {
                "macro_name": "cs_crowdstrike_eventstream",
                "label": "CrowdStrike EventStream Data",
                "search_macro": "cs_crowdstrike_eventstream",
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
                "search_macro": "cs_kaspersky",
                "search_by": "sourcetype",
                "search_values": "kaspersky:leef,kaspersky:klaud,kaspersky:klprci,kaspersky:klbl,kaspersky:klsrv,kaspersky:gnrl,kaspersky:klnag",
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
                "search_macro": "cs_o365_defender_atp",
                "search_by": "sourcetype",
                "search_values": "ms:defender:atp:alerts",
                "earliest_time": "-7d@d",
                "latest_time": "now",
            },
            {
                "macro_name": "cs_o365_defender_atp_audit",
                "label": "Microsoft 365 Defender ATP Audit Data",
                "search_macro": "cs_o365_defender_atp_audit",
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
                "search_macro": "cs_sophos",
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
                "search_macro": "cs_windows_defender",
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
                "search_macro": "cs_aws",
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
                "search_macro": "cs_gws",
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
                "search_macro": "cs_o365",
                "search_by": "sourcetype",
                "search_values": "o365:management:activity,o365:service:healthIssue,o365:reporting:messagetrace",
                "earliest_time": "-1d@d",
                "latest_time": "now",
            },
            {
                "macro_name": "cs_azure_securityscore",
                "label": "Azure Security Score Data",
                "search_macro": "cs_azure_securityscore",
                "search_by": "sourcetype",
                "search_values": "GraphSecurity:Score",
                "search_more": 'sourcetype="GraphSecurity:Score"',
                "earliest_time": "-2d@d",
                "latest_time": "now",
            },
            {
                "macro_name": "cs_azure",
                "label": "Azure Active Directory Data",
                "search_macro": "cs_azure",
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
                "search_macro": "cs_cisco_ios",
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
                "search_macro": "cs_fortigate",
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
                "search_macro": "cs_palo",
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
                "search_macro": "cs_sophos_firewall",
                "search_by": "sourcetype",
                "search_values": "sophos:xg:firewall,sophos:xg:heartbeat,sophos:xg:system_health,sophos:xg:atp,sophos:xg:idp",
                "earliest_time": "-1d@d",
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
                "search_macro": "cs_crowdstrike_vuln",
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
                "search_macro": "cs_qualys",
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
                "search_macro": "cs_tenable",
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
                "search_macro": "cs_sysmon",
                "search_by": "source",
                "search_values": "*WinEventLog:Microsoft-Windows-Sysmon/Operational",
                "earliest_time": "-4h@h",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "Windows",
        "metadata_count_search": """| tstats count where (`cs_windows_idx` OR `cs_windows_cert_store_idx` OR (index=* sourcetype IN ({windows_sourcetypes}) OR source IN ({windows_sources}))) NOT source IN ({ad_and_dns_sources}) NOT sourcetype IN ({ad_and_dns_sourcetypes}) """.format(
            windows_sourcetypes=WINDOWS_SOURCE_TYPES,
            windows_sources=WINDOWS_SOURCES,
            ad_and_dns_sources=WINDOWS_AD_SOURCES + "," + WINDOWS_DNS_SOURCES,
            ad_and_dns_sourcetypes=WINDOWS_AD_SOURCE_TYPES + "," + WINDOWS_DNS_SOURCE_TYPES,
        ),
        "macro_configurations": [
            {
                "macro_name": "cs_windows_idx",
                "label": "Windows Data",
                "search": """| tstats count where `cs_windows_idx` OR `cs_windows_cert_store_idx` NOT source IN ({ad_and_dns_and_windows_sources}) NOT sourcetype IN ({ad_and_dns_and_windows_sourcetypes}) by source sourcetype | eval sources = if(sourcetype IN ("WinEventLog","WinHostMon","exec","XmlWinEventLog*","powershell"),source,sourcetype) | stats sum(count) as count by sources {append_windows_source_and_sourcetypes}""".format(
                    ad_and_dns_and_windows_sources=WINDOWS_AD_SOURCES + "," + WINDOWS_DNS_SOURCES + "," + WINDOWS_SOURCES,
                    ad_and_dns_and_windows_sourcetypes=WINDOWS_AD_SOURCE_TYPES + "," + WINDOWS_DNS_SOURCE_TYPES + "," + WINDOWS_SOURCE_TYPES,
                    append_windows_source_and_sourcetypes=build_windows_append_search(),
                ),
                "host_reviewer_search": """| tstats count where (`cs_windows_idx`  OR `cs_windows_cert_store_idx` OR (index=* sourcetype IN ({windows_sourcetypes}) OR source IN ({windows_sources}))) NOT source IN ({ad_and_dns_sources}) NOT sourcetype IN ({ad_and_dns_sourcetypes}) by source sourcetype host | eval sources = if(sourcetype IN ("WinEventLog","WinHostMon","exec","XmlWinEventLog*","powershell"),source,sourcetype) | stats sum(count) as count by sources host""".format(
                    windows_sourcetypes=WINDOWS_SOURCE_TYPES,
                    windows_sources=WINDOWS_SOURCES,
                    ad_and_dns_sources=WINDOWS_AD_SOURCES + "," + WINDOWS_DNS_SOURCES,
                    ad_and_dns_sourcetypes=WINDOWS_AD_SOURCE_TYPES + "," + WINDOWS_DNS_SOURCE_TYPES,
                ),
                "sources_reviewer_search": """| tstats values(host) as hosts where `cs_windows_idx` OR `cs_windows_cert_store_idx` NOT source IN ({ad_and_dns_and_windows_sources}) NOT sourcetype IN ({ad_and_dns_and_windows_sourcetypes}) by source sourcetype index | eval sources = if(sourcetype IN ("WinEventLog","WinHostMon","exec","XmlWinEventLog*","powershell"),source,sourcetype) | stats values(index) as index dc(hosts) as host_count by sources {append_windows_source_and_sourcetypes}""".format(
                    ad_and_dns_and_windows_sources=WINDOWS_AD_SOURCES + "," + WINDOWS_DNS_SOURCES + "," + WINDOWS_SOURCES,
                    ad_and_dns_and_windows_sourcetypes=WINDOWS_AD_SOURCE_TYPES + "," + WINDOWS_DNS_SOURCE_TYPES + "," + WINDOWS_SOURCE_TYPES,
                    append_windows_source_and_sourcetypes=build_windows_append_source_reviewer_search(),
                ),
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
                "search": """| tstats count where index=* source IN ({ad_sources}) OR sourcetype IN ({ad_sourcetypes}) by source sourcetype | eval sources = if(source IN ({ad_sources}), source, sourcetype)
                | append [| makeresults | eval sources=split("{ad_source_and_sourcetypes}", ","), count=0 | mvexpand sources] | stats sum(count) as count by sources""".format(
                    ad_sources=WINDOWS_AD_SOURCES,
                    ad_sourcetypes=WINDOWS_AD_SOURCE_TYPES,
                    ad_source_and_sourcetypes=(WINDOWS_AD_SOURCES + "," + WINDOWS_AD_SOURCE_TYPES).replace("\"",""),
                ),
                "host_reviewer_search": """| tstats count where index=* source IN ({ad_sources}) OR sourcetype IN ({ad_sourcetypes}) by source sourcetype host | eval sources = if(source IN ({ad_sources}), source, sourcetype) | stats sum(count) as count by sources host""".format(
                    ad_sources=WINDOWS_AD_SOURCES,
                    ad_sourcetypes=WINDOWS_AD_SOURCE_TYPES,
                ),
                "sources_reviewer_search": """| tstats values(host) as hosts where index=* source IN ({ad_sources}) OR sourcetype IN ({ad_sourcetypes}) by source sourcetype index | eval sources = if(source IN ({ad_sources}), source, sourcetype) | stats values(index) as index dc(hosts) as host_count by sources
                | append [| makeresults | eval sources=split("{ad_source_and_sourcetypes}", ",") | mvexpand sources] | stats values(*) as * by sources""".format(
                    ad_sources=WINDOWS_AD_SOURCES,
                    ad_sourcetypes=WINDOWS_AD_SOURCE_TYPES,
                    ad_source_and_sourcetypes=(WINDOWS_AD_SOURCES + "," + WINDOWS_AD_SOURCE_TYPES).replace("\"",""),
                ),
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
                "search": """| tstats count where index=* source IN ({dns_sources}) OR sourcetype IN ({dns_sourcetypes}) by source sourcetype | eval sources = if(source IN ({dns_sources}), source, sourcetype)
                | append [| makeresults | eval sources=split("{dns_source_and_sourcetypes}", ","), count=0 | mvexpand sources] | stats sum(count) as count by sources""".format(
                    dns_sources=WINDOWS_DNS_SOURCES,
                    dns_sourcetypes=WINDOWS_DNS_SOURCE_TYPES,
                    dns_source_and_sourcetypes=(WINDOWS_DNS_SOURCES + "," + WINDOWS_DNS_SOURCE_TYPES).replace("\"",""),
                ),
                "host_reviewer_search": "| tstats count where index=* source IN ({dns_sources}) OR sourcetype IN ({dns_sourcetypes}) by source sourcetype host | eval sources = if(source IN ({dns_sources}), source, sourcetype) | stats sum(count) as count by sources host".format(
                    dns_sources=WINDOWS_DNS_SOURCES,
                    dns_sourcetypes=WINDOWS_DNS_SOURCE_TYPES,
                ),
                "sources_reviewer_search": """| tstats values(host) as hosts where index=* source IN ({dns_sources}) OR sourcetype IN ({dns_sourcetypes}) by source sourcetype index | eval sources = if(source IN ({dns_sources}), source, sourcetype) | stats values(index) as index dc(hosts) as host_count by sources
                | append [| makeresults | eval sources=split("{dns_source_and_sourcetypes}", ",") | mvexpand sources] | stats values(*) as * by sources""".format(
                    dns_sources=WINDOWS_DNS_SOURCES,
                    dns_sourcetypes=WINDOWS_DNS_SOURCE_TYPES,
                    dns_source_and_sourcetypes=(WINDOWS_DNS_SOURCES + "," + WINDOWS_DNS_SOURCE_TYPES).replace("\"",""),
                ),
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
                "search_macro": "cs_lansweeper",
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
                "search_macro": "cs_linux",
                "search_by": "sourcetype",
                "search_values": "usersWithLoginPrivs,cyences:linux:groups,cyences:linux:users,sudousers,openPorts,interfaces,df,Unix:ListeningPorts,Unix:Service,Unix:UserAccounts,Unix:Version,Unix:Uptime,package,hardware,lsof,linux_secure,linux:audit",
                "search_more": "sourcetype IN (usersWithLoginPrivs,cyences:linux:groups,cyences:linux:users,sudousers,openPorts,interfaces,df,Unix:ListeningPorts,Unix:Service,Unix:UserAccounts,Unix:Version,Unix:Uptime,package,hardware,lsof,linux_secure,linux:audit)",
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
]

for product in PRODUCTS:
    metadata_count_search = "| tstats count where index=* "
    for macro_config in product["macro_configurations"]:
        if not macro_config.get("search"):
            macro_config["search"] = build_search_query(
                macro=macro_config["search_macro"],
                by=macro_config["search_by"],
                values=macro_config["search_values"],
                more=macro_config.get("search_more", ""),
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
