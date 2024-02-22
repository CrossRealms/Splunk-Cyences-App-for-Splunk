#!/usr/bin/env python

import sys
import time
from splunklib.searchcommands import dispatch, EventingCommand, Configuration, Option, validators

import cs_utils
from cyences_email_utility import CyencesEmailHTMLBodyBuilder, CyencesEmailUtility


import logging
import logger_manager
logger = logger_manager.setup_logging('send_digest_email_action', logging.INFO)


ALERT_ACTION_NAME = 'cyences_send_digest_email_action'
FIELD_FOR_ALERT_NAME_IN_NOTABLE_EVENTS = 'search_name'


# We'll be sorting this in ascending order
ALERT_SEVERITIES = {
    'critical': 1,
    'high': 2,
    'medium': 3,
    'low': 4,
    'info': 5
}



@Configuration()
class CyencesSendDigestEmailCommand(EventingCommand):

    alert_name = Option(name="alert_name", require=True)
    email_to = Option(name='email_to', require=False, default=None)
    severities = Option(name='cyences_severities', require=False, default=None)
    max_results_per_alert = Option(name='max_results_per_alert', require=False, default=15, validate=validators.Integer(minimum=1, maximum=500))
    max_alerts_per_email = Option(name='max_alerts_per_email', require=False, default=10, validate=validators.Integer(minimum=1, maximum=500))


    def filter_results_and_group_by_alert(self, results, severity_filter, alerts_to_exclude):
        logger.debug("severity_filter={}".format(severity_filter))
        logger.debug("alerts_to_exclude={}".format(alerts_to_exclude))

        alerts = {}

        for event in results:
            # logger.debug("Event: {}".format(event))
            alert_name = event[FIELD_FOR_ALERT_NAME_IN_NOTABLE_EVENTS]

            # Skip event if alert_name in the exclude_alert
            if alert_name.lower() in alerts_to_exclude:
                continue

            if 'cyences_severity' in event:
                severity = event.get('cyences_severity', '').lower()

                # Skip the event if cyences_severity is defined and not present in the severity_filter
                if severity not in severity_filter:
                    continue

                try:
                    event['__cyences_severity'] = ALERT_SEVERITIES[severity]  # Add addition information for sorting
                except:
                    logger.warning('Unable to decode alert severity {} for alert_name={}'.format(severity, alert_name))
                    continue
            else:
                event['__cyences_severity'] = 100

            if alert_name not in alerts:
                alerts[alert_name] = {
                    'events': []
                }

            # Removing the internal fields
            for k, v in tuple(event.items()):
                if k.startswith("_"):
                    continue
                if k == FIELD_FOR_ALERT_NAME_IN_NOTABLE_EVENTS or v == '':
                    event.pop(k)

            alerts[alert_name]['events'].append(event)

        return alerts


    def limit_no_of_events_per_alert(self, results):
        for alert_name, data in results.items():
            events = data['events']
            sorted_events = sorted(events, key=lambda x: x['__cyences_severity'])
            if len(sorted_events) > self.max_results_per_alert:
                data['is_truncated'] = True
                data['total_entries'] = len(events)
                data['entries_displaying'] = self.max_results_per_alert
                data['events'] = sorted_events[0:self.max_results_per_alert]
            else:
                data['is_truncated'] = False
                data['total_entries'] = len(events)
                data['entries_displaying'] = data['total_entries']
                data['events'] = sorted_events
            
            data[alert_name] = data
        return results


    def divide_alerts_in_chunks(self, results):
        list_of_result_chunks = []
        result_chunk = {}
        counter = 0
        for alert_name in sorted(results):
            result_chunk[alert_name] = results[alert_name]
            counter += 1
            if counter >= self.max_alerts_per_email:
                # logger.debug('counter:{}, alert_name:{} result_chunk:{}'.format(counter, alert_name, result_chunk))
                list_of_result_chunks.append(result_chunk)
                result_chunk = dict()
                counter = 0

        if counter > 0:
            list_of_result_chunks.append(result_chunk)
        
        return list_of_result_chunks


    def convert_results_to_html_body(self, results):
        full_html_body = ''
        for title, data in results.items():
            events = data['events']
            if len(events) > 0:
                full_html_body += CyencesEmailHTMLBodyBuilder.htmlTableTemplate().render(results=events, title=title, is_table_truncated=data['is_truncated'], total_entries=data['total_entries'], entries_displaying=data['entries_displaying'])
        return full_html_body


    def transform(self, records):
        try:
            logger.info("Custom command CyencesSendDigestEmailCommand loaded.")
            start_time = time.time()
            session_key = cs_utils.GetSessionKey(logger).from_custom_command(self)
            config_handler = cs_utils.ConfigHandler(logger, session_key)

            cyences_email_utility = CyencesEmailUtility(logger, session_key, self.alert_name)

            alert_action_config = config_handler.get_alert_action_default_config(ALERT_ACTION_NAME)
            alert_specific_action_config = config_handler.extract_alert_action_params_from_savedsearches_config(cyences_email_utility.alert_all_configs, ALERT_ACTION_NAME)

            alert_action_config.update(alert_specific_action_config)

            logger.info("Time taken to fetch the final configurations = {} seconds".format(time.time() - start_time))

            param_email_to = alert_action_config.get("param.email_to", '')
            param_severities = alert_action_config.get("param.cyences_severities", '')
            subject_prefix = "Cyences Alert Digest: [" + alert_action_config.get("param.subject_prefix", '') + "] "
            param_exclude_alerts = cs_utils.convert_to_set(alert_action_config.get("param.exclude_alerts", ''))

            final_email_to = self.email_to if self.email_to is not None else param_email_to
            final_severities = self.severities if self.severities is not None else param_severities

            if final_email_to.strip() == '':
                msg = "Please check the Cyences Send Digest Email alert action configuration. Email/Recipients is not configured."
                logger.warning(msg)
                yield {
                    'msg': msg
                }
            elif final_severities.strip() == '':
                msg = "Please check the Cyences Send Digest Email alert action configuration. The Severities field is empty."
                logger.warning(msg)
                yield {
                    'msg': msg
                }

            else:
                final_email_to = cs_utils.convert_to_set(final_email_to)
                final_severities = cs_utils.convert_to_set(final_severities)

                results = self.filter_results_and_group_by_alert(records, final_severities, param_exclude_alerts)
                results = self.limit_no_of_events_per_alert(results)
                list_of_result_chunks = self.divide_alerts_in_chunks(results)

                email_counter = 1
                for result_chunk in list_of_result_chunks:
                    html_body = self.convert_results_to_html_body(result_chunk)
                    # logger.debug("html_body: {}".format(html_body))  # too large log

                    if html_body.strip() != '':
                        if len(list_of_result_chunks) <= 1:
                            subject = subject_prefix + self.alert_name
                        else:
                            subject = '{}{} Part-{}'.format(subject_prefix, self.alert_name, email_counter)
                            email_counter += 1

                        cyences_email_utility.send(to=final_email_to, subject=subject, html_body=html_body)
                        log_msg = "Email sent. subject={}, no_of_alerts={}".format(subject, len(result_chunk))
                        logger.info(log_msg)
                        yield {
                            "msg": log_msg
                        }
                    else:
                        logger.info("No matching event found")
                        yield {
                            "msg" : "No matching event found"
                        }
        except:
            logger.exception("Exception in command CyencesSendDigestEmailCommand.")
            self.write_error("Exception in command CyencesSendDigestEmailCommand.")


dispatch(CyencesSendDigestEmailCommand, sys.argv, sys.stdin, sys.stdout, __name__)
