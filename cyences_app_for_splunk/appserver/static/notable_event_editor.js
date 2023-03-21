require([
    "splunkjs/mvc",
    "underscore",
    "jquery",
    'splunkjs/mvc/tableview',
    'splunk.util',
    'select2/select2',
    '../app/cyences_app_for_splunk/splunk_common_js_v_utilities'
], function (
    mvc,
    _,
    $,
    TableView,
    splunkUtil,
    Select,
    SplunkCommonUtilities
) {

    const NOTABLE_EVENT_TABLE_SEARCH_ID = 'notable_event_main_search';
    const NOTABLE_EVENT_TABLE_ID = 'notable_event_main_tbl';   // NOTE - CSS contains this hard-coded value.

    const ASSIGNEE_COLUMN_NAME = 'Assignee';
    const STATUS_COLUMN_NAME = 'Status';

    const NOTABLE_EVENT_EMPTY_VALUE = 'BANANABANANA';

    let AVAILABLE_USERS = [];
    let AVAILABLE_STATUSES = ['Unassigned', 'Assigned', 'Under Investigation', 'Clean', 'Malicious'];

    let selected_notable_events = [];
    let all_notable_events = [];


    let notableEventSearchManager = new SplunkCommonUtilities.VSearchManagerUtility(
        function(data){
            let notableEventIdFieldNo = data.fields.indexOf("notable_event_id");
            all_notable_events = _.map(data.rows, function (e) { return e[notableEventIdFieldNo]; });
            $("#bulk_edit_container").remove();
            $(`#${NOTABLE_EVENT_TABLE_ID}`).parent().before($("<div />").attr('id', 'bulk_edit_container').addClass("bulk_edit_container").addClass('panel-element-row'));
            var links = _.template('<a href="#" id="bulk_edit_select_all">Select All</a> | <a href="#" id="bulk_edit_selected">Edit Selected</a> | <a href="#" id="bulk_edit_all">Edit All <%-nr_notable_events%> Matching Notable Events</a> | <a href="#" id="bulk_edit_clear">Reset Selection</a>', { nr_notable_events: all_notable_events.length });
            $("#bulk_edit_container").html(links);
            $("#bulk_edit_container").show();
        },
        function(errorProperties){
            console.log("Notable event main table search failed.");
        }
    );
    notableEventSearchManager.searchById(NOTABLE_EVENT_TABLE_SEARCH_ID);

    function restartNotableEventSearch(){
        notableEventSearchManager.startSearch();
    }


    // Fill Available User Utility
    new SplunkCommonUtilities.VSearchManagerUtility(
        function(results){
            for(let i=0; i< results.rows.length; i++){
                AVAILABLE_USERS.push(results.rows[i][0]);
            }
        },
        function(searchProperties){
            alert("Unable to get the available user list.");
        }).searchByQuery('| inputlookup cyences_splunk_user_list.csv | table username');


    function runNotableEventUpdaterSearch(entries_to_update, callBackFunction){
        // Splitting array into multiple queries in case bulk update contains many results, it may result into failure
        const chunkSize = 500;
        let searchesCompleted = {};
        for (let i = 0; i < entries_to_update.length; i += chunkSize) {
            const chunk = entries_to_update.slice(i, i + chunkSize);

            let searchQuery = '';
            for(let i=0; i<chunk.length; i++){
                let entry = chunk[i];
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

            searchesCompleted[i] = false;

            new SplunkCommonUtilities.VSearchManagerUtility(
                function(results){
                    if (results.rows.length > 0) {
                        // TODO - read through the output of the results and validate the custom command was successful.
                        searchesCompleted[i] = true;
                    }
                },
                function(errorProperties){
                    alert("Unable to update the notable event.");
                }
            ).searchByQuery(searchQuery);
        }

        new SplunkCommonUtilities.VWaitUntil(
            function(){
                for(let key in searchesCompleted){
                    if (searchesCompleted[key] === false){
                        return false;
                    }
                }
                return true;
            },
            function(){
                restartNotableEventSearch();
                if(callBackFunction != undefined){
                    callBackFunction();
                }
            }
        )
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
        users.push("Unassigned");
        users.push(...AVAILABLE_USERS);

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
            if (val == status) {
                $('#status').append($('<option></option>').attr("selected", "selected").val(val).html(val));
            } else {
                $('#status').append($('<option></option>').val(val).html(val));
            }
            $("#status").prop("disabled", false);
        });

        $('#modal-save').prop('disabled', false);

        $('#assignee').on("change", function () {
            console.log("change event fired on #assignee");
            if ($(this).val() == "Unassigned") {
                $('#status').val('Unassigned');
                $('#status option[value="Unassigned"]').prop('selected', true);
            } 
            else if ($('#status').val() == "Unassigned"){
                $('#status').val('Assigned');
                $('#status option[value="Assigned"]').prop('selected', true);
            }
        });

        // Finally show modal
        $('#edit_panel').modal('show');
    }


    function handlerNotableEventQuickAssignToMe(handlerObj){
        var notable_event_id = $(handlerObj).parent().find("td.notable_event_id").get(0).textContent;
        var status = $(handlerObj).parent().find(`td.${STATUS_COLUMN_NAME}`).get(0).textContent;

        if (notable_event_id == NOTABLE_EVENT_EMPTY_VALUE || notable_event_id == "-"){
            console.error("Selected notable event is not valid.");
        }
        if (status == "Unassigned") {
            status = "Assigned";
        }
        var assignee = Splunk.util.getConfigValue("USERNAME");
        var comment = "Assigning for review";

        console.log("Username: ", assignee);
        var update_entry = { 'notable_event_id': notable_event_id, 'assignee': assignee, 'status': status, 'comment': comment};

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
        for(let i=0; i<notable_event_ids.length; i++){
            let nei = notable_event_ids[i];
            if (nei != NOTABLE_EVENT_EMPTY_VALUE && nei != "-"){
                entry = {'notable_event_id': nei, 'comment': comment};
                if (assignee != "(unchanged)") {
                    entry.assignee = assignee;
                }
                if (status != "(unchanged)") {
                    entry.status = status;
                }
                entries_to_update.push(entry);
            }
        }

        runNotableEventUpdaterSearch(entries_to_update, function(){
            $('#edit_panel').modal('hide');
            $('#edit_panel').remove();
            $("input:checkbox[name=notable_event_selector]").prop('checked', false);
            selected_notable_events = [];
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


    let NotableEventRowExpansionRenderer = TableView.BaseRowExpansionRenderer.extend({
        initialize: function(args) {
            // initialize will run once, so we will set up a search and a chart to be reused.
            this._searchManagerNotableEventHistory = new SplunkCommonUtilities.VSearchManagerUtility();
            this._searchManagerNotableEventHistory.defineReusableSearch('notable-event-history-search-manager');
    
            this._searchManagerNotableEventResult = new SplunkCommonUtilities.VSearchManagerUtility();
            this._searchManagerNotableEventResult.defineReusableSearch('notable-event-result-search-manager');
    
            this._tableViewNotableEventHistory = new TableView({
                id: 'notable_event_history_table',
                managerid: 'notable-event-history-search-manager',
                'rowNumbers': true,
                'drilldown': 'none',
                'count': 100
            });
    
            this._tableViewNotableEventResult = new TableView({
                id: 'notable_event_result_table',
                managerid: 'notable-event-result-search-manager',
                'rowNumbers': false,
                'drilldown': 'none',
                'count': 100
            });
        },
        canRender: function(rowData) {
            return true;
        },
        render: function($container, rowData) {
            var notable_event_id = _(rowData.cells).find(function (cell) {
               return cell.field === 'notable_event_id';
            }).value;
    
            this._searchManagerNotableEventResult.executeReusableSearch(`\`cs_cyences_index\` notable_event_id="${notable_event_id}" | fields - _raw, notable_event_id, search_name, alert_name, category, info_min_time, info_max_time, info_search_time, search_now, timestartpos, timeendpos, eventtype, linecount, splunk_server, splunk_server_group, tag, "tag::*", date_*, host, index, source, sourcetype
            | rename * AS X_*_NEW
            | foreach * [ eval newFieldName=replace("<<FIELD>>", "\\s+", "_"), {newFieldName}='<<FIELD>>' ] | fields - "* *", newFieldName
            | foreach X_*_NEW [ eval <<MATCHSTR>>=<<FIELD>> ]
            | fields - X_*_NEW 
            | rename orig_* as * 
            | \`cs_human_readable_time_format(_time, alert_time)\`
            | table alert_time, event_tim*, cyences_severity, *`,
            SplunkCommonUtilities.VTokenManagerObj.getToken('timeRange.earliest'),
            SplunkCommonUtilities.VTokenManagerObj.getToken('timeRange.latest'));

            $container.append(`<div style="margin-top: 5px;"></div>`);
    
            $container.append(`<div style="color: white; margin-left: 100px; font-weight: bold;">Notable Event Result</div>`);
            // $("#temp").click(onMergeButtonClick);
            // this._tableView.addCellRenderer(expandedTableCheckBoxCellRenderer);
            $container.append(this._tableViewNotableEventResult.render().el);
    
            this._searchManagerNotableEventHistory.executeReusableSearch(`| inputlookup cyences_notable_event where notable_event_id="${notable_event_id}" | sort -update_time | \`cs_human_readable_time_format(update_time)\` | table user_making_change, notable_event_id, update_time, status, assignee, comment | rename notable_event_id as ID`);
    
            $container.append(`<br/><div style="color: white; margin-left: 100px; font-weight: bold;">Notable Event Change History</div>`);
            $container.append(this._tableViewNotableEventHistory.render().el);

            $container.append(`<div style="margin-bottom: 5px;"></div>`);
        }
    });


    let notableEventsTable = mvc.Components.get(NOTABLE_EVENT_TABLE_ID);
    if(notableEventsTable){
        notableEventsTable.getVisualization( function ( tableView ) {
            // Add custom cell renderer
            tableView.table.addCellRenderer(new CyencesNotableEventIconRenderer());
            tableView.table.addCellRenderer(new CyencesNotableEventCSSClassRenderer());
            tableView.addRowExpansionRenderer(new NotableEventRowExpansionRenderer());
            tableView.table.render();
        });
    }

    console.log("Notable Event Editor handler script loaded.");

});
