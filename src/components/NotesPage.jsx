// src/components/NotesPage.jsx
import React, { useEffect, useState } from 'react';
import { getNotes } from '../db';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const storedNotes = await getNotes();
      setNotes(storedNotes);
    };
    fetchNotes();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Travel Notes</h2>
      {notes.length === 0 ? (
        <p>No notes saved yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {notes.map(note => (
            <li key={note.id} style={{ border: '1px solid #ccc', marginBottom: '20px', padding: '10px' }}>
              {note.photo && (
                <img src={note.photo} alt="Note Snapshot" style={{ maxWidth: '100%', height: 'auto' }} />
              )}
              <p><strong>Description:</strong> {note.description}</p>
              <p><strong>Date:</strong> {note.date || 'N/A'}</p>
              {note.location && (
                <p><strong>Location:</strong> {note.location.lat}, {note.location.lng}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotesPage;
