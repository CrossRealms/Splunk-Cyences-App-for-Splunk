// This file is generated and maintained by splunk-app-action (https://github.com/VatsalJagani/splunk-app-action)
// To modify anything create Pull Request on the splunk-app-action GitHub repository.


define([
    "splunkjs/mvc",
    "underscore",
    "jquery",
    'splunkjs/mvc/searchmanager',
    "splunkjs/mvc/postprocessmanager",
    'splunk.util'
], function (
    mvc,
    _,
    $,
    SearchManager,
    PostProcessSearchManager,
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

        _defineActions() {
            let _consoleSearchInfo = this.consoleSearchInfo;
            let _manager = this.searchManager;
            let _onResultCallBack = this.onResultCallBack;
            let _onErrorCallBack = this.onErrorCallBack;

            this.searchManager.on('search:done', function (properties) {
                console.log(`Search query completed. ${_consoleSearchInfo} - searchProperties=${properties}`);

                let searchManagerResults = _manager.data("results", { count: 0 });
                if (('_isFetching' in searchManagerResults && searchManagerResults['_isFetching'] === true) || '_data' in searchManagerResults) {
                    searchManagerResults.on('data', function () {
                        let resultData = searchManagerResults.data();
                        console.log(`Search query (${_consoleSearchInfo}) completed with ${resultData.rows.length} number of results.`);
                        if (_onResultCallBack != undefined) {
                            _onResultCallBack(resultData);
                        }
                    });
                }
                else {
                    if (_onResultCallBack != undefined) {
                        _onResultCallBack(null);
                    }
                }
            });

            function onFailures(properties) {
                console.error(`Unable to execute the search query. ${_consoleSearchInfo} - searchProperties=${properties}`);
                if (_onErrorCallBack != undefined) {
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

        searchByQuery(searchQuery, earliestTime = '-1m', latestTime = 'now', searchId = undefined, executeNow = true) {
            /*
            searchQuery, earliestTime, latestTime - Parameters to define the search (only valid if searchId is not defined)
            searchId - define Id of search
            executeNow - Whether to execute immediately or wait for user's manual call of startSearch()
            */
            this.consoleSearchInfo = `searchQuery=${searchQuery}`;

            let searchManagerProperties = {
                preview: false,
                autostart: false,
                search: searchQuery,
                earliest_time: earliestTime,
                latest_time: latestTime
            };
            if (searchId != undefined) {
                searchManagerProperties['id'] = searchId;
            }

            this.searchManager = new SearchManager(searchManagerProperties);

            this._defineActions();

            if (executeNow) {
                this.startSearch();
            }
        }

        postProcessSearchByQuery(baseManagerId, searchQuery, searchId = undefined, executeNow = true) {
            /*
            searchQuery - Parameters to define the search (post process search of base search) (only valid if searchId is not defined)
            baseManagerId - id of base search
            searchId - define Id of search
            executeNow - Whether to execute immediately or wait for user's manual call of startSearch()
            */
            this.consoleSearchInfo = `searchQuery=${searchQuery}`;

            let searchManagerProperties = {
                managerid: baseManagerId,
                preview: false,
                autostart: false,
                search: searchQuery
            };
            if (searchId != undefined) {
                searchManagerProperties['id'] = searchId;
            }

            this.searchManager = new SearchManager(searchManagerProperties);

            this._defineActions();

            if (executeNow) {
                this.startSearch();
            }
        }

        searchById(searchId) {
            /*
            searchId - Use already defined search
            */
            this.consoleSearchInfo = `searchId=${searchId}`;
            this.searchManager = mvc.Components.get(searchId);

            this._defineActions();
        }

        defineReusableSearch(searchId) {
            this.consoleSearchInfo = `searchId=${searchId}`;

            this.searchManager = new SearchManager({
                id: searchId,
                preview: false,
                autostart: false,
            });

            this._defineActions();
        }

        executeReusableSearch(searchQuery, earliestTime = '-1m', latestTime = 'now', executeNow = true) {
            this.searchManager.set(
                {
                    search: searchQuery,
                    earliest_time: earliestTime,
                    latest_time: latestTime
                }
            );
            if (executeNow) {
                this.startSearch();
            }
        }

        defineReusablePostProcessSearch(managerId, searchId) {
            this.consoleSearchInfo = `searchId=${searchId}`;

            this.searchManager = new PostProcessSearchManager({
                managerid: managerId,
                id: searchId,
                preview: false,
                autostart: false,
            });

            this._defineActions();
        }

        executeReusablePostProcessSearch(searchQuery, executeNow = true) {
            this.searchManager.set(
                {
                    search: searchQuery
                }
            );
            if (executeNow) {
                this.startSearch();
            }
        }

        startSearch() {
            console.log("Executing the search query: ", this.consoleSearchInfo);
            this.searchManager.startSearch();
        }
    }

    function vWaitUntil(checkCondition, callBackFunction, waitMilliseconds = 100) {
        function checkFlag() {
            if (checkCondition() === false) {
                window.setTimeout(checkFlag, waitMilliseconds);
            } else {
                callBackFunction();
            }
        }
        checkFlag();
    }


    class VTokenManager {
        constructor() {
            this.submittedTokens = mvc.Components.getInstance('submitted');
            this.defaultTokens = mvc.Components.getInstance('default');
        }

        getDefaultToken(token_key) {
            return this.defaultTokens.get(token_key);
        }

        getSubmittedToken(token_key) {
            return this.submittedTokens.get(token_key);
        }

        getToken(token_key) {
            return this.submittedTokens.get(token_key);
        }

        setDefaultToken(token_key, token_value) {
            this.defaultTokens.set(token_key, token_value);
        }

        setSubmittedToken(token_key, token_value) {
            this.submittedTokens.set(token_key, token_value);
        }

        setToken(token_key, token_value) {
            this.setDefaultToken(token_key, token_value);
            this.setSubmittedToken(token_key, token_value);
        }

        unsetDefaultToken(token_key) {
            this.defaultTokens.unset(token_key);
        }

        unsetSubmittedToken(token_key) {
            this.submittedTokens.unset(token_key);
        }

        unsetToken(token_key) {
            this.unsetDefaultToken(token_key);
            this.unsetSubmittedToken(token_key);
        }
    }

    let VTokenManagerObj = new VTokenManager();


    function vSetupMultiSelectInputHandler(instance_id, allOptions = ["*", 'like(Issued_Common_Name, "%")']) {

        // Get multiselect
        var multi = mvc.Components.get(instance_id);

        // On change, check selection
        multi.on("change", (selectedValues) => {

            for (let i = 0; i < allOptions.length; i++) {
                if (selectedValues.includes(allOptions[i])) {
                    var allOptionValue = allOptions[i]
                    break;
                }
            }

            if (selectedValues.length > 1 && selectedValues.includes(allOptionValue)) {
                var indexOfAll = selectedValues.indexOf(allOptionValue);

                // If "ALL" was selected before current (more specific) selection, remove it from list
                if (indexOfAll == 0) {
                    selectedValues.splice(indexOfAll, 1);
                    multi.val(selectedValues);
                    multi.render();
                } else {
                    // "ALL" was selected last, clear input and leave only "ALL" in it
                    multi.val(allOptionValue);
                    multi.render();
                }
            }
        });
    }

    function vSetupMultiSelectHandlerOnAll() {
        var all_multi_selects = document.getElementsByClassName("input-multiselect");
        for (j = 0; j < all_multi_selects.length; j++) {
            vSetupMultiSelectInputHandler(all_multi_selects[j].id);
        }
    }


    function addCSSForNotification(){
        // Create a style element.
        const style = document.createElement('style');

        // Define keyframes animation.
        style.innerHTML = `
            .cju-toast {
                visibility: hidden;
                position: fixed;
                top: 30px;
                right: 0;
                z-index: 1000;
                min-width: 250px;
                margin-left: -125px;
                background-color: #333;
                color: #fff;
                text-align: center;
                border-radius: 5px;
                padding: 1.2rem 1rem;
            }

            .cju-toast.cju-show {
                visibility: visible;
                -webkit-animation: cju-slidein 2s;
                animation: cju-slidein 2s;
            }

            .cju-toast.cju-hide {
                visibility: visible;
                -webkit-animation: cju-slideout 2s;
                animation: cju-slideout 2s;
            }

            .cju-toast.cju-success {
                background-color: green;
            }
            .cju-toast.cju-error {
                background-color: #cc0033;
            }

            @-webkit-keyframes cju-slidein {
                from {right: -100%; opacity: 0;}
                to {right: 0; opacity: 1;}
            }
            
            @keyframes cju-slidein {
                from {right: -100%; opacity: 0;}
                to {right: 0; opacity: 1;}
            }
            
            @-webkit-keyframes cju-slideout {
                from {right: 0; opacity: 1;}
                to {right: -100%; opacity: 0;}
            }
            
            @keyframes cju-slideout {
                from {right: 0; opacity: 1;}
                to {right: -100%; opacity: 0;}
            }
        `;

        // Append the style element to the document's head.
        document.head.appendChild(style);
    }
    addCSSForNotification();


    function vNotification(type, msg, availableMilliseconds=5000){
        const notificationElement = $(`<div class="cju-toast">${msg}</div>`);
        $('body').append(notificationElement);

        notificationElement.addClass("cju-show");
        notificationElement.addClass(`cju-${type}`);

        // Hide the notification after 5 seconds.
        setTimeout(() => {
            notificationElement.removeClass('cju-show');
            notificationElement.addClass('cju-hide');

            // Remove the element from html all together.
            setTimeout(() => {
                notificationElement.remove();
            }, 200);
        }, availableMilliseconds);
    }


    return {
        'VSearchManagerUtility': VSearchManagerUtility,
        'vWaitUntil': vWaitUntil,
        'VTokenManager': VTokenManager,
        'VTokenManagerObj': VTokenManagerObj,
        'vSetupMultiSelectInputHandler': vSetupMultiSelectInputHandler,
        'vSetupMultiSelectHandlerOnAll': vSetupMultiSelectHandlerOnAll,
        'vNotification': vNotification
    }
});