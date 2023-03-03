define([
    "splunkjs/mvc",
    "underscore",
    "jquery",
    'splunkjs/mvc/searchmanager',
    'splunk.util'
], function (
    mvc,
    _,
    $,
    SearchManager,
    splunkUtil
) {

    class VSearchManagerUtility {
        constructor(onResultCallBack, onErrorCallBack) {
            /*
            onResultCallBack(resultDataRows)
            onErrorCallBack(searchProperties)
            */
           this.onResultCallBack = onResultCallBack;
           this.onErrorCallBack = onErrorCallBack;
        }

        _defineActions(){
            let _consoleSearchInfo = this.consoleSearchInfo;
            let _manager = this.searchManager;
            let _onResultCallBack = this.onResultCallBack;
            let _onErrorCallBack = this.onErrorCallBack;

            this.searchManager.on('search:done', function (properties) {
                console.log(`Search query completed. ${_consoleSearchInfo} - searchProperties=${properties}`);

                let searchManagerResults = _manager.data("results", {count: 0});
                searchManagerResults.on('data', function () {
                    let resultData = searchManagerResults.data();
                    console.log(`Search query (${_consoleSearchInfo}) completed with ${resultData.rows.length} number of results.`);
                    if (_onResultCallBack != undefined){
                        _onResultCallBack(resultData.rows);
                    }
                });
            });

            function onFailures(properties){
                console.error(`Unable to execute the search query. ${_consoleSearchInfo} - searchProperties=${properties}`);
                if (_onErrorCallBack != undefined){
                    _onErrorCallBack(properties);
                }
            }

            this.searchManager.on('search:fail', function (properties) {
                onFailures(properties);
            });
            this.searchManager.on('search:error', function (properties) {
                onFailures(properties);
            });
        }

        searchByQuery(searchQuery, earliestTime, latestTime, executeNow=true){
            /*
            searchQuery, earliestTime, latestTime - Parameters to define the search (only valid if searchId is not defined)

            executeNow - Whether to execute immediately or wait for user's manual call of startSearch()
            */
            if (searchQuery == undefined || earliestTime == undefined || latestTime == undefined){
                throw new Error("If searchId parameter is not defined, then searchQuery, earliestTime, latestTime parameters are compulsory.");
            }
            this.consoleSearchInfo = `searchQuery=${searchQuery}`;

            this.searchManager = new SearchManager({
                preview: false,
                autostart: false,
                search: searchQuery,
                earliest_time: earliestTime,
                latest_time: latestTime
            });

            this._defineActions();

            if(executeNow){
                this.startSearch();
            }
        }

        searchById(searchId){
            /*
            searchId - Use already defined search (ignore searchQuery, earliestTime, latestTime parameters)
            */
            this.consoleSearchInfo = `searchId=${searchId}`;
            this.searchManager = mvc.Components.get(searchId);

            this._defineActions();
        }

        startSearch(){
            console.log("Executing the search query: ", this.consoleSearchInfo);
            this.searchManager.startSearch();
        }
    }

    return {
        'VSearchManagerUtility': VSearchManagerUtility
    }
});