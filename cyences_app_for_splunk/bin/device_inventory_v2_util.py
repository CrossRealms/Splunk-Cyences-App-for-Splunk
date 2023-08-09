# Device Inventory V2
"""
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
"""

import uuid
import copy
import json
import cs_utils

from splunk import rest


MAX_TIME_EPOCH = 2147483647  # Tue Jan 19 2038 03:14:07
DEVICE_INVENTORY_LOOKUP_COLLECTION = "cs_device_inventory_collection_test"


def remove_words_from_end(sentence, words):
    for word in words:
        if sentence.endswith(word):
            sentence = sentence[: -len(word)]
    return sentence


def two_value_combination_match(
    values1,
    current_list1,
    values2,
    current_list2,
    is_list1_hostname=False,
    is_list2_hostname=False,
    hostname_postfixes=[],
):
    # this does comparison in lower case characters always to ensure case-sensitivity does not affect the comparison
    if is_list1_hostname and hostname_postfixes:
        values1_updated = [
            remove_words_from_end(element.lower(), hostname_postfixes)
            for element in values1
            if element
        ]
        current_list1_updated = [
            remove_words_from_end(element.lower(), hostname_postfixes)
            for element in current_list1
            if element
        ]
    else:
        values1_updated = [element.lower() for element in values1 if element]
        current_list1_updated = [
            element.lower() for element in current_list1 if element
        ]

    if is_list2_hostname and hostname_postfixes:
        values2_updated = [
            remove_words_from_end(element.lower(), hostname_postfixes)
            for element in values2
            if element
        ]
        current_list2_updated = [
            remove_words_from_end(element.lower(), hostname_postfixes)
            for element in current_list2
            if element
        ]
    else:
        values2_updated = [element.lower() for element in values2 if element]
        current_list2_updated = [
            element.lower() for element in current_list2 if element
        ]

    for val1 in values1_updated:
        if val1 in current_list1_updated:
            for val2 in values2_updated:
                if val2 in current_list2_updated:
                    return True
    return False


class DeviceEntry:
    def __init__(
        self,
        product_name: str,
        time: int,
        product_uuid: str,
        ips,
        mac_addresses,
        hostnames,
        custom_fields: dict = {},
    ) -> None:
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
            raise Exception(
                "Unexpected field format. Allowed only str and list of string."
            )


