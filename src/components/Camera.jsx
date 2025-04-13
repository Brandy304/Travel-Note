// src/components/Camera.jsx
import React, { useRef, useState, useEffect } from 'react';

const Camera = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [photo, setPhoto] = useState(null);

  // Start video stream
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreaming(true);
        setCaptured(false);
        setPhoto(null);
      }
    } catch (error) {
      alert('📵 Camera permission denied or unavailable.\n\n' + error.message);
    }
  };

  // Take a photo
  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    const imageDataUrl = canvas.toDataURL('image/png');
    setPhoto(imageDataUrl);
    setCaptured(true);
    onCapture?.(imageDataUrl);
  };

  // Stop video stream after photo
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreaming(false);
  };

  // Stop camera when unmounting
  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="camera-container">
      {!streaming && (
        <button onClick={startCamera}>📸 Start Camera</button>
      )}

      <video
        ref={videoRef}
        style={{
          width: '100%',
          display: streaming ? 'block' : 'none',
          borderRadius: '6px',
          marginBottom: '10px'
        }}
      />

      {streaming && !captured && (
        <button onClick={capturePhoto}>📷 Capture Photo</button>
      )}

      {captured && photo && (
        <>
          <img
            src={photo}
            alt="Captured"
            className="photo-preview"
            style={{
              marginTop: '10px',
              width: '100%',
              borderRadius: '6px'
            }}
          />
          <button onClick={startCamera}>🔁 Retake Photo</button>
        </>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default Camera;
