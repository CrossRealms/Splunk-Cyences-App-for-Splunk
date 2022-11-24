#!/usr/bin/env python

import sys

from splunklib.searchcommands import dispatch, EventingCommand, Configuration, Option
from splunklib.searchcommands.validators import Validator

import cs_utils
from cyences_email_utility import CyencesEmailHTMLBodyBuilder, CyencesEmailUtility


import logging
import logger_manager
logger = logger_manager.setup_logging('send_digest_email_action', logging.DEBUG)

ALERT_ACTION_NAME = 'cyences_send_digest_email_action'

@Configuration()
class CyencesSendDigestEmailCommand(EventingCommand):

    alert_name = Option(name="alert_name", require=True)
    to = Option(name='to', require=False, default=None)
    severity = Option(name='cyences_severity', require=False, default=None)
    results_link = Option(name="results_link", require=False, default=None)
    trigger_time = Option(name="trigger_time", require=False, default=None)
    results_file = Option(name="results_file", require=False, default=None)


    def check_session_key(self, records):
        if not self.search_results_info or not self.search_results_info.auth_token:
            logger.debug("Unable to find session key in the custom command. Logging records, if any.")
            for r in records:
                logger.debug(r)
            raise Exception("unable to find session key.")


    def results_by_alert(self, results, severity_str, exclude_alert_str):

        severity_filter = cs_utils.convert_to_set(severity_str)
        exclude_alert = cs_utils.convert_to_set(exclude_alert_str)

        logger.debug("severity_filter={}".format(severity_filter))
        logger.debug("exclude_alert={}".format(exclude_alert))
        alerts = {}

        for event in results:
            alert_name = event['alert_name']

            # Skip event if alert_name in the exclude_alert
            if alert_name.lower() in exclude_alert:
                continue

            # skip event if and cyences_severity is not matching with severity_filter
            if event.get('cyences_severity', '').lower() not in severity_filter:
                continue

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
            if len(events) > 0:
                full_html_body += CyencesEmailHTMLBodyBuilder.htmlTableTemplate().render(results=events, title=title)
        return full_html_body

    def parse_alert_config(self, config_object):
        alert_config = {}
        for key, value in config_object.items():
            PREFIX = 'action.{}.'.format(ALERT_ACTION_NAME)
            if key.startswith(PREFIX) and key.lstrip(PREFIX)!='':
                alert_config[key.lstrip(PREFIX)] = value
        return alert_config

    def transform(self, records):
        try:
            logger.info("Custom command CyencesSendDigestEmailCommand loaded.")
            self.check_session_key(records)

            cyences_email_utility = CyencesEmailUtility(logger, self.search_results_info.auth_token, self.alert_name)

            alert_config = self.parse_alert_config(cyences_email_utility.alert_all_configs)

            param_to = alert_config.get("param.to", '')
            param_severity = alert_config.get("param.cyences_severity", '')
            param_exclude_alert = alert_config.get("param.exclude_alert", '')

            final_to = self.to if self.to is not None else param_to
            final_severity = self.severity if self.severity is not None else param_severity

            if final_to.strip() == '' or final_severity.strip() == '':
                logger.warn("Please check to or cyences_severity or default_to configuration")
                return

            results = self.results_by_alert(records, final_severity, param_exclude_alert)
            html_body = self.htmlResultsBody(results)

            # logger.debug("html_body: {}".format(html_body))
            if html_body.strip() == '':
                logger.info("No matching event found")
                return

            subject='Cyences Alert Digest Email'
            cyences_email_utility.send(to=final_to, subject=subject, html_body=html_body)
            logger.info("Email sent. subject={}".format(subject))


        except:
            logger.exception("Exception in command CyencesSendDigestEmailCommand.")
            raise


dispatch(CyencesSendDigestEmailCommand, sys.argv, sys.stdin, sys.stdout, __name__)
