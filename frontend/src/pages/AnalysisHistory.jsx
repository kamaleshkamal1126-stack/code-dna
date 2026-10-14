import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Trash2,
  Play,
  Layers,
  TrendingUp,
  Fingerprint,
  Calendar,
  AlertCircle,
  FileText,
  Clock,
  ArrowRight,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AnalysisHistoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await api.analysis.getHistory();
      setHistory(data.history || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this analysis record from database?')) return;
    try {
      await api.analysis.deleteHistoryItem(id);
      if (selectedRecord?.id === id) setSelectedRecord(null);
      loadHistory();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear your entire analysis history? This action is irreversible.')) return;
    try {
      await api.analysis.clearHistory();
      setSelectedRecord(null);
      loadHistory();
    } catch (err) {
      alert(`Clear failed: ${err.message}`);
    }
  };

  const handleReopenInAnalyzer = (record) => {
    sessionStorage.setItem('codedna_load_code', record.source_code);
    sessionStorage.setItem('codedna_load_title', record.title || 'Past Analysis');
    navigate('/analyzer');
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-purple">Audit Trail</span>
            <span className="badge badge-blue">SQLite Persistent Logs</span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Analysis History
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Review past static analysis runs, inspect previous Big-O estimates, and audit detected data structure patterns.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="btn btn-danger btn-sm"
          >
            <Trash2 size={14} />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {/* Main Content Layout */}
      {history.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: selectedRecord ? 'minmax(320px, 420px) 1fr' : '1fr', gap: '24px', alignItems: 'start' }}>
          {/* History Records Table / List */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '14px', letterSpacing: '0.05em' }}>
              Historical Audits ({history.length})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {history.map((record) => {
                const isSelected = selectedRecord?.id === record.id;
                const formattedDate = record.created_at
                  ? new Date(record.created_at).toLocaleString()
                  : 'Recent';

                return (
                  <div
                    key={record.id}
                    onClick={() => setSelectedRecord(record)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'rgba(139, 92, 246, 0.16)' : 'var(--bg-surface)',
                      border: isSelected ? '1px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                        {record.title || `Analysis #${record.id}`}
                      </span>
                      <span className="badge badge-purple">{record.language?.toUpperCase()}</span>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <span>Worst: <strong style={{ color: 'var(--accent-purple-light)' }}>{record.time_complexity}</strong></span>
                      <span>•</span>
                      <span>Space: <strong style={{ color: 'var(--accent-cyan)' }}>{record.space_complexity}</strong></span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      <span>{formattedDate}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(record.id); }}
                        style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '2px' }}
                        title="Delete Record"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Record Detail Pane */}
          {selectedRecord && (
            <div className="glass-panel animate-fade-in" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                    {selectedRecord.title || `Audit Record #${selectedRecord.id}`}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Created: {new Date(selectedRecord.created_at).toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => handleReopenInAnalyzer(selectedRecord)}
                  className="btn btn-primary btn-sm"
                >
                  <Play size={13} />
                  <span>Reopen in Analyzer</span>
                </button>
              </div>

              {/* Complexities */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div style={{ padding: '12px 14px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Time Complexity</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-purple-light)', marginTop: '2px' }}>
                    {selectedRecord.time_complexity}
                  </div>
                </div>
                <div style={{ padding: '12px 14px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auxiliary Space</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginTop: '2px' }}>
                    {selectedRecord.space_complexity}
                  </div>
                </div>
              </div>

              {/* Detected Algorithms & Structures */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>
                  Detected Algorithms:
                </h4>
                {selectedRecord.detected_algorithms && selectedRecord.detected_algorithms.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedRecord.detected_algorithms.map((a, i) => (
                      <span key={i} className="badge badge-blue">
                        {typeof a === 'string' ? a : a.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>None recognized</span>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>
                  Detected Data Structures:
                </h4>
                {selectedRecord.detected_data_structures && selectedRecord.detected_data_structures.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedRecord.detected_data_structures.map((d, i) => (
                      <span key={i} className="badge badge-purple">
                        {typeof d === 'string' ? d : d.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>None recognized</span>
                )}
              </div>

              {/* Fingerprint */}
              <div style={{ padding: '12px 14px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Normalized SHA-256 Fingerprint</span>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', wordBreak: 'break-all', marginTop: '4px' }}>
                  {selectedRecord.fingerprint || 'Not generated'}
                </div>
              </div>

              {/* Source Code Snippet */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>
                  Source Code
                </h4>
                <pre
                  style={{
                    padding: '16px',
                    background: '#090d16',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8125rem',
                    color: '#e2e8f0',
                    maxHeight: '300px',
                    overflowY: 'auto',
                  }}
                >
                  {selectedRecord.source_code}
                </pre>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-panel empty-state">
          <History size={48} className="empty-state-icon" />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '6px' }}>
            No Analysis History Found
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 16px' }}>
            Every time you analyze a C program with the C Code Analyzer, the results and structural statistics are automatically recorded in SQLite.
          </p>
          <button
            onClick={() => navigate('/analyzer')}
            className="btn btn-primary"
          >
            <Play size={16} />
            <span>Run Your First Analysis</span>
          </button>
        </div>
      )}
    </div>
  );
}
