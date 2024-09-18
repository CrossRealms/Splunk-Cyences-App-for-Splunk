import cs_imports
import sys

from splunklib.searchcommands import dispatch, StreamingCommand, Configuration, Option

import logging
import logger_manager

logger = logger_manager.setup_logging("mvdiff", logging.INFO)


@Configuration()
class CyencesMVDiff(StreamingCommand):

    old_values_name = Option(name="oldfield", require=True)
    new_values_name = Option(name="newfield", require=True)
    ignore_values = Option(name="ignore", require=False, default='')

    def build_set(self, values, ignore_values):
        if isinstance(values, str):
            new_values =  {values} - ignore_values
        else:
            new_values = set(values) - ignore_values
        
        return {i for i in new_values if i.strip() }

    def stream(self, records):
        try:
            for record in records:
                old_values = record.get(self.old_values_name, [])
                new_values = record.get(self.new_values_name, [])
                ignore_values = set(self.ignore_values.split(','))

                old_values = self.build_set(old_values, ignore_values)
                new_values = self.build_set(new_values, ignore_values)

                logger.debug("old_values={}".format(old_values))
                logger.debug("new_values={}".format(new_values))
    
                added = list(new_values - old_values)
                removed = list(old_values - new_values)

                record['added'] = added if len(added) > 0 else None
                record['removed'] = removed if len(removed) > 0 else None

                logger.debug("added={}".format(record['added']))
                logger.debug("removed={}".format(record['removed']))

                yield record

        except Exception as err:
            msg = "Error occurred in CyencesMVDiff command: {}".format(err)
            self.write_error(msg)
            logger.exception(msg)


if __name__ == "__main__":
    dispatch(CyencesMVDiff, sys.argv, sys.stdin, sys.stdout, __name__)
