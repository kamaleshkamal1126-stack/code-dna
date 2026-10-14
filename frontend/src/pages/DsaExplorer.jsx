import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Layers,
  Search,
  Code2,
  Copy,
  Check,
  Play,
  ArrowRight,
  BookOpen,
  Clock,
  Database
} from 'lucide-react';
import { api } from '../services/api';

export default function DsaExplorer() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadCurriculum() {
      setLoading(true);
      try {
        const [catRes, topRes] = await Promise.all([
          api.dsa.getCategories(),
          api.dsa.getTopics(),
        ]);
        setCategories(catRes.categories || []);
        const topicList = topRes.topics || [];
        setTopics(topicList);
        if (topicList.length > 0) {
          setSelectedTopic(topicList[0]);
        }
      } catch (err) {
        console.error('Failed to load DSA curriculum', err);
      } finally {
        setLoading(false);
      }
    }
    loadCurriculum();
  }, []);

  const filteredTopics = topics.filter((t) => {
    const matchesCategory = selectedCategory === 'all' || t.category_id === selectedCategory;
    const matchesSearch = !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.definition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenInAnalyzer = (topic) => {
    sessionStorage.setItem('codedna_load_code', topic.c_code);
    sessionStorage.setItem('codedna_load_title', topic.title);
    navigate('/analyzer');
  };

  const copyCode = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-purple">Standard C Curriculum</span>
          <span className="badge badge-blue">Complete DSA Reference</span>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          DSA Explorer
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Master foundational data structures and algorithms implemented in idiomatic C. Every topic includes beginner explanations, dry runs, and instant analysis.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', maxWidth: '820px' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`btn btn-sm ${selectedCategory === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`btn btn-sm ${selectedCategory === cat.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ whiteSpace: 'nowrap' }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px', fontSize: '0.8125rem' }}
            placeholder="Search topic or algorithm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Master-Detail Split Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left Topics List */}
        <div className="glass-panel" style={{ padding: '16px', maxHeight: '780px', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>
            Topics ({filteredTopics.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredTopics.map((topic) => {
              const isSelected = selectedTopic?.id === topic.id;
              return (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(139, 92, 246, 0.16)' : 'var(--bg-surface)',
                    border: isSelected ? '1px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: isSelected ? '#ffffff' : 'var(--text-primary)' }}>
                    {topic.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{topic.time_complexity}</span>
                    <span style={{ textTransform: 'capitalize' }}>{topic.category_id}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Topic Details View */}
        {selectedTopic ? (
          <div className="glass-panel animate-fade-in" style={{ padding: '28px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '18px', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span className="badge badge-purple" style={{ marginBottom: '8px' }}>
                  {selectedTopic.category_id?.toUpperCase()}
                </span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                  {selectedTopic.title}
                </h3>
              </div>
              <button
                onClick={() => handleOpenInAnalyzer(selectedTopic)}
                className="btn btn-primary"
              >
                <Code2 size={16} />
                <span>Open in C Analyzer</span>
              </button>
            </div>

            {/* Definition & Explanation */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-purple-light)', marginBottom: '6px' }}>
                Core Definition
              </h4>
              <p style={{ fontSize: '0.9rem', color: '#f1f5f9', lineHeight: 1.6, marginBottom: '14px' }}>
                {selectedTopic.definition}
              </p>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-blue-light)', marginBottom: '6px' }}>
                Beginner-Friendly Explanation
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {selectedTopic.explanation}
              </p>
            </div>

            {/* Complexities Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ padding: '14px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Time Complexity</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                  {selectedTopic.time_complexity}
                </div>
              </div>
              <div style={{ padding: '14px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auxiliary Space Complexity</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                  {selectedTopic.space_complexity}
                </div>
              </div>
            </div>

            {/* Dry Run & IO Walkthrough */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '8px' }}>
                Step-by-Step Dry Run Walkthrough
              </h4>
              <pre
                style={{
                  padding: '14px',
                  background: '#090d16',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.8125rem',
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {selectedTopic.dry_run}
              </pre>
            </div>

            {/* Input & Output */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ padding: '12px 14px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.8125rem' }}>
                <strong style={{ color: 'var(--text-muted)' }}>Sample Input: </strong>
                <span style={{ color: '#ffffff' }}>{selectedTopic.example_input}</span>
              </div>
              <div style={{ padding: '12px 14px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.8125rem' }}>
                <strong style={{ color: 'var(--text-muted)' }}>Expected Output: </strong>
                <span style={{ color: 'var(--accent-emerald)' }}>{selectedTopic.example_output}</span>
              </div>
            </div>

            {/* Source Code Header & Viewer */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                  Complete C Source Implementation
                </h4>
                <button
                  onClick={() => copyCode(selectedTopic.c_code)}
                  className="btn btn-secondary btn-sm"
                >
                  {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy C Code'}</span>
                </button>
              </div>

              <pre
                style={{
                  padding: '18px',
                  background: '#090d16',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8125rem',
                  lineHeight: 1.6,
                  color: '#e2e8f0',
                  overflowX: 'auto',
                  maxHeight: '420px',
                }}
              >
                {selectedTopic.c_code}
              </pre>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <p>Select a topic to view its C implementation and step-by-step dry run.</p>
          </div>
        )}
      </div>
    </div>
  );
}
