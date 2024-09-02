require([
    'jquery',
    'underscore',
    'splunkjs/mvc',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/simplexml/ready!'
], function ($, _, mvc, TableView) {
    'use strict';

    let baseURL = window.location.href.split('cs_overview')[0];

    let submittedTokens = mvc.Components.getInstance('submitted');
    let defaultTokens = mvc.Components.getInstance('default');

    function setToken(name, value){
        defaultTokens.set(name, value);
        submittedTokens.set(name, value);
    }

    function unsetToken(name){
        defaultTokens.unset(name);
        submittedTokens.unset(name);
    }

    let report_links = [
        { id: 'cs_crowdstrike_reports', title: 'CrowdStrike' },
        { id: 'cs_kaspersky_reports', title: 'Kaspersky' },
        { id: 'cs_o365_defender_atp', title: 'Defender ATP' },
        { id: 'cs_sophos_reports', title: 'Sophos Endpoint Protection' },
        { id: 'cs_windows_defender_reports', title: 'Windows Defender' },
        { id: 'cs_aws_user_activity', title: 'AWS' },
        { id: 'cs_gws_reports', title: 'Google Workspace' },
        { id: 'cs_o365_reports', title: 'Office 365' },
        { id: 'cs_network_reports', title: 'Network Telemetry' },
        { id: 'cs_fortigate_firewall', title: 'Fortigate Firewall' },
        { id: 'cs_paloalto_firewall_reports', title: 'Palo Alto Firewall' },
        { id: 'cs_sophos_firewall', title: 'Sophos Firewall' },
        { id: 'cs_cisco_meraki', title: 'Cisco Meraki' },
        { id: 'cs_windows_reports', title: 'Windows' },
        { id: 'cs_windows_patch', title: 'Windows Patch' },
        { id: 'cs_windows_cert_store', title: 'Windows Certs' },
        { id: 'cs_vulnerability', title: 'Vulnerability' },
        { id: 'cs_ad_reports', title: 'Active Directory' },
        { id: 'cs_authentication_reports', title: 'Authentication' },
        { id: 'cs_dns_tracker', title: 'DNS Tracker' },
        { id: 'cs_lansweeper', title: 'Lansweeper' },
        { id: 'cs_linux_reports', title: 'Linux' },
        { id: 'cs_vpn_reports', title: 'VPN' },
        { id: 'cs_radius_authentication', title: 'Radius Authentication' },
        { id: 'cs_device_inventory_table', title: 'Device Inventory' },
        { id: 'cs_user_inventory_table', title: 'User Inventory' },
        { id: 'cs_malicious_ip_list', title: 'Malicious IP List' },
        { id: 'cs_mssql', title: 'MSSQL' },
        { id: 'cs_oracle', title: 'Oracle' },
        { id: 'cs_f5_bigip_asm', title: 'F5 BIGIP' },
    ]

    let panel_depends_tokens = [
        { token: 'authentication', associated_products: ['VPN', 'Cisco IOS', 'FortiGate', 'Palo Alto', 'Google Workspace', 'Office 365', 'Linux', 'Sophos Endpoint Protection', 'Sophos Firewall', 'Windows', 'Radius Authentication', 'Cisco Meraki', 'MSSQL', 'Oracle']  },
        { token: 'antivirus', associated_products: ['Sophos Endpoint Protection', 'Windows Defender', 'CrowdStrike EventStream', 'Office 365 Defender ATP'] },
        { token: 'aws', associated_products: ['AWS'] },
        { token: 'gws', associated_products: ['Google Workspace'] },
        { token: 'o365', associated_products: ['Office 365'] },
        { token: 'email', associated_products: ['Office 365', 'Google Workspace'] },
        { token: 'network_compromise', associated_products: ['Cisco IOS', 'FortiGate', 'Palo Alto', 'Sophos Firewall', 'Cisco Meraki'] },
        { token: 'vulnerability', associated_products: ['Qualys', 'Tenable', 'Nessus', 'CrowdStrike Spotlight'] },
        { token: 'ad_windows', associated_products: ['Sysmon', 'Windows', 'Windows AD', 'Windows DNS'] },
        { token: 'credential_compromise', associated_products: ['Sysmon'] },
        { token: 'ransomware', associated_products: ['Sysmon', 'Windows', 'Cisco IOS', 'FortiGate', 'Palo Alto', 'Sophos Firewall', 'Cisco Meraki'] },
        { token: 'linux', associated_products: ['Linux'] },
        { token: 'db_oracle', associated_products: ['Oracle'] },
        { token: 'db_mssql', associated_products: ['MSSQL'] },
        { token: 'f5_bigip', associated_products: ['F5 BIGIP'] },
    ]


    $.each(panel_depends_tokens, function (index, panel) {
        setToken(panel.token, "");
    });

    function parseEnabledDashboards(nav_bar_content) {
        const re = /<view\s+name\s*=\s*"([^"]+)"/;
        const enabledDashboards = new Set([]);
        for (const item of nav_bar_content.split('\n')) {
            const m = item.match(re);
            if (m) {
                enabledDashboards.add(m[1]);
            }
        }
        return enabledDashboards;
    }

    function addLinks(enabledDashboards) {
        $.each(report_links, function (index, report) {
            if (enabledDashboards.has(report.id)) {
                $('#cyences_links').append(`<div class="box" id="${report.id}">${report.title}</div>`);
            }
        });

        // Iterate through the link and add the onClick method
        $('#cyences_links').children().each(function (index, element) {
            $(this).on("click", function () {
                window.open(baseURL.concat(element.id), "_blank");
            });
        });
    }

    function updateNavBar() {
        let service = mvc.createService();
        service.get("data/ui/nav/default", {}, function (error, response) {
            if (response) {
                const enabledDashboards = parseEnabledDashboards(response.data.entry[0].content['eai:data']);
                addLinks(enabledDashboards);
            }
            else if (error) {
                console.log(`Error while getting nav bar content: ${error['error']}`);
            }
            else {
                console.log("Unknown error while getting nav var content.");
            }
        });
    }

    function unsetTokenForDisabledProducts(disabled_products) {

        $.each(panel_depends_tokens, function (index, panel) {

            let difference = panel.associated_products.filter(x => !disabled_products.includes(x.toLowerCase()));
            if (difference.length == 0){
                unsetToken(panel.token);
            }
           
        });
    }

    function showHidePanels() {
        let service = mvc.createService();
        service.get("configs/conf-cs_configurations/product_config", {}, function (error, response) {
            if (response) {
                const disabled_products = response.data.entry[0].content['disabled_products'].split(",");
                for (let i = 0; i < disabled_products.length; i++) {
                    disabled_products[i] = disabled_products[i].trim();
                }
                unsetTokenForDisabledProducts(disabled_products)
            }
            else if (error) {
                console.log(`Error while getting disabled product details: ${error['error']}`);
            }
            else {
                console.log("Unknown error while getting disabled product details.");
            }
        });
    }

    updateNavBar();
    showHidePanels();

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
            else if (notableEventsCount == 0){
                $td.addClass(`no-notable-events`).html(notableEventsCount);
            }
        }
    });

    var tableIDs = ["tbl_network_compromise", "tbl_authentication", "tbl_credential_compromise", "tbl_ransomware", "tbl_linux", "tbl_f5_bigip", "tbl_ad_windows", "tbl_email", "tbl_o365", "tbl_gws", "tbl_aws", "tbl_antivirus", "tbl_monthly_alerts", "tbl_vulnerability", "tbl_db_oracle", "tbl_db_mssql" ];
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