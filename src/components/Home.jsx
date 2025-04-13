import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <header className="App-header">
      <img src="/travel-note-logo.png" className="App-logo" alt="Travel Note Logo" />
      <h1>Welcome to Travel Note</h1>
      <p>Record and share your travel experiences easily.</p>

      <Link to="/features">
        <button style={{ marginTop: '15px' }}>📸 Start Journey</button>
      </Link>
      <Link to="/new">
        <button style={{ marginTop: '10px' }}>➕ Add Travel Note</button>
      </Link>
      <Link to="/notes">
        <button style={{ marginTop: '10px' }}>📖 View My Journey</button>
      </Link>
    </header>
  );
}

export default Home;