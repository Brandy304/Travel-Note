import { useEffect, useState } from 'react';
import { getNotes } from '../db';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      const savedTasks = await getNotes();
      setTasks(savedTasks || []);
    };
    loadTasks();
  }, []);

  return (
    <div className="task-list">
      {tasks.length === 0 ? (
        <p>No travel notes yet. Add your first adventure!</p>
      ) : (
        tasks.map(task => (
          <div key={task.id} className="task-card">
            <h3>{task.description}</h3> {/* ✅ Fixed field name */}
            {task.photo && <img src={task.photo} alt="Location" />}
            <p>Location: {task.location?.lat}, {task.location?.lng}</p>
          </div>
        ))
      )}
    </div>
  );
}
