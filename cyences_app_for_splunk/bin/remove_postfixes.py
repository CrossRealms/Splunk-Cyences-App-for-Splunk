#!/usr/bin/env python

import sys

from splunklib.searchcommands import dispatch, EventingCommand, Configuration, Option

import cs_utils
import logging
import logger_manager

logger = logger_manager.setup_logging("remove_postfixes", logging.INFO)



@Configuration()
class RemovePostfixesCommand(EventingCommand):

    postfix_macro_name = Option(name="postfix_macro_name", require=True, default=None)
    field_to_check = Option(name="field_to_check", require=True, default=None)

    def transform(self, records):

        session_key = cs_utils.GetSessionKey(logger).from_custom_command(self)
        conf_manger = cs_utils.ConfigHandler(logger, session_key)
        postfixes_list = conf_manger.get_macro(self.postfix_macro_name)

        postfixes_list = [element.strip() for element in postfixes_list.strip('"').split(",") if element.strip()]

        for record in records:
            field_value = record[self.field_to_check].lower()
            for postfix in postfixes_list:
                if field_value.endswith(postfix.lower()):
                    record[self.field_to_check] = field_value[: -len(postfix)]
                    break
            yield record


dispatch(RemovePostfixesCommand, sys.argv, sys.stdin, sys.stdout, __name__)
