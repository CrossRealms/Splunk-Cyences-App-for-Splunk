import json
import splunk.admin as admin
from splunk import rest
import cs_utils
import uuid

CONF_FILE = 'cs_configurations'
SOPHOS_STANZA = 'cs_sophos_endpoint'


class SophosConfRestcall(admin.MConfigHandler):
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
        for arg in ['data','client_id', 'client_secret']:
            self.supportedArgs.addOptArg(arg)


    def handleList(self, conf_info):
        # Get Sophos Configuration
        try:
            _, serverContent = rest.simpleRequest("/servicesNS/nobody/cyences_app_for_splunk/configs/conf-{}?output_mode=json".format(CONF_FILE), sessionKey=self.getSessionKey())
            data = json.loads(serverContent)['entry']
            client_id = ''
            client_secret = '******'
            for i in data:
                if i['name'] == SOPHOS_STANZA:
                    client_id = i['content']['client_id']
                    break
            conf_info['action']['client_id'] = client_id
            conf_info['action']['client_secret'] = client_secret
        except Exception as e:
            conf_info['action']['error'] = 'Unable to fetch the Client Secret. Might be no existing Client Secret present. {}'.format(e)
    

    def handleEdit(self, conf_info):
        # Update the Sophos configuration
        try:
            data = json.loads(self.callerArgs['data'][0])
            client_id = str(data['client_id'])
            client_secret = str(data['client_secret'])
        except Exception as e:
            conf_info['action']['error'] = 'Data is not in proper format. {} - {}'.format(e, self.callerArgs["data"])
            return

        try:
            # Store Client ID
            rest.simpleRequest("/servicesNS/nobody/cyences_app_for_splunk/configs/conf-{}/{}?output_mode=json".format(CONF_FILE, SOPHOS_STANZA), postargs={'client_id': client_id}, method='POST', sessionKey=self.getSessionKey())

            # Store Client Secret
            cs_utils.CredentialManager(self.getSessionKey()).store_credential(client_id, client_secret)

            conf_info['action']['success'] = "Client ID and Client Secret are stored successfully."

        except Exception as e:
            conf_info['action']['error'] = 'No success or error message returned. {}'.format(e)


if __name__ == "__main__":
    admin.init(SophosConfRestcall, admin.CONTEXT_APP_AND_USER)
