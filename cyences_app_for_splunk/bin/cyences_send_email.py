#!/usr/bin/env python

import cs_imports
import sys
import time

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
            start_time = time.time()
            session_key = cs_utils.GetSessionKey(logger).from_custom_command(self)
            config_handler = cs_utils.ConfigHandler(logger, session_key)

            cyences_email_utility = CyencesEmailUtility(logger, session_key, self.alert_name)

            alert_action_config = config_handler.get_alert_action_default_config(ALERT_ACTION_NAME)
            alert_specific_action_config = config_handler.extract_alert_action_params_from_savedsearches_config(cyences_email_utility.alert_all_configs, ALERT_ACTION_NAME)

            alert_action_config.update(alert_specific_action_config)

            logger.info("Time taken to fetch the final configurations = {} seconds".format(time.time() - start_time))

            logger.debug("Final alert action config: {}".format(alert_action_config))

            email_to_default = cs_utils.convert_to_set(alert_action_config.get("param.email_to_default"))
            cyences_severities = cs_utils.convert_to_set(alert_action_config.get("param.cyences_severities"))
            email_to_exclude = cs_utils.convert_to_set(alert_action_config.get("param.email_to_exclude"))
            email_to_include = cs_utils.convert_to_set(alert_action_config.get("param.email_to_include"))
            subject_prefix = "Cyences Alert: [" + alert_action_config.get("param.subject_prefix", '') + "] "
            disable_email = cs_utils.is_true(alert_action_config.get("param.disable_email"))

            email_to_include.update(email_to_default)
            final_to = email_to_include.difference(email_to_exclude)

            if disable_email:
                msg = "Sending email is disabled."
                logger.warning(msg)
                yield {
                    'msg': msg
                }
            elif len(cyences_severities) == 0:
                msg = "Please check Cyences Send Email alert action configuration no severities selected."
                logger.warning(msg)
                yield {
                    'msg': msg
                }
            elif len(final_to) == 0:
                msg = "Please check the Cyences Send Email alert action configuration no email recipients configured."
                logger.warning(msg)
                yield {
                    'msg': msg
                }

            else:
                filtered_records = [ event for event in records if event.get('cyences_severity', '').lower() in cyences_severities]

                if len(filtered_records) == 0:
                    msg = "No matching event found"
                    logger.info(msg)
                    yield {
                        'msg': msg
                    }

                else:
                    html_body = CyencesEmailHTMLBodyBuilder.htmlTableTemplate().render(results=filtered_records)

                    email_subject = subject_prefix + self.alert_name

                    cyences_email_utility.send(to=final_to, subject=email_subject, html_body=html_body)

                    log_msg = "Email sent. subject={}, no_of_results={}".format(email_subject, len(filtered_records))
                    logger.info(log_msg)
                    yield {
                        "msg" : log_msg
                    }
        except:
            logger.exception("Exception in command CyencesSendEmailCommand.")
            self.write_error("Exception in command CyencesSendEmailCommand.")


dispatch(CyencesSendEmailCommand, sys.argv, sys.stdin, sys.stdout, __name__)
