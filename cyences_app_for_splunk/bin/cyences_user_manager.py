#!/usr/bin/env python

import sys
import time
import copy

from splunklib.searchcommands import dispatch, EventingCommand, Configuration, Option, validators
from user_inventory_util import UserManager, UserEntry

import cs_utils
import logging
import logger_manager

logger = logger_manager.setup_logging("user_inventory", logging.INFO)

CY_USER_POSTFIXES_MACRO = "cs_user_inventory_user_postfixes"
CY_USER_PREFIXES_MACRO = "cs_user_inventory_user_prefixes"
USER_INVENTORY_LOOKUP_COLLECTION = "cs_user_inventory_collection"

MONTH_IN_SECOND = 60 * 60 * 24 * 30.5
YEAR_IN_SECOND = MONTH_IN_SECOND * 12
MAX_TIME_EPOCH = 2147483647  # Tue Jan 19 2038 03:14:07


@Configuration()
class CyencesUserManagerCommand(EventingCommand):
    operation = Option(name="operation", require=False, default="getusers")
    products_to_cleanup = Option(name="products_to_cleanup", require=False, default="*")
    cleanup_minindextime = Option(name="minindextime", require=False, default=None, validate=validators.Float())  # default past 1 years
    cleanup_maxindextime = Option(name="maxindextime", require=False, default=None, validate=validators.Float())  # default forseeable future
    target_user = Option(name="target_user", require=False, default="")
    users_to_merge = Option(name="users_to_merge", require=False, default=None)
    user_uuids = Option(name="user_uuids", require=False, default=None)
    is_privileged_user = Option(name="is_privileged_user", require=False, default="")

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
        if self.operation not in ["getusers", "addentries", "cleanup", "merge", "manualmerge", "privilegeuser"]:
            raise Exception("operation - allowed values: getusers, addentries, cleanup, merge, manualmerge, privilegeuser")

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
            self.users_to_merge = self.validate_param_value_and_type(self.users_to_merge)

        elif self.operation == "privilegeuser":
            self.user_uuids = self.validate_param_value_and_type(self.user_uuids)

    def transform(self, records):
        self.validate_inputs()

        session_key = cs_utils.GetSessionKey(logger).from_custom_command(self)

        if self.operation == "getusers":
            with UserManager(session_key, logger, USER_INVENTORY_LOOKUP_COLLECTION) as dm:
                _users = dm.get_user_details()
                for user in _users:
                    yield user

        elif self.operation == "addentries":
            conf_manger = cs_utils.ConfigHandler(logger, session_key)
            user_prefixes = conf_manger.get_macro(CY_USER_PREFIXES_MACRO)
            user_postfixes = conf_manger.get_macro(CY_USER_POSTFIXES_MACRO)
            with UserManager(session_key, logger, USER_INVENTORY_LOOKUP_COLLECTION, user_prefixes, user_postfixes) as dm:
                for record in records:
                    other_fields = copy.deepcopy(record)
                    del other_fields["indextime"]
                    del other_fields["vendor_product"]
                    del other_fields["user_type"]
                    del other_fields["index"]
                    del other_fields["sourcetype"]
                    del other_fields["user"]
                    entry = UserEntry(record["vendor_product"], record["indextime"], record["user"], record["index"], record["sourcetype"], record["user_type"], other_fields)
                    user_id = dm.add_user_entry(entry)
                    record["user_id"] = user_id
                    yield record

        elif self.operation == "cleanup":
            with UserManager(session_key, logger, USER_INVENTORY_LOOKUP_COLLECTION) as dm:
                messages = dm.cleanup_users(self.cleanup_minindextime, self.cleanup_maxindextime, self.products_to_cleanup)
                for m in messages:
                    yield {"message": m}

        elif self.operation == "merge":
            conf_manger = cs_utils.ConfigHandler(logger, session_key)
            user_prefixes = conf_manger.get_macro(CY_USER_PREFIXES_MACRO)
            user_postfixes = conf_manger.get_macro(CY_USER_POSTFIXES_MACRO)
            with UserManager(session_key, logger, USER_INVENTORY_LOOKUP_COLLECTION, user_prefixes, user_postfixes) as dm:
                messages = dm.reorganize_user_list()
                for m in messages:
                    yield {"message": m}

        elif self.operation == "manualmerge":
            conf_manger = cs_utils.ConfigHandler(logger, session_key)
            user_prefixes = conf_manger.get_macro(CY_USER_PREFIXES_MACRO)
            user_postfixes = conf_manger.get_macro(CY_USER_POSTFIXES_MACRO)
            with UserManager(session_key, logger, USER_INVENTORY_LOOKUP_COLLECTION, user_prefixes, user_postfixes) as dm:
                messages = dm.manually_merge_users(self.target_user, *self.users_to_merge)
                for m in messages:
                    yield {"message": m}

        elif self.operation == "privilegeuser":
            with UserManager(session_key, logger, USER_INVENTORY_LOOKUP_COLLECTION) as dm:
                messages = dm.privilege_the_users(self.is_privileged_user, *self.user_uuids)
                for m in messages:
                    yield {"message": m}


dispatch(CyencesUserManagerCommand, sys.argv, sys.stdin, sys.stdout, __name__)
