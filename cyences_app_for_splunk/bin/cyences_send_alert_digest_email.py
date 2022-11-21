#!/usr/bin/env python

import sys

from splunklib.searchcommands import dispatch, EventingCommand, Configuration, Option
from splunklib.searchcommands.validators import Validator

from cyences_email_utility import CyencesEmailHTMLBodyBuilder, CyencesEmailUtility

import logging
import logger_manager
logger = logger_manager.setup_logging('send_alert_digest_email', logging.INFO)



@Configuration()
class CyencesAlertDigestEmailCommand(EventingCommand):

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


    def results_by_alert(self, results, severity_str):
        if severity_str is None:
            severity_filter = set()
        else:
            severity_filter = {item.strip() for item in severity_str.lower().split(',') if item.strip()}

        logger.info("severity_filter={}".format(severity_filter))
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
            # If severity is not mention allow all events
            if len(severity_filter) == 0:
                alerts[alert_name].append(event)
            # Allow event that has cyences_severity field and value is matching with severity_filter
            elif event.get('cyences_severity', '').lower() in severity_filter:
                alerts[alert_name].append(event)
        
        return alerts


    def htmlResultsBody(self, results):
        full_html_body = ''
        for title, events in results.items():
            if len(events) > 0:
                full_html_body += CyencesEmailHTMLBodyBuilder.htmlTableTemplate().render(results=events, title=title)
        return full_html_body



# TODO - To handle the large email, we can do following:
# 1. Make results a sorted dict (so we can group same type of alerts in possibly same email) (Example. We can sort based on the severity and take top X events from each severity something like that.)
# 2. Decide results dict into multiple dict maximum of 10/15 alerts in one email.
# 3. Follow the below process per chunk of results dict, have a numbered subject for emails, like digest 1, digest 2, etc
    def transform(self, records):
        try:
            logger.info("Custom command CyencesAlertDigestEmailCommand loaded.")
            self.check_session_key(records)

            cyences_email_utility = CyencesEmailUtility(logger, self.search_results_info.auth_token, self.alert_name)

            param_to = cyences_email_utility.emailConfigs.get("param.to")
            param_severity = cyences_email_utility.emailConfigs.get("param.cyences_severity")

            final_to = self.to if self.to is not None else param_to
            final_severity = self.severity if self.severity is not None else param_severity
            
            results = self.results_by_alert(records, final_severity)
            html_body = self.htmlResultsBody(results)
            logger.debug("html_body: {}".format(html_body))

            if html_body.strip() != '':
                subject = 'Cyences Alert Digest Email'
                cyences_email_utility.send(to=final_to, subject=subject, html_body=html_body)

                yield {
                    "msg" : "Email sent. subject={}".format(subject)
                }
            else:
                logger.info("No matching event found")
                yield {
                    "msg" : "No matching event found"
                }

        except:
            logger.exception("Exception in command CyencesAlertDigestEmailCommand.")
            raise


dispatch(CyencesAlertDigestEmailCommand, sys.argv, sys.stdin, sys.stdout, __name__)
