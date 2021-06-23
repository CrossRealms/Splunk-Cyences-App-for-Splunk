import os
import sys
import csv
import requests

from splunklib.searchcommands import dispatch, GeneratingCommand, Configuration, Option, validators
import cs_utils

import logging
import logger_manager
logger = logger_manager.setup_logging('malicious_ip_lookup_gen', logging.DEBUG)


HEADERS = ['description','ip','ip_location','last_seen']
LOOKUP_NAME = 'cs_malicious_ip_list.csv'



@Configuration()
class UpdateMaliciousIPLookup(GeneratingCommand):

    update_lookup = Option(name="update_lookup", require=False, validate=validators.Boolean(), default=True)
    generate_events = Option(name="generate_events", require=False, validate=validators.Boolean(), default=False)


    def request_malicious_ips(self, api_config):
        logger.debug("Getting malicious Ip list from Cyences API.")
        auth_header = {
            "Authorization": "Bearer {}".format(api_config['auth_token'])
        }
        response = requests.get("{}{}".format(api_config['api_url'].rstrip('/'), '/api/v1/ip'), headers=auth_header, timeout=cs_utils.CYENCES_NETWORK_CALL_TIMEOUT)
        logger.debug("Got malicious Ip list response.")
        return response.json()['data']


    def convert_to_csv_format(self, data):
        logger.info("Converting data to csv lookup format.")
        return [
            [
                '{}'.format(i['description']),
                '{}'.format(i['ip']),
                '{}'.format(i['ip_location']),
                '{}'.format(i['last_seen'])
            ]
            for i in data
        ]


    def update_lookup_file(self, lookup_file_path, data):
        logger.info("Updating lookup file.")
        with open(lookup_file_path, 'w') as f:
            csv_writer = csv.writer(f)
            csv_writer.writerow(HEADERS)
            csv_writer.writerows(data)
        logger.info("Lookup: {}, has been updated with {} entries.".format(lookup_file_path, len(data)))

 
    def generate(self):
        try:
            # Read API Info
            api_config = cs_utils.get_cyences_api_key(self.search_results_info.auth_token, logger)

            if not api_config['api_url'] or not api_config['auth_token']:
                logger.error("MaliciousIP Collector Configuration not found in the cs_configurations.conf file.")
                yield {"Error Message": "MaliciousIP Collector Configuration not found in the cs_configurations.conf file."}
                return

            # request for data
            if self.generate_events or self.update_lookup:
                data = self.request_malicious_ips(api_config)

                if self.update_lookup:
                    # Convert data to csv format to write in the lookup
                    lookup_data = self.convert_to_csv_format(data)

                    # Update lookup
                    lookup_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                                            os.path.join('lookups', LOOKUP_NAME))
                    self.update_lookup_file(lookup_path, lookup_data)

                # Generate the events
                if self.generate_events:
                    logger.info("Generate events.")
                    for i in data:
                        yield i
            else:
                logger.info("No options were selected.")
        except Exception as e:
            logger.exception("Error in maliciousip_lookup_gen command: {}".format(e))
            raise e


dispatch(UpdateMaliciousIPLookup, sys.argv, sys.stdin, sys.stdout, __name__)
