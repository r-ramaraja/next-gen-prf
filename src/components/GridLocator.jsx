import React, { useRef, useEffect } from "react";
import L from "leaflet";
import * as turf from "@turf/turf";
import "leaflet-control-geocoder";

import "./GridLocator.css";

export default function GridLocator({
  setMarkers,
  markers,
  mapInstance,
  grids,
  counties,
  states,
  view,
}) {
  const mapRef = useRef(null);
  const markerList = [...markers];

  useEffect(() => {
    if (!mapRef || !mapInstance) return;

    // Initial map setup
    if (!mapRef.current) return; // Guard clause if ref is not attached

    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, { attributionControl: false }).setView(
        view.center,
        view.zoom
      );

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
      }).addTo(mapInstance.current);

      L.control.attribution({ prefix: false }).addTo(mapInstance.current);

      for (const { lat, lng, markerInfo, gridcode, state, county, id } of markers) {
        const newMarker = L.marker([lat, lng]).addTo(mapInstance.current);
        newMarker.bindPopup(markerInfo);

        setMarkers((prevMarkers) => {
          const filteredMarkers = prevMarkers.filter(
            (marker) => marker.lat != lat && marker.lng != lng
          );

          return [
            ...filteredMarkers,
            {
              lat,
              lng,
              marker: newMarker,
              gridcode,
              state,
              county,
              markerInfo,
              id,
            },
          ];
        });
      }

      const addMarker = (lat, lng, gridcode, state, county) => {
        if (!gridcode || !state || !county) {
          console.warn("Marker outside USA bounds ignored.");
          return;
        }

        let doesExist = false;
        for (const marker of markerList) {
          if (marker.lat === lat && marker.lng === lng) {
            doesExist = true;
            break;
          }
        }
        if (doesExist) {
          return;
        }
        const newMarker = L.marker([lat, lng]).addTo(mapInstance.current);
        let markerInfo = "Marker at " + lat.toFixed(3) + ", " + lng.toFixed(3);
        if (gridcode) {
          markerInfo += "<br>Grid ID: " + gridcode;
        }
        if (state) {
          markerInfo += "<br>State: " + state;
        }
        if (county) {
          markerInfo += "<br>County: " + county;
        }
        newMarker.bindPopup(markerInfo).openPopup();
        setMarkers((prevMarkers) => [
          ...prevMarkers,
          {
            lat,
            lng,
            marker: newMarker,
            gridcode,
            state,
            county,
            markerInfo,
            id: prevMarkers.length > 0 ? prevMarkers[prevMarkers.length - 1].id + 1 : 0,
          },
        ]);
        markerList.push({ lat, lng, gridcode, state, county, markerInfo });
      };

      const gridOnEachFeature = (feature, layer) => {
        // Create a label for the feature
        var label = L.marker(layer.getBounds().getCenter(), {
          icon: L.divIcon({
            className: "label", // Use the 'label' class from your CSS
            html: feature.properties.GRIDCODE,
            iconSize: null, // Let CSS handle the size
          }),
        });

        // Function to add or remove the label based on zoom level
        function updateLabel() {
          var zoom = mapInstance.current.getZoom();
          if (zoom > 9 && mapInstance.current.getBounds().intersects(layer.getBounds())) {
            // Adjust zoom level as needed
            label.addTo(mapInstance.current);
          } else {
            label.remove();
          }
        }

        // Update label on map events
        mapInstance.current.on("zoomend moveend", updateLabel);

        // Initially update the label
        updateLabel();
      };

      const cpc_grids = L.geoJSON(grids, {
        style: function () {
          return {
            color: "black",
            weight: 2,
            fillOpacity: 0,
          };
        },
        onEachFeature: gridOnEachFeature,
      }).addTo(mapInstance.current);

      const updateCpcGridsVisibility = () => {
        const zoom = mapInstance.current.getZoom();
        if (zoom > 9) {
          if (!mapInstance.current.hasLayer(cpc_grids)) {
            cpc_grids.addTo(mapInstance.current);
          }
        } else {
          if (mapInstance.current.hasLayer(cpc_grids)) {
            mapInstance.current.removeLayer(cpc_grids);
          }
        }
      };

      mapInstance.current.on("zoomend", updateCpcGridsVisibility);

      // Initially call the function to set the correct visibility
      updateCpcGridsVisibility();

      const countyOnEachFeature = (feature, layer) => {
        // Create a label for the feature
        var label = L.marker(layer.getBounds().getCenter(), {
          icon: L.divIcon({
            className: "county-label", // Use the 'label' class from your CSS
            html: feature.properties.NAME,
            iconSize: null, // Let CSS handle the size
          }),
        });

        // Function to add or remove the label based on zoom level
        function updateLabel() {
          var zoom = mapInstance.current.getZoom();
          if (zoom > 8 && mapInstance.current.getBounds().intersects(layer.getBounds())) {
            // Adjust zoom level as needed
            label.addTo(mapInstance.current);
          } else {
            label.remove();
          }
        }

        // Update label on map events
        mapInstance.current.on("zoomend moveend", updateLabel);

        // Initially update the label
        updateLabel();
      };

      const usa_counties = L.geoJSON(counties, {
        style: function () {
          return {
            color: "blue",
            weight: 2,
            fillOpacity: 0,
          };
        },
        onEachFeature: countyOnEachFeature,
      }).addTo(mapInstance.current);

      const updateCountiesVisibility = () => {
        const zoom = mapInstance.current.getZoom();
        if (zoom > 8) {
          if (!mapInstance.current.hasLayer(usa_counties)) {
            usa_counties.addTo(mapInstance.current);
          }
        } else {
          if (mapInstance.current.hasLayer(usa_counties)) {
            mapInstance.current.removeLayer(usa_counties);
          }
        }
      };

      mapInstance.current.on("zoomend", updateCountiesVisibility);

      // Initially call the function to set the correct visibility
      updateCountiesVisibility();

      mapInstance.current.on("click", function (e) {
        var coord = e.latlng;
        var lat = coord.lat;
        var lng = coord.lng;

        // Creating a GeoJSON Point for the clicked location
        var point = turf.point([lng, lat]);

        // Check each feature in your GeoJSON layer
        var gridcode = null;
        var state = null;
        var county = null;
        cpc_grids.eachLayer(function (layer) {
          // Check if the point is inside the polygon
          if (turf.inside(point, layer.toGeoJSON())) {
            gridcode = layer.feature.properties.GRIDCODE;
          }
        });
        usa_counties.eachLayer(function (layer) {
          // Check if the point is inside the polygon
          if (turf.inside(point, layer.toGeoJSON())) {
            county = layer.feature.properties.NAME;
            state = states[layer.feature.properties.STATEFP].name;
          }
        });

        addMarker(lat, lng, gridcode, state, county);
      });

      let geoCoderOptions = {
        collapsed: false,
        geocoder: L.Control.Geocoder.nominatim({
          geocodingQueryParams: {
            countrycodes: "us",
            limit: 5,
          },
        }),
        errorMessage: "Sorry, that address could not be found.",
        showUniqueResult: false,
        suggestMinLength: 3,
        suggestTimeout: 250 /* ms */,
        defaultMarkGeocode: false,
        placeholder: "Type the location and press enter...",
      };

      const geocoder = L.Control.geocoder(geoCoderOptions).addTo(mapInstance.current);

      geocoder.on("markgeocode", function (e) {
        var bbox = e.geocode.bbox;
        var { lng, lat } = e.geocode.center;

        // Creating a GeoJSON Point for the searched location
        var point = turf.point([lng, lat]);

        // Check each feature in your GeoJSON layer
        var gridcode = null;
        var state = null;
        var county = null;
        cpc_grids.eachLayer(function (layer) {
          // Check if the point is inside the polygon
          if (turf.inside(point, layer.toGeoJSON())) {
            gridcode = layer.feature.properties.GRIDCODE;
          }
        });
        usa_counties.eachLayer(function (layer) {
          // Check if the point is inside the polygon
          if (turf.inside(point, layer.toGeoJSON())) {
            county = layer.feature.properties.NAME;
            state = states[layer.feature.properties.STATEFP].name;
          }
        });

        addMarker(lat, lng, gridcode, state, county);

        mapInstance.current.fitBounds(bbox);
      });
    }

    return () => {
      //Clean up the map
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return <div ref={mapRef} style={{ height: "100%", width: "100%" }} />;
}
