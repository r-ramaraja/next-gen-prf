import psycopg2
import traceback
from database import get_db


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
    db = get_db()

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
    insured_acres = data["insured_acres"]
    interval_distribution = data["interval_distribution"]

    try:
        cur = db.cursor()

        query = """
        SELECT cd.CountyBaseValue
        FROM CountyDetail cd
        JOIN County c ON cd.CountyID = c.CountyID
        JOIN State s ON c.StateID = s.StateID
        WHERE s.StateName = %s AND c.CountyName = %s AND cd.IntendedUse = %s
        """

        if irrigation_practice is not None:
            query += "AND cd.IrrigationPractice = %s "
        else:
            query += "AND cd.IrrigationPractice IS NULL "

        if organic_practice is not None:
            query += "AND cd.OrganicPractice = %s "
        else:
            query += "AND cd.OrganicPractice IS NULL;"

        params = [state_name, county_name, intended_use]
        if irrigation_practice is not None:
            params.append(irrigation_practice)
        if organic_practice is not None:
            params.append(organic_practice)

        cur.execute(
            query,
            tuple(params),
        )
        result = cur.fetchone()
        county_base = float(result[0]) if result else None

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
            WHERE s.StateName = %s AND c.CountyName = %s AND cd.GridID = %s AND cd.Interval = %s AND cd.CoverageLevel = %s
            """
            cur.execute(
                query,
                (
                    state_name,
                    county_name,
                    int(grid_id),
                    int(interval),
                    int(coverage_level),
                ),
            )
            result = cur.fetchone()
            premium_rate = float(result[0])
            subsidy_level = float(result[1])
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
            WHERE rd.GridID = %s AND rd.Year = %s AND rd.Interval = %s
            """

            cur.execute(
                query,
                (int(grid_id), int(year), int(interval)),
            )
            result = cur.fetchone()
            final_index = float(result[0])
            index[interval] = final_index
            pcf = ((coverage_level / 100) - final_index) / (coverage_level / 100)
            if pcf > 0:
                indemnity[interval] = round(pcf * policy_protection[interval])
            else:
                indemnity[interval] = 0

        result = {"intervals": {}}
        for interval, percent_value in interval_distribution.items():
            result["intervals"][interval] = {
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

        result["total_acres"] = insured_acres
        result["subsidy"] = list(subsidy.values())[0] * 100
        result["county_base"] = county_base
        result["sum_percent_value"] = sum(interval_distribution.values()) * 100
        result["sum_policy_protection"] = sum(policy_protection.values())
        result["sum_premium"] = sum(premium.values())
        result["sum_premium_subsidy"] = sum(premium_subsidy.values())
        result["sum_actual_premium"] = sum(actual_premium.values())
        result["sum_indemnity"] = sum(indemnity.values())
        return result

    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Error: {error}")
        traceback.print_exc()
    finally:
        cur.close()


def fetch_intended_use_data(data):
    db = get_db()

    state_name = data["state"]
    county_name = data["county"]

    try:
        cur = db.cursor()

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
            s.StateName = %s AND 
            c.CountyName = %s AND
            (bd.IntendedUse = 'haying' OR bd.IntendedUse = 'grazing')
        GROUP BY 
            bd.Year, bd.IntendedUse;
        """

        params = [state_name, county_name]

        cur.execute(
            query,
            tuple(params),
        )

        result = cur.fetchall()

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

        return response

    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Error: {error}")
        traceback.print_exc()
    finally:
        cur.close()


def fetch_coverage_level_data(data):
    db = get_db()

    state_name = data["state"]
    county_name = data["county"]

    try:
        cur = db.cursor()

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
            s.StateName = %s AND 
            c.CountyName = %s AND
            bd.CoverageLevel != 0.0
        GROUP BY 
            bd.Year, bd.CoverageLevel;
        """

        params = [state_name, county_name]

        cur.execute(
            query,
            tuple(params),
        )

        result = cur.fetchall()

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
            s.StateName = %s AND 
            c.CountyName = %s
        GROUP BY 
            pd.Year, pd.CoverageLevel;
        """

        params = [state_name, county_name]

        cur.execute(
            query,
            tuple(params),
        )

        result = cur.fetchall()

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

        return response

    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Error: {error}")
        traceback.print_exc()
    finally:
        cur.close()


def fetch_insured_acres_data(data):
    db = get_db()

    state_name = data["state"]
    county_name = data["county"]

    try:
        cur = db.cursor()

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
            s.StateName = %s AND 
            c.CountyName = %s
        GROUP BY 
            bd.Year
        """

        params = [state_name, county_name]

        cur.execute(
            query,
            tuple(params),
        )

        result = cur.fetchall()

        response = {}
        for item in result:
            year = item[0]
            acres = item[1]
            response[year] = acres

        return response

    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Error: {error}")
        traceback.print_exc()
    finally:
        cur.close()


def fetch_interval_data(data):
    db = get_db()

    state_name = data["state"]
    county_name = data["county"]

    try:
        cur = db.cursor()

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
            s.StateName = %s AND 
            c.CountyName = %s AND
            rd.Year >= 2007;
        """

        params = [state_name, county_name]

        cur.execute(
            query,
            tuple(params),
        )

        result = cur.fetchall()

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

        return response

    except (Exception, psycopg2.DatabaseError) as error:
        print(f"Error: {error}")
        traceback.print_exc()
    finally:
        cur.close()


def fetch_historical_trend(data):
    response = {}
    for year in range(2007, int(data["year"]) + 1):
        year_data = data.copy()
        year_data["year"] = year
        result = compute_decision(year_data)
        response[year] = result

    return response
