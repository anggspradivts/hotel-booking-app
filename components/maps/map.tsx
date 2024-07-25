// Doesnt work yet because react-leaflet doesnt provide the type for typescript, but you can provide it by yourself
"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import "leaflet-control-geocoder";
import L from "leaflet";
import icon from "./constants"

interface LeafletMapViewProps {
  lat: number,
  lng: number
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


// interface Coordinates {
//   lat: number;
//   lng: number;
// }
// interface LeafletMapProps {
//   initialLat: number;
//   initialLng: number;
//   setCoordinates: Dispatch<SetStateAction<Coordinates | null>>;
// }
// const LocationMarker: React.FC<{ setCoordinates: Dispatch<SetStateAction<Coordinates | null>> }> = ({ setCoordinates }) => {
//   const [position, setPosition] = useState<Coordinates | null>(null);

//   useMapEvents({
//     click(e) {
//       const { lat, lng } = e.latlng;
//       const newPosition = { lat, lng };
//       setPosition(newPosition);
//       setCoordinates(newPosition);
//     }
//   });

//   return position === null ? null : (
//     <Marker position={[position.lat, position.lng]}>
//     </Marker>
//   );
// };
// export const LeafletMap: React.FC<LeafletMapProps> = ({ initialLat, initialLng, setCoordinates }) => {
//   const mapRef = useRef<L.Map | null>(null);

//   useEffect(() => {
//     if (!mapRef.current) return;

//     const map = mapRef.current;

//     const geocoder = L.Control.Geocoder.nominatim();
//     const control = L.Control.geocoder({
//       geocoder: geocoder,
//       defaultMarkGeocode: false,
//     }).addTo(map);

//     control.on("markgeocode", (e: any) => {
//       const latLng = e.geocode.center;
//       setCoordinates({ lat: latLng.lat, lng: latLng.lng });
//       map.setView(latLng, 13);
//       L.marker(latLng).addTo(map).bindPopup(e.geocode.name).openPopup();
//     });

//     map.on("click", (e: L.LeafletMouseEvent) => {
//       const { lat, lng } = e.latlng;
//       setCoordinates({ lat, lng });
//       L.marker([lat, lng]).addTo(map);
//     });

//     return () => {
//       map.off();
//       map.remove();
//     };
//   }, [setCoordinates]);

//   return (
//     <MapContainer
//       center={[initialLat, initialLng]}
//       zoom={13}
//       // whenReady={mapRef.current = mapRef.current || mapInstance;}
//       style={{ height: "400px", width: "100%" }}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       />
//     </MapContainer>
//   );
// };
