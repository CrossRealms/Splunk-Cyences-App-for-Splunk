# SOC Central Monitoring App

It provides a centralized SOC monitoring dashboard for all Splunk-hosted environments' Cyences monitoring at one place. Additionally, when you click on a widget, you will be redirected to the respective environment’s Cyences screen.

# CONFIGURATION

## Add/Update the following lookups

### environment_mapping (It holds data of all hosted environments and their respective full Splunk server hostnames and SH URLs.)

* SSH and navigate to $SPLUNK_HOME/etc/apps/SOC_Central_Monitoring_App/lookups and add details to environment_mapping.csv file as mentioned below.

```
environment,host_name,sh_url
XXX,host-xxx,https://x.x.x.x:8000/en-US/app/cyences_app_for_splunk/cs_overview?form.timeRange.earliest=-15m&form.timeRange.latest=now
```
