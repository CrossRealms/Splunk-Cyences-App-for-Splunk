# Standard library imports
import logging
import logging.handlers
import os

# Splunk imports
from splunk.clilib.bundle_paths import make_splunkhome_path


def setup_logging(log_name, log_level=logging.INFO):
    """ Setup logger.

    :param log_name: name for logger
    :param log_level: log level, a string
    :return: a logger object
    """
    log_name = 'cyences_{}'.format(log_name)
    # Make path till log file (current dir (app/<app-name>/bin))
    # log_dir = os.path.dirname(os.path.abspath(__file__))
    # log_file = os.path.join(log_dir, "%s.log" % log_name)

    # Make path till log file (splunk/var/log/splunk dir)
    log_file = make_splunkhome_path(["var", "log", "splunk", "%s.log" % log_name])
    log_dir = os.path.dirname(log_file)

    # Create directory at the required path to store log file, if not found
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    logger = logging.getLogger(log_name)
    logger.propagate = False

    # Set log level
    logger.setLevel(log_level)

    handler_exists = any(
        [True for h in logger.handlers if h.baseFilename == log_file])

    if not handler_exists:
        file_handler = logging.handlers.RotatingFileHandler(
            log_file, mode="a", maxBytes=10485760, backupCount=10)
        # Format logs
        fmt_str = "%(asctime)s %(levelname)s %(thread)d - %(message)s"
        formatter = logging.Formatter(fmt_str)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

        if log_level is not None:
            file_handler.setLevel(log_level)

    return logger
