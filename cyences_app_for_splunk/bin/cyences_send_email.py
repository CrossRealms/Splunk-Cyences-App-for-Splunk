#!/usr/bin/env python

import sys
import time

from splunklib.searchcommands import dispatch, EventingCommand, Configuration, Option

import cs_utils
from cyences_email_utility import CyencesEmailHTMLBodyBuilder, CyencesEmailUtility

import logging
import logger_manager
logger = logger_manager.setup_logging('send_email_action', logging.INFO)


ALERT_ACTION_NAME = 'cyences_send_email_action'
SOC_TEAM_EMAIL_MACRO = 'cs_soc_email'
COMPLIANCE_TEAM_EMAIL_MACRO = 'cs_compliance_email'
SOC_TEAM_SEVERITIES_MACRO = 'cs_soc_immediate_alert_severities'
COMPLIANCE_TEAM_SEVERITIES_MACRO = 'cs_compliance_immediate_alert_severities'


@Configuration()
class CyencesSendEmailCommand(EventingCommand):

    alert_name = Option(name="alert_name", require=True)

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

            cyences_severities_to_include = cs_utils.convert_to_set(alert_action_config.get("param.cyences_severities_to_include"))
            cyences_severities_to_exclude = cs_utils.convert_to_set(alert_action_config.get("param.cyences_severities_to_exclude"))
            email_to_exclude = cs_utils.convert_to_set(alert_action_config.get("param.email_to_exclude"))
            email_to_include = cs_utils.convert_to_set(alert_action_config.get("param.email_to_include"))
            subject_prefix = "Cyences Alert: [" + alert_action_config.get("param.subject_prefix", '') + "] "
            disable_email = cs_utils.is_true(alert_action_config.get("param.disable_email"))
            soc_team_emails = cs_utils.convert_to_set(config_handler.get_macro(SOC_TEAM_EMAIL_MACRO))
            compliance_team_emails = cs_utils.convert_to_set(config_handler.get_macro(COMPLIANCE_TEAM_EMAIL_MACRO))
            soc_team_severities = cs_utils.convert_to_set(config_handler.get_macro(SOC_TEAM_SEVERITIES_MACRO))
            compliance_team_severities = cs_utils.convert_to_set(config_handler.get_macro(COMPLIANCE_TEAM_SEVERITIES_MACRO))


            associated_teams = config_handler.get_conf_stanza("savedsearches", self.alert_name)[0]["content"].get("action.cyences_notable_event_action.teams", "")

            associated_teams = [item.strip() for item in associated_teams.split(",") if item.strip()]

            if "SOC" in associated_teams:
                email_to_include.update(soc_team_emails)
                cyences_severities_to_include.update(soc_team_severities)

            if "Compliance" in associated_teams:
                email_to_include.update(compliance_team_emails)
                cyences_severities_to_include.update(compliance_team_severities)

            final_to = email_to_include.difference(email_to_exclude)
            final_severities = cyences_severities_to_include.difference(cyences_severities_to_exclude)

            if disable_email:
                msg = "Sending email is disabled."
                logger.warning(msg)
                yield {
                    'msg': msg
                }
            elif len(final_severities) == 0:
                msg = "Please configure the appropriate severities for the alert."
                logger.warning(msg)
                yield {
                    'msg': msg
                }
            elif len(final_to) == 0:
                msg = "Please configure the appropriate recepient emails for the alert."
                logger.warning(msg)
                yield {
                    'msg': msg
                }

            else:
                filtered_records = [ event for event in records if event.get('cyences_severity', '').lower() in final_severities]

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
