require([
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/searchmanager',
    'splunkjs/mvc/simplexml/ready!'
], function ($, mvc, SearchManager) {

    'use strict';
    let submittedTokens = mvc.Components.getInstance('submitted');
    let defaultTokens = mvc.Components.getInstance('default');

    let all_alerts = {};

    let savedsearch_name;
    let system_compromised_drilldown;
    let attacker_drilldown;

    function setSearchQueryTokens() {
        savedsearch_name = submittedTokens.get("tkn_savedsearch");
        console.log(`Updated savedsearch token ${savedsearch_name}`);

        if (all_alerts[savedsearch_name] === undefined) {
            console.log(`Data is not loaded for ${savedsearch_name}`);
            return;
        }

        // Contributing Events
        if (all_alerts[savedsearch_name].contributing_events) {
            submittedTokens.set("contributing_events_search", `${all_alerts[savedsearch_name].contributing_events} | sort - count`);
        }
        else {
            submittedTokens.unset("contributing_events_search");
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
    }

    // Defining search and search manager
    var searchString = `| rest /servicesNS/-/cyences_app_for_splunk/saved/searches splunk_server=local 
        | search "eai:acl.app"="cyences_app_for_splunk" "action.cyences_notable_event_action"="1"
        | rename action.cyences_notable_event_action.* as *
        | table title, contributing_events, system_compromised_search, system_compromised_drilldown, attacker_search, attacker_drilldown`;
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
                let alert_name = row[0];
                all_alerts[alert_name] = {};

                if(row[1] != undefined && row[1] !== ''){
                    all_alerts[alert_name]['contributing_events'] = row[1];
                }
                if(row[2] != undefined && row[2] !== ''){
                    all_alerts[alert_name]['system_compromised_search'] = row[2];
                }
                if(row[3] != undefined && row[3] !== ''){
                    all_alerts[alert_name]['system_compromised_drilldown'] = row[3];
                }
                if(row[4] != undefined && row[4] !== ''){
                    all_alerts[alert_name]['attacker_search'] = row[4];
                }
                if(row[5] != undefined && row[5] !== ''){
                    all_alerts[alert_name]['attacker_drilldown'] = row[5];
                }
            });
            // load search queries after the alerts data is fetched
            setSearchQueryTokens()
        }
    });


    submittedTokens.on("change:tkn_savedsearch", setSearchQueryTokens);


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
