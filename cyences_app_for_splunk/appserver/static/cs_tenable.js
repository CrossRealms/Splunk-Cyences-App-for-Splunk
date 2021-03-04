require([
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/searchmanager',
    'splunkjs/mvc',
    'underscore',
    'splunkjs/mvc/simplexml/ready!'], 
function(TableView, SearchManager, mvc, _){

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
            var allIPs = _(rowData.cells).find(function (cell) {
               return cell.field === 'tenable_all_ips';
            }).value;
            var host = _(rowData.cells).find(function (cell) {
                return cell.field === 'host';
            }).value;
            //update the search with the HOST_ID that we are interested in
            this._searchManager.set({ search: `| inputlookup cs_tenable_vuln | search ip IN (${allIPs}) OR host="${host}" | sort -vul_severity_id, -vul_state
            | table vul_id, vul_name, vul_severity, vul_state, vul_family, vul_has_patch, vul_port, vul_protocol, vul_risk_factor, vul_type, vul_version, vul_description, vul_synopsis, _time, last_fixed, last_found, vul_cpe, vul_in_the_news`});
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
});