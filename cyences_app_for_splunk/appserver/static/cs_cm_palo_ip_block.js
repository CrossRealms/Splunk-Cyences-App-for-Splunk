
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

    // For palo ip block operation
    let PALO_IP_BLOCK_MAIN_ID = "palo_ip_block";
    let BLOCK_IP_BUTTON_ID = `#btn_block_ip`;
    let UNBLOCK_IP_BUTTON_ID = `#btn_unblock_ip`;
    let palo_ip_block_loader = new Loader(`.${PALO_IP_BLOCK_MAIN_ID}_loader`);
    let palo_ip_block_page_message = new MessageUpdater(`#${PALO_IP_BLOCK_MAIN_ID}_message`);
    let palo_ip_block_modal_message = new MessageUpdater(`#${PALO_IP_BLOCK_MAIN_ID}_modalMessage`);

    // For showing palo blocked ip
    let PALO_SHOW_BLOCKED_IP_MAIN_ID = "palo_blocked_ip_list";
    let SHOW_BLOCKED_IP_BUTTON_ID = `#btn_show_blocked_ip`;
    let palo_show_blocked_ip_loader = new Loader(`.${PALO_SHOW_BLOCKED_IP_MAIN_ID}_loader`);
    let palo_show_blocked_ip_page_message = new MessageUpdater(`#${PALO_SHOW_BLOCKED_IP_MAIN_ID}_message`);
    let palo_show_blocked_ip_modal_message = new MessageUpdater(`#${PALO_SHOW_BLOCKED_IP_MAIN_ID}_modalMessage`);
    

    function disableButtons() {
        CMUtils.disableButton(BLOCK_IP_BUTTON_ID);
        CMUtils.disableButton(UNBLOCK_IP_BUTTON_ID);
        CMUtils.disableButton(SHOW_BLOCKED_IP_BUTTON_ID);
    }

    function enableButtons() {
        CMUtils.enableButton(BLOCK_IP_BUTTON_ID);
        CMUtils.enableButton(UNBLOCK_IP_BUTTON_ID);
        CMUtils.enableButton(SHOW_BLOCKED_IP_BUTTON_ID);
    }

    async function paloBlockIP(username, password, pageMessageComponent, modalMessageComponent, loaderComponent){
        // If function is called from the model then it will set the paloUsername and paloPassword
        // If function is called when the username and password is already configured then it will just again set the paloUsername and paloPassword same value 
        // The reason for handling this way is to avoid additional callback function
        paloUsername = username;
        paloPassword = password;

        pageMessageComponent.setMessage('Please wait...');
        loaderComponent.add();
        disableButtons();

        let data = {
            action: paloAction,
            username: paloUsername,
            password: paloPassword,
            ip_address: ipAddress,
            firewall_ip: firewall_ip,
        }

        let output;
        try{
            let res = await executeAsyncRestCall(`/CounterMeasurePaloIPBlock/${paloAction}`, 'POST', null, data);
            let message = `The ${ipAddress} has been successfully ${paloAction}ed.`
            pageMessageComponent.setSuccessMessage(message);
            output =  [true, message];
        }
        catch(err){
            pageMessageComponent.setFailureMessage(err);
            output =  [false, err]
        }


        loaderComponent.remove();
        enableButtons();

        return output; // This is required to set the message in the model
        // This way we will be able to set custom message in the model and page without code duplication.

    }

    async function paloBlockIPButtonClickEventHandler(){
        ipAddress = defaultTokens.get('tkn_ip_address');
        firewall_ip = defaultTokens.get('tkn_firewall_ip');

        if(paloUsername && paloUsername!="" && paloPassword && paloPassword!=""){

            await paloBlockIP(paloUsername, paloPassword, palo_ip_block_page_message, palo_ip_block_modal_message, palo_ip_block_loader); 
        }
        else{
            palo_ip_block_modal_message.setMessage('Please enter Palo Alto Firewall username and password');
            await CMUtils.showCredentialModel(
                id = PALO_IP_BLOCK_MAIN_ID,
                pageMessageComponent = palo_ip_block_page_message,
                modalMessageComponent = palo_ip_block_modal_message,
                loaderComponent = palo_ip_block_loader,
                callbackActionFunction = paloBlockIP);
        }
    }

    async function unblockClickHandler(ip) {
        const ip_id = `#palo_block_${ip.replaceAll('.', '_')}`
        paloAction = "allow";
        ipAddress = ip;

        CMUtils.disableButton(ip_id + "_btn")
        let [isSuccess, message] = await paloBlockIP(paloUsername, paloPassword, palo_show_blocked_ip_page_message, palo_show_blocked_ip_modal_message, palo_show_blocked_ip_loader);
        if (isSuccess) {
            $(ip_id).remove();
        }
        else {
            CMUtils.enableButton(ip_id + "_btn")
        }
    }
    window.unblockClickHandler = unblockClickHandler;

    function generate_table(json_string) {
        const item_list = JSON.parse(json_string)

        let table_body = '';

        if (item_list.length == 0) {
            table_body = '<tr><td colspan="2">No result found</td></tr>'
        }
        else {
            item_list.forEach(item => {
                const ip_id = `palo_block_${item.ip.replaceAll('.', '_')}`
                table_body += `<tr id="${ip_id}"><td>${item.ip}</td>
                <td><input type="button" id="${ip_id}_btn" class="btn btn-primary" value="Unblock" onClick="unblockClickHandler('${item.ip}')"/></td>
                </tr>`
            });
        }

        let table_content = `<table>
        <tr><th>Blocked IP Address</th><th>Action</th></tr>${table_body}
        </table>`

        return table_content
    }

    async function paloShowBlockedIP(username, password, pageMessageComponent, modalMessageComponent, loaderComponent){
        // If function is called from the model then it will set the paloUsername and paloPassword
        // If function is called when the username and password is already configured then it will just again set the paloUsername and paloPassword same value 
        // The reason for handling this way is to avoid additional callback function
        paloUsername = username;
        paloPassword = password;

        pageMessageComponent.setMessage('Please wait...');
        loaderComponent.add();
        disableButtons();

        let data = {
            action: "get",
            username: paloUsername,
            password: paloPassword,
            ip_address: "all",
            firewall_ip: firewall_ip,
        }

        let output;
        try{
            let res = await executeAsyncRestCall(`/CounterMeasurePaloIPBlock/${paloAction}`, 'POST', null, data);
            let message = `Successfully fetched blocked ip`
            $("#palo_blocked_ip_list").html(generate_table(res));
            pageMessageComponent.setSuccessMessage(message);
            output =  [true, message];
        }
        catch(err){
            pageMessageComponent.setFailureMessage(err);
            output =  [false, err]
        }


        loaderComponent.remove();
        enableButtons();

        return output; // This is required to set the message in the model
        // This way we will be able to set custom message in the model and page without code duplication.

    }

    async function paloShowBlockedIPButtonClickEventHandler(){
        firewall_ip = defaultTokens.get('tkn_firewall_ip');

        if(paloUsername && paloUsername!="" && paloPassword && paloPassword!=""){

            await paloShowBlockedIP(paloUsername, paloPassword, palo_show_blocked_ip_page_message, palo_show_blocked_ip_modal_message, palo_show_blocked_ip_loader);
        }
        else{
            palo_show_blocked_ip_modal_message.setMessage('Please enter Palo Alto Firewall username and password');
            await CMUtils.showCredentialModel(
                id = PALO_IP_BLOCK_MAIN_ID,
                pageMessageComponent = palo_show_blocked_ip_page_message,
                modalMessageComponent = palo_show_blocked_ip_modal_message,
                loaderComponent = palo_show_blocked_ip_loader,
                callbackActionFunction = paloShowBlockedIP);
        }
    }


    CMUtils.addModalToHTML(PALO_IP_BLOCK_MAIN_ID, "Palo Alto Firewall Authorization");
    $(BLOCK_IP_BUTTON_ID).click(function(){
        paloAction = "block"
        paloBlockIPButtonClickEventHandler();
    });
    $(UNBLOCK_IP_BUTTON_ID).click(function(){
        paloAction = "allow"
        paloBlockIPButtonClickEventHandler();
    });


    CMUtils.addModalToHTML(PALO_SHOW_BLOCKED_IP_MAIN_ID, "Palo Alto Firewall Authorization");
    $(SHOW_BLOCKED_IP_BUTTON_ID).click(function(){
        paloShowBlockedIPButtonClickEventHandler();
    });


});