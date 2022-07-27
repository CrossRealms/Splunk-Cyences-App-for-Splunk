
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


    /* Button Enable/Disable Functions */
    function enableButton(jqueryElementSelector){
        $(jqueryElementSelector).prop('disabled', false);
    }
    function disableButton(jqueryElementSelector){
        $(jqueryElementSelector).prop('disabled', true);
    }


    /* Common Credential Modal Functionality */
    function hideCredentialModel(id){
        $(`#${id}_myModal`).modal('hide');
        $(`#${id}_myModal`).hide();
    }

    async function onClickCredentialModalConfirmButton(id, pageMessageComponent, modalMessageComponent, loaderComponent, callbackActionFunction){
        debugger;
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
        let results = await executeAsyncSearch(`search index=test | stats count | eval client_id="${sophosEndpointClientID}", client_secret="${sophosEndpointClientSecret}"`);
        console.log("search results", results);

        if(sophosEndpointAction == 'Isolate'){
            // TODO - return true or false depending on status or validation and message as well
            return [true, `The endpoint id=${selectedSophosEndpointId} has been successfully isolated.`];
        }
        else{
            return [true, `The endpoint id=${selectedSophosEndpointId} has been successfully de-isolated.`];
        }
    }

    async function sophosIsolateEndpointCallbackFunction(username, password){
        sophosEndpointClientID = username;
        sophosEndpointClientSecret = password;
        return await sophosIsolateEndpoint();
    }


    async function isolateSophosEndpointButtonClickEventHandler(){
        debugger;
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
        $(`#btn_${SOPHOS_ENDPOINT_ISOLATION_ID}`).click(function(){
            isolateSophosEndpointButtonClickEventHandler();
        });
    });

});