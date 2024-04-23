import pandas as pd
import psycopg2
import psycopg2.extras
import os
import sys
from dotenv import load_dotenv
from decimal import Decimal


current_directory = os.path.dirname(os.path.abspath(__file__))
load_dotenv(dotenv_path=os.path.join(current_directory, "../.env.prod"), override=True)


def truncate_tables(conn):
    tables = ["RainfallData"]
    with conn.cursor() as cur:
        for table in tables:
            cur.execute(f"TRUNCATE TABLE {table} CASCADE")
        conn.commit()


def create_tables(conn, state_name):
    df = pd.read_csv(os.path.join(current_directory, f"{state_name}-rainfall.csv"))

    data_tuples = [
        (
            int(row["State Code"]),
            int(row["County Code"]),
            int(row["CPC Grid Code"]),
            int(row["Year"]),
            int(row["Interval Code"]),
            round(Decimal(row["CPC Rainfall Index"]), 4),
            round(Decimal(row["CPC Interval Rainfall"]), 4),
            round(Decimal(row["CPC Interval Historical Average Rainfall"]), 4),
        )
        for _, row in df.iterrows()
    ]

    insert_query = """
        INSERT INTO RainfallData (StateID, CountyID, GridID, Year, Interval, Index, TotalRainfall, HistoricalAverageRainfall)
        VALUES %s
    """

    with conn.cursor() as cur:
        psycopg2.extras.execute_values(
            cur, insert_query, data_tuples, template=None, page_size=100
        )
        conn.commit()


def main():
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("DATABASE_NAME"),
            user=os.getenv("DATABASE_USERNAME"),
            password=os.getenv("DATABASE_PASSWORD"),
            host=os.getenv("DATABASE_HOST"),
            port=os.getenv("DATABASE_PORT"),
        )

        print(os.getenv("DATABASE_HOST"))

        truncate_tables(conn)
        create_tables(conn, "Virginia")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if conn is not None:
            conn.close()


if __name__ == "__main__":
    main()
