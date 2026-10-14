import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code2,
  GitCompare,
  Compass,
  History,
  FolderCode,
  TrendingUp,
  Cpu,
  ArrowRight,
  Database,
  BarChart3,
  Layers,
  FileCode,
  Calendar,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalAnalyses: 0,
    recentHistory: [],
    recentProjects: [],
    detectedStructuresCount: {},
    detectedAlgorithmsCount: {},
  });

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [projRes, histRes] = await Promise.all([
          api.projects.list(),
          api.analysis.getHistory(),
        ]);

        const projects = projRes.projects || [];
        const history = histRes.history || [];

        // Calculate frequency of detected data structures and algorithms from real records
        const dsMap = {};
        const algoMap = {};

        history.forEach((record) => {
          (record.detected_data_structures || []).forEach((ds) => {
            const name = typeof ds === 'string' ? ds : ds.name;
            if (name) dsMap[name] = (dsMap[name] || 0) + 1;
          });
          (record.detected_algorithms || []).forEach((algo) => {
            const name = typeof algo === 'string' ? algo : algo.name;
            if (name) algoMap[name] = (algoMap[name] || 0) + 1;
          });
        });

        setStats({
          totalProjects: projects.length,
          totalAnalyses: history.length,
          recentProjects: projects.slice(0, 5),
          recentHistory: history.slice(0, 5),
          detectedStructuresCount: dsMap,
          detectedAlgorithmsCount: algoMap,
        });
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [user]);

  const topStructures = Object.entries(stats.detectedStructuresCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topAlgorithms = Object.entries(stats.detectedAlgorithmsCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="animate-fade-in">
      {/* Hero Welcome Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '32px',
          marginBottom: '28px',
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(22, 32, 50, 0.8))',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <span className="badge badge-purple">DSA Static Analysis Suite</span>
            <span className="badge badge-blue">GCC v16 Compatible</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '10px' }}>
            Welcome to CODE DNA <span style={{ color: 'var(--accent-purple-light)' }}>3.0</span>
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
            High-performance C programming and Data Structures analysis platform.
            Inspect syntax fingerprints, audit algorithmic complexity classes, and explore standard C implementations with zero runtime execution risk.
          </p>

          {/* Quick Access Actions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <button
              onClick={() => navigate('/analyzer')}
              className="btn btn-primary"
            >
              <Code2 size={18} />
              <span>Launch C Code Analyzer</span>
            </button>
            <button
              onClick={() => navigate('/comparator')}
              className="btn btn-secondary"
            >
              <GitCompare size={18} />
              <span>Open Code Comparator</span>
            </button>
            <button
              onClick={() => navigate('/dsa-explorer')}
              className="btn btn-secondary"
            >
              <Compass size={18} />
              <span>Browse DSA Explorer</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow decoration */}
        <div
          style={{
            position: 'absolute',
            right: '-60px',
            bottom: '-60px',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Database Statistics Cards */}
      <div className="stat-card-grid">
        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Saved C Projects</span>
            <FolderCode size={20} color="var(--accent-purple-light)" />
          </div>
          <div className="stat-value">{stats.totalProjects}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Persisted in SQLite database
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Analyses Performed</span>
            <History size={20} color="var(--accent-blue-light)" />
          </div>
          <div className="stat-value">{stats.totalAnalyses}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Real static analysis audits
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Unique Structures Found</span>
            <Layers size={20} color="var(--accent-cyan)" />
          </div>
          <div className="stat-value">{Object.keys(stats.detectedStructuresCount).length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Trees, Stacks, Lists, Heaps
          </div>
        </div>

        <div className="glass-panel stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="stat-label">Unique Algorithms Found</span>
            <TrendingUp size={20} color="var(--accent-emerald)" />
          </div>
          <div className="stat-value">{Object.keys(stats.detectedAlgorithmsCount).length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Sorts, Searches, Traversals, DP
          </div>
        </div>
      </div>

      {/* Detected Structures & Algorithms Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* Most Frequently Detected Data Structures */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="var(--accent-purple-light)" />
              <span>Most Frequently Detected Data Structures</span>
            </h3>
            <span className="badge badge-purple">{topStructures.length} types</span>
          </div>

          {topStructures.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {topStructures.map(([name, count]) => {
                const percentage = Math.min(100, Math.round((count / (stats.totalAnalyses || 1)) * 100));
                return (
                  <div key={name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 500, color: '#f1f5f9' }}>{name}</span>
                      <span style={{ color: 'var(--accent-purple-light)', fontFamily: 'var(--font-mono)' }}>
                        {count} {count === 1 ? 'detection' : 'detections'} ({percentage}%)
                      </span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${percentage}%`,
                          background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-cyan))',
                          borderRadius: '3px',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '28px 12px' }}>
              <Database size={32} className="empty-state-icon" />
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                No structures detected yet.
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Analyze your first C program to populate detection statistics.
              </p>
            </div>
          )}
        </div>

        {/* Most Frequently Detected Algorithms */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={18} color="var(--accent-blue-light)" />
              <span>Most Frequently Detected Algorithms</span>
            </h3>
            <span className="badge badge-blue">{topAlgorithms.length} types</span>
          </div>

          {topAlgorithms.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {topAlgorithms.map(([name, count]) => {
                const percentage = Math.min(100, Math.round((count / (stats.totalAnalyses || 1)) * 100));
                return (
                  <div key={name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 500, color: '#f1f5f9' }}>{name}</span>
                      <span style={{ color: 'var(--accent-blue-light)', fontFamily: 'var(--font-mono)' }}>
                        {count} {count === 1 ? 'detection' : 'detections'} ({percentage}%)
                      </span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${percentage}%`,
                          background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-emerald))',
                          borderRadius: '3px',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '28px 12px' }}>
              <TrendingUp size={32} className="empty-state-icon" />
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                No algorithms detected yet.
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Run an analysis on Binary Search or Bubble Sort to begin tracking patterns.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent History & Recent Projects Dual Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Recent Analysis History */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={18} color="var(--accent-cyan)" />
              <span>Recent Analysis Audits</span>
            </h3>
            <button
              onClick={() => navigate('/history')}
              className="btn btn-secondary btn-sm"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {stats.recentHistory.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {stats.recentHistory.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>
                      {item.title || 'C Program Analysis'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '8px', marginTop: '2px' }}>
                      <span>Worst: <strong style={{ color: 'var(--accent-purple-light)' }}>{item.time_complexity}</strong></span>
                      <span>•</span>
                      <span>Space: <strong style={{ color: 'var(--accent-cyan)' }}>{item.space_complexity}</strong></span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/history')}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                  >
                    Inspect
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '28px 12px' }}>
              <History size={32} className="empty-state-icon" />
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                No analysis history found in database.
              </p>
              <button
                onClick={() => navigate('/analyzer')}
                className="btn btn-primary btn-sm"
                style={{ marginTop: '12px' }}
              >
                Perform First Analysis
              </button>
            </div>
          )}
        </div>

        {/* Recently Saved C Programs */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FolderCode size={18} color="var(--accent-emerald)" />
              <span>Recently Saved C Programs</span>
            </h3>
            <button
              onClick={() => navigate('/projects')}
              className="btn btn-secondary btn-sm"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {stats.recentProjects.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {stats.recentProjects.map((p) => (
                <div
                  key={p.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ffffff' }}>
                      {p.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Category: {p.category}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      sessionStorage.setItem('codedna_load_code', p.source_code);
                      sessionStorage.setItem('codedna_load_title', p.title);
                      navigate('/analyzer');
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                  >
                    Open in Analyzer
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '28px 12px' }}>
              <FileCode size={32} className="empty-state-icon" />
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                No saved projects in database yet.
              </p>
              <button
                onClick={() => navigate('/analyzer')}
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '12px' }}
              >
                Create New Project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
