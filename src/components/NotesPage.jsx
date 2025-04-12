// src/components/NotesPage.jsx
import React, { useEffect, useState } from 'react';
import { getNotes, deleteNote } from '../db';
import { useNavigate } from 'react-router-dom';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  // Fetch notes from IndexedDB
  const fetchNotes = async () => {
    const storedNotes = await getNotes();
    setNotes(storedNotes);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Handle delete operation
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(id);
      fetchNotes(); // Refresh after deletion
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <button
        onClick={() => navigate('/')}
        className="back-button"
        style={{ marginBottom: '15px' }}
      >
        ← Back to Home
      </button>

      <h2>Your Travel Notes</h2>

      {notes.length === 0 ? (
        <p>No notes saved yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {notes.map(note => (
            <li
              key={note.id}
              style={{
                border: '1px solid #ccc',
                marginBottom: '20px',
                padding: '10px',
                borderRadius: '8px',
                background: '#fff'
              }}
            >
              {note.photo && (
                <img
                  src={note.photo}
                  alt="Note Snapshot"
                  style={{ maxWidth: '100%', height: 'auto', borderRadius: '6px' }}
                />
              )}
              <p><strong>Description:</strong> {note.description}</p>
              <p><strong>Date:</strong> {note.date || 'N/A'}</p>
              {note.location && (
                <p><strong>Location:</strong> {note.location.lat}, {note.location.lng}</p>
              )}

              {/* ✅ Action buttons */}
              <div style={{ marginTop: '10px' }}>
                <button
                  onClick={() => navigate(`/edit/${note.id}`)}
                  className="edit-button"
                  style={{ marginRight: '10px' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="delete-button"
                  style={{ backgroundColor: '#e74c3c' }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotesPage;
