#!/usr/bin/env python

import sys
import time
from collections import namedtuple

from splunklib.searchcommands import dispatch, EventingCommand, Configuration, Option, validators
from device_inventory_v2_util import DeviceManager, DeviceEntry


import logging
import logger_manager
logger = logger_manager.setup_logging('device_manager_v2', logging.INFO)

IS_DEBUGGING_MODE = False


MONTH_IN_SECOND = 60*60*24*30.5
YEAR_IN_SECOND = MONTH_IN_SECOND*12
MAX_TIME_EPOCH = 2147483647   # Tue Jan 19 2038 03:14:07



@Configuration()
class CyencesDeviceManagerCommand(EventingCommand):

    operation = Option(name="operation", require=False, default="getdevices")
    hostname_postfix = Option(name="hostname_postfix", require=True)
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

        if self.operation == "getdevices":
            with DeviceManager(self.hostname_postfix) as dm:
                _devices = dm.get_device_details()
                for device in _devices:
                    yield device

        if self.operation == "addentries":
            with DeviceManager(self.hostname_postfix) as dm:
                for record in records:
                    entry = DeviceEntry(record['product_name'], record['time'], record['product_uuid'], record['ips'], record['mac_addresses'], record['hostnames'])
                    device_id = dm.add_device_entry(entry)
                    record["device_id"] = device_id
                    yield record

        if self.operation == "cleanup":
            with DeviceManager(self.hostname_postfix) as dm:
                messages = dm.cleanup_devices(self.cleanup_mintime, self.cleanup_ip_maxtime)
                for m in messages:
                    yield {"message": m}

        if self.operation == "merge":
            with DeviceManager(self.hostname_postfix) as dm:
                messages = dm.reorganize_device_list()
                for m in messages:
                    yield {"message": m}



dispatch(CyencesDeviceManagerCommand, sys.argv, sys.stdin, sys.stdout, __name__)
