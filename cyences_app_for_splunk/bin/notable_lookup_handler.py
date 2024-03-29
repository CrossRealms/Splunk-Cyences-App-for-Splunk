
import json
import time
from datetime import datetime
import urllib.parse
import cs_utils
import splunk.rest as rest

KV_STORE_COLLECTION_NAME = 'cyences_notable_event_collection'
KV_STORE_COLLECTION_ROOT_URL = '/servicesNS/nobody/{}/storage/collections/data/{}'.format(
    cs_utils.APP_NAME, KV_STORE_COLLECTION_NAME)


DEFAULT_ASSIGNEE = 'Unassigned'
DEFAULT_STATUS = 'Untriaged'


class NotableEventLookupHandler:
    def __init__(self, logger, session_key, user_making_change) -> None:
        self.logger = logger
        self.session_key = session_key
        self.user_making_change = user_making_change


    def make_rest_request(self, uri, data = None, output_mode = 'json'):
        try:
            if data == None:
                if output_mode == 'default':
                    serverResponse, serverContent = rest.simpleRequest(uri, sessionKey=self.session_key)
                else:
                    serverResponse, serverContent = rest.simpleRequest(uri, sessionKey=self.session_key, getargs={'output_mode': 'json'})
            else:
                if output_mode == 'default':
                    serverResponse, serverContent = rest.simpleRequest(uri, sessionKey=self.session_key, jsonargs=data)
                else:
                    serverResponse, serverContent = rest.simpleRequest(uri, sessionKey=self.session_key, jsonargs=data, getargs={'output_mode': 'json'})
        except:
            self.logger.exception("An error occurred or no data was returned from the server query on uri={}.".format(uri))
            serverContent = None

        self.logger.debug("serverResponse: {}".format(serverResponse))
        self.logger.debug("serverContent: {}".format(serverContent.decode('utf-8')))

        if serverResponse.status not in [200, 201]:
            return None

        try:
            returnData = json.loads(serverContent.decode('utf-8'))
        except:
            self.logger.exception("An error occurred or no data was returned from the server query.")
            return None

        return returnData


    def get_notable_event_entries(self, notable_event_id):
        query = '{  "notable_event_id": "'+ notable_event_id +'"}'
        uri = '{}?query={}&sort=update_time'.format(KV_STORE_COLLECTION_ROOT_URL, urllib.parse.quote(query))
        return self.make_rest_request(uri, output_mode = 'default')


    def get_last_notable_event_entry(self, notable_event_id):
        incidents = self.get_notable_event_entries(notable_event_id)
        # Return only the latest incident_id
        if len(incidents) > 0:
            return incidents[len(incidents)-1]


    def update_entry(self, notable_event_id, assignee=None, status=None, comment="-"):
        incident = self.get_last_notable_event_entry(notable_event_id)

        is_changed = False
        
        if not incident:
            incident = dict()
            incident['notable_event_id'] = notable_event_id
            is_changed = True

        if assignee:
            incident['assignee'] = assignee
            is_changed = True

        if status:
            incident['status'] = status
            is_changed = True

        # Assign the default values if first time notable event is being processed for the lookup
        if 'assignee' not in incident:
            incident['assignee'] = 'Unassigned'
        if not status:
            incident['status'] = 'Untriaged'

        if is_changed:
            incident['update_time'] = time.time()
            incident['user_making_change'] = self.user_making_change
            incident['comment'] = comment
            if '_key' in incident:
                del incident['_key']
            entry = json.dumps(incident, sort_keys=True)
            uri = '{}'.format(KV_STORE_COLLECTION_ROOT_URL)
            response = self.make_rest_request(uri, entry)
            self.logger.info("Notable event lookup entry updated. notable_event_id={}".format(notable_event_id))
            return response
        else:
            self.logger.info("No change in the notable event. notable_event_id={}".format(notable_event_id))
            return True
