import psycopg2
import traceback
from datetime import datetime
from database import db_session
from sqlalchemy import text


interval_codes = {
    625: "Jan-Feb",
    626: "Feb-Mar",
    627: "Mar-Apr",
    628: "Apr-May",
    629: "May-Jun",
    630: "Jun-Jul",
    631: "Jul-Aug",
    632: "Aug-Sep",
    633: "Sep-Oct",
    634: "Oct-Nov",
    635: "Nov-Dec",
}

interval_months = [
    "Jan-Feb",
    "Feb-Mar",
    "Mar-Apr",
    "Apr-May",
    "May-Jun",
    "Jun-Jul",
    "Jul-Aug",
    "Aug-Sep",
    "Sep-Oct",
    "Oct-Nov",
    "Nov-Dec",
]


def compute_decision(data):
    session = db_session()

    state_name = data["state"]
    county_name = data["county"]
    grid_id = data["grid_id"]
    year = data["year"]
    intended_use = data["intended_use"]
    irrigation_practice = data.get("irrigation_practice")
    organic_practice = data.get("organic_practice")
    coverage_level = data["coverage_level"]
    productivity_factor = data["productivity_factor"]
    insurable_interest = data["insurable_interest"]
    insured_acres = int(data["insured_acres"])
    interval_distribution = data["interval_distribution"]

    try:

        query = """
        SELECT cd.CountyBaseValue
        FROM CountyDetail cd
        JOIN County c ON cd.CountyID = c.CountyID
        JOIN State s ON c.StateID = s.StateID
        WHERE s.StateName = :state_name AND c.CountyName = :county_name AND cd.IntendedUse = :intended_use
        """

        if irrigation_practice is not None:
            query += "AND cd.IrrigationPractice = :irrigation_practice "
        else:
            query += "AND cd.IrrigationPractice IS NULL "

        if organic_practice is not None:
            query += "AND cd.OrganicPractice = :organic_practice "
        else:
            query += "AND cd.OrganicPractice IS NULL;"

        params = {
            "state_name": state_name,
            "county_name": county_name,
            "intended_use": intended_use,
        }

        if irrigation_practice is not None:
            params["irrigation_practice"] = irrigation_practice
        if organic_practice is not None:
            params["organic_practice"] = organic_practice

        result = session.execute(text(query), params)

        result_row = result.fetchone()
        county_base = float(result_row[0]) if result_row else None

        dollar_protection = county_base * (coverage_level / 100) * productivity_factor

        policy_protection = {}
        for interval in interval_distribution:
            policy_protection[interval] = round(
                (
                    dollar_protection
                    * insured_acres
                    * interval_distribution[interval]
                    * insurable_interest
                )
            )

        premium = {}
        subsidy = {}
        premium_rates = {}
        premium_subsidy = {}
        for interval in interval_distribution:
            query = """
            SELECT cd.PremiumRate, cd.SubsidyLevel
            FROM CoverageData cd
            JOIN County c ON cd.CountyID = c.CountyID
            JOIN State s ON c.StateID = s.StateID
            WHERE s.StateName = :state_name AND c.CountyName = :county_name AND cd.GridID = :grid_id AND cd.Interval = :interval AND cd.CoverageLevel = :coverage_level
            """

            params = {
                "state_name": state_name,
                "county_name": county_name,
                "intended_use": intended_use,
                "grid_id": int(grid_id),
                "interval": int(interval),
                "coverage_level": int(coverage_level),
            }

            result = session.execute(
                text(query),
                params,
            )
            result_row = result.fetchone()
            premium_rate = float(result_row[0])
            subsidy_level = float(result_row[1])
            subsidy[interval] = subsidy_level
            premium_rates[interval] = round(premium_rate, 2)

            premium[interval] = round(
                (
                    dollar_protection
                    * premium_rates[interval]
                    * insured_acres
                    * interval_distribution[interval]
                    * insurable_interest
                )
            )
            premium_subsidy[interval] = round(subsidy_level * premium[interval])

        actual_premium = {}
        for interval, premia in premium.items():
            actual_premium[interval] = round(premia * (1 - subsidy[interval]))

        indemnity = {}
        index = {}
        for interval in interval_distribution:
            query = """
            SELECT rd.Index
            FROM RainfallData rd
            WHERE rd.GridID = :grid_id AND rd.Year = :year AND rd.Interval = :interval
            """

            params = {
                "grid_id": int(grid_id),
                "year": int(year),
                "interval": int(interval),
            }

            result = session.execute(
                text(query),
                params,
            )
            result_row = result.fetchone()
            final_index = float(result_row[0])
            index[interval] = final_index
            pcf = ((coverage_level / 100) - final_index) / (coverage_level / 100)
            if pcf > 0:
                indemnity[interval] = round(pcf * policy_protection[interval])
            else:
                indemnity[interval] = 0

        response = {"intervals": {}}
        for interval, percent_value in interval_distribution.items():
            response["intervals"][interval] = {
                "interval_name": interval_codes[int(interval)],
                "percent_value": percent_value,
                "policy_protection": policy_protection[interval],
                "premium_rate": premium_rates[interval],
                "premium": premium[interval],
                "premium_subsidy": premium_subsidy[interval],
                "actual_premium": actual_premium[interval],
                "index": index[interval],
                "indemnity": indemnity[interval],
            }

        response["total_acres"] = insured_acres
        response["subsidy"] = list(subsidy.values())[0] * 100
        response["county_base"] = county_base
        response["sum_percent_value"] = sum(interval_distribution.values()) * 100
        response["sum_policy_protection"] = sum(policy_protection.values())
        response["sum_premium"] = sum(premium.values())
        response["sum_premium_subsidy"] = sum(premium_subsidy.values())
        response["sum_actual_premium"] = sum(actual_premium.values())
        response["sum_indemnity"] = sum(indemnity.values())
        return response

    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Error: {error}")
        traceback.print_exc()
    finally:
        session.close()


