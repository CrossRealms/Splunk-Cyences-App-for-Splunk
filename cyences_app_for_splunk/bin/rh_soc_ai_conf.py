import json
import splunk.admin as admin
from splunk import rest
import cs_utils

CONF_FILE = "cs_configurations"
SOC_AI_STANZA = "soc_ai"


class SOCAIConfRestcall(admin.MConfigHandler):
    """
    Set up supported arguments
    """

    # Static variables
    def setup(self):
        """
        Sets the input arguments
        :return:
        """

        # Set up the valid parameters
        for arg in ["data"]:
            self.supportedArgs.addOptArg(arg)

    def handleList(self, conf_info):
        # Get SOC AI API Configuration
        try:
            _, serverContent = rest.simpleRequest(
                "/servicesNS/nobody/{}/configs/conf-{}?output_mode=json".format(
                    cs_utils.APP_NAME, CONF_FILE
                ),
                sessionKey=self.getSessionKey(),
            )
            data = json.loads(serverContent)["entry"]
            username = ""
            password = "******"
            for i in data:
                if i["name"] == "soc_ai":
                    username = i["content"]["username"]
                    break
            conf_info["action"]["username"] = username
            conf_info["action"]["password"] = password
        except Exception as e:
            conf_info["action"]["error"] = (
                "Unable to fetch the Username. Might be no existing Username present. {}".format(
                    e
                )
            )

    def handleEdit(self, conf_info):
        # Update the SOC AI configuration
        try:
            data = json.loads(self.callerArgs["data"][0])
            username = str(data["username"])
            password = str(data["password"])
        except Exception as e:
            conf_info["action"]["error"] = (
                "Data is not in proper format. {} - {}".format(
                    e, self.callerArgs["data"]
                )
            )
            return

        try:
            # Store Username
            rest.simpleRequest(
                "/servicesNS/nobody/{}/configs/conf-{}/{}?output_mode=json".format(
                    cs_utils.APP_NAME, CONF_FILE, SOC_AI_STANZA
                ),
                postargs={"username": username},
                method="POST",
                sessionKey=self.getSessionKey(),
            )

            # Store Password
            cs_utils.CredentialManager(self.getSessionKey()).store_credential(
                username, password
            )

            conf_info["action"]["success"] = "Username and Password is stored successfully."

        except Exception as e:
            conf_info["action"]["error"] = (
                "No success or error message returned. {}".format(e)
            )


if __name__ == "__main__":
    admin.init(SOCAIConfRestcall, admin.CONTEXT_APP_AND_USER)
