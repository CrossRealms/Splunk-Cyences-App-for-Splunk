import json
import splunk.admin as admin
from splunk import rest
import cs_utils

CONF_FILE = 'cs_configurations'
HONEYDB_STANZA = 'honeydb'


class HoneyDBConfRestcall(admin.MConfigHandler):
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
        for arg in ['data']:
            self.supportedArgs.addOptArg(arg)


    def handleList(self, conf_info):
        # Get HoneyDB API key
        try:
            _, serverContent = rest.simpleRequest("/servicesNS/nobody/cyences_app_for_splunk/configs/conf-{}?output_mode=json".format(CONF_FILE), sessionKey=self.getSessionKey())
            data = json.loads(serverContent)['entry']
            api_id = ''
            api_key = '******'
            for i in data:
                if i['name'] == 'honeydb':
                    api_id = i['content']['api_id']
                    break
            conf_info['action']['api_id'] = api_id
            conf_info['action']['api_key'] = api_key
        except Exception as e:
            conf_info['action']['error'] = 'Unable to fetch the API key. Might be no existing API key present. {}'.format(e)
    

    def handleEdit(self, conf_info):
        # Update the HoneyDB configuration
        try:
            data = json.loads(self.callerArgs['data'][0])
            api_id = str(data['api_id'])
            api_key = str(data['api_key'])
        except Exception as e:
            conf_info['action']['error'] = 'Data is not in proper format. {} - {}'.format(e, self.callerArgs["data"])
            return

        try:
            # Store API ID
            rest.simpleRequest("/servicesNS/nobody/cyences_app_for_splunk/configs/conf-{}/{}?output_mode=json".format(CONF_FILE, HONEYDB_STANZA), postargs={'api_id': api_id}, method='POST', sessionKey=self.getSessionKey())

            # Store API Key
            cs_utils.CredentialManager(self.getSessionKey()).store_credential(api_id, api_key)

            conf_info['action']['success'] = "API ID and API Key is stored successfully."

        except Exception as e:
            conf_info['action']['error'] = 'No success or error message returned. {}'.format(e)


if __name__ == "__main__":
    admin.init(HoneyDBConfRestcall, admin.CONTEXT_APP_AND_USER)
