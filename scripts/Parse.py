import DIRECTORIES
import json
import os.path
import sys

from datetime import datetime
from Exceptions import throw
from WellsFargoPdfDocument import WellsFargoPdfDocumentBaseClass


class Parse:
    """Parse class the server will access to preform file parsing."""

    def __init__(self, path_to_pdf, visualize_pdf, type_of_document, user):
        """Initialize the class"""
        self.path_to_pdf = path_to_pdf
        self.type_of_document = type_of_document
        self.visualize_pdf = visualize_pdf
        self.user = user

    def is_file(self, file_name):
        """Method to determine if a file is an actual file"""
        return os.path.isfile(f"./pdfs-sensative/{file_name}")

    def write_to_file(self, ACCT_NUM: str, JSON_TEXT: str):
        """Function that takes the parsed data and inserts it into the json file
        that'll hold all our data. If file doesn't exist, an exception is thrown,
        but if the `data.json` file is empty, then it'll initialize the json array.

        Args:
            ACCT_NUM (str): Account number
            JSON_TEXT (str): Stringified JSON
        """
        with open(f"{DIRECTORIES.DATABASE}", "r+") as file:
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
                "author": f"Uploaded by user: {self.user}",
                "data": JSON_TEXT,
                "date": datetime.today().strftime("%Y-%m-%d %H:%M:%S"),
                "file_path_given": self.path_to_pdf,
                "type": self.type_of_document,
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

    def parse(self):
        """Parse the actual file and preform all the necessary functionality to add the data to the correct files

        Raises:
            ValueError: Error raised when the data is already loaded in a file
            FileNotFoundError: Error raised when the `data.json` file is not initialized/doesn't exist in the correct directory
        """
        try:
            PDF = WellsFargoPdfDocumentBaseClass(
                self.path_to_pdf, bool(int(self.visualize_pdf)), self.type_of_document
            )
            JSON_TEXT = PDF.get_json()
            ACCT_NUM = PDF.account_num

            # Invoke writing function
            self.write_to_file(ACCT_NUM, JSON_TEXT)
            print("\nSuccessfully loaded data to json file.", file=sys.stderr)

        except ValueError as e:
            # We care about this specific ValueError, otherwise raise exception
            print("\nData already loaded.", file=sys.stderr) if str(
                e
            ) == "I/O operation on closed file." else throw(e)
        except FileNotFoundError:
            # Catch the error when trying to open a file that doesn't exist, and
            # create it then re-invoke the method.
            new_file = open("./src/json/data.json", "w")
            new_file.close()
            self.write_to_file(ACCT_NUM, JSON_TEXT)


# @see {https://pdfminersix.readthedocs.io/en/latest/reference/composable.html#laparams}

if "__main__" == __name__:
    [_, path_to_pdf, visualize_pdf, type_of_document] = sys.argv
    user = input("\nWho is uploading the file(s)? [System]: ") or "System"
    Parse(path_to_pdf, visualize_pdf, type_of_document, user).parse()
