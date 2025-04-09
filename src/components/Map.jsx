import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
// eslint-disable-next-line no-undef
delete L.Icon.Default.prototype._getIconUrl;
// eslint-disable-next-line no-undef
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function Map() {
  const [position, setPosition] = useState([51.505, -0.09]); // Default position

  useEffect(() => {
    // Get current location using Geolocation API
    navigator.geolocation.getCurrentPosition(
      pos => setPosition([pos.coords.latitude, pos.coords.longitude]),
      err => console.error('Geolocation error:', err),
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    <MapContainer 
      center={position} 
      zoom={13} 
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Marker position={position}>
        <Popup>Your current location</Popup>
      </Marker>
    </MapContainer>
  );
}