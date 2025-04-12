// src/App.js
import './App.css';
import { useState, useEffect, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import NotesPage from './components/NotesPage';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskDetail from './components/TaskDetail';
import TaskEdit from './components/TaskEdit';
import Home from './components/Home';            
import Features from './components/Features';    

function StatusBar({ status }) {
  return (
    <div style={{ backgroundColor: '#f5f5f5', padding: '10px', fontSize: '14px' }}>
      {status}
    </div>
  );
}

function App() {
  const [statusMessage, setStatusMessage] = useState('🌐 Waiting to send location...');
  const lastSuccessTime = useRef(null);
  const retrying = useRef(false);

  useEffect(() => {
    const sendLocation = () => {
      if (!navigator.geolocation) {
        setStatusMessage('❌ Geolocation not supported by this browser');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const data = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            timestamp: new Date().toISOString()
          };

          fetch('https://travel-note-server.onrender.com/api/location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })
            .then(res => res.json())
            .then(() => {
              lastSuccessTime.current = Date.now();
              retrying.current = false;
              setStatusMessage('✅ Location sent at ' + new Date().toLocaleTimeString());
            })
            .catch(err => {
              retrying.current = true;
              setStatusMessage('❌ Send failed: ' + err.message);
            });
        },
        (err) => {
          retrying.current = true;
          setStatusMessage('❌ Geolocation error: ' + err.message + ' (Make sure to allow location)');
        }
      );
    };

    const interval = setInterval(() => {
      const now = Date.now();
      const last = lastSuccessTime.current || 0;
      const diffMins = (now - last) / (1000 * 60);

      if (!last || diffMins >= 30 || (retrying.current && diffMins >= 3)) {
        sendLocation();
      }
    }, 60 * 1000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="App">
        <StatusBar status={statusMessage} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/new" element={<TaskForm />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/list" element={<TaskList />} />
          <Route path="/detail/:id" element={<TaskDetail />} />
          <Route path="/edit/:id" element={<TaskEdit />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
