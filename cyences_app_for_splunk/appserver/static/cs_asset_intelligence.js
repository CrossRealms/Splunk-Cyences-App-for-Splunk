require([
    'splunkjs/mvc',
    'splunkjs/mvc/simplexml/ready!'], 
function(mvc){

    var submittedTokens = mvc.Components.getInstance('submitted');
    var defaultTokens = mvc.Components.getInstance('default');

    function setToken(name, value){
        defaultTokens.set(name, value);
        submittedTokens.set(name, value);
        defaultTokens.set(name + '_label', value);
        if(name == 'tkn_filter_ip_only'){
            defaultTokens.set(name + '_label', `(ip=${value})`);
        }
        if(name == 'tkn_filter_host_only'){
            defaultTokens.set(name + '_label', `(host=${value})`);
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
        if(name == 'tkn_filter_ip_host'){
            defaultTokens.set(name + '_label', '(IP/HOST FILTER NOT SET)');
        }
        if(name == 'tkn_filter_authentication'){
            defaultTokens.set(name + '_label', '(IP/USER FILTER NOT SET)');
        }
    }

    var searchManager = mvc.Components.getInstance("show_hide_search");
    var searchManagerResults = searchManager.data("results", {count: 0});
    searchManagerResults.on('data', function () {
        if (searchManagerResults.data()) {
            // fields: (6) ["lansweeper", "qualys", "tenable", "sophos", "defender", "crowdstrike"]
            let results = searchManagerResults.data().rows[0];   // only one row of data is important for us
            let lansweeper = results[0];
            let qualys = results[1];
            let tenable = results[2];
            let sophos = results[3];
            let defender = results[4];
            let crowdstrike = results[5];

            if(lansweeper > 0){
                setToken("tkn_tablefields_lansweeper", ", lansweeper_status");
                setToken("tkn_show_hide_lansweeper", "true");
            }
            else{
                setToken("tkn_tablefields_lansweeper", "");
                unsetToken("tkn_show_hide_lansweeper");
            }

            if(qualys > 0){
                setToken("tkn_tablefields_qualys", ", qualys_status, ACTIVE, TOTAL_VULNS");
                setToken("tkn_show_hide_qualys", "true");
            }
            else{
                setToken("tkn_tablefields_qualys", "");
                unsetToken("tkn_show_hide_qualys");
            }

            if(tenable > 0){
                setToken("tkn_tablefields_tenable", ", tenable_status, active_vuln, total_vuln");
                setToken("tkn_show_hide_tenable", "true");
            }
            else{
                setToken("tkn_tablefields_tenable", "");
                unsetToken("tkn_show_hide_tenable");
            }

            if(sophos > 0){
                setToken("tkn_tablefields_sophos", ", sophos_status");
                setToken("tkn_show_hide_sophos", "true");
            }
            else{
                setToken("tkn_tablefields_sophos", "");
                unsetToken("tkn_show_hide_sophos");
            }

            if(defender > 0){
                setToken("tkn_tablefields_defender", ", defender_status");
                setToken("tkn_show_hide_defender", "true");
            }
            else{
                setToken("tkn_tablefields_defender", "");
                unsetToken("tkn_show_hide_defender");
            }

            if(crowdstrike > 0){
                setToken("tkn_tablefields_crowdstrike", ", crowdstrike_status");
                setToken("tkn_show_hide_crowdstrike", "true");
            }
            else{
                setToken("tkn_tablefields_crowdstrike", "");
                unsetToken("tkn_show_hide_crowdstrike");
            }

        }
    });

    function isEmptyValue(val){
        return (val === "" || val === "-");
    }

    function filterChanged(){

        if(isEmptyValue(submittedTokens.get('tkn_ip_tmp')) && isEmptyValue(submittedTokens.get('tkn_host_tmp')) && isEmptyValue(submittedTokens.get('tkn_user_tmp'))){
            unsetToken('tkn_filter_values_only');
            unsetToken('tkn_filter_main');
            unsetToken('tkn_filter_authentication');
            unsetToken('tkn_filter_ip_only');
            unsetToken('tkn_filter_host_only');
            unsetToken('tkn_filter_ip_host');
            return;
        }

        let filterCondition = submittedTokens.get('tkn_filter_condition');

        let filter_main = '(';
        let filter_values_only = '(';
        let filter_authentication = '(';
        let filter_ip_host = '(';

        if(! isEmptyValue(submittedTokens.get('tkn_ip_tmp'))){
            let ip_valueonly = `"${submittedTokens.get('tkn_ip_tmp')}"`;
            setToken('tkn_filter_ip_only', ip_valueonly);

            filter_main += `ip=${ip_valueonly}`;
            filter_values_only += `${ip_valueonly}`;
            filter_authentication += `Authentication.src=${ip_valueonly}`;
            filter_ip_host += `ip=${ip_valueonly}`;
        }
        else{
            unsetToken('tkn_filter_ip_only');
        }

        if(! isEmptyValue(submittedTokens.get('tkn_host_tmp'))){
            let host_valueonly = `"${submittedTokens.get('tkn_host_tmp')}"`;
            setToken('tkn_filter_host_only', host_valueonly);

            if(filter_main !== '('){
                filter_main += ` ${filterCondition} `;
            }
            filter_main += `host=${host_valueonly}`;

            if(filter_values_only !== '('){
                filter_values_only += ` ${filterCondition} `;
            }
            filter_values_only += `${host_valueonly}`;

            if(filter_ip_host !== '('){
                filter_ip_host += ` ${filterCondition} `;
            }
            filter_ip_host += `host=${host_valueonly}`;            
        }
        else{
            unsetToken('tkn_filter_host_only');
        }

        if(! isEmptyValue(submittedTokens.get('tkn_user_tmp'))){
            user_valueonly = `"${submittedTokens.get('tkn_user_tmp')}"`;

            if(filter_main !== '('){
                filter_main += ` ${filterCondition} `;
            }
            filter_main += `user=${user_valueonly}`;

            if(filter_values_only !== '('){
                filter_values_only += ` ${filterCondition} `;
            }
            filter_values_only += `${user_valueonly}`;

            if(filter_authentication !== '('){
                filter_authentication += ` ${filterCondition} `;
            }
            filter_authentication += `Authentication.user=${user_valueonly}`;
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
