// src/components/Map.jsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function Map({ center = [51.505, -0.09], zoom = 13, markers = [], style }) {
  return (
    <MapContainer center={center} zoom={zoom} style={style || { height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {markers.map((m, idx) => (
        <Marker key={idx} position={m.position}>
          <Popup>{m.popup || '📍 Location'}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
