import React, { useState } from 'react';
import Camera from './Camera';

const TaskForm = ({ onSubmit }) => {
  const [task, setTask] = useState({
    name: '',
    location: null,
    photo: null
  });

  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setTask(prev => ({
          ...prev,
          location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          }
        }));
      },
      (err) => alert('Location access denied: ' + err.message)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.name.trim() && task.location) {
      onSubmit(task);
      setTask({ name: '', location: null, photo: null });
    } else {
      alert('Please add task name and location!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        value={task.name}
        onChange={(e) => setTask({...task, name: e.target.value})}
        placeholder="Where did you go?"
        required
      />
      
      <div className="form-group">
        <button type="button" onClick={handleLocation}>
          {task.location ? '✓ Location Saved' : 'Get Current Location'}
        </button>
        {task.location && (
          <span>
            {task.location.lat.toFixed(4)}, {task.location.lng.toFixed(4)}
          </span>
        )}
      </div>

      <Camera onCapture={(photo) => setTask({...task, photo})} />
      
      <button type="submit" disabled={!task.location}>
        Save Travel Note
      </button>
    </form>
  );
};

export default TaskForm;