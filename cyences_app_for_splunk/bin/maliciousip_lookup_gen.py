import os
import sys
import csv
import json
import requests

from splunklib.searchcommands import dispatch, GeneratingCommand, Configuration, Option, validators
from splunk import rest
import cs_utils



HEADERS = ['description','ip','ip_location','last_seen']
LOOKUP_NAME = 'cs_malicious_ip_list.csv'
CONF_FILE = 'cs_configurations'



@Configuration()
class UpdateMaliciousIPLookup(GeneratingCommand):

    update_lookup = Option(name="update_lookup", require=False, validate=validators.Boolean(), default=True)
    generate_events = Option(name="generate_events", require=False, validate=validators.Boolean(), default=False)

    def get_api_info(self):
        sessionKey = self.search_results_info.auth_token
        _, serverContent = rest.simpleRequest("/servicesNS/nobody/cyences_app_for_splunk/configs/conf-{}?output_mode=json".format(CONF_FILE), sessionKey=sessionKey)
        data = json.loads(serverContent)['entry']
        api_url = ''
        for i in data:
            if i['name'] == 'maliciousip':
                api_url = i['content']['api_url']
                cust_id = i['content']['cust_id']
                auth_token = cs_utils.CredentialManager(sessionKey).get_credential(api_url)
                break
        return {'api_url': api_url, 'auth_token': auth_token, 'cust_id': cust_id}

    def request_malicious_ips(self, api_config):
        auth_header = {
            "Authorization": f"Bearer {api_config['auth_token']}"
        }
        response = requests.get("{}{}".format(api_config['api_url'], '/api/v1/ip'), headers=auth_header)
        return response.json()['data']


    def convert_to_csv_format(self, data):
        self.logger.info("Converting data to csv lookup format.")
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
        self.logger.info("Updating lookup file.")
        with open(lookup_file_path, 'w') as f:
            csv_writer = csv.writer(f)
            csv_writer.writerow(HEADERS)
            csv_writer.writerows(data)
        self.logger.info("Lookup: {}, has been updated with {} entries.".format(lookup_file_path, len(data)))

 
    def generate(self):
        self.logger.debug("Generating events is {}".format(self.generate_events))

        # Read API Info
        api_config = self.get_api_info()

        if not api_config['api_url'] or not api_config['auth_token']:
            self.logger.info("MaliciousIP Collector Configuration not found in the cs_configurations.conf file.")

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
                self.logger.info("Generate events.")
                for i in data:
                    yield i
        else:
            self.logger.info("No options were selected.")


dispatch(UpdateMaliciousIPLookup, sys.argv, sys.stdin, sys.stdout, __name__)
