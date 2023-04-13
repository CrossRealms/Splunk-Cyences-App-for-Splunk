import json
from six.moves.urllib.parse import quote
import splunk.entity as entity
from splunk import rest

APP_NAME = 'cyences_app_for_splunk'
CYENCES_NETWORK_CALL_TIMEOUT = 240   # max timeout for all network calls are 240 seconds
CYENCES_CONF_FILE = 'cs_configurations'

def QUERY(macro, by, values, more=''):
    SEARCH_QUERY_TEMPLATE = '''`{macro}` {more} | stats count by {by} 
| append [| makeresults | eval {by}=split("{values}", ","), count=0 | mvexpand {by}] 
| stats sum(count) as count by {by}'''
    return SEARCH_QUERY_TEMPLATE.format(macro=macro, by=by, values=values, more=more)


PRODUCTS = [
{
    'name': 'AWS',
    'macro_configurations': [
        {
            'macro_name': 'cs_aws',
            'label': 'AWS Data',
            'search': QUERY(
                        macro='cs_aws',
                        by='sourcetype',
                        values='aws:addon:account,aws:cloudtrail'
                        ),
            'earliest_time': '-1d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Cisco IOS',
    'macro_configurations': [
        {
            'macro_name': 'cs_cisco_ios',
            'label': 'Cisco IOS Data',
            'search': QUERY(
                        macro='cs_cisco_ios',
                        by='sourcetype',
                        values='cisco:ios'
                        ),
            'earliest_time': '-4h@h',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'CrowdStrike EventStream',
    'macro_configurations': [
        {
            'macro_name': 'cs_crowdstrike_eventstream',
            'label': 'CrowdStrike EventStream Data',
            'search': QUERY(
                        macro='cs_crowdstrike_eventstream',
                        by='sourcetype',
                        values='CrowdStrike:Event:Streams:JSON'
                        ),
            'earliest_time': '-7d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'CrowdStrike Spotlight',
    'macro_configurations': [
        {
            'macro_name': 'cs_crowdstrike_vuln',
            'label': 'CrowdStrike Spotlight Data',
            'search': QUERY(
                        macro='cs_crowdstrike_vuln',
                        by='sourcetype',
                        values='crowdstrike:spotlight:vulnerability'
                        ),
            'earliest_time': '-7d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'FortiGate',
    'macro_configurations': [
        {
            'macro_name': 'cs_fortigate',
            'label': 'FortiGate Data',
            'search': QUERY(
                        macro='cs_fortigate',
                        by='sourcetype',
                        values='fortigate_event,fortigate_traffic,fortigate_utm'
                        ),
            'earliest_time': '-4h@h',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'G Suite',
    'macro_configurations': [
        {
            'macro_name': 'cs_gsuite',
            'label': 'G Suite Data',
            'search': QUERY(
                        macro='cs_gsuite',
                        by='sourcetype',
                        values='gapps:report:admin,gapps:report:login'
                        ),
            'earliest_time': '-7d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Kaspersky',
    'macro_configurations': [
        {
            'macro_name': 'cs_kaspersky',
            'label': 'Kaspersky Data',
            'search': QUERY(
                        macro='cs_kaspersky',
                        by='sourcetype',
                        values='kaspersky:leef,kaspersky:klaud,kaspersky:klprci,kaspersky:klbl,kaspersky:klsrv,kaspersky:gnrl,kaspersky:klnag'
                        ),
            'earliest_time': '-1d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Lansweeper',
    'macro_configurations': [
        {
            'macro_name': 'cs_lansweeper',
            'label': 'Lansweeper Data',
            'search': QUERY(
                        macro='cs_lansweeper',
                        by='sourcetype',
                        values='lansweeper:asset:onprem,lansweeper:asset:v2'
                        ),
            'earliest_time': '-2d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Linux',
    'label': 'Linux/Unix',
    'macro_configurations': [
        {
            'macro_name': 'cs_linux',
            'label': 'Linux Data',
            'search': QUERY(
                        macro='cs_linux',
                        by='sourcetype',
                        values='usersWithLoginPrivs,cyences:linux:groups,cyences:linux:users,sudousers,openPorts,interfaces,df,Unix:ListeningPorts,Unix:Service,Unix:UserAccounts,Unix:Version,Unix:Uptime,package,hardware,lsof,linux_secure,linux:audit,syslog',
                        more='sourcetype IN (usersWithLoginPrivs,cyences:linux:groups,cyences:linux:users,sudousers,openPorts,interfaces,df,Unix:ListeningPorts,Unix:Service,Unix:UserAccounts,Unix:Version,Unix:Uptime,package,hardware,lsof,linux_secure,linux:audit,syslog)'
                        ),
            'earliest_time': '-2d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Office 365',
    'macro_configurations': [
        {
            'macro_name': 'cs_o365',
            'label': 'Office 365 Data',
            'search': QUERY(
                        macro='cs_o365',
                        by='sourcetype',
                        values='o365:management:activity,o365:service:healthIssue,o365:reporting:messagetrace'
                        ),
            'earliest_time': '-1d@d',
            'latest_time': 'now',
        },
        {
            'macro_name': 'cs_azure_securityscore',
            'label': 'Azure Security Score Data',
            'search': QUERY(
                        macro='cs_azure_securityscore',
                        by='sourcetype',
                        values='GraphSecurity:Score',
                        more='sourcetype="GraphSecurity:Score"'
                        ),
            'earliest_time': '-2d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Office 365 Defender ATP',
    'macro_configurations': [
        {
            'macro_name': 'cs_o365_defender_atp',
            'label': 'Microsoft 365 Defender ATP Data',
            'search': QUERY(
                        macro='cs_o365_defender_atp',
                        by='sourcetype',
                        values='ms:defender:atp:alerts'
                        ),
            'earliest_time': '-7d@d',
            'latest_time': 'now',
        },
        {
            'macro_name': 'cs_o365_defender_atp_audit',
            'label': 'Microsoft 365 Defender ATP Audit Data',
            'search': QUERY(
                        macro='cs_o365_defender_atp_audit',
                        by='sourcetype',
                        values='DefenderATPStatusLog'
                        ),
            'earliest_time': '-1d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Palo Alto',
    'macro_configurations': [
        {
            'macro_name': 'cs_palo',
            'label': 'Palo Alto Data',
            'search': QUERY(
                        macro='cs_palo',
                        by='sourcetype',
                        values='pan:config,pan:globalprotect,pan:system,pan:threat,pan:traffic'
                        ),
            'earliest_time': '-1d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Qualys',
    'macro_configurations': [
        {
            'macro_name': 'cs_qualys',
            'label': 'Qualys Data',
            'search': QUERY(
                        macro='cs_qualys',
                        by='sourcetype',
                        values='qualys:hostDetection'
                        ),
            'earliest_time': '-7d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Sophos',
    'macro_configurations': [
        {
            'macro_name': 'cs_sophos',
            'label': 'Sophos Central Data',
            'search': QUERY(
                        macro='cs_sophos',
                        by='sourcetype',
                        values='sophos:central:events'
                        ),
            'earliest_time': '-7d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Sophos Firewall',
    'macro_configurations': [
        {
            'macro_name': 'cs_sophos_firewall',
            'label': 'Sophos Firewall Data',
            'search': QUERY(
                        macro='cs_sophos_firewall',
                        by='sourcetype',
                        values='sophos:xg:firewall,sophos:xg:heartbeat,sophos:xg:system_health,sophos:xg:atp,sophos:xg:idp'
                        ),
            'earliest_time': '-1d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Sysmon',
    'macro_configurations': [
        {
            'macro_name': 'cs_sysmon',
            'label': 'Sysmon Data',
            'search': QUERY(
                        macro='cs_sysmon',
                        by='source',
                        values='XmlWinEventLog:Microsoft-Windows-Sysmon/Operational'
                        ),
            'earliest_time': '-4h@h',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Tenable',
    'macro_configurations': [
        {
            'macro_name': 'cs_tenable',
            'label': 'Tenable Data',
            'search': QUERY(
                        macro='cs_tenable',
                        by='sourcetype',
                        values='tenable:io:assets,tenable:io:plugin,tenable:io:vuln'
                        ),
            'earliest_time': '-7d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'VPN',
    'macro_configurations': [
        {
            'macro_name': 'cs_vpn_indexes',
            'label': 'VPN Data (indexes)',
            'search': '`cs_vpn_indexes` dest_category="vpn_auth" | stats count by index, sourcetype',
            'earliest_time': '-1d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Windows',
    'macro_configurations': [
        {
            'macro_name': 'cs_windows_idx',
            'label': 'Windows Data',
            'search': r'''`cs_windows_idx` | stats count | eval label="Windows" 
| append [| search `cs_windows_idx` sourcetype="*WinEventLog" source="*WinEventLog:Security" | stats count | eval label="Windows Security", search="sourcetype=\"*WinEventLog\" source=\"*WinEventLog:Security\""] 
| append [| search `cs_windows_idx` sourcetype="*WinEventLog" source="*WinEventLog:System" | stats count | eval label="Windows System", search="sourcetype=\"*WinEventLog\" source=\"*WinEventLog:System\""] 
| append [| search `cs_windows_idx` sourcetype="ActiveDirectory" | stats count | eval label="Windows AD", search="sourcetype=\"ActiveDirectory\""] 
| append [| search `cs_windows_idx` source=powershell sourcetype="MSAD:*:Health" | stats count | eval label="Windows AD Health", search="source=powershell sourcetype=\"MSAD:*:Health\""] 
| table label search count''',
            'earliest_time': '-1d@d',
            'latest_time': 'now',
        }
    ]
},
{
    'name': 'Windows Defender',
    'macro_configurations': [
        {
            'macro_name': 'cs_windows_defender',
            'label': 'Windows Defender Data',
            'search': QUERY(
                        macro='cs_windows_defender',
                        by='source',
                        values='XmlWinEventLog:Defender'
                        ),
            'earliest_time': '-1d@d',
            'latest_time': 'now',
        }
    ]
},
]

PRODUCTS.sort(key=lambda x: x["name"].lower())


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
                APP_NAME, quote(savedsearch_name, safe='')
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
