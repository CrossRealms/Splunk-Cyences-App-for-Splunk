import cs_imports
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
        logger.info("Starting CyencesMVIntersection command.")
        try:
            for record in records:
                set1 = record.get(self.set1, [])
                if type(set1) == list:
                    set1 = set(set1)
                else:
                    set1 = set([set1])
                set2 = record.get(self.set2, [])
                if type(set2) == list:
                    set2 = set(set2)
                else:
                    set2 = set([set2])

                record["intersection"] = list(set1.intersection(set2))
                logger.debug(f"set1={set1} & set2={set2} -> intersection={record['intersection']}")
                yield record

        except Exception as err:
            msg = "Error occurred in CyencesMVIntersection command: {}".format(err)
            self.write_error(msg)
            logger.exception(msg)


if __name__ == "__main__":
    dispatch(CyencesMVIntersection, sys.argv, sys.stdin, sys.stdout, __name__)
