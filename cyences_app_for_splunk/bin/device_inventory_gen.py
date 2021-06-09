#!/usr/bin/env python

import os
import sys
import csv
import uuid

from splunklib.searchcommands import dispatch, EventingCommand, Configuration, Option
from splunklib.searchcommands.validators import Boolean


import logger_manager
logger = logger_manager.setup_logging('device_inventory_command')


def get_lookup_path(lookup_name):
    return os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                                        os.path.join('lookups', lookup_name))

DEVICE_INVENTORY_LOOKUP = get_lookup_path('cs_device_inventory_lookup.csv')
DEVICE_INVENTORY_LOOKUP_HEADERS = ['uuid', 'ip', 'hostname', 'mac_address', 'tenable_uuid', 'qualys_id', 'lansweeper_id', 'sophos_uuid', 'crowdstrike_userid', 'windows_defender_host']
DEVICE_INVENTORY_LOOKUP_HEADERS_KEY_INDEX = {'uuid':0, 'ip':1, 'hostname':2, 'mac_address':3, 'tenable_uuid':4, 'qualys_id':5, 'lansweeper_id':6, 'sophos_uuid':7, 'crowdstrike_userid':8, 'windows_defender_host':9}
LOOKUP_KEY_IP = 1
LOOKUP_KEY_HOSTNAME = 2
LOOKUP_KEY_MAC_ADDRESS = 3

TIME_IP_LOOKUP = get_lookup_path('cs_time_ip_lookup.csv')
TIME_IP_LOOKUP_HEADERS = ['time', 'ip', 'hostname', 'mac_address', 'tenable_uuid', 'qualys_id', 'lansweeper_id', 'sophos_uuid', 'crowdstrike_userid', 'windows_defender_host']


