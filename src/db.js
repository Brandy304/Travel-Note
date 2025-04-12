// IndexedDB configuration
const DB_NAME = 'TravelNotesDB';
const DB_VERSION = 1;
const STORE_NAME = 'notes';

// Initialize database
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Save or update a note locally and sync to server
export const saveNote = async (note) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).put(note);

  // Sync with backend
  try {
    await fetch('https://travel-note-server.onrender.com/api/location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    });
  } catch (error) {
    console.error('Failed to sync note to server:', error);
  }
};

// Get all notes from local IndexedDB
export const getNotes = async () => {
  const db = await initDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result);
  });
};

// Delete a note locally and notify the server
export const deleteNote = async (id) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).delete(id);

  // Sync deletion with backend
  try {
    await fetch(`https://travel-note-server.onrender.com/api/location/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Failed to delete note on server:', error);
  }
};
