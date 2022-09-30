import base64
import urllib.parse
import requests
from defusedxml.ElementTree import fromstring

CYENCES_TAG = "cyences_blocked_ips"

REGISTER_ENTRY = """
<entry ip="{ip_address}" persistent="{persistent}">
    <tag>
        <member timeout="{timeout}">{tag}</member>
    </tag>
</entry>
"""

REGISTER_DATA = """
<uid-message>
    <type>update</type>
    <payload>
        <register>
            {entries}
        </register>
    </payload>
</uid-message>
"""

UNREGISTER_ENTRY = """
<entry ip="{ip_address}">
    <tag>
        <member>{tag}</member>
    </tag>
</entry>
"""

UNREGISTER_DATA = """
<uid-message>
    <type>update</type>
    <payload>
        <unregister>
            {entries}
        </unregister>
    </payload>
</uid-message>"""


class PaloFirewallAPIUtils:
    def __init__(
        self, logger, session_key, firewall_ip, username, password, verify=True
    ):
        self.logger = logger
        self.session_key = session_key

        if not username or not password:
            raise Exception(
                "Please provide Palo Alto Firewall firewall_ip, username and password."
            )

        self.firewall_ip = firewall_ip
        self.api_url = "https://{}/api/".format(firewall_ip)

        self.username = username
        self.password = password
        self.verify = verify

        self.common_header = {
            "Authorization": "Basic {}".format(
                base64.b64encode("{}:{}".format(username, password).encode()).decode()
            ),
            "Content-Type": "application/x-www-form-urlencoded",
        }

    def parse_response(self, response):
        self.logger.debug(
            "API status_code:{}, Response: {}".format(
                response.status_code, response.text
            )
        )
        root = fromstring(response.text)

        if response.status_code == 200:

            status = root.get("status", "").lower()
            if status == "success":
                return "Operation Successfully Completed"

            elif status == "error":
                errors = []
                for child in root.iter("entry"):
                    errors.append(str(child.attrib))
                error_msg = "Error: {}".format("\n".join(errors))
                raise Exception(error_msg)

        elif response.status_code == 403:
            error_msg = "Error: {}".format(list(root.iter("msg"))[0].text)
            raise Exception(error_msg)

        else:
            raise Exception("Unexpected error: {}".format(response.text))

    def register_ips(self, ip_addresses):
        items = []
        for ip in ip_addresses:
            item = REGISTER_ENTRY.format(
                ip_address=ip, persistent="1", timeout="0", tag=CYENCES_TAG
            )
            items.append(item)
        payload = REGISTER_DATA.format(entries="\n".join(items))

        encoded_payload = urllib.parse.urlencode({"cmd": payload})

        self.logger.info("Registering {}".format(ip_addresses))

        response = requests.post(
            self.api_url,
            params={"type": "user-id"},
            verify=self.verify,
            headers=self.common_header,
            data=encoded_payload,
        )

        return self.parse_response(response)

    def unregister_ips(self, ip_addresses):
        items = []
        for ip in ip_addresses:
            item = UNREGISTER_ENTRY.format(ip_address=ip, tag=CYENCES_TAG)
            items.append(item)
        payload = UNREGISTER_DATA.format(entries="\n".join(items))

        encoded_payload = urllib.parse.urlencode({"cmd": payload})

        self.logger.info("Unregistering {}".format(ip_addresses))

        response = requests.post(
            self.api_url,
            params={"type": "user-id"},
            verify=self.verify,
            headers=self.common_header,
            data=encoded_payload,
        )

        return self.parse_response(response)
    
    def get_registered_ips(self):
        params = {
            "type": "op",
            "cmd": "<show><object><registered-ip><tag><entry name='{}'/></tag></registered-ip></object></show>".format(CYENCES_TAG)
        }

        self.logger.info("Getting registered ip")

        response = requests.get(
            self.api_url,
            params=params,
            verify=self.verify,
            headers=self.common_header,
        )

        self.logger.debug(
            "API status_code:{}, Response: {}".format(
                response.status_code, response.text
            )
        )
        root = fromstring(response.text)

        if response.status_code == 200:

            status = root.get("status", "").lower()

            if status == "success":
                ips = []
                for child in root.iter("entry"):
                    ips.append(child.attrib)
                return ips
            
            else:
                raise Exception("Failed to get registered ip")

        elif response.status_code == 403:
            error_msg = "Error: {}".format(list(root.iter("msg"))[0].text)
            raise Exception(error_msg)

        else:
            raise Exception("Unexpected error: {}".format(response.text))


