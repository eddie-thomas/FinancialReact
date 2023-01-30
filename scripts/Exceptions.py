# -*- coding: UTF-8 -*-

#
# @copyright Copyright © 2018 - 2023 by Edward K Thomas Jr
# @license GNU GENERAL PUBLIC LICENSE https://www.gnu.org/licenses/gpl-3.0.en.html
#


class IncorrectServerRequest(Exception):
    """
    The expected data attached to the upload POST request, was malformed.

    Raised:
        When `file_names` and/or `user_name` are not keys in the request sent from server.
    """

    def __init__(self):
        """Initialize and call the base class constructor with the parameters it needs"""
        super().__init__("\n\n")


class TooManyColumnsFoundError(Exception):
    """
    Too Many Columns Found Error

    Raised:
        When too many columns are found. We should only expect 1 column, at most, to match on any
        specific cell of data in the transaction.
    """

    def __init__(self, message):
        """Initialize and call the base class constructor with the parameters it needs"""
        super().__init__(f"\n\n{message}\n")


def throw(e: BaseException):
    """Raises an exception

    Args:
        e (Exception): The exception to raise

    Raises:
        e: The exception passed
    """
    raise e
