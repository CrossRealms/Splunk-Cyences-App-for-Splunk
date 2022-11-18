#!/usr/bin/env python

import os
import sys
import json

from splunklib.searchcommands import dispatch, EventingCommand, Configuration, Option
from splunklib.searchcommands.validators import Validator
from splunk import rest

import cs_utils
from cyences_email_utility import CyencesEmailHTMLBodyBuilder, CyencesEmailUtility

import logging
import logger_manager
logger = logger_manager.setup_logging('send_alert_digest_email', logging.DEBUG)



@Configuration()
class CyencesAlertDigestEmailCommand(EventingCommand):

    alert_name = Option(name="alert_name", require=True)
    results_link = Option(name="results_link", require=False, default=None)
    trigger_time = Option(name="trigger_time", require=False, default=None)
    results_file = Option(name="results_file", require=False, default=None)


    def check_session_key(self, records):
        if not self.search_results_info or not self.search_results_info.auth_token:
            logger.debug("Unable to find session key in the custom command. Logging records, if any.")
            for r in records:
                logger.debug(r)
            raise Exception("unable to find session key.")


    def read_cyences_alert_digest_email_action_default_configs(self):
        _, serverContent = rest.simpleRequest(
            "/servicesNS/nobody/{}/configs/conf-alert_actions?output_mode=json".format(cs_utils.APP_NAME), 
            method='GET', sessionKey=self.search_results_info.auth_token, raiseAllErrors=True)
        default_configs = json.loads(serverContent)
        return default_configs


    def results_by_alert(self, results):
        alerts = {}

        for event in results:
            alert_name = event['alert_name']

            if alert_name not in alerts:
                alerts[alert_name] = []

            for k, v in tuple(event.items()):
                if k.startswith("_"):
                    continue
                if k == 'alert_name' or v == '':
                    event.pop(k)
            
            alerts[alert_name].append(event)
        
        return alerts


    def htmlResultsBody(self, results):
        full_html_body = ''
        for title, events in results.items():
            full_html_body += CyencesEmailHTMLBodyBuilder.htmlTableTemplate().render(results=events, title=title)
        return full_html_body


    def transform(self, records):
        try:
            logger.info("custom command loaded.")
            self.check_session_key(records)
            results = self.results_by_alert(records)
            html_body = self.htmlResultsBody(results)

            full_email_html = CyencesEmailHTMLBodyBuilder.htmlRootTemplate().render(body=html_body)
            logger.debug("full_email_html: {}".format(full_email_html))

            cyences_email_utility = CyencesEmailUtility(logger, self.search_results_info.auth_token)
            cyences_email_utility.send(to='vjagani@crossrealms.com', subject='Cyences Alert Digest Email', htmlBody=full_email_html)

            yield records

        except:
            logger.exception("Exception in command CyencesAlertDigestEmailCommand.")
            raise


dispatch(CyencesAlertDigestEmailCommand, sys.argv, sys.stdin, sys.stdout, __name__)
