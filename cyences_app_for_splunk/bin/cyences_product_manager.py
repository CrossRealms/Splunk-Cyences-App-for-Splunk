#!/usr/bin/env python

import sys

from splunklib.searchcommands import (
    dispatch,
    GeneratingCommand,
    Configuration,
    Option,
)
from cs_product_list import PRODUCTS

import copy
import logging
import logger_manager

logger = logger_manager.setup_logging("cyences_product_manager", logging.INFO)


@Configuration()
class CyencesProductManager(GeneratingCommand):
    operation = Option(name="operation", require=True, default="getproducts")
    product_name = Option(name="product_name", require=False, default="")

    def validate_inputs(self):
        if self.operation not in ["getproducts", "buildproductspecificsearches"]:
            raise Exception(
                "operation - allowed values: getproducts, buildproductspecificsearches"
            )

    def generate(self):
        self.validate_inputs()

        try:
            all_products = copy.deepcopy(PRODUCTS)

            # list down the product names to use in data reviewer dashboard filter
            if self.operation == "getproducts":
                for product in all_products:
                    yield {"products": product["name"]}
            # create product specific searches used in data reviewer dashboard
            elif self.operation == "buildproductspecificsearches":
                host_reviewer_search = ""
                sources_reviewer_search = ""
                metadata_count_search = "| tstats count where index=* "
                for product in all_products:
                    if product["name"].lower() == self.product_name.lower():
                        for index in range(len(product["macro_configurations"])):
                            if index > 0:
                                host_reviewer_search += " | append ["
                                metadata_count_search += " OR "
                                sources_reviewer_search += " | append ["

                            host_reviewer_search += product["macro_configurations"][index].get("host_reviewer_search")

                            if product["macro_configurations"][index].get("metadata_count_search"):
                                metadata_count_search = product["macro_configurations"][index].get("metadata_count_search")
                            else:
                                metadata_count_search += "{by} IN ({values})".format(by=product["macro_configurations"][index].get("search_by"), values=product["macro_configurations"][index].get("search_values"))

                            sources_reviewer_search += product["macro_configurations"][index].get("sources_reviewer_search")

                            if index > 0:
                                host_reviewer_search += "]"
                                sources_reviewer_search += "]"
                        break

                yield {
                    "host_reviewer_search": host_reviewer_search,
                    "metadata_count_search": metadata_count_search,
                    "sources_reviewer_search": sources_reviewer_search,
                }

        except Exception as e:
            logger.exception(
                "Unexpected error while running the cyencesproductmanager command: {}".format(
                    e
                )
            )
            raise e


dispatch(CyencesProductManager, sys.argv, sys.stdin, sys.stdout, __name__)
