# User Inventory

import uuid
import copy
import json
import cs_utils

from splunk import rest


MAX_TIME_EPOCH = 2147483647  # Tue Jan 19 2038 03:14:07


def remove_words_from_end(sentence, words):
    for word in words:
        if sentence.endswith(word.lower()):
            sentence = sentence[: -len(word)]
    return sentence


def user_match(
    new_user,
    ex_user_list,
    user_postfixes=[],
):
    updated_new_user = remove_words_from_end(new_user.lower(), user_postfixes)
    updated_ex_user_list = [
        remove_words_from_end(element.lower(), user_postfixes)
        for element in ex_user_list
        if element
    ]

    if updated_new_user in updated_ex_user_list:
        return True

    return False


def is_user_ends_with(user, user_ends_with=[], user_postfixes=[]):
    user = user.lower()
    for postfix in user_postfixes:
        if user.endswith(postfix.lower()):
            user = user[: -len(postfix)]
            break
    for usr_postfix in user_ends_with:
        if user.endswith(usr_postfix.lower()):
            return True
    return False


class UserEntry:
    def __init__(
        self,
        product_name: str,
        indextime: int,
        user: str,
        indexes,
        sourcetypes,
        user_types,
        custom_fields: dict = {},
    ) -> None:
        self.product_name = product_name
        self.indextime = indextime
        self.user = user
        self.indexes = self._internal_check_list_field_format(indexes)
        self.sourcetypes = self._internal_check_list_field_format(sourcetypes)
        self.user_types = self._internal_check_list_field_format(user_types)
        self.custom_fields = custom_fields

    def _internal_check_list_field_format(self, field):
        if field is None:
            return []
        elif type(field) == str:
            return [field.lower()]
        elif type(field) == list:
            return [element.lower() for element in field]
        else:
            raise Exception(
                "Unexpected field format. Allowed only str and list of string."
            )


