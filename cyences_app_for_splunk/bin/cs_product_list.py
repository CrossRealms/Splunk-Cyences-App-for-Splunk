WINDOWS_SOURCES = '"*WinEventLog:Application","*WinEventLog:Security","*WinEventLog:System","powershell://generate_windows_update_logs"'
WINDOWS_SOURCE_TYPES = '"Script:ListeningPorts","WinRegistry","WindowsFirewallStatus","windows:certstore:local","DhcpSrvLog","WindowsUpdateLog","WMI:Version","WMI:InstalledUpdates"'
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


def build_source_latency_search(macro, by, values):
    return "`{macro}` {by} IN ({values}) | eval diff=(_indextime - _time) / 60 | rename {by} as sources | stats max(diff) as max_delay avg(diff) as avg_delay by sources".format(
        macro=macro, by=by, values=values
    )


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


def build_data_availablity_panel_search(macro, by, values, first_call=True):
    search = ""
    values = values.split(",")

    for index in range(len(values)):
        if index > 0 or first_call is False:
            search += " | append ["
        search += """| tstats count where `{macro}` {by}="{value}"
        | eval label="`{macro}` {by}=\\"{value}\\""
        """.format(
            macro=macro, by=by, value=values[index].strip('"')
        )
        if index > 0 or first_call is False:
            search += "]"
    return search


def build_app_dependency_search(app_list):
    search = ""
    count = 0
    for app in app_list:
        if count > 0:
            search += " | append ["

        search += """| rest /services/apps/local splunk_server=local
            | search label="{app}"
            | eval is_installed="Installed"
            | table label, is_installed, disabled
            | append
                [| makeresults count=1
                | eval label="{app}", disabled="-", is_installed="Not Installed", link="{link}"
                | table label, is_installed, disabled, link]
            """.format(app=app['label'], link=app['link'])
        if count > 0:
            search += "]"
        count += 1

    if len(search) > 0:
        search += """| stats first(*) as * by label
            | eval disabled = case(disabled=0, "Enabled", disabled=1, "Disabled", 1==1, "-")
            | table label, is_installed, disabled, link
            | rename label as "App Name", is_installed as "Installation Status", link as "Splunkbase Link", disabled as "Enabled/Disabled"
            """
    return search


