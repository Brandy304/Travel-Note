import './App.css';
import NotesPage from './components/NotesPage';
import Camera from './components/Camera';
import Map from './components/Map';
import { useState, useEffect, useRef } from 'react';

function App() {
  const [page, setPage] = useState('home');
  const lastSuccessTime = useRef(null);
  const retrying = useRef(false);
  const [statusMessage, setStatusMessage] = useState('Waiting to send location...');

  // ✅ Function to send location to backend
  const sendLocationToServer = () => {
    if (!navigator.geolocation) {
      setStatusMessage('❌ Geolocation not supported');
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
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
          .then((res) => res.json())
          .then((res) => {
            lastSuccessTime.current = Date.now();
            retrying.current = false;
            setStatusMessage('✅ Location sent successfully at ' + new Date().toLocaleTimeString());
          })
          .catch((err) => {
            retrying.current = true;
            setStatusMessage('❌ Failed to send location: ' + err.message);
          });
      },
      (err) => {
        retrying.current = true;
        setStatusMessage('❌ Geolocation error: ' + err.message);
      }
    );
  };

  // 🕒 Check every 1 min: send every 30 mins, retry every 3 mins
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const last = lastSuccessTime.current || 0;
      const diffMins = (now - last) / (1000 * 60);

      if (!lastSuccessTime.current || diffMins >= 30) {
        sendLocationToServer();
      } else if (retrying.current && diffMins >= 3) {
        sendLocationToServer();
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      {/* ✅ Show live status */}
      <div style={{ backgroundColor: '#f0f0f0', padding: '10px', fontSize: '14px' }}>
        {statusMessage}
      </div>

      {page === 'home' && (
        <header className="App-header">
          <img src="/travel-note-logo.png" className="App-logo" alt="Travel Note Logo" />
          <h1>Welcome to Travel Note</h1>
          <p>Record and share your travel experiences with ease.</p>

          <button onClick={() => setPage('features')} style={{ marginTop: '20px' }}>
            Start Your Journey
          </button>
          <button onClick={() => setPage('notes')} style={{ marginTop: '20px' }}>
            View Your Notes
          </button>
        </header>
      )}

      {page === 'features' && (
        <div style={{ padding: '20px' }}>
          <h2>Capture Your Travel</h2>
          <button onClick={() => setPage('home')} style={{ marginBottom: '20px' }}>← Back to Home</button>
          <h3>Camera</h3>
          <Camera />
          <h3>Location</h3>
          <Map />
        </div>
      )}

      {page === 'notes' && (
        <div style={{ padding: '20px' }}>
          <button onClick={() => setPage('home')} style={{ marginBottom: '20px' }}>← Back to Home</button>
          <NotesPage />
        </div>
      )}
    </div>
  );
}

export default App;
