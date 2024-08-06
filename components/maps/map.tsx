// Doesnt work yet because react-leaflet doesnt provide the type for typescript, but you can provide it by yourself
"use client";
import "leaflet/dist/leaflet.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder"
import L from "leaflet";
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
  useMap
} from "react-leaflet";

interface LeafletMapViewProps {
  lat: number;
  lng: number;
}
export const LeafletMapView = ({ lat, lng }: LeafletMapViewProps) => {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      style={{ height: "300px", width: "100%" }}
    >
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


//
interface Coordinates {
  lat: number;
  lng: number;
}
interface LeafletControlGeocoderProps {
  propertyId: string;
  setCoordinates: Dispatch<SetStateAction<Coordinates | null>>;
}
function LeafletControlGeocoder({ setCoordinates, propertyId }: LeafletControlGeocoderProps) {
  const [position, setPosition] = useState<Coordinates | null>(null);
  const map = useMap();
  const router = useRouter();

  interface handleMapClickProps {
    lat: number;
    lng: number
  }
  const handleMapClick = async ({ lat, lng }: handleMapClickProps) => {
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
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

      console.log(data)
      
      const editRes = await axios.patch("/api/partner/property/edit/location", data);
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
  }, []);

  return position === null ? null : (
    <Marker icon={icon} position={[position.lat, position.lng]}></Marker>
  );
}

interface LeafletMapTsxProps {
  initialLat: number;
  initialLng: number;
  setCoordinates: Dispatch<SetStateAction<Coordinates | null>>;
  propertyId: string;
}
export const LeafletMapTsx = ({
  initialLat,
  initialLng,
  setCoordinates,
  propertyId
}: LeafletMapTsxProps) => {
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