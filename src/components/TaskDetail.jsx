import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Map from './Map';

const TaskDetail = ({ tasks, onDelete }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const task = tasks.find(t => t.id === parseInt(id));

  if (!task) return <p>Task not found</p>;

  return (
    <div className="task-detail">
      <button onClick={() => navigate(-1)} className="back-button">
        &larr; Back
      </button>
      
      <h2>{task.name}</h2>
      
      <div className="detail-section">
        <h3>Location</h3>
        <Map 
          center={[task.location.lat, task.location.lng]} 
          zoom={15}
          markers={[
            {
              position: [task.location.lat, task.location.lng],
              popup: task.name
            }
          ]}
          style={{ height: '300px' }}
        />
        <p>Coordinates: {task.location.lat.toFixed(6)}, {task.location.lng.toFixed(6)}</p>
      </div>

      {task.photo && (
        <div className="detail-section">
          <h3>Photo</h3>
          <img 
            src={task.photo} 
            alt={`${task.name} location`} 
            className="detail-photo"
          />
        </div>
      )}

      <div className="action-buttons">
        <button 
          onClick={() => navigate(`/edit/${task.id}`)}
          className="edit-button"
        >
          Edit
        </button>
        <button 
          onClick={() => {
            onDelete(task.id);
            navigate('/');
          }}
          className="delete-button"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskDetail;