// components/Camera.jsx
import React, { useRef, useState } from 'react';

const Camera = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreaming(true);
      })
      .catch(err => {
        alert('Error accessing camera: ' + err.message);
      });
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const imageDataUrl = canvas.toDataURL('image/png');
    onCapture(imageDataUrl);
  };

  return (
    <div className="camera-container">
      {!streaming && (
        <button onClick={startCamera}>
          📸 Start Camera
        </button>
      )}
      <video ref={videoRef} style={{ width: '100%', display: streaming ? 'block' : 'none' }} />
      {streaming && (
        <>
          <button onClick={capturePhoto}>
            📷 Capture Photo
          </button>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </>
      )}
    </div>
  );
};

export default Camera;
