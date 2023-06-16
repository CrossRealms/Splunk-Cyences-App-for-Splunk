import os, sys
import hashlib

parent_dir = os.path.dirname
APP_BIN_PATH = os.path.join(parent_dir(parent_dir(__file__)), 'cyences_app_for_splunk', 'bin')
sys.path.insert(0, APP_BIN_PATH)

from device_inventory_v2_util import DeviceField, DeviceEntry, DeviceManager


HOSTNAME_POSTFIX = ".crossrealms.com"


def assert_no_of_devices(expected_no_of_devices, actual_device_list):
    failure_msg = "Expected No. of devices = {}, Actual No. of devices = {}".format(expected_no_of_devices, len(actual_device_list))

    assert expected_no_of_devices == len(actual_device_list), failure_msg


def assert_device_details(expected_device_list, actual_device_list):
    failure_msg = "Expected device details = [\n"
    for ed in expected_device_list:
        failure_msg += "{},\n".format(ed)
    failure_msg += "]\n"

    failure_msg += "Actual device details = [\n"
    for ad in actual_device_list:
        failure_msg += "{},\n".format(ad)
    failure_msg += "]"

    # print(failure_msg)

    actual_device_list_updated = []
    for ele in actual_device_list:
        assert ele != None, failure_msg
        del ele['uuid']
        actual_device_list_updated.append(hashlib.sha256(str(ele).encode('utf-8')).hexdigest())

    expected_device_list_updated = []
    for ele in expected_device_list:
        expected_device_list_updated.append(hashlib.sha256(ele.encode('utf-8')).hexdigest())

    assert expected_device_list_updated == actual_device_list_updated, failure_msg



def test_define_device_manager():
    with DeviceManager() as dm:
        pass


def test_get_devices():
    with DeviceManager() as dm:
        _devices = dm.get_device_details()
        assert len(_devices) == 0, \
            assert_no_of_devices(0, _devices)


DEVICE_DETAILS_1_1 = "{'latest_time': 1234567, 'product_names': ['Qualys'], 'product_uuids': ['id_1'], 'ips': ['10.0.0.1'], 'mac_addresses': ['as:as:as:fd:w2'], 'hostnames': ['abc', 'abc.crossrealms.com']}"

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


DEVICE_DETAILS_1_2 = "{'latest_time': 2345678, 'product_names': ['Qualys'], 'product_uuids': ['id_1'], 'ips': ['10.0.2.2'], 'mac_addresses': ['as:as:as:fd:22'], 'hostnames': ['xyz', 'xyz.crossrealms.com']}"

def test_add_entry_with_same_product_id():
    new_entry = DeviceEntry(product_name="Qualys", time=2345678, product_uuid="id_1", ips="10.0.2.2", mac_addresses="as:as:as:fd:22", hostnames=["xyz", "xyz.crossrealms.com"], custom_fields={'available_vulnerabilities': 10, 'active_vulnerabilities': 5})
    with DeviceManager() as dm:
        dm.add_device_entry(new_entry)

        _devices = dm.get_device_details()
        assert_no_of_devices(1, _devices)
        assert_device_details([DEVICE_DETAILS_1_2], _devices)


DEVICE_DETAILS_2 = "{'latest_time': 3456789, 'product_names': ['Qualys'], 'product_uuids': ['id_2'], 'ips': ['192.168.1.1', '192.168.2.2'], 'mac_addresses': ['xx:xx:xx:xx:11'], 'hostnames': []}"

def test_add_another_device_entry():
    new_entry = DeviceEntry(product_name="Qualys", time=3456789, product_uuid="id_2", ips=["192.168.1.1", "192.168.2.2"], mac_addresses="xx:xx:xx:xx:11", hostnames=None, custom_fields={'available_vulnerabilities': 1, 'active_vulnerabilities': 1})
    with DeviceManager() as dm:
        dm.add_device_entry(new_entry)

        _devices = dm.get_device_details()
        assert_no_of_devices(2, _devices)
        assert_device_details([DEVICE_DETAILS_1_2, DEVICE_DETAILS_2], _devices)


DEVICE_DETAILS_3 = "{'latest_time': 3456789, 'product_names': ['Tenable'], 'product_uuids': ['my_1'], 'ips': ['1.1.1.1'], 'mac_addresses': ['sf:yy:yy:us:43'], 'hostnames': ['wonderful-tenable']}"

def test_add_new_product_entry():
    new_entry = DeviceEntry(product_name="Tenable", time=3456789, product_uuid="my_1", ips="1.1.1.1", mac_addresses=["sf:yy:yy:us:43"], hostnames="wonderful-tenable", custom_fields={'abc': 1, 'xyz': "my_xyz"})
    with DeviceManager() as dm:
        dm.add_device_entry(new_entry)

        _devices = dm.get_device_details()
        assert_no_of_devices(3, _devices)
        assert_device_details([DEVICE_DETAILS_1_2, DEVICE_DETAILS_2, DEVICE_DETAILS_3], _devices)