@Configuration()
class DeviceMasterTableGenCommand(EventingCommand):

    isstage2 = Option(name="isstage2", require=False, validate=Boolean(), default=False)

    '''
    Reference for KVstore - https://dev.splunk.com/enterprise/docs/developapps/manageknowledge/kvstore/usetherestapitomanagekv/
    '''
    
    def read_csv_lookup(self, lookup_file, csv_file_headers):
        logger.info("Reading lookup file: {}".format(lookup_file))
        try:
            f = open(lookup_file, 'r')
            csv_reader = list(csv.reader(f))
            if len(csv_reader) < 1:
                raise Exception("No headers in the csv file.")
        except:
            csv_reader = [csv_file_headers]
        logger.info("Lookup: {}, has been read with {} entries.".format(lookup_file, len(csv_reader)))
        return csv_reader
    

    def update_csv_lookup(self, lookup_file, data):
        logger.info("Updating lookup file: {}".format(lookup_file))
        with open(lookup_file, 'w') as f:
            csv_writer = csv.writer(f)
            csv_writer.writerows(data)
        logger.info("Lookup: {}, has been updated with {} entries.".format(lookup_file, len(data)))

    
    def get_pointer_in_data(self, field, value):
        logger.info("Finding field:{}, value:{}".format(field, value))
        field_index = DEVICE_INVENTORY_LOOKUP_HEADERS_KEY_INDEX[field]
        if field in ['ip', 'hostname', 'mac_address']:
            for i in self.device_inventory:
                lookup_values = i[field_index].split(',')
                if value in lookup_values:
                    logger.info("Found lookup entry:{}".format(i))
                    return i
        else:
            for i in self.device_inventory:
                if value==i[field_index]:
                    logger.info("Found lookup entry:{}".format(i))
                    return i
        logger.info("Lookup entry not found.")


    def append_value_in_multivalued_csv_field(self, current, new_values):
        new_val = ','.join(
            list(set(
                    current.split(',').extend(new_values.split(','))
                ))
            )
        logger.info("Handling multi-valued field: current:{}, new_values:{}, updated: {}".format(current, new_values, new_val))
        return new_val
    

    def _handle_hostmac_record(self, record, hostnames, mac_addresses):
        data_pointer = None

        for host in hostnames:
            data_pointer = self.get_pointer_in_data(field='hostname', value=host)
            break
        if data_pointer:
            logger.info("hostname found in the lookup")
            # if tenable_uuid is also present:
            #    - that means there is conflicting hostname (TODO)
            # append hostname, append mac_address
            data_pointer[LOOKUP_KEY_HOSTNAME] = self.append_value_in_multivalued_csv_field(data_pointer[LOOKUP_KEY_HOSTNAME], hostnames)
            data_pointer[LOOKUP_KEY_MAC_ADDRESS] = self.append_value_in_multivalued_csv_field(data_pointer[LOOKUP_KEY_MAC_ADDRESS], mac_addresses)
        else:
            logger.info("hostname not found in the lookup")
            for mac in mac_addresses:
                data_pointer = self.get_pointer_in_data(field='mac_address', value=mac)
                break
            if data_pointer:
                logger.info("mac_address found in the lookup")
                # append hostname, append mac_address
                data_pointer[LOOKUP_KEY_HOSTNAME] = self.append_value_in_multivalued_csv_field(data_pointer[LOOKUP_KEY_HOSTNAME], hostnames)
                data_pointer[LOOKUP_KEY_MAC_ADDRESS] = self.append_value_in_multivalued_csv_field(data_pointer[LOOKUP_KEY_MAC_ADDRESS], mac_addresses)
                # - if tenable_uuid is also present:
                # - that means there is conflicting mac_address (TODO)
                pass
            else:
                logger.info("mac_address not found in the lookup")
                # for stage-1 -> yield result for Stage-2 for IP
                # for stage-2 -> add new id in the lookup
                return record


    def handle_record(self, record, product_uuid=None):
        # TODO - always generate hostname, mac_address fields from search queries (generate empty string instead to avoid errors)
        logger.info("handle_record: product_uuid: {}, record: {}".format(product_uuid, record))

        hostnames = list(set(record['hostname'].split(",")))
        mac_addresses = list(set(record['mac_address'].split(",")))

        if product_uuid and product_uuid in record:
            data_pointer = self.get_pointer_in_data(field=product_uuid, value=record[product_uuid])
            if data_pointer:
                logger.info("product_uuid found in the lookup")
                # append hostname, append mac_address
                data_pointer[LOOKUP_KEY_HOSTNAME] = self.append_value_in_multivalued_csv_field(data_pointer[LOOKUP_KEY_HOSTNAME], hostnames)
                data_pointer[LOOKUP_KEY_MAC_ADDRESS] = self.append_value_in_multivalued_csv_field(data_pointer[LOOKUP_KEY_MAC_ADDRESS], mac_addresses)
            else:
                logger.info("product_uuid not found in the lookup")
                return self._handle_hostmac_record(record, hostnames, mac_addresses)
        else:
            return self._handle_hostmac_record(record, hostnames, mac_addresses)
    

    def transform(self, records):
        self.device_inventory = None

        if not self.isstage2:
            logger.info("Stage-1:")
            # Stage-1
            for record in records:
                if not self.device_inventory:
                    self.device_inventory = self.read_csv_lookup(DEVICE_INVENTORY_LOOKUP, DEVICE_INVENTORY_LOOKUP_HEADERS)

                if 'tenable_uuid' in record:
                    ret = self.handle_record(record, product_uuid='tenable_uuid')
                    if ret:
                        yield ret
                elif 'qualys_id' in record:
                    ret = self.handle_record(record, product_uuid='tenable_uuid')
                    if ret:
                        yield ret
                elif 'sophos_uuid' in record:
                    ret = self.handle_record(record, product_uuid='sophos_uuid')
                    if ret:
                        yield ret

        else:
            logger.info("Stage-2")
            # Stage-2 update lookup after combinging IP addresses
            for record in records:
                if not self.device_inventory:
                    self.device_inventory = self.read_csv_lookup(DEVICE_INVENTORY_LOOKUP, DEVICE_INVENTORY_LOOKUP_HEADERS)

                # ip, hostname, mac_address, tenable_uuid, qualys_id, etc
                ret = self.handle_record(record)
                if ret:
                    # ret is dict, convert to list in proper order and prepend with new uuid
                    while True:
                        new_uuid = str(uuid.uuid4())
                        exist = self.get_pointer_in_data('uuid', new_uuid)
                        if not exist:
                            new_device = [new_uuid, ret['ip'], ret['hostname'], ret['mac_address'], 
                                        ret['tenable_uuid'], ret['qualys_id'], ret['lansweeper_id'], ret['sophos_uuid'], ret['crowdstrike_userid'], ret['windows_defender_host']]
                            self.device_inventory.append(new_device)
                            break
            
        # Write lookup at the end
        if self.device_inventory:
            self.update_csv_lookup(DEVICE_INVENTORY_LOOKUP, self.device_inventory)

            if not os.path.isfile(TIME_IP_LOOKUP):
                headers = [TIME_IP_LOOKUP_HEADERS]
                self.update_csv_lookup(TIME_IP_LOOKUP, headers)



dispatch(DeviceMasterTableGenCommand, sys.argv, sys.stdin, sys.stdout, __name__)


# TODO - use fqdns as it-is as multi-valued field with hostname and coalesce
# TODO - manually provide way to remove hostname, mac_address for any item in the list

