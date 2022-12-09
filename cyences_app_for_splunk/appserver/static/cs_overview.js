require([
    'jquery',
    'underscore',
    'splunkjs/mvc',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/simplexml/ready!'
], function ($, _, mvc, TableView) {

    'use strict';
    let baseURL = window.location.href.split('cs_overview')[0];

    // List of report links
    let report_links = [
        { id: 'ad_reports_link', url: baseURL.concat('cs_ad_reports')},
        { id: 'windows_reports_link', url: baseURL.concat('cs_windows_reports')},
        { id: 'windows_patch_link', url: baseURL.concat('cs_windows_patch')},
        { id: 'linux_reports_link', url: baseURL.concat('cs_linux_reports')},
        { id: 'o365_reports_link', url: baseURL.concat('cs_o365_reports')},
        { id: 'aws_reports_link', url: baseURL.concat('cs_aws_user_activity')},
        { id: 'gsuite_reports_link', url: baseURL.concat('cs_gsuite_reports')},
        { id: 'network_reports_link', url: baseURL.concat('cs_network_reports')},
        { id: 'dns_tracker_link', url: baseURL.concat('cs_dns_tracker')},
        { id: 'paf_reports_link', url: baseURL.concat('cs_paloalto_firewall_reports')},
        { id: 'sophos_reports_link', url: baseURL.concat('cs_sophos_reports')},
        { id: 'windowsdef_reports_link', url: baseURL.concat('cs_windows_defender_reports')},
        { id: 'o365_defender_atp_link', url: baseURL.concat('cs_o365_defender_atp')},
        { id: 'crowdstrike_reports_link', url: baseURL.concat('cs_crowdstrike_reports')},
        { id: 'kaspersky_reports_link', url: baseURL.concat('cs_kaspersky_reports')},
        { id: 'vpn_reports_link', url: baseURL.concat('cs_vpn_reports')},
        { id: 'auth_reports_link', url: baseURL.concat('cs_authentication_reports')},
        { id: 'malicious_reports_link', url: baseURL.concat('cs_malicious_ip_list')},
        { id: 'device_inventory_table_link', url: baseURL.concat('cs_device_inventory_table')},
        { id: 'lansweeper_link', url: baseURL.concat('cs_lansweeper')},
        { id: 'vulnerability_link', url: baseURL.concat('cs_vulnerability')},
    ];

    // Iterate through the link and add the onClick method
    $.each(report_links, function(index, report){
        $(`#${report.id}`).on("click", function(){
            window.open(report.url, "_blank");
        });
    });


    // Adding cell render to colorize the notable events based on severity
    var CustomSeverityColorRenderer = TableView.BaseCellRenderer.extend({
        canRender: function(cell) {
            return _(['Notable Events']).contains(cell.field);
        },
        render: function($td, cell) {
            var severity = cell.value.split("|")[0];
            var notableEventsCount = cell.value.split("|")[1];

            if (notableEventsCount > 0){
                $td.addClass(`severity-${severity}`).html(notableEventsCount);
            }
            else{
                $td.addClass(`no-notable-events`).html(notableEventsCount);
            }
        }
    });

    var tableIDs = ["tbl_network_compromise", "tbl_authentication", "tbl_credential_compromise", "tbl_ransomware", "tbl_linux", "tbl_ad_windows", "tbl_o365", "tbl_antivirus", "tbl_monthly_alerts" ];
    for (let i=0;i<tableIDs.length;i++) {
        var sh = mvc.Components.getInstance(tableIDs[i]);
        if(typeof(sh)!="undefined") {
            sh.getVisualization(function(tableView) {
                // Add custom cell renderer and force re-render
                tableView.table.addCellRenderer(new CustomSeverityColorRenderer());
                tableView.table.render();
            });
        }
    }

});