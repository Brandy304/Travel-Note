// src/components/TaskEdit.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Camera from './Camera';
import Map from './Map';
import { getNotes, saveNote } from '../db';

const TaskEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Load the task
  useEffect(() => {
    const fetch = async () => {
      const notes = await getNotes();
      const note = notes.find(t => t.id === parseInt(id));
      if (note) setTask(note);
    };
    fetch();
  }, [id]);

  const handleLocationUpdate = () => {
    if (!navigator.geolocation) {
      setLocationError('❌ Your browser does not support Geolocation.');
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
        setLocationError('❌ Location error: ' + err.message);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveNote(task);
    navigate(`/detail/${task.id}`);
  };

  if (!task) return <p>Task not found.</p>;

  return (
    <div className="task-form-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <button onClick={() => navigate('/notes')} style={{ marginBottom: '20px' }}>
        ← Back to Notes
      </button>

      <h2>✏️ Edit Travel Note</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>📍 Place Name</label>
          <input
            type="text"
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>📡 Location</label>
          <button type="button" onClick={handleLocationUpdate}>
            {task.location ? '📌 Update Location' : '📍 Set Location'}
          </button>
          {task.location && (
            <Map
              center={[task.location.lat, task.location.lng]}
              zoom={15}
              style={{ height: '200px', marginTop: '10px' }}
            />
          )}
          {locationError && <p style={{ color: 'red' }}>{locationError}</p>}
        </div>

        <div className="form-group">
          <label>📷 Photo</label>
          <Camera
            onCapture={(photo) => setTask({ ...task, photo })}
            initialPhoto={task.photo}
          />
        </div>

        <div className="form-actions" style={{ marginTop: '15px' }}>
          <button type="button" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="save-button">💾 Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default TaskEdit;

