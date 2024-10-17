#!/usr/bin/env python
import cs_imports
import sys
import os
import requests
import json
from base64 import b64encode

from splunklib.searchcommands import (
    dispatch,
    EventingCommand,
    Configuration,
    Option,
    validators,
)
from splunk import rest

import cs_utils
import logging
import logger_manager

logger = logger_manager.setup_logging("ipinfo", logging.INFO)


API_ENDPOINT = "https://blacklist.crossrealms.com:10000/v1/ipinfo/"
CONF_FILE = "cs_configurations"


@Configuration()
class BlockShieldIPInfoCommand(EventingCommand):

    fieldname = Option(name="fieldname", require=True, default=None)

    def get_blockshield_creds(self):
        logger.info("Getting BlockShield API Info.")
        _, serverContent = rest.simpleRequest(
            "/servicesNS/nobody/{}/configs/conf-{}?output_mode=json".format(
                cs_utils.APP_NAME, CONF_FILE
            ),
            sessionKey=self.session_key,
        )
        data = json.loads(serverContent)["entry"]
        username = ""
        password = ""
        for i in data:
            if i["name"] == "blockshield":
                username = i["content"]["username"]
                password = cs_utils.CredentialManager(self.session_key).get_credential(
                    username
                )
                break
        logger.info("Got BlockShield API info.")
        return username, password

    def get_ip_info(self, ip_address, username, password):
        ipinfo = {}
        response = requests.get(
            API_ENDPOINT + str(ip_address),
            auth=(username, password),
            timeout=cs_utils.CYENCES_NETWORK_CALL_TIMEOUT,
            verify=os.path.join(os.path.dirname(__file__), "blockshield_ca_cert.pem")
        )

        response.raise_for_status()
        response = response.json()

        ipinfo["isTor"] = response.get("abuseipdb", {}).get("info", {}).get("isTor")
        ipinfo["whois"] = (
            response.get("virustotal", {})
            .get("data", {})
            .get("attributes", {})
            .get("whois")
        )
        ipinfo["country"] = (
            response.get("virustotal", {})
            .get("data", {})
            .get("attributes", {})
            .get("country")
        )
        ipinfo["reputation"] = (
            response.get("virustotal", {})
            .get("data", {})
            .get("attributes", {})
            .get("reputation")
        )
        ipinfo["malicious"] = (
            response.get("virustotal", {})
            .get("data", {})
            .get("attributes", {})
            .get("last_analysis_stats", {})
            .get("malicious")
        )
        ipinfo["suspicious"] = (
            response.get("virustotal", {})
            .get("data", {})
            .get("attributes", {})
            .get("last_analysis_stats", {})
            .get("suspicious")
        )
        ipinfo["undetected"] = (
            response.get("virustotal", {})
            .get("data", {})
            .get("attributes", {})
            .get("last_analysis_stats", {})
            .get("undetected")
        )
        ipinfo["harmless"] = (
            response.get("virustotal", {})
            .get("data", {})
            .get("attributes", {})
            .get("last_analysis_stats", {})
            .get("harmless")
        )
        ipinfo["timeout"] = (
            response.get("virustotal", {})
            .get("data", {})
            .get("attributes", {})
            .get("last_analysis_stats", {})
            .get("timeout")
        )
        ipinfo["isblocked"] = 1 if response.get("isblocked") == "true" else 0
        return ipinfo

    def transform(self, records):
        self.session_key = cs_utils.GetSessionKey(logger).from_custom_command(self)
        # Read Username and Password
        try:
            username, password = self.get_blockshield_creds()
        except Exception as e:
            logger.error("Error while retriving username and password of blockshield. error={}".format(e))
            self.write_error("Error while retriving username and password of blockshield. Please configure it properly to Cyences Settings > Cyences App Configuration > BlockShield API Configuration page.")
        else:
            for record in records:
                ip_address = record.get(self.fieldname)
                if ip_address:
                    ipinfo = self.get_ip_info(ip_address, username, password)
                    record.update(ipinfo)
                yield record


dispatch(BlockShieldIPInfoCommand, sys.argv, sys.stdin, sys.stdout, __name__)
