// src/App.js
import './App.css';
import NotesPage from './components/NotesPage';
import Camera from './components/Camera';
import Map from './components/Map';
import { useState } from 'react';

function App() {
  // Control which page is shown: 'home', 'notes', 'camera', 'map'
  const [page, setPage] = useState('home');

  return (
    <div className="App">
      {/* Homepage */}
      {page === 'home' && (
        <header className="App-header">
          <img src="/travel-note-logo.png" className="App-logo" alt="Travel Note Logo" />
          <h1>Welcome to Travel Note</h1>
          <p>Record and share your travel experiences with ease.</p>

          {/* Button to go to camera/map/notes functionality */}
          <button onClick={() => setPage('features')} style={{ marginTop: '20px' }}>
            Start Your Journey
          </button>

          <button onClick={() => setPage('notes')} style={{ marginTop: '20px' }}>
            View Your Notes
          </button>
        </header>
      )}

      {/* Feature page: camera + map */}
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

      {/* Notes list page */}
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