class UserManager:
    """
    Use Example:
        with UserManager(session_key, logger, user_postfixes) as dm:
            new_user_entry = UserEntry(...)
            user_uuid = dm.add_user_entry(new_user_entry)
    """

    def __init__(self, session_key, logger, collection_name, user_postfixes=""):
        self.session_key = session_key
        self.logger = logger
        self.collection_name = collection_name
        self.user_postfixes = [
            element.strip() for element in user_postfixes.strip('"').split(",") if element.strip()
        ]
        self.updated_users = []
        self.deleted_users = []
        self.users = self.read_kvstore_lookup(self.collection_name)

    def _convert_str_to_dict(self, lookup_data):
        lookup_data = lookup_data if lookup_data else []
        for usr in lookup_data:
            usr["user_info"] = json.loads(usr["user_info"])
            usr["product_names"] = json.loads(usr["product_names"])
            usr["user_types"] = json.loads(usr["user_types"])
            usr["indexes"] = json.loads(usr["indexes"])
            usr["sourcetypes"] = json.loads(usr["sourcetypes"])
            usr["users"] = json.loads(usr["users"])
        return lookup_data

    def read_kvstore_lookup(self, collection_name):
        _, serverContent = rest.simpleRequest(
            "/servicesNS/nobody/{}/storage/collections/data/{}?output_mode=json".format(
                cs_utils.APP_NAME, collection_name
            ),
            method="GET",
            sessionKey=self.session_key,
            raiseAllErrors=True,
        )
        return self._convert_str_to_dict(json.loads(serverContent))

    def _convert_dict_to_str(self, users_to_update):
        for usr in users_to_update:
            usr["user_info"] = json.dumps(usr["user_info"])
            usr["product_names"] = json.dumps(usr["product_names"])
            usr["user_types"] = json.dumps(usr["user_types"])
            usr["indexes"] = json.dumps(usr["indexes"])
            usr["sourcetypes"] = json.dumps(usr["sourcetypes"])
            usr["users"] = json.dumps(usr["users"])
        return users_to_update

    def update_kvstore_lookup(self, collection_name, users_to_update=[]):
        if users_to_update:
            users_to_update = self._convert_dict_to_str(users_to_update)
            # splunk.BadRequest: [HTTP 400] Bad Request; [{'type': 'ERROR', 'code': None, 'text': 'Request exceeds API limits - see limits.conf for details. (Too many documents for a single batch save, max_documents_per_batch_save=1000)'}]
            if len(users_to_update) < 1000:
                jsonargs = json.dumps(users_to_update)
                _ = rest.simpleRequest(
                    "/servicesNS/nobody/{}/storage/collections/data/{}/batch_save?output_mode=json".format(
                        cs_utils.APP_NAME, collection_name
                    ),
                    method="POST",
                    jsonargs=jsonargs,
                    sessionKey=self.session_key,
                    raiseAllErrors=True,
                )
            else:
                updated_data_full = [
                    users_to_update[i: i + 800] for i in range(0, len(users_to_update), 800)
                ]  # send max 800 in each chunk
                for chunk in updated_data_full:
                    jsonargs = json.dumps(chunk)
                    _ = rest.simpleRequest(
                        "/servicesNS/nobody/{}/storage/collections/data/{}/batch_save?output_mode=json".format(
                            cs_utils.APP_NAME, collection_name
                        ),
                        method="POST",
                        jsonargs=jsonargs,
                        sessionKey=self.session_key,
                        raiseAllErrors=True,
                    )
            self.logger.info(
                "Updated {} entries in the lookup.".format(len(users_to_update))
            )

        else:
            self.logger.info("No users to update in the KVStore lookup.")

    def delete_kvstore_entry(self, collection_name, key):
        try:
            _ = rest.simpleRequest(
                "/servicesNS/nobody/{}/storage/collections/data/{}/{}".format(
                    cs_utils.APP_NAME, collection_name, key
                ),
                method="DELETE",
                sessionKey=self.session_key,
                raiseAllErrors=True,
            )
        except Exception as e:
            self.logger.info("Unable to delete the user. error={}".format(str(e)))

    def get_as_dict(self, user):
        all_times = []
        for product_name, product_items in user.get("user_info").items():
            for _, element_details in product_items.items():
                all_times.append(element_details['indextime'])

        return {
            'uuid': user.get("uuid"),
            'latest_indextime': max(all_times),
            'product_names': list(user.get("product_names").keys()),
            'user_types': list(user.get("user_types").keys()),
            'indexes': list(user.get("indexes").keys()),
            'sourcetypes': list(user.get("sourcetypes").keys()),
            'users': list(user.get("users").keys())
        }

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        users_to_update = []

        self.deleted_users = list(set(self.deleted_users))
        self.updated_users = list(set(self.updated_users))

        for _key_to_delete in self.deleted_users:
            self.delete_kvstore_entry(self.collection_name, _key_to_delete)

        for _user_obj in self.users:
            _uuid = _user_obj.get("uuid")

            if _uuid in self.updated_users:
                users_to_update.append(_user_obj)

        self.update_kvstore_lookup(self.collection_name, users_to_update)

    @staticmethod
    def is_match(ex_user, new_user: UserEntry, user_postfixes=[]):
        if user_match(
            new_user.user,
            ex_user.get("users"),
            user_postfixes=user_postfixes,
        ):
            return True
        return False

    def get_matching_user(self, user_entry: UserEntry):
        # return matching user
        for usr in self.users:
            if self.is_match(usr, user_entry, user_postfixes=self.user_postfixes):
                return self.get_as_dict(usr)

    def get_user_details(self):
        # Return a list of unique users
        _users = []
        for usr in self.users:
            _users.append(self.get_as_dict(usr))
        return _users

    def _find_user(self, user_entry: UserEntry):
        if is_user_ends_with(user_entry.user, user_ends_with=["$"], user_postfixes=self.user_postfixes):
            return None
        for usr in self.users:
            res = self.is_match(
                usr, user_entry, user_postfixes=self.user_postfixes
            )
            if res:
                return usr
        return False

    def _find_user_by_id(self, user_id: str):
        for usr in self.users:
            if usr.get("uuid") == user_id:
                return usr
        return False

    def _remove_entry_content(
        self, product_name, user, entry_content, ex_user
    ):
        if ex_user.get("users")[user] == 1:
            del ex_user.get("users")[user]
            del ex_user.get("user_info")[product_name][
                user
            ]  # remove the entry content as well
        else:
            ex_user.get("users")[user] -= 1

        if ex_user.get("product_names")[product_name] == 1:
            del ex_user.get("product_names")[product_name]
            del ex_user.get("user_info")[
                product_name
            ]  # remove the product key from the products dict
        else:
            ex_user.get("product_names")[product_name] -= 1

        for index in entry_content["indexes"]:
            if ex_user.get("indexes")[index] == 1:
                del ex_user.get("indexes")[index]
            else:
                ex_user.get("indexes")[index] -= 1

        for sourcetype in entry_content["sourcetypes"]:
            if ex_user.get("sourcetypes")[sourcetype] == 1:
                del ex_user.get("sourcetypes")[sourcetype]
            else:
                ex_user.get("sourcetypes")[sourcetype] -= 1

        for user_type in entry_content["user_types"]:
            if ex_user.get("user_types")[user_type] == 1:
                del ex_user.get("user_types")[user_type]
            else:
                ex_user.get("user_types")[user_type] -= 1

    def _add_entry_content(self, product_name, user, entry_content, ex_user):
        if product_name in ex_user.get("product_names"):
            ex_user.get("product_names")[product_name] += 1
        else:
            ex_user.get("product_names")[product_name] = 1

        if user in ex_user.get("users"):
            ex_user.get("users")[user] += 1
        else:
            ex_user.get("users")[user] = 1

        ex_user.get("user_info").setdefault(product_name, {}).setdefault(
            user, entry_content
        )

        for index in entry_content["indexes"]:
            if index in ex_user.get("indexes"):
                ex_user.get("indexes")[index] += 1
            else:
                ex_user.get("indexes")[index] = 1

        for sourcetype in entry_content["sourcetypes"]:
            if sourcetype in ex_user.get("sourcetypes"):
                ex_user.get("sourcetypes")[sourcetype] += 1
            else:
                ex_user.get("sourcetypes")[sourcetype] = 1

        for user_type in entry_content["user_types"]:
            if user_type in ex_user.get("user_types"):
                ex_user.get("user_types")[user_type] += 1
            else:
                ex_user.get("user_types")[user_type] = 1

    def delete_user(self, user_obj, idx_in_user_list=None):
        if not idx_in_user_list:
            idx_in_user_list = self.users.index(user_obj)
        
        self.deleted_users.append(user_obj.get("uuid"))
        self.users.pop(idx_in_user_list)

    def update_user_entry(self, existing_user, new_entry: UserEntry):
        new_entry_content = copy.deepcopy(vars(new_entry))
        del new_entry_content["product_name"]
        del new_entry_content["user"]

        # gives the user details of existing_entry only if it contains the same product_name and user.
        existing_entry = (
            existing_user.get("user_info", {})
            .get(new_entry.product_name, {})
            .get(new_entry.user, {})
        )

        if existing_entry:
            # existing entry present, and its older than new entry then only replace with the new entry
            if existing_entry["indextime"] <= new_entry_content["indextime"]:
                self._remove_entry_content(
                    new_entry.product_name,
                    new_entry.user,
                    existing_entry,
                    existing_user,
                )
                self._add_entry_content(
                    new_entry.product_name,
                    new_entry.user,
                    new_entry_content,
                    existing_user,
                )
            else:
                self.logger.info(
                    "No need to add the entry as there is already an entry exist with newer timestamp."
                )
        else:
            self._add_entry_content(
                new_entry.product_name,
                new_entry.user,
                new_entry_content,
                existing_user,
            )

        self.updated_users.append(existing_user.get("uuid"))

    def _create_new_user(self):
        user_uuid = str(uuid.uuid4())
        return {
            "_key": user_uuid,
            "uuid": user_uuid,
            "user_info": dict(),
            "product_names": dict(),
            "user_types": dict(),
            "indexes": dict(),
            "sourcetypes": dict(),
            "users": dict(),
        }

    def add_user_entry(self, new_entry: UserEntry):
        # Assign a unique user_uuid to the user
        matching_user = self._find_user(new_entry)

        if matching_user is None:
            return "n/a"

        if matching_user:
            self.update_user_entry(matching_user, new_entry)
            return matching_user.get("uuid")

        else:
            # create uuid and create a new user and append to the list
            new_user = self._create_new_user()
            self.users.append(new_user)
            self.update_user_entry(new_user, new_entry)
            return new_user.get("uuid")

    def cleanup(
        self, user, min_indextime, max_indextime=MAX_TIME_EPOCH, products_to_cleanup=None
    ):
        """
        products_to_cleanup is None meaning cleanup all products
        """
        products_copy = copy.deepcopy(user.get("user_info"))
        for product_name, product_items in products_copy.items():
            if products_to_cleanup and product_name not in products_to_cleanup:
                continue  # if product is not in the cleanup list, do not make any change

            for _user, entry_details in product_items.items():
                if (
                    int(float(entry_details["indextime"])) < min_indextime
                    or int(float(entry_details["indextime"])) > max_indextime
                ):
                    self._remove_entry_content(
                        product_name, _user, entry_details, user
                    )
                    self.updated_users.append(user.get("uuid"))

        # if no entry exist for any user return false, otherwise return True, to indicate, the user itself needs to be removed.
        if len(user.get("product_names")) == 0:
            return False
        return True

    # TODO - At certain interval we need to run auto merging code -> reorganize_user_list
    # Why: Because lets with the same user_type if user and sourcetype changed, which is not matching with the some other user
    def reorganize_user_list(self):
        # merging and cleaning
        """
        Why we need user merging:
            # scenario where two users previously added created a new entry, when added a 3rd entry which is similar to first one but also with second one, linking them into one user

        Why we are not creating the whole list again:
            # we want to keep the original user uuid intact as much as possible
        """
        messages = []

        # iterate over users from the back
        for i in range(len(self.users) - 1, 0, -1):
            _user_entries = self._convert_user_to_userentry_obj(self.users[i])

            for j in range(i - 1, -1, -1):
                # look for entries in all the previous entries, if similar entry found, merge all the entries with that and remove this user
                for de_entry in _user_entries:
                    res = self.is_match(
                        self.users[j],
                        de_entry,
                        user_postfixes=self.user_postfixes,
                    )
                    if res:
                        messages.append(
                            "User(uuid={}) will going to be merged with User(uuid={}).".format(
                                self.users[i].get("uuid"), self.users[j].get("uuid")
                            )
                        )
                        for _entry in _user_entries:
                            self.update_user_entry(self.users[j], _entry)
                        self.delete_user(self.users[i], i)
                        break  # all the entries added to the user, duplicate user obj removed, break two loops
                else:
                    continue
                break
                # What's the logic for above two 3 lines:
                # break the parent loop as well when match found as the user has already been merged to another user

        return messages

    def cleanup_users(
        self, min_indextime, max_indextime=MAX_TIME_EPOCH, products_to_cleanup=None
    ):
        """
        products_to_cleanup is None meaning cleanup all products
        """
        messages = []

        idx = 0
        while idx < len(self.users):
            is_user_still_valid = self.cleanup(
                self.users[idx], min_indextime, max_indextime, products_to_cleanup
            )
            if not is_user_still_valid:
                messages.append(
                    "User(uuid={}) has been deleted completely.".format(
                        self.users[idx].get("uuid")
                    )
                )
                self.delete_user(self.users[idx], idx)
            else:
                idx += 1

        return messages

    def manually_merge_users(self, user1_id, *user_ids_to_merge):
        # Implement logic to manually specify that two or more users are the same by their IDs
        messages = []
        _user1_obj = self._find_user_by_id(user1_id)
        if not _user1_obj:
            raise Exception("User(uuid={}) not found.".format(user1_id))

        for _other_dev_id in user_ids_to_merge:
            _other_dev_obj = self._find_user_by_id(_other_dev_id)
            if not _other_dev_obj:
                raise Exception("User(uuid={}) not found.".format(_other_dev_id))
            
            messages.append(
                "User(uuid={}) will going to be merged with User(uuid={}).".format(
                    _other_dev_id, user1_id
                )
            )
            _user_entries = self._convert_user_to_userentry_obj(_other_dev_obj)

            for de_entry in _user_entries:
                self.update_user_entry(_user1_obj, de_entry)  # add the entries

            self.delete_user(_other_dev_obj)
            # remove the user after all entries merged to first user
        return messages

    def _convert_user_to_userentry_obj(self, user_obj):
        user_entries = []
        for product_name, product_items in user_obj.get("user_info").items():
            for user, element_details in product_items.items():
                user_entries.append(
                    UserEntry(
                        product_name=product_name,
                        indextime=element_details["indextime"],
                        user=user,
                        indexes=element_details["indexes"],
                        sourcetypes=element_details["sourcetypes"],
                        user_types=element_details["user_types"],
                        custom_fields=element_details["custom_fields"],
                    )
                )
        return user_entries
