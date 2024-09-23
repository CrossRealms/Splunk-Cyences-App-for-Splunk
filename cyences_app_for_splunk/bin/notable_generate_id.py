import cs_imports
import sys
import uuid

from splunklib.searchcommands import dispatch, StreamingCommand, Configuration

import logging
import logger_manager

logger = logger_manager.setup_logging("notable_generate_id_command", logging.INFO)


@Configuration(local=True)
class NotableGenerateId(StreamingCommand):

    def stream(self, records):
        try:
            for record in records:
                record['notable_event_id'] = str(uuid.uuid4())
                yield record

        except Exception as err:
            msg = "Error occurred in NotableGenerateId command: {}".format(err)
            self.write_error(msg)
            logger.exception(msg)


if __name__ == "__main__":
    dispatch(NotableGenerateId, sys.argv, sys.stdin, sys.stdout, __name__)