def fetch_intended_use_data(data):
    session = db_session()

    state_name = data["state"]
    county_name = data["county"]

    try:

        query = """
        SELECT 
            bd.Year, 
            bd.IntendedUse,
            SUM(bd.IndemnityAmount) AS TotalIndemnityAmount, 
            SUM(bd.TotalPremiumAmount) AS TotalPremiumAmount, 
            SUM(bd.SubsidyAmount) AS TotalSubsidyAmount, 
            SUM(bd.NetReportingAmount) AS TotalNetReportingAmount
        FROM 
            BusinessData bd
        JOIN 
            County c ON bd.CountyID = c.CountyID
        JOIN 
            State s ON c.StateID = s.StateID
        WHERE 
            s.StateName = :state_name AND 
            c.CountyName = :county_name AND
            (bd.IntendedUse = 'haying' OR bd.IntendedUse = 'grazing')
        GROUP BY 
            bd.Year, bd.IntendedUse;
        """

        params = {"state_name": state_name, "county_name": county_name}

        result = session.execute(text(query), params)

        response = {}
        for item in result:
            year = item[0]
            intended_use = item[1]
            sum_indemnity = item[2]
            sum_premium = item[3]
            subsidy_amount = item[4]
            acres = item[5]
            response.setdefault(intended_use, {})[year] = {
                "sum_indemnity": sum_indemnity,
                "sum_actual_premium": sum_premium - subsidy_amount,
                "acres": acres,
            }

        current_year = datetime.now().year
        count = current_year - 1 - 2007

        if "grazing" in response:
            max_indemnity = {"year": "", "value": 0}
            min_indemnity = {"year": "", "value": float("inf")}
            max_premium = {"year": "", "value": 0}
            min_premium = {"year": "", "value": float("inf")}
            max_acres = {"year": "", "value": 0}
            min_acres = {"year": "", "value": float("inf")}
            total_indemnity = 0
            total_premium = 0
            total_acres = 0

            for year, values in response["grazing"].items():
                indemnity = values["sum_indemnity"]
                premium = values["sum_actual_premium"]
                acres = values["acres"]

                if indemnity > max_indemnity["value"]:
                    max_indemnity = {"year": year, "value": indemnity}
                if indemnity < min_indemnity["value"] and indemnity != 0:
                    min_indemnity = {"year": year, "value": indemnity}

                if premium > max_premium["value"]:
                    max_premium = {"year": year, "value": premium}
                if premium < min_premium["value"] and premium != 0:
                    min_premium = {"year": year, "value": premium}

                if acres > max_acres["value"]:
                    max_acres = {"year": year, "value": acres}
                if acres < min_acres["value"] and acres != 0:
                    min_acres = {"year": year, "value": acres}

                total_indemnity += indemnity
                total_premium += premium
                total_acres += acres

            average_indemnity = total_indemnity / count
            average_premium = total_premium / count
            average_acres = total_acres / count

            response["grazing_max_indemnity"] = max_indemnity
            if min_indemnity["value"] != float("inf"):
                response["grazing_min_indemnity"] = min_indemnity
            else:
                response["grazing_min_indemnity"] = {"year": "", "value": 0}
            response["grazing_avg_indemnity"] = round(average_indemnity, 2)
            response["grazing_total_indemnity"] = total_indemnity

            response["grazing_max_premium"] = max_premium
            if min_premium["value"] != float("inf"):
                response["grazing_min_premium"] = min_premium
            else:
                response["grazing_min_premium"] = {"year": "", "value": 0}
            response["grazing_avg_premium"] = round(average_premium, 2)
            response["grazing_total_premium"] = total_premium

            response["grazing_max_acres"] = max_acres
            if min_acres["value"] != float("inf"):
                response["grazing_min_acres"] = min_acres
            else:
                response["grazing_min_acres"] = {"year": "", "value": 0}
            response["grazing_avg_acres"] = round(average_acres, 2)
            response["grazing_total_acres"] = total_acres

        if "haying" in response:
            max_indemnity = {"year": "", "value": 0}
            min_indemnity = {"year": "", "value": float("inf")}
            max_premium = {"year": "", "value": 0}
            min_premium = {"year": "", "value": float("inf")}
            max_acres = {"year": "", "value": 0}
            min_acres = {"year": "", "value": float("inf")}
            total_indemnity = 0
            total_premium = 0
            total_acres = 0

            for year, values in response["haying"].items():
                indemnity = values["sum_indemnity"]
                premium = values["sum_actual_premium"]
                acres = values["acres"]

                if indemnity > max_indemnity["value"]:
                    max_indemnity = {"year": year, "value": indemnity}
                if indemnity < min_indemnity["value"] and indemnity != 0:
                    min_indemnity = {"year": year, "value": indemnity}

                if premium > max_premium["value"]:
                    max_premium = {"year": year, "value": premium}
                if premium < min_premium["value"] and premium != 0:
                    min_premium = {"year": year, "value": premium}

                if acres > max_acres["value"]:
                    max_acres = {"year": year, "value": acres}
                if acres < min_acres["value"] and acres != 0:
                    min_acres = {"year": year, "value": acres}

                total_indemnity += indemnity
                total_premium += premium
                total_acres += acres

            average_indemnity = total_indemnity / count
            average_premium = total_premium / count
            average_acres = total_acres / count

            response["haying_max_indemnity"] = max_indemnity
            if min_indemnity["value"] != float("inf"):
                response["haying_min_indemnity"] = min_indemnity
            else:
                response["haying_min_indemnity"] = {"year": "", "value": 0}
            response["haying_avg_indemnity"] = round(average_indemnity, 2)
            response["haying_total_indemnity"] = total_indemnity

            response["haying_max_premium"] = max_premium
            if min_premium["value"] != float("inf"):
                response["haying_min_premium"] = min_premium
            else:
                response["haying_min_premium"] = {"year": "", "value": 0}
            response["haying_avg_premium"] = round(average_premium, 2)
            response["haying_total_premium"] = total_premium

            response["haying_max_acres"] = max_acres
            if min_acres["value"] != float("inf"):
                response["haying_min_acres"] = min_acres
            else:
                response["haying_min_acres"] = {"year": "", "value": 0}
            response["haying_avg_acres"] = round(average_acres, 2)
            response["haying_total_acres"] = total_acres

        return response

    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Error: {error}")
        traceback.print_exc()
    finally:
        session.close()


