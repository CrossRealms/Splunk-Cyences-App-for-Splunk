# Cyences App for Splunk
Cyences App for Splunk built by CrossRealms International

### Documentation
Please read App's documentation [here](cyences_app_for_splunk/ReadMe.md).

### Feedback
To provide the feedback open issue in this repo.


## Development
To contribute to the project, please raise PR against this repo.

#### About this project
This project is to build a Splunk App that allows user to visualize the security of the whole corporate environment at the central place. 

#### How this App is different from Enterprise Security?
- For enterprise security user has to configure the Enterprise Security's correlation searches and understand how Enterprise Security works. 
- But for this App, the goal is to provide out of the box end-to-end security solutions. So, user don't have to configure much. Also, this App works on the alerts so that user can get slack or email notification while keeping the minimal false positives.

#### Owner of the Repo
Development has started under the observation of `CrossRealms International`. But the goal is to make it collaborative development.

### Development Guidelines
To develop the large collaborative App while keeping in mind the quality of the product here are some guidelines around the development of the App.

1. Splunk App Inspect.
   - It should not fail the Splunk App Inspect.
   - This Repo has configured to auto execute App-Inspect check with GitHub Actions.
   - Reference - https://dev.splunk.com/enterprise/docs/releaseapps/appinspect/

2. Dependencies
   - This App is dependent on Security Essentials App from Splunk as of now for some lookups. And other Add-ons are required for field extractions like Sysmon, Windows, O365, etc.
   - Refer to the <a href="https://cyences.com/cyences-app-for-splunk/">documentation</a> for full details.

3. Reports and Alerts
   - One should not add an alert which might have a lot of false positives. It should rather go as a Report for particular category of reports.
   - Only add security related Alerts and Reports are allowed with this App.

4. Standard with Searches
   - All the searches should be reusable in terms of upgrade scenarios and user customization.
   - To maintain this:
     - Data source part of the query (index mainly) should be kept in the search with the macro.
     - Each Alert/Report should have a macro at the end to filter the whitelisted values by the customer.
   - Try to add the most optimal search for best performance in the user's environment.

5. savedsearches.conf
   - All the alerts searches will be here.
   - Format of the name of the searches should be in the below format.
     - Category1 - Category2 - ... - Name of the alert
   - This format will allow dashboard to show searches in the multiple categories without any modification in the dashboards.
   - Each Alert should have description with below details.
     - What threat the search is trying to identify.
     - How to collect the data. (Data Collection)
     - False Positive, if any.
   - Make sure the description is properly readable on the `All Alerts` dashboard.
   - Put all the savedsearches in the proper order (category vise) in the savedsearches.conf file.
   - Take reference from other searches in the savedsearches.conf.
   - Make sure to add relevant queries and configuration in cs_forensics.js.
   - If require, update `Overview` and `All Alerts` dashboard.

6. macros.conf
   - All the macro definition goes here.
   - All the macro should start with `cs` in the prefix to avoid any naming conflict with other Apps.
   - Add macros in the macros.conf file category vise.
   - Any new macro has to be added to the `Configuration` dashboard for the ease of configuration.

7. Dashboards
   - The `Overview` dashboard shows only the enabled alerts. For more information see the dashboard itself.
   - The `All Alerts` dashboard is very similar to what we have in the `Overview` dashboard, but this may be for the development purpose or Splunk Admins and Security Admins as it shows all the information like how to collect the data, cron schedule and other.
   - The `Forensics` dashboard is drilldown dashboard for the Overview dashboard. It shows the detailed information about the selected alert.
   - Any new type of Report addition should also be added to the navigation.
   - All the dashboard name should prefix with `cs` to avoid any naming conflict with other Apps.

8. Improvements
   - Improvements in any part of the App is most welcome. :)

9. Goal
   - The goal is to make the Security App providing security around all the areas.
   - To add everything from MITRE ATT&CT framework eventually.

