#!/usr/bin/env python

import sys

from splunklib.searchcommands import dispatch, EventingCommand, Configuration, Option
from splunklib.searchcommands.validators import Validator

import cs_utils
from cyences_email_utility import CyencesEmailHTMLBodyBuilder, CyencesEmailUtility


import logging
import logger_manager
logger = logger_manager.setup_logging('send_digest_email_action', logging.INFO)

ALERT_ACTION_NAME = 'cyences_send_digest_email_action'

@Configuration()
class CyencesSendDigestEmailCommand(EventingCommand):

    alert_name = Option(name="alert_name", require=True)
    email_to = Option(name='email_to', require=False, default=None)
    severities = Option(name='cyences_severities', require=False, default=None)
    results_link = Option(name="results_link", require=False, default=None)
    trigger_time = Option(name="trigger_time", require=False, default=None)
    results_file = Option(name="results_file", require=False, default=None)


    def results_by_alert(self, results, severity_filter, alerts_to_exclude):

        logger.debug("severity_filter={}".format(severity_filter))
        logger.debug("alerts_to_exclude={}".format(alerts_to_exclude))
        alerts = {}

        for event in results:
            alert_name = event['alert_name']

            # Skip event if alert_name in the exclude_alert
            if alert_name.lower() in alerts_to_exclude:
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


    def transform(self, records):
        try:
            logger.info("Custom command CyencesSendDigestEmailCommand loaded.")
            session_key = cs_utils.GetSessionKey(logger).from_custom_command(self)
            config_handler = cs_utils.ConfigHandler(logger)

            cyences_email_utility = CyencesEmailUtility(logger, session_key, self.alert_name)

            alert_action_config_for_alert = config_handler.extract_alert_action_params_from_savedsearches_config(cyences_email_utility.alert_all_configs, ALERT_ACTION_NAME)

            param_email_to = alert_action_config_for_alert.get("param.email_to", '')
            param_severities = alert_action_config_for_alert.get("param.cyences_severities", '')
            param_exclude_alerts = cs_utils.convert_to_set(alert_action_config_for_alert.get("param.exclude_alerts", ''))

            final_email_to = self.email_to if self.email_to is not None else param_email_to
            final_severities = self.severities if self.severities is not None else param_severities

            if final_email_to.strip() == '':
                logger.warn("Please check the Cyences Send Digest Email alert action configuration. Email/Recipients is not configured.")
                return
            
            if final_severities.strip() == '':
                logger.warn("Please check the Cyences Send Digest Email alert action configuration. The Severities field is empty.")
                return
            
            final_email_to = cs_utils.convert_to_set(final_email_to)
            final_severities = cs_utils.convert_to_set(final_severities)

            results = self.results_by_alert(records, final_severities, param_exclude_alerts)
            html_body = self.htmlResultsBody(results)

            # logger.debug("html_body: {}".format(html_body))
            if html_body.strip() == '':
                logger.info("No matching event found")
                return

            subject='Cyences Alert Digest Email'
            cyences_email_utility.send(to=final_email_to, subject=subject, html_body=html_body)
            logger.info("Email sent. subject={}".format(subject))

        except:
            logger.exception("Exception in command CyencesSendDigestEmailCommand.")
            raise


dispatch(CyencesSendDigestEmailCommand, sys.argv, sys.stdin, sys.stdout, __name__)
