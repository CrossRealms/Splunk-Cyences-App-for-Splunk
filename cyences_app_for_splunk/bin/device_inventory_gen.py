#!/usr/bin/env python

import os
import sys
import csv
import uuid
import time

from splunklib.searchcommands import dispatch, EventingCommand, Configuration, Option
from splunklib.searchcommands.validators import Validator


import logging
import logger_manager
logger = logger_manager.setup_logging('device_inventory_command', logging.DEBUG)


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
        logger.debug("Finding field:{}, value:{}".format(field, value))
        field_index = DEVICE_INVENTORY_LOOKUP_HEADERS_KEY_INDEX[field]
        if field in ['hostname', 'mac_address']:
            for i in self.device_inventory:
                lookup_values = i[field_index].split(',')
                if value in lookup_values:
                    logger.debug("Found lookup entry:{}".format(i))
                    return i
        elif field == 'ip':
            for i in self.device_inventory:
                lookup_values = i[field_index].split(',')
                if value in lookup_values:
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


    def append_value_in_multivalued_csv_field(self, current, new_values):
        new_val = current.split(',')
        new_val.extend(new_values)
        new_val = ','.join(set(new_val))
        return new_val
    

    def update_lookup_row(self, record, data_pointer, ips, hostnames, mac_addresses, product_uuid=None):
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


    def handle_record(self, record, product_uuid):
        logger.debug("handle_record: product_uuid: {}, record: {}".format(product_uuid, record))

        ips = None
        try:
            ips = list(set(record['ip'].split(",")))
            if not ips or (len(ips)==1 and ips[0]) == '':
                ips = []
        except:
            ips = []

        hostnames = None
        try:
            hostnames = list(set(record['hostname'].split(",")))
            if not hostnames or (len(hostnames)==1 and hostnames[0]) == '':
                hostnames = []
        except:
            hostnames = []

        mac_addresses = None
        try:
            mac_addresses = list(set(record['mac_address'].split(",")))
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
        for host in hostnames:
            data_pointer = self.get_pointer_in_data(field='hostname', value=host)
            break
        if data_pointer:
            logger.debug("hostname found in the lookup")
            self.update_lookup_row(record, data_pointer, ips, hostnames, mac_addresses, product_uuid)
            return

        logger.debug("hostname not found in the lookup")
        for mac in mac_addresses:
            data_pointer = self.get_pointer_in_data(field='mac_address', value=mac)
            break
        if data_pointer:
            logger.debug("mac_address found in the lookup")
            self.update_lookup_row(record, data_pointer, ips, hostnames, mac_addresses, product_uuid)
            return

        logger.debug("mac_address not found in the lookup")
        for ip in ips:
            data_pointer = self.get_pointer_in_data(field='ip', value=ip, time=record['time'])
            break
        if data_pointer:
            logger.debug("ip found in the lookup")
            self.update_lookup_row(record, data_pointer, ips, hostnames, mac_addresses, product_uuid)
            return

        logger.debug("ip not found in the lookup (in last 30 minutes timespan)")
        return record


    def transform(self, records):
        self.device_inventory = None
        self.current_time = self.ipmatchstarttime
        self.current_time_delta = self.current_time - self.ipmatchtimediff

        for record in records:
            if not self.device_inventory:
                self.device_inventory = self.read_csv_lookup(DEVICE_INVENTORY_LOOKUP, DEVICE_INVENTORY_LOOKUP_HEADERS)

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

            logger.debug("ret: {}".format(ret))

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

                        new_device = [new_uuid, ret['time'], ret['ip'], ret['hostname'], ret['mac_address'], 
                                    ret['tenable_uuid'], ret['qualys_id'], ret['lansweeper_id'], ret['sophos_uuid'], ret['crowdstrike_userid'], ret['windows_defender_host']]
                        logger.info("New device being added to list: {}".format(new_device))
                        self.device_inventory.append(new_device)
                        break
                yield ret
            
            logger.debug("")
            
        # Write lookup at the end
        if self.device_inventory:
            self.update_csv_lookup(DEVICE_INVENTORY_LOOKUP, self.device_inventory)


dispatch(DeviceInventoryGenCommand, sys.argv, sys.stdin, sys.stdout, __name__)


