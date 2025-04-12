import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Camera from './Camera';
import Map from './Map';
import { saveNote } from '../db';

function Features() {
  const navigate = useNavigate();

  // State to hold the captured photo
  const [photo, setPhoto] = useState(null);

  // Handle the photo capture event
  const handleCapture = async (capturedPhoto) => {
    setPhoto(capturedPhoto);

    // Example of saving captured photo to IndexedDB
    const note = {
      id: Date.now(),
      description: "Captured during travel",
      location: null, // You can add geolocation later
      photo: capturedPhoto,
      date: new Date().toLocaleString()
    };

    await saveNote(note);
    
    // Notify the user and navigate to notes page
    alert('✅ Photo captured and saved successfully!');
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
      <button
        onClick={() => navigate('/')}
        style={{
          alignSelf: 'flex-start',
          marginBottom: '15px',
          backgroundColor: '#6c5ce7',
          color: '#fff',
          padding: '8px 16px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ← Back to Home
      </button>

      <h2 style={{ marginBottom: '20px', alignSelf: 'flex-start' }}>
        🌍 Capture Your Travel Moments
      </h2>

      {/* Camera Section */}
      <section style={{ marginBottom: '25px', width: '100%' }}>
        <h3 style={{ marginBottom: '10px' }}>
          📷 Take a Photo
        </h3>
        <div style={{ width: '100%', borderRadius: '6px', position: 'relative' }}>
          <Camera onCapture={handleCapture} />
        </div>

        {/* Display the captured photo */}
        {photo && (
          <img
            src={photo}
            alt="Captured Travel"
            style={{
              width: '100%',
              borderRadius: '8px',
              marginTop: '15px'
            }}
          />
        )}
      </section>

      {/* Map Section */}
      <section style={{ width: '100%' }}>
        <h3 style={{ marginBottom: '10px' }}>
          📍 Your Current Location
        </h3>
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

