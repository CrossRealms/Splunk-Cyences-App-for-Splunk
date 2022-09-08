define([
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/simplexml/ready!'
], function ($, mvc) {

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

    return executeAsyncRestCall;
});
