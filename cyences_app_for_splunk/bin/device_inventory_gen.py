#!/usr/bin/env python

import os
import sys
import csv
import uuid
import time
import json
from datetime import datetime

from splunklib.searchcommands import dispatch, EventingCommand, Configuration, Option
from splunklib.searchcommands.validators import Validator
from splunk import rest
import cs_utils


import logging
import logger_manager
logger = logger_manager.setup_logging('cyences_device_inventory_command', logging.DEBUG)


LOOKUP_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'lookups')

def get_lookup_path(lookup_name):
    return os.path.join(LOOKUP_DIR, lookup_name)


DEVICE_INVENTORY_LOOKUP = get_lookup_path('cs_device_inventory_lookup.csv')
DEVICE_INVENTORY_LOOKUP_COLLECTION = 'cs_device_inventory_collection'
DEVICE_INVENTORY_LOOKUP_HEADERS = ['uuid', 'time', 'ip', 'hostname', 'mac_address', 'tenable_uuid', 'qualys_id', 'lansweeper_id', 'sophos_uuid', 'crowdstrike_userid', 'windows_defender_host']
# DEVICE_INVENTORY_LOOKUP_HEADERS_KEY_INDEX = {'uuid':0, 'time':1, 'ip':2, 'hostname':3, 'mac_address':4, 'tenable_uuid':5, 'qualys_id':6, 'lansweeper_id':7, 'sophos_uuid':8, 'crowdstrike_userid':9, 'windows_defender_host':10}
# LOOKUP_KEY_UUID = 0
# LOOKUP_KEY_TIME = 1
# LOOKUP_KEY_IP = 2
# LOOKUP_KEY_HOSTNAME = 3
# LOOKUP_KEY_MAC_ADDRESS = 4
DEVICE_INVENTORY_LOOKUP_HEADERS_KEY_INDEX = {'uuid':'uuid', 'time':'time', 'ip':'ip', 'hostname':'hostname', 'mac_address':'mac_address', 'tenable_uuid':'tenable_uuid', 'qualys_id':'qualys_id', 'lansweeper_id':'lansweeper_id', 'sophos_uuid':'sophos_uuid', 'crowdstrike_userid':'crowdstrike_userid', 'windows_defender_host':'windows_defender_host'}
LOOKUP_KEY_UUID = 'uuid'
LOOKUP_KEY_TIME = 'time'
LOOKUP_KEY_IP = 'ip'
LOOKUP_KEY_HOSTNAME = 'hostname'
LOOKUP_KEY_MAC_ADDRESS = 'mac_address'

DEVICE_INVENTORY_LOOKUP_BACKUP_PREFIX = 'backup_device_inventory'



import six
from json.encoder import encode_basestring_ascii as json_encode_string

class Float(Validator):
    """ Validates float option values.

    """
    def __init__(self, minimum=None, maximum=None):
        if minimum is not None and maximum is not None:
            def check_range(value):
                if not (minimum <= value <= maximum):
                    raise ValueError('Expected float in the range [{0},{1}], not {2}'.format(minimum, maximum, value))
                return
        elif minimum is not None:
            def check_range(value):
                if value < minimum:
                    raise ValueError('Expected float in the range [{0},+∞], not {1}'.format(minimum, value))
                return
        elif maximum is not None:
            def check_range(value):
                if value > maximum:
                    raise ValueError('Expected float in the range [-∞,{0}], not {1}'.format(maximum, value))
                return
        else:
            def check_range(value):
                return

        self.check_range = check_range
        return

    def __call__(self, value):
        if value is None:
            return None
        try:
            value = float(value)
        except ValueError:
            raise ValueError('Expected float value, not {}'.format(json_encode_string(value)))

        self.check_range(value)
        return value

    def format(self, value):
        return None if value is None else six.text_type(float(value))


