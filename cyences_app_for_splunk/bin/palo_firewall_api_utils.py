import base64
import urllib.parse
import requests

tag = "malicious" # TODO: Update like splunk_cyences_malicious

register_entry = '''
<entry ip="{ip_address}" persistent="{persistent}">
    <tag>
        <member timeout="{timeout}">{tag}</member>
    </tag>
</entry>
'''

register_data = '''
<uid-message>
    <type>update</type>
    <payload>
        <register>
            {entries}
        </register>
    </payload>
</uid-message>
'''

unregister_entry = '''
<entry ip="{ip_address}">
    <tag>
        <member>{tag}</member>
    </tag>
</entry>
'''

unregister_data = '''
<uid-message>
    <type>update</type>
    <payload>
        <unregister>
            {entries}
        </unregister>
    </payload>
</uid-message>'''

class PaloFirewallAPIUtils:

    def __init__(self, logger, session_key, firewall_ip, username, password):
        self.logger = logger
        self.session_key = session_key

        if not username or not password:
            raise Exception("Please provide Palo Alto Firewall firewall_ip, username and password.")

        self.firewall_ip = firewall_ip
        self.api_url = 'https://{}/api/'.format(firewall_ip)

        self.username = username
        self.password = password

        self.auth_header = {
            'Authorization': 'Basic {}'.format(base64.b64encode("{}:{}".format(username, password).encode()).decode()),
        }
    
    def get_api_key(self):
        params = {
            'type': 'keygen',
            'user': self.username,
            'password': self.password,
        }

        response = requests.post(self.api_url, params=params)
        #TODO: Add response code


    def block_ip(self, ip_address):
        item = register_entry.format(ip_address=ip_address, persistent="1", timeout="0", tag=tag)
        payload = register_data.format(entries=item)
        encoded_payload = urllib.parse.urlencode({"cmd": payload})

        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        }.update(self.auth_header)

        response = requests.post(
            self.api_url, 
            headers=headers,
            data=encoded_payload)
        #TODO: Add response code


    def allow_ip(self, ip_address):
        item = unregister_entry.format(ip_address=ip_address, tag=tag)
        payload = unregister_data.format(entries=item)
        encoded_payload = urllib.parse.urlencode({"cmd": payload})

        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        }.update(self.auth_header)

        response = requests.post(
            self.api_url, 
            headers=headers,
            data=encoded_payload)
        #TODO: Add response code


# Other TODO: Delete


params = {
    "type": "config",
    "action": "get",
    "xpath": "/config/devices/entry[@name='localhost.localdomain']/network/interface/ethernet",
}
#TODO: response = requests.get('https://{}/api/'.format(firewall_ip), params=params)

# Basic Auth using username and password
#TODO: DELETE: DOC: https://docs.paloaltonetworks.com/pan-os/9-0/pan-os-panorama-api/get-started-with-the-pan-os-xml-api/authenticate-your-api-requests

# OR API KEY
params = {
    'type': 'user-id',
    'key': '<your_api_key>',
}
