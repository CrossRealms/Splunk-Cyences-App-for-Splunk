
# Device Inventory V2
'''
Additional features in V2.
* It now supports hostname matching even when hostname has postfix, ex. It now understand that abc and abc.crossrealms.com are same device.
    * One limitation now is postfix has to be configured explicitly with a macro and it should be a single value.

Dev Details
* It now stores everything inside a Python pickle file instead of a lookup
* Most of the processing now happens inside the Python script.
'''

import pickle
import uuid
import copy


MAX_TIME_EPOCH = 2147483647   # Tue Jan 19 2038 03:14:07


def remove_word_from_end(sentence, word):
    if sentence.endswith(word):
        return sentence[:-len(word)]
    else:
        return sentence


class DeviceEntry:
    def __init__(self, product_name: str, time: int, product_uuid: str, ips, mac_addresses, hostnames, custom_fields: dict = {}) -> None:
        self.product_name = product_name
        self.time = time
        self.product_uuid = product_uuid
        self.ips = self._internal_check_list_field_format(ips)
        self.mac_addresses = self._internal_check_list_field_format(mac_addresses)
        self.hostnames = self._internal_check_list_field_format(hostnames)
        self.custom_fields = custom_fields
    
    def _internal_check_list_field_format(self, field):
        if field == None:
            return []
        elif type(field) == str:
            return [field]
        elif type(field) == list:
            return field
        else:
            print("Exception: unexpected field format. Allowed only str and list of string")
            return []
            # TODO - break


# this is not been in use
class DeviceField:
    def __init__(self, value, time, expiry=None) -> None:
        self.value = value
        self.time = time
        self.expiry = expiry