class DeviceManager:
    """
    Use Example:
        with DeviceManager() as dm:
            new_device_entry = DeviceEntry(...)
            device_uuid = dm.add_device_entry(new_device_entry)
    """

    def __init__(self, session_key, logger, hostname_postfixes=[]):
        self.session_key = session_key
        self.logger = logger
        self.hostname_postfixes = [
            element.strip() for element in hostname_postfixes if element.strip()
        ]
        self.updated_devices = []
        self.deleted_devices = []
        self.devices = self.read_kvstore_lookup(DEVICE_INVENTORY_LOOKUP_COLLECTION)


    def _convert_str_to_dict(self, lookup_data):
        lookup_data = lookup_data if lookup_data else []
        for dvc in lookup_data:
            dvc["product_info"] = json.loads(dvc["product_info"])
            dvc["product_names"] = json.loads(dvc["product_names"])
            dvc["product_uuids"] = json.loads(dvc["product_uuids"])
            dvc["ips"] = json.loads(dvc["ips"])
            dvc["mac_addresses"] = json.loads(dvc["mac_addresses"])
            dvc["hostnames"] = json.loads(dvc["hostnames"])
        return lookup_data

    def read_kvstore_lookup(self):
        _, serverContent = rest.simpleRequest(
            "/servicesNS/nobody/{}/storage/collections/data/{}?output_mode=json".format(
                cs_utils.APP_NAME, DEVICE_INVENTORY_LOOKUP_COLLECTION
            ),
            method="GET",
            sessionKey=self.session_key,
            raiseAllErrors=True,
        )
        return self._convert_str_to_dict(json.loads(serverContent))


    def _convert_dict_to_str(self, devices_to_update):
        for dvc in devices_to_update:
            dvc["product_info"] = json.dumps(dvc["product_info"])
            dvc["product_names"] = json.dumps(dvc["product_names"])
            dvc["product_uuids"] = json.dumps(dvc["product_uuids"])
            dvc["ips"] = json.dumps(dvc["ips"])
            dvc["mac_addresses"] = json.dumps(dvc["mac_addresses"])
            dvc["hostnames"] = json.dumps(dvc["hostnames"])
        return devices_to_update

    def update_kvstore_lookup(self, devices_to_update=[]):
        if devices_to_update:
            devices_to_update = self._convert_dict_to_str(devices_to_update)
            # splunk.BadRequest: [HTTP 400] Bad Request; [{'type': 'ERROR', 'code': None, 'text': 'Request exceeds API limits - see limits.conf for details. (Too many documents for a single batch save, max_documents_per_batch_save=1000)'}]
            if len(devices_to_update) < 1000:
                jsonargs = json.dumps(devices_to_update)
                _ = rest.simpleRequest(
                    "/servicesNS/nobody/{}/storage/collections/data/{}/batch_save?output_mode=json".format(
                        cs_utils.APP_NAME, DEVICE_INVENTORY_LOOKUP_COLLECTION
                    ),
                    method="POST",
                    jsonargs=jsonargs,
                    sessionKey=self.session_key,
                    raiseAllErrors=True,
                )
            else:
                updated_data_full = [
                    devices_to_update[i : i + 800] for i in range(0, len(devices_to_update), 800)
                ]  # send max 800 in each chunk
                for chunk in updated_data_full:
                    jsonargs = json.dumps(chunk)
                    _ = rest.simpleRequest(
                        "/servicesNS/nobody/{}/storage/collections/data/{}/batch_save?output_mode=json".format(
                            cs_utils.APP_NAME, DEVICE_INVENTORY_LOOKUP_COLLECTION
                        ),
                        method="POST",
                        jsonargs=jsonargs,
                        sessionKey=self.session_key,
                        raiseAllErrors=True,
                    )
            self.logger.info(
                "Updated {} entries in the lookup.".format(len(devices_to_update))
            )

        else:
            self.logger.info("No devices to update in the KVStore lookup.")


    def delete_kvstore_entry(self, key):
        _ = rest.simpleRequest(
            "/servicesNS/nobody/{}/storage/collections/data/{}/{}".format(
                cs_utils.APP_NAME, DEVICE_INVENTORY_LOOKUP_COLLECTION, key
            ),
            method="DELETE",
            sessionKey=self.session_key,
            raiseAllErrors=True,
        )


    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        devices_to_update = []

        for _device_obj in self.devices:
            _uuid = _device_obj.get("uuid")

            if _uuid in self.deleted_devices:
                self.delete_kvstore_entry(_device_obj.get("_key"))

            elif _uuid in self.updated_devices:
                devices_to_update.append(_device_obj)

        self.update_kvstore_lookup(devices_to_update)


    @staticmethod
    def is_match(ex_device, new_device: DeviceEntry, hostname_postfixes=[]):
        # entry from same product with same uuid already exist
        if new_device.product_name in ex_device.get(
            "product_names"
        ) and new_device.product_uuid in ex_device.get("product_uuids"):
            # return self.products[device_entry.product_name][device_entry.product_uuid]
            return True

        # search for combination of ip and mac_address
        if two_value_combination_match(
            new_device.ips,
            ex_device.get("ips"),
            new_device.mac_addresses,
            ex_device.get("mac_addresses"),
            hostname_postfixes=hostname_postfixes,
        ):
            return True

        # search for combination of ip and hostname
        if two_value_combination_match(
            new_device.ips,
            ex_device.get("ips"),
            new_device.hostnames,
            ex_device.get("hostnames"),
            is_list2_hostname=True,
            hostname_postfixes=hostname_postfixes,
        ):
            return True

        # search for combination of hostname and mac_address
        if two_value_combination_match(
            new_device.hostnames,
            ex_device.get("hostnames"),
            new_device.mac_addresses,
            ex_device.get("mac_addresses"),
            is_list1_hostname=True,
            hostname_postfixes=hostname_postfixes,
        ):
            return True

        return False


    def get_device_details(self):
        # Return a list of unique devices
        return self.devices


    def _find_device(self, device_entry: DeviceEntry):
        for de in self.devices:
            res = self.is_match(
                de, device_entry, hostname_postfixes=self.hostname_postfixes
            )
            if res:
                return de
        return False

    def _find_device_by_id(self, device_id: str):
        for de in self.devices:
            if de.get("uuid") == device_id:
                return de
        return False


    def _remove_entry_content(
        self, product_name, product_uuid, entry_content, ex_device
    ):
        if ex_device.get("product_uuids")[product_uuid] == 1:
            del ex_device.get("product_uuids")[product_uuid]
            del ex_device.get("product_info")[product_name][
                product_uuid
            ]  # remove the entry content as well
        else:
            ex_device.get("product_uuids")[product_uuid] -= 1

        if ex_device.get("product_names")[product_name] == 1:
            del ex_device.get("product_names")[product_name]
            del ex_device.get("product_info")[
                product_name
            ]  # remove the product key from the products dict
        else:
            ex_device.get("product_names")[product_name] -= 1

        for ip in entry_content["ips"]:
            if ex_device.get("ips")[ip] == 1:
                del ex_device.get("ips")[ip]
            else:
                ex_device.get("ips")[ip] -= 1

        for mac_address in entry_content["mac_addresses"]:
            if ex_device.get("mac_addresses")[mac_address] == 1:
                del ex_device.get("mac_addresses")[mac_address]
            else:
                ex_device.get("mac_addresses")[mac_address] -= 1

        for hostname in entry_content["hostnames"]:
            if ex_device.get("hostnames")[hostname] == 1:
                del ex_device.get("hostnames")[hostname]
            else:
                ex_device.get("hostnames")[hostname] -= 1


    def _add_entry_content(self, product_name, product_uuid, entry_content, ex_device):
        if product_name in ex_device.get("product_names"):
            ex_device.get("product_names")[product_name] += 1
        else:
            ex_device.get("product_names")[product_name] = 1
            # ex_device.get("product_info")[product_name] = {}   # initiate with empty dict for product key

        if product_uuid in ex_device.get("product_uuids"):
            ex_device.get("product_uuids")[product_uuid] += 1
        else:
            ex_device.get("product_uuids")[product_uuid] = 1
            # ex_device.get("product_info")[product_name][product_uuid] = entry_content # added entry details to products obj

        ex_device.get("product_info").setdefault(product_name, {}).setdefault(
            product_uuid, entry_content
        )

        for ip in entry_content["ips"]:
            if ip in ex_device.get("ips"):
                ex_device.get("ips")[ip] += 1
            else:
                ex_device.get("ips")[ip] = 1

        for mac_address in entry_content["mac_addresses"]:
            if mac_address in ex_device.get("mac_addresses"):
                ex_device.get("mac_addresses")[mac_address] += 1
            else:
                ex_device.get("mac_addresses")[mac_address] = 1

        for hostname in entry_content["hostnames"]:
            if hostname in ex_device.get("hostnames"):
                ex_device.get("hostnames")[hostname] += 1
            else:
                ex_device.get("hostnames")[hostname] = 1


    def delete_device(self, device_obj, idx_in_device_list=None):
        if not idx_in_device_list:
            idx_in_device_list = self.devices.index(device_obj)
        
        self.devices.pop(idx_in_device_list)
        self.deleted_devices.append(device_obj.get("uuid"))


    def update_device_entry(self, existing_device, new_entry: DeviceEntry):
        # TODO - We need to combine product_name and product_uuid, somehow, product_uuid alone does not represent the right data

        new_entry_content = copy.deepcopy(vars(new_entry))
        del new_entry_content["product_name"]
        del new_entry_content["product_uuid"]

        if new_entry.product_name in existing_device.get(
            "product_names"
        ) and new_entry.product_uuid in existing_device.get("product_uuids"):
            existing_entry = (
                existing_device.get("product_info", {})
                .get(new_entry.product_name, {})
                .get(new_entry.product_uuid, {})
            )
            # existing entry present, and its older than new entry then only replace with the new entry
            if existing_entry["time"] <= new_entry_content["time"]:
                self._remove_entry_content(
                    new_entry.product_name,
                    new_entry.product_uuid,
                    existing_entry,
                    existing_device,
                )
                self._add_entry_content(
                    new_entry.product_name,
                    new_entry.product_uuid,
                    new_entry_content,
                    existing_device,
                )
            else:
                self.logger.info(
                    "No need to add the entry as there is already an entry exist with newer timestamp."
                )
        else:
            self._add_entry_content(
                new_entry.product_name,
                new_entry.product_uuid,
                new_entry_content,
                existing_device,
            )

        self.updated_devices.append(existing_device.get("uuid"))


    def _create_new_device(self):
        device_uuid = str(uuid.uuid4())
        return {
            "_key": device_uuid,
            "uuid": device_uuid,
            "product_info": dict(),
            "product_names": dict(),
            "product_uuids": dict(),
            "ips": dict(),
            "mac_addresses": dict(),
            "hostnames": dict(),
        }


    def add_device_entry(self, new_entry: DeviceEntry):
        # Assign a unique device_uuid to the device
        matching_device = self._find_device(new_entry)

        if matching_device:
            self.update_device_entry(matching_device, new_entry)
            return matching_device.get("uuid")

        else:
            # create uuid and create a new device and append to the list
            new_device = self._create_new_device()
            self.devices.append(new_device)
            self.update_device_entry(new_device, new_entry)
            return new_device.get("uuid")


    def cleanup(
        self, device, min_time, max_time=MAX_TIME_EPOCH, products_to_cleanup=None
    ):
        """
        products_to_cleanup is None meaning cleanup all products
        """
        products_copy = copy.deepcopy(device.get("product_info"))
        for product_name, product_items in products_copy.items():
            if products_to_cleanup and product_name not in products_to_cleanup:
                continue  # if product is not in the cleanup list, do not make any change

            for product_uuid, entry_details in product_items.items():
                if (
                    int(entry_details["time"]) < min_time
                    or int(entry_details["time"]) > max_time
                ):
                    self._remove_entry_content(
                        product_name, product_uuid, entry_details, device
                    )

        # if no entry exist for any device return false, otherwise return True, to indicate, the device itself needs to be removed.
        if len(device.get("product_names")) == 0:
            return False
        return True


    # TODO - At certain interval we need to run auto merging code -> reorganize_device_list
    # Why: Because lets with the same product_uuid if hostname and mac_address changed, which is not matching with the some other device
    def reorganize_device_list(self):
        # merging and cleaning
        """
        Why we need device merging:
            # scenario where two devices previously added created a new entry, when added a 3rd entry which is similar to first one but also with second one, linking them into one device

        Why we are not creating the whole list again:
            # we want to keep the original device uuid intact as much as possible
        """
        messages = []

        # iterate over devices from the back
        for i in range(len(self.devices) - 1, 0, -1):
            _device_entries = self._convert_device_to_deviceentry_obj(self.devices[i])

            for j in range(i - 1, -1, -1):
                # look for entries in all the previous entries, if similar entry found, merge all the entries with that and remove this device
                for de_entry in _device_entries:
                    res = self.is_match(
                        self.devices[j],
                        de_entry,
                        hostname_postfixes=self.hostname_postfixes,
                    )
                    if res:
                        messages.append(
                            "Device(uuid={}) will going to be merged with Device(uuid={}).".format(
                                self.devices[i].get("uuid"), self.devices[j].get("uuid")
                            )
                        )
                        for _entry in _device_entries:
                            self.update_device_entry(self.devices[j], _entry)
                        self.delete_device(self.devices[i], i)
                        break  # all the entries added to the device, duplicate device obj removed, break two loops
                else:
                    continue
                break
                # What's the logic for above two 3 lines:
                # break the parent look as well when match found as the device has already been merged to another device

        return messages


    def cleanup_devices(
        self, min_time, max_time=MAX_TIME_EPOCH, products_to_cleanup="*"
    ):
        """
        products_to_cleanup "*" meaning cleanup all products
        """
        if products_to_cleanup == "*":
            products_to_cleanup = None
        elif type(products_to_cleanup) == str:
            products_to_cleanup = [
                element.strip()
                for element in products_to_cleanup.split(",")
                if element.strip()
            ]
        elif type(products_to_cleanup) == list:
            pass
        else:
            raise Exception("products_to_cleanup value is not as expected.")

        messages = []

        idx = 0
        while idx < len(self.devices):
            is_device_still_valid = self.cleanup(
                self.devices[idx], min_time, max_time, products_to_cleanup
            )
            if not is_device_still_valid:
                messages.append(
                    "Device(uuid={}) has been deleted completely.".format(
                        self.devices[idx].get("uuid")
                    )
                )
                self.delete_device(self.devices[idx], idx)
            else:
                idx += 1

        return messages


    def manually_merge_devices(self, device1_id, *device_ids_to_merge):
        # Implement logic to manually specify that two or more devices are the same by their IDs
        _device1_obj = self._find_device_by_id(device1_id)
        if not _device1_obj:
            raise Exception("Device(uuid={}) not found.".format(device1_id))

        for _other_dev_id in device_ids_to_merge:
            _other_dev_obj = self._find_device_by_id(_other_dev_id)
            if not _other_dev_obj:
                raise Exception("Device(uuid={}) not found.".format(_other_dev_id))

            _device_entries = self._convert_device_to_deviceentry_obj(_other_dev_obj)

            for de_entry in _device_entries:
                self.update_device_entry(_device1_obj, de_entry)  # add the entries

            self.delete_device(_other_dev_obj)
            # remove the device after all entries merged to first device


    def _convert_device_to_deviceentry_obj(self, device_obj):
        device_entries = []
        for product_name, product_items in device_obj.get("product_info").items():
            for product_uuid, element_details in product_items.items():
                device_entries.append(
                    DeviceEntry(
                        product_name=product_name,
                        time=element_details["time"],
                        product_uuid=product_uuid,
                        ips=element_details["ips"],
                        mac_addresses=element_details["mac_addresses"],
                        hostnames=element_details["hostnames"],
                        custom_fields=element_details["custom_fields"],
                    )
                )
        return device_entries
