require([
    'jquery',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc',
    'underscore',
    '../app/cyences_app_for_splunk/splunk_common_js_v_utilities',
    'splunkjs/mvc/simplexml/ready!'],
    function ($, TableView, mvc, _, SplunkCommonUtilities) {

        function generateInFormattedSearchString(uuidList) {
            let search_uuids = "(";
            for (let i = 0; i < uuidList.length; i++) {
                if (i === 0) {
                    search_uuids += `"${uuidList[i]}"`;
                }
                else {
                    search_uuids += `, "${uuidList[i]}"`;
                }
            }
            search_uuids += ")";
            return search_uuids;
        }

        function setModelMessage(message) {
            $("#myModelMessage").text(message);
        }

        function disableModelCloseButton() {
            $("button.modelclosebutton").prop('disabled', true);
        }
        function enableModelCloseButton() {
            $("button.modelclosebutton").prop('disabled', false);
        }

        let selectedUUIDs;
        function disableModelConfirmButton() {
            $("button.modelconfirmbutton").prop('disabled', true).hide();
        }
        function enableModelConfirmButton(selected_uuids) {
            $("button.modelconfirmbutton").prop('disabled', false).show();
            selectedUUIDs = selected_uuids;
        }

        function showModel() {
            setModelMessage("Wait processing the request...");
            disableModelCloseButton();
            disableModelConfirmButton();
            $('#myModal').show()
            $('#myModal').modal('show');
        }
        function hideModel() {
            enableModelCloseButton();
            $('#myModal').modal('hide');
            $('#myModal').hide()
        }


        $("button.modelclosebutton").click(function () {
            hideModel();
            selectedUUIDs = undefined;
        });

        $("#modelConfirmButton").click(function () {
            setModelMessage("Merging the devices...");
            disableModelCloseButton();
            disableModelConfirmButton();

            let firstUUID = selectedUUIDs[0];
            let devicesToMerge = selectedUUIDs.slice(1).toString();

            // Note - device_inventory_merge_logs.csv are just for logs
            new SplunkCommonUtilities.VSearchManagerUtility(
                function (results) {
                    // This will return no search results
                    enableModelCloseButton();
                    setModelMessage(`Devices successfully merged to device UUID:${firstUUID} - Changes reflect on the dashboard when you refresh the page.`);
                    // TODO - Re-run all searches on the dashboard (future)
                }).searchByQuery(`| cyencesdevicemanager operation="manualmerge" target_device="${firstUUID}" devices_to_merge="${devicesToMerge}" | table *`);
        });

        function onMergeButtonClick() {
            // Start model and processing spinner to show progress
            showModel();
            let selected_uuids = [];
            $.each($("input[type=checkbox].device-selection"), function () {
                // console.log("check: ", $(this).attr('id'), $(this).is(":checked"));
                if ($(this).is(":checked")) {
                    selected_uuids.push($(this).attr('id'))
                }
            });
            if (selected_uuids.length < 2) {
                setModelMessage("Select at least 2 devices to merge.");
                enableModelCloseButton();
                return;
            }
            let search_uuids = generateInFormattedSearchString(selected_uuids);
            // NOTE - Run the search query to get details about all the selected uuids and make sure that no product ids collide
            setModelMessage(`Are you sure you wanna merge these devices? ${search_uuids}`);
            enableModelConfirmButton(selected_uuids);
            enableModelCloseButton();
        }


        // Use the BaseCellRenderer to add checkboxes
        let ExpandedTableCheckBoxCellRenderer = TableView.BaseCellRenderer.extend({
            canRender: function (cellData) {
                return cellData.field !== 'field';
            },

            render: function ($td, cellData) {
                if (cellData.value !== null) {
                    // console.log("cellData", cellData);
                    if (Array.isArray(cellData.value)) {
                        let innerHtml = ``;
                        for (let i = 0; i < cellData.value.length; i++) {
                            innerHtml += `<div class="multivalue-subcell" data-mv-index="${i}">${cellData.value[i]}</div>`;
                        }
                        $td.addClass("string").html(innerHtml);
                    }
                    else {
                        let cell_value = cellData.value.trim();
                        let match = /^CHECKBOX_THIS_(?<uuid>[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/g.exec(cell_value);
                        if (match !== null && match.length >= 2) {
                            $td.addClass("string").html(`<input type="checkbox" class="device-selection" title="${match[1]}" id="${match[1]}" />`);
                            $td.click(function (e) {
                                // console.log("clicked on cell.")
                                e.stopPropagation();   // To stop from Splunk from disabling clicking on checkbox
                            });
                        }
                        else {
                            $td.addClass("string").html(cell_value);
                        }
                    }
                }
            }
        });
        let expandedTableCheckBoxCellRenderer = new ExpandedTableCheckBoxCellRenderer();

        var DeviceInventoryManagementExpansionRenderer = TableView.BaseRowExpansionRenderer.extend({
            initialize: function (args) {
                // initialize will run once, so we will set up a search and a chart to be reused.
                this._searchManager = new SplunkCommonUtilities.VSearchManagerUtility();
                this._searchManager.defineReusableSearch('details-search-manager');

                this._chartView = new TableView({
                    id: 'row_expanded_table',
                    managerid: 'details-search-manager',
                    'rowNumbers': false,
                    'drilldown': 'none',
                    'count': 100    /* TODO - Currently, there is bug in the expandable table view where if once you switch in the page in the main table, 
                                          the expanded table will not allow to switch page.
                                          So, we are putting 100 as max count for now to accommodate most of the cases. */
                });
            },
            canRender: function (rowData) {
                // Since more than one row expansion renderer can be registered we let each decide if they can handle that
                // data
                // Here we will always handle it.
                return true;
            },
            render: function ($container, rowData) {
                // rowData contains information about the row that is expanded.  We can see the cells, fields, and values
                // We will find the HOST_ID cell to use its value
                var uuids = _(rowData.cells).find(function (cell) {
                    return cell.field === 'uuid';
                }).value;
                let search_uuids = generateInFormattedSearchString(uuids);

                //update the search with the HOST_ID that we are interested in
                this._searchManager.executeReusableSearch(`| cyencesdevicemanager operation="getdevices" | table * | where uuid IN ${search_uuids} 
            | mvexpand product_uuids 
            | rename product_uuids as product_uuid 
            | join product_uuid type=left 
                [| inputlookup cs_lansweeper_inventory
                | rename time as lansweeper_last_event 
                | fields - ip, hostname, mac_address
                | append 
                    [| inputlookup cs_tenable_inventory
                    | rename time as tenable_last_event, created_at as tenable_created_at, first_seen as tenable_first_seen, last_seen as tenable_last_seen 
                    | fields - ip, hostname, mac_address] 
                | append 
                    [| inputlookup cs_nessus_inventory
                    | rename time as nessus_last_event, created_at as nessus_created_at, first_seen as nessus_first_seen, last_seen as nessus_last_seen 
                    | fields - ip, hostname, mac_address] 
                | append 
                    [| inputlookup cs_qualys_inventory
                    | rename time as qualys_last_event 
                    | fields - ip, hostname, mac_address] 
                | append 
                    [| inputlookup cs_sophos_inventory 
                    | rename time as sophos_last_event 
                    | fields - ip, hostname, mac_address] 
                | append 
                    [| inputlookup cs_windows_defender_inventory 
                    | rename time as defender_last_event 
                    | fields - ip, hostname, mac_address] 
                | append 
                    [| inputlookup cs_crowdstrike_inventory
                    | rename time as crowdstrike_last_event 
                    | fields - ip, hostname, mac_address] 
                | append 
                    [| inputlookup cs_kaspersky_inventory
                    | rename time as kaspersky_last_event 
                    | fields - ip, hostname, mac_address] 
                | append 
                    [| inputlookup cs_splunk_inventory
                    | rename time as splunk_last_event 
                    | fields - ip, hostname, mac_address] ] 
            | stats values(*) as * by uuid 
            | eval lansweeper_os=coalesce(lansweeper_os, AssetType." ".OSVersion." ".AssetVersion) 
            | rename AssetType AS lansweeper_asset_type, Description as lansweeper_description 
            | rename NETWORK_ID as qualys_network_id 
            | eval _time=strftime(latest_time, "%F %T") 
            | eval Select="CHECKBOX_THIS_".uuid 
            | rename ips as ip, hostnames as hostname, mac_addresses as mac_address
            | table uuid, Select, _time, ip, hostname, mac_address, lansweeper_id, lansweeper_state, lansweeper_asset_type, lansweeper_os, lansweeper_user, lansweeper_description, qualys_id, QUALYS_OS, qualys_network_id, tenable_uuid, tenable_os, nessus_uuid, nessus_os, sophos_uuid, sophos_type, sophos_os, sophos_user, sophos_login_via, sophos_health, sophos_product_installed, crowdstrike_id,kaspersky_collected_by,kaspersky_version,kaspersky_host, kaspersky_status, windows_defender_host, splunk_host, splunk_os, splunk_version, splunk_forwarder_type
            | transpose 0 header_field=uuid column_name=field include_empty=false`);
                // $container is the jquery object where we can put out content.
                // In this case we will render our chart and add it to the $container
                $container.append(`<div><button id="device_inventory_manager_merge_button" style="
                margin-left: 8%;
                margin-bottom: 10px;
                margin-top: 10px;
                padding: 5px;
                padding-left: 20px;
                padding-right: 20px;">Merge</button></div>`);
                $("#device_inventory_manager_merge_button").click(onMergeButtonClick);
                this._chartView.addCellRenderer(expandedTableCheckBoxCellRenderer);
                $container.append(this._chartView.render().el);
            }
        });
        var tableElement = mvc.Components.getInstance("device_inventory_management_table");
        tableElement.getVisualization(function (tableView) {
            // Add custom cell renderer, the table will re-render automatically.
            tableView.addRowExpansionRenderer(new DeviceInventoryManagementExpansionRenderer());
        });
    });