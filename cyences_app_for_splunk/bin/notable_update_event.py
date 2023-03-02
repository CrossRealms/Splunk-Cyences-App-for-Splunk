import sys

from splunklib.searchcommands import dispatch, StreamingCommand, Configuration, Option, validators
import cs_utils
from notable_lookup_handler import NotableEventLookupHandler

import logging
import logger_manager
logger = logger_manager.setup_logging('notable_event_update', logging.DEBUG)


@Configuration(local=True)
class NotableEventUpdate(StreamingCommand):

    def stream(self, records):
        try:
            session_key = cs_utils.GetSessionKey(logger).from_custom_command(self)

            user_making_change = self._metadata.searchinfo.username
            nehlh = NotableEventLookupHandler(logger, session_key, user_making_change=user_making_change)

            for entry in records:
                logger.debug("Updating notable event KVstore entry for: {}".format(entry))
                if 'notable_event_id' not in entry:
                    yield {"error_msg": "notable_event_id field must exist"}
                    continue

                notable_event_id = entry['notable_event_id']

                if 'assignee' not in entry:
                    logger.debug("assignee field does not exist, setting up the previous value. notable_event_id={}".format(notable_event_id))
                    entry['assignee'] = None
                if 'status' not in entry:
                    logger.debug("status field does not exist, setting up the previous value. notable_event_id={}".format(notable_event_id))
                    entry['status'] = None
                if 'comment' not in entry:
                    logger.debug("comment field does not exist, setting up with the default value. notable_event_id={}".format(notable_event_id))
                    entry['comment'] = '-'

                response = nehlh.update_entry(notable_event_id, 
                                              assignee=entry['assignee'], 
                                              status=entry['status'], 
                                              comment=entry['comment'])
                if response:
                    yield {"success_msg": "Notable event lookup entry updated.", "notable_event_id": notable_event_id}
                else:
                    yield {"error_msg": "Unable to create/update notable event lookup entry.", "notable_event_id": notable_event_id}
        except Exception as e:
            logger.exception("Error in NotableEventUpdate command: {}".format(e))
            raise e


dispatch(NotableEventUpdate, sys.argv, sys.stdin, sys.stdout, __name__)
