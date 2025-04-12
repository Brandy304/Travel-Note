import React, { useEffect, useState } from 'react';
import { getNotes, deleteNote } from '../db';
import { useNavigate } from 'react-router-dom';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  // Load saved notes
  const fetchNotes = async () => {
    const storedNotes = await getNotes();
    setNotes(storedNotes);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(id);
      fetchNotes();
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <button
        onClick={() => navigate('/')}
        className="back-button"
        style={{
          marginBottom: '20px',
          backgroundColor: '#6c5ce7',
          color: 'white',
          padding: '8px 16px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ← Back to Home
      </button>

      <h2 style={{ marginBottom: '20px' }}>📖 Your Travel Notes</h2>

      {notes.length === 0 ? (
        <p>No notes saved yet. Start your journey now!</p>
      ) : (
        notes.map(note => (
          <div
            key={note.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}
          >
            {note.photo && (
              <img
                src={note.photo}
                alt="Travel"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '250px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  marginBottom: '10px'
                }}
              />
            )}

            <p><strong>📍 Place:</strong> {note.description}</p>
            {note.location && (
              <p>
                <strong>🧭 Location:</strong> {note.location.lat}, {note.location.lng}
              </p>
            )}
            <p><strong>🕒 Date:</strong> {note.date}</p>

            <div style={{ marginTop: '10px' }}>
              <button
                onClick={() => navigate(`/edit/${note.id}`)}
                style={{
                  marginRight: '10px',
                  padding: '6px 12px',
                  backgroundColor: '#00b894',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(note.id)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#d63031',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotesPage;
