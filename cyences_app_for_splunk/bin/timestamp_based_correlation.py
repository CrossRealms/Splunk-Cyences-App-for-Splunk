import sys

from splunklib.searchcommands import dispatch, StreamingCommand, Configuration, Option, validators

import logging
import logger_manager

logger = logger_manager.setup_logging("timestamp_based_correlation", logging.INFO)

@Configuration(local=True)
class TimestampBasedCorrelation(StreamingCommand):

    lookback = Option(name="lookback", require=False, default=0,validate=validators.Integer(minimum=0))
    lookahead = Option(name="lookahead", require=False, default=0, validate=validators.Integer(minimum=0))

    def stream(self, records):
        try:
            for record in records:
                matching_output = set()
                logger.debug("record=>{}".format(record))

                items = record.get("input", [])
                if isinstance(items, str):
                    items = [items]

                for combined_value in items:
                    if combined_value.strip() == "":
                        continue
                    timestamp, output = combined_value.split("###", 1)
                    if int(record["_time"]) - self.lookback <= int(timestamp) <= int(record["_time"]) + self.lookahead:
                        matching_output.add(output)
                record["output"] = list(matching_output)
                yield record
        except Exception as err:
            self.write_error("Error occurred: {}".format(err))
            logger.exception("Error occurred:")


if __name__ == "__main__":
    dispatch(TimestampBasedCorrelation, sys.argv, sys.stdin, sys.stdout, __name__)

