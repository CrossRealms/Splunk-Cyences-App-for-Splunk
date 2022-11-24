#!/usr/bin/env python

import sys

from splunk import rest
from splunklib.searchcommands import dispatch, EventingCommand, Configuration, Option

import cs_utils
from cyences_email_utility import CyencesEmailHTMLBodyBuilder, CyencesEmailUtility

import logging
import logger_manager
logger = logger_manager.setup_logging('send_email_action', logging.INFO)


ALERT_ACTION_NAME = 'cyences_send_email_action'


@Configuration()
class CyencesSendEmailCommand(EventingCommand):

    alert_name = Option(name="alert_name", require=True)
    email_to = Option(name='email_to', require=False, default=None)
    severities = Option(name='cyences_severities', require=False, default=None)


    def transform(self, records):
        try:
            logger.info("Custom command CyencesSendEmailCommand loaded.")
            session_key = cs_utils.GetSessionKey(logger).from_custom_command(self)
            config_handler = cs_utils.ConfigHandler(logger)

            cyences_email_utility = CyencesEmailUtility(logger, session_key, self.alert_name)

            alert_action_config = config_handler.get_alert_action_default_config(ALERT_ACTION_NAME)
            alert_specific_action_config = config_handler.extract_alert_action_params_from_savedsearches_config(alert_action_config, ALERT_ACTION_NAME)

            alert_action_config.update(alert_specific_action_config)

            logger.debug("Final alert action config: {}".format(alert_action_config))

            email_to_default = cs_utils.convert_to_set(alert_action_config.get("param.email_to_default"))
            cyences_severities = cs_utils.convert_to_set(alert_action_config.get("param.cyences_severities"))
            email_to_exclude = cs_utils.convert_to_set(alert_action_config.get("param.email_to_exclude"))
            email_to_include = cs_utils.convert_to_set(alert_action_config.get("param.email_to_include"))
            disable_email = cs_utils.is_true(alert_action_config.get("param.disable_email"))

            email_to_include.update(email_to_default)
            final_to = email_to_include.difference(email_to_exclude)

            if disable_email or len(cyences_severities) == 0 or len(final_to) == 0:
                logger.warn("Please check the Cyences Send Email alert action configuration. The alert action is disabled. OR no severity is selected. OR Email is not configured.")
                return

            filtered_records = [ event for event in records if event.get('cyences_severity', '').lower() in cyences_severities]

            if len(filtered_records) == 0:
                logger.info("No matching event found")
                return
        
            html_body = CyencesEmailHTMLBodyBuilder.htmlTableTemplate().render(results=filtered_records, title=self.alert_name)

            cyences_email_utility.send(to=final_to, subject=self.alert_name, html_body=html_body)
            logger.info("Email sent. subject={}".format(self.alert_name))

        except:
            logger.exception("Exception in command CyencesSendEmailCommand.")
            raise


dispatch(CyencesSendEmailCommand, sys.argv, sys.stdin, sys.stdout, __name__)
