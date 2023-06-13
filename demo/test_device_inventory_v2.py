import os, sys
parent_dir = os.path.dirname
APP_BIN_PATH = os.path.join(parent_dir(parent_dir(__file__)), 'cyences_app_for_splunk', 'bin')
sys.path.insert(0, APP_BIN_PATH)

from device_inventory_util import DeviceField, DeviceEntry, DeviceManager


def test_define_device_manager():
    with DeviceManager() as dm:
        pass


def test_get_devices():
    with DeviceManager() as dm:
        _devices = dm.get_device_details()
        for de in _devices:
            print("{}".format(de))
        print("No. of devices = {}".format(len(_devices)))
        assert len(_devices) == 0


def test_add_device_entry():
    new_entry = DeviceEntry(product_name="Qualys", time=1234567, product_uuid="id_1", ips="10.0.0.1", mac_addresses="as:as:as:fd:w2", hostnames=["abc", "abc.crossrealms.com"], custom_fields={'available_vulnerabilities': 10, 'active_vulnerabilities': 5})
    with DeviceManager() as dm:
        dm.add_device_entry(new_entry)

        _devices = dm.get_device_details()
        for de in _devices:
            print("{}".format(de))
        print("No. of devices = {}".format(len(_devices)))
        assert len(_devices) == 1
        assert str(_devices[0]) == "{'product_names': ['Qualys'], 'product_uuids': ['id_1'], 'ips': ['10.0.0.1'], 'mac_addresses': ['as:as:as:fd:w2'], 'hostnames': ['abc', 'abc.crossrealms.com']}"


def test_add_entry_with_same_product_id():
    new_entry = DeviceEntry(product_name="Qualys", time=2345678, product_uuid="id_1", ips="10.0.2.2", mac_addresses="as:as:as:fd:22", hostnames=["xyz", "xyz.crossrealms.com"], custom_fields={'available_vulnerabilities': 10, 'active_vulnerabilities': 5})
    with DeviceManager() as dm:
        dm.add_device_entry(new_entry)

        _devices = dm.get_device_details()
        for de in _devices:
            print("{}".format(de))
        print("No. of devices = {}".format(len(_devices)))
        assert len(_devices) == 1
        assert str(_devices[0]) == "{'product_names': ['Qualys'], 'product_uuids': ['id_1'], 'ips': ['10.0.2.2'], 'mac_addresses': ['as:as:as:fd:22'], 'hostnames': ['xyz', 'xyz.crossrealms.com']}"


if __name__ == "__main__":
    os.remove('device_list.pickle')   # start from zero
    test_define_device_manager()
    test_get_devices()
    test_add_device_entry()
    test_add_entry_with_same_product_id()
