require([
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/searchmanager',
    'splunkjs/mvc/simplexml/ready!'
], function ($, mvc, SearchManager) {

    // Defining model tokens
    'use strict';
    var submittedTokens = mvc.Components.getInstance('submitted');
    var defaultTokens = mvc.Components.getInstance('default');

    let all_macros = [
        /* Data Macros */
        { macro_name: 'cs_sophos', input_id: 'macro_data_sophos', button_id: 'macro_data_sophos_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_windows_defender', input_id: 'macro_data_windows_defender', button_id: 'macro_data_windows_defender_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_crowdstrike_eventstream', input_id: 'macro_data_crowdstrike_eventstream', button_id: 'macro_data_crowdstrike_eventstream_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_crowdstrike_vuln', input_id: 'macro_data_crowdstrike_vuln', button_id: 'macro_data_crowdstrike_vuln_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_kaspersky', input_id: 'macro_data_kaspersky', button_id: 'macro_data_kaspersky_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_o365', input_id: 'macro_data_o365', button_id: 'macro_data_o365_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_azure_securityscore', input_id: 'macro_data_azure_securityscore', button_id: 'macro_data_azure_securityscore_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_wineventlog_security', input_id: 'macro_data_wineventlog_security', button_id: 'macro_data_wineventlog_security_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_wineventlog_system', input_id: 'macro_data_wineventlog_system', button_id: 'macro_data_wineventlog_system_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_ad_active_directory', input_id: 'macro_data_ad_active_directory', button_id: 'macro_data_ad_active_directory_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_ad_health_logs', input_id: 'macro_data_ad_health_logs', button_id: 'macro_data_ad_health_logs_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_sysmon', input_id: 'macro_data_sysmon', button_id: 'macro_data_sysmon_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_fortigate', input_id: 'macro_data_fortigate', button_id: 'macro_data_fortigate_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_palo', input_id: 'macro_data_palo', button_id: 'macro_data_palo_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_vpn_indexes', input_id: 'macro_data_vpn', button_id: 'macro_data_vpn_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_authentication_indexes', input_id: 'macro_data_authentication', button_id: 'macro_data_authentication_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_lansweeper', input_id: 'macro_data_lansweeper', button_id: 'macro_data_lansweeper_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_qualys', input_id: 'macro_data_qualys', button_id: 'macro_data_qualys_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_tenable', input_id: 'macro_data_tenable', button_id: 'macro_data_tenable_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_linux', input_id: 'macro_data_linux', button_id: 'macro_data_linux_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_o365_defender_atp', input_id: 'macro_data_o365_defender_atp', button_id: 'macro_data_o365_defender_atp_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_aws', input_id: 'macro_data_aws', button_id: 'macro_data_aws_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_gsuite', input_id: 'macro_data_gsuite', button_id: 'macro_data_gsuite_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_cisco_ios', input_id: 'macro_data_cisco_ios', button_id: 'macro_data_cisco_ios_button', msg_id: 'macro_data_msg'},

        /* Other Macros */
        { macro_name: 'cs_ad_password_change_outside_working_hour_definition', input_id: 'macro_cs_ad_password_change_outside_working_hour_definition', button_id: 'macro_cs_ad_password_change_outside_working_hour_definition_button', msg_id: 'macro_other_msg'},
        { macro_name: 'cs_home_country', input_id: 'macro_cs_home_country', button_id: 'macro_cs_home_country_button', msg_id: 'macro_other_msg'},
        { macro_name: 'cs_network_home_location_lat', input_id: 'macro_cs_network_home_location_lat', button_id: 'macro_cs_network_home_location_lat_button', msg_id: 'macro_other_msg'},
        { macro_name: 'cs_network_home_location_lon', input_id: 'macro_cs_network_home_location_lon', button_id: 'macro_cs_network_home_location_lon_button', msg_id: 'macro_other_msg'},
        { macro_name: 'cs_palo_search_blocked_ip_lookup_name', input_id: 'macro_cs_palo_search_blocked_ip_lookup_name', button_id: 'macro_cs_palo_search_blocked_ip_lookup_name_button', msg_id: 'macro_other_msg'},
        { macro_name: 'cs_palo_malicious_ip_list_filter_old_results', input_id: 'macro_cs_palo_malicious_ip_list_filter_old_results', button_id: 'macro_cs_palo_malicious_ip_list_filter_old_results_button', msg_id: 'macro_other_msg'},
        { macro_name: 'cs_lansweeper_timerange', input_id: 'macro_cs_lansweeper_timerange', button_id: 'macro_cs_lansweeper_timerange_button', msg_id: 'macro_other_msg'},
        { macro_name: 'cs_wineventlog_security_timerange', input_id: 'macro_cs_wineventlog_security_timerange', button_id: 'macro_cs_wineventlog_security_timerange_button', msg_id: 'macro_other_msg'},
        { macro_name: 'cs_wineventlog_system_timerange', input_id: 'macro_cs_wineventlog_system_timerange', button_id: 'macro_cs_wineventlog_system_timerange_button', msg_id: 'macro_other_msg'},
        { macro_name: 'cs_sysmon_timerange', input_id: 'macro_cs_sysmon_timerange', button_id: 'macro_cs_sysmon_timerange_button', msg_id: 'macro_other_msg'},
        { macro_name: 'cs_qualys_timerange', input_id: 'macro_cs_qualys_timerange', button_id: 'macro_cs_qualys_timerange_button', msg_id: 'macro_other_msg'},
        { macro_name: 'cs_qualys_linux_os', input_id: 'macro_cs_qualys_linux_os', button_id: 'macro_cs_qualys_linux_os_button', msg_id: 'macro_other_msg'},
        { macro_name: 'cs_ad_important_role', input_id: 'macro_cs_ad_important_role', button_id: 'macro_cs_ad_important_role_button', msg_id: 'macro_other_msg'},
        { macro_name: 'cs_ad_important_policy', input_id: 'macro_cs_ad_important_policy', button_id: 'macro_cs_ad_important_policy_button', msg_id: 'macro_other_msg'},
        { macro_name: 'cs_ad_important_user', input_id: 'macro_cs_ad_important_user', button_id: 'macro_cs_ad_important_user_button', msg_id: 'macro_other_msg'},
        { macro_name: 'cs_ad_important_group', input_id: 'macro_cs_ad_important_group', button_id: 'macro_cs_ad_important_group_button', msg_id: 'macro_other_msg'},

        /* Data-model */
        { macro_name: 'cs_summariesonly_endpoint', input_id: 'macro_datamodel_endpoint', button_id: 'macro_datamodel_endpoint_button', msg_id: 'macro_datamodel_msg'},
        { macro_name: 'cs_summariesonly_network_traffic', input_id: 'macro_datamodel_network_traffic', button_id: 'macro_datamodel_network_traffic_button', msg_id: 'macro_datamodel_msg'},
        { macro_name: 'cs_summariesonly_authentication', input_id: 'macro_datamodel_authentication', button_id: 'macro_datamodel_authentication_button', msg_id: 'macro_datamodel_msg'},
        { macro_name: 'cs_summariesonly_network_resolution_dns', input_id: 'macro_datamodel_network_resolution_dns', button_id: 'macro_datamodel_network_resolution_dns_button', msg_id: 'macro_datamodel_msg'},
        { macro_name: 'cs_summariesonly_cyences_vulnerabilities', input_id: 'macro_datamodel_cyences_vulnerabilities', button_id: 'macro_datamodel_cyences_vulnerabilities_button', msg_id: 'macro_datamodel_msg'},
        { macro_name: 'cs_summariesonly_cyences_assets', input_id: 'macro_datamodel_cyences_assets', button_id: 'macro_datamodel_cyences_assets_button', msg_id: 'macro_datamodel_msg'},

        /* Windows & AD */
        { macro_name: 'cs_ad_bulk_user_creation_deletion_count_limit', input_id: 'macro_cs_ad_bulk_user_creation_deletion_count_limit', button_id: 'macro_cs_ad_bulk_user_creation_deletion_count_limit_button', msg_id: 'macro_windows_msg'},

        /* O365 */
        { macro_name: 'cs_o365_failed_login_outside_country_filter', input_id: 'macro_cs_o365_failed_login_outside_country_filter', button_id: 'macro_cs_o365_failed_login_outside_country_filter_button', msg_id: 'macro_o365_msg'},

        /* Email */
        { macro_name: 'cs_email_increase_over_baseline_limit_in_percentage', input_id: 'macro_cs_email_increase_over_baseline_limit_in_percentage', button_id: 'macro_cs_email_increase_over_baseline_limit_in_percentage_button', msg_id: 'macro_email_msg'},

        /* Network */
        { macro_name: 'cs_network_traffic_map_filter', input_id: 'macro_cs_network_traffic_map_filter', button_id: 'macro_cs_network_traffic_map_filter_button', msg_id: 'macro_network_msg'},
        { macro_name: 'cs_network_scanning_map_filter', input_id: 'macro_cs_network_scanning_map_filter', button_id: 'macro_cs_network_scanning_map_filter_button', msg_id: 'macro_network_msg'},

        /* Palo Alto */
        { macro_name: 'cs_palo_ddos_prevented_filter', input_id: 'macro_cs_palo_ddos_prevented_filter', button_id: 'macro_cs_palo_ddos_prevented_filter_button', msg_id: 'macro_palo_msg'},
        { macro_name: 'cs_palo_firewall_login_failure_filter', input_id: 'macro_cs_palo_firewall_login_failure_filter', button_id: 'macro_cs_palo_firewall_login_failure_filter_button', msg_id: 'macro_palo_msg'},
        { macro_name: 'cs_palo_blocked_ip_inbound_filter', input_id: 'macro_cs_palo_blocked_ip_inbound_filter', button_id: 'macro_cs_palo_blocked_ip_inbound_filter_button', msg_id: 'macro_palo_msg'},
        { macro_name: 'cs_palo_blocked_ip_outbound_filter', input_id: 'macro_cs_palo_blocked_ip_outbound_filter', button_id: 'macro_cs_palo_blocked_ip_outbound_filter_button', msg_id: 'macro_palo_msg'},
        { macro_name: 'cs_palo_malicious_ip_list_filter', input_id: 'macro_cs_palo_malicious_ip_list_filter', button_id: 'macro_cs_palo_malicious_ip_list_filter_button', msg_id: 'macro_palo_msg'},

        /* Sophos */
        { macro_name: 'cs_sophos_update_errors_filter', input_id: 'macro_cs_sophos_update_errors_filter', button_id: 'macro_cs_sophos_update_errors_filter_button', msg_id: 'macro_sophos_msg'},
        { macro_name: 'cs_sophos_endpoint_outofdate_filter', input_id: 'macro_cs_sophos_endpoint_outofdate_filter', button_id: 'macro_cs_sophos_endpoint_outofdate_filter_button', msg_id: 'macro_sophos_msg'},
        { macro_name: 'cs_sophos_core_restore_failed_filter', input_id: 'macro_cs_sophos_core_restore_failed_filter', button_id: 'macro_cs_sophos_core_restore_failed_filter_button', msg_id: 'macro_sophos_msg'},
        { macro_name: 'cs_sophos_expiration_messages_filter', input_id: 'macro_cs_sophos_expiration_messages_filter', button_id: 'macro_cs_sophos_expiration_messages_filter_button', msg_id: 'macro_sophos_msg'},
        { macro_name: 'cs_sophos_exploit_prevented', input_id: 'macro_cs_sophos_exploit_prevented', button_id: 'macro_cs_sophos_exploit_prevented_button', msg_id: 'macro_sophos_msg'},
        { macro_name: 'cs_sophos_malware_detected', input_id: 'macro_cs_sophos_malware_detected', button_id: 'macro_cs_sophos_malware_detected_button', msg_id: 'macro_sophos_msg'},

        /* Windows Defender */
        { macro_name: 'cs_windows_defender_update_errors_filter', input_id: 'macro_cs_windows_defender_update_errors_filter', button_id: 'macro_cs_windows_defender_update_errors_filter_button', msg_id: 'macro_windows_defender_msg'},
        { macro_name: 'cs_windows_defender_antivirus_expired_filter', input_id: 'macro_cs_windows_defender_antivirus_expired_filter', button_id: 'macro_cs_windows_defender_antivirus_expired_filter_button', msg_id: 'macro_windows_defender_msg'},
        { macro_name: 'cs_windows_defender_antivirus_dropped_support_for_os_filter', input_id: 'macro_cs_windows_defender_antivirus_dropped_support_for_os_filter', button_id: 'macro_cs_windows_defender_antivirus_dropped_support_for_os_filter_button', msg_id: 'macro_windows_defender_msg'},
        { macro_name: 'cs_windows_defender_antivirus_will_expired_filter', input_id: 'macro_cs_windows_defender_antivirus_will_expired_filter', button_id: 'macro_cs_windows_defender_antivirus_will_expired_filter_button', msg_id: 'macro_windows_defender_msg'},
        { macro_name: 'cs_windows_defender_antivirus_will_dropped_support_for_os_filter', input_id: 'macro_cs_windows_defender_antivirus_will_dropped_support_for_os_filter', button_id: 'macro_cs_windows_defender_antivirus_will_dropped_support_for_os_filter_button', msg_id: 'macro_windows_defender_msg'},
        { macro_name: 'cs_windows_defender_antivirus_scan_failed_filter', input_id: 'macro_cs_windows_defender_antivirus_scan_failed_filter', button_id: 'macro_cs_windows_defender_antivirus_scan_failed_filter_button', msg_id: 'macro_windows_defender_msg'},
        { macro_name: 'cs_windows_defender_unable_to_download_offline_scan_filter', input_id: 'macro_cs_windows_defender_unable_to_download_offline_scan_filter', button_id: 'macro_cs_windows_defender_unable_to_download_offline_scan_filter_button', msg_id: 'macro_windows_defender_msg'},
        { macro_name: 'cs_windows_defender_malware_detected_filter', input_id: 'macro_cs_windows_defender_malware_detected_filter', button_id: 'macro_cs_windows_defender_malware_detected_filter_button', msg_id: 'macro_windows_defender_msg'},

        /* CrowdStrike */
        { macro_name: 'cs_crowdstrike_malware_detected_report_filter', input_id: 'macro_cs_crowdstrike_malware_detected_report_filter', button_id: 'macro_cs_crowdstrike_malware_detected_report_filter_button', msg_id: 'macro_crowdstrike_msg'},
        { macro_name: 'cs_crowdstrike_malware_prevented_filter', input_id: 'macro_cs_crowdstrike_malware_prevented_filter', button_id: 'macro_cs_crowdstrike_malware_prevented_filter_button', msg_id: 'macro_crowdstrike_msg'},

        /* VPN */
        { macro_name: 'cs_vpn_dashboard_filter', input_id: 'macro_cs_vpn_dashboard_filter', button_id: 'macro_cs_vpn_dashboard_filter_button', msg_id: 'macro_vpn_msg'},

        /* Authentication */
        { macro_name: 'cs_authentication_app_filter', input_id: 'macro_cs_authentication_app_filter', button_id: 'macro_cs_authentication_app_filter_button', msg_id: 'macro_authentication_msg'},
        { macro_name: 'cs_bruteforce_from_user_additional_filter', input_id: 'macro_cs_bruteforce_from_user_additional_filter', button_id: 'macro_cs_bruteforce_from_user_additional_filter_button', msg_id: 'macro_authentication_msg'},
        { macro_name: 'cs_bruteforce_from_source_additional_filter', input_id: 'macro_cs_bruteforce_from_source_additional_filter', button_id: 'macro_cs_bruteforce_from_source_additional_filter_button', msg_id: 'macro_authentication_msg'},
        { macro_name: 'cs_authentication_bruteforce_attempt_limit', input_id: 'macro_cs_authentication_bruteforce_attempt_limit', button_id: 'macro_cs_authentication_bruteforce_attempt_limit_button', msg_id: 'macro_authentication_msg'},
        { macro_name: 'cs_authentication_excessive_vpn_login_failure_limit', input_id: 'macro_cs_authentication_excessive_vpn_login_failure_limit', button_id: 'macro_cs_authentication_excessive_vpn_login_failure_limit_button', msg_id: 'macro_authentication_msg'},
        { macro_name: 'cs_authentication_new_location_login_pct_limit', input_id: 'macro_cs_authentication_new_location_login_pct_limit', button_id: 'macro_cs_authentication_new_location_login_pct_limit_button', msg_id: 'macro_authentication_msg'},
        { macro_name: 'cs_authentication_vpn_session_duration_limit', input_id: 'macro_cs_authentication_vpn_session_duration_limit', button_id: 'macro_cs_authentication_vpn_session_duration_limit_button', msg_id: 'macro_authentication_msg'},

    ];
   
    // Defining search and search manager
    var searchString = '| rest /servicesNS/-/cyences_app_for_splunk/configs/conf-macros splunk_server=local | search "eai:acl.app"="cyences_app_for_splunk" | table title, definition';
    var searchManager = new SearchManager({
        preview: true,
        autostart: true,
        search: searchString,
        cache: false
    });


    // Processing results search manager.
    var searchManagerResults = searchManager.data("results", {count: 0});
    searchManagerResults.on('data', function () {
        if (searchManagerResults.data()) {
            // set all the macro values in the input text field
            $.each(searchManagerResults.data().rows, function (index, row) {
                let macro_name = row[0];
                let macro_definition = row[1];

                $.each(all_macros, function(index, macro){
                    if(macro.macro_name == macro_name){
                        $(`#${macro.input_id}`).val(macro_definition);
                    }
                });
            });
        }
    });


    function updateMacroDefinition(macro_name, macro_definition, msg_location){
        let searchString = `| updatemacrodefinition macro_name="${macro_name}" macro_definition="${macro_definition}"`;
        let sm = new SearchManager({
            preview: true,
            autostart: true,
            search: searchString,
            cache: false
        });

        // Post macro update
        let searchManagerResults = sm.data("results");
        searchManagerResults.on('data', function () {
            $(msg_location).addClass('success_msg');
            $(msg_location).removeClass('error_msg');
            $(msg_location).text(`Macro definition for ${macro_name} has been updated.`);
        });
        searchManagerResults.on('error', function () {
            $(msg_location).addClass('error_msg');
            $(msg_location).removeClass('success_msg');
            $(msg_location).text(`Error updating the macro definition for ${macro_name}.`);
        });
    }

    $.each(all_macros, function(index, macro){
        $(`#${macro.button_id}`).on("click", function(){
            let value = $(`#${macro.input_id}`).val();
            value = value.replace(/\\/g, '\\\\');   // \(back slash) from user input need to replace with double back slash, and double back slash as 4 back slashes
            value = value.replace(/"/g, '\\\"');   // Prepend "(double quotes) with back slash
            // Need to escape above two for search that we need to run in order to update the macro definition.
            updateMacroDefinition(`${macro.macro_name}`, value, `#${macro.msg_id}`);
        });
    });

    function getHoneyDBConfiguration(){
        let service = mvc.createService();
        service.get("/HoneyDBConfiguration", {}, function(error, response){
            if(response && response.data.entry[0].content && response.data.entry[0].content['api_id'] && response.data.entry[0].content['api_id'] != ''){
                response = response.data.entry[0].content;
                $("#honeydb_api_id").val(response['api_id']);
                $("#honeydb_api_key").val(response['api_key']);
            }
            else if(response && response.data.entry[0].content['error'] && response.data.entry[0].content['error'] != ''){
                let msg_location = "#honeydb_msg";
                $(msg_location).addClass('error_msg');
                $(msg_location).removeClass('success_msg');
                $(msg_location).text(`Unable to get the API ID and Key, may be there is no configuration. Please set the configuration and save.`);
            }
            else if(error && error['error']){
                console.log(`Error while getting HoneyDB Configuration: ${error['error']}`);
            }
            else{
                console.log("Unknown error while getting HoneyDB API key.");
            }
        });
    }

    getHoneyDBConfiguration();


    function getMaliciousIPCollectorConfiguration(){
        let service = mvc.createService();
        service.get("/MaliciousIPConfiguration", {}, function(error, response){
            if(response && response.data.entry[0].content && response.data.entry[0].content['api_url'] && response.data.entry[0].content['auth_token'] != ''){
                response = response.data.entry[0].content;
                $("#malicious_ip_api_url").val(response['api_url']);
                $("#malicious_ip_auth_token").val(response['auth_token']);
            }
            else if(response && response.data.entry[0].content['error'] && response.data.entry[0].content['error'] != ''){
                let msg_location = "#malicious_ip_msg";
                $(msg_location).addClass('error_msg');
                $(msg_location).removeClass('success_msg');
                $(msg_location).text(`Unable to get the API URL and Auth Token, may be there is no configuration. Please set the configuration and save.`);
            }
            else if(error && error['error']){
                console.log(`Error while getting MaliciousIP Collector Configuration: ${error['error']}`);
            }
            else{
                console.log("Unknown error while getting MaliciousIP Collector Auth Token.");
            }
        });
    }

    getMaliciousIPCollectorConfiguration();


    function updateHoneyDBConfiguration(){
        let api_id = $("#honeydb_api_id").val();
        let api_key = $("#honeydb_api_key").val();
        let service = mvc.createService();
        let data = {
            "api_id": api_id,
            "api_key": api_key
        };
        data = JSON.stringify(data);
        service.post("/HoneyDBConfiguration/honeydb", {"data": data}, function(error, response){
            if(response && response.data.entry[0].content['success'] && response.data.entry[0].content['success'] != ''){
                let msg_location = "#honeydb_msg";
                $(msg_location).removeClass('error_msg');
                $(msg_location).addClass('success_msg');
                $(msg_location).text("API configuration saved successfully.");
            }
            else if(response && response.data.entry[0].content['error'] && response.data.entry[0].content['error'] != ''){
                let msg_location = "#honeydb_msg";
                $(msg_location).addClass('error_msg');
                $(msg_location).removeClass('success_msg');
                $(msg_location).text(`Unable to save the API configuration. ${response.data.entry[0].content['error']}`);
            }
            else if(error && error['error']){
                console.log(`Error while getting HoneyDB Configuration: ${error['error']}`);
            }
            else{
                console.log("Unknown error while getting HoneyDB API key.");
            }
        });
    }

    $(`#honeydb_button`).on("click", function(){
        updateHoneyDBConfiguration();
    });

    
    function updateMaliciousIPConfiguration(){
        let api_url = $("#malicious_ip_api_url").val();
        let auth_token = $("#malicious_ip_auth_token").val();
        let service = mvc.createService();
        let data = {
            "api_url": api_url,
            "auth_token": auth_token
        };
        data = JSON.stringify(data);
        service.post("/MaliciousIPConfiguration/maliciousip", {"data": data}, function(error, response){
            if(response && response.data.entry[0].content['success'] && response.data.entry[0].content['success'] != ''){
                let msg_location = "#malicious_ip_msg";
                $(msg_location).removeClass('error_msg');
                $(msg_location).addClass('success_msg');
                $(msg_location).text("Malicious IP Collector configuration saved successfully.");
            }
            else if(response && response.data.entry[0].content['error'] && response.data.entry[0].content['error'] != ''){
                let msg_location = "#malicious_ip_msg";
                $(msg_location).addClass('error_msg');
                $(msg_location).removeClass('success_msg');
                $(msg_location).text(`Unable to save the Malicious IP Collector configuration. ${response.data.entry[0].content['error']}`);
            }
            else if(error && error['error']){
                console.log(`Error while getting Malicious IP Collector Configuration: ${error['error']}`);
            }
            else{
                console.log("Unknown error while getting Malicious IP Collector Auth Token.");
            }
        });
    }

    $(`#malicious_button`).on("click", function(){
        updateMaliciousIPConfiguration();
    });

    function getSophosEndpointConfiguration(){
        let service = mvc.createService();
        service.get("/SophosEndpointConfiguration", {}, function(error, response){
            if(response && response.data.entry[0].content && response.data.entry[0].content['client_id'] && response.data.entry[0].content['client_secret'] != ''){
                response = response.data.entry[0].content;
                $("#sophos_endpoint_client_id").val(response['client_id']);
                $("#sophos_endpoint_client_secret").val(response['client_secret']);
            }
            else if(response && response.data.entry[0].content['error'] && response.data.entry[0].content['error'] != ''){
                let msg_location = "#sophos_endpoint_msg";
                $(msg_location).addClass('error_msg');
                $(msg_location).removeClass('success_msg');
                $(msg_location).text(`Unable to get the Client ID and Client Secret, may be there is no configuration. Please set the configuration and save.`);
            }
            else if(error && error['error']){
                console.log(`Error while getting Sophos Endpoint Configuration: ${error['error']}`);
            }
            else{
                console.log("Unknown error while getting Sophos Endpoint Client Secret.");
            }
        });
    }

    getSophosEndpointConfiguration();

    function updateSophosEndpointConfiguration(){
        let client_id = $("#sophos_endpoint_client_id").val();
        let client_secret = $("#sophos_endpoint_client_secret").val();
        let service = mvc.createService();
        let data = {
            "client_id": client_id,
            "client_secret": client_secret
        };
        data = JSON.stringify(data);
        service.post("/SophosEndpointConfiguration/sophos", {"data": data}, function(error, response){
            if(response && response.data.entry[0].content['success'] && response.data.entry[0].content['success'] != ''){
                let msg_location = "#sophos_endpoint_msg";
                $(msg_location).removeClass('error_msg');
                $(msg_location).addClass('sophos_endpoint_msg');
                $(msg_location).text("Sophos Endpoint configuration saved successfully.");
            }
            else if(response && response.data.entry[0].content['error'] && response.data.entry[0].content['error'] != ''){
                let msg_location = "#sophos_endpoint_msg";
                $(msg_location).addClass('error_msg');
                $(msg_location).removeClass('success_msg');
                $(msg_location).text(`Unable to save the Sophos configuration. ${response.data.entry[0].content['error']}`);
            }
            else if(error && error['error']){
                console.log(`Error while getting Sophos Endpoint Configuration: ${error['error']}`);
            }
            else{
                console.log("Unknown error while getting Sophos Endpoint Client Secret.");
            }
        });
    }

    $(`#sophos_endpoint_button`).on("click", function(){
        updateSophosEndpointConfiguration();
    });


   function getCommonEmailAlertActionConfiguration(){
        let service = mvc.createService();
        service.get('/servicesNS/-/cyences_app_for_splunk/configs/conf-alert_actions/cyences_send_email_action', {}, function(error, response){
            if(response && response.data.entry[0].content){
                let content = response.data.entry[0].content;
                $("#cyences_email_to_default").val(content['param.email_to_default']);
                $("#cyences_email_cyences_severities").val(content['param.cyences_severities']);
            }
            else if(error && error['error']){
                let msg_location = "#cyences_email_msg";
                $(msg_location).addClass('error_msg');
                $(msg_location).removeClass('success_msg');
                $(msg_location).text(`Unable to get the default cyences email alert action configuration, may be there is no configuration. Please set the configuration and save.`);
                console.log(error);
            }
            else{
                console.log("Unknown error while getting Common Email Alert Action Configuration.");
            }

        });
    }

    getCommonEmailAlertActionConfiguration();

    function updateCommonEmailAlertActionConfiguration(){
        let email_to_default = $("#cyences_email_to_default").val();
        let cyences_severities = $("#cyences_email_cyences_severities").val();
        let service = mvc.createService();
        let data = {
            "param.email_to_default": email_to_default,
            "param.cyences_severities": cyences_severities
        };
        service.post("/servicesNS/-/cyences_app_for_splunk/configs/conf-alert_actions/cyences_send_email_action", data, function(error, response){
            if(response && response.data.entry[0].content){
                let msg_location = "#cyences_email_msg";
                $(msg_location).removeClass('error_msg');
                $(msg_location).addClass('success_msg');
                $(msg_location).text("Common Email Alert Action configuration saved successfully.");
            }
            else if(error && error['error']){
                let msg_location = "#cyences_email_msg";
                $(msg_location).addClass('error_msg');
                $(msg_location).removeClass('success_msg');
                $(msg_location).text(`Unable to save the configuration. Error: ${error['error']}`);
                console.log(error);
            }
            else{
                console.log("Unknown error while getting Common Email Alert Action Configuration.");
            }
        });
    }

    $(`#cyences_email_button`).on("click", function(){
        updateCommonEmailAlertActionConfiguration();
    });

});
