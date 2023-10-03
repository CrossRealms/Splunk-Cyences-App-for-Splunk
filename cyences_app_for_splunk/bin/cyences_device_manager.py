#!/usr/bin/env python

import sys
import time
import copy

from splunklib.searchcommands import dispatch, EventingCommand, Configuration, Option, validators
from device_inventory_util import DeviceManager, DeviceEntry

import cs_utils
import logging
import logger_manager

logger = logger_manager.setup_logging("device_inventory", logging.INFO)

CY_HOSTNAME_POSTFIXES_MACRO = "cs_device_inventory_hostname_postfixes"
DEVICE_INVENTORY_LOOKUP_COLLECTION = "cs_device_inventory_collection_v2"

MONTH_IN_SECOND = 60 * 60 * 24 * 30.5
YEAR_IN_SECOND = MONTH_IN_SECOND * 12
MAX_TIME_EPOCH = 2147483647  # Tue Jan 19 2038 03:14:07


@Configuration()
class CyencesDeviceManagerCommand(EventingCommand):
    operation = Option(name="operation", require=False, default="getdevices")
    products_to_cleanup = Option(name="products_to_cleanup", require=False, default="*")
    cleanup_minindextime = Option(name="minindextime", require=False, default=None, validate=validators.Float())  # default past 1 years
    cleanup_maxindextime = Option(name="maxindextime", require=False, default=None, validate=validators.Float())  # default forseeable future
    target_device = Option(name="target_device", require=False, default="")
    devices_to_merge = Option(name="devices_to_merge", require=False, default=None)

    @staticmethod
    def validate_param_value_and_type(command_options):
        if command_options == "*":
            command_options = None
        elif command_options is None:
            command_options = []
        elif type(command_options) == str:
            command_options = [
                element.strip().strip('\'"')
                for element in command_options.strip('\'"()').split(",")
                if element.strip()
            ]
        elif type(command_options) == list:
            for element in command_options:
                element.strip().strip('\'"')
        else:
            raise Exception("{} value is not as expected.".format(command_options))
        return command_options

    def validate_inputs(self):
        if self.operation not in ["getdevices", "addentries", "cleanup", "merge", "manualmerge"]:
            raise Exception("operation - allowed values: getdevices, addentries, cleanup, merge, manualmerge")

        if self.operation == "cleanup":
            timenow = time.time()

            if self.cleanup_minindextime is None:
                self.cleanup_minindextime = timenow - YEAR_IN_SECOND
            if self.cleanup_maxindextime is None:
                self.cleanup_maxindextime = MAX_TIME_EPOCH

            if self.cleanup_minindextime >= self.cleanup_maxindextime:
                raise Exception("minindextime should be less than maxindextime.")

            self.products_to_cleanup = self.validate_param_value_and_type(self.products_to_cleanup)

        elif self.operation == "manualmerge":
            self.devices_to_merge = self.validate_param_value_and_type(self.devices_to_merge)

    def transform(self, records):
        self.validate_inputs()

        session_key = cs_utils.GetSessionKey(logger).from_custom_command(self)

        if self.operation == "getdevices":
            with DeviceManager(session_key, logger, DEVICE_INVENTORY_LOOKUP_COLLECTION) as dm:
                _devices = dm.get_device_details()
                for device in _devices:
                    yield device

        elif self.operation == "addentries":
            conf_manger = cs_utils.ConfigHandler(logger, session_key)
            hostname_postfixes = conf_manger.get_macro(CY_HOSTNAME_POSTFIXES_MACRO)
            with DeviceManager(session_key, logger, DEVICE_INVENTORY_LOOKUP_COLLECTION, hostname_postfixes) as dm:
                for record in records:
                    other_fields = copy.deepcopy(record)
                    del other_fields["indextime"]
                    del other_fields["time"]
                    del other_fields["product_name"]
                    del other_fields["product_uuid"]
                    del other_fields["ip"]
                    del other_fields["mac_address"]
                    del other_fields["hostname"]
                    del other_fields["user"]
                    entry = DeviceEntry(record["product_name"], record["time"], record["indextime"], record["product_uuid"], record["ip"], record["mac_address"], record["hostname"], record["user"], other_fields)
                    device_id = dm.add_device_entry(entry)
                    record["device_id"] = device_id
                    yield record

        elif self.operation == "cleanup":
            with DeviceManager(session_key, logger, DEVICE_INVENTORY_LOOKUP_COLLECTION) as dm:
                messages = dm.cleanup_devices(self.cleanup_minindextime, self.cleanup_maxindextime, self.products_to_cleanup)
                for m in messages:
                    yield {"message": m}

        elif self.operation == "merge":
            conf_manger = cs_utils.ConfigHandler(logger, session_key)
            hostname_postfixes = conf_manger.get_macro(CY_HOSTNAME_POSTFIXES_MACRO)
            with DeviceManager(session_key, logger, DEVICE_INVENTORY_LOOKUP_COLLECTION, hostname_postfixes) as dm:
                messages = dm.reorganize_device_list()
                for m in messages:
                    yield {"message": m}

        elif self.operation == "manualmerge":
            conf_manger = cs_utils.ConfigHandler(logger, session_key)
            hostname_postfixes = conf_manger.get_macro(CY_HOSTNAME_POSTFIXES_MACRO)
            with DeviceManager(session_key, logger, DEVICE_INVENTORY_LOOKUP_COLLECTION, hostname_postfixes) as dm:
                messages = dm.manually_merge_devices(self.target_device, *self.devices_to_merge)
                for m in messages:
                    yield {"message": m}


dispatch(CyencesDeviceManagerCommand, sys.argv, sys.stdin, sys.stdout, __name__)
