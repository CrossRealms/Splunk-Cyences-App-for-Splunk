require([
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/searchmanager',
    "splunkjs/mvc/postprocessmanager",
    'splunkjs/mvc',
    'underscore',
    'splunkjs/mvc/simplexml/ready!'], 
function(TableView, SearchManager, PostProcessManager, mvc, _){

    var AllVulnRowExpansionRenderer = TableView.BaseRowExpansionRenderer.extend({
        initialize: function(args) {
            // initialize will run once, so we will set up a search and a chart to be reused.
            this._searchManager = new SearchManager({
                id: 'details-search-manager',
                preview: false
            });
            this._chartView = new TableView({
                managerid: 'details-search-manager',
                'rowNumbers': true,
                'drilldown': 'none',
                'wrap': true,
                'count': 100    /* TODO - Currently, there is bug in the expandable table view where if once you switch in the page in the main table, 
                                          the expanded table will not allow to switch page.
                                          So, we are putting 100 as max count for now to accommodate most of the cases. */
            });
        },
        canRender: function(rowData) {
            // Since more than one row expansion renderer can be registered we let each decide if they can handle that
            // data
            // Here we will always handle it.
            return true;
        },
        render: function($container, rowData) {
            // rowData contains information about the row that is expanded.  We can see the cells, fields, and values
            // We will find the cell values to use its value
            let tenable_uuid = _(rowData.cells).find(function (cell) {
               return cell.field === 'tenable_uuid';
            }).value;
            //update the search with the HOST_ID that we are interested in
            this._searchManager.set({ search: `| inputlookup cs_tenable_vuln | search tenable_uuid="${tenable_uuid}" | sort -vul_severity_id, -vul_state
            | table vul_id, vul_name, vul_severity, vul_state, vul_family, vul_has_patch, vul_port, vul_protocol, vul_risk_factor, vul_cve, vul_solution, vul_type, vul_version, vul_description, vul_synopsis, _time, last_fixed, last_found, vul_cpe, vul_in_the_news`});
            // $container is the jquery object where we can put out content.
            // In this case we will render our chart and add it to the $container
            $container.append(this._chartView.render().el);
        }
    });
    var tableElement = mvc.Components.getInstance("tenable_table");
    tableElement.getVisualization(function(tableView) {
        // Add custom cell renderer, the table will re-render automatically.
        tableView.addRowExpansionRenderer(new AllVulnRowExpansionRenderer());
    });

    var VulTrafficExpansionRenderer = TableView.BaseRowExpansionRenderer.extend({
        initialize: function(args) {
            // initialize will run once, so we will set up a search and a chart to be reused.
            this._searchManager = new PostProcessManager({
                id: 'vul-traffic-search-manager',
                managerid: "vulnerability_port_traffic_search",
                preview: false
            });
            this._chartView = new TableView({
                managerid: 'vul-traffic-search-manager',
                'rowNumbers': true,
                'drilldown': 'none',
                'wrap': true,
                'count': 100    /* TODO - Currently, there is bug in the expandable table view where if once you switch in the page in the main table, 
                                          the expanded table will not allow to switch page.
                                          So, we are putting 100 as max count for now to accommodate most of the cases. */
            });
        },
        canRender: function(rowData) {
            // Since more than one row expansion renderer can be registered we let each decide if they can handle that
            // data
            // Here we will always handle it.
            return true;
        },
        render: function($container, rowData) {
            // rowData contains information about the row that is expanded.  We can see the cells, fields, and values
            // We will find the HOST_ID cell to use its value
            var vul_ip = _(rowData.cells).find(function (cell) {
               return cell.field === 'vul_ip';
            }).value;
            var vul_port = _(rowData.cells).find(function (cell) {
                return cell.field === 'vul_port';
             }).value;
            //update the search with the HOST_ID that we are interested in
            this._searchManager.set({ search: `| search vul_ip="${vul_ip}" vul_port="${vul_port}"
            | sort Country, - inbound_traffic, - outbound_traffic
            | table src_ip, inbound_traffic, dest_ip, outbound_traffic, Country, Region, City`});
            // $container is the jquery object where we can put out content.
            // In this case we will render our chart and add it to the $container
            $container.append(this._chartView.render().el);
        }
    });
    var tableElement2 = mvc.Components.getInstance("vulnerability_port_traffic_table");
    tableElement2.getVisualization(function(tableView) {
        // Add custom cell renderer, the table will re-render automatically.
        tableView.addRowExpansionRenderer(new VulTrafficExpansionRenderer());
    });

    var VulTrafficExpansionRenderer2 = TableView.BaseRowExpansionRenderer.extend({
        initialize: function(args) {
            // initialize will run once, so we will set up a search and a chart to be reused.
            this._searchManager = new PostProcessManager({
                id: 'vul-traffic-search-manager2',
                managerid: "vulnerability_port_traffic_search_for_nessus_json",
                preview: false
            });
            this._chartView = new TableView({
                managerid: 'vul-traffic-search-manager2',
                'rowNumbers': true,
                'drilldown': 'none',
                'wrap': true,
                'count': 100    /* TODO - Currently, there is bug in the expandable table view where if once you switch in the page in the main table, 
                                          the expanded table will not allow to switch page.
                                          So, we are putting 100 as max count for now to accommodate most of the cases. */
            });
        },
        canRender: function(rowData) {
            // Since more than one row expansion renderer can be registered we let each decide if they can handle that
            // data
            // Here we will always handle it.
            return true;
        },
        render: function($container, rowData) {
            debugger;
            // rowData contains information about the row that is expanded.  We can see the cells, fields, and values
            // We will find the HOST_ID cell to use its value
            var vul_ip = _(rowData.cells).find(function (cell) {
               return cell.field === 'vul_ip';
            }).value;
            //update the search with the HOST_ID that we are interested in
            this._searchManager.set({ search: `| search vul_ip="${vul_ip}"
            | sort Country, - inbound_traffic, - outbound_traffic
            | table src_ip, inbound_traffic, dest_ip, outbound_traffic, Country, Region, City`});
            // $container is the jquery object where we can put out content.
            // In this case we will render our chart and add it to the $container
            $container.append(this._chartView.render().el);
        }
    });
    var tableElement2 = mvc.Components.getInstance("vulnerability_port_traffic_table_for_nessus_json");
    tableElement2.getVisualization(function(tableView) {
        // Add custom cell renderer, the table will re-render automatically.
        tableView.addRowExpansionRenderer(new VulTrafficExpansionRenderer2());
    });
});