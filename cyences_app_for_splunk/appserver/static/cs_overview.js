require([
    'jquery',
    'underscore',
    'splunkjs/mvc',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/simplexml/ready!'
], function ($, _, mvc, TableView) {

    'use strict';
    let baseURL = window.location.href.split('cs_overview')[0];

    // Iterate through the link and add the onClick method
    $('#cyences_links').children().each(function (index, element) {
        $(this).on("click", function(){
            window.open(baseURL.concat(element.id), "_blank");
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
            else if (notableEventsCount == 0){
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