#!/usr/bin/env python
import cs_imports
import sys
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


API_ENDPOINT = "https://10.47.3.210:10000/v1/ipinfo/"
CONF_FILE = "cs_configurations"


@Configuration()
class CyencesIPInfoCommand(EventingCommand):

    fieldname = Option(name="fieldname", require=True, default=None)

    def get_api_info(self):
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
        response = requests.get(
            API_ENDPOINT + str(ip_address),
            auth=(username, password),
            timeout=cs_utils.CYENCES_NETWORK_CALL_TIMEOUT,
        )
        return response.json()["data"]

    def transform(self, records):
        self.session_key = cs_utils.GetSessionKey(logger).from_custom_command(self)
        # Read API ID and API Key
        username, password = self.get_api_info()

        for record in records:
            ip_address = record.get(self.fieldname)
            if ip_address:
                ipinfo = self.get_ip_info(ip_address, username, password)
                record.update(ipinfo)
            yield record


dispatch(CyencesIPInfoCommand, sys.argv, sys.stdin, sys.stdout, __name__)
