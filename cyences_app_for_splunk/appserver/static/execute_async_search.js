define([
    'jquery',
    'splunkjs/mvc/searchmanager',
    'splunkjs/mvc',
    'splunkjs/mvc/simplexml/ready!'
], function ($, SearchManager, mvc) {

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

    return executeAsyncSearch;
});
