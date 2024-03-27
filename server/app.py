import os
from flask import Flask
from flask_cors import CORS
from database import close_db
from controllers.decison_controller import construct_decision_blueprint
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

app.teardown_appcontext(close_db)

app.register_blueprint(construct_decision_blueprint(), url_prefix="/api/v1")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("SERVER_PORT")))
