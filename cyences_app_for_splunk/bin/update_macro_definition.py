import os
import sys
import json

from splunklib.searchcommands import dispatch, GeneratingCommand, Configuration, Option
from splunk import rest


@Configuration()
class UpdateMacroDefinition(GeneratingCommand):

    macro_name = Option(name="macro_name", require=True)
    macro_definition = Option(name="macro_definition", require=True)
 
    def generate(self):
        self.logger.debug("Updating macro definition.")

        sessionKey = self.search_results_info.auth_token
        data = {
            "definition": self.macro_definition
        }
        rest.simpleRequest("/servicesNS/nobody/cyences_app_for_splunk/configs/conf-macros/{}?output_mode=json".format(self.macro_name),
                                    method="POST", sessionKey=sessionKey, postargs=data, raiseAllErrors=True)
        yield {"msg": "Macro has been updated."}

 
dispatch(UpdateMacroDefinition, sys.argv, sys.stdin, sys.stdout, __name__)
