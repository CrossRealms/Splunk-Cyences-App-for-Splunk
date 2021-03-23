require([
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/simplexml/ready!'
], function ($, mvc) {

    'use strict';
    let submittedTokens = mvc.Components.getInstance('submitted');
    let defaultTokens = mvc.Components.getInstance('default');

    let all_alerts = {
        "Ransomware - Spike in File Writes": {
            contributing_events: 'index=* tag=endpoint tag=filesystem action=created',
            system_compromised_search: "| stats sum(count) as count by dest",
            system_compromised_drilldown: 'index=* tag=endpoint tag=filesystem action=created dest=$row.dest$'
        },
        "Ransomware - Endpoint Compromise - Fake Windows Processes": {
            contributing_events: 'index=* tag=process tag=report  process_path!="C:\\\Windows\\\System32*" process_path!="C:\\\Windows\\\SysWOW64*" | lookup update=true is_windows_system_file filename as process_name OUTPUT systemFile | search systemFile=true',
            system_compromised_search: "| stats sum(count) as count by dest",
            system_compromised_drilldown: 'index=* tag=process tag=report dest=$row.dest$  process_path!="C:\\\Windows\\\System32*" process_path!="C:\\\Windows\\\SysWOW64*" | lookup update=true is_windows_system_file filename as process_name OUTPUT systemFile | search systemFile=true',
            attacker_search: "| stats sum(count) as count by process_name, parent_process_name",
            attacker_drilldown: 'index=* tag=process tag=report process_name=$row.process_name$ parent_process_name=$row.parent_process_name$'
        },
        "Ransomware - Endpoint Compromise - Network Compromise - TOR Traffic": {
            contributing_events: 'index=* tag=network tag=communicate app=tor',
            system_compromised_search: "| stats sum(count) as count by dest_ip, dest_port",
            system_compromised_drilldown: 'index=* tag=network tag=communicate app=tor dest_ip=$row.dest_ip$',
            attacker_search: "| stats sum(count) as count by src_ip",
            attacker_drilldown: 'index=* tag=network tag=communicate app=tor src_ip=$row.src_ip$'
        },
        "Ransomware - Common Ransomware File Extensions": {
            contributing_events: 'index=* tag=endpoint tag=filesystem | rex field=file_name "(?<file_extension>\\.[^\\.]+)$" | `cs_ransomware_extensions`',
            system_compromised_search: "| stats sum(count) as count by dest",
            system_compromised_drilldown: 'index=* tag=endpoint tag=filesystem dest=$row.dest$',
            attacker_search: "| stats sum(count) as count by file_name",
            attacker_drilldown: 'index=* tag=endpoint tag=filesystem file_name=$row.file_name$'
        },
        "Ransomware - Scheduled tasks used in BadRabbit ransomware": {
            contributing_events: 'index=* tag=process tag=report process_name=schtasks.exe (process="*create*" OR process="*delete*") (process=*rhaegal* OR process=*drogon* OR *viserion_*)',
            system_compromised_search: "| stats sum(count) as count by dest, user",
            system_compromised_drilldown: 'index=* tag=process tag=report dest=$row.dest$',
            attacker_search: "| stats sum(count) as count, values(process) as process by process_name, parent_process_name",
            attacker_drilldown: 'index=* tag=process tag=report process_name=$row.process_name$'
        },
        "Ransomware - Common Ransomware Notes": {
            contributing_events: 'index=* tag=endpoint tag=filesystem | rex field=file_name "(?<file_extension>\\.[^\\.]+)$" | `ransomware_notes`',
            system_compromised_search: "| stats sum(count) as count by dest",
            system_compromised_drilldown: 'index=* tag=endpoint tag=filesystem dest=$row.dest$',
            attacker_search: "| stats sum(count) as count by file_name",
            attacker_drilldown: 'index=* tag=endpoint tag=filesystem file_name=$row.file_name$'
        },
        "Ransomware - Endpoint Compromise - USN Journal Deletion on Windows": {
            contributing_events: 'index=* tag=process tag=report process_name=fsutil.exe process="*deletejournal*" process="*usn*"',
            system_compromised_search: "| stats sum(count) as count by dest",
            system_compromised_drilldown: 'index=* tag=process tag=report dest=$row.dest$',
            attacker_search: "| stats sum(count) as count, values(process) as process by process_name, parent_process_name",
            attacker_drilldown: 'index=* tag=process tag=report process_name=$row.process_name$'
        },
        "Ransomware - Windows - Windows Event Log Cleared": {
            contributing_events: '((`cs_wineventlog_security` (EventCode=1102 OR EventCode=1100)) OR (`cs_wineventlog_system` EventCode=104))',
            system_compromised_search: "| stats sum(count) as count by dest, LogName",
            system_compromised_drilldown: '((`cs_wineventlog_security` (EventCode=1102 OR EventCode=1100)) OR (`cs_wineventlog_system` EventCode=104)) dest=$row.dest$',
            attacker_search: "| stats sum(count) as count by user",
            attacker_drilldown: '((`cs_wineventlog_security`) OR (`cs_wineventlog_system`)) user=$row.user$'
        },
        "Ransomware - Endpoint Compromise - Windows - WMI Lateral Movement": {
            contributing_events: '`cs_sysmon` EventCode=1 Image=*wmic* CommandLine="*/node*" CommandLine="*process call create*"',
            system_compromised_search: "| stats count by Computer",
            system_compromised_drilldown: '`cs_sysmon` EventCode=1 Image=*wmic* CommandLine="*/node*" CommandLine="*process call create*" Computer=$row.Computer$',
            attacker_search: "| stats count by CommandLine, Image, User",
            attacker_drilldown: '`cs_sysmon` EventCode=1 CommandLine=$row.CommandLine$'
        },

        "Windows - Hosts Missing Update": {
            system_compromised_search: "| dedup host | table host",
            system_compromised_drilldown: '`cs_wineventlog_system` EventCode=19 host=$row.host$'
        },
        "Windows - Endpoint Compromise - Windows Firewall Disabled Event": {
            contributing_events: '`cs_wineventlog_security` EventCode=4950 SettingType="Enable Windows Defender Firewall" SettingValue=No',
            system_compromised_search: "| stats count, values(ProfileChanged) as ProfileChanged by host",
            system_compromised_drilldown: '`cs_wineventlog_security` EventCode=4950 host=$row.host$'
        },
        "Windows - Windows Process Tampering Detected": {
            contributing_events: '`cs_sysmon` EventCode=25',
            system_compromised_search: "| stats count by Computer",
            system_compromised_drilldown: '`cs_sysmon` EventCode=25 Computer=$row.Computer$',
            attacker_search: "| stats count, values(ProcessId) as Processes by Image",
            attacker_drilldown: '`cs_sysmon` EventCode=25 ProcessId=$row.ProcessId$'
        },

        "Network Compromise - Basic Scanning": {
            contributing_events: 'index=* ( (tag=network tag=communicate) OR sourcetype=pan*traffic OR sourcetype=opsec OR sourcetype=cisco:asa)',
            system_compromised_search: "| stats count by sourcetype",
            system_compromised_drilldown: 'index=* sourcetype=$row.sourcetype$',
            attacker_search: "| stats count by src_ip",
            attacker_drilldown: 'index=* ( (tag=network tag=communicate) OR sourcetype=pan*traffic OR sourcetype=opsec OR sourcetype=cisco:asa) src_ip=$row.src_ip$',
        },
        
        "Palo Alto Firewall - Network Compromise - Palo Alto DNS Sinkhole": {
            contributing_events: '`cs_palo` sourcetype="pan:traffic" dest_ip="72.5.65.111"',
            system_compromised_search: "| stats sum(count) as count by dvc_name, rule, app, http_category",
            system_compromised_drilldown: '`cs_palo` sourcetype="pan:traffic" dest_ip="72.5.65.111" dvc_name=$row.dvc_name$',
            attacker_search: "| stats sum(count) as count by src_ip",
            attacker_drilldown: '`cs_palo` sourcetype="pan:traffic" src_ip=$row.src_ip$'
        },
        "Palo Alto Firewall - Network Compromise - Palo Alto High Threats Alert": {
            contributing_events: '`cs_palo` sourcetype="pan:threat" severity IN ("high" "critical")',
            system_compromised_search: "| stats sum(count) as count by dvc, dvc_name",
            system_compromised_drilldown: '`cs_palo` sourcetype="pan:threat" severity IN ("high" "critical") dvc=$row.dvc$ dvc_name=$row.dvc_name$',
            attacker_search: "| stats sum(count) as count, values(src_location) as src_location by src",
            attacker_drilldown: '`cs_palo` sourcetype="pan:threat" src=$row.src$'
        },
        "Palo Alto Firewall - Network Compromise - Palo Alto High System Alerts": {
            contributing_events: '`cs_palo` sourcetype="pan:system" severity IN ("high" "critical")',
            system_compromised_search: "| stats sum(count) as count by dvc, dvc_name",
            system_compromised_drilldown: '`cs_palo` sourcetype="pan:system" severity IN ("high" "critical") dvc=$row.dvc$ dvc_name=$row.dvc_name$'
        },
        "Palo Alto Firewall - Network Compromise - Palo Alto WildFire Alert": {
            contributing_events: '`cs_palo` sourcetype="pan:threat"  log_subtype="wildfire"',
            system_compromised_search: "| stats sum(count) as count by dvc, dvc_name",
            system_compromised_drilldown: '`cs_palo` sourcetype="pan:threat"  log_subtype="wildfire" dvc=$row.dvc$ dvc_name=$row.dvc_name$',
            attacker_search: "| stats sum(count) as count, values(src_location) as src_location by src",
            attacker_drilldown: '`cs_palo` sourcetype="pan:threat" log_subtype="wildfire" src=$row.src$'
        },

        "O365 - DLP event in Exchange": {
            contributing_events: '`cs_o365` Workload=Exchange UserId=DlpAgent',
            system_compromised_search: "| eval Email_To=mvappend(mvappend(To, CC), BCC) | mvexpand Email_To | stats count by Email_To",
            system_compromised_drilldown: '`cs_o365` Workload=Exchange UserId=DlpAgent | rename "ExchangeMetaData.From" as From, "ExchangeMetaData.To{}" as To, "ExchangeMetaData.CC{}" as CC, "ExchangeMetaData.BCC{}" as BCC | search (To=$row.Email_To$ OR CC=$row.Email_To$ OR BCC=$row.Email_To$)',
            attacker_search: "| stats count by From",
            attacker_drilldown: '`cs_o365` Workload=Exchange UserId=DlpAgent | rename "ExchangeMetaData.From" as From, "ExchangeMetaData.To{}" as To, "ExchangeMetaData.CC{}" as CC, "ExchangeMetaData.BCC{}" as BCC | search From=$row.From$'
        },
        "O365 - DLP event in SharePoint": {
            contributing_events: '`cs_o365` Workload=SharePoint UserId=DlpAgent',
            system_compromised_search: "| stats count by FileName, FilePathUrl",
            system_compromised_drilldown: '`cs_o365` Workload=SharePoint UserId=DlpAgent | rename "SharePointMetaData.From" as From, "SharePointMetaData.FileName" as FileName, "SharePointMetaData.FilePathUrl" as FilePathUrl | search FileName=$row.FileName$',
            attacker_search: "| stats count by From",
            attacker_drilldown: '`cs_o365` Workload=SharePoint UserId=DlpAgent | rename "SharePointMetaData.From" as From, "SharePointMetaData.FileName" as FileName, "SharePointMetaData.FilePathUrl" as FilePathUrl | search From=$row.From$'
        },

        "Credential Compromise - Windows - Credential Dumping through LSASS Access": {
            contributing_events: '`cs_sysmon` EventCode=10 TargetImage=*lsass.exe (GrantedAccess=0x1010 OR GrantedAccess=0x1410)',
            system_compromised_search: "| stats sum(count) as count by Computer",
            system_compromised_drilldown: '`cs_sysmon` EventCode=10 TargetImage=*lsass.exe Computer=$row.Computer$',
            attacker_search: "| stats sum(count) as count by SourceImage",
            attacker_drilldown: '`cs_sysmon` EventCode=10 TargetImage=*lsass.exe SourceImage=$row.SourceImage$'
        },
        "Credential Compromise - Windows - Credential Dumping via Symlink to Shadow Copy": {
            contributing_events: 'index=* tag=process tag=report process_name="cmd.exe" process=*mklink* process=*HarddiskVolumeShadowCopy*',
            system_compromised_search: "| stats sum(count) as count by dest",
            system_compromised_drilldown: 'index=* tag=process tag=report process_name="cmd.exe" dest=$row.dest$',
            attacker_search: "| stats sum(count) as count by process, process_name, parent_process",
            attacker_drilldown: 'index=* tag=process tag=report process="cmd.exe" process=$row.process$'
        },
        "Credential Compromise - Windows - Credential Dumping via Copy Command from Shadow Copy": {
            contributing_events: 'index=* tag=process tag=report process_name=cmd.exe (process=*\\\\system32\\\\config\\\\sam* OR process=*\\\\system32\\\\config\\\\security* OR process=*\\\\system32\\\\config\\\\system* OR process=*\\\\windows\\\\ntds\\\\ntds.dit*)',
            system_compromised_search: "| stats sum(count) as count by dest",
            system_compromised_drilldown: 'index=* tag=process tag=report process_name="cmd.exe" dest=$row.dest$',
            attacker_search: "| stats sum(count) as count by process, process_name, parent_process",
            attacker_drilldown: 'index=* tag=process tag=report process="cmd.exe" process=$row.process$'
        },
        "Credential Compromise - Windows - Credential Dump From Registry via Reg exe": {
            contributing_events: 'index=* tag=process tag=report (process_name=reg.exe OR process_name=cmd.exe) process=*save* (process=*HKEY_LOCAL_MACHINE\\\\Security* OR process=*HKEY_LOCAL_MACHINE\\\\SAM* OR process=*HKEY_LOCAL_MACHINE\\\\System* OR process=*HKLM\\\\Security* OR process=*HKLM\\\\System* OR process=*HKLM\\\\SAM*)',
            system_compromised_search: "| stats sum(count) as count by dest",
            system_compromised_drilldown: 'index=* tag=process tag=report process IN ("cmd.exe", "reg.exe") dest=$row.dest$',
            attacker_search: "| stats sum(count) as count by process, process_name, parent_process",
            attacker_drilldown: 'index=* tag=process tag=report process IN ("cmd.exe", "reg.exe") process=$row.process$'
        },

        "Sophos - Endpoint Not Protected by Sophos": {
            contributing_events: '`cs_sophos` type="Event::Endpoint::NotProtected"',
            system_compromised_search: "| stats sum(count) as count by dhost",
            system_compromised_drilldown: '`cs_sophos` dhost=$row.dhost$',
            system_compromised_drilldown: '`cs_sophos` dhost=$row.dhost$'
        },
        "Sophos - Sophos RealTime Protection Disabled": {
            contributing_events: '`cs_sophos` type="Event::Endpoint::SavDisabled"',
            system_compromised_search: "| stats sum(count) as count by dhost",
            system_compromised_drilldown: '`cs_sophos` dhost=$row.dhost$'
        },
        "Sophos - Sophos Service is not Running": {
            contributing_events: '`cs_sophos` type="Event::Endpoint::ServiceNotRunning"',
            system_compromised_search: "| stats sum(count) as count by dhost",
            system_compromised_drilldown: '`cs_sophos` dhost=$row.dhost$'
        },
        "Sophos - Failed to clean up threat by Sophos": {
            contributing_events: '`cs_sophos` type IN ("Event::Endpoint::Threat::CleanupFailed", "Event::Endpoint::CoreCleanFailed", "Event::Endpoint::CoreHmpaCleanFailed", "Event::Endpoint::CoreSystemCleanFailed")',
            system_compromised_search: "| stats sum(count) as count by dhost",
            system_compromised_drilldown: '`cs_sophos` dhost=$row.dhost$'
        },

        "Windows Defender - Endpoint Not Protected by Windows Defender": {
            contributing_events: '`cs_windows_defender` EventCode IN (2042, 5008, 5012)',
            system_compromised_search: "| stats count by host",
            system_compromised_drilldown: '`cs_windows_defender` host=$row.host$'
        },
        "Windows Defender - Windows Defender RealTime Protection Disabled or Failed": {
            contributing_events: '`cs_windows_defender` (EventCode IN (5001, 3002) OR (EventCode=1151 AND RTP_state!="Enabled"))',
            system_compromised_search: "| stats count by host",
            system_compromised_drilldown: '`cs_windows_defender` host=$row.host$'
        },

        "CrowdStrike - Suspicious Activity or Malware Detected by CrowdStrike": {
            contributing_events: '`cs_crowdstrike_eventstream` "metadata.eventType"=DetectionSummaryEvent action="allowed"',
            system_compromised_search: "| stats count by ComputerName",
            system_compromised_drilldown: '`cs_crowdstrike_eventstream` "metadata.eventType"=DetectionSummaryEvent "event.ComputerName"=$row.ComputerName$',
            attacker_search: "| stats count by UserName",
            attacker_drilldown: '`cs_crowdstrike_eventstream` "metadata.eventType"=DetectionSummaryEvent "event.UserName"=$row.UserName$'
        },

        "Splunk Admin - Missing Data in the Index": {
            system_compromised_search: "| stats count by index",
            system_compromised_drilldown: 'index=$row.index$ | timechart count by host'
        },
        "Splunk Admin - Missing Forwarder": {
            system_compromised_search: "| stats count, values(forwarder_type) as forwarder_type, values(version) as version, values(arch) as arch, values(os) as os by hostname",
            system_compromised_drilldown: 'index=_internal host=$row.hostname$ | timechart count'
        },

        "Authentication - Bruteforce Attempt for a User": {
            contributing_events: 'index=* `cs_authentication_indexes` tag=authentication action="failure"',
            system_compromised_search: "| stats sum(count) as count by app",
            system_compromised_drilldown: 'index=* `cs_authentication_indexes` tag=authentication action="failure" app=$row.app$',
            attacker_search: "| stats sum(count) as count by user",
            attacker_drilldown: 'index=* `cs_authentication_indexes` tag=authentication action="failure" user=$row.user$'
        },
        "Authentication - Bruteforce Attempt from a Source": {
            contributing_events: 'index=* `cs_authentication_indexes` tag=authentication action="failure"',
            system_compromised_search: "| stats sum(count) as count by app",
            system_compromised_drilldown: 'index=* `cs_authentication_indexes` tag=authentication action="failure" app=$row.app$',
            attacker_search: "| stats sum(count) as count by src",
            attacker_drilldown: 'index=* `cs_authentication_indexes` tag=authentication action="failure" src=$row.src$'
        },
        "Authentication - Excessive Failed VPN Logins for a User": {
            contributing_events: 'index=* `cs_vpn_indexes` tag=authentication action="failure" dest="vpn_auth"',
            system_compromised_search: "| stats sum(count) as count by app",
            system_compromised_drilldown: 'index=* `cs_vpn_indexes` tag=authentication action="failure" dest="vpn_auth" app=$row.app$',
            attacker_search: "| stats sum(count) as count by user",
            attacker_drilldown: 'index=* `cs_vpn_indexes` tag=authentication action="failure" dest="vpn_auth" user=$row.user$'
        },
        "Authentication - Excessive Failed VPN Logins from a Source": {
            contributing_events: 'index=* `cs_vpn_indexes` tag=authentication action="failure" dest="vpn_auth"',
            system_compromised_search: "| stats sum(count) as count by app",
            system_compromised_drilldown: 'index=* `cs_vpn_indexes` tag=authentication action="failure" dest="vpn_auth" app=$row.app$',
            attacker_search: "| stats sum(count) as count by src",
            attacker_drilldown: 'index=* `cs_vpn_indexes` tag=authentication action="failure" dest="vpn_auth" src=$row.src$'
        },
    };


    let savedsearch_name;
    let system_compromised_drilldown;
    let attacker_drilldown;

    submittedTokens.on("change:tkn_savedsearch", function () {
        savedsearch_name = submittedTokens.get("tkn_savedsearch");
        console.log(`Updated savedsearch token ${savedsearch_name}`);

        if (all_alerts[savedsearch_name] === undefined) {
            return;
        }

        // Contributing Events
        if (all_alerts[savedsearch_name].contributing_events) {
            submittedTokens.set("contributing_events_search", `${all_alerts[savedsearch_name].contributing_events} | sort - count`);
        }
        else {
            submittedTokens.unset("contributing_events");
            console.log("No forensic search to see contributing events.");
        }

        // Compromised Systems
        if (all_alerts[savedsearch_name].system_compromised_search) {
            submittedTokens.set("system_compromised_search", `${all_alerts[savedsearch_name].system_compromised_search} | sort - count`);
            submittedTokens.set("system_compromised_drilldown", all_alerts[savedsearch_name].system_compromised_drilldown);
            system_compromised_drilldown = all_alerts[savedsearch_name].system_compromised_drilldown;
        }
        else {
            submittedTokens.unset("system_compromised_search");
            console.log("No forensic search present for finding compromised system.");
        }

        // Attackers / Signature
        if (all_alerts[savedsearch_name].attacker_search) {
            submittedTokens.set("attacker_search", `${all_alerts[savedsearch_name].attacker_search} | sort - count`);
            submittedTokens.set("attacker_drilldown", all_alerts[savedsearch_name].attacker_drilldown);
            attacker_drilldown = all_alerts[savedsearch_name].attacker_drilldown;
        }
        else {
            submittedTokens.unset("attacker_search");
            console.log("No forensic search present for finding attacker.");
        }
    });


    function getTableHeaders(tableId) {
        let columnHeaders = $('#' + tableId + ' table th');
        columnHeaders = $.makeArray(columnHeaders).map(function (value) { return value.innerText; }); // if required add trimming
        return columnHeaders;
    }

    function tableDrilldown(e, tableId, search_id){
        e.preventDefault(); // Prevents the default splunk drilldown behaviour

        let $cell = $(e.originalEvent.target).closest("td");
        let selectedValues = $.makeArray($cell.parent("tr").children("td")).map(function (value) { return value.innerText; }); // get full row values, do trimming if requires
        let columnHeaders = getTableHeaders(tableId);
        let drilldown_search = eval(search_id);

        for (let rowno in columnHeaders) {
            let field = columnHeaders[rowno];
            let value = selectedValues[rowno];
            drilldown_search = drilldown_search.replace(`$row.${field}$`, `"${value}"`);
        }

        window.open(`/app/cyences_app_for_splunk/search?q=${drilldown_search}&earliest=${submittedTokens.get("timeRange.earliest")}&latest=${submittedTokens.get("timeRange.latest")}`);
    }

    let compromiseSystemTableDrilldown = function (e) {
        tableDrilldown(e, "table_system_compromised", "system_compromised_drilldown");
    }
    let attackerTableDrilldown = function (e) {
        tableDrilldown(e, "table_attacker", "attacker_drilldown");
    }

    mvc.Components.get("table_system_compromised").getVisualization(function (tableView) {
        tableView.on('click:cell', compromiseSystemTableDrilldown);
    });
    mvc.Components.get("table_attacker").getVisualization(function (tableView) {
        tableView.on('click:cell', attackerTableDrilldown);
    });

});
