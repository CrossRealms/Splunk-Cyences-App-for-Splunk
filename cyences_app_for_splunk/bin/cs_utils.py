import json
from six.moves.urllib.parse import quote
import splunk.entity as entity
from splunk import rest

APP_NAME = 'cyences_app_for_splunk'
CYENCES_NETWORK_CALL_TIMEOUT = 240   # max timeout for all network calls are 240 seconds
CYENCES_CONF_FILE = 'cs_configurations'


PRODUCTS = [
{
    'name': 'Sophos',
    'macro_configurations': [
        {
            'macro_name': 'cs_sophos',
            'search': '`cs_sophos` | stats count by host',
            'earliest_time': '-60m@m',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Windows Defender',
    'macro_configurations': [
        {
            'macro_name': 'cs_windows_defender',
            'search': '`cs_windows_defender` | stats count by host',
            'earliest_time': '-60m@m',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'CrowdStrike EventStream',
    'macro_configurations': [
        {
            'macro_name': 'cs_crowdstrike_eventstream',
            'search': '`cs_crowdstrike_eventstream` | stats count by host',
            'earliest_time': '-60m@m',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'CrowdStrike Spotlight',
    'macro_configurations': [
        {
            'macro_name': 'cs_crowdstrike_vuln',
            'search': '`cs_crowdstrike_vuln` | stats count by host',
            'earliest_time': '-60m@m',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Kaspersky',
    'macro_configurations': [
        {
            'macro_name': 'cs_kaspersky',
            'search': '`cs_kaspersky` | stats count by host',
            'earliest_time': '-60m@m',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Office 365',
    'macro_configurations': [
        {
            'macro_name': 'cs_o365',
            'search': '`cs_o365` | stats count by host',
            'earliest_time': '-60m@m',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Azure Security Score Logs',
    'macro_configurations': [
        {
            'macro_name': 'cs_azure_securityscore',
            'search': '`cs_azure_securityscore` | stats count by host',
            'earliest_time': '-60m@m',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'WinEventLog Security',
    'macro_configurations': [
        {
            'macro_name': 'cs_wineventlog_security',
            'search': '`cs_wineventlog_security` | stats count by host',
            'earliest_time': '-60m@m',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'WinEventLog System',
    'macro_configurations': [
        {
            'macro_name': 'cs_wineventlog_system',
            'search': '`cs_wineventlog_system` | stats count by host',
            'earliest_time': '-60m@m',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Active Directory Logs',
    'macro_configurations': [
        {
            'macro_name': 'cs_ad_active_directory',
            'search': '`cs_ad_active_directory` | stats count by host',
            'earliest_time': '-60m@m',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'MSAD Health Logs',
    'macro_configurations': [
        {
            'macro_name': 'cs_ad_health_logs',
            'search': '`cs_ad_health_logs` | stats count by host',
            'earliest_time': '-60m@m',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Sysmon',
    'macro_configurations': [
        {
            'macro_name': 'cs_sysmon',
            'search': '`cs_sysmon` | stats count by host',
            'earliest_time': '-60m@m',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'FortiGate',
    'macro_configurations': [
        {
            'macro_name': 'cs_fortigate',
            'search': '`cs_fortigate` | stats count by host',
            'earliest_time': '-60m@m',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Palo Alto',
    'macro_configurations': [
        {
            'macro_name': 'cs_palo',
            'search': '`cs_palo` | stats count by host',
            'earliest_time': '-60m@m',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Sophos Firewall',
    'macro_configurations': [
        {
            'macro_name': 'cs_sophos_firewall',
            'search': '`cs_sophos_firewall` | stats count by host',
            'earliest_time': '-60m@m',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'VPN (indexes)',
    'macro_configurations': [
        {
            'macro_name': 'cs_vpn_indexes',
            'search': '`cs_vpn_indexes` | stats count by host',
            'earliest_time': '-60m@m',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Authentication (indexes)',
    'macro_configurations': [
        {
            'macro_name': 'cs_authentication_indexes',
            'search': '`cs_authentication_indexes` | stats count by host',
            'earliest_time': '-60m@m',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Lansweeper',
    'macro_configurations': [
        {
            'macro_name': 'cs_lansweeper',
            'search': '`cs_lansweeper` | stats count by host',
            'earliest_time': '-60m@m',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Qualys',
    'macro_configurations': [
        {
            'macro_name': 'cs_qualys',
            'search': '`cs_qualys` | stats count by host',
            'earliest_time': '-60m@m',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Tenable',
    'macro_configurations': [
        {
            'macro_name': 'cs_tenable',
            'search': '`cs_tenable` | stats count by host',
            'earliest_time': '-60m@m',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Linux',
    'macro_configurations': [
        {
            'macro_name': 'cs_linux',
            'search': '`cs_linux` | stats count by host',
            'earliest_time': '-60m@m',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Microsoft Defender ATP',
    'macro_configurations': [
        {
            'macro_name': 'cs_o365_defender_atp',
            'search': '`cs_o365_defender_atp` | stats count by host',
            'earliest_time': '-60m@m',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'AWS',
    'macro_configurations': [
        {
            'macro_name': 'cs_aws',
            'search': '`cs_aws` | stats count by host',
            'earliest_time': '-60m@m',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'G Suite',
    'macro_configurations': [
        {
            'macro_name': 'cs_gsuite',
            'search': '`cs_gsuite` | stats count by host',
            'earliest_time': '-60m@m',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Cisco IOS',
    'macro_configurations': [
        {
            'macro_name': 'cs_cisco_ios',
            'search': '`cs_cisco_ios` | stats count by host',
            'earliest_time': '-60m@m',
            'latest_time': 'now',
        }
    ]
},
]

PRODUCTS = PRODUCTS.sort(key=lambda x: x["name"])


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
    def __init__(self, logger, session_key) -> None:
        self.logger = logger
        self.session_key = session_key

    def get_alert_action_default_config(self, alert_action_name):
        _, serverContent = rest.simpleRequest(
            "/servicesNS/-/{}/configs/conf-alert_actions/{}?output_mode=json".format(APP_NAME, alert_action_name),
            method='GET', sessionKey=self.session_key, raiseAllErrors=True)

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
        self.logger.debug("Alert specific config for alert action ({}): {}".format(alert_action_name, savedsearches_config_object))

        return alert_action_config_for_alert


    def get_macros(self):
        self.logger.info("Getting macros")
        _, serverContent = rest.simpleRequest(
            "/servicesNS/-/{}/admin/macros?output_mode=json&count=0".format(
                APP_NAME
            ),
            sessionKey=self.session_key,
            raiseAllErrors=True,
        )
        data = json.loads(serverContent)["entry"]
        return data


    def get_macros_definitions(self):
        data = self.get_macros()
        results = {}
        for item in data:
            results[item["name"]] = item["content"]["definition"]
        return results


    def update_macro(self, macro_name, data):
        self.logger.info("Updating macro {} with data {}".format(macro_name, data))
        rest.simpleRequest(
            "/servicesNS/nobody/{}/admin/macros/{}?output_mode=json&count=0".format(
                APP_NAME, macro_name
            ),
            sessionKey=self.session_key,
            raiseAllErrors=True,
            method="POST",
            postargs=data,
        )


    def get_saved_searches(self):
        self.logger.info("Getting savedsearches")
        _, serverContent = rest.simpleRequest(
            "/servicesNS/-/{}/saved/searches?output_mode=json&count=0".format(
                APP_NAME
            ),
            sessionKey=self.session_key,
            raiseAllErrors=True,
        )
        data = json.loads(serverContent)["entry"]
        return data


    def update_savedsearch(self, savedsearch_name, data):
        self.logger.info(
            "Updating savedsearch {} with data {}".format(savedsearch_name, data)
        )
        rest.simpleRequest(
            "/servicesNS/nobody/{}/saved/searches/{}?output_mode=json&count=0".format(
                APP_NAME, savedsearch_name
            ),
            sessionKey=self.session_key,
            raiseAllErrors=True,
            method="POST",
            postargs=data,
        )


    def get_conf_stanza(self, conf_file, stanza):
        _, serverContent = rest.simpleRequest(
            "/servicesNS/nobody/{}/configs/conf-{}/{}?output_mode=json".format(APP_NAME, conf_file, stanza), 
            sessionKey=self.session_key
        )
        data = json.loads(serverContent)['entry']
        return data


    def update_conf_stanza(self, conf_file, stanza, data):
        self.logger.info(
            "Updating conf {} stanza {} with data {}".format(conf_file, stanza, data)
        )
        rest.simpleRequest(
            "/servicesNS/nobody/{}/configs/conf-{}/{}?output_mode=json".format(APP_NAME, conf_file, stanza),
            postargs=data,
            method='POST',
            sessionKey=self.session_key,
            raiseAllErrors=True,
        )
