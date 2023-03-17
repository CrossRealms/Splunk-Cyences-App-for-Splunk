require([
    'jquery',
    'underscore',
    'splunkjs/mvc',
    '../app/cyences_app_for_splunk/splunk_common_js_v_utilities',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/simplexml/ready!'
], function ($, _, mvc, SplunkCommonUtilities, TableView) {

    let currentTab = 0; // Current tab is set to be the first tab (0)
    /* Tabs
        1. Product Selection
    */


    // TODO - Need to fetch these list from the rest endpoint
    let productList = {
        'Palo_Alto': {
            'Any_Data': {
                query: 'index=pan_log | stats count by host',
                earliestTime: '-24m@h',
                latestTime: 'now'
            },
            'Traffic_Logs': {
                query: 'index=pan_log sourcetype="pan:traffic | stats count by host"',
                earliestTime: '-1h@h',
                latestTime: 'now'
            }
        }
    };


    function fixStepIndicator(n) {
        // This function removes the "active" class of all steps...
        var i, x = document.getElementsByClassName("step");
        for (i = 0; i < x.length; i++) {
            x[i].className = x[i].className.replace(" active", "");
        }
        //... and adds the "active" class to the current step:
        x[n].className += " active";
    }

    function showTab(n) {
        // This function will display the specified tab of the form ...
        var x = document.getElementsByClassName("tab");
        x[n].style.display = "block";
        // ... and fix the Previous/Next buttons:
        if (n == 0) {
            document.getElementById("prevBtn").style.display = "none";
        } else {
            document.getElementById("prevBtn").style.display = "inline";
        }
        if (n == (x.length - 1)) {
            document.getElementById("nextBtn").innerHTML = "Submit";
        } else {
            document.getElementById("nextBtn").innerHTML = "Next";
        }
        // ... and run a function that displays the correct step indicator:
        fixStepIndicator(n)
    }


    function validateForm() {
        // This function deals with validation of the form fields
        var x, y, i, valid = true;
        x = document.getElementsByClassName("tab");
        y = x[currentTab].getElementsByTagName("input");
        // A loop that checks every input field in the current tab:
        for (i = 0; i < y.length; i++) {
            // If a field is empty...
            if (y[i].value == "") {
                // add an "invalid" class to the field:
                y[i].className += " invalid";
                // and set the current valid status to false:
                valid = false;
            }
        }
        // If the valid status is true, mark the step as finished and valid:
        if (valid) {
            document.getElementsByClassName("step")[currentTab].className += " finish";
        }
        return valid; // return the valid status
    }


    function nextPrevTab(n) {
        // This function will figure out which tab to display
        var x = document.getElementsByClassName("tab");
        // Exit the function if any field in the current tab is invalid:
        if (n == 1 && !validateForm()) return false;
        // Hide the current tab:
        x[currentTab].style.display = "none";
        // Increase or decrease the current tab by 1:
        currentTab = currentTab + n;
        // if you have reached the end of the form... :
        if (currentTab >= x.length) {
            //...the form gets submitted:
            document.getElementById("regForm").submit();
            return false;
        }
        // Otherwise, display the correct tab:
        showTab(currentTab);
    }


    function productSelectionChange(isChecked, key){
        if (isChecked){
            let allQueriesHtml = '';

            _.each(productList[key], function(queryObj, queryTitle){
                let id = key+"-"+queryTitle;

                new SplunkCommonUtilities.VSearchManagerUtility().searchByQuery(
                    queryObj.query, queryObj.earliestTime, queryObj.latestTime, id
                );

                let resultTableHtml = new TableView({
                    managerid: id,
                    'rowNumbers': false,
                    'drilldown': 'none',
                    'count': 100
                }).render().el.innerHTML;
                // TODO - This still does not load table fully

                allQueriesHtml += `<div>
                    <label for="${queryTitle}">${queryTitle}</label>
                    <p>${queryObj.query}</p>
                    <p>loading icon<p>
                    ${resultTableHtml}
                </div>`;
            });

            $(`#${key}_div`).html(allQueriesHtml);
        }
        else{
            $(`#${key}_div`).html("");
        }
    }


    function loadProductListTab(){
        let fullHtml = '';

        _.each(productList, function(element, key){

            let htmlElement = `<div>
                <input type="checkbox" class="productSelectionCheckpoint" id="${key}" name="${key}" value="${key}">
                <label for="${key}">${key}</label><br>
                <div id="${key}_div"></div>
            </div>`;
            fullHtml += htmlElement;
        });

        $("#productList").html(fullHtml);

        // On product selection checkpoint change
        $("input.productSelectionCheckpoint").change(function(el){
            productSelectionChange(this.checked, this.id);
        });
    }


    // when user input change
    $("input").on('input', function(el){
        $(el).removeClass('invalid');
    });

    // Change tab
    $("#prevBtn").click(function(){
        nextPrevTab(-1);
    });

    $("#nextBtn").click(function(){
        nextPrevTab(1);
    });

    loadProductListTab();
    showTab(currentTab);   // Display the current tab

});