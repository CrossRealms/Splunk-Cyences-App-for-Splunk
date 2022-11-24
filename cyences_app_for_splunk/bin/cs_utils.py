import json
from six.moves.urllib.parse import quote
import splunk.entity as entity
from splunk import rest

APP_NAME = 'cyences_app_for_splunk'
CYENCES_NETWORK_CALL_TIMEOUT = 240   # max timeout for all network calls are 240 seconds
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


def check_url_scheme(url, logger):
    """Check the url scheme. If it is not https then raise exception"""
    err_msg = "The url must start with https scheme. url={}".format(url)
    if not url.startswith("https://"):
        logger.error(err_msg)
        raise Exception(err_msg)


def is_true(val: str):
    return str(val).lower() in ('1', 'true', 'yes')


def convert_to_set(val: str, to_lower_all=True):
    '''convert comma separated string into set'''
    if val is None or val.strip() == '':
        return set()
    
    if to_lower_all:
        return { item.strip() for item in val.strip().lower().split(',') if item.strip() }

    return { item.strip() for item in val.strip().split(',') if item.strip() }



class GetSessionKey:
    def __init__(self, logger) -> None:
        self.logger = logger
    
    def from_custom_command(self, custom_command_obj):
        if not custom_command_obj.search_results_info or not custom_command_obj.search_results_info.auth_token:
            self.logger.error("Unable to get session key in the custom command.")
            raise Exception("Unable to get session key.")
        return custom_command_obj.search_results_info.auth_token



class ConfigHandler:
    def __init__(self, logger) -> None:
        self.logger = logger

    def get_alert_action_default_config(self, alert_action_name):
        _, serverContent = rest.simpleRequest(
            "/servicesNS/-/{}/configs/conf-alert_actions/{}?output_mode=json".format(APP_NAME, alert_action_name),
            method='GET', sessionKey=self.search_results_info.auth_token, raiseAllErrors=True)

        default_configs = json.loads(serverContent)
        default_configs = default_configs['entry'][0]['content']
        self.logger.debug("alert_action_name={}, config={}".format(alert_action_name, default_configs))

        return default_configs


    def extract_alert_action_params_from_savedsearches_config(self, savedsearches_config_object, alert_action_name):
        alert_action_config_for_alert = {}
        for key, value in savedsearches_config_object.items():
            PREFIX = 'action.{}.'.format(alert_action_name)
            if key.startswith(PREFIX) and key.lstrip(PREFIX)!='':
                alert_action_config_for_alert[key.lstrip(PREFIX)] = value
        self.logger.debug("Alert ({}) specific config for alert action ({}): {}".format(savedsearches_config_object['title'], alert_action_name, alert_config))

        return alert_action_config_for_alert
