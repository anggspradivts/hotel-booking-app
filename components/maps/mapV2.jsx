// Doesnt work yet because react-leaflet doesnt provide the type for typescript, but you can provide it by yourself
"use client";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import * as L from "leaflet";
import icon from "./constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";

//only map view, not interactive
export const LeafletMapView = ({ lat, lng, style }) => {
  return (
    <MapContainer center={[lat, lng]} zoom={13} style={style}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker icon={icon} position={[lat, lng]}>
        <Popup>Your Hotel Location</Popup>
      </Marker>
    </MapContainer>
  );
};


function LeafletControlGeocoder({
  setCoordinates,
  propertyId,
}) {
  const [position, setPosition] = useState(null);
  const map = useMap();
  const router = useRouter();
  const handleMapClick = async ({ lat, lng }) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const { address } = res.data;
      const { postcode, city, state, county, country } = address; //Limit the data that will be sent to the server
      //Restructure the data that will be sent to the server to be updated
      const data = {
        latitude: lat,
        longitude: lng,
        propertyId,
        postcode,
        city,
        state,
        county,
        country,
      };

      const editRes = await axios.patch(
        "/api/partner/property/edit/location",
        data
      );
      if (editRes.status === 200) {
        toast.success("Location updated successfully");
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      handleMapClick({ lat, lng });
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


export const LeafletMap = ({
  initialLat,
  initialLng,
  setCoordinates,
  propertyId,
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
      <LeafletControlGeocoder
        setCoordinates={setCoordinates}
        propertyId={propertyId}
      />
    </MapContainer>
  );
};
