import os
import sys

from splunklib.searchcommands import dispatch, GeneratingCommand, Configuration, Option, validators
import cs_utils
from notable_lookup_handler import NotableEventLookupHandler

import logging
import logger_manager
logger = logger_manager.setup_logging('notable_event_update', logging.INFO)


@Configuration()
class NotableEventUpdate(GeneratingCommand):

    notable_event_id = Option(name="notable_event_id", require=True)
    alert_time = Option(name='alert_time', require=False, default=None)
    assignee = Option(name='assignee', require=False, default=None)
    status = Option(name="status", require=False, default=None)

    def generate(self):
        try:
            session_key = cs_utils.GetSessionKey(logger).from_custom_command(self)

            nehlh = NotableEventLookupHandler(logger, session_key)
            nehlh.update_entry(self.notable_event_id,
                                alert_time=self.alert_time,
                                assignee=self.assignee,
                                status=self.status)
            yield {"msg": "Notable event lookup entry updated. notable_event_id={}".format(self.notable_event_id)}
        except Exception as e:
            logger.exception("Error in NotableEventUpdate command: {}".format(e))
            raise e


dispatch(NotableEventUpdate, sys.argv, sys.stdin, sys.stdout, __name__)
