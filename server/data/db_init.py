import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

db_host = os.getenv("DATABASE_HOST")
db_username = os.getenv("DATABASE_USERNAME")
db_password = os.getenv("DATABASE_PASSWORD")
db_name = os.getenv("DATABASE_NAME")
db_port = os.getenv("DATABASE_PORT")

conn = psycopg2.connect(
    dbname=db_name,
    user=db_username,
    password=db_password,
    host=db_host,
    port=db_port,
)

# Open a cursor to perform database operations
cur = conn.cursor()

# Create tables
cur.execute(
    """
    CREATE TABLE State (
        StateID INT PRIMARY KEY,
        StateName VARCHAR(255) NOT NULL
    );
"""
)

cur.execute(
    """
    CREATE TABLE County (
        StateID INT NOT NULL,
        CountyID INT,
        CountyName VARCHAR(255) NOT NULL,
        PRIMARY KEY (StateID, CountyID),
        FOREIGN KEY (StateID) REFERENCES State(StateID)
    );
"""
)

cur.execute(
    """
    CREATE TABLE CountyDetail (
      StateID INT NOT NULL,
      CountyID INT NOT NULL,
      IntendedUse VARCHAR(255),
      IrrigationPractice VARCHAR(255),
      OrganicPractice VARCHAR(255),
      CountyBaseValue DECIMAL NOT NULL,
      FOREIGN KEY (StateID, CountyID) REFERENCES County(StateID, CountyID),
      UNIQUE (StateID, CountyID, IntendedUse, IrrigationPractice, OrganicPractice)
  );
"""
)

cur.execute(
    """
    CREATE TABLE RainfallData (
        GridID INT NOT NULL,
        Year INT NOT NULL,
        Interval INT NOT NULL,
        Index DECIMAL NOT NULL,
        TotalRainfall DECIMAL,
        HistoricalAverageRainfall DECIMAL,
        PRIMARY KEY (GridID, Year, Interval)
    );
"""
)

cur.execute(
    """
    CREATE TABLE CoverageData (
        StateID INT NOT NULL,
        CountyID INT NOT NULL,
        GridID INT NOT NULL,
        Interval INT NOT NULL,
        CoverageLevel DECIMAL NOT NULL,
        PremiumRate DECIMAL NOT NULL,
        SubsidyLevel DECIMAL NOT NULL,
        PRIMARY KEY (StateID, CountyID, GridID, Interval, CoverageLevel),
        FOREIGN KEY (StateID, CountyID) REFERENCES County(StateID, CountyID)
    );
"""
)

# Commit changes and close the connection
conn.commit()
cur.close()
conn.close()
