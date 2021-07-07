#!/usr/bin/env python

import os
import sys
import csv
import uuid
import time

from splunklib.searchcommands import dispatch, EventingCommand, Configuration, Option
from splunklib.searchcommands.validators import Boolean


import logger_manager
logger = logger_manager.setup_logging('device_inventory_command')


def get_lookup_path(lookup_name):
    return os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 
                                        os.path.join('lookups', lookup_name))

DEVICE_INVENTORY_LOOKUP = get_lookup_path('cs_device_inventory_lookup.csv')
DEVICE_INVENTORY_LOOKUP_HEADERS = ['uuid', 'time', 'ip', 'hostname', 'mac_address', 'tenable_uuid', 'qualys_id', 'lansweeper_id', 'sophos_uuid', 'crowdstrike_userid', 'windows_defender_host']
DEVICE_INVENTORY_LOOKUP_HEADERS_KEY_INDEX = {'uuid':0, 'time':1, 'ip':2, 'hostname':3, 'mac_address':4, 'tenable_uuid':5, 'qualys_id':6, 'lansweeper_id':7, 'sophos_uuid':8, 'crowdstrike_userid':9, 'windows_defender_host':10}
LOOKUP_KEY_UUID = 0
LOOKUP_KEY_TIME = 1
LOOKUP_KEY_IP = 2
LOOKUP_KEY_HOSTNAME = 3
LOOKUP_KEY_MAC_ADDRESS = 4


