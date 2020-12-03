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
        { macro_name: 'cs_o365', input_id: 'macro_data_o365', button_id: 'macro_data_o365_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_wineventlog_security', input_id: 'macro_data_wineventlog_security', button_id: 'macro_data_wineventlog_security_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_wineventlog_system', input_id: 'macro_data_wineventlog_system', button_id: 'macro_data_wineventlog_system_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_sysmon', input_id: 'macro_data_sysmon', button_id: 'macro_data_sysmon_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_palo', input_id: 'macro_data_palo', button_id: 'macro_data_palo_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_vpn_indexes', input_id: 'macro_data_vpn', button_id: 'macro_data_vpn_button', msg_id: 'macro_data_msg'},
        { macro_name: 'cs_authentication_indexes', input_id: 'macro_data_authentication', button_id: 'macro_data_authentication_button', msg_id: 'macro_data_msg'},

        /* Other Macros */
        { macro_name: 'cs_ad_password_change_outside_working_hour_definition', input_id: 'macro_cs_ad_password_change_outside_working_hour_definition', button_id: 'macro_cs_ad_password_change_outside_working_hour_definition_button', msg_id: 'macro_other_msg'},
        { macro_name: 'cs_home_country', input_id: 'macro_cs_home_country', button_id: 'macro_cs_home_country_button', msg_id: 'macro_other_msg'},
        { macro_name: 'cs_network_home_location_lat', input_id: 'macro_cs_network_home_location_lat', button_id: 'macro_cs_network_home_location_lat_button', msg_id: 'macro_other_msg'},
        { macro_name: 'cs_network_home_location_lon', input_id: 'macro_cs_network_home_location_lon', button_id: 'macro_cs_network_home_location_lon_button', msg_id: 'macro_other_msg'},
        { macro_name: 'cs_palo_search_blocked_ip_lookup_name', input_id: 'macro_cs_palo_search_blocked_ip_lookup_name', button_id: 'macro_cs_palo_search_blocked_ip_lookup_name_button', msg_id: 'macro_other_msg'},
        { macro_name: 'cs_palo_malicious_ip_list_filter_old_results', input_id: 'macro_cs_palo_malicious_ip_list_filter_old_results', button_id: 'macro_cs_palo_malicious_ip_list_filter_old_results_button', msg_id: 'macro_other_msg'},

        /* Data-model */
        { macro_name: 'cs_summariesonly_endpoint', input_id: 'macro_datamodel_endpoint', button_id: 'macro_datamodel_endpoint_button', msg_id: 'macro_datamodel_msg'},
        { macro_name: 'cs_summariesonly_network_traffic', input_id: 'macro_datamodel_network_traffic', button_id: 'macro_datamodel_network_traffic_button', msg_id: 'macro_datamodel_msg'},
        { macro_name: 'cs_summariesonly_authentication', input_id: 'macro_datamodel_authentication', button_id: 'macro_datamodel_authentication_button', msg_id: 'macro_datamodel_msg'},

        /* Windows & AD */
        { macro_name: 'cs_ad_user_modification_filter', input_id: 'macro_cs_ad_user_modification_filter', button_id: 'macro_cs_ad_user_modification_filter_button', msg_id: 'macro_windows_msg'},
        { macro_name: 'cs_ad_user_privilege_escalation_filter', input_id: 'macro_cs_ad_user_privilege_escalation_filter', button_id: 'macro_cs_ad_user_privilege_escalation_filter_button', msg_id: 'macro_windows_msg'},
        { macro_name: 'cs_ad_password_change_outside_working_hour_filter', input_id: 'macro_cs_ad_password_change_outside_working_hour_filter', button_id: 'macro_cs_ad_password_change_outside_working_hour_filter_button', msg_id: 'macro_windows_msg'},
        { macro_name: 'cs_windows_host_missing_update_filter', input_id: 'macro_cs_windows_host_missing_update_filter', button_id: 'macro_cs_windows_host_missing_update_filter_button', msg_id: 'macro_windows_msg'},
        { macro_name: 'cs_windows_firewall_disabled_filter', input_id: 'macro_cs_windows_firewall_disabled_filter', button_id: 'macro_cs_windows_firewall_disabled_filter_button', msg_id: 'macro_windows_msg'},
        { macro_name: 'cs_windows_wmi_lateral_movement_filter', input_id: 'macro_cs_windows_wmi_lateral_movement_filter', button_id: 'macro_cs_windows_wmi_lateral_movement_filter_button', msg_id: 'macro_windows_msg'},
        { macro_name: 'cs_windows_event_log_cleared_filter', input_id: 'macro_cs_windows_event_log_cleared_filter', button_id: 'macro_cs_windows_event_log_cleared_filter_button', msg_id: 'macro_windows_msg'},

        /* O365 */
        { macro_name: 'cs_o365_success_login_outside_country_filter', input_id: 'macro_cs_o365_success_login_outside_country_filter', button_id: 'macro_cs_o365_success_login_outside_country_filter_button', msg_id: 'macro_o365_msg'},
        { macro_name: 'cs_o365_failed_login_outside_country_filter', input_id: 'macro_cs_o365_failed_login_outside_country_filter', button_id: 'macro_cs_o365_failed_login_outside_country_filter_button', msg_id: 'macro_o365_msg'},
        { macro_name: 'cs_o365_login_by_unknown_userid_filter', input_id: 'macro_cs_o365_login_by_unknown_userid_filter', button_id: 'macro_cs_o365_login_by_unknown_userid_filter_button', msg_id: 'macro_o365_msg'},
        { macro_name: 'cs_o365_dlp_exchange_filter', input_id: 'macro_cs_o365_dlp_exchange_filter', button_id: 'macro_cs_o365_dlp_exchange_filter_button', msg_id: 'macro_o365_msg'},
        { macro_name: 'cs_o365_dlp_sharepoint_filter', input_id: 'macro_cs_o365_dlp_sharepoint_filter', button_id: 'macro_cs_o365_dlp_sharepoint_filter_button', msg_id: 'macro_o365_msg'},

        /* Network */
        { macro_name: 'cs_scanning_basic_scanning_filter', input_id: 'macro_cs_scanning_basic_scanning_filter', button_id: 'macro_cs_scanning_basic_scanning_filter_button', msg_id: 'macro_network_msg'},
        { macro_name: 'cs_tor_traffic_filter', input_id: 'macro_cs_tor_traffic_filter', button_id: 'macro_cs_tor_traffic_filter_button', msg_id: 'macro_network_msg'},
        { macro_name: 'cs_network_traffic_map_filter', input_id: 'macro_cs_network_traffic_map_filter', button_id: 'macro_cs_network_traffic_map_filter_button', msg_id: 'macro_network_msg'},
        { macro_name: 'cs_network_scanning_map_filter', input_id: 'macro_cs_network_scanning_map_filter', button_id: 'macro_cs_network_scanning_map_filter_button', msg_id: 'macro_network_msg'},

        /* Palo Alto */
        { macro_name: 'cs_palo_dns_sinkhole_filter', input_id: 'macro_cs_palo_dns_sinkhole_filter', button_id: 'macro_cs_palo_dns_sinkhole_filter_button', msg_id: 'macro_palo_msg'},
        { macro_name: 'cs_palo_ddos_prevented_filter', input_id: 'macro_cs_palo_ddos_prevented_filter', button_id: 'macro_cs_palo_ddos_prevented_filter_button', msg_id: 'macro_palo_msg'},
        { macro_name: 'cs_palo_firewall_login_failure_filter', input_id: 'macro_cs_palo_firewall_login_failure_filter', button_id: 'macro_cs_palo_firewall_login_failure_filter_button', msg_id: 'macro_palo_msg'},
        { macro_name: 'cs_palo_blocked_ip_inbound_filter', input_id: 'macro_cs_palo_blocked_ip_inbound_filter', button_id: 'macro_cs_palo_blocked_ip_inbound_filter_button', msg_id: 'macro_palo_msg'},
        { macro_name: 'cs_palo_blocked_ip_outbound_filter', input_id: 'macro_cs_palo_blocked_ip_outbound_filter', button_id: 'macro_cs_palo_blocked_ip_outbound_filter_button', msg_id: 'macro_palo_msg'},
        { macro_name: 'cs_palo_malicious_ip_list_filter', input_id: 'macro_cs_palo_malicious_ip_list_filter', button_id: 'macro_cs_palo_malicious_ip_list_filter_button', msg_id: 'macro_palo_msg'},

        /* Sophos */
        { macro_name: 'cs_sophos_update_errors_filter', input_id: 'macro_cs_sophos_update_errors_filter', button_id: 'macro_cs_sophos_update_errors_filter_button', msg_id: 'macro_sophos_msg'},
        { macro_name: 'cs_sophos_endpoint_not_protected_filter', input_id: 'macro_cs_sophos_endpoint_not_protected_filter', button_id: 'macro_cs_sophos_endpoint_not_protected_filter_button', msg_id: 'macro_sophos_msg'},
        { macro_name: 'cs_sophos_endpoint_outofdate_filter', input_id: 'macro_cs_sophos_endpoint_outofdate_filter', button_id: 'macro_cs_sophos_endpoint_outofdate_filter_button', msg_id: 'macro_sophos_msg'},
        { macro_name: 'cs_sophos_realtime_protection_disabled_filter', input_id: 'macro_cs_sophos_realtime_protection_disabled_filter', button_id: 'macro_cs_sophos_realtime_protection_disabled_filter_button', msg_id: 'macro_sophos_msg'},
        { macro_name: 'cs_sophos_service_not_running_filter', input_id: 'macro_cs_sophos_service_not_running_filter', button_id: 'macro_cs_sophos_service_not_running_filter_button', msg_id: 'macro_sophos_msg'},
        { macro_name: 'cs_sophos_failed_to_cleanup_threat_filter', input_id: 'macro_cs_sophos_failed_to_cleanup_threat_filter', button_id: 'macro_cs_sophos_failed_to_cleanup_threat_filter_button', msg_id: 'macro_sophos_msg'},
        { macro_name: 'cs_sophos_core_restore_failed_filter', input_id: 'macro_cs_sophos_core_restore_failed_filter', button_id: 'macro_cs_sophos_core_restore_failed_filter_button', msg_id: 'macro_sophos_msg'},
        { macro_name: 'cs_sophos_expiration_messages_filter', input_id: 'macro_cs_sophos_expiration_messages_filter', button_id: 'macro_cs_sophos_expiration_messages_filter_button', msg_id: 'macro_sophos_msg'},
        { macro_name: 'cs_sophos_exploit_prevented', input_id: 'macro_cs_sophos_exploit_prevented', button_id: 'macro_cs_sophos_exploit_prevented_button', msg_id: 'macro_sophos_msg'},
        { macro_name: 'cs_sophos_malware_detected', input_id: 'macro_cs_sophos_malware_detected', button_id: 'macro_cs_sophos_malware_detected_button', msg_id: 'macro_sophos_msg'},

        /* Ransomware */
        { macro_name: 'cs_spike_in_file_writes_filter', input_id: 'macro_cs_spike_in_file_writes_filter', button_id: 'macro_cs_spike_in_file_writes_filter_button', msg_id: 'macro_ransomware_msg'},
        { macro_name: 'cs_system_processes_run_from_unexpected_locations_filter', input_id: 'macro_cs_system_processes_run_from_unexpected_locations_filter', button_id: 'macro_cs_system_processes_run_from_unexpected_locations_filter_button', msg_id: 'macro_ransomware_msg'},
        { macro_name: 'cs_common_ransomware_extensions_filter', input_id: 'macro_cs_common_ransomware_extensions_filter', button_id: 'macro_cs_common_ransomware_extensions_filter_button', msg_id: 'macro_ransomware_msg'},
        { macro_name: 'cs_common_ransomware_notes_filter', input_id: 'macro_cs_common_ransomware_notes_filter', button_id: 'macro_cs_common_ransomware_notes_filter_button', msg_id: 'macro_ransomware_msg'},
        { macro_name: 'cs_usn_journal_deletion_filter', input_id: 'macro_cs_usn_journal_deletion_filter', button_id: 'macro_cs_usn_journal_deletion_filter_button', msg_id: 'macro_ransomware_msg'},
        { macro_name: 'cs_scheduled_tasks_used_in_badrabbit_ransomware_filter', input_id: 'macro_cs_scheduled_tasks_used_in_badrabbit_ransomware_filter', button_id: 'macro_cs_scheduled_tasks_used_in_badrabbit_ransomware_filter_button', msg_id: 'macro_ransomware_msg'},
        
        /* Credential Compromise */
        { macro_name: 'cs_attempted_credential_dump_from_registry_via_reg_exe_filter', input_id: 'macro_cs_attempted_credential_dump_from_registry_via_reg_exe_filter', button_id: 'macro_cs_attempted_credential_dump_from_registry_via_reg_exe_filter_button', msg_id: 'macro_credential_msg'},
        { macro_name: 'cs_detect_credential_dumping_through_lsass_access_filter', input_id: 'macro_cs_detect_credential_dumping_through_lsass_access_filter', button_id: 'macro_cs_detect_credential_dumping_through_lsass_access_filter_button', msg_id: 'macro_credential_msg'},
        { macro_name: 'cs_credential_dumping_via_symlink_to_shadow_copy_filter', input_id: 'macro_cs_credential_dumping_via_symlink_to_shadow_copy_filter', button_id: 'macro_cs_credential_dumping_via_symlink_to_shadow_copy_filter_button', msg_id: 'macro_credential_msg'},
        { macro_name: 'cs_credential_dumping_via_copy_command_from_shadow_copy_filter', input_id: 'macro_cs_credential_dumping_via_copy_command_from_shadow_copy_filter', button_id: 'macro_cs_credential_dumping_via_copy_command_from_shadow_copy_filter_button', msg_id: 'macro_credential_msg'},

        /* VPN */
        { macro_name: 'cs_vpn_dashboard_filter', input_id: 'macro_cs_vpn_dashboard_filter', button_id: 'macro_cs_vpn_dashboard_filter_button', msg_id: 'macro_vpn_msg'},

        /* Authentication */
        { macro_name: 'cs_authentication_app_filter', input_id: 'macro_cs_authentication_app_filter', button_id: 'macro_cs_authentication_app_filter_button', msg_id: 'macro_authentication_msg'}
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
    var searchManagerResults = searchManager.data("results");
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
            value = value.replace(/"/g, '\\\"');
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


});
