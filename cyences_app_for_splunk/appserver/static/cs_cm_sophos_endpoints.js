
require([
    'jquery',
    '../app/cyences_app_for_splunk/loader',
    '../app/cyences_app_for_splunk/message_updater',
    '../app/cyences_app_for_splunk/execute_async_rest_call',
    '../app/cyences_app_for_splunk/cs_cm_utils',
    'splunkjs/mvc',
    'underscore',
    'splunkjs/mvc/simplexml/ready!'], 
function($, Loader, MessageUpdater, executeAsyncRestCall, CMUtils, mvc, _){
    console.log("cs_cm_sophos_endpoints.js - JS loaded successfully.");

    /* Token Models */
    let defaultTokens = mvc.Components.getInstance('default');

    let sophosEndpointClientID, sophosEndpointClientSecret;
    let selectedSophosEndpointId, sophosEndpointAction;
    let MAIN_ID = "isolate_sophos_endpoint";
    let ISOLATE_BUTTON_ID = `#btn_${MAIN_ID}`;
    let loader = new Loader(`.${MAIN_ID}_loader`);
    let page_message = new MessageUpdater(`#${MAIN_ID}_message`);
    let modal_message = new MessageUpdater(`#${MAIN_ID}_modalMessage`);


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
            page_message.setMessage('Please wait...');
            loader.add();
            CMUtils.disableButton(ISOLATE_BUTTON_ID);

            let [isSuccess, message] = await sophosIsolateEndpoint();
            if(isSuccess){
                page_message.setSuccessMessage(message);
                modal_message.setSuccessMessage(message);
            }
            else{
                page_message.setFailureMessage(message);
                modal_message.setFailureMessage(message);
            }

            loader.remove();
            CMUtils.enableButton(ISOLATE_BUTTON_ID);
        }
        else{
            modal_message.setMessage('Please enter the Sophos Endpoint Protection Client ID and Client Secret to validate yourself for the job.');
            await CMUtils.showCredentialModel(
                id = MAIN_ID,
                pageMessageComponent = page_message,
                modalMessageComponent = modal_message,
                loaderComponent = loader,
                callbackActionFunction = sophosIsolateEndpointCallbackFunction);
        }
    }

    defaultTokens.on('change:tkn_sophos_endpoint_action', function(){
        CMUtils.addModalToHTML(MAIN_ID);   // We need to add html after Splunk unhides the hidden panel as otherwise Splunk re-writes the content of the HTML panel
        $(ISOLATE_BUTTON_ID).click(function(){
            isolateSophosEndpointButtonClickEventHandler();
        });
    });

});