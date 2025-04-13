// src/components/TaskForm.jsx
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
  const navigate = useNavigate();

  // Get current geolocation with permission error handling
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
        const errorMsg =
          err.code === 1
            ? '❌ Permission denied. Please allow location access.'
            : `❌ Failed to get location: ${err.message}`;
        setLocationError(errorMsg);
      }
    );
  };

  // Save the note
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (task.name.trim() && task.location) {
      const note = {
        id: Date.now(),
        description: task.name,
        location: task.location,
        photo: task.photo,
        date: new Date().toLocaleString()
      };

      await saveNote(note);
      onSubmit?.(note);
      setTask({ name: '', location: null, photo: null });
      navigate('/notes');
    } else {
      alert('⚠️ Please provide both the place name and your location.');
    }
  };

  return (
    <div className="task-form-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <button onClick={() => navigate('/')} className="back-button">← Back to Home</button>

      <form onSubmit={handleSubmit} className="task-form">
        <h2>📝 Add New Travel Note</h2>

        <label htmlFor="place">📍 Where did you go?</label>
        <input
          id="place"
          type="text"
          value={task.name}
          onChange={(e) => setTask({ ...task, name: e.target.value })}
          placeholder="Enter place name"
          required
        />

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
            <div style={{ color: 'red', marginTop: '5px' }}>{locationError}</div>
          )}
        </div>

        <div className="form-group camera-container">
          <Camera onCapture={(photo) => setTask({ ...task, photo })} />
        </div>

        <button type="submit" disabled={!task.location}>
          ✅ Save Travel Note
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
