import json
import splunk.admin as admin
from splunk import rest
import cs_utils
import uuid

CONF_FILE = 'cs_configurations'
MALICIOUS_IP_STANZA = 'maliciousip'


class MaliciousIPConfRestcall(admin.MConfigHandler):
    '''
    Set up supported arguments
    '''

    # Static variables
    def setup(self):
        """
        Sets the input arguments
        :return:
        """
        # Set up the valid parameters
        for arg in ['data','api_url', 'auth_token']:
            self.supportedArgs.addOptArg(arg)


    def handleList(self, conf_info):
        # Get MaliciousIP Collector Configuration
        try:
            _, serverContent = rest.simpleRequest("/servicesNS/nobody/cyences_app_for_splunk/configs/conf-{}?output_mode=json".format(CONF_FILE), sessionKey=self.getSessionKey())
            data = json.loads(serverContent)['entry']
            api_url = ''
            auth_token = '******'
            for i in data:
                if i['name'] == 'maliciousip':
                    api_url = i['content']['api_url']
                    break
            conf_info['action']['api_url'] = api_url
            conf_info['action']['auth_token'] = auth_token
        except Exception as e:
            conf_info['action']['error'] = 'Unable to fetch the API key. Might be no existing API key present. {}'.format(e)
    

    def handleEdit(self, conf_info):
        # Update the MaliciousIP Collector configuration
        try:
            data = json.loads(self.callerArgs['data'][0])
            api_url = str(data['api_url'])
            auth_token = str(data['auth_token'])
        except Exception as e:
            conf_info['action']['error'] = 'Data is not in proper format. {} - {}'.format(e, self.callerArgs["data"])
            return

        try:
            # Store API ID
            rest.simpleRequest("/servicesNS/nobody/cyences_app_for_splunk/configs/conf-{}/{}?output_mode=json".format(CONF_FILE, MALICIOUS_IP_STANZA), postargs={'api_url': api_url}, method='POST', sessionKey=self.getSessionKey())
            _, serverContent = rest.simpleRequest("/servicesNS/nobody/cyences_app_for_splunk/configs/conf-{}?output_mode=json".format(CONF_FILE), sessionKey=self.getSessionKey())
            data = json.loads(serverContent)['entry']
            cust_id = ''
            for i in data:
                if i['name'] == 'maliciousip':
                    cust_id = i['content'].get('cust_id','')
                    if cust_id == '':
                        rest.simpleRequest("/servicesNS/nobody/cyences_app_for_splunk/configs/conf-{}/{}?output_mode=json".format(CONF_FILE, MALICIOUS_IP_STANZA), postargs={'cust_id': uuid.uuid4().hex}, method='POST', sessionKey=self.getSessionKey())
            # Store API Key
            cs_utils.CredentialManager(self.getSessionKey()).store_credential(api_url, auth_token)

            conf_info['action']['success'] = "API ID and API Key is stored successfully."

        except Exception as e:
            conf_info['action']['error'] = 'No success or error message returned. {}'.format(e)


if __name__ == "__main__":
    admin.init(MaliciousIPConfRestcall, admin.CONTEXT_APP_AND_USER)
