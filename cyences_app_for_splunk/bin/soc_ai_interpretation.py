#!/usr/bin/env python
import cs_imports
import sys
import os
import requests
import json

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

logger = logger_manager.setup_logging("soc_ai_interpretation", logging.INFO)


API_ENDPOINT = "https://soc-ai-solution-webapp.azurewebsites.net/api/interpret"
CONF_FILE = "cs_configurations"


@Configuration()
class SOCAIInterpretationCommand(EventingCommand):

    fieldname = Option(name="fieldname", require=True, default=None)

    def get_soc_ai_api_creds(self):
        logger.info("Getting SOC AI API Info.")
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
            if i["name"] == "soc_ai":
                username = i["content"]["username"]
                password = cs_utils.CredentialManager(self.session_key).get_credential(
                    username
                )
                break
        logger.info("Got SOC AI API info.")
        return username, password

    def get_ai_interpretation(self, api_body, username, password):
        data = {}
        response = requests.post(
            API_ENDPOINT,
            auth=(username, password),
            json=api_body,
            headers={"Content-Type": "application/json"},
            timeout=cs_utils.CYENCES_NETWORK_CALL_TIMEOUT,
        )

        response.raise_for_status()
        response = response.json()

        data["Interpretation"] = response.get("interpretation")
        return data

    def transform(self, records):
        self.session_key = cs_utils.GetSessionKey(logger).from_custom_command(self)
        # Read Username and Password
        try:
            username, password = self.get_soc_ai_api_creds()
        except Exception as e:
            logger.error("Error while retriving username and password of SOC AI API. error={}".format(e))
            self.write_error("Error while retriving username and password of SOC AI API. Please configure it properly to Cyences Settings > Cyences App Configuration > SOC AI API Configuration page.")
        else:
            for record in records:
                api_body = record.get(self.fieldname)
                api_body = json.loads(api_body)
                if api_body:
                    interpretation = self.get_ai_interpretation(api_body, username, password)
                    record.update(interpretation)
                yield record


dispatch(SOCAIInterpretationCommand, sys.argv, sys.stdin, sys.stdout, __name__)
