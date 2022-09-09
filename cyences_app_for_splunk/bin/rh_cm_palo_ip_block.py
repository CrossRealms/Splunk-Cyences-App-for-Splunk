import json
import splunk.admin as admin
from palo_firewall_api_utils import PaloFirewallAPIUtils


import logging
import logger_manager
logger = logger_manager.setup_logging('rh_cm_palo_ip_block', logging.DEBUG)


class CounterMeasurePaloIPBlockRest(admin.MConfigHandler):
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

        try:
            data = json.loads(self.callerArgs['data'][0])
            logger.debug("data: {}".format(data))
            ip_address = str(data['ip_address'])
            action = str(data['action'])
            username = str(data['username'])
            password = str(data['password'])
            firewall_ip = str(data['firewall_ip'])
        except Exception as e:
            msg = 'Data is not in proper format. Error:{}'.format(e)
            logger.error(msg)
            conf_info['action']['error'] = msg
            return

        try:
            palo_api = PaloFirewallAPIUtils(logger, self.getSessionKey(), firewall_ip, username, password)

            if action == 'block':
                logger.debug("Performing action={} for {} ip address".format(action, ip_address))
                conf_info['action']['success'] = palo_api.block_ip(ip_address)
            elif action == 'allow':
                logger.debug("Performing action={} for {} ip address".format(action, ip_address))
                conf_info['action']['success'] = palo_api.allow_ip(ip_address)
            else:
                msg = "Action={} is not allowed.".format(action)
                logger.error(msg)
                conf_info['action']['error'] = msg

        except Exception as e:
            err_msg = "Error Occurred while performing action={} for {} ip address - Error: {}".format(action, ip_address, e)
            logger.exception(err_msg)
            conf_info['action']['error'] = err_msg


if __name__ == "__main__":
    admin.init(CounterMeasurePaloIPBlockRest, admin.CONTEXT_APP_AND_USER)
