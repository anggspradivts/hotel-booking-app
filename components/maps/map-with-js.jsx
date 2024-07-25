import { useEffect, useState } from "react";
import {
  useMap,
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
} from "react-leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

import icon from "./constants";

function LeafletControlGeocoder({ setCoordinates }) {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const newPosition = { lat, lng };
      setPosition(newPosition);
      setCoordinates(newPosition);
    },
  });

  useEffect(() => {
    let geocoder = L.Control.Geocoder.nominatim();
    if (typeof URLSearchParams !== "undefined" && location.search) {
      // parse /?geocoder=nominatim from URL
      const params = new URLSearchParams(location.search);
      const geocoderString = params.get("geocoder");
      if (geocoderString && L.Control.Geocoder[geocoderString]) {
        geocoder = L.Control.Geocoder[geocoderString]();
      } else if (geocoderString) {
        console.warn("Unsupported geocoder", geocoderString);
      }
    }
    if (!map.hasLayer(L.Control.Geocoder)) {
      L.Control.geocoder({
        query: "",
        // placeholder: "Search here...",
        defaultMarkGeocode: false,
        geocoder,
      })
        .on("markgeocode", function (e) {
          const latlng = e.geocode.center;
          L.marker(latlng, { icon })
            .addTo(map)
            .bindPopup(e.geocode.name)
            .openPopup();
          map.fitBounds(e.geocode.bbox);
        })
        .addTo(map);
    }
  }, []);

  return position === null ? null : (
    <Marker icon={icon} position={[position.lat, position.lng]}></Marker>
  );
}

export const MapLeafletGeocoder = ({
  initialLat,
  initialLng,
  setCoordinates,
}) => {
  return (
    <MapContainer
      center={[initialLat, initialLng]}
      zoom={13}
      style={{ height: "300px" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LeafletControlGeocoder setCoordinates={setCoordinates} />
    </MapContainer>
  );
};
