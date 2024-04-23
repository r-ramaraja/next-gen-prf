import pandas as pd
import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv
from decimal import Decimal


current_directory = os.path.dirname(os.path.abspath(__file__))
load_dotenv(dotenv_path=os.path.join(current_directory, "../.env.prod"), override=True)


def truncate_tables(conn):
    tables = ["PolicyData"]
    with conn.cursor() as cur:
        for table in tables:
            cur.execute(f"TRUNCATE TABLE {table} CASCADE")
        conn.commit()


def read_scc_summary_of_business(year, state_code):

    headers = [
        "Commodity Year",
        "State Code",
        "State Abbreviation",
        "County Code",
        "County Name",
        "Commodity Code",
        "Commodity Name",
        "Insurance Plan Code",
        "Insurance Plan Abbreviation",
        "Coverage Type Code",
        "Delivery Type",
        "Coverage Level Percent",
        "Policies Sold Count",
        "Policies Earning Premium Count",
        "Policies Indemnified Count",
        "Units Earning Premium Count",
        "Units Indemnified Count",
        "Quantity Type",
        "Net Reported Quantity",
        "Endorsed/Companion Acres",
        "Liability Amount",
        "Total Premium Amount",
        "Subsidy Amount",
        "State/Private Subsidy",
        "Additional Subsidy",
        "EFA Premium Discount",
        "Indemnity Amount",
        "Loss Ratio",
    ]
    sob_df = pd.read_csv(
        f"./sobcov{str(year)[-2:]}.txt",
        sep="|",
        header=None,
        names=headers,
    )

    sob_df["Quantity Type"] = sob_df["Quantity Type"].str.strip()
    sob_df = sob_df[
        (sob_df["State Code"] == state_code)
        & (sob_df["Insurance Plan Code"] == 13)
        & (sob_df["Quantity Type"] == "Acres")
    ]

    return sob_df


def create_tables(conn, sob):

    data_tuples = [
        (
            int(row["State Code"]),
            int(row["County Code"]),
            int(row["Commodity Year"]),
            int(row["Commodity Code"]),
            float(row["Coverage Level Percent"]),
            int(row["Policies Sold Count"]),
            int(row["Policies Indemnified Count"]),
            int(row["Units Earning Premium Count"]),
            int(row["Units Indemnified Count"]),
        )
        for _, row in sob.iterrows()
    ]

    insert_query = """
        INSERT INTO PolicyData (StateID, CountyID, Year, CommodityCode, CoverageLevel, PolicySold, PolicyIndemnified, UnitsEarning, UnitsIndemnified)
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

        for year in range(2007, 2024):
            sob_df = read_scc_summary_of_business(year, 51)
            create_tables(conn, sob_df)

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        if conn is not None:
            conn.close()


if __name__ == "__main__":
    main()
