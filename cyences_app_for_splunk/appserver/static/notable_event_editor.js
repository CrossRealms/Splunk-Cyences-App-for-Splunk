require([
    "splunkjs/mvc",
    "splunkjs/mvc/utils",
    "splunkjs/mvc/tokenutils",
    "underscore",
    "jquery",
    'splunkjs/mvc/sharedmodels',
    "splunkjs/mvc/simplexml",
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/chartview',
    'splunkjs/mvc/searchmanager',
    'splunk.util',
    'util/moment',
    'select2/select2'
], function (
    mvc,
    utils,
    TokenUtils,
    _,
    $,
    sharedModels,
    DashboardController,
    TableView,
    ChartView,
    SearchManager,
    splunkUtil,
    moment,
    Select
) {

    const NOTABLE_EVENT_TABLE_SEARCH_IDS = ['all_results'];
    const NOTABLE_EVENT_TABLE_IDS = ['forensics_notable_events_tbl'];

    const ASSIGNEE_COLUMN_NAME = 'Assignee';
    const STATUS_COLUMN_NAME = 'Status';

    const NOTABLE_EVENT_EMPTY_VALUE = 'BANANABANANA';

    let AVAILABLE_USERS = [];
    let AVAILABLE_STATUSES = [
        {status: 'new', status_description: 'New'},
        {status: 'assigned', status_description: 'Assigned'},
        {status: 'in_progress', status_description: 'In Progress'},
        {status: 'completed', status_description: 'Completed'}];


    let selected_notable_events = [];
    let all_notable_events = [];


    function fillAllNotableEventsVariable(){
        _.each(NOTABLE_EVENT_TABLE_SEARCH_IDS, function(searchId){
            let search_recent_alerts = mvc.Components.get(searchId);
            let search_recent_alerts_results = search_recent_alerts.data("results", { count: 0, output_mode: 'json_rows' });
            search_recent_alerts_results.on("data", function () {
                // Add layer with bulk edit links
                if (search_recent_alerts_results.data() !== undefined) {
                    all_notable_events = _.map(search_recent_alerts_results.data().rows, function (e) { return e[0]; });
                    $("#bulk_edit_container").remove();
                    _.each(NOTABLE_EVENT_TABLE_IDS, function (tableId){
                        $(`#${tableId}`).parent().before($("<div />").attr('id', 'bulk_edit_container').addClass("bulk_edit_container").addClass('panel-element-row'));
                        var links = _.template('<a href="#" id="bulk_edit_select_all">Select All</a> | <a href="#" id="bulk_edit_selected">Edit Selected</a> | <a href="#" id="bulk_edit_all">Edit All <%-nr_notable_events%> Matching Notable Events</a> | <a href="#" id="bulk_edit_clear">Reset Selection</a>', { nr_notable_events: all_notable_events.length });
                        $("#bulk_edit_container").html(links);
                    });
                    $("#bulk_edit_container").show();
                } else {
                    console.log("No recent alerts found for:", search_recent_alerts.data("results").cid);
                }
            });
        });
    }


    function restartNotableEventSearch(){
        _.each(NOTABLE_EVENT_TABLE_SEARCH_IDS, function(searchId){
            let searchManager = mvc.Components.get(searchId);
            if(searchManager){
                searchManager.startSearch();
                // fillAllNotableEventsVariable();   // No need as it's already registered with search on done action
            }
        });
    }

    function updateOnNotableEventSearchCompleted(){
        _.each(NOTABLE_EVENT_TABLE_SEARCH_IDS, function(searchId){
            let searchManager = mvc.Components.get(searchId);
            if(searchManager){
                searchManager.on('search:done', function (properties) {
                    console.log("Notable event main table search completed.", properties);
                    fillAllNotableEventsVariable();
                });
            }
        });
    }
    updateOnNotableEventSearchCompleted();  // attach the search on:done action with main notable event search


    function fillAvailableUserList(){
        let searchQuery = '| inputlookup cyences_splunk_user_list.csv | table username';
        let manager = new SearchManager({
            preview: false,
            autostart: false,
            search: searchQuery,
            earliest_time: '-1m',
            latest_time: 'now'
        });

        manager.on('search:done', function (properties) {
            console.log("Available user list search completed.", properties);

            let searchManagerResults = manager.data("results", {count: 0});
            searchManagerResults.on('data', function () {
                let resultData = searchManagerResults.data();
                if (resultData && resultData.rows) {
                    // console.log("users: ", resultData.rows);
                    for(let i=0; i< resultData.rows.length; i++){
                        AVAILABLE_USERS.push(resultData.rows[i][0]);
                    }
                }
            });
        });

        manager.on('search:fail', function (properties) {
            alert("Unable to get the available user list.");
            console.error("Unable to get the available user list.", properties);
        });
        manager.on('search:error', function (properties) {
            alert("Unable to get the available user list.");
            console.error("Unable to get the available user list.", properties);
        });
        manager.startSearch();
    }
    fillAvailableUserList();


    function runNotableEventUpdaterSearch(entries_to_update, callBackFunction){
        let searchQuery = '';
        for(let i=0; i<entries_to_update.length; i++){
            let entry = entries_to_update[i];
            if ( i!=0 ) {
                searchQuery += `| append [`;
            }
            searchQuery += `| makeresults | eval notable_event_id="${entry.notable_event_id}"`;
            if('assignee' in entry){
                searchQuery += `, assignee="${entry.assignee}"`;
            }
            if('status' in entry){
                searchQuery += `, status="${entry.status}"`;
            }
            if('comment' in entry){
                searchQuery += `, comment="${entry.comment}"`;
            }
            if ( i!=0 ) {
                searchQuery += ` ]`;
            }
            searchQuery += "\n";
        }
        searchQuery += "| cyencesnotableupdateevent";
        console.log("Search Query for notable events update: ", searchQuery);

        let manager = new SearchManager({
            preview: false,
            autostart: false,
            search: searchQuery,
            earliest_time: '-1m',
            latest_time: 'now'
        });

        manager.on('search:done', function (properties) {
            console.log("Notable event updater search completed.", properties);

            let searchManagerResults = manager.data("results", {count: 0});
            searchManagerResults.on('data', function () {
                let resultData = searchManagerResults.data();
                if (resultData && resultData.rows && resultData.rows.length > 0) {
                    // TODO - read through the output of the results and validate the custom command was successful.
                    restartNotableEventSearch();
                    if (callBackFunction != undefined){
                        callBackFunction();
                    }
                }
                else{
                    // No event responded by the custom command, custom command was not successful.
                }
            });
        });

        manager.on('search:fail', function (properties) {
            alert("Unable to update the notable event.");
            console.error("Unable to update the notable event.", properties);
        });
        manager.on('search:error', function (properties) {
            alert("Unable to update the notable event.");
            console.error("Unable to update the notable event.", properties);
        });
        manager.startSearch();
    }


    function handlerNotableEventSelectionChange(handlerObj){
        let notable_event_id = $(handlerObj).parent().find("td.notable_event_id").get(0).textContent;
        console.log("notable_event_id", $(handlerObj).parent().find("td.notable_event_selector").children("input").val());
        if ($(handlerObj).parent().find("td.notable_event_selector").children("input").is(':checked')) {
            selected_notable_events.push(notable_event_id);
        } else {
            selected_notable_events = _.without(selected_notable_events, notable_event_id);
        }
        console.log("selected_notable_events", selected_notable_events);
    }


    function handlerNotableEventEdit(handlerObj, data){
        console.log("notable_event_edit handler.");
        let bulk, nr_notable_events, notable_event_id, notable_event_ids_string, assignee, status, modal_id, modal_title;
        if (data.notable_event_ids != undefined) {
            console.log("Bulk edit call");
            bulk = true;
            nr_notable_events = data.notable_event_ids.length;
            notable_event_id = data.notable_event_ids.join(', <br />');
            notable_event_ids_string = data.notable_event_ids.join(':');
            assignee = '(unchanged)';
            status = '(unchanged)';
            modal_title = "Notable Events";
            modal_id = "notable_event_ids";
        } else {
            bulk = false;
            nr_notable_events = 1;
            notable_event_id = $(handlerObj).parent().find("td.notable_event_id").get(0).textContent;
            notable_event_ids_string = notable_event_id;
            assignee = $(handlerObj).parent().find(`td.${ASSIGNEE_COLUMN_NAME}`).get(0).textContent;
            status = $(handlerObj).parent().find(`td.${STATUS_COLUMN_NAME}`).get(0).textContent;
            modal_title = "Notable Event";
            modal_id = "notable_event_id";
        }
        var status_ready = false;
        var assignee_ready = false;

        var edit_panel = '' +
            '<div class="modal fade modal-wide shared-alertcontrols-dialogs-editdialog in" id="edit_panel">' +
            '    <div class="modal-content">' +
            '      <div class="modal-header">' +
            '        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
            '        <h4 class="modal-title" id="exampleModalLabel">Edit ' + modal_title + '</h4>' +
            '      </div>' +
            '      <div class="modal-body modal-body-scrolling">' +
            '        <div id="info_message" class="hide alert alert-info" style="display: block;">' +
            '          <i class="icon-alert"></i><span id="info_text">You are editing ' + nr_notable_events + ' notable events</span>' +
            '        </div>' +
            '        <input type="hidden" id="notable_event_ids" value="' + notable_event_ids_string + '" />' +
            '        <div class="form form-horizontal form-complex" style="display: block;" autocomplete="off">' +
            '          <div class="control-group shared-controls-controlgroup">' +
            '            <label for="assignee" class="control-label">Assignee:</label>' +
            '            <div class="controls"><select name="assignee" id="assignee" disabled="disabled"></select></div>' +
            '          </div>' +
            '          <div class="control-group shared-controls-controlgroup">' +
            '            <label for="status" class="control-label">Status:</label>' +
            '            <div class="controls"><select name="status" id="status" disabled="disabled"></select></div>' +
            '          </div>' +
            '          <div class="control-group shared-controls-controlgroup">' +
            '            <label for="comment" class="control-label">Comment:</label>' +
            '            <div class="controls"><textarea type="text" name="comment" id="comment" class=""></textarea></div>' +
            '          </div>' +
            '        </div>' +
            '      </div>' +
            '      <div class="modal-footer">' +
            '        <button type="button" class="btn cancel modal-btn-cancel pull-left" data-dismiss="modal">Cancel</button>' +
            '        <button type="button" class="btn btn-primary" id="modal-save" disabled>Save</button>' +
            '      </div>' +
            '    </div>' +
            '</div>';
        $('body').prepend(edit_panel);

        // Get list of users and prepare dropdown
        $("#assignee").select2();
        let users = [];
        if (bulk) {
            users.push("(unchanged)");
        }
        users.push("unassigned");
        users.extend(AVAILABLE_USERS);

        _.each(users, function (user) {
            if (user == assignee) {
                $('#assignee').append($('<option></option>').attr("selected", "selected").val(user).html(user));
                $('#assignee').select2('data', { id: user, text: user });
            } else {
                $('#assignee').append($('<option></option>').val(user).html(user));
            }
        });
        $("#assignee").prop("disabled", false);
        assignee_ready = true;

        if (bulk) {
            $('#status').append($('<option></option>').attr("selected", "selected").val('(unchanged)').html('(unchanged)'));
        }
        _.each(AVAILABLE_STATUSES, function (val) {
            if (val['status'] == status) {
                $('#status').append($('<option></option>').attr("selected", "selected").val(val['status']).html(val['status_description']));
            } else {
                $('#status').append($('<option></option>').val(val['status']).html(val['status_description']));
            }
            $("#status").prop("disabled", false);
        });

        $('#modal-save').prop('disabled', false);

        $('#assignee').on("change", function () {
            console.log("change event fired on #assignee");
            if ($(this).val() == "unassigned") {
                $('#status').val('new');
            } else {
                $('#status').val('assigned');
            }
        });

        // Finally show modal
        $('#edit_panel').modal('show');
    }


    function handlerNotableEventQuickAssignToMe(handlerObj){
        var notable_event_id = $(handlerObj).parent().find("td.notable_event_id").get(0).textContent;
        if (notable_event_id == NOTABLE_EVENT_EMPTY_VALUE || notable_event_id == "-"){
            console.error("Selected notable event is not valid.");
        }
        var status = "assigned";
        var comment = "Assigning for review";
        var assignee = Splunk.util.getConfigValue("USERNAME");

        console.log("Username: ", assignee);
        var update_entry = { 'notable_event_id': notable_event_id, 'assignee': assignee, 'status': status, 'comment': comment };
        console.log("entry", update_entry);

        runNotableEventUpdaterSearch([update_entry]);
    }



    $(document).on("cyences_notable_event_handlers", "td, a", function (e, data) {

        // Displays a data object in the console
        console.log("cyences_notable_event_handlers fired", data);

        if (data.action == "notable_event_selector") {
            handlerNotableEventSelectionChange(this);

        } else if (data.action == "notable_event_edit") {
            handlerNotableEventEdit(this, data);
        }
        else if(data.action == "notable_event_quick_assign_to_me"){
            handlerNotableEventQuickAssignToMe(this);
        }
    });



    $(document).on("click", "#modal-save", function (event) {
        $('#modal-save').prop('disabled', true);
        var notable_event_ids = $("#notable_event_ids").val().split(':');
        var assignee = $("#assignee").val();
        var status = $("#status").val();
        var comment = $("#comment").val();

        if (notable_event_ids == "" || assignee == "" || status == "") {
            alert("Please choose a value for all required fields!");
            return false;
        }

        let entries_to_update = [];
        _.each(notable_event_ids, function(nei){
            if (nei != NOTABLE_EVENT_EMPTY_VALUE && nei == "-"){
                entry = {'notable_event_id': nei, 'comment': comment}
                if (assignee != "(unchanged)") {
                    entry.assignee = assignee;
                }
                if (status != "(unchanged)") {
                    entry.status = status;
                }
                entries_to_update.push(entry);
            }
        });

        runNotableEventUpdaterSearch(entries_to_update, function(){
            $('#edit_panel').modal('hide');
            $('#edit_panel').remove();
            $("input:checkbox[name=notable_event_selector]").prop('checked', false);
        });
    });


    $(document).on("click", "#bulk_edit_selected", function (e) {
        e.preventDefault();
        var notable_event_ids = selected_notable_events;
        if (notable_event_ids.length > 0) {
            console.log("launching cyences_notable_event_handlers handler with data", notable_event_ids);
            $(this).trigger("cyences_notable_event_handlers", { action: "notable_event_edit", notable_event_ids: notable_event_ids });
        } else {
            alert("You must select at least one notable event.");
        }
    });

    $(document).on("click", "#bulk_edit_all", function (e) {
        e.preventDefault();
        var notable_event_ids = all_notable_events;
        if (notable_event_ids.length > 0) {
            console.log("launching cyences_notable_event_handlers handler with data", notable_event_ids);
            $(this).trigger("cyences_notable_event_handlers", { action: "notable_event_edit", notable_event_ids: notable_event_ids });
        } else {
            alert("You must select at least one notable event.");
        }
    });

    $(document).on("click", "#bulk_edit_clear", function (e) {
        e.preventDefault();
        $("input:checkbox[name=notable_event_selector]").prop('checked', false);
        selected_notable_events = [];
    });

    $(document).on("click", "#bulk_edit_select_all", function (e) {
        e.preventDefault();
        $("input:checkbox[name=notable_event_selector]").prop('checked', true);
        selected_notable_events = all_notable_events;
    });



    let CyencesNotableEventIconRenderer = TableView.BaseCellRenderer.extend({
        canRender: function (cell) {
            // Only use the cell renderer for the specific field
            return (cell.field === ASSIGNEE_COLUMN_NAME || 
                cell.field === "notable_event_selector" || cell.field === "notable_event_edit" || cell.field === "notable_event_quick_assign_to_me");
        },
        render: function ($td, cell) {
            let icon, tooltip;

            // This is for handling upgrade scenario as after upgrade old notable events will not have notable_event_id, which is not editable. (value has NOTABLE_EVENT_EMPTY_VALUE set from Splunk query)
            if (cell.field == ASSIGNEE_COLUMN_NAME) {
                if (cell.value != NOTABLE_EVENT_EMPTY_VALUE) {
                    if (cell.value != "Unassigned") {
                        icon = 'user';
                        $td.addClass(cell.field).addClass('icon-inline').html(_.template('<i class="icon-<%-icon%>" style="padding-right: 2px"></i><%- text %>', {
                            icon: icon,
                            text: cell.value
                        }));
                    } else {
                        $td.addClass(cell.field).html(cell.value);
                    }
                }
                else {
                    $td.addClass(cell.field).html("-");
                }

            } else if (cell.field == "notable_event_selector") {
                if (cell.value != NOTABLE_EVENT_EMPTY_VALUE) {
                    $td.addClass('notable_event_selector');
                    if (_.contains(selected_notable_events, cell.value)) {
                        $td.html('<input type="checkbox" class="notable_event_selector" id="notable_event_selector" name="notable_event_selector" value="' + cell.value + '" checked="checked"></input>');
                    } else {
                        $td.html('<input type="checkbox" class="notable_event_selector" id="notable_event_selector" name="notable_event_selector" value="' + cell.value + '"></input>');
                    }
                    $td.on("click", function (e) {
                        e.stopPropagation();
                        $td.trigger("cyences_notable_event_handlers", { "action": cell.field });
                    });
                }
                else {
                    $td.addClass(cell.field).html("");
                }

            } else {
                if (cell.value != NOTABLE_EVENT_EMPTY_VALUE) {
                    // inline update related fields
                    if (cell.field == "notable_event_edit") {
                        icon = 'pencil';
                        tooltip = "Edit Notable Events";
                    } else if (cell.field == "notable_event_quick_assign_to_me") {
                        icon = 'user';
                        tooltip = "Assign to me";
                    }

                    var rendercontent = '<a class="btn-pill" data-toggle="tooltip" data-placement="top" title="<%-tooltip%>"><i class="icon-<%-icon%>"></i><span class="hide-text">Inspect</span></a>';

                    $td.addClass('table_inline_icon').html(_.template(rendercontent, {
                        icon: icon,
                        tooltip: tooltip
                    }));

                    $td.children('[data-toggle="tooltip"]').tooltip();

                    $td.on("click", function (e) {
                        console.log("event handler fired");
                        e.stopPropagation();
                        $td.trigger("cyences_notable_event_handlers", { "action": cell.field });
                    });
                }
                else {
                    $td.addClass(cell.field).html("");
                }
            }
        }
    });

    let CyencesNotableEventCSSClassRenderer = TableView.BaseCellRenderer.extend({
        canRender: function (cell) {
            // Only use the cell renderer for the specific field
            return (cell.field === "notable_event_id" || cell.field === ASSIGNEE_COLUMN_NAME || cell.field === STATUS_COLUMN_NAME);
        },
        render: function ($td, cell) {
            // Add class to retrieve the value of it later by referencing parent <tr>
            if (cell.value != NOTABLE_EVENT_EMPTY_VALUE) {
                $td.addClass(cell.field).html(cell.value);
            }
            else {
                $td.addClass(cell.field).html("-");
            }
        }
    });


    _.each(NOTABLE_EVENT_TABLE_IDS, function(tableId){
        let notableEventsTable = mvc.Components.get(tableId);
        if(notableEventsTable){
            notableEventsTable.getVisualization( function ( tableView ) {
                // Add custom cell renderer
                tableView.table.addCellRenderer(new CyencesNotableEventIconRenderer());
                tableView.table.addCellRenderer(new CyencesNotableEventCSSClassRenderer());
                tableView.table.render();
            });
        }
    });

    console.log("Notable Event Editor handler script loaded.");

});