import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderCode,
  Search,
  Plus,
  Play,
  Edit2,
  Trash2,
  Tag,
  Calendar,
  Code2,
  Database,
  X,
  FileCode
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function SavedProjects() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Edit modal
  const [editingProject, setEditingProject] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editTags, setEditTags] = useState('');

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await api.projects.list(categoryFilter, search);
      setProjects(data.projects || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [categoryFilter, search, user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project from the database?')) return;
    try {
      await api.projects.delete(id);
      loadProjects();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleOpenInAnalyzer = (p) => {
    sessionStorage.setItem('codedna_load_code', p.source_code);
    sessionStorage.setItem('codedna_load_title', p.title);
    navigate('/analyzer');
  };

  const startEdit = (p) => {
    setEditingProject(p);
    setEditTitle(p.title);
    setEditDesc(p.description || '');
    setEditCategory(p.category || 'General DSA');
    setEditTags((p.tags || []).join(', '));
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      await api.projects.update(editingProject.id, {
        title: editTitle,
        description: editDesc,
        category: editCategory,
        tags: editTags.split(',').map((t) => t.trim()).filter(Boolean),
      });
      setEditingProject(null);
      loadProjects();
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-purple">Persistent Database Repository</span>
            <span className="badge badge-cyan">SQLite / MySQL Ready</span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Saved Projects
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Manage and organize your custom C programs. Persisted safely in the central database across sessions.
          </p>
        </div>

        <button
          onClick={() => navigate('/analyzer')}
          className="btn btn-primary"
        >
          <Plus size={16} />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="General DSA">General DSA</option>
            <option value="Arrays">Arrays</option>
            <option value="Linked Lists">Linked Lists</option>
            <option value="Stacks">Stacks</option>
            <option value="Queues">Queues</option>
            <option value="Trees & BST">Trees & BST</option>
            <option value="Graphs">Graphs</option>
            <option value="Searching & Sorting">Searching & Sorting</option>
            <option value="Hashing">Hashing</option>
            <option value="Recursion & DP">Recursion & DP</option>
          </select>
        </div>

        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px', fontSize: '0.8125rem' }}
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {projects.map((p) => (
            <div
              key={p.id}
              className="glass-panel"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge badge-purple">{p.category}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {p.language?.toUpperCase()}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px', minHeight: '36px' }}>
                  {p.description || 'No description provided.'}
                </p>

                {/* Tags */}
                {p.tags && p.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {p.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', marginTop: '10px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => startEdit(p)}
                    className="btn btn-secondary btn-sm"
                    title="Edit Metadata"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="btn btn-danger btn-sm"
                    title="Delete Project"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <button
                  onClick={() => handleOpenInAnalyzer(p)}
                  className="btn btn-primary btn-sm"
                >
                  <Play size={13} />
                  <span>Analyze</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel empty-state">
          <FolderCode size={48} className="empty-state-icon" />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '6px' }}>
            No Saved Projects Found
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 16px' }}>
            Save custom C algorithms and data structures directly from the C Code Analyzer to organize your personal curriculum.
          </p>
          <button
            onClick={() => navigate('/analyzer')}
            className="btn btn-primary"
          >
            <Plus size={16} />
            <span>Create Your First Project</span>
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingProject && (
        <div className="modal-overlay" onClick={() => setEditingProject(null)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Edit Project Details</h3>
              <button onClick={() => setEditingProject(null)} className="btn btn-secondary btn-sm" style={{ padding: '4px' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={saveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Title
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Category
                </label>
                <select
                  className="form-select"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                >
                  <option value="General DSA">General DSA</option>
                  <option value="Arrays">Arrays</option>
                  <option value="Linked Lists">Linked Lists</option>
                  <option value="Stacks">Stacks</option>
                  <option value="Queues">Queues</option>
                  <option value="Trees & BST">Trees & BST</option>
                  <option value="Graphs">Graphs</option>
                  <option value="Searching & Sorting">Searching & Sorting</option>
                  <option value="Hashing">Hashing</option>
                  <option value="Recursion & DP">Recursion & DP</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Description
                </label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