class Device:
    def __init__(self, uuid) -> None:
        self.uuid = uuid

        self.products = {}   # {<product_name>: {<product_uuid>: {time: <time-epoch>, ips: [<ips>], mac_addresses: [<mac_addresses>], hostnames: [<hostnames>], custom_fields: [<custom-fields>]}}}

        self.product_names = dict()   # {"<name>": <occurrences>}
        self.product_uuids = dict()   # {"<name>": <occurrences>}
        self.ips = dict()
        self.mac_addresses = dict()
        self.hostnames = dict()


    def two_value_combination_match(self, values1, current_list1, values2, current_list2, is_list1_hostname=False, is_list2_hostname=False, hostname_postfix=None):
        if is_list1_hostname and hostname_postfix:
            values1_updated = [remove_word_from_end(element, hostname_postfix) for element in current_list1]
            current_list1_updated = [remove_word_from_end(element, hostname_postfix) for element in current_list1]
        else:
            values1_updated = values1
            current_list1_updated = current_list1
        
        if is_list2_hostname and hostname_postfix:
            values2_updated = [remove_word_from_end(element, hostname_postfix) for element in values2]
            current_list2_updated = [remove_word_from_end(element, hostname_postfix) for element in current_list2]
        else:
            values2_updated = values2
            current_list2_updated = current_list2

        for val1 in values1_updated:
            for existing_val1 in current_list1_updated:
                if val1 == existing_val1:
                    for val2 in values2_updated:
                        if val2 in current_list2_updated:
                            return True
        return False


    def is_match(self, device_entry, hostname_postfix=None):
        # entry from same product with same uuid already exist
        if device_entry.product_name in self.product_names and device_entry.product_uuid in self.product_uuids:
            # return self.products[device_entry.product_name][device_entry.product_uuid]
            return True

        # search for combination of ip and mac_address
        if self.two_value_combination_match(device_entry.ips, self.ips, device_entry.mac_addresses, self.mac_addresses, hostname_postfix=hostname_postfix):
            return True

        # search for combination of ip and hostname
        if self.two_value_combination_match(device_entry.ips, self.ips, device_entry.hostnames, self.hostnames, is_list2_hostname=True, hostname_postfix=hostname_postfix):
            return True

        # search for combination of hostname and mac_address
        if self.two_value_combination_match(device_entry.hostnames, self.hostnames, device_entry.mac_addresses, self.mac_addresses, is_list1_hostname=True, hostname_postfix=hostname_postfix):
            return True

        return False


    def _remove_entry_content(self, product_name, product_uuid, entry_content):
        if self.product_uuids[product_uuid] == 1:
            del self.product_uuids[product_uuid]
            del self.products[product_name][product_uuid]   # remove the entry content as well
        else:
            self.product_uuids[product_uuid] -= 1

        if self.product_names[product_name] == 1:
            del self.product_names[product_name]
            del self.products[product_name]   # remove the product key from the products dict
        else:
            self.product_names[product_name] -= 1

        for ip in entry_content['ips']:
            if self.ips[ip] == 1:
                del self.ips[ip]
            else:
                self.ips[ip] -= 1

        for mac_address in entry_content['mac_addresses']:
            if self.mac_addresses[mac_address] == 1:
                del self.mac_addresses[mac_address]
            else:
                self.mac_addresses[mac_address] -= 1

        for hostname in entry_content['hostnames']:
            if self.hostnames[hostname] == 1:
                del self.hostnames[hostname]
            else:
                self.hostnames[hostname] -= 1


    def _add_entry_content(self, product_name, product_uuid, entry_content):
        if product_name in self.product_names:
            self.product_names[product_name] += 1
        else:
            self.product_names[product_name] = 1
            self.products[product_name] = {}   # initiate with empty dict for product key

        if product_uuid in self.product_uuids:
            self.product_uuids[product_uuid] += 1
        else:
            self.product_uuids[product_uuid] = 1
            self.products[product_name][product_uuid] = entry_content # added entry details to products obj

        for ip in entry_content['ips']:
            if ip in self.ips:
                self.ips[ip] += 1
            else:
                self.ips[ip] = 1

        for mac_address in entry_content['mac_addresses']:
            if mac_address in self.mac_addresses:
                self.mac_addresses[mac_address] += 1
            else:
                self.mac_addresses[mac_address] = 1

        for hostname in entry_content['hostnames']:
            if hostname in self.hostnames:
                self.hostnames[hostname] += 1
            else:
                self.hostnames[hostname] = 1


    def add_device_entry(self, new_entry: DeviceEntry):
        # TODO - We need to combine product_name and product_uuid, somehow, product_uuid alone does not represent the right data

        new_entry_content = copy.deepcopy(vars(new_entry))
        del new_entry_content['product_name']
        del new_entry_content['product_uuid']

        if new_entry.product_name in self.product_names and new_entry.product_uuid in self.product_uuids:
            existing_entry = self.products[new_entry.product_name][new_entry.product_uuid]
            # existing entry present, removing it first and adding the new entry
            self._remove_entry_content(new_entry.product_name, new_entry.product_uuid, existing_entry)
            self._add_entry_content(new_entry.product_name, new_entry.product_uuid, new_entry_content)
        else:
            self._add_entry_content(new_entry.product_name, new_entry.product_uuid, new_entry_content)


    def cleanup(self, min_time, max_time=MAX_TIME_EPOCH):
        products_copy = copy.deepcopy(self.products)
        for product_name, product_items in products_copy.items():
            for product_uuid, entry_details in product_items.items():
                if entry_details['time'] < min_time or entry_details['time'] > max_time:
                    self._remove_entry_content(product_name, product_uuid, entry_details)

        # if no entry exist for any device return false, otherwise return True, to indicate, the device itself needs to be removed.
        if len(self.product_names) == 0:
            return False
        return True


    def get_as_dict(self):
        all_times = []
        for product_name, product_items in self.products.items():
            for _, element_details in product_items.items():
                all_times.append(element_details['time'])

        return {
            'uuid': self.uuid,
            'latest_time': max(all_times),
            'product_names': list(self.product_names.keys()),
            'product_uuids': list(self.product_uuids.keys()),
            'ips': list(self.ips.keys()),
            'mac_addresses': list(self.mac_addresses.keys()),
            'hostnames': list(self.hostnames.keys())
        }

    def __str__(self) -> str:
        return str(self.get_as_dict())

    def __repr__(self) -> str:
        return self.__str__()




DEVICE_LIST_PICKLE_FILENAME = 'device_list.pickle'


