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
        { token: "authentication", product: "Authentication" },
        { token: "vpn", product: "VPN" },
        { token: "radius_authentication", product: "Radius Authentication" },
        { token: "crowdstrike_eventstream", product: "CrowdStrike EventStream" },
        { token: "sophos", product: "Sophos Endpoint Protection" },
        { token: "windows_defender", product: "Windows Defender" },
        { token: "o365_defender_atp", product: "Office 365 Defender ATP" },
        { token: "aws", product: "AWS" },
        { token: "gws", product: "Google Workspace" },
        { token: "o365", product: "Office 365" },
        { token: "email", product: "Email" },
        { token: "network_compromise", product: "Network" },
        { token: "cisco_ios", product: "Cisco IOS" },
        { token: "fortigate", product: "FortiGate" },
        { token: "palo_alto", product: "Palo Alto" },
        { token: "sophos_firewall", product: "Sophos Firewall" },
        { token: "cisco_meraki", product: "Cisco Meraki" },
        { token: "f5_bigip", product: "F5 BIGIP" },
        { token: "cloudflare", product: "Cloudflare" },
        { token: "windows", product: "Windows" },
        { token: "ad_windows", product: "Windows AD" },
        { token: "sysmon", product: "Sysmon" },
        { token: "linux", product: "Linux" },
        { token: "vulnerability", product: "Vulnerability" },
        { token: "db_oracle", product: "Oracle" },
        { token: "db_mssql", product: "MSSQL" },
    ];


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
            if (disabled_products.includes(panel.product.toLowerCase())){
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

    var tableIDs = ["tbl_authentication", "tbl_vpn", "tbl_radius_authentication", "tbl_crowdstrike_eventstream", "tbl_sophos", "tbl_windows_defender", "tbl_o365_defender_atp", "tbl_aws", "tbl_gws", "tbl_o365", "tbl_email", "tbl_network_compromise", "tbl_cisco_ios", "tbl_fortigate", "tbl_palo_alto", "tbl_sophos_firewall", "tbl_cisco_meraki", "tbl_f5_bigip", "tbl_cloudflare", "tbl_windows", "tbl_ad_windows", "tbl_sysmon", "tbl_linux", "tbl_vulnerability", "tbl_db_oracle", "tbl_db_mssql", "tbl_monthly_alerts", "tbl_other_alerts" ];
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