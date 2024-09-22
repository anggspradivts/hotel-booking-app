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
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

function LeafletControlGeocoder({ setCoordinates, propertyId }) {
  const [position, setPosition] = useState(null);
  const map = useMap();
  const router = useRouter();

  const handleMapClick = async ({ lat, lng }) => {
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const { address } = res.data;
      const { postcode, city, state, country } = address; //Limit the data that will be sent to the server
      //Restructure the data that will be sent to the server to be updated
      const data = {
        latitude: lat,
        longitude: lng,
        propertyId,
        postcode,
        city,
        state,
        country,
      };
      
      const editRes = await axios.patch("/api/property/edit-location", data);
      if (editRes.status === 200) {
        toast.success("Location updated successfully");
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  };

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      handleMapClick({ lat, lng })
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
        placeholder: "Search here...",
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
  }, [map]);

  return position === null ? null : (
    <Marker icon={icon} position={[position.lat, position.lng]}></Marker>
  );
}

export const MapLeafletGeocoder = ({
  initialLat,
  initialLng,
  setCoordinates,
  propertyId
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
      <LeafletControlGeocoder setCoordinates={setCoordinates} propertyId={propertyId} />
    </MapContainer>
  );
};