def fetch_coverage_level_data(data):
    session = db_session()

    state_name = data["state"]
    county_name = data["county"]

    try:

        query = """
        SELECT 
            bd.Year, 
            bd.CoverageLevel,
            SUM(bd.IndemnityAmount) AS TotalIndemnityAmount, 
            SUM(bd.TotalPremiumAmount) AS TotalPremiumAmount, 
            SUM(bd.SubsidyAmount) AS TotalSubsidyAmount, 
            SUM(bd.NetReportingAmount) AS TotalNetReportingAmount
        FROM 
            BusinessData bd
        JOIN 
            County c ON bd.CountyID = c.CountyID
        JOIN 
            State s ON c.StateID = s.StateID
        WHERE 
            s.StateName = :state_name AND 
            c.CountyName = :county_name AND
            bd.CoverageLevel != 0.0
        GROUP BY 
            bd.Year, bd.CoverageLevel;
        """

        params = {"state_name": state_name, "county_name": county_name}

        result = session.execute(
            text(query),
            params,
        )

        response = {}
        for item in result:
            year = item[0]
            coverage_level = float(item[1])
            sum_indemnity = item[2]
            sum_premium = item[3]
            subsidy_amount = item[4]
            acres = item[5]

            response.setdefault(coverage_level, {}).setdefault(year, {}).update(
                {
                    "sum_indemnity": sum_indemnity,
                    "sum_actual_premium": sum_premium - subsidy_amount,
                    "acres": acres,
                }
            )

        query = """
        SELECT 
            pd.Year, 
            pd.CoverageLevel,
            SUM(pd.PolicySold) AS TotalPoliciesSold, 
            SUM(pd.PolicyIndemnified) AS TotalPoliciesIndemnified
        FROM 
            PolicyData pd
        JOIN 
            County c ON pd.CountyID = c.CountyID
        JOIN 
            State s ON c.StateID = s.StateID
        WHERE 
            s.StateName = :state_name AND 
            c.CountyName = :county_name
        GROUP BY 
            pd.Year, pd.CoverageLevel;
        """

        params = {"state_name": state_name, "county_name": county_name}

        result = session.execute(text(query), params)

        for item in result:
            year = item[0]
            coverage_level = float(item[1])
            sum_policy_sold = item[2]
            sum_policy_indemnified = item[3]

            response.setdefault(coverage_level, {}).setdefault(year, {}).update(
                {
                    "sum_policy_sold": sum_policy_sold,
                    "sum_policy_indemnified": sum_policy_indemnified,
                }
            )

        current_year = datetime.now().year
        count = current_year - 1 - 2007

        if 0.7 in response:
            max_indemnity = {"year": "", "value": 0}
            min_indemnity = {"year": "", "value": float("inf")}
            max_premium = {"year": "", "value": 0}
            min_premium = {"year": "", "value": float("inf")}
            max_acres = {"year": "", "value": 0}
            min_acres = {"year": "", "value": float("inf")}
            max_sold = {"year": "", "value": 0}
            min_sold = {"year": "", "value": float("inf")}
            max_indemnified = {"year": "", "value": 0}
            min_indemnified = {"year": "", "value": float("inf")}
            total_indemnity = 0
            total_premium = 0
            total_acres = 0
            total_sold = 0
            total_indemnified = 0

            current_year = datetime.now().year
            count = current_year - 1 - 2007

            for year, values in response[0.7].items():
                indemnity = values.get("sum_indemnity", 0)
                premium = values.get("sum_actual_premium", 0)
                acres = values.get("acres", 0)
                sold = values.get("sum_policy_sold", 0)
                indemnified = values.get("sum_policy_indemnified", 0)

                if indemnity > max_indemnity["value"]:
                    max_indemnity = {"year": year, "value": indemnity}
                if indemnity < min_indemnity["value"] and indemnity != 0:
                    min_indemnity = {"year": year, "value": indemnity}

                if premium > max_premium["value"]:
                    max_premium = {"year": year, "value": premium}
                if premium < min_premium["value"] and premium != 0:
                    min_premium = {"year": year, "value": premium}

                if acres > max_acres["value"]:
                    max_acres = {"year": year, "value": acres}
                if acres < min_acres["value"] and acres != 0:
                    min_acres = {"year": year, "value": acres}

                if sold > max_sold["value"]:
                    max_sold = {"year": year, "value": sold}
                if sold < min_sold["value"] and sold != 0:
                    min_sold = {"year": year, "value": sold}

                if indemnified > max_indemnified["value"]:
                    max_indemnified = {"year": year, "value": indemnified}
                if indemnified < min_indemnified["value"] and indemnified != 0:
                    min_indemnified = {"year": year, "value": indemnified}

                total_indemnity += indemnity
                total_premium += premium
                total_acres += acres
                total_sold += sold
                total_indemnified += indemnified

            average_indemnity = total_indemnity / count
            average_premium = total_premium / count
            average_acres = total_acres / count
            average_sold = total_sold / count
            average_indemnified = total_indemnified / count

            response["0.7_max_indemnity"] = max_indemnity
            if min_indemnity["value"] != float("inf"):
                response["0.7_min_indemnity"] = min_indemnity
            else:
                response["0.7_min_indemnity"] = {"year": "", "value": 0}
            response["0.7_avg_indemnity"] = round(average_indemnity, 2)
            response["0.7_total_indemnity"] = total_indemnity

            response["0.7_max_premium"] = max_premium
            if min_premium["value"] != float("inf"):
                response["0.7_min_premium"] = min_premium
            else:
                response["0.7_min_premium"] = {"year": "", "value": 0}
            response["0.7_avg_premium"] = round(average_premium, 2)
            response["0.7_total_premium"] = total_premium

            response["0.7_max_acres"] = max_acres
            if min_acres["value"] != float("inf"):
                response["0.7_min_acres"] = min_acres
            else:
                response["0.7_min_acres"] = {"year": "", "value": 0}
            response["0.7_avg_acres"] = round(average_acres, 2)
            response["0.7_total_acres"] = total_acres

            response["0.7_max_sold"] = max_sold
            if min_sold["value"] != float("inf"):
                response["0.7_min_sold"] = min_sold
            else:
                response["0.7_min_sold"] = {"year": "", "value": 0}
            response["0.7_avg_sold"] = round(average_sold, 2)
            response["0.7_total_sold"] = total_sold

            response["0.7_max_indemnified"] = max_indemnified
            if min_indemnified["value"] != float("inf"):
                response["0.7_min_indemnified"] = min_indemnified
            else:
                response["0.7_min_indemnified"] = {"year": "", "value": 0}
            response["0.7_avg_indemnified"] = round(average_indemnified, 2)
            response["0.7_total_indemnified"] = total_indemnified

        if 0.75 in response:
            max_indemnity = {"year": "", "value": 0}
            min_indemnity = {"year": "", "value": float("inf")}
            max_premium = {"year": "", "value": 0}
            min_premium = {"year": "", "value": float("inf")}
            max_acres = {"year": "", "value": 0}
            min_acres = {"year": "", "value": float("inf")}
            max_sold = {"year": "", "value": 0}
            min_sold = {"year": "", "value": float("inf")}
            max_indemnified = {"year": "", "value": 0}
            min_indemnified = {"year": "", "value": float("inf")}
            total_indemnity = 0
            total_premium = 0
            total_acres = 0
            total_sold = 0
            total_indemnified = 0

            current_year = datetime.now().year
            count = current_year - 1 - 2007

            for year, values in response[0.75].items():
                indemnity = values.get("sum_indemnity", 0)
                premium = values.get("sum_actual_premium", 0)
                acres = values.get("acres", 0)
                sold = values.get("sum_policy_sold", 0)
                indemnified = values.get("sum_policy_indemnified", 0)

                if indemnity > max_indemnity["value"]:
                    max_indemnity = {"year": year, "value": indemnity}
                if indemnity < min_indemnity["value"] and indemnity != 0:
                    min_indemnity = {"year": year, "value": indemnity}

                if premium > max_premium["value"]:
                    max_premium = {"year": year, "value": premium}
                if premium < min_premium["value"] and premium != 0:
                    min_premium = {"year": year, "value": premium}

                if acres > max_acres["value"]:
                    max_acres = {"year": year, "value": acres}
                if acres < min_acres["value"] and acres != 0:
                    min_acres = {"year": year, "value": acres}

                if sold > max_sold["value"]:
                    max_sold = {"year": year, "value": sold}
                if sold < min_sold["value"] and sold != 0:
                    min_sold = {"year": year, "value": sold}

                if indemnified > max_indemnified["value"]:
                    max_indemnified = {"year": year, "value": indemnified}
                if indemnified < min_indemnified["value"] and indemnified != 0:
                    min_indemnified = {"year": year, "value": indemnified}

                total_indemnity += indemnity
                total_premium += premium
                total_acres += acres
                total_sold += sold
                total_indemnified += indemnified

            average_indemnity = total_indemnity / count
            average_premium = total_premium / count
            average_acres = total_acres / count
            average_sold = total_sold / count
            average_indemnified = total_indemnified / count

            response["0.75_max_indemnity"] = max_indemnity
            if min_indemnity["value"] != float("inf"):
                response["0.75_min_indemnity"] = min_indemnity
            else:
                response["0.75_min_indemnity"] = {"year": "", "value": 0}
            response["0.75_avg_indemnity"] = round(average_indemnity, 2)
            response["0.75_total_indemnity"] = total_indemnity

            response["0.75_max_premium"] = max_premium
            if min_premium["value"] != float("inf"):
                response["0.75_min_premium"] = min_premium
            else:
                response["0.75_min_premium"] = {"year": "", "value": 0}
            response["0.75_avg_premium"] = round(average_premium, 2)
            response["0.75_total_premium"] = total_premium

            response["0.75_max_acres"] = max_acres
            if min_acres["value"] != float("inf"):
                response["0.75_min_acres"] = min_acres
            else:
                response["0.75_min_acres"] = {"year": "", "value": 0}
            response["0.75_avg_acres"] = round(average_acres, 2)
            response["0.75_total_acres"] = total_acres

            response["0.75_max_sold"] = max_sold
            if min_sold["value"] != float("inf"):
                response["0.75_min_sold"] = min_sold
            else:
                response["0.75_min_sold"] = {"year": "", "value": 0}
            response["0.75_avg_sold"] = round(average_sold, 2)
            response["0.75_total_sold"] = total_sold

            response["0.75_max_indemnified"] = max_indemnified
            if min_indemnified["value"] != float("inf"):
                response["0.75_min_indemnified"] = min_indemnified
            else:
                response["0.75_min_indemnified"] = {"year": "", "value": 0}
            response["0.75_avg_indemnified"] = round(average_indemnified, 2)
            response["0.75_total_indemnified"] = total_indemnified

        if 0.8 in response:
            max_indemnity = {"year": "", "value": 0}
            min_indemnity = {"year": "", "value": float("inf")}
            max_premium = {"year": "", "value": 0}
            min_premium = {"year": "", "value": float("inf")}
            max_acres = {"year": "", "value": 0}
            min_acres = {"year": "", "value": float("inf")}
            max_sold = {"year": "", "value": 0}
            min_sold = {"year": "", "value": float("inf")}
            max_indemnified = {"year": "", "value": 0}
            min_indemnified = {"year": "", "value": float("inf")}
            total_indemnity = 0
            total_premium = 0
            total_acres = 0
            total_sold = 0
            total_indemnified = 0

            for year, values in response[0.80].items():
                indemnity = values.get("sum_indemnity", 0)
                premium = values.get("sum_actual_premium", 0)
                acres = values.get("acres", 0)
                sold = values.get("sum_policy_sold", 0)
                indemnified = values.get("sum_policy_indemnified", 0)

                if indemnity > max_indemnity["value"]:
                    max_indemnity = {"year": year, "value": indemnity}
                if indemnity < min_indemnity["value"] and indemnity != 0:
                    min_indemnity = {"year": year, "value": indemnity}

                if premium > max_premium["value"]:
                    max_premium = {"year": year, "value": premium}
                if premium < min_premium["value"] and premium != 0:
                    min_premium = {"year": year, "value": premium}

                if acres > max_acres["value"]:
                    max_acres = {"year": year, "value": acres}
                if acres < min_acres["value"] and acres != 0:
                    min_acres = {"year": year, "value": acres}

                if sold > max_sold["value"]:
                    max_sold = {"year": year, "value": sold}
                if sold < min_sold["value"] and sold != 0:
                    min_sold = {"year": year, "value": sold}

                if indemnified > max_indemnified["value"]:
                    max_indemnified = {"year": year, "value": indemnified}
                if indemnified < min_indemnified["value"] and indemnified != 0:
                    min_indemnified = {"year": year, "value": indemnified}

                total_indemnity += indemnity
                total_premium += premium
                total_acres += acres
                total_sold += sold
                total_indemnified += indemnified

            average_indemnity = total_indemnity / count
            average_premium = total_premium / count
            average_acres = total_acres / count
            average_sold = total_sold / count
            average_indemnified = total_indemnified / count

            response["0.8_max_indemnity"] = max_indemnity
            if min_indemnity["value"] != float("inf"):
                response["0.8_min_indemnity"] = min_indemnity
            else:
                response["0.8_min_indemnity"] = {"year": "", "value": 0}
            response["0.8_avg_indemnity"] = round(average_indemnity, 2)
            response["0.8_total_indemnity"] = total_indemnity

            response["0.8_max_premium"] = max_premium
            if min_premium["value"] != float("inf"):
                response["0.8_min_premium"] = min_premium
            else:
                response["0.8_min_premium"] = {"year": "", "value": 0}
            response["0.8_avg_premium"] = round(average_premium, 2)
            response["0.8_total_premium"] = total_premium

            response["0.8_max_acres"] = max_acres
            if min_acres["value"] != float("inf"):
                response["0.8_min_acres"] = min_acres
            else:
                response["0.8_min_acres"] = {"year": "", "value": 0}
            response["0.8_avg_acres"] = round(average_acres, 2)
            response["0.8_total_acres"] = total_acres

            response["0.8_max_sold"] = max_sold
            if min_sold["value"] != float("inf"):
                response["0.8_min_sold"] = min_sold
            else:
                response["0.8_min_sold"] = {"year": "", "value": 0}
            response["0.8_avg_sold"] = round(average_sold, 2)
            response["0.8_total_sold"] = total_sold

            response["0.8_max_indemnified"] = max_indemnified
            if min_indemnified["value"] != float("inf"):
                response["0.8_min_indemnified"] = min_indemnified
            else:
                response["0.8_min_indemnified"] = {"year": "", "value": 0}
            response["0.8_avg_indemnified"] = round(average_indemnified, 2)
            response["0.8_total_indemnified"] = total_indemnified

        if 0.85 in response:
            max_indemnity = {"year": "", "value": 0}
            min_indemnity = {"year": "", "value": float("inf")}
            max_premium = {"year": "", "value": 0}
            min_premium = {"year": "", "value": float("inf")}
            max_acres = {"year": "", "value": 0}
            min_acres = {"year": "", "value": float("inf")}
            max_sold = {"year": "", "value": 0}
            min_sold = {"year": "", "value": float("inf")}
            max_indemnified = {"year": "", "value": 0}
            min_indemnified = {"year": "", "value": float("inf")}
            total_indemnity = 0
            total_premium = 0
            total_acres = 0
            total_sold = 0
            total_indemnified = 0

            for year, values in response[0.85].items():
                indemnity = values.get("sum_indemnity", 0)
                premium = values.get("sum_actual_premium", 0)
                acres = values.get("acres", 0)
                sold = values.get("sum_policy_sold", 0)
                indemnified = values.get("sum_policy_indemnified", 0)

                if indemnity > max_indemnity["value"]:
                    max_indemnity = {"year": year, "value": indemnity}
                if indemnity < min_indemnity["value"] and indemnity != 0:
                    min_indemnity = {"year": year, "value": indemnity}

                if premium > max_premium["value"]:
                    max_premium = {"year": year, "value": premium}
                if premium < min_premium["value"] and premium != 0:
                    min_premium = {"year": year, "value": premium}

                if acres > max_acres["value"]:
                    max_acres = {"year": year, "value": acres}
                if acres < min_acres["value"] and acres != 0:
                    min_acres = {"year": year, "value": acres}

                if sold > max_sold["value"]:
                    max_sold = {"year": year, "value": sold}
                if sold < min_sold["value"] and sold != 0:
                    min_sold = {"year": year, "value": sold}

                if indemnified > max_indemnified["value"]:
                    max_indemnified = {"year": year, "value": indemnified}
                if indemnified < min_indemnified["value"] and indemnified != 0:
                    min_indemnified = {"year": year, "value": indemnified}

                total_indemnity += indemnity
                total_premium += premium
                total_acres += acres
                total_sold += sold
                total_indemnified += indemnified

            average_indemnity = total_indemnity / count
            average_premium = total_premium / count
            average_acres = total_acres / count
            average_sold = total_sold / count
            average_indemnified = total_indemnified / count

            response["0.85_max_indemnity"] = max_indemnity
            if min_indemnity["value"] != float("inf"):
                response["0.85_min_indemnity"] = min_indemnity
            else:
                response["0.85_min_indemnity"] = {"year": "", "value": 0}
            response["0.85_avg_indemnity"] = round(average_indemnity, 2)
            response["0.85_total_indemnity"] = total_indemnity

            response["0.85_max_premium"] = max_premium
            if min_premium["value"] != float("inf"):
                response["0.85_min_premium"] = min_premium
            else:
                response["0.85_min_premium"] = {"year": "", "value": 0}
            response["0.85_avg_premium"] = round(average_premium, 2)
            response["0.85_total_premium"] = total_premium

            response["0.85_max_acres"] = max_acres
            if min_acres["value"] != float("inf"):
                response["0.85_min_acres"] = min_acres
            else:
                response["0.85_min_acres"] = {"year": "", "value": 0}
            response["0.85_avg_acres"] = round(average_acres, 2)
            response["0.85_total_acres"] = total_acres

            response["0.85_max_sold"] = max_sold
            if min_sold["value"] != float("inf"):
                response["0.85_min_sold"] = min_sold
            else:
                response["0.85_min_sold"] = {"year": "", "value": 0}
            response["0.85_avg_sold"] = round(average_sold, 2)
            response["0.85_total_sold"] = total_sold

            response["0.85_max_indemnified"] = max_indemnified
            if min_indemnified["value"] != float("inf"):
                response["0.85_min_indemnified"] = min_indemnified
            else:
                response["0.85_min_indemnified"] = {"year": "", "value": 0}
            response["0.85_avg_indemnified"] = round(average_indemnified, 2)
            response["0.85_total_indemnified"] = total_indemnified

        if 0.9 in response:
            max_indemnity = {"year": "", "value": 0}
            min_indemnity = {"year": "", "value": float("inf")}
            max_premium = {"year": "", "value": 0}
            min_premium = {"year": "", "value": float("inf")}
            max_acres = {"year": "", "value": 0}
            min_acres = {"year": "", "value": float("inf")}
            max_sold = {"year": "", "value": 0}
            min_sold = {"year": "", "value": float("inf")}
            max_indemnified = {"year": "", "value": 0}
            min_indemnified = {"year": "", "value": float("inf")}
            total_indemnity = 0
            total_premium = 0
            total_acres = 0
            total_sold = 0
            total_indemnified = 0

            for year, values in response[0.90].items():
                indemnity = values.get("sum_indemnity", 0)
                premium = values.get("sum_actual_premium", 0)
                acres = values.get("acres", 0)
                sold = values.get("sum_policy_sold", 0)
                indemnified = values.get("sum_policy_indemnified", 0)

                if indemnity > max_indemnity["value"]:
                    max_indemnity = {"year": year, "value": indemnity}
                if indemnity < min_indemnity["value"] and indemnity != 0:
                    min_indemnity = {"year": year, "value": indemnity}

                if premium > max_premium["value"]:
                    max_premium = {"year": year, "value": premium}
                if premium < min_premium["value"] and premium != 0:
                    min_premium = {"year": year, "value": premium}

                if acres > max_acres["value"]:
                    max_acres = {"year": year, "value": acres}
                if acres < min_acres["value"] and acres != 0:
                    min_acres = {"year": year, "value": acres}

                if sold > max_sold["value"]:
                    max_sold = {"year": year, "value": sold}
                if sold < min_sold["value"] and sold != 0:
                    min_sold = {"year": year, "value": sold}

                if indemnified > max_indemnified["value"]:
                    max_indemnified = {"year": year, "value": indemnified}
                if indemnified < min_indemnified["value"] and indemnified != 0:
                    min_indemnified = {"year": year, "value": indemnified}

                total_indemnity += indemnity
                total_premium += premium
                total_acres += acres
                total_sold += sold
                total_indemnified += indemnified

            average_indemnity = total_indemnity / count
            average_premium = total_premium / count
            average_acres = total_acres / count
            average_sold = total_sold / count
            average_indemnified = total_indemnified / count

            response["0.9_max_indemnity"] = max_indemnity
            if min_indemnity["value"] != float("inf"):
                response["0.9_min_indemnity"] = min_indemnity
            else:
                response["0.9_min_indemnity"] = {"year": "", "value": 0}
            response["0.9_avg_indemnity"] = round(average_indemnity, 2)
            response["0.9_total_indemnity"] = total_indemnity

            response["0.9_max_premium"] = max_premium
            if min_premium["value"] != float("inf"):
                response["0.9_min_premium"] = min_premium
            else:
                response["0.9_min_premium"] = {"year": "", "value": 0}
            response["0.9_avg_premium"] = round(average_premium, 2)
            response["0.9_total_premium"] = total_premium

            response["0.9_max_acres"] = max_acres
            if min_acres["value"] != float("inf"):
                response["0.9_min_acres"] = min_acres
            else:
                response["0.9_min_acres"] = {"year": "", "value": 0}
            response["0.9_avg_acres"] = round(average_acres, 2)
            response["0.9_total_acres"] = total_acres

            response["0.9_max_sold"] = max_sold
            if min_sold["value"] != float("inf"):
                response["0.9_min_sold"] = min_sold
            else:
                response["0.9_min_sold"] = {"year": "", "value": 0}
            response["0.9_avg_sold"] = round(average_sold, 2)
            response["0.9_total_sold"] = total_sold

            response["0.9_max_indemnified"] = max_indemnified
            if min_indemnified["value"] != float("inf"):
                response["0.9_min_indemnified"] = min_indemnified
            else:
                response["0.9_min_indemnified"] = {"year": "", "value": 0}
            response["0.9_avg_indemnified"] = round(average_indemnified, 2)
            response["0.9_total_indemnified"] = total_indemnified

        return response

    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Error: {error}")
        traceback.print_exc()
    finally:
        session.close()


