
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
    console.log("cs_cm_palo_ip_block.js - JS loaded successfully.");

    /* Token Models */
    let defaultTokens = mvc.Components.getInstance('default');

    let paloUsername, paloPassword;
    let ipAddress, paloAction, firewall_ip;
    let MAIN_ID = "palo_ip_block";
    let BLOCK_IP_BUTTON_ID = `#btn_block_ip`;
    let ALLOW_IP_BUTTON_ID = `#btn_allow_ip`;
    let loader = new Loader(`.${MAIN_ID}_loader`);
    let page_message = new MessageUpdater(`#${MAIN_ID}_message`);
    let modal_message = new MessageUpdater(`#${MAIN_ID}_modalMessage`);

    function disableButtons() {
        CMUtils.disableButton(BLOCK_IP_BUTTON_ID);
        CMUtils.disableButton(ALLOW_IP_BUTTON_ID);
    }

    function enableButtons() {
        CMUtils.enableButton(BLOCK_IP_BUTTON_ID);
        CMUtils.enableButton(ALLOW_IP_BUTTON_ID);
    }

    async function paloBlockIP(){

        let data = {
            action: paloAction,
            username: paloUsername,
            password: paloPassword,
            ip_address: ipAddress,
            firewall_ip: firewall_ip,
        }

        let res;
        try{
            res = await executeAsyncRestCall(`/CounterMeasurePaloIPBlock/${paloAction}`, 'POST', null, data);
            return [true, `The ${ipAddress} has been successfully ${paloAction}ed.`];
        }
        catch(err){
            return [false, `Unexpected error occurred. Error: ${err}`]
        }
    }

    async function paloBlockIPCallbackFunction(username, password){
        paloUsername = username;
        paloPassword = password;
        return await paloBlockIP();
    }


    async function paloBlockIPButtonClickEventHandler(){
        ipAddress = defaultTokens.get('tkn_ip_address');
        firewall_ip = defaultTokens.get('tkn_firewall_ip');

        if(paloUsername && paloUsername!="" && paloPassword && paloPassword!=""){
            page_message.setMessage('Please wait...');
            loader.add();
            disableButtons();

            let [isSuccess, message] = await paloBlockIP();
            if(isSuccess){
                page_message.setSuccessMessage(message);
                modal_message.setSuccessMessage(message);
            }
            else{
                page_message.setFailureMessage(message);
                modal_message.setFailureMessage(message);
            }

            loader.remove();
            enableButtons();
        }
        else{
            modal_message.setMessage('Please enter Palo Alto Firewall username and password');
            await CMUtils.showCredentialModel(
                id = MAIN_ID,
                pageMessageComponent = page_message,
                modalMessageComponent = modal_message,
                loaderComponent = loader,
                callbackActionFunction = paloBlockIPCallbackFunction);
        }
    }

    CMUtils.addModalToHTML(MAIN_ID, "Palo Alto Firewall Authorization");
    $(BLOCK_IP_BUTTON_ID).click(function(){
        paloAction = "block"
        paloBlockIPButtonClickEventHandler();
    });
    $(ALLOW_IP_BUTTON_ID).click(function(){
        paloAction = "allow"
        paloBlockIPButtonClickEventHandler();
    });

});