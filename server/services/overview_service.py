import psycopg2
import traceback
from database import db_session
from sqlalchemy import text
import json


def fetch_county_base(data):
    session = db_session()

    state_name = data["state"]
    county_name = data["county"]

    try:

        query = """
        SELECT IntendedUse, IrrigationPractice, OrganicPractice, CountyBaseValue
        FROM  CountyDetail cd
        JOIN County c ON cd.CountyID = c.CountyID
        JOIN State s ON c.StateID = s.StateID
        WHERE s.StateName = :state_name AND c.CountyName = :county_name
        """

        params = {"state_name": state_name, "county_name": county_name}

        result = session.execute(
            text(query),
            params,
        )

        response = []
        for row in result:
            response.append(
                {
                    "intended_use": row[0],
                    "irrigation_practice": row[1],
                    "organic_practice": row[2],
                    "county_base_value": float(row[3]),
                }
            )

        return response

    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Error: {error}")
        traceback.print_exc()
    finally:
        session.close()


def fetch_state_county_geojson(data):

    state_name = data["state"]

    try:
        with open(f"data/geojsons/{state_name.lower()}.json") as f:
            return json.load(f)
    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Error: {error}")
        traceback.print_exc()


# def fetch_county_base_geojson(data):

#     state_name = data["state"]

#     try:
#         with open(f"data/geojsons/{state_name.lower()}_rd.json") as f:
#             return json.load(f)
#     except (Exception, psycopg2.DatabaseError) as error:
#         print(f"Error: {error}")
#         traceback.print_exc()
