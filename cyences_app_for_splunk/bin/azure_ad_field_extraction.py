#!/usr/bin/env python

import json
import logging
import sys

import logger_manager
from splunklib.searchcommands import Configuration, Option, StreamingCommand, dispatch

logger = logger_manager.setup_logging("azure_ad_field_extraction", logging.INFO)
# Field names to ignore while comparing two dictionaries
KEY_TO_IGNORE = ["modifiedDateTime"]


class DeepDiff:
    def __init__(self, dict1, dict2, key_to_ignore, logger):
        self.key_to_ignore = key_to_ignore
        self.logger = logger
        self.dict1 = {}
        self.generate_single_level_dict(dict1, self.dict1)
        self.logger.info("Generated single level dict1 = {}".format(self.dict1))
        self.dict2 = {}
        self.generate_single_level_dict(dict2, self.dict2)
        self.logger.info("Generated single level dict2 = {}".format(self.dict2))
        self.final_dict = {}
        self.dict_diff()
        self.logger.info("Difference between dicts = {}".format(self.final_dict))

    def generate_single_level_dict(self, nested_dict, single_level_dict, prefix=""):
        for key, value in nested_dict.items():
            if type(value) is dict:
                prefix += key + "_"
                self.generate_single_level_dict(value, single_level_dict, prefix=prefix)
            else:
                if type(value) is list:
                    for _ in range(len(value)):
                        value[_] = str(value[_])
                    value.sort()
                single_level_dict[prefix + key] = value

    def dict_diff(self):
        for key in self.dict1:
            if key in self.key_to_ignore:
                continue
            if self.dict2.get(key) != self.dict1.get(key):
                self.final_dict[key] = [self.dict1.get(key), self.dict2.get(key)]

        for key in self.dict2:
            if (key in self.key_to_ignore) or (key in self.dict1):
                continue
            if self.dict2.get(key) != self.dict1.get(key):
                self.final_dict[key] = [self.dict1.get(key), self.dict2.get(key)]


@Configuration()
class AzureAdFieldExtractionCommand(StreamingCommand):
    old_value_field = Option(name="old_value_field", require=True)
    new_value_field = Option(name="new_value_field", require=True)
    property_name_field = Option(name="property_name_field", require=True)
    field_to_update = Option(name="field_to_update", require=True)

    def stream(self, records):
        try:
            for record in records:
                try:
                    # Find the difference
                    diff = DeepDiff(
                        json.loads(record[self.old_value_field]),
                        json.loads(record[self.new_value_field]),
                        KEY_TO_IGNORE,
                        logger,
                    )

                    new_value = ""

                    for key in diff.final_dict:
                        new_value += (
                            str(key)
                            + ":: "
                            + str(diff.final_dict[key][0])
                            + " ==> "
                            + str(diff.final_dict[key][1])
                            + "\n"
                            + "-------------------------------------------------"
                            + "\n"
                        )

                    record[self.field_to_update] = new_value[:-50]
                    yield record
                except Exception:
                    # If field is not in json format
                    new_value = ""
                    property_names = record[self.property_name_field]
                    old_values = record[self.old_value_field]
                    new_values = record[self.new_value_field]

                    # If field is multivalued
                    if type(property_names) is list:
                        for i in range(len(property_names)):
                            new_value += (
                                str(property_names[i])
                                + ":: "
                                + str(old_values[i])
                                + " ==> "
                                + str(new_values[i])
                                + "\n"
                                + "-------------------------------------------------"
                                + "\n"
                            )

                        new_value = new_value[:-50]
                    # If field is str and not empty
                    elif property_names:
                        new_value = (
                            str(property_names)
                            + ":: "
                            + str(old_values)
                            + " ==> "
                            + str(new_values)
                        )
                    else:
                        new_value = "-"

                    record[self.field_to_update] = new_value
                    yield record
        except Exception as e:
            logger.exception("Error in azure_ad_field_extraction command: {}".format(e))
            raise e


dispatch(AzureAdFieldExtractionCommand, sys.argv, sys.stdin, sys.stdout, __name__)
