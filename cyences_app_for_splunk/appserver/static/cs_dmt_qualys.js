require([
    'splunkjs/mvc',
    'splunkjs/mvc/simplexml/ready!'],
function(mvc){

    var submittedTokens = mvc.Components.getInstance('submitted');
    var defaultTokens = mvc.Components.getInstance('default');

    function setToken(name, value){
        defaultTokens.set(name, value);
        submittedTokens.set(name, value);
    }

    function onLoad(){
        if(submittedTokens.get('tkn_ip_tmp').trim() === '-' || submittedTokens.get('tkn_ip_tmp').trim() === 'null'|| submittedTokens.get('tkn_ip_tmp').trim() === ''){

            setToken('tkn_ip_tmp', '');
            setToken('form.tkn_ip_tmp', '');
            setToken('tkn_ip', '()');
        }else{
            let ip_valueonly = `${submittedTokens.get('tkn_ip_tmp')}`;
            setToken('tkn_ip', `(IP="*${ip_valueonly}*")`);
        }

    }

    setTimeout(onLoad, 0);
});
