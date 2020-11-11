require([
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/searchmanager',
    "splunkjs/mvc/postprocessmanager",
    'splunkjs/mvc/simplexml/ready!'
], function ($, mvc, SearchManager, PostProcessManager) {

    'use strict';
    var submittedTokens = mvc.Components.getInstance('submitted');
    var defaultTokens = mvc.Components.getInstance('default');

    let all_alerts = {
        "Ransomware - Spike in File Writes": {
            system_compromised_search: "| stats sum(count) as count by dest"
        },
        "Ransomware - Endpoint Compromise - Fake Windows Processes": {
            system_compromised_search: "| stats sum(count) as count by dest",
            attacker_search: "| stats sum(count) as count by process_name, parent_process_name"
        },
        "Ransomware - Endpoint Compromise - Network Compromise - TOR Traffic": {
            system_compromised_search: "| stats sum(count) as count by dest_ip, dest_port",
            attacker_search: "| stats sum(count) as count by src_ip"
        },
        "Ransomware - Common Ransomware File Extensions": {
            system_compromised_search: "| stats sum(count) as count, values(dest) as dest by file_name"
        },
        "Ransomware - Scheduled tasks used in BadRabbit ransomware": {
            system_compromised_search: "| stats sum(count) as count by dest, user",
            attacker_search: "| stats sum(count) as count, values(process) as process by process_name, parent_process_namee"
        },
        "Ransomware - Common Ransomware Notes": {
            system_compromised_search: "| stats sum(count) as count, values(dest) as dest by file_name"
        },
        "Ransomware - Endpoint Compromise - USN Journal Deletion on Windows": {
            system_compromised_search: "| stats sum(count) as count by dest",
            attacker_search: "| stats sum(count) as count, values(process) as process by process_name, parent_process_name"
        },
        "Ransomware - Windows - Windows Event Log Cleared": {
            system_compromised_search: "| stats sum(count) as count by dest, LogName",
            attacker_search: "| stats sum(count) as count by User"
        },
        "Ransomware - Endpoint Compromise - Windows - WMI Lateral Movement": {
            system_compromised_search: "| stats count by Computer",
            attacker_search: "| stats count by CommandLine, Image, User"
        },
        "Windows - Hosts Missing Update": {
            system_compromised_search: "| dedup host | table host"
        },
        "Windows - Endpoint Compromise - Windows Firewall Disabled Event": {
            system_compromised_search: "| stats count, values(ProfileChanged) as ProfileChanged by host",
        },
        "Network Compromise - Basic Scanning": {
            system_compromised_search: "| stats count by sourcetype",
            attacker_search: "| stats count by src_ip"
        },
        "PaloAlto Firewall - Network Compromise - PaloAlto DNS Sinkhole": {
            system_compromised_search: "| stats sum(count) as count by dvc_name, rule, app, http_category",
            attacker_search: "| stats sum(count) as count by src_ip"
        },
        "O365 - DLP event in Exchange": {
            system_compromised_search: "| eval Email_To=mvappend(mvappend(To, CC), BCC) | mvexpand Email_To | stats count by Email_To",
            attacker_search: "| stats count by From"
        },
        "O365 - DLP event in SharePoint": {
            system_compromised_search: "| stats count by FileName, FilePathUrl",
            attacker_search: "| stats count by From"
        },
        "Credential Compromise - Windows - Credential Dumping through LSASS Access": {
            system_compromised_search: "| stats sum(count) as count by Computer",
            attacker_search: "| stats sum(count) as count by SourceImage"
        },
        "Credential Compromise - Windows - Credential Dumping via Symlink to Shadow Copy": {
            system_compromised_search: "| stats sum(count) as count by dest",
            attacker_search: "| stats sum(count) as count, values(process) as process by process_name, parent_process"
        },
        "Credential Compromise - Windows - Credential Dumping via Copy Command from Shadow Copy": {
            system_compromised_search: "| stats sum(count) as count by dest",
            attacker_search: "| stats sum(count) as count, values(process) as process by process_name, parent_process"
        },
        "Credential Compromise - Windows - Credential Dump From Registry via Reg exe": {
            system_compromised_search: "| stats sum(count) as count by dest",
            attacker_search: "| stats sum(count) as count, values(process) as process by process_name"
        },
        "Sophos - Endpoint Protection - Endpoint Not Protected": {
            system_compromised_search: "| stats sum(count) as count by dhost"
        },
        "Sophos - Endpoint Protection - Sophos RealTime Protection Disabled": {
            system_compromised_search: "| stats sum(count) as count by dhost"
        },
        "Sophos - Endpoint Protection - Sophos Service is not Running": {
            system_compromised_search: "| stats sum(count) as count by dhost"
        },
        "Sophos - Endpoint Protection - Failed to clean up threat": {
            system_compromised_search: "| stats sum(count) as count by dhost"
        }
    };

    submittedTokens.on("change:tkn_savedsearch", function(){
        let savedsearch_name = submittedTokens.get("tkn_savedsearch");

        if(all_alerts[savedsearch_name].system_compromised_search){
            submittedTokens.set("forensic_system_compromise", "1");
            new PostProcessManager({
                id: "system_compromised_search",
                managerid: "all_results",
                search: `${all_alerts[savedsearch_name].system_compromised_search} | sort - count`
            });
        }
        else{
            submittedTokens.unset("forensic_system_compromise");
            console.log("No forensic search present for finding compromised system.");
        }

        if(all_alerts[savedsearch_name].attacker_search){
            submittedTokens.set("forensic_attacker", "1");
            new PostProcessManager({
                id: "attacker_search",
                managerid: "all_results",
                search: `${all_alerts[savedsearch_name].attacker_search} | sort - count`
            });                
        }
        else{
            submittedTokens.unset("forensic_attacker");
            console.log("No forensic search present for finding attacker.");
        }


    });

});
