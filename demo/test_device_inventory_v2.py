import os, sys
parent_dir = os.path.dirname
APP_BIN_PATH = os.path.join(parent_dir(parent_dir(__file__)), 'cyences_app_for_splunk', 'bin')
sys.path.insert(0, APP_BIN_PATH)

from device_inventory_v2_util import DeviceField, DeviceEntry, DeviceManager



def assert_no_of_devices(expected_no_of_devices, actual_device_list):
    failure_msg = "Expected No. of devices = {}, Actual No. of devices = {}".format(expected_no_of_devices, len(actual_device_list))

    assert expected_no_of_devices == len(actual_device_list), failure_msg


def assert_device_details(expected_device_list, actual_device_list):
    actual_device_list = [str(ele) for ele in actual_device_list]

    failure_msg = "Expected device details = [\n"
    for ed in expected_device_list:
        failure_msg += "{},\n".format(ed)
    failure_msg += "]\n"

    failure_msg += "Actual device details = [\n"
    for ad in actual_device_list:
        failure_msg += "{},\n".format(ad)
    failure_msg += "]"

    # print(failure_msg)

    assert set(expected_device_list) == set(actual_device_list), failure_msg



def test_define_device_manager():
    with DeviceManager() as dm:
        pass


def test_get_devices():
    with DeviceManager() as dm:
        _devices = dm.get_device_details()
        assert len(_devices) == 0, \
            assert_no_of_devices(0, _devices)


DEVICE_DETAILS_1_1 = "{'product_names': ['Qualys'], 'product_uuids': ['id_1'], 'ips': ['10.0.0.1'], 'mac_addresses': ['as:as:as:fd:w2'], 'hostnames': ['abc', 'abc.crossrealms.com']}"

def test_add_device_entry():
    new_entry = DeviceEntry(product_name="Qualys", time=1234567, product_uuid="id_1", ips="10.0.0.1", mac_addresses="as:as:as:fd:w2", hostnames=["abc", "abc.crossrealms.com"], custom_fields={'available_vulnerabilities': 10, 'active_vulnerabilities': 5})
    with DeviceManager() as dm:
        dm.add_device_entry(new_entry)

        _devices = dm.get_device_details()
        assert_no_of_devices(1, _devices)
        assert_device_details([DEVICE_DETAILS_1_1], _devices)


def test_reading_pickle_file_still_has_device_details():
    with DeviceManager() as dm:
        _devices = dm.get_device_details()
        assert_no_of_devices(1, _devices)


DEVICE_DETAILS_1_2 = "{'product_names': ['Qualys'], 'product_uuids': ['id_1'], 'ips': ['10.0.2.2'], 'mac_addresses': ['as:as:as:fd:22'], 'hostnames': ['xyz', 'xyz.crossrealms.com']}"

def test_add_entry_with_same_product_id():
    new_entry = DeviceEntry(product_name="Qualys", time=2345678, product_uuid="id_1", ips="10.0.2.2", mac_addresses="as:as:as:fd:22", hostnames=["xyz", "xyz.crossrealms.com"], custom_fields={'available_vulnerabilities': 10, 'active_vulnerabilities': 5})
    with DeviceManager() as dm:
        dm.add_device_entry(new_entry)

        _devices = dm.get_device_details()
        assert_no_of_devices(1, _devices)
        assert_device_details([DEVICE_DETAILS_1_2], _devices)


DEVICE_DETAILS_2 = "{'product_names': ['Qualys'], 'product_uuids': ['id_2'], 'ips': ['192.168.1.1', '192.168.2.2'], 'mac_addresses': ['xx:xx:xx:xx:11'], 'hostnames': []}"

def test_add_another_device_entry():
    new_entry = DeviceEntry(product_name="Qualys", time=3456789, product_uuid="id_2", ips=["192.168.1.1", "192.168.2.2"], mac_addresses="xx:xx:xx:xx:11", hostnames=None, custom_fields={'available_vulnerabilities': 1, 'active_vulnerabilities': 1})
    with DeviceManager() as dm:
        dm.add_device_entry(new_entry)

        _devices = dm.get_device_details()
        assert_no_of_devices(2, _devices)
        assert_device_details([DEVICE_DETAILS_1_2, DEVICE_DETAILS_2], _devices)


DEVICE_DETAILS_3 = "{'product_names': ['Tenable'], 'product_uuids': ['my_1'], 'ips': [], 'mac_addresses': ['sf:yy:yy:us:43'], 'hostnames': ['wonderful-tenable']}"

def test_add_new_product_entry():
    new_entry = DeviceEntry(product_name="Tenable", time=3456789, product_uuid="my_1", ips=[], mac_addresses=["sf:yy:yy:us:43"], hostnames="wonderful-tenable", custom_fields={'abc': 1, 'xyz': "my_xyz"})
    with DeviceManager() as dm:
        dm.add_device_entry(new_entry)

        _devices = dm.get_device_details()
        assert_no_of_devices(3, _devices)
        assert_device_details([DEVICE_DETAILS_1_2, DEVICE_DETAILS_2, DEVICE_DETAILS_3], _devices)



if __name__ == "__main__":
    os.remove('device_list.pickle')   # start from zero
    test_define_device_manager()
    test_get_devices()
    test_add_device_entry()
    test_reading_pickle_file_still_has_device_details()
    test_add_entry_with_same_product_id()
    test_add_another_device_entry()
    test_add_new_product_entry()