@Configuration()
class DeviceInventoryGenCommand(EventingCommand):

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
    

    def check_timestamp(self, event_time):
        if float(event_time) >= self.current_time_delta and float(event_time) <= self.current_time:
            return True
        return False

    
    def get_pointer_in_data(self, field, value, time=None):
        logger.info("Finding field:{}, value:{}".format(field, value))
        field_index = DEVICE_INVENTORY_LOOKUP_HEADERS_KEY_INDEX[field]
        if field in ['hostname', 'mac_address']:
            for i in self.device_inventory:
                lookup_values = i[field_index].split(',')
                if value in lookup_values:
                    logger.info("Found lookup entry:{}".format(i))
                    return i
        elif field == 'ip':
            for i in self.device_inventory:
                lookup_values = i[field_index].split(',')
                if value in lookup_values:
                    if self.check_timestamp(time):
                        logger.info("Found lookup entry:{}".format(i))
                        return i
        else:
            for i in self.device_inventory:
                if value==i[field_index]:
                    logger.info("Found lookup entry:{}".format(i))
                    return i
        logger.info("Lookup entry not found.")


    def append_value_in_multivalued_csv_field(self, current, new_values):
        logger.info("Handling multi-valued field: current:{}, new_values:{}".format(current, new_values))
        new_val = current.split(',')
        new_val.extend(new_values)
        new_val = ','.join(set(new_val))
        logger.info("Handling multi-valued field: updated: {}".format(new_val))
        return new_val
    

    def update_lookup_row(self, record, data_pointer, ips, hostnames, mac_addresses, product_uuid=None):
        if product_uuid:
            field_index = DEVICE_INVENTORY_LOOKUP_HEADERS_KEY_INDEX[product_uuid]
            data_pointer[field_index] = record[product_uuid]
            # TODO - if data_pointer[field_index] is already present that means there is conflicting mac_address, etc

        data_pointer[LOOKUP_KEY_HOSTNAME] = self.append_value_in_multivalued_csv_field(data_pointer[LOOKUP_KEY_HOSTNAME], hostnames)
        data_pointer[LOOKUP_KEY_MAC_ADDRESS] = self.append_value_in_multivalued_csv_field(data_pointer[LOOKUP_KEY_MAC_ADDRESS], mac_addresses)

        if self.check_timestamp(data_pointer[LOOKUP_KEY_TIME]):
            # append ips
            data_pointer[LOOKUP_KEY_IP] = self.append_value_in_multivalued_csv_field(data_pointer[LOOKUP_KEY_IP], ips)
        else:
            # update ips
            data_pointer[LOOKUP_KEY_IP] = ','.join(set(ips))


    def handle_record(self, record, product_uuid):
        # TODO - always generate hostname, mac_address fields from search queries (generate empty string instead to avoid errors)
        logger.info("handle_record: product_uuid: {}, record: {}".format(product_uuid, record))

        ips = list(set(record['ip'].split(",")))
        if len(ips)==1 and ips[0] == '':
            ips = []

        hostnames = list(set(record['hostname'].split(",")))
        if len(hostnames)==1 and hostnames[0] == '':
            hostnames = []

        mac_addresses = list(set(record['mac_address'].split(",")))
        if len(mac_addresses)==1 and mac_addresses[0] == '':
            mac_addresses = []

        data_pointer = self.get_pointer_in_data(field=product_uuid, value=record[product_uuid])
        if data_pointer:
            logger.info("product_uuid found in the lookup")
            self.update_lookup_row(record, data_pointer, ips, hostnames, mac_addresses)
            return

        logger.info("product_uuid not found in the lookup")
        for host in hostnames:
            data_pointer = self.get_pointer_in_data(field='hostname', value=host)
            break
        if data_pointer:
            logger.info("hostname found in the lookup")
            self.update_lookup_row(record, data_pointer, ips, hostnames, mac_addresses, product_uuid)
            return

        logger.info("hostname not found in the lookup")
        for mac in mac_addresses:
            data_pointer = self.get_pointer_in_data(field='mac_address', value=mac)
            break
        if data_pointer:
            logger.info("mac_address found in the lookup")
            self.update_lookup_row(record, data_pointer, ips, hostnames, mac_addresses, product_uuid)
            return

        logger.info("mac_address not found in the lookup")
        for ip in ips:
            data_pointer = self.get_pointer_in_data(field='ip', value=ip, time=record['time'])
            break
        if data_pointer:
            logger.info("ip found in the lookup")
            self.update_lookup_row(record, data_pointer, ips, hostnames, mac_addresses, product_uuid)
            return

        logger.info("ip not found in the lookup (in last 30 minutes timespan")
        return record


    def transform(self, records):
        self.device_inventory = None
        self.current_time = time.time()
        self.current_time_delta = self.current_time - 60*60
        # TODO - Need to delta based on timerange of savedsearch execution (here last 60 minutes)

        for record in records:
            if not self.device_inventory:
                self.device_inventory = self.read_csv_lookup(DEVICE_INVENTORY_LOOKUP, DEVICE_INVENTORY_LOOKUP_HEADERS)

            ret = None
            if 'tenable_uuid' in record and record['tenable_uuid']:
                ret = self.handle_record(record, product_uuid='tenable_uuid')
            elif 'qualys_id' in record and record['qualys_id']:
                ret = self.handle_record(record, product_uuid='tenable_uuid')
            elif 'lansweeper_id' in record and record['lansweeper_id']:
                ret = self.handle_record(record, product_uuid='lansweeper_id')
            elif 'sophos_uuid' in record and record['sophos_uuid']:
                ret = self.handle_record(record, product_uuid='sophos_uuid')
            elif 'crowdstrike_userid' in record and record['crowdstrike_userid']:
                ret = self.handle_record(record, product_uuid='crowdstrike_userid')
            elif 'windows_defender_host' in record and record['windows_defender_host']:
                ret = self.handle_record(record, product_uuid='windows_defender_host')

            logger.info("ret: {}".format(ret))

            if ret:
                # ret is dict, convert to list in proper order and prepend with new uuid
                while True:
                    new_uuid = str(uuid.uuid4())
                    exist = self.get_pointer_in_data('uuid', new_uuid)
                    if not exist:
                        new_device = [new_uuid, ret['time'], ret['ip'], ret['hostname'], ret['mac_address'], 
                                    ret['tenable_uuid'], ret['qualys_id'], ret['lansweeper_id'], ret['sophos_uuid'], ret['crowdstrike_userid'], ret['windows_defender_host']]
                        self.device_inventory.append(new_device)
                        break
                yield ret
            
            logger.info("")
            logger.info("")
            
        # Write lookup at the end
        if self.device_inventory:
            self.update_csv_lookup(DEVICE_INVENTORY_LOOKUP, self.device_inventory)


dispatch(DeviceInventoryGenCommand, sys.argv, sys.stdin, sys.stdout, __name__)

# TODO - manually provide way to remove hostname, mac_address for any item in the list

