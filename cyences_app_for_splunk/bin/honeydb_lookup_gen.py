import os
import sys
import csv
import json
import requests

from splunklib.searchcommands import dispatch, GeneratingCommand, Configuration, Option, validators
from splunk import rest



HONEYDB_URL = 'https://honeydb.io/api/bad-hosts'
HEADERS = ['ip','count','last_seen','blocked']
LOOKUP_NAME = 'ip_blocked_list.csv'
CONF_FILE = 'cs_configurations'



@Configuration()
class UpdateHoneyDBLookup(GeneratingCommand):

    update_lookup = Option(name="update_lookup", require=False, validate=validators.Boolean(), default=True)
    generate_events = Option(name="generate_events", require=False, validate=validators.Boolean(), default=False)

    def get_api_info(self):
        sessionKey = self.search_results_info.auth_token
        _, serverContent = rest.simpleRequest("/servicesNS/nobody/cyences_app_for_splunk/configs/conf-{}?output_mode=json".format(CONF_FILE), sessionKey=sessionKey)
        data = json.loads(serverContent)['entry']
        api_id = ''
        api_key = ''
        for i in data:
            if i['name'] == 'honeydb':
                api_id = i['content']['api_id']
                api_key = i['content']['api_key']
                break
        return api_id, api_key

    def request_bad_hosts(self, api_id, api_key):
        '''
        # get list from
            curl --header "X-HoneyDb-ApiId: <enter your api_id here>" \
            --header "X-HoneyDb-ApiKey: <enter your api_key here>" \
            https://honeydb.io/api/bad-hosts
        '''
        response = requests.get(HONEYDB_URL, headers={"X-HoneyDb-ApiId": api_id, "X-HoneyDb-ApiKey": api_key})

        # The response.content will be in bytes it needs to be decoded
        data = response.content.decode("utf-8")
        # Convert the data to csv format
        data = json.loads(data)
        return data


    def convert_to_csv_format(self, data):
        self.logger.info("Converting data to csv lookup format.")
        #                   remote_host/ip,              count,                       last_seen,    blocked
        return [['{}'.format(i['remote_host']), '{}'.format(i['count']), '{}'.format(i['last_seen']), '1'] for i in data]


    def update_lookup_file(self, lookup_file_path, data):
        self.logger.info("Updating lookup file.")
        with open(lookup_file_path, 'w') as f:
            csv_writer = csv.writer(f)
            csv_writer.writerow(HEADERS)
            csv_writer.writerows(data)
        self.logger.info("Lookup: {}, has been updated with {} entries.".format(lookup_file_path, len(data)))

 
    def generate(self):
        self.logger.debug("Generating events is {}".format(self.generate_events))

        # Read API ID and API Key
        api_id, api_key = self.get_api_info()

        if not api_id or not api_key:
            self.logger.info("HoneyDB API ID or API Key not found in the cs_configurations.conf file.")

        # request for data
        if self.generate_events or self.update_lookup:
            data = self.request_bad_hosts(api_id, api_key)

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
 
dispatch(UpdateHoneyDBLookup, sys.argv, sys.stdin, sys.stdout, __name__)
