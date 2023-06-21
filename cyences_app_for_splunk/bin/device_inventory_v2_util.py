
# Device Inventory V2
'''
Additional features in V2.
* It now supports hostname matching even when hostname has postfix, ex. It now understand that abc and abc.crossrealms.com are same device.
    * One limitation now is postfix has to be configured explicitly with a macro and it should be a single value.
* It now executes device possible merging on regular basis to ensure devices merges if possible.
* When adding a new device entry, if override the existing entry if it came from the same product with the same product id.
    * When it combines two device entries, it checks before adding the entry, adding older entry over the newer entry do not replace.
* Device Manager has capability to cleanup devices for entries that are older than X time/days.


Dev Details
* It now stores everything inside a Python pickle file instead of a lookup
* Most of the processing now happens inside the Python script.
'''

import os
import pickle
import uuid
import copy


MAX_TIME_EPOCH = 2147483647   # Tue Jan 19 2038 03:14:07


def remove_words_from_end(sentence, words):
    for word in words:
        if sentence.endswith(word):
            sentence = sentence[:-len(word)]
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
            return [field.lower()]
        elif type(field) == list:
            return [element.lower() for element in field]
        else:
            raise Exception("Unexpected field format. Allowed only str and list of string.")


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


    def two_value_combination_match(self, values1, current_list1, values2, current_list2, is_list1_hostname=False, is_list2_hostname=False, hostname_postfixes=[]):
        # this does comparison in lower case characters always to ensure case-sensitivity does not affect the comparison
        if is_list1_hostname and hostname_postfixes:
            values1_updated = [remove_words_from_end(element.lower(), hostname_postfixes) for element in values1]
            current_list1_updated = [remove_words_from_end(element.lower(), hostname_postfixes) for element in current_list1]
        else:
            values1_updated = [element.lower() for element in values1]
            current_list1_updated = [element.lower() for element in current_list1]
        
        if is_list2_hostname and hostname_postfixes:
            values2_updated = [remove_words_from_end(element.lower(), hostname_postfixes) for element in values2]
            current_list2_updated = [remove_words_from_end(element.lower(), hostname_postfixes) for element in current_list2]
        else:
            values2_updated = [element.lower() for element in values2]
            current_list2_updated = [element.lower() for element in current_list2]

        for val1 in values1_updated:
            for existing_val1 in current_list1_updated:
                if val1 == existing_val1:
                    for val2 in values2_updated:
                        if val2 in current_list2_updated:
                            return True
        return False


    def is_match(self, device_entry, hostname_postfixes=[]):
        # entry from same product with same uuid already exist
        if device_entry.product_name in self.product_names and device_entry.product_uuid in self.product_uuids:
            # return self.products[device_entry.product_name][device_entry.product_uuid]
            return True

        # search for combination of ip and mac_address
        if self.two_value_combination_match(device_entry.ips, self.ips, device_entry.mac_addresses, self.mac_addresses, hostname_postfixes=hostname_postfixes):
            return True

        # search for combination of ip and hostname
        if self.two_value_combination_match(device_entry.ips, self.ips, device_entry.hostnames, self.hostnames, is_list2_hostname=True, hostname_postfixes=hostname_postfixes):
            return True

        # search for combination of hostname and mac_address
        if self.two_value_combination_match(device_entry.hostnames, self.hostnames, device_entry.mac_addresses, self.mac_addresses, is_list1_hostname=True, hostname_postfixes=hostname_postfixes):
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
            # existing entry present, and its older than new entry then only replace with the new entry
            if existing_entry['time'] <= new_entry_content['time']:
                self._remove_entry_content(new_entry.product_name, new_entry.product_uuid, existing_entry)
                self._add_entry_content(new_entry.product_name, new_entry.product_uuid, new_entry_content)
            else:
                print("No need to add the entry as there is already an entry exist with newer timestamp.")   # TODO - Maybe need to use logger instead of print
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

    def __init__(self, hostname_postfixes=""):
        self.hostname_postfixes = hostname_postfixes.lower().split(",")
        self.hostname_postfixes = [element.strip() for element in self.hostname_postfixes]
        self.devices = self._load_data()


    def _save_data(self):
        with open(DEVICE_LIST_PICKLE_FILENAME, 'wb') as f:
            pickle.dump(self.devices, f)

    def _load_data(self):
        if os.path.isfile(DEVICE_LIST_PICKLE_FILENAME):
            with open(DEVICE_LIST_PICKLE_FILENAME, 'rb') as f:
                return pickle.load(f)
        else:
            print("DEBUG: File does not exist")   # TODO - Add WARN logger instead
            return []


    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self._save_data()


    def get_device_details(self):
        # Return a list of unique devices
        _devices = []
        for de in self.devices:
            _devices.append(de.get_as_dict())
        return _devices


    def get_matching_device(self, device_entry: DeviceEntry):
        # return matching device
        for de in self.devices:
            if de.is_match(device_entry, hostname_postfixes=self.hostname_postfixes):
                return de.get_as_dict()


    def _find_device(self, device_entry: DeviceEntry):
        for de in self.devices:
            res = de.is_match(device_entry, hostname_postfixes=self.hostname_postfixes)
            if res:
                return de
        return False

    def _find_device_by_id(self, device_id: str):
        for de in self.devices:
            if de.uuid == device_id:
                return de
        return False


    def add_device_entry(self, new_entry: DeviceEntry):
        # Assign a unique device_uuid to the device
        matching_device = self._find_device(new_entry)

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


    # TODO - At certain interval we need to run auto merging code -> reorganize_device_list
    # Why: Because lets with the same product_uuid if hostname and mac_address changed, which is not matching with the some other device
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
            _device_entries = self._convert_device_to_deviceentry_obj(self.devices[i])

            for j in range(i-1, -1, -1):
                # look for entries in all the previous entries, if similar entry found, merge all the entries with that and remove this device
                for de_entry in _device_entries:
                    res = self.devices[j].is_match(de_entry, hostname_postfixes=self.hostname_postfixes)
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


    def manually_merge_devices(self, device1_id, *device_ids_to_merge):
        # Implement logic to manually specify that two or more devices are the same by their IDs
        _device1_obj = self._find_device_by_id(device1_id)
        if not _device1_obj:
            raise Exception("Device(uuid={}) not found.".format(device1_id))

        other_device_objects = []
        for _other_dev_id in device_ids_to_merge:
            _other_dev_obj = self._find_device_by_id(_other_dev_id)
            if not _other_dev_obj:
                raise Exception("Device(uuid={}) not found.".format(_other_dev_id))
            other_device_objects.append(_other_dev_obj)

        for _other_dev_obj in other_device_objects:
            _device_entries = self._convert_device_to_deviceentry_obj(_other_dev_obj)

            for de_entry in _device_entries:
                _device1_obj.add_device_entry(de_entry)   # add the entries

            self.devices.remove(_other_dev_obj)   # remove the device after all entries merged to first device


    def _convert_device_to_deviceentry_obj(self, device_obj):
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
