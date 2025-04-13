// src/components/TaskDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Map from './Map';
import { getNotes, deleteNote } from '../db';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const notes = await getNotes();
      const found = notes.find(t => t.id === parseInt(id));
      if (found) setTask(found);
    };
    fetch();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(task.id);
      navigate('/notes');
    }
  };

  if (!task) return <p>❌ Task not found.</p>;

  return (
    <div className="task-detail" style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <button onClick={() => navigate('/notes')} className="back-button" style={{ marginBottom: '15px' }}>
        ← Back to Notes
      </button>

      <h2>{task.description}</h2>

      <div className="detail-section">
        <h3>📍 Location</h3>
        {task.location ? (
          <>
            <Map
              center={[task.location.lat, task.location.lng]}
              zoom={15}
              markers={[{
                position: [task.location.lat, task.location.lng],
                popup: task.description
              }]}
              style={{ height: '300px', marginBottom: '10px' }}
            />
            <p><strong>Coordinates:</strong> {task.location.lat.toFixed(6)}, {task.location.lng.toFixed(6)}</p>
          </>
        ) : (
          <p style={{ color: 'gray' }}>⚠️ No location available</p>
        )}
      </div>

      {task.photo && (
        <div className="detail-section">
          <h3>📷 Photo</h3>
          <img
            src={task.photo}
            alt="Location snapshot"
            className="detail-photo"
            style={{ maxWidth: '100%', borderRadius: '6px' }}
          />
        </div>
      )}

      <div className="action-buttons" style={{ marginTop: '15px' }}>
        <button onClick={() => navigate(`/edit/${task.id}`)} className="edit-button">
          ✏️ Edit
        </button>
        <button onClick={handleDelete} className="delete-button">
          🗑 Delete
        </button>
      </div>
    </div>
  );
};

export default TaskDetail;
