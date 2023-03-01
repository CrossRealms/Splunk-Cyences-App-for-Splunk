import sys

from splunklib.searchcommands import dispatch, StreamingCommand, Configuration, Option, validators
import cs_utils
from notable_lookup_handler import NotableEventLookupHandler

import logging
import logger_manager
logger = logger_manager.setup_logging('notable_event_update', logging.DEBUG)


@Configuration(local=True)
class NotableEventUpdate(StreamingCommand):

    notable_event_id = Option(name="notable_event_id", require=True)
    alert_time = Option(name='alert_time', require=False, default=None)
    assignee = Option(name='assignee', require=False, default=None)
    status = Option(name="status", require=False, default=None)

    def stream(self, records):
        try:
            session_key = cs_utils.GetSessionKey(logger).from_custom_command(self)

            user_making_change = self._metadata.searchinfo.username
            nehlh = NotableEventLookupHandler(logger, session_key, user_making_change=user_making_change)

            for entry in records:
                response = nehlh.update_entry(entry.notable_event_id,
                                    alert_time=entry.alert_time,
                                    assignee=entry.assignee,
                                    status=entry.status)
                if response:
                    yield {"success_msg": "Notable event lookup entry updated.", "notable_event_id": entry.notable_event_id}
                else:
                    yield {"error_msg": "Unable to create/update notable event lookup entry.", "notable_event_id": entry.notable_event_id}
        except Exception as e:
            logger.exception("Error in NotableEventUpdate command: {}".format(e))
            raise e


dispatch(NotableEventUpdate, sys.argv, sys.stdin, sys.stdout, __name__)
