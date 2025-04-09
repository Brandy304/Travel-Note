// src/components/Camera.jsx
import React, { useRef, useState } from 'react';
import { saveNote } from '../db';

const Camera = () => {
  const videoRef = useRef(null);
  const [photo, setPhoto] = useState(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      alert('Camera access denied: ' + error.message);
    }
  };

  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    const photoData = canvas.toDataURL('image/jpeg');
    setPhoto(photoData);

    // Save with location
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const note = {
          id: Date.now(),
          photo: photoData,
          description: 'A note from camera',
          date: new Date().toLocaleDateString(),
          location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          }
        };
        await saveNote(note);
        alert('Photo saved with location!');
      },
      err => alert('Geolocation failed: ' + err.message)
    );
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxHeight: '300px' }} />
      <div>
        <button onClick={startCamera}>Start Camera</button>
        <button onClick={capturePhoto}>Take & Save</button>
      </div>
      {photo && <img src={photo} alt="Captured" style={{ marginTop: '20px', maxWidth: '100%' }} />}
    </div>
  );
};

export default Camera;
