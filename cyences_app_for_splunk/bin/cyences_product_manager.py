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
import re
import logging
import logger_manager

logger = logger_manager.setup_logging("cyences_product_manager", logging.INFO)


@Configuration()
class CreateProductSpecificSearch(GeneratingCommand):
    operation = Option(name="operation", require=True, default="getproducts")
    product_name = Option(name="product_name", require=False, default="")

    def validate_inputs(self):
        if self.operation not in ["getproducts", "buildproductspecificsearches"]:
            raise Exception(
                "operation - allowed values: getproducts, buildproductspecificsearches"
            )

    def get_sources_and_values(self, text):
        regex_pattern = r'\|\seval\s([^\=]*)\=split\("([^"]*)",\s","\)'
        match = re.search(regex_pattern, text)

        if match:
            source_field = match.group(1)
            values = match.group(2)

        return source_field, values

    def build_source_reviewer_search(self, source_field, values, invocation_no):
        search = ""
        values = values.split(",")

        for index in range(len(values)):
            if invocation_no > 0 or index > 0:
                search += " | append ["
            search += """| tstats values(host) as hosts where index=* {source_field} IN ({value}) by {source_field} index
            | stats count values(*) as * dc(hosts) as host_count by {source_field}
            | stats count values(*) as *
            | eval {source_field}=if(count>0,{source_field},"{value}")
            | rename {source_field} as sources""".format(
                source_field=source_field, value=values[index]
            )
            if invocation_no > 0 or index > 0:
                search += "]"
        return search

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

                # handled the special senario for the windows product
                if self.product_name.lower() == "windows":
                    host_reviewer_search = '| tstats count where `cs_windows_idx` by source sourcetype host | eval sources = source." (".sourcetype.")" | table sources host count'
                    sources_reviewer_search = """| tstats values(host) as hosts where `cs_windows_idx` by source sourcetype index | eval sources = source." (".sourcetype.")" | stats count values(index) as index dc(hosts) as host_count by sources | eval sources=if(count>0,sources,"`cs_windows_idx`") | append [
                    | tstats values(host) as hosts where index=* sourcetype="*WinEventLog" source="*WinEventLog:Security" by source sourcetype index | eval sources = source." (".sourcetype.")" | stats count values(index) as index dc(hosts) as host_count by sources | stats count values(*) as * | eval sources=if(count>0,sources,"WinEventLog:Security (WinEventLog)")] | append [
                    | tstats values(host) as hosts where index=* sourcetype="*WinEventLog" source="*WinEventLog:System" by source sourcetype index | eval sources = source." (".sourcetype.")" | stats count values(index) as index dc(hosts) as host_count by sources | stats count values(*) as * | eval sources=if(count>0,sources,"WinEventLog:System (WinEventLog)")] | append [
                    | tstats values(host) as hosts where index=* source="powershell*" sourcetype="MSAD:*:Health" by source sourcetype index | eval sources = source." (".sourcetype.")" | stats count values(index) as index dc(hosts) as host_count by sources | stats count values(*) as * | eval sources=if(count>0,sources,"powershell (MSAD:*:Health)")] | append [
                    | tstats values(host) as hosts where index=* sourcetype="ActiveDirectory" by sourcetype index | stats count values(index) as index dc(hosts) as host_count by sourcetype | stats count values(*) as * | eval sourcetype=if(count>0,sourcetype,"ActiveDirectory")  | rename sourcetype as sources]"""
                    metadata_count_search = "| tstats count where `cs_windows_idx` OR (index=* sourcetype IN (*WinEventLog,MSAD:*:Health,ActiveDirectory) OR source IN (*WinEventLog:Security,*WinEventLog:System,powershell*))"

                # handled the special senario for the vpn related products
                elif self.product_name.lower() == "vpn":
                    metadata_count_search = (
                        '`cs_vpn_indexes` dest_category="vpn_auth" | stats count '
                    )
                    host_reviewer_search = '`cs_vpn_indexes` dest_category="vpn_auth" | stats count by sourcetype host | rename sourcetype as sources'
                    sources_reviewer_search = '`cs_vpn_indexes` dest_category="vpn_auth" | stats dc(host) as host_count values(index) as index by sourcetype | rename sourcetype as sources'

                # for rest of the products having common search template
                else:
                    for product in all_products:
                        if product["name"].lower() == self.product_name.lower():
                            for index in range(len(product["macro_configurations"])):
                                source_field, values = self.get_sources_and_values(
                                    product["macro_configurations"][index]["search"]
                                )
                                if index > 0:
                                    host_reviewer_search += " | append ["
                                    metadata_count_search += " OR "
                                host_reviewer_search += "| tstats count where index=* {source_field} IN ({values}) by {source_field} host | rename {source_field} as sources".format(
                                    source_field=source_field, values=values
                                )
                                metadata_count_search += (
                                    "{source_field} IN ({values})".format(
                                        source_field=source_field, values=values
                                    )
                                )
                                sources_reviewer_search += (
                                    self.build_source_reviewer_search(
                                        source_field, values, index
                                    )
                                )
                                if index > 0:
                                    host_reviewer_search += "]"
                            break

                yield {
                    "host_reviewer_search": host_reviewer_search,
                    "metadata_count_search": metadata_count_search,
                    "sources_reviewer_search": sources_reviewer_search,
                }

        except Exception as e:
            logger.exception(
                "Unexpected error while running the createproductspecificsearch command: {}".format(
                    e
                )
            )
            raise e


dispatch(CreateProductSpecificSearch, sys.argv, sys.stdin, sys.stdout, __name__)
