require([
    'jquery',
    '../app/cyences_app_for_splunk/splunk_common_js_v_utilities',
    'splunkjs/mvc/simplexml/ready!'
], function ($, SplunkCommonUtilities) {

    if (window.location.href.indexOf("cs_asset_intelligence") < 0 && window.location.href.indexOf("cs_device_inventory_table") < 0) {
        // Do not load the context menu on the Asset Intelligence dashboard and Device Inventory Table.

        let MAX_TEXT_SELECTION = 45;

        let dashboard_body = 'div.dashboard-body';
        let contextMenu = '#assetIntelligenceCtxMenu';

        function showContextMenu(type, text, mouseX, mouseY){
            let link;
            if (type === 'IP'){
                link = `<a href="/app/cyences_app_for_splunk/cs_asset_intelligence?form.tkn_ip_tmp=${text}&form.tkn_host_tmp=&form.tkn_user_tmp=" target="_blank">See IP(${text}) in Asset Intelligence</a>`;
            }
            else{
                link = `<a href="/app/cyences_app_for_splunk/cs_asset_intelligence?form.tkn_ip_tmp=&form.tkn_host_tmp=${text}&form.tkn_user_tmp=${text}" target="_blank">See Host/User(${text}) in Asset Intelligence</a>`;
            }
            $(contextMenu).append(link);
            $(contextMenu).css('left', (mouseX - 10)+"px");
            $(contextMenu).css('top', (mouseY + 20)+"px");
            $(contextMenu).show();
        }
        function hideContextMenu(){
            $(contextMenu).hide();
            $(contextMenu).empty();
            $(contextMenu).css('left', "");
            $(contextMenu).css('top', "");
        }

        // Add context menu html
        (() => {
            // Reference - https://stackoverflow.com/questions/4909167/how-to-add-a-custom-right-click-menu-to-a-webpage
            let contextMenuHtml = `
                <div id="assetIntelligenceCtxMenu">
                </div>`;
            $(dashboard_body).append(contextMenuHtml);
        })();


        function getSelectedText() {
            if (window.getSelection) {
                return window.getSelection().toString();
            } else if (document.selection) {
                return document.selection.createRange().text;
            }
            return '';
        }
        
        function checkIPAddress(selectedText){
            let expression = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/;
            return expression.test(selectedText);
        }

        $(dashboard_body).mouseup(function(event) {
            var text=getSelectedText();
            if (text!='' && text.length <= MAX_TEXT_SELECTION){
                if($(contextMenu).is(":visible")){
                    setTimeout(hideContextMenu, 0);
                }
                else{
                    if(checkIPAddress(text)){
                        showContextMenu("IP", text, event.pageX, event.pageY);
                    }
                    else{
                        showContextMenu("Host/User", text, event.pageX, event.pageY);
                    }
                }
            }
            else{
                hideContextMenu();
            }
        });
    }

    // Handles the multi-select option properly
    SplunkCommonUtilities.setupMultiSelectHandlerOnAll();
});
