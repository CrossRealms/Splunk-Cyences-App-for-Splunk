
import sys

from splunklib.searchcommands import dispatch, GeneratingCommand, Configuration, Option, validators

import logging
import logger_manager
logger = logger_manager.setup_logging('sophos_details_command', logging.DEBUG)

from sophos_endpoint_api_utils import SophosAPIUtils


@Configuration()
class SophosEndpointDetails(GeneratingCommand):

    ip               = Option(name="ip",require=False, default="")
    hostname         = Option(name="hostname",require=False,default="")
    uuid             = Option(name="uuid",require=False,default="")
    all_endpoints    = Option(name="all_endpoints",require=False,default=False)


    def generate(self):
        try:
            sophos_utils = SophosAPIUtils(logger, self.search_results_info.auth_token)

            ip = self.ip
            hostname = self.hostname
            uuid = self.uuid
            all_endpoints = self.all_endpoints
            if(ip=="" and hostname=="" and uuid=="" and ip==" " and hostname==" " and uuid==" " and all_endpoints==False):
                raise Exception("Please provide IP or Hostname or UUID")

            if(all_endpoints):
                for item in sophos_utils.get_all_endpoint_details():
                    yield {"_raw": item}

            else:
                for instance in sophos_utils.get_instance_details(ip, hostname, uuid):
                    yield {"_raw": instance}

        except Exception as e:
            logger.exception("Error Occurred while fetching instance details. Error: {}".format(e))
            self.write_warning("Error Occurred while fetching instance details. Go to Inspect Job and check search logs")


dispatch(SophosEndpointDetails, sys.argv, sys.stdin, sys.stdout, __name__)
