import json
from six.moves.urllib.parse import quote
import splunk.entity as entity
from splunk import rest

APP_NAME = 'cyences_app_for_splunk'
CYENCES_NETWORK_CALL_TIMEOUT = 5   # max timeout for all network calls are 5 seconds
CYENCES_CONF_FILE = 'cs_configurations'


class CredentialManager(object):
    '''
    Credential manager to store and retrieve password
    '''
    def __init__(self, session_key):
        '''
        Init for credential manager
        :param session_key: Splunk session key
        '''
        self.session_key = session_key

    def get_credential(self, username):
        '''
        Searches passwords using username and returns tuple of username and password if credentials are found else tuple of empty string
        :param username: Username used to search credentials.
        :return: username, password
        '''
        # list all credentials
        entities = entity.getEntities(["admin", "passwords"], search=APP_NAME, count=-1, namespace=APP_NAME, owner="nobody",
                                    sessionKey=self.session_key)

        # return first set of credentials
        for _, value in list(entities.items()):
            # if str(value["eai:acl"]["app"]) == APP_NAME and value["username"] == username:
            if value['username'].partition('`')[0] == username and not value.get('clear_password', '`').startswith('`'):
                try:
                    return json.loads(value.get('clear_password', '{}').replace("'", '"'))
                except:
                    return value.get('clear_password', '')

    def store_credential(self, username, password):
        '''
        Updates password if password is already stored with given username else create new password.
        :param username: Username to be stored.
        :param password: Password to be stored.
        :return: None
        '''
        old_password = self.get_credential(username)
        username = username + "``splunk_cred_sep``1"

        if old_password:
            postargs = {
                "password": json.dumps(password) if isinstance(password, dict) else password
            }
            username = username.replace(":", r"\:")
            realm = quote(APP_NAME + ":" + username + ":", safe='')

            rest.simpleRequest(
                "/servicesNS/nobody/{}/storage/passwords/{}?output_mode=json".format(APP_NAME, realm),
                self.session_key, postargs=postargs, method='POST', raiseAllErrors=True)

            return True
        else:
            # when there is no existing password
            postargs = {
                "name": username,
                "password": json.dumps(password) if isinstance(password, dict) else password,
                "realm": APP_NAME
            }
            rest.simpleRequest("/servicesNS/nobody/{}/storage/passwords/?output_mode=json".format(APP_NAME),
                                    self.session_key, postargs=postargs, method='POST', raiseAllErrors=True)

def get_cyences_api_key(session_key, logger):
    logger.debug("Getting Cyences API Key.")
    _, serverContent = rest.simpleRequest("/servicesNS/nobody/cyences_app_for_splunk/configs/conf-{}?output_mode=json".format(CYENCES_CONF_FILE), sessionKey=session_key)
    data = json.loads(serverContent)['entry']
    api_url = None
    auth_token = None
    cust_id = None
    for i in data:
        if i['name'] == 'maliciousip':
            api_url = i['content']['api_url']
            cust_id = i['content']['cust_id']
            auth_token = CredentialManager(session_key).get_credential(api_url)
            break
    logger.debug("Got API key.")
    return {'api_url': api_url, 'auth_token': auth_token, 'cust_id': cust_id}
