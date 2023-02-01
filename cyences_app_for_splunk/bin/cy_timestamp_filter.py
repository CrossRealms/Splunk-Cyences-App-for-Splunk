import sys

from splunklib.searchcommands import dispatch, StreamingCommand, Configuration, Option, validators

import logging
import logger_manager

logger = logger_manager.setup_logging("cy_timestamp_filter", logging.INFO)

@Configuration(local=True)
class CYTimestampFilter(StreamingCommand):

    duration = Option(name="duration", require=True, validate=validators.Integer())

    def stream(self, records):
        try:
            for record in records:
                matching_output = set()
                for combined_value in record.get("input", []):
                    timestamp, output = combined_value.split("###", 1)
                    if abs(int(record["_time"]) - int(timestamp)) <= self.duration:
                        matching_output.add(output)
                record["output"] = list(matching_output)
                yield record
        except Exception as err:
            self.write_error("Error occurred: {}".format(err))
            logger.exception("Error occurred:")


if __name__ == "__main__":
    dispatch(CYTimestampFilter, sys.argv, sys.stdin, sys.stdout, __name__)
