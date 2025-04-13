import React, { useState } from 'react';
import Camera from './Camera';
import { saveNote } from '../db';
import { useNavigate } from 'react-router-dom';

const TaskForm = ({ onSubmit }) => {
  const [task, setTask] = useState({
    name: '',
    location: null,
    photo: null
  });

  const [locationError, setLocationError] = useState(null);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');

  const navigate = useNavigate();

  // Automatically get location using Geolocation API
  const handleLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('❌ Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setTask(prev => ({
          ...prev,
          location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          }
        }));
        setLocationError(null);
      },
      (err) => {
        setLocationError('❌ Failed to get location: ' + err.message);
      }
    );
  };

  // Submit travel note
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Try to use manual location if geolocation fails
    let finalLocation = task.location;

    if (!finalLocation && manualLat && manualLng) {
      finalLocation = {
        lat: parseFloat(manualLat),
        lng: parseFloat(manualLng)
      };
    }

    if (task.name.trim() && finalLocation) {
      const note = {
        id: Date.now(),
        description: task.name,
        location: finalLocation,
        photo: task.photo,
        date: new Date().toLocaleString()
      };

      await saveNote(note);
      onSubmit?.(note);
      setTask({ name: '', location: null, photo: null });
      navigate('/notes');
    } else {
      alert('⚠️ Please enter name and location (auto or manual).');
    }
  };

  return (
    <div className="task-form-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <button onClick={() => navigate('/')} style={{ marginBottom: '20px' }}>
        ← Back to Home
      </button>

      <form onSubmit={handleSubmit} className="task-form">
        <h2>📝 Add New Travel Note</h2>

        {/* Name Input */}
        <label htmlFor="place">📍 Where did you go?</label>
        <input
          id="place"
          type="text"
          value={task.name}
          onChange={(e) => setTask({ ...task, name: e.target.value })}
          placeholder="Enter place name"
          required
        />

        {/* Location Fetch Button */}
        <div className="form-group">
          <button type="button" onClick={handleLocation}>
            {task.location ? '📌 Location Saved' : '📍 Get Current Location'}
          </button>
          {task.location && (
            <div style={{ color: 'green', marginTop: '5px' }}>
              ✅ {task.location.lat.toFixed(4)}, {task.location.lng.toFixed(4)}
            </div>
          )}
          {locationError && (
            <div style={{ color: 'red', marginTop: '5px' }}>
              {locationError}<br />
              You may enter location manually:
            </div>
          )}

          {/* Manual Location Inputs */}
          {locationError && (
            <div style={{ marginTop: '10px' }}>
              <input
                type="number"
                placeholder="Latitude"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                step="0.0001"
                style={{ marginBottom: '5px', width: '100%' }}
              />
              <input
                type="number"
                placeholder="Longitude"
                value={manualLng}
                onChange={(e) => setManualLng(e.target.value)}
                step="0.0001"
                style={{ width: '100%' }}
              />
            </div>
          )}
        </div>

        {/* Camera Input */}
        <div className="form-group camera-container">
          <Camera onCapture={(photo) => setTask({ ...task, photo })} />
        </div>

        {/* Submit Button */}
        <button type="submit">
          ✅ Save Travel Note
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
