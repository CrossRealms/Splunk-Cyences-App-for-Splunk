
require([
    'jquery',
    '../app/cyences_app_for_splunk/loader',
    '../app/cyences_app_for_splunk/message_updater',
    'splunkjs/mvc/searchmanager',
    'splunkjs/mvc',
    'underscore',
    'splunkjs/mvc/simplexml/ready!'], 
function($, Loader, MessageUpdater, SearchManager, mvc, _){
    console.log("cs_cm_sophos_endpoints.js - JS loaded successfully.");

    /* Token Models */
    let defaultTokens = mvc.Components.getInstance('default');


    /* Common Async Search Functionality */
    function executeAsyncSearch(searchQuery){
        return new Promise((resolve, reject) => {
            // Defining search and search manager
            var searchManager = new SearchManager({
                preview: true,
                autostart: true,
                search: searchQuery,
                cache: false
            });
    
            // Processing results search manager.
            var searchManagerResults = searchManager.data("results", {count: 0});

            searchManagerResults.on('data', function () {
                resolve(searchManagerResults.data().rows);
            });

            searchManagerResults.on('error', function (err) {
                reject(err);
            });
        });
    }


    /* Common Async Rest Call Functionality */
    function executeAsyncRestCall(endpoint, method, query, data){
        return new Promise((resolve, reject) => {
            let service = mvc.createService();
            data = JSON.stringify(data);

            /* service.request parameters - https://docs.splunk.com/DocumentationStatic/JavaScriptSDK/1.0/splunkjs.Service.html

                path - String -> The REST endpoint path segment (with any query parameters already appended and encoded).
                method - String -> The HTTP method (can be GET, POST, or DELETE).
                query - Object -> The entity-specific parameters for this request.
                post - Object -> A dictionary of POST argument that will get form encoded.
                body - Object -> The body of the request, mutually exclusive with post.
                headers - Object -> Headers for this request.
                callback - Function -> The function to call when the request is complete: (err, response).
            */
            service.request(endpoint, method, null, null, {"data": data}, null, function(error, response){
                debugger;
            // service.post(endpoint, {"data": data}, function(error, response){
                console.log("API Response: ", response);
                if(response && response.data.entry[0].content['success'] && response.data.entry[0].content['success'] != ''){
                    resolve(response.data.entry[0].content['success']);
                }
                else if(response && response.data.entry[0].content['error'] && response.data.entry[0].content['error'] != ''){
                    reject(response.data.entry[0].content['error']);
                }
                else if(error && error['error']){
                    reject(error['error']);
                }
                else{
                    reject("Unknown error.");
                }
            });

        });
    }


    /* Button Enable/Disable Functions */
    function enableButton(jqueryElementSelector){
        $(jqueryElementSelector).prop('disabled', false);
    }
    function disableButton(jqueryElementSelector){
        $(jqueryElementSelector).prop('disabled', true);
    }


    /* Common Credential Modal Functionality */
    function addModalToHTML(id){
        let credentialModalHTMLTemplate = `<p id="isolate_sophos_endpoint_message"/>
        <span class="isolate_sophos_endpoint_loader"/>
        <div class="modal fade" id="${id}_myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display:none;">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header text-center">
              <h4 class="modal-title w-100 font-weight-bold">Sophos Endpoint Protection Authorization</h4>
              <button type="button" class="close modelclosebutton" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">Close</span>
              </button>
            </div>
            <div class="modal-body mx-3">
              <div>
                <p id="${id}_modalMessage"/>
                <span class="${id}_loader"/>
              </div>
              <div class="md-form mb-5">
                <i class="fas fa-envelope prefix grey-text"/>
                <input type="text" id="${id}_username" class="form-control validate" style="width: 100%;" placeholder="Client ID"/>
              </div>
              <div class="md-form mb-4">
                <i class="fas fa-lock prefix grey-text"/>
                <input type="password" id="${id}_password" class="form-control validate" style="width: 100%;" placeholder="Client Secret"/>
              </div>
            </div>
            <div class="modal-footer d-flex justify-content-center text-center">
              <button class="btn btn-success modelconfirmbutton" id="${id}_modelConfirmButton">Confirm</button>
            </div>
          </div>
        </div>
      </div>`;
      $(`#${id}_add_modal_here`).html(credentialModalHTMLTemplate);
    }

    function hideCredentialModel(id){
        $(`#${id}_myModal`).modal('hide');
        $(`#${id}_myModal`).hide();
    }

    async function onClickCredentialModalConfirmButton(id, pageMessageComponent, modalMessageComponent, loaderComponent, callbackActionFunction){
        let username =$(`#${id}_username`).val();
        let password =$(`#${id}_password`).val();
        // TODO - validation here

        modalMessageComponent.setMessage('Please wait...');
        loaderComponent.add();
        disableButton("button.modelclosebutton");
        disableButton("button.modelconfirmbutton");

        let [isSuccess, message] = await callbackActionFunction(username, password);
        if(isSuccess){
            pageMessageComponent.setSuccessMessage(message);
            modalMessageComponent.setSuccessMessage(message);

            hideCredentialModel(id);
            loaderComponent.remove();
        }
        else{
            pageMessageComponent.setFailureMessage(message);
            modalMessageComponent.setFailureMessage(message);

            enableButton("button.modelclosebutton");
            enableButton("button.modelconfirmbutton");
            loaderComponent.remove();
        }
    }

    async function showCredentialModel(id, pageMessageComponent, modalMessageComponent, loaderComponent, callbackActionFunction){
        enableButton("button.modelclosebutton");
        enableButton("button.modelconfirmbutton");
        loaderComponent.remove();

        $(`#${id}_myModal`).show();
        $(`#${id}_myModal`).modal('show');

        $(`#${id}_modelConfirmButton`).click(function(event){
            onClickCredentialModalConfirmButton(id, pageMessageComponent, modalMessageComponent, loaderComponent, callbackActionFunction);
        });

        $("button.modelclosebutton").click(function(event){
            hideCredentialModel(id);
        });
    }



    let sophosEndpointClientID, sophosEndpointClientSecret;
    let selectedSophosEndpointId, sophosEndpointAction;
    let SOPHOS_ENDPOINT_ISOLATION_ID = "isolate_sophos_endpoint";
    let sophosEndpointLoader = new Loader(`.${SOPHOS_ENDPOINT_ISOLATION_ID}_loader`);
    let sophosEndpointPageMessage = new MessageUpdater(`#${SOPHOS_ENDPOINT_ISOLATION_ID}_message`);
    let sophosEndpointModalMessage = new MessageUpdater(`#${SOPHOS_ENDPOINT_ISOLATION_ID}_modalMessage`);


    async function sophosIsolateEndpoint(){
        // TODO - read token to find which endpoint to isolate
        console.log("U.....");
        // TODO - Use POST RestEndpoint instead of search to avoid putting client ID and Client Secret in the search history
        // let results = await executeAsyncSearch(`search index=test | stats count | eval client_id="${sophosEndpointClientID}", client_secret="${sophosEndpointClientSecret}"`);
        // console.log("search results", results);
        debugger;

        // TODO - return true or false depending on status or validation and message as well
        let data = {
            action: sophosEndpointAction,
            client_id: sophosEndpointClientID,
            client_secret: sophosEndpointClientSecret,
            endpoint_uuid: selectedSophosEndpointId
        }

        let res;
        try{
            res = await executeAsyncRestCall(`/CounterMeasureSophosEndpoint/${sophosEndpointAction}`, 'POST', null, data);
            console.log("rest call response", res);
            return [true, `The endpoint id=${selectedSophosEndpointId} has been successfully ${sophosEndpointAction}.`];
        }
        catch(err){
            return [false, `Unexpected error occurred during sophos endpoint. Err:${err}`]
        }
    }

    async function sophosIsolateEndpointCallbackFunction(username, password){
        sophosEndpointClientID = username;
        sophosEndpointClientSecret = password;
        return await sophosIsolateEndpoint();
    }


    async function isolateSophosEndpointButtonClickEventHandler(){
        selectedSophosEndpointId = defaultTokens.get('tkn_sophos_selected_uuid');
        sophosEndpointAction = defaultTokens.get('tkn_sophos_endpoint_action');

        if(sophosEndpointClientID && sophosEndpointClientID!="" && sophosEndpointClientSecret && sophosEndpointClientSecret!=""){
            sophosEndpointPageMessage.setMessage('Please wait...');
            sophosEndpointLoader.add();
            disableButton(`#btn_${SOPHOS_ENDPOINT_ISOLATION_ID}`);

            let [isSuccess, message] = await sophosIsolateEndpoint();
            if(isSuccess){
                sophosEndpointPageMessage.setSuccessMessage(message);
                sophosEndpointModalMessage.setSuccessMessage(message);
            }
            else{
                sophosEndpointPageMessage.setFailureMessage(message);
                sophosEndpointModalMessage.setFailureMessage(message);
            }

            sophosEndpointLoader.remove();
            enableButton(`#btn_${SOPHOS_ENDPOINT_ISOLATION_ID}`);
        }
        else{
            sophosEndpointModalMessage.setMessage('Please enter the Sophos Endpoint Protection Client ID and Client Secret to validate yourself for the job.');
            await showCredentialModel(
                id = SOPHOS_ENDPOINT_ISOLATION_ID,
                pageMessageComponent = sophosEndpointPageMessage,
                modalMessageComponent = sophosEndpointModalMessage,
                loaderComponent = sophosEndpointLoader,
                callbackActionFunction = sophosIsolateEndpointCallbackFunction);
        }
    }

    defaultTokens.on('change:tkn_sophos_endpoint_action', function(){
        addModalToHTML(SOPHOS_ENDPOINT_ISOLATION_ID);   // We need to add html after Splunk unhides the hidden panel as otherwise Splunk re-writes the content of the HTML panel
        $(`#btn_${SOPHOS_ENDPOINT_ISOLATION_ID}`).click(function(){
            isolateSophosEndpointButtonClickEventHandler();
        });
    });

});