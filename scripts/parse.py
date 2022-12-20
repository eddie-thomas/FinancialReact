import json
import sys
from datetime import datetime
from WellsFargoPdfDocument import WellsFargoPdfDocumentBaseClass


def throw(e):
    """Raises an exception

    Args:
        e (Exception): The exception to raise

    Raises:
        e: The exception passed
    """
    raise e


def write_to_file(ACCT_NUM: int, JSON_TEXT: str):
    with open("./src/json/data.json", "r+") as file:
        # Read previous data, and possibly initialize previous if not already defined
        PREVIOUS_CONTENTS: list = json.loads("".join(file.readlines()) or "[]")
        # Check if we already have the data loaded
        for content in PREVIOUS_CONTENTS:
            if content["data"] == JSON_TEXT:
                file.close()
                break
        # Create provenance data
        PROVENANCE_DATA = {
            "account": f"{ACCT_NUM}",
            "author": "User - change to be a parameter passed from client",
            "data": JSON_TEXT,
            "date": datetime.today().strftime("%Y-%m-%d %H:%M:%S"),
            "file_path_given": path_to_pdf,
            "type": type_of_document,
        }
        # Append new data to previous
        PREVIOUS_CONTENTS.append(PROVENANCE_DATA)
        # Dump it
        CONTENTS = json.dumps(PREVIOUS_CONTENTS)
        # Clear file
        file.seek(0)
        file.truncate()
        # Write with new data
        file.write(CONTENTS)
        # Close file
        file.close()


if "__main__" == __name__:
    try:
        [_, path_to_pdf, visualize_pdf, type_of_document] = sys.argv
        PDF = WellsFargoPdfDocumentBaseClass(
            path_to_pdf, bool(int(visualize_pdf)), type_of_document
        )
        JSON_TEXT = PDF.get_json()
        ACCT_NUM = PDF.account_num

        # Invoke writing function
        write_to_file(ACCT_NUM, JSON_TEXT)
        print("\nSuccessfully loaded data to json file.")

    except ValueError as e:
        # We care about this specific ValueError, otherwise raise exception
        print("\nData already loaded.") if str(
            e
        ) == "I/O operation on closed file." else throw(e)


# @see {https://pdfminersix.readthedocs.io/en/latest/reference/composable.html#laparams}
