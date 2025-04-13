import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Camera from './Camera';
import Map from './Map';
import { saveNote } from '../db';

function Features() {
  const navigate = useNavigate();

  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Get current location from browser
  const handleLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('❌ Geolocation is not supported.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setLocationError(null);
      },
      (err) => {
        setLocationError('❌ Failed to get location: ' + err.message);
      }
    );
  };

  // Capture and save the travel note
  const handleCapture = async (capturedPhoto) => {
    setPhoto(capturedPhoto);

    const note = {
      id: Date.now(),
      description: "Captured during travel",
      location,
      photo: capturedPhoto,
      date: new Date().toLocaleString()
    };

    await saveNote(note);
    alert('✅ Photo and location saved!');
    navigate('/notes');
  };

  return (
    <div 
      style={{ 
        maxWidth: '700px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <button onClick={() => navigate('/')} style={{ alignSelf: 'flex-start', marginBottom: '15px' }}>
        ← Back to Home
      </button>

      <h2 style={{ marginBottom: '20px', alignSelf: 'flex-start' }}>
        🌍 Capture Your Travel Moments
      </h2>

      {/* Camera */}
      <section style={{ marginBottom: '25px', width: '100%' }}>
        <h3>📷 Take a Photo</h3>
        <Camera onCapture={handleCapture} />
        {photo && <img src={photo} alt="Captured" style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }} />}
      </section>

      {/* Location */}
      <section style={{ marginBottom: '25px', width: '100%' }}>
        <h3>📍 Location</h3>
        <button onClick={handleLocation} style={{ marginBottom: '10px' }}>
          📍 Set Location
        </button>

        {location && (
          <p style={{ color: 'green' }}>
            ✅ {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </p>
        )}

        {locationError && (
          <p style={{ color: 'red' }}>{locationError}</p>
        )}
      </section>

      {/* Map */}
      <section style={{ width: '100%' }}>
        <h3>🗺️ Your Current Location</h3>
        <div style={{
          width: '100%',
          height: '400px',
          borderRadius: '6px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Map />
        </div>
      </section>
    </div>
  );
}

export default Features;
