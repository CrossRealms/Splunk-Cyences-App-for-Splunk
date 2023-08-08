#!/usr/bin/env python

import sys
import time
import copy

from splunklib.searchcommands import dispatch, EventingCommand, Configuration, Option, validators
from device_inventory_v2_util import DeviceManager, DeviceEntry

import cs_utils
import logging
import logger_manager
logger = logger_manager.setup_logging('device_manager_v2', logging.INFO)

IS_DEBUGGING_MODE = False
CY_HOSTNAME_POSTFIXES_MACRO = "cs_device_inventory_hostname_postfixes"

MONTH_IN_SECOND = 60*60*24*30.5
YEAR_IN_SECOND = MONTH_IN_SECOND*12
MAX_TIME_EPOCH = 2147483647   # Tue Jan 19 2038 03:14:07



@Configuration()
class CyencesDeviceManagerCommand(EventingCommand):

    operation = Option(name="operation", require=False, default="getdevices")

    # hostname_postfixes = Option(name="hostname_postfixes", require=True)   # You can put comma separated values like, ".ad.crossrealms.com, .crossrealms.com"
    # Always put large string early if shorter string is subset of large string.
    # for example, ".ad.crossrealms.com" should be before ".crossrealms.com"
    # I prefer to also put ".local" at the end as well to ensure proper hostname matching

    products_to_cleanup = Option(name="products_to_cleanup", require=False, default="*")
    cleanup_mintime = Option(name="mintime", require=False, default=None, validate=validators.Float())   # default past 1 years
    cleanup_maxtime = Option(name="maxtime", require=False, default=None, validate=validators.Float())   # default forseeable future
    # cleanup_ip_mintime = Option(name="ipmintime", require=False, default=None, validate=validators.Float())   # default past 30 days
    # cleanup_ip_maxtime = Option(name="ipmaxtime", require=False, default=None, validate=validators.Float())   # default forseeable future

    def validate_inputs(self):
        if self.operation not in ["getdevices", "addentries", "cleanup", "merge"]:
            raise Exception("operation - allowed values: getdevices, addentries, cleanup")

        if self.operation == "cleanup":
            timenow = time.time()

            if self.cleanup_mintime == None:
                self.cleanup_mintime = timenow - YEAR_IN_SECOND
            if self.cleanup_maxtime == None:
                self.cleanup_maxtime = MAX_TIME_EPOCH
            
            if self.cleanup_mintime >= self.cleanup_maxtime:
                raise Exception("mintime should be less than maxtime.")

            # if self.cleanup_ip_mintime == None:
            #     self.cleanup_ip_mintime = timenow - MONTH_IN_SECOND
            # if self.cleanup_ip_maxtime == None:
            #     self.cleanup_ip_maxtime = MAX_TIME_EPOCH
            
            # if self.cleanup_ip_mintime >= self.cleanup_ip_maxtime:
            #     raise Exception("ipmintime should be less than ipmaxtime.")


    def transform(self, records):
        self.validate_inputs()

        session_key = cs_utils.GetSessionKey(logger).from_custom_command(self)
        conf_manger = cs_utils.ConfigHandler(logger, session_key)
        hostname_postfixes = conf_manger.get_macro(CY_HOSTNAME_POSTFIXES_MACRO).strip('\"').split(",")

        if self.operation == "getdevices":
            with DeviceManager(session_key, logger, self.operation, hostname_postfixes) as dm:
                _devices = dm.get_device_details()
                for device in _devices:
                    yield device

        elif self.operation == "addentries":
            with DeviceManager(session_key, logger, self.operation, hostname_postfixes) as dm:
                for record in records:
                    other_fields = copy.deepcopy(record)
                    del other_fields['time']
                    del other_fields['product_name']
                    del other_fields['product_uuid']
                    del other_fields['ip']
                    del other_fields['mac_address']
                    del other_fields['hostname']
                    entry = DeviceEntry(record['product_name'], record['time'], record['product_uuid'], record['ip'], record['mac_address'], record['hostname'], other_fields)
                    device_id = dm.add_device_entry(entry)
                    record["device_id"] = device_id
                    yield record

        elif self.operation == "cleanup":
            with DeviceManager(session_key, logger, self.operation, hostname_postfixes) as dm:
                messages = dm.cleanup_devices(self.cleanup_mintime, self.cleanup_maxtime, self.products_to_cleanup)
                for m in messages:
                    yield {"message": m}

        elif self.operation == "merge":
            with DeviceManager(session_key, logger, self.operation, hostname_postfixes) as dm:
                messages = dm.reorganize_device_list()
                for m in messages:
                    yield {"message": m}



dispatch(CyencesDeviceManagerCommand, sys.argv, sys.stdin, sys.stdout, __name__)
