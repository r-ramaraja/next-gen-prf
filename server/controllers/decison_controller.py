import json
from flask import request, Blueprint
from services.decision_service import (
    compute_decision,
    fetch_intended_use_data,
    fetch_historical_trend,
    fetch_coverage_level_data,
)
from decimal_encoder import DecimalEncoder


def construct_decision_blueprint():
    blueprint = Blueprint("decision", __name__)

    @blueprint.route("/calculate", methods=["POST"])
    def calculate_decision():
        data = request.json
        result = compute_decision(data)
        if result:
            return json.dumps(result)
        else:
            return "Error", 500

    @blueprint.route("/viz/usage", methods=["POST"])
    def get_intended_use_data():
        data = request.json
        result = fetch_intended_use_data(data)
        return json.dumps(result, cls=DecimalEncoder)

    @blueprint.route("/viz/coverage", methods=["POST"])
    def get_coverage_level_data():
        data = request.json
        result = fetch_coverage_level_data(data)
        return json.dumps(result, cls=DecimalEncoder)

    @blueprint.route("/trend", methods=["POST"])
    def get_historical_trend():
        data = request.json
        result = fetch_historical_trend(data)
        return json.dumps(result, cls=DecimalEncoder)

    return blueprint