PRODUCTS = [
    {
        "name": "CrowdStrike EventStream",
        "app_dependencies": [
            {
                "label": "CrowdStrike Falcon Event Streams",
                "link": "https://splunkbase.splunk.com/app/5082/"
            }
        ],
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
        "app_dependencies": [
            {
                "label": "Kaspersky Add-on for Splunk",
                "link": "https://splunkbase.splunk.com/app/4656/"
            }
        ],
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
        "name": "Office 365 Defender ATP",
        "app_dependencies": [
            {
                "label": "Splunk Add-on for Microsoft Security",
                "link": "https://splunkbase.splunk.com/app/6207/"
            },
            {
                "label": "Defender ATP Status Check Add-on",
                "link": "https://splunkbase.splunk.com/app/5691/"
            }
        ],
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
        "app_dependencies": [
            {
                "label": "Sophos Central Addon for Splunk",
                "link": "https://splunkbase.splunk.com/app/6186/"
            }
        ],
        "macro_configurations": [
            {
                "macro_name": "cs_sophos",
                "label": "Sophos Endpoint Protection Data",
                "search_by": "sourcetype",
                "search_values": "sophos_events,sophos_endpoints",
                "earliest_time": "-7d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "Windows Defender",
        "app_dependencies": [
            {
                "label": "Microsoft Windows Defender Add-on for Splunk",
                "link": "https://splunkbase.splunk.com/app/3734/"
            }
        ],
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
        "app_dependencies": [
            {
                "label": "Splunk Add-on for AWS",
                "link": "https://splunkbase.splunk.com/app/1876/"
            }
        ],
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
        "app_dependencies": [
            {
                "label": "Splunk Add-on for Google Workspace",
                "link": "https://splunkbase.splunk.com/app/5556/"
            }
        ],
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
        "app_dependencies": [
            {
                "label": "Splunk Add-on for Microsoft Office 365",
                "link": "https://splunkbase.splunk.com/app/4055/"
            },
            {
                "label": "Microsoft Graph Security Score Add-on",
                "link": "https://splunkbase.splunk.com/app/5693/"
            },
            {
                "label": "Splunk Add on for Microsoft Azure",
                "link": "https://splunkbase.splunk.com/app/3757/"
            }
        ],
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
                "search_values": "azure:aad:audit,azure:aad:signin",
                "earliest_time": "-2d@d",
                "latest_time": "now",
            },
        ],
    },
    {
        "name": "Email",
        "app_dependencies": [
            {
                "label": "Splunk Add-on for Google Workspace",
                "link": "https://splunkbase.splunk.com/app/5556/"
            },
            {
                "label": "Splunk Add-on for Microsoft Office 365",
                "link": "https://splunkbase.splunk.com/app/4055/"
            }
        ],
        "macro_configurations": [
            {
                "macro_name": "cs_email_sources",
                "label": "Email Data",
                "search_by": "sourcetype",
                "search_values": "ms:o365:reporting:messagetrace,o365:reporting:messagetrace,gws:gmail",
                "earliest_time": "-7d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "Network",
        "app_dependencies": [],
        "metadata_count_search": '`cs_network_indexes` tag=network tag=communicate | stats count',
        "macro_configurations": [
            {
                "macro_name": "cs_network_indexes",
                "label": "Network Data (indexes)",
                "search": '`cs_network_indexes` tag=network tag=communicate | stats count by index, sourcetype',
                "host_reviewer_search": '`cs_network_indexes` tag=network tag=communicate | stats count by sourcetype host | rename sourcetype as sources',
                "sources_reviewer_search": '`cs_network_indexes` tag=network tag=communicate | stats dc(host) as host_count values(index) as index by sourcetype | rename sourcetype as sources',
                "data_availablity_panel_search": '`cs_network_indexes` tag=network tag=communicate | head 1 | stats count | eval label="`cs_network_indexes` tag=network tag=communicate" ',
                "source_latency_search": '`cs_network_indexes` tag=network tag=communicate | eval diff=(_indextime - _time) / 60 | stats max(diff) as max_delay avg(diff) as avg_delay by sourcetype | rename sourcetype as sources',
                "earliest_time": "-4h@h",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "Cisco IOS",
        "app_dependencies": [
            {
                "label": "Cisco Networks Add-on",
                "link": "https://splunkbase.splunk.com/app/1467/"
            }
        ],
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
        "app_dependencies": [
            {
                "label": "Fortinet Fortigate Add-on for Splunk",
                "link": "https://splunkbase.splunk.com/app/2846/"
            }
        ],
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
        "app_dependencies": [
            {
                "label": "Palo Alto Networks Add-on",
                "link": "https://splunkbase.splunk.com/app/2757/"
            }
        ],
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
        "app_dependencies": [
            {
                "label": "Sophos XG Firewall Add-on For Splunk",
                "link": "https://splunkbase.splunk.com/app/6187/"
            },
            {
                "label": "Sophos Central Addon for Splunk",
                "link": "https://splunkbase.splunk.com/app/6186/"
            }
        ],
        "macro_configurations": [
            {
                "macro_name": "cs_sophos_firewall",
                "label": "Sophos Firewall Data",
                "search_by": "sourcetype",
                "search_values": "sophos:xg:firewall,sophos:xg:heartbeat,sophos:xg:system_health,sophos:xg:atp,sophos:xg:idp",
                "earliest_time": "-1d@d",
                "latest_time": "now",
            },
            {
                "macro_name": "cs_sophos",
                "label": "Sophos Firewall Events Data",
                "search_by": "sourcetype",
                "search_values": "sophos_events",
                "earliest_time": "-7d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "Cisco Meraki",
        "app_dependencies": [
            {
                "label": "TA-meraki",
                "link": "https://splunkbase.splunk.com/app/3018/"
            }
        ],
        "macro_configurations": [
            {
                "macro_name": "cs_cisco_meraki",
                "label": "Cisco Meraki Data",
                "search_by": "sourcetype",
                "search_values": "meraki:securityappliances,meraki:organizationsecurity,meraki:audit,meraki:accesspoints,meraki:switches,meraki:networkdevices,meraki:devices",
                "earliest_time": "-3d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "F5 BIGIP",
        "app_dependencies": [
            {
                "label": "Splunk Add-on for F5 BIG-IP",
                "link": "https://splunkbase.splunk.com/app/2680/"
            }
        ],
        "macro_configurations": [
            {
                "macro_name": "cs_f5_bigip",
                "label": "F5 BIGIP Data",
                "search_by": "sourcetype",
                "search_values": "f5:bigip:syslog,f5:bigip:asm:syslog",
                "earliest_time": "-1d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "Cloudflare",
        "app_dependencies": [
            {
                "label": "Cloudflare App for Splunk",
                "link": "https://splunkbase.splunk.com/app/4501"
            }
        ],
        "macro_configurations": [
            {
                "macro_name": "cs_cloudflare",
                "label": "Cloudflare Data",
                "search_by": "sourcetype",
                "search_values": "cloudflare:json",
                "earliest_time": "-4h@h",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "CrowdStrike Devices",
        "app_dependencies": [
            {
                "label": "CrowdStrike Falcon Devices",
                "link": "https://splunkbase.splunk.com/app/5570/"
            }
        ],
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
        "name": "Vulnerability",
        "app_dependencies": [],
        "metadata_count_search": '`cs_vulnerabilities_indexes` tag=vulnerability tag=report tag=cyences | stats count',
        "macro_configurations": [
            {
                "macro_name": "cs_vulnerabilities_indexes",
                "label": "Vulnerability Data (indexes)",
                "search": '`cs_vulnerabilities_indexes` tag=vulnerability tag=report tag=cyences | stats count by index, sourcetype',
                "host_reviewer_search": '`cs_vulnerabilities_indexes` tag=vulnerability tag=report tag=cyences | stats count by sourcetype host | rename sourcetype as sources',
                "sources_reviewer_search": '`cs_vulnerabilities_indexes` tag=vulnerability tag=report tag=cyences | stats dc(host) as host_count values(index) as index by sourcetype | rename sourcetype as sources',
                "data_availablity_panel_search": '`cs_vulnerabilities_indexes` tag=vulnerability tag=report tag=cyences | head 1 | stats count | eval label="`cs_vulnerabilities_indexes` tag=vulnerability tag=report tag=cyences" ',
                "source_latency_search": '`cs_vulnerabilities_indexes` tag=vulnerability tag=report tag=cyences | eval diff=(_indextime - _time) / 60 | stats max(diff) as max_delay avg(diff) as avg_delay by sourcetype | rename sourcetype as sources',
                "earliest_time": "-1d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "CrowdStrike Spotlight",
        "app_dependencies": [
            {
                "label": "CrowdStrike Falcon Spotlight Data",
                "link": "https://splunkbase.splunk.com/app/6167/"
            }
        ],
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
        "app_dependencies": [
            {
                "label": "Qualys Technology Add-on for Splunk",
                "link": "https://splunkbase.splunk.com/app/2964/"
            }
        ],
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
        "app_dependencies": [
            {
                "label": "Tenable Add-On for Splunk",
                "link": "https://splunkbase.splunk.com/app/4060/"
            }
        ],
        "macro_configurations": [
            {
                "macro_name": "cs_tenable",
                "label": "Tenable Data",
                "search_by": "sourcetype",
                "search_values": "tenable:io:assets,tenable:io:vuln,tenable:sc:assets,tenable:sc:vuln",
                "earliest_time": "-7d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "Nessus",
        "app_dependencies": [
            {
                "label": "Nessus Professional Add-on for Splunk",
                "link": "https://splunkbase.splunk.com/app/7464/"
            }
        ],
        "macro_configurations": [
            {
                "macro_name": "cs_nessus",
                "label": "Nessus Data",
                "search_by": "sourcetype",
                "search_values": "nessus:pro:vuln,nessus_json",
                "earliest_time": "-7d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "Sysmon",
        "app_dependencies": [
            {
                "label": "Splunk Add-on for Sysmon",
                "link": "https://splunkbase.splunk.com/app/5709/"
            }
        ],
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
        "app_dependencies": [
            {
                "label": "Splunk Add-on for Microsoft Windows",
                "link": "https://splunkbase.splunk.com/app/742/"
            }
        ],
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
                "data_availablity_panel_search": build_data_availablity_panel_search(macro="cs_windows_idx", by="source", values=WINDOWS_SOURCES) + build_data_availablity_panel_search(macro="cs_windows_idx", by="sourcetype", values=WINDOWS_SOURCE_TYPES, first_call=False),
                "source_latency_search": build_source_latency_search(macro="cs_windows_idx", by="source", values=WINDOWS_SOURCES) + " | append [ | search " + build_source_latency_search(macro="cs_windows_idx", by="sourcetype", values=WINDOWS_SOURCE_TYPES) + "]",
                "earliest_time": "-1d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "Windows AD",
        "app_dependencies": [
            {
                "label": "Splunk Add-on for Microsoft Windows",
                "link": "https://splunkbase.splunk.com/app/742/"
            }
        ],
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
                "data_availablity_panel_search": build_data_availablity_panel_search(macro="cs_windows_idx", by="source", values=WINDOWS_AD_SOURCES) + build_data_availablity_panel_search(macro="cs_windows_idx", by="sourcetype", values=WINDOWS_AD_SOURCE_TYPES, first_call=False),
                "source_latency_search": build_source_latency_search(macro="cs_windows_idx", by="source", values=WINDOWS_AD_SOURCES) + " | append [ | search " + build_source_latency_search(macro="cs_windows_idx", by="sourcetype", values=WINDOWS_AD_SOURCE_TYPES) + "]",
                "earliest_time": "-1d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "Windows DNS",
        "app_dependencies": [
            {
                "label": "Splunk Add-on for Microsoft Windows",
                "link": "https://splunkbase.splunk.com/app/742/"
            }
        ],
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
                "data_availablity_panel_search": build_data_availablity_panel_search(macro="cs_windows_idx", by="source", values=WINDOWS_DNS_SOURCES) + build_data_availablity_panel_search(macro="cs_windows_idx", by="sourcetype", values=WINDOWS_DNS_SOURCE_TYPES, first_call=False),
                "source_latency_search": build_source_latency_search(macro="cs_windows_idx", by="source", values=WINDOWS_DNS_SOURCES) + " | append [ | search " + build_source_latency_search(macro="cs_windows_idx", by="sourcetype", values=WINDOWS_DNS_SOURCE_TYPES) + "]",
                "earliest_time": "-1d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "Lansweeper",
        "app_dependencies": [
            {
                "label": "Lansweeper Add-on for Splunk",
                "link": "https://splunkbase.splunk.com/app/5418/"
            }
        ],
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
        "app_dependencies": [
            {
                "label": "Splunk Add-on for Unix and Linux",
                "link": "https://splunkbase.splunk.com/app/833/"
            },
            {
                "label": "Linux Auditd Technology Add-On",
                "link": "https://splunkbase.splunk.com/app/4232/"
            }
        ],
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
        "app_dependencies": [],
        "metadata_count_search": '`cs_vpn_indexes` dest_category="vpn_auth" | stats count ',
        "macro_configurations": [
            {
                "macro_name": "cs_vpn_indexes",
                "label": "VPN Data (indexes)",
                "search": '`cs_vpn_indexes` dest_category="vpn_auth" | stats count by index, sourcetype',
                "host_reviewer_search": '`cs_vpn_indexes` dest_category="vpn_auth" | stats count by sourcetype host | rename sourcetype as sources',
                "sources_reviewer_search": '`cs_vpn_indexes` dest_category="vpn_auth" | stats dc(host) as host_count values(index) as index by sourcetype | rename sourcetype as sources',
                "data_availablity_panel_search": '`cs_vpn_indexes` dest_category="vpn_auth" | head 1 | stats count | eval label="`cs_vpn_indexes` dest_category=vpn_auth" ',
                "source_latency_search": '`cs_vpn_indexes` dest_category="vpn_auth" | eval diff=(_indextime - _time) / 60 | stats max(diff) as max_delay avg(diff) as avg_delay by sourcetype | rename sourcetype as sources',
                "earliest_time": "-1d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        'name': 'Authentication',
        "app_dependencies": [],
        "metadata_count_search": '`cs_authentication_indexes` tag=authentication | stats count ',
        "macro_configurations": [
            {
                "macro_name": "cs_authentication_indexes",
                "label": "Authentication Data (indexes)",
                "search": '`cs_authentication_indexes` tag=authentication | stats count by index, sourcetype',
                "host_reviewer_search": '`cs_authentication_indexes` tag=authentication | stats count by sourcetype host | rename sourcetype as sources',
                "sources_reviewer_search": '`cs_authentication_indexes` tag=authentication | stats dc(host) as host_count values(index) as index by sourcetype | rename sourcetype as sources',
                "data_availablity_panel_search": '`cs_authentication_indexes` tag=authentication | head 1 | stats count | eval label="`cs_authentication_indexes`  tag=authentication" ',
                "source_latency_search": '`cs_authentication_indexes` tag=authentication | eval diff=(_indextime - _time) / 60 | stats max(diff) as max_delay avg(diff) as avg_delay by sourcetype | rename sourcetype as sources',
                "earliest_time": "-1d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        'name': 'Radius Authentication',
        "app_dependencies": [
            {
                "label": "Palo Alto Networks Add-on",
                "link": "https://splunkbase.splunk.com/app/2757/"
            }
        ],
        "metadata_count_search": '`cs_radius_authentication_indexes` dest_category="radius_auth" | stats count ',
        "macro_configurations": [
            {
                "macro_name": "cs_radius_authentication_indexes",
                "label": "Radius Authentication Data (indexes)",
                "search": '`cs_radius_authentication_indexes` dest_category="radius_auth" | stats count by index, sourcetype',
                "host_reviewer_search": '`cs_radius_authentication_indexes` dest_category="radius_auth" | stats count by sourcetype host | rename sourcetype as sources',
                "sources_reviewer_search": '`cs_radius_authentication_indexes` dest_category="radius_auth" | stats dc(host) as host_count values(index) as index by sourcetype | rename sourcetype as sources',
                "data_availablity_panel_search": '`cs_radius_authentication_indexes` dest_category="radius_auth" | head 1 | stats count | eval label="`cs_radius_authentication_indexes` dest_category=radius_auth" ',
                "source_latency_search": '`cs_radius_authentication_indexes` dest_category="radius_auth" | eval diff=(_indextime - _time) / 60 | stats max(diff) as max_delay avg(diff) as avg_delay by sourcetype | rename sourcetype as sources',
                "earliest_time": "-7d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "MSSQL",
        "app_dependencies": [
            {
                "label": "Splunk Add-on for Microsoft SQL Server",
                "link": "https://splunkbase.splunk.com/app/2648/"
            }
        ],
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
        "app_dependencies": [
            {
                "label": "Splunk Add-on for Oracle",
                "link": "https://splunkbase.splunk.com/app/1910/"
            }
        ],
        "macro_configurations": [
            {
                "macro_name": "cs_oracle",
                "label": "Oracle Data",
                "search_by": "sourcetype",
                "search_values": "oracle:audit:xml,oracle:audit:unified",
                "earliest_time": "-1d@d",
                "latest_time": "now",
            }
        ],
    },
    {
        "name": "DUO",
        "app_dependencies": [
            {
                "label": "Duo Security",
                "link": "https://splunkbase.splunk.com/app/3504/"
            }
        ],
        "macro_configurations": [
            {
                "macro_name": "cs_duo",
                "label": "DUO Data",
                "search_by": "source",
                "search_values": "duo",
                "earliest_time": "-1d@d",
                "latest_time": "now",
            }
        ],
    },
]

for product in PRODUCTS:
    product["app_dependency_search"] = build_app_dependency_search(product["app_dependencies"])
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
        if not macro_config.get("data_availablity_panel_search"):
            macro_config["data_availablity_panel_search"] = build_data_availablity_panel_search(
                macro=macro_config["macro_name"],
                by=macro_config["search_by"],
                values=macro_config["search_values"],
            )
        if not macro_config.get("source_latency_search"):
            macro_config["source_latency_search"] = build_source_latency_search(
                macro=macro_config["macro_name"],
                by=macro_config["search_by"],
                values=macro_config["search_values"],
            )

    if not product.get("metadata_count_search"):
        product["metadata_count_search"] = metadata_count_search[:-3]
