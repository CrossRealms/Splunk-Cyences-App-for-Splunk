#!/usr/bin/env python

import sys
import requests


from splunklib.searchcommands import dispatch, StreamingCommand, Configuration
import cs_utils

import logging
import logger_manager
logger = logger_manager.setup_logging('upload_malicious_ip', logging.DEBUG)



@Configuration(distributed=False)
class MaliciousIPUploaderCommand(StreamingCommand):
    
    def stream(self, records):
        try:
            api_payload = []
            api_config = cs_utils.get_cyences_api_key(self.search_results_info.auth_token, logger)

            if not api_config['api_url'] or not api_config['auth_token']:
                logger.error("MaliciousIP Collector Configuration not found in the cs_configurations.conf file.")
                yield {"Error Message": "MaliciousIP Collector Configuration not found in the cs_configurations.conf file."}
                return

            for record in records:
                api_payload.append(
                    {
                        'ip': record['ip'],
                        'ip_location': ','.join(record['ip_location']) if type(record['ip_location']) == list else str(record['ip_location']),
                        'device_name': ','.join(record['dvc_name']) if type(record['dvc_name']) == list else str(record['dvc_name']),
                        'device': ','.join(record['dvc']) if type(record['dvc']) == list else str(record['dvc']),
                        'no_of_ports_used': int(record['no_of_ports_used']),
                        'no_of_victims': int(record['no_of_victims']),
                        'customer_id': api_config['cust_id'],
                        'category': record['ip_category'],
                    }
                )
            endpoint_url = "{}/api/v1/ip".format(api_config['api_url'].rstrip('/'))
            payload = {'data': api_payload}
            auth_header = {
                "Authorization": "Bearer {}".format(api_config['auth_token'])
            }
            resp = None
            try:
                logger.debug("Uploading malicious Ip list to Cyences API.")
                resp = requests.post(endpoint_url, json=payload, headers=auth_header, timeout=cs_utils.CYENCES_NETWORK_CALL_TIMEOUT)
                logger.debug("Cyences API request completed.")
                resp.raise_for_status()
                yield {'success': True, 'message': "Successfully Uploaded Ips to API."}
                logger.info("Response received {}".format(resp.json()))
            except Exception as e:
                logger.exception("Error while requesting upload_malicious_ip: {}".format(e))
                if resp:
                    yield {
                        'success': False,
                        'error_message': "Failed to upload Ips to API, Reason {}".format(repr(e)),
                        'response_body': resp.json()
                    }
                else:
                    yield {
                        'success': False,
                        'error_message': "Failed to upload Ips to API, Reason {}".format(repr(e)),
                        'response': "None"
                    }
        except Exception as e:
            logger.exception("Error in upload_malicious_ip command: {}".format(e))
            raise e
        

dispatch(MaliciousIPUploaderCommand, sys.argv, sys.stdin, sys.stdout, __name__)