def fetch_insured_acres_data(data):
    session = db_session()

    state_name = data["state"]
    county_name = data["county"]

    try:

        query = """
        SELECT 
            bd.Year,
            SUM(bd.NetReportingAmount) AS TotalNetReportingAmount
        FROM 
            BusinessData bd
        JOIN 
            County c ON bd.CountyID = c.CountyID
        JOIN 
            State s ON c.StateID = s.StateID
        WHERE 
            s.StateName = :state_name AND 
            c.CountyName = :county_name
        GROUP BY 
            bd.Year
        """

        params = {"state_name": state_name, "county_name": county_name}

        result = session.execute(text(query), params)

        response = {}
        for item in result:
            year = item[0]
            acres = item[1]
            response[year] = acres

        current_year = datetime.now().year
        count = current_year - 1 - 2007

        max_acres = {"year": "", "value": 0}
        min_acres = {"year": "", "value": float("inf")}
        total_acres = 0

        for year, acres in response.items():
            if acres > max_acres["value"]:
                max_acres = {"year": year, "value": acres}
            if acres < min_acres["value"] and acres != 0:
                min_acres = {"year": year, "value": acres}

            total_acres += acres

        average_acres = total_acres / count

        response["max_acres"] = max_acres
        if min_acres["value"] != float("inf"):
            response["min_acres"] = min_acres
        else:
            response["min_acres"] = {"year": "", "value": 0}
        response["avg_acres"] = round(average_acres, 2)
        response["total_acres"] = total_acres

        return response

    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Error: {error}")
        traceback.print_exc()
    finally:
        session.close()


