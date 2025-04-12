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

  // Function to get user's current location
  const handleLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('❌ Geolocation not supported by your browser.');
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
        setLocationError(null); // Clear any previous error
      },
      (err) => {
        setLocationError('❌ Location access denied: ' + err.message);
      }
    );
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if both name and location are provided
    if (task.name.trim() && task.location) {
      const note = {
        id: Date.now(), // Unique ID for each note
        description: task.name,
        location: task.location,
        photo: task.photo,
        date: new Date().toLocaleString()
      };

      await saveNote(note);         // Save the note to IndexedDB
      onSubmit?.(note);             // Optional callback after saving note
      setTask({ name: '', location: null, photo: null });  // Reset the form fields
      navigate('/notes');           // Navigate to notes page after saving
    } else {
      alert('⚠️ Please provide both the place name and your location.');
    }
  };

  return (
    <div className="task-form-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* Back to Home Button */}
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

        {/* Location Button & Error Message */}
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
              {locationError}
            </div>
          )}
        </div>

        {/* Camera Component */}
        <div className="form-group camera-container">
          <Camera onCapture={(photo) => setTask({ ...task, photo })} />
        </div>

        {/* Save Button */}
        <button type="submit" disabled={!task.location}>
          ✅ Save Travel Note
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
