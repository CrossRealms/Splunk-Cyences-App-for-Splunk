#!/usr/bin/env python

import json
import logging
import sys

import logger_manager
from splunklib.searchcommands import Configuration, Option, StreamingCommand, dispatch

logger = logger_manager.setup_logging(
    "azure_ad_modified_properties_formatter", logging.INFO
)
# json key to ignore while comparing two dictionaries
KEYS_TO_IGNORE = ["modifiedDateTime"]
# Field name of the property to ignore
PROPERTIES_TO_IGNORE = ["Included Updated Properties"]


class DeepDiff:
    def __init__(self, dict1, dict2, keys_to_ignore, logger):
        self.keys_to_ignore = keys_to_ignore
        self.logger = logger
        self.dict1 = {}
        self.generate_single_level_dict(dict1, self.dict1)
        self.logger.info("Generated single level dict1 = {}".format(self.dict1))
        self.dict2 = {}
        self.generate_single_level_dict(dict2, self.dict2)
        self.logger.info("Generated single level dict2 = {}".format(self.dict2))
        self.final_dict = {}
        self.find_dict_diff()
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

    def find_dict_diff(self):
        for key in self.dict1:
            if key in self.keys_to_ignore:
                continue
            if self.dict2.get(key) != self.dict1.get(key):
                self.final_dict[key] = [self.dict1.get(key), self.dict2.get(key)]

        for key in self.dict2:
            if (key in self.keys_to_ignore) or (key in self.dict1):
                continue
            if self.dict2.get(key) != self.dict1.get(key):
                self.final_dict[key] = [self.dict1.get(key), self.dict2.get(key)]


@Configuration()
class AzureAdModifiedPropertiesFormatterCommand(StreamingCommand):
    old_value_field = Option(name="old_value_field", require=True)
    new_value_field = Option(name="new_value_field", require=True)
    property_name_field = Option(name="property_name_field", require=True)
    field_to_update = Option(name="field_to_update", require=True)
    additional_fields = Option(
        name="additional_fields", require=False, default=None
    )  # list of comma seperated fields, for that add old and new values to the output of the command

    @staticmethod
    def validate_param_value_and_type(field_value):
        if field_value is None:
            field_value = []
        elif type(field_value) is str:
            field_value = [
                element.strip().strip("'\"")
                for element in field_value.strip("'\"()").split(",")
                if element.strip()
            ]
        elif type(field_value) is list:
            for element in field_value:
                element.strip().strip("'\"")
        else:
            raise Exception("{} value is not as expected.".format(field_value))
        return field_value

    def stream(self, records):
        try:
            self.additional_fields = self.validate_param_value_and_type(
                self.additional_fields
            )

            for record in records:
                try:
                    affected_properties = []
                    # Find the difference
                    diff = DeepDiff(
                        json.loads(record[self.old_value_field]),
                        json.loads(record[self.new_value_field]),
                        KEYS_TO_IGNORE,
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
                        affected_properties.append(str(key))

                    for field in self.additional_fields:
                        record["old_" + field] = diff.dict1.get(field)
                        record["new_" + field] = diff.dict2.get(field)

                    record[self.field_to_update] = new_value[:-50]
                    record["affected_properties"] = affected_properties
                    yield record
                except Exception:
                    # If field is not in json format
                    new_value = ""
                    affected_properties = []
                    property_names = record[self.property_name_field]
                    old_values = record[self.old_value_field]
                    new_values = record[self.new_value_field]

                    # If field is multivalued
                    if type(property_names) is list:
                        for i in range(len(property_names)):
                            if (property_names[i] in PROPERTIES_TO_IGNORE) or (
                                property_names[i] == "TargetId.UserType"
                                and old_values[i] == "null"
                                and new_values[i] == '"Member"'
                            ):
                                continue
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

                            affected_properties.append(str(property_names[i]))

                            if str(property_names[i]) in self.additional_fields:
                                record["old_" + str(property_names[i])] = str(
                                    old_values[i]
                                )
                                record["new_" + str(property_names[i])] = str(
                                    new_values[i]
                                )

                        new_value = new_value[:-50]
                    # If field is Included Updated Properties then ideally there will not be any field updated so it will be empty string
                    elif (property_names in PROPERTIES_TO_IGNORE) or (
                        property_names == "TargetId.UserType"
                        and old_values == "null"
                        and new_values == '"Member"'
                    ):
                        pass
                    # If field is str and not empty
                    elif property_names:
                        new_value = (
                            str(property_names)
                            + ":: "
                            + str(old_values)
                            + " ==> "
                            + str(new_values)
                        )

                        affected_properties.append(str(property_names))

                        if str(property_names) in self.additional_fields:
                            record["old_" + str(property_names)] = str(old_values)
                            record["new_" + str(property_names)] = str(new_values)

                    record[self.field_to_update] = new_value
                    record["affected_properties"] = affected_properties
                    yield record
        except Exception as e:
            logger.exception(
                "Error in azureadmodifiedpropertiesformatter command: {}".format(e)
            )
            raise e


dispatch(
    AzureAdModifiedPropertiesFormatterCommand, sys.argv, sys.stdin, sys.stdout, __name__
)
