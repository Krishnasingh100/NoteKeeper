import React, { useState,useEffect } from 'react';
import './noteKeeper.css';

const NoteKeeper = () => {
  const [notes, setNotes] = useState(()=>{
    const  savedNotes =localStorage.getItem('notes');
    return savedNotes ?
    JSON.parse(savedNotes):[];
  });
  
  useEffect(() => {
  localStorage.setItem('notes', JSON.stringify(notes));
}, [notes]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNote = () => {
    if (newNote.title.trim() || newNote.content.trim()) {
      const note = {
        id: Date.now(),
        title: newNote.title.trim() || 'Untitled Note',
        content: newNote.content,
        createdAt: new Date().toISOString()
      };
      setNotes([note, ...notes]);
      setNewNote({ title: '', content: '' });
      setIsCreating(false);
    }
  };

  const handleUpdateNote = (id, updatedNote) => {
    setNotes(notes.map(note => note.id === id ? { ...note, ...updatedNote } : note));
    setEditingId(null);
  };

  const handleDeleteNote = (id) => setNotes(notes.filter(note => note.id !== id));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const NoteCard = ({ note }) => {
    const [editTitle, setEditTitle] = useState(note.title);
    const [editContent, setEditContent] = useState(note.content);
    const isEditing = editingId === note.id;

    const handleSave = () => {
      if (editTitle.trim() || editContent.trim()) {
        handleUpdateNote(note.id, { title: editTitle.trim() || 'Untitled Note', content: editContent });
      }
    };

    const handleCancel = () => {
      setEditTitle(note.title);
      setEditContent(note.content);
      setEditingId(null);
    };

    return (
      <div className="note-card">
        {isEditing ? (
          <div>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="edit-title-input"
              placeholder="Note title..."
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="edit-content-textarea"
              placeholder="Write your note..."
            />
            <div className="note-actions">
              <span className="note-date">Created: {formatDate(note.createdAt)}</span>
              <div>
                <button onClick={handleSave} className="btn btn-save">Save</button>
                <button onClick={handleCancel} className="btn btn-cancel">Cancel</button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="note-header">
              <h3 className="note-title">{note.title}</h3>
              <div className="note-buttons">
                <button onClick={() => setEditingId(note.id)} className="btn-icon btn-edit" title="Edit note">✏</button>
                <button onClick={() => handleDeleteNote(note.id)} className="btn-icon btn-delete" title="Delete note">🗑</button>
              </div>
            </div>
            <p className="note-content">{note.content || 'No content'}</p>
            <div className="note-date">Created: {formatDate(note.createdAt)}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="app">
      <div className="header">
        <div className="header-content">
          <div className="header-top">
            <div className="app-title">
              <span className="app-icon">📝</span> NoteKeeper
            </div>
            <button onClick={() => setIsCreating(true)} className="btn btn-primary">➕ New Note</button>
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </div>

      <div className="main-content">
        {isCreating && (
          <div className="modal">
            <div className="modal-content">
              <h2 className="modal-title">Create New Note</h2>
              <input
                type="text"
                placeholder="Note title..."
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="modal-input"
                autoFocus
              />
              <textarea
                placeholder="Write your note..."
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                className="modal-textarea"
              />
              <div className="modal-actions">
                <button onClick={() => { setIsCreating(false); setNewNote({ title: '', content: '' }); }} className="btn btn-secondary">Cancel</button>
                <button onClick={handleCreateNote} className="btn btn-primary">Create Note</button>
              </div>
            </div>
          </div>
        )}

        {filteredNotes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h3 className="empty-title">{searchTerm ? 'No notes found' : 'No notes yet'}</h3>
            <p className="empty-text">{searchTerm ? 'Try adjusting your search terms' : 'Create your first note to get started'}</p>
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map(note => <NoteCard key={note.id} note={note} />)}
          </div>
        )}

        <div className="stats">
          <p>{filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}{searchTerm && ` found for "${searchTerm}"`}</p>
        </div>
      </div>
    </div>
  );
};

export default NoteKeeper;