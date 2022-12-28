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


def throw(e):
    """Raises an exception

    Args:
        e (Exception): The exception to raise

    Raises:
        e: The exception passed
    """
    raise e
