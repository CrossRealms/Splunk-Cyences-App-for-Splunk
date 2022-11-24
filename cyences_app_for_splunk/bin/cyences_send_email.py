#!/usr/bin/env python

import copy
import json
import sys

from splunk import rest
from splunklib.searchcommands import dispatch, EventingCommand, Configuration, Option
from splunklib.searchcommands.validators import Validator

import cs_utils
from cyences_email_utility import CyencesEmailHTMLBodyBuilder, CyencesEmailUtility

import logging
import logger_manager
logger = logger_manager.setup_logging('send_email_action', logging.INFO)

ALERT_ACTION_NAME = 'cyences_send_email_action'

@Configuration()
class CyencesSendEmailCommand(EventingCommand):

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

    def get_default_alert_action_config(self):
        _, serverContent = rest.simpleRequest(
            "/servicesNS/-/{}/configs/conf-alert_actions/{}?output_mode=json".format(cs_utils.APP_NAME, ALERT_ACTION_NAME),
            method='GET', sessionKey=self.search_results_info.auth_token, raiseAllErrors=True)

        default_configs = json.loads(serverContent)
        default_configs = default_configs['entry'][0]['content']
        logger.debug("default alert_actions config: {}".format(default_configs))

        return default_configs


    def parse_alert_config(self, config_object):
        alert_config = {}
        for key, value in config_object.items():
            PREFIX = 'action.{}.'.format(ALERT_ACTION_NAME)
            if key.startswith(PREFIX) and key.lstrip(PREFIX)!='':
                alert_config[key.lstrip(PREFIX)] = value
        logger.debug("Alert Config: {}".format(alert_config))

        return alert_config


    def transform(self, records):
        try:
            logger.info("Custom command CyencesSendEmailCommand loaded.")
            self.check_session_key(records)

            cyences_email_utility = CyencesEmailUtility(logger, self.search_results_info.auth_token, self.alert_name)

            config = self.get_default_alert_action_config()
            alert_config = self.parse_alert_config(cyences_email_utility.alert_all_configs)

            config.update(alert_config)

            logger.debug("combined config: {}".format(config))

            default_to = cs_utils.convert_to_set(config.get("param.default_to"))
            cyences_severity = cs_utils.convert_to_set(config.get("param.cyences_severity"))
            exclude_to = cs_utils.convert_to_set(config.get("param.exclude_to"))
            include_to = cs_utils.convert_to_set(config.get("param.include_to"))
            disable_email = cs_utils.is_true(config.get("param.disable_email"))

            include_to.update(default_to)
            final_to = include_to.difference(exclude_to)

            if disable_email or len(cyences_severity) == 0 or len(final_to) == 0:
                logger.warn("Please check the Cyences Send Email alert action configuration. The alert action is disabled. OR no severity is selected. OR Email is not configured.")
                return

            filtered_records = [ event for event in records if event.get('cyences_severity', '').lower() in cyences_severity]

            if len(filtered_records) == 0:
                logger.info("No matching event found")
                return
        
            html_body = CyencesEmailHTMLBodyBuilder.htmlTableTemplate().render(results=filtered_records, title=self.alert_name)

            cyences_email_utility.send(to=','.join(final_to), subject=self.alert_name, html_body=html_body)
            logger.info("Email sent. subject={}".format(self.alert_name))

        except:
            logger.exception("Exception in command CyencesSendEmailCommand.")
            raise


dispatch(CyencesSendEmailCommand, sys.argv, sys.stdin, sys.stdout, __name__)
