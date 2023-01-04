"""
A directory module for specifying the file-based "database" and the users
file.

NOTE: The data is store in files for simplicity, but can be put into a database
and fetched via a Flask-database connection give the appropriate setup.
"""

DATABASE = "./database/data.json"
USERS = "./database/users.json"
