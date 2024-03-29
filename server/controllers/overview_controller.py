import json
from flask import request, Blueprint
from services.overview_service import fetch_county_base, fetch_state_county_geojson


def construct_overview_blueprint():
    blueprint = Blueprint("overview", __name__)

    @blueprint.route("/countybase", methods=["POST"])
    def get_county_base():
        result = fetch_county_base(request.json)
        if result:
            return json.dumps(result)
        else:
            return "Error", 500

    @blueprint.route("/geojson", methods=["POST"])
    def get_state_county_geojson():
        return fetch_state_county_geojson(request.json)

    return blueprint