def test_device_match_func_1():
    # same product, same uuid
    new_entry = DeviceEntry(product_name="Tenable", time=3456789, product_uuid="my_1", ips="2.3.4.5", mac_addresses=["sf:22:y2:us:43"], hostnames="w-tenable")
    with DeviceManager(HOSTNAME_POSTFIX) as dm:
        _device = dm.get_matching_device(new_entry)
        assert_device_details([DEVICE_DETAILS_3], [_device])


def test_device_match_func_2():
    # same product, same different uuid
    new_entry = DeviceEntry(product_name="Tenable", time=3456789, product_uuid="anything", ips="2.3.4.5", mac_addresses=["sf:22:y2:us:43"], hostnames="w-tenable")
    with DeviceManager(HOSTNAME_POSTFIX) as dm:
        _device = dm.get_matching_device(new_entry)
        assert _device == None


def test_device_match_func_3():
    # same product, different uuid, same ip and mac_address
    new_entry = DeviceEntry(product_name="Tenable", time=3456789, product_uuid="anything", ips="1.1.1.1", mac_addresses=["sf:yy:yy:us:43"], hostnames=None)
    with DeviceManager(HOSTNAME_POSTFIX) as dm:
        _device = dm.get_matching_device(new_entry)
        assert_device_details([DEVICE_DETAILS_3], [_device])


def test_device_match_func_4():
    # same product, different uuid, same ip and hostname
    new_entry = DeviceEntry(product_name="Tenable", time=3456789, product_uuid="anything", ips="1.1.1.1", mac_addresses=["sf:yy:yy:us:43"], hostnames='wonderful-tenable')
    with DeviceManager(HOSTNAME_POSTFIX) as dm:
        _device = dm.get_matching_device(new_entry)
        assert_device_details([DEVICE_DETAILS_3], [_device])


def test_device_match_func_5():
    # same product, different uuid, same ip and hostname, but hostname given in new entry has postfix
    new_entry = DeviceEntry(product_name="Tenable", time=3456789, product_uuid="anything", ips="1.1.1.1", mac_addresses=["sf:yy:yy:us:43"], hostnames='wonderful-tenable.crossrealms.com')
    with DeviceManager(HOSTNAME_POSTFIX) as dm:
        _device = dm.get_matching_device(new_entry)
        assert_device_details([DEVICE_DETAILS_3], [_device])


def test_device_match_func_6():
    # different product, different uuid, same hostname and mac_address
    new_entry = DeviceEntry(product_name="Anything", time=3456789, product_uuid="anything", ips="2.3.4.5", mac_addresses=["sf:yy:yy:us:43"], hostnames="wonderful-tenable")
    with DeviceManager(HOSTNAME_POSTFIX) as dm:
        _device = dm.get_matching_device(new_entry)
        assert_device_details([DEVICE_DETAILS_3], [_device])


def test_device_match_func_7():
    # same product, different uuid, same ip and different mac_address, different hostname
    new_entry = DeviceEntry(product_name="Tenable", time=3456789, product_uuid="anything", ips="1.1.1.1", mac_addresses=["sf:yy:pp:us:43"], hostnames=None)
    with DeviceManager(HOSTNAME_POSTFIX) as dm:
        _device = dm.get_matching_device(new_entry)
        assert _device == None


def test_device_match_func_8():
    # different product, same uuid
    new_entry = DeviceEntry(product_name="Anything", time=3456789, product_uuid="my_1", ips="2.3.4.5", mac_addresses=["sf:22:y2:us:43"], hostnames="w-tenable")
    with DeviceManager(HOSTNAME_POSTFIX) as dm:
        _device = dm.get_matching_device(new_entry)
        assert _device == None


def test_device_match_func_9():
    # different product, different uuid, same ip and hostname, but hostname given in new entry has postfix
    new_entry = DeviceEntry(product_name="Anything", time=3456789, product_uuid="anything", ips="1.1.1.1", mac_addresses=["sf:yy:yy:us:43"], hostnames='wonderful-tenable.crossrealms.com')
    with DeviceManager(HOSTNAME_POSTFIX) as dm:
        _device = dm.get_matching_device(new_entry)
        assert_device_details([DEVICE_DETAILS_3], [_device])


def test_final_device_list_still_unchanged():
    with DeviceManager() as dm:
        _devices = dm.get_device_details()
        assert_no_of_devices(3, _devices)
        assert_device_details([DEVICE_DETAILS_1_2, DEVICE_DETAILS_2, DEVICE_DETAILS_3], _devices)


