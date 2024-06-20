require([
    'splunkjs/mvc',
    '../app/cyences_app_for_splunk/splunk_common_js_v_utilities',
    'splunkjs/mvc/simplexml/ready!'], 
function(mvc, SplunkCommonUtilities){

    var submittedTokens = mvc.Components.getInstance('submitted');
    var defaultTokens = mvc.Components.getInstance('default');

    function setToken(name, value){
        defaultTokens.set(name, value);
        submittedTokens.set(name, value);
        defaultTokens.set(name + '_label', value);
        if(name == 'tkn_filter_ip_only'){
            defaultTokens.set(name + '_label', `(ip IN ${value})`);
        }
        if(name == 'tkn_filter_host_only'){
            defaultTokens.set(name + '_label', `(host IN ${value})`);
        }
        if(name == 'tkn_filter_user_only'){
            defaultTokens.set(name + '_label', `(user IN ${value})`);
        }
    }

    function unsetToken(name){
        defaultTokens.unset(name);
        submittedTokens.unset(name);
        defaultTokens.set(name + '_label', '(FILTER NOT SET)');
        if(name == 'tkn_filter_ip_only'){
            defaultTokens.set(name + '_label', '(IP FILTER NOT SET)');
        }
        if(name == 'tkn_filter_host_only'){
            defaultTokens.set(name + '_label', '(HOST FILTER NOT SET)');
        }
        if(name == 'tkn_filter_user_only'){
            defaultTokens.set(name + '_label', '(USER FILTER NOT SET)');
        }
        if(name == 'tkn_filter_ip_host'){
            defaultTokens.set(name + '_label', '(IP/HOST FILTER NOT SET)');
        }
        if(name == 'tkn_filter_authentication'){
            defaultTokens.set(name + '_label', '(IP/USER FILTER NOT SET)');
        }
    }

    new SplunkCommonUtilities.VSearchManagerUtility(
        function(data){
            if(data == null){
                setToken("tkn_tablefields_lansweeper", "");
                unsetToken("tkn_show_hide_lansweeper");
                setToken("tkn_tablefields_qualys", "");
                unsetToken("tkn_show_hide_qualys");
                setToken("tkn_tablefields_tenable", "");
                unsetToken("tkn_show_hide_tenable");
                setToken("tkn_tablefields_nessus", "");
                unsetToken("tkn_show_hide_nessus");
                setToken("tkn_tablefields_sophos", "");
                unsetToken("tkn_show_hide_sophos");
                setToken("tkn_tablefields_defender", "");
                unsetToken("tkn_show_hide_defender");
                setToken("tkn_tablefields_crowdstrike", "");
                unsetToken("tkn_show_hide_crowdstrike");
                setToken("tkn_tablefields_kaspersky", "");
                unsetToken("tkn_show_hide_kaspersky");
                setToken("tkn_tablefields_splunk", "");

            }
            let results = data.rows[0];   // only one row of data is important for us
            let lansweeper = results[0];
            let qualys = results[1];
            let tenable = results[2];
            let nessus = results[3];
            let sophos = results[4];
            let defender = results[5];
            let crowdstrike = results[6];
            let kaspersky = results[7];
            let splunk = results[8]

            if(lansweeper > 0){
                setToken("tkn_tablefields_lansweeper", ", lansweeper");
                setToken("tkn_show_hide_lansweeper", "true");
            }
            else{
                setToken("tkn_tablefields_lansweeper", "");
                unsetToken("tkn_show_hide_lansweeper");
            }

            if(qualys > 0){
                setToken("tkn_tablefields_qualys", ", qualys");
                setToken("tkn_show_hide_qualys", "true");
            }
            else{
                setToken("tkn_tablefields_qualys", "");
                unsetToken("tkn_show_hide_qualys");
            }

            if(tenable > 0){
                setToken("tkn_tablefields_tenable", ", tenable");
                setToken("tkn_show_hide_tenable", "true");
            }
            else{
                setToken("tkn_tablefields_tenable", "");
                unsetToken("tkn_show_hide_tenable");
            }

            if(nessus > 0){
                setToken("tkn_tablefields_nessus", ", nessus");
                setToken("tkn_show_hide_nessus", "true");
            }
            else{
                setToken("tkn_tablefields_nessus", "");
                unsetToken("tkn_show_hide_nessus");
            }

            if(sophos > 0){
                setToken("tkn_tablefields_sophos", ", sophos");
                setToken("tkn_show_hide_sophos", "true");
            }
            else{
                setToken("tkn_tablefields_sophos", "");
                unsetToken("tkn_show_hide_sophos");
            }

            if(defender > 0){
                setToken("tkn_tablefields_defender", ", defender");
                setToken("tkn_show_hide_defender", "true");
            }
            else{
                setToken("tkn_tablefields_defender", "");
                unsetToken("tkn_show_hide_defender");
            }

            if(crowdstrike > 0){
                setToken("tkn_tablefields_crowdstrike", ", crowdstrike");
                setToken("tkn_show_hide_crowdstrike", "true");
            }
            else{
                setToken("tkn_tablefields_crowdstrike", "");
                unsetToken("tkn_show_hide_crowdstrike");
            }

            if(kaspersky > 0){
                setToken("tkn_tablefields_kaspersky", ", kaspersky");
                setToken("tkn_show_hide_kaspersky", "true");
            }
            else{
                setToken("tkn_tablefields_kaspersky", "");
                unsetToken("tkn_show_hide_kaspersky");
            }

            if(splunk > 0){
                setToken("tkn_tablefields_splunk", ", splunk");
            }
            else{
                setToken("tkn_tablefields_splunk", "");
            }
        }
    ).searchById("show_hide_search");


    function isEmptyValue(val){
        return (val === "" || val === "-");
    }

    function getMultiValues(val){
        return val.split(',').map(x => x.trim()).filter(x => x!=="");
    }
    function getInListFormattedValues(valList){
        let valueonly = "(";
        for(let i=0; i<valList.length; i++){
            if(i===0){
                valueonly += `"${valList[i]}"`;
            }
            else{
                valueonly += `, "${valList[i]}"`;
            }
        }
        valueonly += ")";
        return valueonly;
    }
    function getORFormattedValues(valList){
        let valueonly = "(";
        for(let i=0; i<valList.length; i++){
            if(i===0){
                valueonly += `"${valList[i]}"`;
            }
            else{
                valueonly += ` OR "${valList[i]}"`;
            }
        }
        valueonly += ")";
        return valueonly;
    }

    function filterChanged(){

        if(isEmptyValue(submittedTokens.get('tkn_ip_tmp')) && isEmptyValue(submittedTokens.get('tkn_host_tmp')) && isEmptyValue(submittedTokens.get('tkn_user_tmp'))){
            unsetToken('tkn_filter_values_only');
            unsetToken('tkn_filter_main');
            unsetToken('tkn_filter_authentication');
            unsetToken('tkn_filter_ip_only');
            unsetToken('tkn_filter_host_only');
            unsetToken('tkn_filter_user_only');
            unsetToken('tkn_filter_ip_host');
            return;
        }

        let filterCondition = submittedTokens.get('tkn_filter_condition');

        let filter_main = '(';
        let filter_values_only = '(';
        let filter_authentication = '(';
        let filter_ip_host = '(';
        
        if(! isEmptyValue(submittedTokens.get('tkn_ip_tmp'))){
            let ips = getMultiValues(submittedTokens.get('tkn_ip_tmp'));
            let ip_valueonly = getInListFormattedValues(ips);
            setToken('tkn_filter_ip_only', ip_valueonly);

            filter_main += `ip IN ${ip_valueonly}`;
            filter_values_only += getORFormattedValues(ips);
            filter_authentication += `Authentication.src IN ${ip_valueonly}`;
            filter_ip_host += `ip IN ${ip_valueonly}`;
        }
        else{
            unsetToken('tkn_filter_ip_only');
        }

        if(! isEmptyValue(submittedTokens.get('tkn_host_tmp'))){
            let hosts = getMultiValues(submittedTokens.get('tkn_host_tmp'));
            let host_valueonly = getInListFormattedValues(hosts);
            setToken('tkn_filter_host_only', host_valueonly);

            if(filter_main !== '('){
                filter_main += ` ${filterCondition} `;
            }
            filter_main += `host IN ${host_valueonly}`;

            if(filter_values_only !== '('){
                filter_values_only += ` ${filterCondition} `;
            }
            filter_values_only += getORFormattedValues(hosts);

            if(filter_ip_host !== '('){
                filter_ip_host += ` ${filterCondition} `;
            }
            filter_ip_host += `host IN ${host_valueonly}`;            
        }
        else{
            unsetToken('tkn_filter_host_only');
        }

        if(! isEmptyValue(submittedTokens.get('tkn_user_tmp'))){
            let users = getMultiValues(submittedTokens.get('tkn_user_tmp'));
            let user_valueonly = getInListFormattedValues(users);
            setToken('tkn_filter_user_only', user_valueonly);

            if(filter_main !== '('){
                filter_main += ` ${filterCondition} `;
            }
            filter_main += `user IN ${user_valueonly}`;

            if(filter_values_only !== '('){
                filter_values_only += ` ${filterCondition} `;
            }
            filter_values_only += getORFormattedValues(users);

            if(filter_authentication !== '('){
                filter_authentication += ` ${filterCondition} `;
            }
            filter_authentication += `Authentication.user IN ${user_valueonly}`;
        }
        else{
            unsetToken('tkn_filter_user_only');
        }

        filter_main += ')';
        setToken('tkn_filter_main', filter_main);

        filter_values_only += ')';
        setToken('tkn_filter_values_only', filter_values_only);

        if(filter_authentication !== '('){
            filter_authentication += ')';
            setToken('tkn_filter_authentication', filter_authentication);
        }
        else{
            unsetToken('tkn_filter_authentication');
        }

        if(filter_ip_host !== '('){
            filter_ip_host += ')';
            setToken('tkn_filter_ip_host', filter_ip_host);
        }
        else{
            unsetToken('tkn_filter_ip_host');
        }
    }

    submittedTokens.on('change:tkn_ip_tmp', filterChanged);
    submittedTokens.on('change:tkn_host_tmp', filterChanged);
    submittedTokens.on('change:tkn_user_tmp', filterChanged);
    submittedTokens.on('change:tkn_filter_condition', filterChanged);

    function onLoad(){
        // TODO - submittedTokens.get('tkn_ip_tmp') - this gives undefined, and hence gives error
        if(submittedTokens.get('tkn_ip_tmp').trim() === '-' || submittedTokens.get('tkn_ip_tmp').trim() === 'null'){
            setToken('tkn_ip_tmp', '');
            setToken('form.tkn_ip_tmp', '');
        }
        if(submittedTokens.get('tkn_host_tmp').trim() === '-' || submittedTokens.get('tkn_host_tmp').trim() === 'null'){
            setToken('tkn_host_tmp', '');
            setToken('form.tkn_host_tmp', '');
        }
        if(submittedTokens.get('tkn_user_tmp').trim() === '-' || submittedTokens.get('tkn_user_tmp').trim() === 'null'){
            setToken('tkn_user_tmp', '');
            setToken('form.tkn_user_tmp', '');
        }
        
        filterChanged();
    }

    setTimeout(onLoad, 0);
});
