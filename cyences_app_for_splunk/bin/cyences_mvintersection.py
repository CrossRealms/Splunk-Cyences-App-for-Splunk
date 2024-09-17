import sys

from splunklib.searchcommands import dispatch, StreamingCommand, Configuration, Option

import logging
import logger_manager

logger = logger_manager.setup_logging("mvintersection", logging.INFO)


@Configuration()
class CyencesMVIntersection(StreamingCommand):

    set1 = Option(name="set1", require=True)
    set2 = Option(name="set2", require=True)


    def stream(self, records):
        try:
            for record in records:
                set1 = set(record.get(self.set1, []))
                set2 = set(record.get(self.set2, []))

                record["intersection"] = list(set1.intersection(set2))
                logger.debug("intersection={}".format(record['intersection']))
                yield record

        except Exception as err:
            msg = "Error occurred in CyencesMVIntersection command: {}".format(err)
            self.write_error(msg)
            logger.exception(msg)


if __name__ == "__main__":
    dispatch(CyencesMVIntersection, sys.argv, sys.stdin, sys.stdout, __name__)