# DONE - for time_ip_lookup (from all searches with now()) there should be a field called indextime which should be used to get last 69 minutes added data in the lookup from where condition to avoid any issues of missing data.
# DONE - give proper name to time_ip_lookup and other lookups
# DONE - update qualys query to add fqdns, sophos add more fields so that we can use lookup for anything later, etc.
# TODO ? - update all searches to use prefix for fields to avoid conflict while merging
# DONE - write savedsearches for all (execution one after other)
# TODO - test above command's logic (if its merging right devices together and its merging devices that it should be)
# DONE - remove unnecessary logs and change logging location from logger_manager
# TODO - update debug to info mode for logger
# TODO - write device inventory query by joining all tables with device inventory table
# TODO - change device master to device inventory through-out the App
# TODO - change csv lookups to kvstore for all lookups, use key as it's unique uuid per devices
# TODO - update tenable vulnerabilities lookup
# TODO - write savedsearched for generating inventory lookup (that should execute at last)
# TODO - Provide a way to manually merge two uuids/devices from UI
# TODO - Provide a way to manually remove uuids
# TODO - manually provide way to remove hostname, mac_address for any item in the list to be consider
#        (mac address collision (ignoring some mac address) - https://www.google.com/amp/s/www.howtogeek.com/228286/how-is-the-uniqueness-of-mac-addresses-enforced/amp/)
# TODO - write backfilling (-7d) searches for all
# TODO - write cleanup searches for all (more than 30d remove device)
# TODO - change device master table with new lookup
# TODO - change asset intelligence dashboard to be displayed in the per uuid 
#        (search based on ip/host but display rest of the page based on specific device (for all it's ips and hostnames, etc) selected from the first device inventory table)
# TODO - Update all savedsearches to add more information (ex. add different statuses from sophos data)
# TODO - update rest of the App based on new lookups
# TODO - what to do for conflicting mac_address
# TODO - update qualys and tenable -> remote fixed and info vulnerabilities

# TODO - Sophos depends on counter-measure configuration and commands for collecting inventory.
# TODO - Update above csv lookup writing to kvstore for cs_device_inventory_lookup.csv

# TODO - Logic validation Notes
# - product_uuid match scenario found - seems to be working
# - hostname search is working when product_uuid not found
#
# - mac address conflict scenario found:
#       | inputlookup cs_device_inventory_lookup.csv | search hostname="*CR-LANSWEEPER*" | table uuid, ip, hostname, mac_address, *
#       b35e767b-34ce-4859-a8a9-6166e992ada5	10.33.1.202	                cr-lansweeper.crossrealms.local,cr-lansweeper	00:50:56:88:3a:a3	 	                                                                        2	126356656	-	 	                                 1623697740.185	     -
#       f472a01e-74d9-4631-8990-2a7a4aef1144	10.10.10.6,169.254.150.167	CR-LANSWEEPER,mleadc01,MLEA-FS01,mleadc02	    00:0c:29:ee:91:7e,00:0c:29:63:00:43,00:50:56:88:3a:a3,02:00:4c:4f:4f:50,00:0c:29:3d:da:cf   	-	-	 	    c64b1e2d-4807-442e-ba5b-b97cf432a113	 1623350390.283000	 -
#
# - another conflict found:
#       handle_record: product_uuid: sophos_uuid, record: OrderedDict([('hostname', 'mleadc02'), ('indextime', '1623759108'), ('lansweeper_id', ''), ('time', '1623473357.840000'), ('ip', '10.10.10.6,169.254.150.167'), ('mac_address', '00:0c:29:ee:91:7e,02:00:4c:4f:4f:50'), ('sophos_uuid', 'c64b1e2d-4807-442e-ba5b-b97cf432a113'), ('qualys_id', '')])
#       Finding field:sophos_uuid, value:c64b1e2d-4807-442e-ba5b-b97cf432a113
#       Lookup entry not found.
#       product_uuid not found in the lookup
#       Finding field:hostname, value:mleadc02
#       Found lookup entry:['f472a01e-74d9-4631-8990-2a7a4aef1144', '1623350390.283000', '169.254.122.185,10.10.10.5', 'CR-LANSWEEPER,mleadc01,MLEA-FS01,mleadc02', '00:0c:29:ee:91:7e,00:0c:29:63:00:43,00:50:56:88:3a:a3,02:00:4c:4f:4f:50,00:0c:29:3d:da:cf', '', '', '', '90674878-eade-480a-9d17-29a37da4327c', '', '']
#       hostname found in the lookup
#       data_pointer[sophos_uuid]=90674878-eade-480a-9d17-29a37da4327c is already present, while adding record:OrderedDict([('hostname', 'mleadc02'), ('indextime', '1623759108'), ('lansweeper_id', ''), ('time', '1623473357.840000'), ('ip', '10.10.10.6,169.254.150.167'), ('mac_address', '00:0c:29:ee:91:7e,02:00:4c:4f:4f:50'), ('sophos_uuid', 'c64b1e2d-4807-442e-ba5b-b97cf432a113'), ('qualys_id', '')]) into exiting lookup entry:['f472a01e-74d9-4631-8990-2a7a4aef1144', '1623350390.283000', '169.254.122.185,10.10.10.5', 'CR-LANSWEEPER,mleadc01,MLEA-FS01,mleadc02', '00:0c:29:ee:91:7e,00:0c:29:63:00:43,00:50:56:88:3a:a3,02:00:4c:4f:4f:50,00:0c:29:3d:da:cf', '', '', '', '90674878-eade-480a-9d17-29a37da4327c', '', '']


# TODO - Auto remove mac_addresses and hostnames that is causing conflict.
#      - Or find some better solution for these conflicts as it seems conflict are more often.

