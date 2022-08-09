import json
import splunk.admin as admin
from sophos_endpoint_api_utils import SophosAPIUtils


import logging
import logger_manager
logger = logger_manager.setup_logging('cm_sophos_endpoint', logging.DEBUG)


class CounterMeasureSophosEndpointRest(admin.MConfigHandler):
    '''
    Set up supported arguments
    '''

    # Static variables
    def setup(self):
        """
        Sets the input arguments
        :return:
        """
        # Set up the valid parameters
        for arg in ['data']:
            self.supportedArgs.addOptArg(arg)


    def handleList(self, conf_info):
        conf_info['action']['error'] = 'GET method is not allowed.'
        return


    def handleEdit(self, conf_info):
        logger.info("started rest endpoint.")
        # Update the Sophos configuration
        try:
            logger.debug("callerArgs: {}".format(self.callerArgs))
            data = json.loads(self.callerArgs['data'][0])
            logger.debug("data: {}".format(data))
            endpoint_uuid = str(data['endpoint_uuid'])
            action = str(data['action'])
            client_id = str(data['client_id'])
            client_secret = str(data['client_secret'])
        except Exception as e:
            msg = 'Data is not in proper format. Error:{}, callerArgs:{}'.format(e, self.callerArgs)
            logger.error(msg)
            conf_info['action']['error'] = msg
            return

        try:
            sophos_utils = SophosAPIUtils(logger, self.getSessionKey(), client_id=client_id, client_secret=client_secret)
            logger.debug("Created session token for Sophos Endpoint API call.")

            if action == 'Isolate':
                logger.debug("Isolating the endpoint.")
                conf_info['action']['success'] = sophos_utils.isolate_endpoint(endpoint_uuid, 'Endpoint isolated from Splunk.')   # TODO - Add comment as parameter in the UI
            elif action == 'Deisolate':
                logger.debug("Deisolating the endpoint.")
                conf_info['action']['success'] = sophos_utils.deisolate_endpoint(endpoint_uuid, 'Endpoint deisolated from Splunk.')
            else:
                msg = "Action={} is not allowed.".format(action)
                logger.error(msg)
                conf_info['action']['error'] = msg

        except Exception as e:
            logger.exception("Error Occurred while isolating the instance UUID={} - Error: {}".format(endpoint_uuid, e))
            conf_info['action']['error'] = "Error Occurred while isolating the instance UUID={} - Error: {}".format(endpoint_uuid, e)


if __name__ == "__main__":
    admin.init(CounterMeasureSophosEndpointRest, admin.CONTEXT_APP_AND_USER)
