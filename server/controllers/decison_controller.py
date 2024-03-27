import json
from flask import request, Blueprint
from services.decision_service import compute_decision


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

    return blueprint
