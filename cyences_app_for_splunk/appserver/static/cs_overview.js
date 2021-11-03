require([
    'jquery',
    'splunkjs/mvc/simplexml/ready!'
], function ($) {

    'use strict';
    let baseURL = window.location.href.split('cs_overview')[0];

    // List of report links
    let report_links = [
        { id: 'ad_reports_link', url: baseURL.concat('cs_ad_reports')},
        { id: 'windows_reports_link', url: baseURL.concat('cs_windows_reports')},
        { id: 'linux_reports_link', url: baseURL.concat('cs_linux_reports')},
        { id: 'o365_reports_link', url: baseURL.concat('cs_o365_reports')},
        { id: 'aws_reports_link', url: baseURL.concat('cs_aws_user_activity')},
        { id: 'gsuite_reports_link', url: baseURL.concat('cs_gsuite_reports')},
        { id: 'network_reports_link', url: baseURL.concat('cs_network_reports')},
        { id: 'paf_reports_link', url: baseURL.concat('cs_paloalto_firewall_reports')},
        { id: 'sophos_reports_link', url: baseURL.concat('cs_sophos_reports')},
        { id: 'windowsdef_reports_link', url: baseURL.concat('cs_windows_defender_reports')},
        { id: 'o365_defender_atp_link', url: baseURL.concat('cs_o365_defender_atp')},
        { id: 'crowdstrike_reports_link', url: baseURL.concat('cs_crowdstrike_reports')},
        { id: 'vpn_reports_link', url: baseURL.concat('cs_vpn_reports')},
        { id: 'auth_reports_link', url: baseURL.concat('cs_authentication_reports')},
        { id: 'malicious_reports_link', url: baseURL.concat('cs_malicious_ip_list')},
        { id: 'device_inventory_table_link', url: baseURL.concat('cs_device_inventory_table')},
        { id: 'lansweeper_link', url: baseURL.concat('cs_lansweeper')},
        { id: 'qualys_link', url: baseURL.concat('cs_qualys')},
        { id: 'tenable_link', url: baseURL.concat('cs_tenable')},
    ];

    // Iterate through the link and add the onClick method
    $.each(report_links, function(index, report){
        $(`#${report.id}`).on("click", function(){
            window.open(report.url, "_blank");
        });
    });

});