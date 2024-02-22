require([
  'splunkjs/mvc/tableview',
  'splunkjs/mvc/chartview',
  '../app/cyences_app_for_splunk/splunk_common_js_v_utilities',
  'splunkjs/mvc',
  'underscore',
  "splunkjs/mvc/utils",
  "jquery",
  'splunkjs/mvc/simplexml/ready!'
], function(
  TableView,
  ChartView,
  SplunkCommonUtilities,
  mvc,
  _,
  splunkUtil

) {


  var cssId = 'myCss'; // you could encode the css path itself to generate id..
  if (!document.getElementById(cssId)) {
      var head = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
      link.media = 'all';
      head.appendChild(link);
  }

  var submittedTokens = mvc.Components.getInstance('submitted', {
      create: true
  });
  var defaultTokens = mvc.Components.getInstance('default', {
      create: true
  });

  var EventSearchBasedRowExpansionRenderer = TableView.BaseRowExpansionRenderer.extend({
      initialize: function(args) {
            // initialize will run once, so we will set up a search and a table to be reused.
            this._searchManager = new SplunkCommonUtilities.VSearchManagerUtility();
            this._searchManager.defineReusableSearch('details-search-manager');
      },

      canRender: function(rowData) {
          return true;
      },
      render: function($container, rowData) {

          var id = _(rowData.cells).find(function(cell) {
              return cell.field === 'id';
          });

          $("<h3/>").text('Instance Details').appendTo($container);
          $container.append($('<div />').css('float', 'top').text('Instance UUID=').append($('<span />').text(id.value)));
          //update the search with the sourcetype that we are interested in
          this._searchManager.executeReusableSearch('| sophosinstancedetails uuid=' + id.value +"| spath input=health | eval service_status=mvzip('services.serviceDetails{}.name','services.serviceDetails{}.status') | fields - health , 'services.serviceDetails{}.name','services.serviceDetails{}.status'| spath input=os path=platform output=os_platform | spath input=os path=name output=os_name | spath input=os path=majorVersion output=os_majorVersion | spath input=os path=minorVersion output=os_minorVersion | spath input=os path=build output=os_build | spath input=associatedPerson path=name output=associatedPerson_name | spath input=associatedPerson path=viaLogin output=associatedPerson_viaLogin | fields - associatedPerson,os,tenant | table overall,service_status,os*,associatedPerson*,tamperProtectionEnabled,'threat.status',lastSeenAt");
          this._tableView = new TableView({
              managerid: 'details-search-manager',
              drilldown: "none"
          });
          $container.append(this._tableView.render().el);
          $container.removeClass("sorts").removeAttr("data-sort-key");

      }
  });


  var selected_values_array = [];
  var selected_checkbox = [];
  var IconRenderer = TableView.BaseCellRenderer.extend({
      canRender: function (cell) {
          return _(['checkbox']).contains(cell.field);
      },
      render: function ($td, cell) {
          var a = $('<div>').attr({ "id": "chk-value" + cell.value, "value": cell.value }).addClass('checkbox').click(function () {

              var b = $(this);

              if (b.attr('class') === "checkbox") {
                  console.log(12)
                  selected_checkbox.push(cell.value);
                  selected_values_array.push(b.attr('value'));
                  b.removeClass();
                  b.addClass("checkbox checked");

              }
              else {
                  b.removeClass();
                  b.addClass("checkbox");
                  var i = selected_values_array.indexOf(b.attr('value'));
                  var j = selected_checkbox.indexOf(cell.value);
                  if (i != -1) {
                      selected_values_array.splice(i, 1);
                  }
                  if (j != -1) {
                      selected_checkbox.splice(j, 1);
                  }
                  // Change the value of a token $mytoken$
              }
          }).appendTo($td);
      }
  });

  var tableElement = mvc.Components.getInstance("sophos_instance_details");
  tableElement.getVisualization(function(tableView) {
      // Add custom cell renderer, the table will re-render automatically.
      // tableView.table.addCellRenderer(new HiddenCellRenderer());
      tableView.table.addCellRenderer(new IconRenderer());
      tableView.addRowExpansionRenderer(new EventSearchBasedRowExpansionRenderer());
      tableView.table.render();
  });

  $("#submit_btn").on("click", function (e) {
      // alert("from submit button");


      var edit_panel = '' +
          '<div class="modal fade modal-wide shared-incidentcontrols-dialogs-editdialog in" id="edit_panel">' +
          ' <div class="modal-content">' +
          ' <div class="modal-header">' +
          ' <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
          ' <h4 class="modal-title" id="exampleModalLabel">Confirmation</h4>' +
          ' </div>' +
          ' <div class="modal-body modal-body-scrolling">' +
          ' <div class="form form-horizontal form-complex" style="display: block;">' +
          ' <div class="control-group shared-controls-controlgroup">' +
          ' <label for="incident_id" class="control">Are you sure to isolated selected instances in Sophos Endpoint Protection?</label>' +
          ' </div>' + 
          ' <div class="control-group shared-controls-controlgroup">' +
          ' <label for="message-text" class="control-label" style="width:100px" hight="25px">If Yes, then please add the comment:</label>' +
          ' <div class="controls"  style="margin-left:110px;"><textarea type="text" name="body" id="isolate_comment" class="" placeholder="Message"  style="width:600px;height: 312px;"></textarea></div>' +
          ' </div>' +
          ' <div class="control-group shared-controls-controlgroup">' +
          ' <label for="incident_id" class="control" id="error_message"></label>' +
          ' </div>' + 
          ' </div>' +
          ' </div>' +
          ' <div class="modal-footer">' +
          ' <button type="button" class="btn cancel modal-btn-cancel pull-left" data-dismiss="modal">No</button>' +
          ' <button type="button" class="btn btn-primary" id="modal-save">Yes</button>' +
          ' </div>' +
          ' </div>' +
          '</div>';

      $('body').prepend(edit_panel);

      $('#edit_panel').modal('show');

  });

  $(document).on("click", "#modal-save", function(event) {
      // save data here

      if($('#isolate_comment').val()!=""){

          var fullarray = selected_values_array.join();

          let status = '-';
          let COMMON_ERROR_MSG = "Some Error Occured. Please check whether Sophos Endpoint Protection configuration added on Configuration Page or not. Or connectivity possible b/w Splunk Instance and Sophos Central";
          new SplunkCommonUtilities.VSearchManagerUtility(
                function(results){
                    if (results == null){
                        status = COMMON_ERROR_MSG;
                    }
                    else{
                        status = rows[i][0]
                    }
                },
                function(searchProperties){
                    status = COMMON_ERROR_MSG;
                }).searchByQuery(
                    '| countermeasuresophos uuid_tanent=' + fullarray +' comment='+ $('#isolate_comment').val(), 
                    '-1m', 'now',
                    'isolate_instance');
          
          $('#edit_panel').modal('hide');

          var isolating = '' +
          '<div class="modal fade modal-wide shared-incidentcontrols-dialogs-editdialog in" id="isolating">' +
          ' <div class="modal-content">' +
          ' <div class="modal-header">' +
          ' <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
          ' <h4 class="modal-title" id="exampleModalLabel">Isolating.... It might take a while</h4>' +
          ' </div>' +
          ' </div>' +
          '</div>';
          $('body').prepend(isolating);
          $('#isolating').modal('show');

          $('#isolating').modal('hide');
          var isolated_status = '' +
          '<div class="modal fade modal-wide shared-incidentcontrols-dialogs-editdialog in" id="isolated_status">' +
          ' <div class="modal-content">' +
          ' <div class="modal-header">' +
          ' <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
          ' <h4 class="modal-title" id="exampleModalLabel">'+status+'</h4>' +
          ' </div>' +
          ' </div>' +
          '</div>';
          $('body').prepend(isolated_status);
          $('#isolated_status').modal('show');
      }else{
          document.getElementById('error_message').innerHTML = 'You must have to add comment before submitting.';
      }

  });
});
