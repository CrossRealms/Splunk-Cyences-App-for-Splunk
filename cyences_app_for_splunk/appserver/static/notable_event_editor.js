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
    let AVAILABLE_USERS = [];   // TODO - need to fill this list
    let AVAILABLE_STATUSES = [];   // TODO - need to fill this list

    let selected_notable_events = [];
    let all_notable_events = [];


    function fillAllNotableEventsVariable(){
        _.each(NOTABLE_EVENT_TABLE_SEARCH_IDS, function(searchId){
            let search_recent_alerts = mvc.Components.get(searchId);
            let search_recent_alerts_results = search_recent_alerts.data("results", { count: 0, output_mode: 'json_rows' });
            search_recent_alerts_results.on("data", function () {
                // Add layer with bulk edit links
                //console.log("search_recent_alerts", search_recent_alerts.data("results"),search_recent_alerts_results.data());
                if (search_recent_alerts_results.data() !== undefined) {
                    all_notable_events = _.map(search_recent_alerts_results.data().rows, function (e) { return e[0]; });
                    /* TODO - temporarily commented
                    $("#bulk_edit_container").remove();
                    $("#panel2-fieldset").after($("<div />").attr('id', 'bulk_edit_container').addClass("bulk_edit_container").addClass('panel-element-row'));
                    var links = _.template('<a href="#" id="bulk_edit_select_all">Select All</a> | <a href="#" id="bulk_edit_selected">Edit Selected</a> | <a href="#" id="bulk_edit_all">Edit All <%-nr_notable_events%> Matching Notable Events</a> | <a href="#" id="bulk_edit_clear">Reset Selection</a>', { nr_notable_events: all_notable_events.length });
                    $("#bulk_edit_container").html(links);
                    $("#bulk_edit_container").show();
                    */
                } else {
                    console.log("no recent alerts found for:", search_recent_alerts.data("results").cid);
                }
            });
        });
    }


    function restartNotableEventSearch(){
        _.each(NOTABLE_EVENT_TABLE_SEARCH_IDS, function(searchId){
            let searchManager = mvc.Components.get(searchId);
            if(searchManager){
                searchManager.startSearch();
                fillAllNotableEventsVariable();
            }
        });
    }


    function runNotableEventUpdaterSearch(){
        let searchQuery = '';

        let manager = new SearchManager({
            preview: false,
            autostart: false,
            search: searchQuery,
            earliest_time: '-1m',
            latest_time: 'now'
        });

        manager.on('search:done', function (properties) {
            console.log("Notable event updater search completed.", properties);

            let searchManagerResults = searchManager.data("results", {count: 0});
            searchManagerResults.on('data', function () {
                let resultData = searchManagerResults.data();
                if (resultData && resultData.rows) {
                    // TODO - read through the output of the results and validate the custom command was successful.
                    restartNotableEventSearch();
                }
                else{
                    // TODO - no event responded by the custom command.
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
            assignee = $(handlerObj).parent().find("td.assignee").get(0).textContent;
            status = $(handlerObj).parent().find("td.status").get(0).textContent;
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
        let users = AVAILABLE_USERS;
        if (bulk) {
            users.push("(unchanged)");
        }
        users.push("unassigned");

        _.each(data, function (el) {
            users.push(el.name);
        });

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

        let statuses = AVAILABLE_STATUSES;
        if (status == "auto_assigned") { status = "assigned"; }

        if (bulk) {
            $('#status').append($('<option></option>').attr("selected", "selected").val('(unchanged)').html('(unchanged)'));
        }

        _.each(statuses, function (val, text) {
            if (val['status'] == status) {
                $('#status').append($('<option></option>').attr("selected", "selected").val(val['status']).html(val['status_description']));
            } else {
                $('#status').append($('<option></option>').val(val['status']).html(val['status_description']));
            }
            $("#status").prop("disabled", false);
        });

        // Wait for assignee and status to be ready (TODO)
        /*$.when(status_xhr, owner_xhr, incident_groups_xhr).done(function () {
            console.log("status and owner are ready");
            $('#modal-save').prop('disabled', false);
        });*/

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
        var status = "assigned";
        var comment = "Assigning for review";
        var assignee = Splunk.util.getConfigValue("USERNAME");

        console.log("Username: ", assignee);
        var update_entry = { 'notable_event_id': notable_event_id, 'assignee': assignee, 'status': status, 'comment': comment };
        console.log("entry", update_entry);

        // TODO - update the data appropriately
        runNotableEventUpdaterSearch();
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

        if (notable_event_ids == "" || assignee == "" || urgency == "" || status == "") {
            alert("Please choose a value for all required fields!");
            return false;
        }

        var update_entry = { 'notable_event_ids': notable_event_ids, 'comment': comment };
        // 'assignee': assignee, 'urgency': urgency, 'status': status, 'group_id': group_id, comment': comment
        if (assignee != "(unchanged)") {
            update_entry.assignee = assignee;
        }
        if (status != "(unchanged)") {
            update_entry.status = status;
        }

        var update_incident_url = splunkUtil.make_url('/splunkd/__raw/services/alert_manager/helpers');
        var data = JSON.stringify(update_entry);
        var post_data = {
            action: 'update_incident',
            incident_data: data,
        };

        $.post(update_incident_url, post_data, function (data, status) {
            runNotableEventUpdaterSearch();
            mvc.Components.get("base_single_search").startSearch();
            $('#edit_panel').modal('hide');
            $('#edit_panel').remove();
            $("input:checkbox[name=bulk_edit_notable_events]").prop('checked', false);
            selected_notable_events = [];
        }, "text");

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
        $("input:checkbox[name=bulk_edit_notable_events]").prop('checked', false);
        selected_notable_events = [];
    });

    $(document).on("click", "#bulk_edit_select_all", function (e) {
        e.preventDefault();
        $("input:checkbox[name=bulk_edit_notable_events]").prop('checked', true);
        selected_notable_events = $("input:checkbox[name=bulk_edit_notable_events]:checked").map(function () { return $(this).val(); }).get();
    });





    let CyencesNotableEventIconRenderer = TableView.BaseCellRenderer.extend({
        canRender: function (cell) {
            // Only use the cell renderer for the specific field
            return (cell.field === "notable_event_id" || 
                 cell.field === "notable_event_selector" || cell.field === "notable_event_edit" || cell.field === "notable_event_assignee" || cell.field === "notable_event_quick_assign_to_me");
        },
        render: function ($td, cell) {
            let icon, tooltip;
            if(cell.field == "notable_event_id"){
                // Add class to retrieve the value of notable_event_id
                $td.addClass(cell.field).html(cell.value);

            // Cell Icon Updates
            } else if (cell.field == "notable_event_assignee") {
                if (cell.value != "Unassigned") {
                    icon = 'user';
                    $td.addClass(cell.field).addClass('icon-inline').html(_.template('<i class="icon-<%-icon%>" style="padding-right: 2px"></i><%- text %>', {
                        icon: icon,
                        text: cell.value
                    }));
                } else {
                    $td.addClass(cell.field).html(cell.value);
                }

            } else if (cell.field == "notable_event_selector") {
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

            } else {
                // inline update related fields
                if (cell.field == "notable_event_edit") {
                    icon = 'list';
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
        }
    });


    _.each(NOTABLE_EVENT_TABLE_IDS, function(tableId){
        let notableEventsTable = mvc.Components.get(tableId);
        if(notableEventsTable){
            notableEventsTable.getVisualization( function ( tableView ) {
                // Add custom cell renderer
                tableView.table.addCellRenderer(new CyencesNotableEventIconRenderer());
                tableView.table.render();
            });
        }
    });

    console.log("Notable Event Editor handler script loaded.");

});