def fetch_interval_data(data):
    session = db_session()

    state_name = data["state"]
    county_name = data["county"]

    try:

        query = """
       SELECT 
            rd.Year,
            rd.Interval,
            rd.Index,
            rd.TotalRainfall
        FROM 
            RainfallData rd
        JOIN 
            County c ON rd.CountyID = c.CountyID
        JOIN 
            State s ON c.StateID = s.StateID
        WHERE 
            s.StateName = :state_name AND 
            c.CountyName = :county_name AND
            rd.Year >= 2007;
        """

        params = {"state_name": state_name, "county_name": county_name}

        result = session.execute(text(query), params)

        response = {}
        for item in result:
            year = item[0]
            interval = interval_codes[int(item[1])]
            index = item[2]
            total_rainfall = item[3]

            response.setdefault("metrics", {}).setdefault(year, {})[interval] = {
                "index": index,
                "total_rainfall": total_rainfall,
            }

        current_year = datetime.now().year
        count = current_year - 1 - 2007

        for interval in interval_months:
            max_index = {"year": "", "value": 0}
            min_index = {"year": "", "value": float("inf")}
            max_rainfall = {"year": "", "value": 0}
            min_rainfall = {"year": "", "value": float("inf")}
            total_index = 0
            total_rainfall = 0

            for year, values in response["metrics"].items():
                index = values[interval]["index"]
                rainfall = values[interval]["total_rainfall"]

                if index > max_index["value"]:
                    max_index = {"year": year, "value": index}
                if index < min_index["value"]:
                    min_index = {"year": year, "value": index}

                if rainfall > max_rainfall["value"]:
                    max_rainfall = {"year": year, "value": rainfall}
                if rainfall < min_rainfall["value"]:
                    min_rainfall = {"year": year, "value": rainfall}

                total_index += index
                total_rainfall += rainfall

            average_index = total_index / count
            average_rainfall = total_rainfall / count

            response[f"{interval}_max_index"] = max_index
            if min_index["value"] != float("inf"):
                response[f"{interval}_min_index"] = min_index
            else:
                response[f"{interval}_min_index"] = {"year": "", "value": 0}
            response[f"{interval}_average_index"] = round(average_index, 2)

            response[f"{interval}_max_rainfall"] = max_rainfall
            if min_rainfall["value"] != float("inf"):
                response[f"{interval}_min_rainfall"] = min_rainfall
            else:
                response[f"{interval}_min_rainfall"] = {"year": "", "value": 0}
            response[f"{interval}_average_rainfall"] = round(average_rainfall, 2)
            response[f"{interval}_total_rainfall"] = total_rainfall

        coverage_levels = [0.7, 0.75, 0.8, 0.85, 0.9]
        for coverage_level in coverage_levels:
            for interval_month in interval_months:
                total_invocations = 0
                for year in response["metrics"]:
                    for interval in response["metrics"][year]:
                        if (
                            interval == interval_month
                            and response["metrics"][year][interval]["index"]
                            < coverage_level
                        ):
                            total_invocations += 1

                response.setdefault("invocations", {}).setdefault(coverage_level, {})[
                    interval_month
                ] = total_invocations

        for coverage_level in coverage_levels:
            if coverage_level in response["invocations"]:
                max_triggers = {"interval": "", "value": 0}
                min_triggers = {"interval": "", "value": float("inf")}
                total_triggers = 0

                for interval, triggers in response["invocations"][
                    coverage_level
                ].items():
                    if triggers > max_triggers["value"]:
                        max_triggers = {"interval": interval, "value": triggers}
                    if triggers < min_triggers["value"]:
                        min_triggers = {"interval": interval, "value": triggers}

                    total_triggers += triggers

                response[f"{coverage_level}_max_triggers"] = max_triggers
                if min_triggers["value"] != float("inf"):
                    response[f"{coverage_level}_min_triggers"] = min_triggers
                else:
                    response[f"{coverage_level}_min_triggers"] = {
                        "interval": "",
                        "value": 0,
                    }
                response[f"{coverage_level}_total_triggers"] = total_triggers

        return response

    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Error: {error}")
        traceback.print_exc()
    finally:
        session.close()


def fetch_historical_trend(data):
    response = {"trend": {}}
    for year in range(2007, int(data["year"]) + 1):
        year_data = data.copy()
        year_data["year"] = year
        result = compute_decision(year_data)
        response["trend"][year] = result

    current_year = datetime.now().year
    count = current_year - 1 - 2007
    max_indemnity = {"year": "", "value": 0}
    min_indemnity = {"year": "", "value": float("inf")}
    total_indemnity = 0
    for year, values in response["trend"].items():
        if values:
            indemnity = values.get("sum_indemnity", 0)

            if indemnity > max_indemnity["value"]:
                max_indemnity = {"year": year, "value": indemnity}
            if indemnity < min_indemnity["value"] and indemnity != 0:
                min_indemnity = {"year": year, "value": indemnity}

            total_indemnity += indemnity

    average_indemnity = total_indemnity / count

    response["max_indemnity"] = max_indemnity
    if min_indemnity["value"] != float("inf"):
        response["min_indemnity"] = min_indemnity
    else:
        response["min_indemnity"] = {"year": "", "value": 0}
    response["avg_indemnity"] = round(average_indemnity, 2)
    response["total_indemnity"] = total_indemnity

    return response
