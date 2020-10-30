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
        { macro_name: 'cs_sophos', input_id: 'macro_data_sophos', button_id: 'macro_data_sophos_button', msg_id: 'macro_data_sophos_msg'},
        { macro_name: 'cs_o365', input_id: 'macro_data_o365', button_id: 'macro_data_o365_button', msg_id: 'macro_data_o365_msg'},
        { macro_name: 'cs_wineventlog_security', input_id: 'macro_data_wineventlog_security', button_id: 'macro_data_wineventlog_security_button', msg_id: 'macro_data_wineventlog_security_msg'},
        { macro_name: 'cs_wineventlog_system', input_id: 'macro_data_wineventlog_system', button_id: 'macro_data_wineventlog_system_button', msg_id: 'macro_data_wineventlog_system_msg'},
        { macro_name: 'cs_sysmon', input_id: 'macro_data_sysmon', button_id: 'macro_data_sysmon_button', msg_id: 'macro_data_sysmon_msg'},
        { macro_name: 'cs_palo', input_id: 'macro_data_palo', button_id: 'macro_data_palo_button', msg_id: 'macro_data_palo_msg'},

        { macro_name: 'cs_ad_password_change_outside_working_hour_definition', input_id: 'macro_cs_ad_password_change_outside_working_hour_definition', button_id: 'macro_cs_ad_password_change_outside_working_hour_definition_button', msg_id: 'macro_cs_ad_password_change_outside_working_hour_definition_msg'},
        { macro_name: 'cs_o365_country', input_id: 'macro_cs_o365_country', button_id: 'macro_cs_o365_country_button', msg_id: 'macro_cs_o365_country_msg'},
        { macro_name: 'cs_palo_search_blocked_ip_lookup_name', input_id: 'macro_cs_palo_search_blocked_ip_lookup_name', button_id: 'macro_cs_palo_search_blocked_ip_lookup_name_button', msg_id: 'macro_cs_palo_search_blocked_ip_lookup_name_msg'},
        { macro_name: 'cs_palo_malicious_ip_list_filter_old_results', input_id: 'macro_cs_palo_malicious_ip_list_filter_old_results', button_id: 'macro_cs_palo_malicious_ip_list_filter_old_results_button', msg_id: 'macro_cs_palo_malicious_ip_list_filter_old_results_msg'},

        { macro_name: 'cs_summariesonly_endpoint', input_id: 'macro_datamodel_endpoint', button_id: 'macro_datamodel_endpoint_button', msg_id: 'macro_datamodel_endpoint_msg'},
        { macro_name: 'cs_summariesonly_network_traffic', input_id: 'macro_datamodel_network_traffic', button_id: 'macro_datamodel_network_traffic_button', msg_id: 'macro_datamodel_network_traffic_msg'},

        /*
        { macro_name: '', input_id: 'macro_', button_id: 'macro__button', msg_id: 'macro__msg'},
        { macro_name: '', input_id: 'macro_', button_id: 'macro__button', msg_id: 'macro__msg'},
        { macro_name: '', input_id: 'macro_', button_id: 'macro__button', msg_id: 'macro__msg'},
        { macro_name: '', input_id: 'macro_', button_id: 'macro__button', msg_id: 'macro__msg'},
        */
        
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
            updateMacroDefinition(`${macro.macro_name}`, $(`#${macro.input_id}`).val(), `#${macro.msg_id}`)
        });
    });
});
