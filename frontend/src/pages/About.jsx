import React, { useState, useEffect } from 'react';
import {
  Info,
  Cpu,
  ShieldCheck,
  Database,
  Layers,
  Code2,
  Terminal,
  Activity,
  CheckCircle2,
  GitBranch
} from 'lucide-react';
import { api } from '../services/api';

export default function About() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    async function loadHealth() {
      try {
        const res = await api.health.check();
        setHealth(res);
      } catch (err) {
        console.error(err);
      }
    }
    loadHealth();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <div
        className="glass-panel"
        style={{
          padding: '36px',
          marginBottom: '28px',
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(22, 32, 50, 0.85))',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span className="badge badge-purple">Version 3.0.0</span>
          <span className="badge badge-cyan">Full-Stack DSA Suite</span>
        </div>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
          CODE DNA <span style={{ color: 'var(--accent-purple-light)' }}>3.0</span>
        </h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--accent-cyan)', fontStyle: 'italic', marginBottom: '16px' }}>
          "Understand the Structure. Analyze the Complexity. Discover the Code."
        </p>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '820px' }}>
          CODE DNA 3.0 is a developer-grade educational platform purpose-built for Computer Science & Engineering students.
          It performs static AST tokenization, structural DSA pattern detection, and conservative Big-O complexity estimation on C programs without requiring program execution.
        </p>
      </div>

      {/* Live System Diagnostics */}
      {health && (
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Activity size={20} color="var(--accent-emerald)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Live System Diagnostics</h3>
            <span className="badge badge-emerald" style={{ marginLeft: 'auto' }}>
              System Healthy
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '14px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>C Analysis Engine</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '4px' }}>
                {health.c_analysis_engine?.status}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px', wordBreak: 'break-all' }}>
                {health.c_analysis_engine?.binary_path}
              </div>
            </div>

            <div style={{ padding: '14px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Central Database</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-emerald)', marginTop: '4px' }}>
                {health.database?.connected ? 'Connected & Indexed' : 'Disconnected'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {health.database?.total_saved_projects} Projects • {health.database?.total_analyses_performed} Audits
              </div>
            </div>

            <div style={{ padding: '14px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Backend Environment</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-purple-light)', marginTop: '4px' }}>
                Python {health.environment?.python_version}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Platform: {health.environment?.platform}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4-Layer Architecture Breakdown */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px' }}>
          Architecture & Technology Stack
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div style={{ padding: '20px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Cpu size={20} color="var(--accent-purple-light)" />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>Native C Analysis Engine</h4>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Compiled GCC executable (<code>code_dna_analyzer.exe</code>). Implements deterministic lexing, bracket balancing, recursion tree branching factor evaluation, and pattern detection for trees, graphs, heaps, and lists.
            </p>
          </div>

          <div style={{ padding: '20px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Server size={20} color="var(--accent-blue-light)" />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>Python Flask REST API</h4>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Flask backend with Flask-SQLAlchemy, Flask-CORS, and PyJWT. Provides secure sandboxed process invocation with a 5-second timeout, input size capping (2MB), and cryptographic SHA-256 fingerprinting.
            </p>
          </div>

          <div style={{ padding: '20px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Code2 size={20} color="var(--accent-cyan)" />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>React + Vite Frontend</h4>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Custom dark-navy theme built with Vanilla CSS tokens. Features responsive code editors with line numbers, side-by-side diff viewers, and interactive SVG asymptotic growth curves.
            </p>
          </div>

          <div style={{ padding: '20px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Database size={20} color="var(--accent-emerald)" />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>Persistent Storage</h4>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Relational SQLAlchemy schemas for Users, Projects, AnalysisHistory, and CodeComparisons. Default local persistent SQLite, cleanly swappable to MySQL or PostgreSQL via <code>DATABASE_URL</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Security Principles */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <ShieldCheck size={20} color="var(--accent-emerald)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Security Invariants</h3>
        </div>
        <ul style={{ paddingLeft: '22px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <li><strong>Zero Arbitrary Execution: </strong>Submitted C programs are NEVER compiled or executed on the web server. Static analysis inspects syntax tokens safely via stdin.</li>
          <li><strong>Timeout Sandboxing: </strong>Process invocation is enforced with strict subprocess timeouts to prevent denial of service.</li>
          <li><strong>Input Size Limits: </strong>Payloads are capped at 2MB to guard server memory.</li>
          <li><strong>Secure Password Hashing: </strong>All credentials are hashed using PBKDF2/scrypt with salt via Werkzeug security.</li>
        </ul>
      </div>
    </div>
  );
}

function Server(props) {
  return <Terminal {...props} />;
}
