import json
import re
import sys

sys.path.append("./scripts")

import DIRECTORIES

from flask import Flask
from flask import request

# In VSCode, if using Pylance, the following line will have a warning saying
# path cannot be resolved, but on run-time, appending the correct path to `sys`
# will allow us to import any module in the `scripts` directory.
from Exceptions import IncorrectServerRequest, throw
from Parse import Parse

from typing import Literal

app = Flask(__name__)


@app.route("/data", methods=["GET"])
def data():
    """Fetch data from the `data.json` file in the DATABASE directory

    NOTE:
        This function reads the `data.json` file and loads it using the `json` lib
        then returns the array of dictionaries as a result.
    """
    try:
        data = open(f"{DIRECTORIES.DATABASE}", "r")
        return json.loads("".join(data.readlines()))
    except Exception:
        return []


@app.route("/users", methods=["GET"])
def users():
    """Fetch users from the `users.json` file in the DATABASE directory

    NOTE:
        This function reads the `users.json` file and loads it using the `json` lib
        then returns the array of dictionaries as a result.

    TODO:
        Create a post function for adding a user
    """
    try:
        data = open(f"{DIRECTORIES.USERS}", "r")
        return json.loads("".join(data.readlines()))
    except Exception:
        return []


@app.route("/upload", methods=["POST"])
def upload():
    """Upload for POST request

    Require data:
        file_names (list[str]): List of file names as strings - files must live in the `./pdfs-sensative` directory
        user_name (str): A user must be logged in to upload, and a name must be attached
        debug (Literal["0", "1"]): Whether or not we are debugging, open `visualise` when errors are thron, etc.

    Non-required data:
        statement_type (Literal["checking", "credit", "savings"]): This will be the default if a statement type cannot
            be derived from the file name. This applies to any file, so if you upload multiple credit statements and there
            is a typo in the file name, e.g `example_credis.pdf`, the statement type will default to this value.

    Raises:
        Exception: If the `statement_type` key is not defined, and the statement type cannot be determined from the file name, we throw
            a common exception describing that the statement type cannot be derived.
        IncorrectServerRequest: If the required data is not sent in the request body, then this exception is raised.
    """
    error = []
    try:
        if request.method == "POST":
            data: dict[
                Literal["file_names", "user_name", "debug", "statement_type"], str
            ] = request.get_json()

            if not ("file_names" in data and "user_name" in data and "debug" in data):
                raise IncorrectServerRequest()

            for file in data["file_names"]:
                type_of_file = (
                    "checking"
                    if re.search(r"checking", file, re.IGNORECASE)
                    else "credit"
                    if re.search(r"credit", file, re.IGNORECASE)
                    # Savings statements can be parsed the exact same as checking statements
                    else "checking"
                    if re.search(r"savings", file, re.IGNORECASE)
                    else data["statement_type"]
                    if "statement_type" in data
                    else throw(
                        Exception(
                            "Cannot derive statement type from the UI or the name of the file."
                        )
                    )
                )

                PARSER = Parse(
                    f"./pdfs-sensative/{file}",
                    data["debug"],
                    type_of_file,
                    data["user_name"],
                )
                if PARSER.is_file(file):
                    try:
                        PARSER.parse()
                    except BaseException as e:
                        return {"success": False, "errors": [str(e)]}
                else:
                    throw(
                        Exception(
                            f"{file} was not determined to be a legitimate file. It likely isn't within the `./pdfs-sensative` directory, or some malicious injection attempt has occurred."
                        )
                    )

            return {"success": True}

    except IncorrectServerRequest:
        print("\nMalformed request.\n", file=sys.stderr)

    except BaseException as e:
        error.append(e.args)

    # If we reach the end return false
    return {"success": False, "errors": error}
