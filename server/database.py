import psycopg2
from flask import current_app, g
import os
from dotenv import load_dotenv

load_dotenv()

db_host = os.getenv("DATABASE_HOST")
db_username = os.getenv("DATABASE_USERNAME")
db_password = os.getenv("DATABASE_PASSWORD")
db_name = os.getenv("DATABASE_NAME")
db_port = os.getenv("DATABASE_PORT")


class Database:
    _instance = None
    connection = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
            cls._instance.connection = None
        return cls._instance

    def get_connection(self):
        if self.connection is None or self.connection.closed:
            self.connection = psycopg2.connect(
                dbname=db_name,
                user=db_username,
                password=db_password,
                host=db_host,
                port=db_port,
            )
        return self.connection


def get_db():
    if "db" not in g:
        g.db = Database().get_connection()
    return g.db


def close_db(e=None):
    db = g.pop("db", None)

    if db is not None:
        db.close()