class DeviceManager:
    '''
    Use Example:
        with DeviceManager() as dm:
            new_device_entry = DeviceEntry(...)
            device_uuid = dm.add_device_entry(new_device_entry)
    '''

    def __init__(self, hostname_postfix=None):
        self.hostname_postfix = hostname_postfix
        self.devices = self.load_data()


    def save_data(self):
        with open(DEVICE_LIST_PICKLE_FILENAME, 'wb') as f:
            pickle.dump(self.devices, f)

    def load_data(self):
        try:
            with open(DEVICE_LIST_PICKLE_FILENAME, 'rb') as f:
                return pickle.load(f)
        except Exception as e:
            # TODO - write proper condition here
            print("Exception reading the device list: {}".format(e))
        return []


    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.save_data()


    def get_device_details(self):
        # Return a list of unique devices
        _devices = []
        for de in self.devices:
            _devices.append(de.get_as_dict())
        return _devices


    def get_matching_device(self, device_entry: DeviceEntry):
        # return matching device
        for de in self.devices:
            if de.is_match(device_entry, hostname_postfix=self.hostname_postfix):
                return de.get_as_dict()


    def find_device(self, device_entry: DeviceEntry):
        for de in self.devices:
            res = de.is_match(device_entry, hostname_postfix=self.hostname_postfix)
            if res:
                return de
        return False


    def add_device_entry(self, new_entry: DeviceEntry):
        # Assign a unique device_uuid to the device
        matching_device = self.find_device(new_entry)

        if matching_device:
            matching_device.add_device_entry(new_entry)
            return matching_device.uuid

        else:
            # create uuid and create a new device and append to the list
            new_uuid = str(uuid.uuid4())
            new_device = Device(new_uuid)
            new_device.add_device_entry(new_entry)
            self.devices.append(new_device)
            return new_uuid


    def reorganize_device_list(self):
        # merging and cleaning
        '''
        Why we need device merging:
            # scenario where two devices previously added created a new entry, when added a 3rd entry which is similar to first one but also with second one, linking them into one device

        Why we are not creating the whole list again:
            # we want to keep the original device uuid intact as much as possible
        '''
        messages = []

        # iterate over devices from the back
        for i in range(len(self.devices)-1, 0, -1):
            _device_entries = self.convert_device_to_deviceentry_obj(self.devices[i])

            for j in range(i-1, -1, -1):
                # look for entries in all the previous entries, if similar entry found, merge all the entries with that and remove this device
                for de_entry in _device_entries:
                    res = self.devices[j].is_match(de_entry, hostname_postfix=self.hostname_postfix)
                    if res:
                        messages.append("Device(uuid={}) will going to be merged with Device(uuid={}).".format(self.devices[i].uuid, self.devices[j].uuid))
                        for _entry in _device_entries:
                            self.devices[j].add_device_entry(_entry)
                        self.devices.pop(i)
                        break   # all the entries added to the device, duplicate device obj removed, break two loops
                else:
                    continue
                break
                # What's the logic for above two 3 lines:
                    # break the parent look as well when match found as the device has already been merged to another device
        
        return messages


    def cleanup_devices(self, min_time, max_time=MAX_TIME_EPOCH):
        messages = []
        idx = 0
        while idx < len(self.devices):
            is_device_still_valid = self.devices[idx].cleanup(min_time, max_time)
            if not is_device_still_valid:
                messages.append("Device(uuid={}) has been deleted completely.".format(self.devices[idx].uuid))
                self.devices.pop(idx)   # remove the device itself if there is no more entries present
            else:
                idx += 1

        return messages


    def manually_link_devices(self, device_uuid1, device_uuid2):
        # Implement logic to manually specify that two devices are the same
        pass


    def convert_device_to_deviceentry_obj(self, device_obj):
        device_entries = []
        for product_name, product_items in device_obj.products.items():
            for product_uuid, element_details in product_items.items():
                device_entries.append(
                    DeviceEntry(
                        product_name=product_name,
                        time=element_details['time'],
                        product_uuid=product_uuid,
                        ips=element_details['ips'],
                        mac_addresses=element_details['mac_addresses'],
                        hostnames=element_details['hostnames'],
                        custom_fields=element_details['custom_fields']))
        return device_entries




# TODO - At certain interval we need to run auto merging code
# Why: Because lets with the same product_uuid if hostname and mac_address changed, which is not matching with the some other device
# Implementation Idea: Start from empty device list, iterate over existing device list and start creating the new list by adding one by one entry
#               Not sure about below two ideas, which one to choose
#                   : 1. Also consider each entry inside a device as separate entry
#                   : 2. Consider already merged entries as same entries when considering
#           Also, try to keep the existing device_uuid same as far as its possible. This should not be hard to do.

