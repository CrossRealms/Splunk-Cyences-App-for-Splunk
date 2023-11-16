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

    var selected_user_row_events = {};
    var all_users = {};

    var edit_panel = _.template('<div class="modal fade" id="edit_panel">' +
    '    <div class="modal-dialog">' +
    '    <div class="modal-content">' +
    '      <div class="modal-header">' +
    '        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
    '        <h4 class="modal-title" id="exampleModalLabel">Edit user privileges</h4>' +
    '      </div>' +
    '      <div class="modal-body modal-body-scrolling">' +
    '        <div id="info_message" class="hide alert alert-info" style="display: inline;">' +
    '          <i class="icon-alert"></i><span id="info_text">You are editing ????? user events</span></br>' +
    '        </div>' +
    '        <div id="info_message" class="hide alert alert-info" style="display: inline-block;">' +
    '          <span id="user_info_text">Privileged Users: Loading... && Non Privileged Users: Loading...</span>' +
    '        </div>' +
    '        <input type="hidden" id="user_event_uuids" value="?????" />' +
    '        <div class="form form-horizontal form-complex" style="display: block;" autocomplete="off">' +
    '          <div class="control-group shared-controls-controlgroup">' +
    '            <label for="is_privileged_user" class="control-label" data-toggle="tooltip" title="Do you want to previlege the selected users?">Enable user\'s privileges?</label>' +
    '            <div class="controls"><label class="switch"><input id="is_privileged_user" type="checkbox"><span class="slider round"></span></label></div>' +
    '          </div>' +
    '      </div>' +
    '      <div class="modal-footer">' +
    '        <button type="button" class="btn cancel modal-btn-cancel pull-left" data-dismiss="modal">Cancel</button>' +
    '        <button type="button" class="btn btn-primary" id="modal-save" disabled>Save</button>' +
    '      </div>' +
    '     </div>' +
    '    </div>' +
    '</div>');

    $('body').prepend(edit_panel);

    // creates the div having diff options to select/edit the raws if the search contains the results.
    let userEventSearchManager = new SplunkCommonUtilities.VSearchManagerUtility(
        function(data){
            if (data == null){
                all_users = {};
                $("#bulk_edit_container").remove();
                return;
            }
            let uuid = data.fields.indexOf("uuid");
            let is_privileged_user = data.fields.indexOf("is_privileged_user");
            _.map(data.rows, function (e) {
                if (e[is_privileged_user] == "Yes"){
                    all_users[e[uuid]] = 1;
                }
                else{
                    all_users[e[uuid]] = 0;
                }
            });
            $("#bulk_edit_container").remove();
            $(`#${USER_INVENTORY_TABLE_ID}`).parent().before($("<div />").attr('id', 'bulk_edit_container').addClass("bulk_edit_container").addClass('panel-element-row'));
            var links = _.template('<a href="#" id="bulk_edit_select_all">Select All</a> | <a href="#" id="bulk_edit_selected">Edit Selected</a> | <a href="#" id="bulk_edit_all">Edit All <%-nr_users%> Matching Users</a> | <a href="#" id="bulk_edit_clear">Reset Selection</a>', { nr_users: Object.keys(all_users).length });
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
    function ModifyUserPrivileges(entries_to_update, callBackFunction){
        // Splitting array into multiple queries in case bulk update contains many results, it may result into failure
        const chunkSize = 500;
        let searchesCompleted = {};
        for (let i = 0; i < entries_to_update.length; i += chunkSize) {
            const chunk = entries_to_update.slice(i, i + chunkSize);

            let searchQuery = '';
            for(let i=0; i<chunk.length; i++){
                let entry = chunk[i];
                if (i==0){
                  searchQuery = `| cyencesusermanager operation="privilegeuser" is_privileged_user="${entry.privilege_user}" user_uuids="`;
                }
                searchQuery += `${entry.uuid},`;
            }
            searchQuery = searchQuery.slice(0, -1);
            searchQuery += `" | table *`;
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

        $('#info_text').html(_.template("You are editing <%-nr_user_events%> user events", { nr_user_events: Object.keys(data.user_event_uuids).length }));
        $('#user_event_uuids').attr("value", Object.keys(data.user_event_uuids).join(','));

        let nr_privilege=0;
        let nr_non_privilege=0;
        _.each(data.user_event_uuids, function(value, key) {
            if (value){
                nr_privilege += 1;
            }
            else{
                nr_non_privilege += 1;
            }
        });

        $('#user_info_text').html(_.template("- Privileged Users: <%-nr_privilege_user%> </br>- Non Privileged Users: <%-nr_non_privilege_user%>", { nr_privilege_user: nr_privilege, nr_non_privilege_user: nr_non_privilege }));

        if (nr_non_privilege == 0){
            $("#is_privileged_user").prop('checked', true);
        }
        else{
            $("#is_privileged_user").prop('checked', false);
        }
        $('#modal-save').prop('disabled', false);

        // Finally show modal
        $('#edit_panel').modal('show');
        
    }

    // maintain the list of selected row's uuids.
    function handlerUserEventSelectionChange(handlerObj){
        let uuid = $(handlerObj).parent().find("td.uuid").get(0).textContent;
        let is_privilege;

        if ($(handlerObj).parent().find("td.IsPrivilegedUser").get(0).textContent == "Yes"){
            is_privilege = 1;
        }
        else{
            is_privilege = 0;
        }

        if ($(handlerObj).parent().find("td.user_row_selector").children("input").is(':checked')) {
            selected_user_row_events[uuid] = is_privilege;
        } else {
            delete selected_user_row_events[uuid];
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
        var user_event_uuids = $("#user_event_uuids").val().split(',');
        var privilege_user = $("#is_privileged_user").prop('checked');
        
        let entries_to_update = [];
        for(let i=0; i<user_event_uuids.length; i++){
            if (privilege_user==true){
                let entry = {'uuid': user_event_uuids[i], 'privilege_user': "Yes"};
                entries_to_update.push(entry);
            }
            else{
                let entry = {'uuid': user_event_uuids[i], 'privilege_user': "No"};
                entries_to_update.push(entry);
            }
        }

        ModifyUserPrivileges(entries_to_update, function(){
            $('#edit_panel').modal('hide');
            $("input:checkbox[name=user_row_selector]").prop('checked', false);
            selected_user_row_events = {};
        });
    });


    $(document).on("click", "#bulk_edit_selected", function (e) {
        e.preventDefault();
        var user_event_uuids = selected_user_row_events;
        if (Object.keys(user_event_uuids).length > 0) {
            console.log("launching cyences_user_event_handlers handler with data", user_event_uuids);
            $(this).trigger("cyences_user_event_handlers", { action: "user_event_edit", user_event_uuids: user_event_uuids });
        } else {
            alert("You must select at least one user event.");
        }
    });

    $(document).on("click", "#bulk_edit_all", function (e) {
        e.preventDefault();
        var user_event_uuids = all_users;
        
        if (Object.keys(user_event_uuids).length > 0) {
            console.log("launching cyences_user_event_handlers handler with data", user_event_uuids);
            $(this).trigger("cyences_user_event_handlers", { action: "user_event_edit", user_event_uuids: user_event_uuids });
        } else {
            alert("You must select at least one user event.");
        }
    });

    $(document).on("click", "#bulk_edit_clear", function (e) {
        e.preventDefault();
        $("input:checkbox[name=user_row_selector]").prop('checked', false);
        selected_user_row_events = {};
    });

    $(document).on("click", "#bulk_edit_select_all", function (e) {
        e.preventDefault();
        $("input:checkbox[name=user_row_selector]").prop('checked', true);
        selected_user_row_events = all_users;
    });



    let CyencesUserEventCheckboxRenderer = TableView.BaseCellRenderer.extend({
        canRender: function (cell) {
            // Only use the cell renderer for the specific field
            return (cell.field === "user_row_selector" || cell.field === "uuid" || cell.field === "IsPrivilegedUser");
        },
        render: function ($td, cell) {

            if (cell.field == "user_row_selector") {
                $td.addClass('user_row_selector');
                if (_.contains(Object.keys(selected_user_row_events), cell.value)) {
                    $td.html('<input type="checkbox" class="user_row_selector" id="user_row_selector" name="user_row_selector" value="' + cell.value + '" checked="checked"></input>');
                } else {
                    $td.html('<input type="checkbox" class="user_row_selector" id="user_row_selector" name="user_row_selector" value="' + cell.value + '"></input>');
                }
                $td.children("input").on("click", function (e) {
                    e.stopPropagation();
                    $td.trigger("cyences_user_event_handlers", { "action": cell.field });
                });
            }
            else if (cell.field == "uuid" || cell.field == "IsPrivilegedUser") {
                $td.addClass(cell.field).html(cell.value);
            }
          }
        });


    let userEventsTable = mvc.Components.get(USER_INVENTORY_TABLE_ID);
    if(userEventsTable){
        userEventsTable.getVisualization( function ( tableView ) {
            // Add custom cell renderer
            tableView.table.addCellRenderer(new CyencesUserEventCheckboxRenderer());
            tableView.table.render();
        });
    }

    console.log("User Inventory Event Editor handler script loaded.");

});