@Configuration()
class DeviceInventoryGenCommand(EventingCommand):

    '''
    Reference for KVstore - https://dev.splunk.com/enterprise/docs/developapps/manageknowledge/kvstore/usetherestapitomanagekv/
    '''

    ipmatchstarttime = Option(name="ipmatchstarttime", require=False, validate=Float(), default=time.time())
    ipmatchtimediff = Option(name="ipmatchmaxtime", require=False, validate=Float(), default=3600.0)
    # NOTE - Above shows at what timerange command should match IPs to combine devices


    def read_kvstore_lookup(self, collection_name):
        _, serverContent = rest.simpleRequest(
            "/servicesNS/nobody/{}/storage/collections/data/{}?output_mode=json".format(cs_utils.APP_NAME, collection_name), 
            method='GET', sessionKey=self.search_results_info.auth_token, raiseAllErrors=True)
        lookup_data = json.loads(serverContent)
        return lookup_data


    def update_kvstore_lookup(self, collection_name, updated_data):
        if updated_data:
            jsonargs=json.dumps(updated_data)
            _ = rest.simpleRequest(
                "/servicesNS/nobody/{}/storage/collections/data/{}/batch_save?output_mode=json".format(cs_utils.APP_NAME, collection_name), 
                method='POST', jsonargs=jsonargs, sessionKey=self.search_results_info.auth_token, raiseAllErrors=True)
            logger.info("Updated {} entries in the lookup.".format(len(updated_data)))
        else:
            logger.info("No entries to update in the KVStore lookup.")

    
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
    
    
    def remove_old_backups(self):
        now = time.time()
        for filename in os.listdir(LOOKUP_DIR):
            f = os.path.join(LOOKUP_DIR, filename)
            if f.startswith(DEVICE_INVENTORY_LOOKUP_BACKUP_PREFIX) and os.stat(f).st_mtime < now - 7 * 86400:   # remove older than 7 days file
                logger.debug("Removing file: {}".format(filename))
                # os.remove(f)

    def take_backup_of_lookup_only_updated_entries(self, data):
        csv_data = DEVICE_INVENTORY_LOOKUP_HEADERS
        for i in data:
            csv_data.append(
                [i['uuid'], i['time'], i['ip'], i['hostname'], i['mac_address'], 
                i['tenable_uuid'], i['qualys_id'], i['lansweeper_id'], i['sophos_uuid'], i['crowdstrike_userid'], i['windows_defender_host']])

        backup_file = get_lookup_path('{}_{}.csv'.format(DEVICE_INVENTORY_LOOKUP_BACKUP_PREFIX, datetime.today().strftime('%Y_%m_%d_%H_%M_%s')))
        self.update_csv_lookup(backup_file, csv_data)

        self.remove_old_backups()
    

    def check_timestamp(self, event_time):
        if float(event_time) >= self.current_time_delta and float(event_time) <= self.current_time:
            return True
        return False

    
    def get_pointer_in_data(self, field, value, time=None):
        logger.debug("Finding field:{}, value:{}".format(field, value))
        field_index = DEVICE_INVENTORY_LOOKUP_HEADERS_KEY_INDEX[field]
        if field in ['hostname', 'mac_address']:
            for i in self.device_inventory:
                lookup_values = i[field_index].split(',')
                for val in value:
                    if val in lookup_values:
                        logger.debug("Found lookup entry:{}".format(i))
                        return i
        elif field == 'ip':
            for i in self.device_inventory:
                lookup_values = i[field_index].split(',')
                for val in value:
                    if val in lookup_values:
                        logger.debug("Found lookup entry for ip, checking timestamp.:{}".format(i))
                        if self.check_timestamp(time):
                            logger.debug("Found lookup entry for ip and matches the timestamp condition.:{}".format(i))
                            return i
        else:
            for i in self.device_inventory:
                if value==i[field_index]:
                    logger.debug("Found lookup entry:{}".format(i))
                    return i
        logger.debug("Lookup entry not found.")
    

    def get_pointer_to_match_mac_and_ip(self, mac_addresses, ips, time=None):
        logger.debug("Finding mac:{}, ip:{}".format(mac_addresses, ips))
        for i in self.device_inventory:
            lookup_values_mac = i[LOOKUP_KEY_MAC_ADDRESS].split(',')
            for mac in mac_addresses:
                if mac in lookup_values_mac:
                    lookup_values_ip = i[LOOKUP_KEY_IP].split(',')
                    for ip in ips:
                        if ip in lookup_values_ip:
                            logger.debug("Found lookup entry for matching mac and ip.:{}".format(i))
                            return i
                            # Note - We need to keep time for each specific IP separately so that we can match IPs while backfilling also.
                            # OR if both mac and ip are matching then probably we don't need to look at time parameter as well.
                            # logger.debug("Found lookup entry for matching mac and ip, checking timestamp.:{}".format(i))
                            # if self.check_timestamp(time):
                            #     logger.debug("Found lookup entry for mac and ip that matches the timestamp condition.:{}".format(i))
                            #     return i
        logger.debug("Lookup entry not found for matching mac or ip.")


    def append_value_in_multivalued_csv_field(self, current, new_values):
        new_val = current.split(',')
        new_val.extend(new_values)
        new_val = ','.join(set(new_val))
        return new_val
    

    def update_lookup_row(self, record, data_pointer, ips, hostnames, mac_addresses, product_uuid=None):
        # check if the entry is in already updated list
        for i in self.updated_entries:
            if i[LOOKUP_KEY_UUID] == data_pointer[LOOKUP_KEY_UUID]:
                update_entry = i
                break
        else:
            update_entry = None

        if product_uuid:
            field_index = DEVICE_INVENTORY_LOOKUP_HEADERS_KEY_INDEX[product_uuid]
            if data_pointer[field_index]:
                # TODO - if data_pointer[field_index] is already present that means there is conflicting mac_address, etc
                logger.warning("data_pointer[{}]={} is already present, while adding record:{} into exiting lookup entry:{}".format(product_uuid, data_pointer[field_index], record, data_pointer))
            data_pointer[field_index] = record[product_uuid]

        data_pointer[LOOKUP_KEY_HOSTNAME] = self.append_value_in_multivalued_csv_field(data_pointer[LOOKUP_KEY_HOSTNAME], hostnames)
        data_pointer[LOOKUP_KEY_MAC_ADDRESS] = self.append_value_in_multivalued_csv_field(data_pointer[LOOKUP_KEY_MAC_ADDRESS], mac_addresses)

        if self.check_timestamp(data_pointer[LOOKUP_KEY_TIME]):
            # append ips
            data_pointer[LOOKUP_KEY_IP] = self.append_value_in_multivalued_csv_field(data_pointer[LOOKUP_KEY_IP], ips)
        else:
            # update ips
            data_pointer[LOOKUP_KEY_IP] = ','.join(set(ips))
        
        data_pointer[LOOKUP_KEY_TIME] = record['time']   # last update time

        # Update entry
        if update_entry:
            update_entry = data_pointer
        else:
            self.updated_entries.append(data_pointer)


    def handle_record(self, record, product_uuid):
        logger.debug("handle_record: product_uuid: {}, record: {}".format(product_uuid, record))

        ips = None
        try:
            ips = record['ip'].split(",")
            ips = set([x.strip() for x in ips if len(x.strip())>1])
            if not ips or (len(ips)==1 and ips[0]) == '':
                ips = []
        except:
            ips = []

        hostnames = None
        try:
            hostnames = record['hostname'].split(",")
            hostnames = set([x.strip() for x in hostnames if len(x.strip())>1])
            if not hostnames or (len(hostnames)==1 and hostnames[0]) == '':
                hostnames = []
        except:
            hostnames = []

        mac_addresses = None
        try:
            mac_addresses = record['mac_address'].split(",")
            mac_addresses = set([x.strip() for x in mac_addresses if len(x.strip())>1])
            if not mac_addresses or (len(mac_addresses)==1 and mac_addresses[0]) == '':
                mac_addresses = []
        except:
            mac_addresses = []

        data_pointer = self.get_pointer_in_data(field=product_uuid, value=record[product_uuid])
        if data_pointer:
            logger.debug("product_uuid found in the lookup")
            self.update_lookup_row(record, data_pointer, ips, hostnames, mac_addresses)
            return

        logger.debug("product_uuid not found in the lookup")
        data_pointer = self.get_pointer_in_data(field='hostname', value=hostnames)
        if data_pointer:
            logger.debug("Hostname found in the lookup")
            self.update_lookup_row(record, data_pointer, ips, hostnames, mac_addresses, product_uuid)
            return

        logger.debug("Hostname not found in the lookup")
        data_pointer = self.get_pointer_to_match_mac_and_ip(mac_addresses, ips, time=record['time'])
        if data_pointer:
            logger.debug("IP and Mac-Address both matches in the lookup")
            self.update_lookup_row(record, data_pointer, ips, hostnames, mac_addresses, product_uuid)
            return

        logger.debug("No first look matching entry found in the lookup")
        return record


    def transform(self, records):
        self.device_inventory = None
        self.updated_entries = []
        self.current_time = self.ipmatchstarttime
        self.current_time_delta = self.current_time - self.ipmatchtimediff

        for record in records:
            if not self.device_inventory:
                # self.device_inventory = self.read_csv_lookup(DEVICE_INVENTORY_LOOKUP, DEVICE_INVENTORY_LOOKUP_HEADERS)   # for csv lookup
                self.device_inventory = self.read_kvstore_lookup(DEVICE_INVENTORY_LOOKUP_COLLECTION)

            ret = None
            if 'tenable_uuid' in record and record['tenable_uuid']:
                ret = self.handle_record(record, product_uuid='tenable_uuid')
            elif 'qualys_id' in record and record['qualys_id']:
                ret = self.handle_record(record, product_uuid='qualys_id')
            elif 'lansweeper_id' in record and record['lansweeper_id']:
                ret = self.handle_record(record, product_uuid='lansweeper_id')
            elif 'sophos_uuid' in record and record['sophos_uuid']:
                ret = self.handle_record(record, product_uuid='sophos_uuid')
            elif 'crowdstrike_userid' in record and record['crowdstrike_userid']:
                ret = self.handle_record(record, product_uuid='crowdstrike_userid')
            elif 'windows_defender_host' in record and record['windows_defender_host']:
                ret = self.handle_record(record, product_uuid='windows_defender_host')

            logger.debug("Ret: {}".format(ret))

            if ret:
                # ret is dict, convert to list in proper order and prepend with new uuid
                while True:
                    new_uuid = str(uuid.uuid4())
                    exist = self.get_pointer_in_data('uuid', new_uuid)
                    if not exist:
                        if 'lansweeper_id' not in ret:
                            ret['lansweeper_id'] = ''
                        if 'tenable_uuid' not in ret:
                            ret['tenable_uuid'] = ''
                        if 'qualys_id' not in ret:
                            ret['qualys_id'] = ''
                        if 'sophos_uuid' not in ret:
                            ret['sophos_uuid'] = ''
                        if 'windows_defender_host' not in ret:
                            ret['windows_defender_host'] = ''
                        if 'crowdstrike_userid' not in ret:
                            ret['crowdstrike_userid'] = ''

                        # new_device = [new_uuid, ret['time'], ret['ip'], ret['hostname'], ret['mac_address'],   # For csv lookup
                        #             ret['tenable_uuid'], ret['qualys_id'], ret['lansweeper_id'], ret['sophos_uuid'], ret['crowdstrike_userid'], ret['windows_defender_host']]
                        new_device = {
                            '_key': new_uuid,
                            'uuid': new_uuid,
                            'time': ret['time'],
                            'ip': ret['ip'],
                            'hostname': ret['hostname'],
                            'mac_address': ret['mac_address'],
                            'lansweeper_id': ret['lansweeper_id'],
                            'qualys_id': ret['qualys_id'],
                            'tenable_uuid': ret['tenable_uuid'],
                            'sophos_uuid': ret['sophos_uuid'],
                            'windows_defender_host': ret['windows_defender_host'],
                            'crowdstrike_userid': ret['crowdstrike_userid']
                        }
                        logger.info("New device being added to list: {}".format(new_device))
                        self.device_inventory.append(new_device)
                        self.updated_entries.append(new_device)
                        break
                yield ret

        # Write lookup at the end
        if self.device_inventory:
            # self.update_csv_lookup(DEVICE_INVENTORY_LOOKUP, self.device_inventory)   # For csv lookup
            self.update_kvstore_lookup(DEVICE_INVENTORY_LOOKUP_COLLECTION, self.updated_entries)
            self.take_backup_of_lookup_only_updated_entries(self.updated_entries)


dispatch(DeviceInventoryGenCommand, sys.argv, sys.stdin, sys.stdout, __name__)
