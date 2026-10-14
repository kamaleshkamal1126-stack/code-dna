import React, { useState } from 'react';
import {
  Fingerprint,
  Hash,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  FileCode,
  Info,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

export default function CodeFingerprint() {
  const [snippetA, setSnippetA] = useState(
`/* Program A: Binary Search with comments */
int binarySearch(int arr[], int n, int x) {
    int l = 0, r = n - 1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == x) return m;
        if (arr[m] < x) l = m + 1;
        else r = m - 1;
    }
    return -1;
}`
  );

  const [snippetB, setSnippetB] = useState(
`int binarySearch(int arr[], int n, int x) {
    int l = 0, r = n - 1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == x) return m;
        if (arr[m] < x) l = m + 1;
        else r = m - 1;
    }
    return -1;
}`
  );

  const [hashesA, setHashesA] = useState(null);
  const [hashesB, setHashesB] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  const handleComputeFingerprints = async () => {
    setLoading(true);
    try {
      const [resA, resB] = await Promise.all([
        api.analysis.analyze(snippetA, 'c', 'Snippet A', null, false),
        api.analysis.analyze(snippetB, 'c', 'Snippet B', null, false),
      ]);
      setHashesA(resA.fingerprint);
      setHashesB(resB.fingerprint);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-purple">Cryptographic SHA-256</span>
          <span className="badge badge-cyan">Deterministic Normalizer</span>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Code Fingerprint & Identity Studio
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Compute cryptographically robust SHA-256 fingerprints. Understand the vital distinction between raw exact-source hashing and normalized-source AST canonicalization.
        </p>
      </div>

      {/* Side-by-Side Snippet Inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-purple-light)' }}>
              Source Snippet #1
            </span>
            <span className="badge badge-purple">{snippetA.length} chars</span>
          </div>
          <div className="code-editor-container" style={{ minHeight: '220px' }}>
            <textarea
              className="code-editor-textarea"
              style={{ minHeight: '220px' }}
              value={snippetA}
              onChange={(e) => setSnippetA(e.target.value)}
              placeholder="Paste code snippet 1..."
              spellCheck={false}
            />
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
              Source Snippet #2
            </span>
            <span className="badge badge-cyan">{snippetB.length} chars</span>
          </div>
          <div className="code-editor-container" style={{ minHeight: '220px' }}>
            <textarea
              className="code-editor-textarea"
              style={{ minHeight: '220px' }}
              value={snippetB}
              onChange={(e) => setSnippetB(e.target.value)}
              placeholder="Paste code snippet 2..."
              spellCheck={false}
            />
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
        <button
          onClick={handleComputeFingerprints}
          disabled={loading}
          className="btn btn-primary"
          style={{ minWidth: '240px', padding: '12px 24px' }}
        >
          <Fingerprint size={18} />
          <span>{loading ? 'Hashing...' : 'Generate SHA-256 Fingerprints'}</span>
        </button>
      </div>

      {/* Comparison Results Card */}
      {hashesA && hashesB && (
        <div className="glass-panel animate-fade-in" style={{ padding: '24px', marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '20px' }}>
            Cryptographic Fingerprint Audit
          </h3>

          {/* Equality Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {/* Exact Hash Match */}
            <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Exact-Source Fingerprint Match</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                {hashesA.exact_fingerprint === hashesB.exact_fingerprint ? (
                  <span className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} /> Identical Exact Source
                  </span>
                ) : (
                  <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <XCircle size={14} /> Distinct Exact Source
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                Requires every character, space, comment, and linebreak to match byte-for-byte.
              </p>
            </div>

            {/* Normalized Hash Match */}
            <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Normalized-Source Fingerprint Match</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                {hashesA.normalized_fingerprint === hashesB.normalized_fingerprint ? (
                  <span className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} /> Normalized Match!
                  </span>
                ) : (
                  <span className="badge badge-rose" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <XCircle size={14} /> Different Structures
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                Evaluated after removing comments and collapsing redundant whitespace.
              </p>
            </div>
          </div>

          {/* Hash Signatures Display */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Snippet 1 Hashes */}
            <div style={{ padding: '16px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-purple-light)', marginBottom: '8px' }}>
                Snippet #1 Signatures (Length: {hashesA.exact_length} raw / {hashesA.normalized_length} normalized)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#090d16', padding: '8px 12px', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)', width: '90px' }}>Exact:</span>
                  <span style={{ color: '#ffffff', overflowX: 'auto' }}>{hashesA.exact_fingerprint}</span>
                  <button onClick={() => copyToClipboard(hashesA.exact_fingerprint, 'a-exact')} className="btn btn-secondary btn-sm" style={{ padding: '2px 6px', marginLeft: '8px' }}>
                    {copiedKey === 'a-exact' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#090d16', padding: '8px 12px', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)', width: '90px' }}>Normalized:</span>
                  <span style={{ color: 'var(--accent-cyan)', overflowX: 'auto' }}>{hashesA.normalized_fingerprint}</span>
                  <button onClick={() => copyToClipboard(hashesA.normalized_fingerprint, 'a-norm')} className="btn btn-secondary btn-sm" style={{ padding: '2px 6px', marginLeft: '8px' }}>
                    {copiedKey === 'a-norm' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Snippet 2 Hashes */}
            <div style={{ padding: '16px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '8px' }}>
                Snippet #2 Signatures (Length: {hashesB.exact_length} raw / {hashesB.normalized_length} normalized)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#090d16', padding: '8px 12px', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)', width: '90px' }}>Exact:</span>
                  <span style={{ color: '#ffffff', overflowX: 'auto' }}>{hashesB.exact_fingerprint}</span>
                  <button onClick={() => copyToClipboard(hashesB.exact_fingerprint, 'b-exact')} className="btn btn-secondary btn-sm" style={{ padding: '2px 6px', marginLeft: '8px' }}>
                    {copiedKey === 'b-exact' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#090d16', padding: '8px 12px', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)', width: '90px' }}>Normalized:</span>
                  <span style={{ color: 'var(--accent-cyan)', overflowX: 'auto' }}>{hashesB.normalized_fingerprint}</span>
                  <button onClick={() => copyToClipboard(hashesB.normalized_fingerprint, 'b-norm')} className="btn btn-secondary btn-sm" style={{ padding: '2px 6px', marginLeft: '8px' }}>
                    {copiedKey === 'b-norm' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Educational Documentation Card */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Info size={18} color="var(--accent-blue-light)" />
          <span>Deterministic Code Normalization Rules</span>
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
          To generate stable normalized fingerprints, CODE DNA 3.0 applies the following deterministic transformations:
        </p>
        <ol style={{ paddingLeft: '24px', fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <li><strong>Block Comment Stripping: </strong>Removes all C block comments (<code>/* ... */</code>).</li>
          <li><strong>Line Comment Stripping: </strong>Removes all C line comments (<code>// ...</code>).</li>
          <li><strong>Whitespace Canonicalization: </strong>Collapses sequences of spaces, tabs, and linebreaks into a single space.</li>
          <li><strong>Edge Trimming: </strong>Strips leading and trailing whitespace before computing the standard 256-bit SHA-256 digest.</li>
        </ol>
      </div>
    </div>
  );
}
