require([
    "splunkjs/mvc",
    "underscore",
    "jquery",
    'splunkjs/mvc/tableview',
    '../app/cyences_app_for_splunk/splunk_common_js_v_utilities'
], function (
    mvc,
    _,
    $,
    TableView,
    SplunkCommonUtilities
) {

    const USER_INVENTORY_TABLE_SEARCH_ID = 'base_summary';
    const USER_INVENTORY_TABLE_ID = 'user_inventory_main_tbl';   // NOTE - CSS contains this hard-coded value.
    const DEFAULT_USER_ROLE = '(unchanged)';
    
    // TODO - decide the list of user roles for the administrative task.
    let AVAILABLE_USER_ROLES = [DEFAULT_USER_ROLE, 'Administrator', 'admin', 'Dcadmin', 'Root'];
    let selected_user_row_events = [];
    let all_users = [];

    // creates the div having diff options to select/edit the raws if the search contains the results.
    let userEventSearchManager = new SplunkCommonUtilities.VSearchManagerUtility(
        function(data){
            if (data == null){
                all_users = [];
                $("#bulk_edit_container").remove();
                return;
            }
            let uuid = data.fields.indexOf("uuid");
            all_users = _.map(data.rows, function (e) { return e[uuid]; });
            $("#bulk_edit_container").remove();
            $(`#${USER_INVENTORY_TABLE_ID}`).parent().before($("<div />").attr('id', 'bulk_edit_container').addClass("bulk_edit_container").addClass('panel-element-row'));
            var links = _.template('<a href="#" id="bulk_edit_select_all">Select All</a> | <a href="#" id="bulk_edit_selected">Edit Selected</a> | <a href="#" id="bulk_edit_all">Edit All <%-nr_users%> Matching Users</a> | <a href="#" id="bulk_edit_clear">Reset Selection</a>', { nr_users: all_users.length });
            $("#bulk_edit_container").html(links);
            $("#bulk_edit_container").show();
        },
        function(errorProperties){
            console.log("User inventory table search failed.");
        }
    );
    userEventSearchManager.searchById(USER_INVENTORY_TABLE_SEARCH_ID);

    function restartUserEventSearch(){
        userEventSearchManager.startSearch();
    }

    // create the search to execute when user click on save button of the popup.
    function runUserInventoryUpdaterSearch(entries_to_update, callBackFunction){
        // Splitting array into multiple queries in case bulk update contains many results, it may result into failure
        const chunkSize = 500;
        let searchesCompleted = {};
        for (let i = 0; i < entries_to_update.length; i += chunkSize) {
            const chunk = entries_to_update.slice(i, i + chunkSize);

            let user_role = chunk[0].user_role;
            let searchQuery = '';
            for(let i=0; i<chunk.length; i++){
                let entry = chunk[i];
                if (i==0){
                  searchQuery = `| inputlookup cs_user_inventory | search uuid IN (`;
                }
                searchQuery += `"${entry.uuid}",`;
            }
            searchQuery = searchQuery.slice(0,-1); 

            if (user_role==DEFAULT_USER_ROLE){
                searchQuery += `) | eval _key=uuid, privilege_user_role=null() | outputlookup cs_user_inventory append=true`;
            }
            else {
                searchQuery += `) | eval _key=uuid, privilege_user_role="${user_role}" | outputlookup cs_user_inventory append=true`;
            }
            console.log("Search Query for user inventory update: ", searchQuery);

            searchesCompleted[i] = false;

            new SplunkCommonUtilities.VSearchManagerUtility(
                function(results){
                    if (results != null) {
                        // TODO - read through the output of the results and validate the custom command was successful.
                        searchesCompleted[i] = true;
                    }
                },
                function(errorProperties){
                    alert("Unable to update the user entry in user inventory.");
                }
            ).searchByQuery(searchQuery);
        }

        SplunkCommonUtilities.vWaitUntil(
            function(){
                for(let key in searchesCompleted){
                    if (searchesCompleted[key] === false){
                        return false;
                    }
                }
                return true;
            },
            function(){
                restartUserEventSearch();
                if(callBackFunction != undefined){
                    callBackFunction();
                }
            }
        )
    }

    // create the popup dialoge box when user wants to edit the entries.
    function handlerUserInventoryEdit(handlerObj, data){
        console.log("user_event_edit handler.");

        let modal_title = "Privilege User Role";
        let nr_user_events = data.user_event_uuids.length;
        let user_event_uuids_string = data.user_event_uuids.join(':');

        var edit_panel = '' +
            '<div class="modal fade modal-wide shared-alertcontrols-dialogs-editdialog in" id="edit_panel">' +
            '    <div class="modal-content">' +
            '      <div class="modal-header">' +
            '        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
            '        <h4 class="modal-title" id="exampleModalLabel">Edit ' + modal_title + '</h4>' +
            '      </div>' +
            '      <div class="modal-body modal-body-scrolling">' +
            '        <div id="info_message" class="hide alert alert-info" style="display: block;">' +
            '          <i class="icon-alert"></i><span id="info_text">You are editing ' + nr_user_events + ' user events</span>' +
            '        </div>' +
            '        <input type="hidden" id="user_event_uuids" value="' + user_event_uuids_string + '" />' +
            '        <div class="form form-horizontal form-complex" style="display: block;" autocomplete="off">' +
            '          <div class="control-group shared-controls-controlgroup">' +
            '            <label for="user_role" class="control-label">User Role:</label>' +
            '            <div class="controls"><select name="user_role" id="user_role" disabled="disabled"></select></div>' +
            '          </div>' +
            '      </div>' +
            '      <div class="modal-footer">' +
            '        <button type="button" class="btn cancel modal-btn-cancel pull-left" data-dismiss="modal">Cancel</button>' +
            '        <button type="button" class="btn btn-primary" id="modal-save" disabled>Save</button>' +
            '      </div>' +
            '    </div>' +
            '</div>';
        $('body').prepend(edit_panel);

        _.each(AVAILABLE_USER_ROLES, function (val) {
            if (val == DEFAULT_USER_ROLE) {
                $('#user_role').append($('<option></option>').attr("selected", "selected").val(val).html(val));
            } else {
                $('#user_role').append($('<option></option>').val(val).html(val));
            }
            $("#user_role").prop("disabled", false);
        });

        $('#modal-save').prop('disabled', false);

        // Finally show modal
        $('#edit_panel').modal('show');
    }

    // maintain the list of selected row's uuids.
    function handlerUserEventSelectionChange(handlerObj){
        let uuid = $(handlerObj).parent().find("td.uuid").get(0).textContent;
        console.log("uuid", $(handlerObj).parent().find("td.user_row_selector").children("input").val());
        if ($(handlerObj).parent().find("td.user_row_selector").children("input").is(':checked')) {
            selected_user_row_events.push(uuid);
        } else {
            selected_user_row_events = _.without(selected_user_row_events, uuid);
        }
        console.log("selected_user_row_events", selected_user_row_events);
    }


    $(document).on("cyences_user_event_handlers", "td, a", function (e, data) {

        // Displays a data object in the console
        console.log("cyences_user_event_handlers fired", data);

        if (data.action == "user_row_selector") {
            handlerUserEventSelectionChange(this);
        } else if (data.action == "user_event_edit") {
            handlerUserInventoryEdit(this, data);
        }
    });



    $(document).on("click", "#modal-save", function (event) {
        $('#modal-save').prop('disabled', true);
        var user_event_uuids = $("#user_event_uuids").val().split(':');
        var user_role = $("#user_role").val();
        
        let entries_to_update = [];
        for(let i=0; i<user_event_uuids.length; i++){
            let entry = {'uuid': user_event_uuids[i], 'user_role': user_role};
            entries_to_update.push(entry);
        }

        runUserInventoryUpdaterSearch(entries_to_update, function(){
            $('#edit_panel').modal('hide');
            $('#edit_panel').remove();
            $("input:checkbox[name=user_row_selector]").prop('checked', false);
            selected_user_row_events = [];
        });
    });


    $(document).on("click", "#bulk_edit_selected", function (e) {
        e.preventDefault();
        var user_event_uuids = selected_user_row_events;
        if (user_event_uuids.length > 0) {
            console.log("launching cyences_user_event_handlers handler with data", user_event_uuids);
            $(this).trigger("cyences_user_event_handlers", { action: "user_event_edit", user_event_uuids: user_event_uuids });
        } else {
            alert("You must select at least one user event.");
        }
    });

    $(document).on("click", "#bulk_edit_all", function (e) {
        e.preventDefault();
        var user_event_uuids = all_users;
        if (user_event_uuids.length > 0) {
            console.log("launching cyences_user_event_handlers handler with data", user_event_uuids);
            $(this).trigger("cyences_user_event_handlers", { action: "user_event_edit", user_event_uuids: user_event_uuids });
        } else {
            alert("You must select at least one user event.");
        }
    });

    $(document).on("click", "#bulk_edit_clear", function (e) {
        e.preventDefault();
        $("input:checkbox[name=user_row_selector]").prop('checked', false);
        selected_user_row_events = [];
    });

    $(document).on("click", "#bulk_edit_select_all", function (e) {
        e.preventDefault();
        $("input:checkbox[name=user_row_selector]").prop('checked', true);
        selected_user_row_events = all_users;
    });



    let CyencesUserEventCheckboxRenderer = TableView.BaseCellRenderer.extend({
        canRender: function (cell) {
            // Only use the cell renderer for the specific field
            return (cell.field === "user_row_selector");
        },
        render: function ($td, cell) {

            if (cell.field == "user_row_selector") {
                $td.addClass('user_row_selector');
                if (_.contains(selected_user_row_events, cell.value)) {
                    $td.html('<input type="checkbox" class="user_row_selector" id="user_row_selector" name="user_row_selector" value="' + cell.value + '" checked="checked"></input>');
                } else {
                    $td.html('<input type="checkbox" class="user_row_selector" id="user_row_selector" name="user_row_selector" value="' + cell.value + '"></input>');
                }
                $td.children("input").on("click", function (e) {
                    e.stopPropagation();
                    $td.trigger("cyences_user_event_handlers", { "action": cell.field });
                });
            }
            }
        });

    let CyencesUserEventCSSClassRenderer = TableView.BaseCellRenderer.extend({
        canRender: function (cell) {
            // Only use the cell renderer for the specific field
            return (cell.field === "uuid");
        },
        render: function ($td, cell) {
            // Add class to retrieve the value of it later by referencing parent <tr>
            $td.addClass(cell.field).html(cell.value);
        }
    });


    let userEventsTable = mvc.Components.get(USER_INVENTORY_TABLE_ID);
    if(userEventsTable){
        userEventsTable.getVisualization( function ( tableView ) {
            // Add custom cell renderer
            tableView.table.addCellRenderer(new CyencesUserEventCheckboxRenderer());
            tableView.table.addCellRenderer(new CyencesUserEventCSSClassRenderer());
            tableView.table.render();
        });
    }

    console.log("User Inventory Event Editor handler script loaded.");

});