DEVICE_DETAILS_4_1 = "{'latest_time': 3456781, 'product_names': ['Lansweeper'], 'product_uuids': ['lan_1'], 'ips': ['1.1.2.2'], 'mac_addresses': ['aa:bb:cc:dd:ee'], 'hostnames': ['abcd']}"
DEVICE_DETAILS_5 = "{'latest_time': 3456782, 'product_names': ['Lansweeper'], 'product_uuids': ['lan_2'], 'ips': ['1.1.3.3'], 'mac_addresses': ['pp:bb:cc:dd:zz'], 'hostnames': ['pqst']}"
DEVICE_DETAILS_4_2 = "{'latest_time': 3456783, 'product_names': ['Lansweeper'], 'product_uuids': ['lan_1', 'lan_3'], 'ips': ['1.1.2.2', '1.1.3.3'], 'mac_addresses': ['aa:bb:cc:dd:ee', 'pp:bb:cc:dd:zz'], 'hostnames': ['abcd', 'wxyz']}"
DEVICE_DETAILS_4_3 = "{'latest_time': 3456783, 'product_names': ['Lansweeper'], 'product_uuids': ['lan_1', 'lan_3', 'lan_2'], 'ips': ['1.1.2.2', '1.1.3.3'], 'mac_addresses': ['aa:bb:cc:dd:ee', 'pp:bb:cc:dd:zz'], 'hostnames': ['abcd', 'wxyz', 'pqst']}"


def test_merging_devices():
    # scenario where two devices previously added created a new entry, when added a 3rd entry which is similar to first one but also with second one, linking them into one device
    with DeviceManager(HOSTNAME_POSTFIX) as dm:
        new_entry_1 = DeviceEntry(product_name="Lansweeper", time=3456781, product_uuid="lan_1", ips="1.1.2.2", mac_addresses=["aa:bb:cc:dd:ee"], hostnames="abcd")
        device_1_uuid = dm.add_device_entry(new_entry_1)   # 4 entries

        new_entry_2 = DeviceEntry(product_name="Lansweeper", time=3456782, product_uuid="lan_2", ips="1.1.3.3", mac_addresses=["pp:bb:cc:dd:zz"], hostnames="pqst")
        device_2_uuid = dm.add_device_entry(new_entry_2)   # 5 entries

        _devices = dm.get_device_details()
        assert_no_of_devices(5, _devices)
        assert_device_details([DEVICE_DETAILS_1_2, DEVICE_DETAILS_2, DEVICE_DETAILS_3, DEVICE_DETAILS_4_1, DEVICE_DETAILS_5], _devices)

        new_entry_3 = DeviceEntry(product_name="Lansweeper", time=3456783, product_uuid="lan_3", ips="1.1.3.3", mac_addresses=["pp:bb:cc:dd:zz", "aa:bb:cc:dd:ee"], hostnames=["wxyz", "abcd"])
        device_3_uuid = dm.add_device_entry(new_entry_3)   # 5 entries (1st and 3rd entry here has common Mac Address and Hostname)

        _devices = dm.get_device_details()
        assert_no_of_devices(5, _devices)
        assert_device_details([DEVICE_DETAILS_1_2, DEVICE_DETAILS_2, DEVICE_DETAILS_3, DEVICE_DETAILS_4_2, DEVICE_DETAILS_5], _devices)

        merge_messages = dm.reorganize_device_list()   # write it in such a way that cleanup don't execute

        assert len(merge_messages) == 1, "There should be one device merged into another 1 device."
        assert merge_messages[0] == "Device(uuid={}) will going to be merged with Device(uuid={}).".format(device_2_uuid, device_1_uuid), \
                "Device(uuid={}) should be merged to Device(uuid={}), but it isn't.".format(device_2_uuid, device_1_uuid)

        # not it should have just 4 entries in total as all of the above should be combined into one.
        _devices = dm.get_device_details()
        assert_no_of_devices(4, _devices)
        assert_device_details([DEVICE_DETAILS_1_2, DEVICE_DETAILS_2, DEVICE_DETAILS_3, DEVICE_DETAILS_4_3], _devices)




if __name__ == "__main__":
    os.remove('device_list.pickle')   # start from zero
    test_define_device_manager()
    test_get_devices()
    test_add_device_entry()
    test_reading_pickle_file_still_has_device_details()
    test_add_entry_with_same_product_id()
    test_add_another_device_entry()
    test_add_new_product_entry()

    test_device_match_func_1()
    test_device_match_func_2()
    test_device_match_func_3()
    test_device_match_func_4()
    test_device_match_func_5()
    test_device_match_func_6()
    test_device_match_func_7()
    test_device_match_func_8()
    test_device_match_func_9()
    test_final_device_list_still_unchanged()

    test_merging_devices()
