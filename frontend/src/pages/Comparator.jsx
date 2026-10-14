import React, { useState } from 'react';
import {
  GitCompare,
  Play,
  RotateCcw,
  Layers,
  TrendingUp,
  Fingerprint,
  Info,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Code2
} from 'lucide-react';
import { api } from '../services/api';

const COMPARISON_PRESETS = [
  {
    name: 'Linear Search vs Binary Search',
    title: 'Linear vs Binary Search in C',
    codeA: `/* Program A: Linear Search (O(n)) */
#include <stdio.h>

int linearSearch(int arr[], int n, int key) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == key) return i;
    }
    return -1;
}

int main() {
    int arr[] = {4, 2, 7, 1, 9};
    int idx = linearSearch(arr, 5, 7);
    printf("Index: %d\\n", idx);
    return 0;
}`,
    codeB: `/* Program B: Binary Search (O(log n)) */
#include <stdio.h>

int binarySearch(int arr[], int n, int key) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (arr[mid] == key) return mid;
        else if (arr[mid] < key) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

int main() {
    int arr[] = {1, 2, 4, 7, 9};
    int idx = binarySearch(arr, 5, 7);
    printf("Index: %d\\n", idx);
    return 0;
}`,
  },
  {
    name: 'Bubble Sort vs Quick Sort',
    title: 'Quadratic vs Divide & Conquer Sorting',
    codeA: `/* Program A: Bubble Sort (O(n^2)) */
#include <stdio.h>

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

int main() {
    int arr[] = {5, 2, 8, 1, 3};
    bubbleSort(arr, 5);
    return 0;
}`,
    codeB: `/* Program B: Quick Sort (O(n log n)) */
#include <stdio.h>

void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }

int partition(int arr[], int low, int high) {
    int pivot = arr[high], i = (low - 1);
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) { i++; swap(&arr[i], &arr[j]); }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int main() {
    int arr[] = {5, 2, 8, 1, 3};
    quickSort(arr, 0, 4);
    return 0;
}`,
  },
  {
    name: 'Array Stack vs Linked-List Stack',
    title: 'Static vs Dynamic Memory Stack',
    codeA: `/* Program A: Array Stack (Fixed Capacity) */
#include <stdio.h>
#define MAX 100

int stack[MAX];
int top = -1;

void push(int x) { if (top < MAX - 1) stack[++top] = x; }
int pop() { return (top >= 0) ? stack[top--] : -1; }

int main() {
    push(10); push(20);
    printf("%d\\n", pop());
    return 0;
}`,
    codeB: `/* Program B: Linked-List Stack (Dynamic Nodes) */
#include <stdio.h>
#include <stdlib.h>

struct Node { int data; struct Node* next; };
struct Node* top = NULL;

void push(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->data = val; n->next = top; top = n;
}

int pop() {
    if (!top) return -1;
    int val = top->data;
    struct Node* temp = top;
    top = top->next;
    free(temp);
    return val;
}

int main() {
    push(10); push(20);
    printf("%d\\n", pop());
    return 0;
}`,
  }
];

export default function Comparator() {
  const [codeA, setCodeA] = useState(COMPARISON_PRESETS[0].codeA);
  const [codeB, setCodeB] = useState(COMPARISON_PRESETS[0].codeB);
  const [title, setTitle] = useState(COMPARISON_PRESETS[0].title);
  const [language, setLanguage] = useState('c');
  const [loading, setLoading] = useState(false);
  const [diffResult, setDiffResult] = useState(null);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('side-by-side'); // 'side-by-side' | 'metrics'

  const handleCompare = async () => {
    if (!codeA.trim() || !codeB.trim()) {
      setError('Please provide code in both editors to perform comparison.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await api.comparison.compare(codeA, codeB, language, title, true);
      setDiffResult(data);
    } catch (err) {
      setError(err.message || 'Comparison failed. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-purple">Dual Diff Visualizer</span>
            <span className="badge badge-blue">Myers LCS Engine</span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Code Comparator
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Compare two C program implementations side-by-side. Analyze structural differences, line-by-line diffs, similarity index, and algorithmic complexities.
          </p>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <select
            className="form-select"
            style={{ width: 'auto', background: 'var(--bg-surface-elevated)' }}
            onChange={(e) => {
              const preset = COMPARISON_PRESETS.find((p) => p.name === e.target.value);
              if (preset) {
                setCodeA(preset.codeA);
                setCodeB(preset.codeB);
                setTitle(preset.title);
                setDiffResult(null);
              }
            }}
            value=""
          >
            <option value="" disabled>Load Comparison Preset...</option>
            {COMPARISON_PRESETS.map((p) => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>

          <select
            className="form-select"
            style={{ width: 'auto', background: 'var(--bg-surface-elevated)' }}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="c">C Language (Primary)</option>
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
          </select>

          <button
            onClick={handleCompare}
            disabled={loading}
            className="btn btn-primary"
            style={{ minWidth: '150px' }}
          >
            <GitCompare size={16} />
            <span>{loading ? 'Comparing...' : 'Compare Code'}</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Code Editors */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Editor A */}
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-purple-light)' }}>
              Program A (Reference)
            </span>
            <span className="badge badge-purple">{codeA.split('\n').length} lines</span>
          </div>
          <div className="code-editor-container" style={{ minHeight: '320px' }}>
            <textarea
              className="code-editor-textarea"
              style={{ minHeight: '320px' }}
              value={codeA}
              onChange={(e) => setCodeA(e.target.value)}
              placeholder="Paste first C program here..."
              spellCheck={false}
            />
          </div>
        </div>

        {/* Editor B */}
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
              Program B (Candidate)
            </span>
            <span className="badge badge-cyan">{codeB.split('\n').length} lines</span>
          </div>
          <div className="code-editor-container" style={{ minHeight: '320px' }}>
            <textarea
              className="code-editor-textarea"
              style={{ minHeight: '320px' }}
              value={codeB}
              onChange={(e) => setCodeB(e.target.value)}
              placeholder="Paste second C program here..."
              spellCheck={false}
            />
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fda4af', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Comparison Results Card */}
      {diffResult && (
        <div className="glass-panel animate-fade-in" style={{ padding: '24px' }}>
          {/* Header Stats */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Comparison Match Score</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', background: 'linear-gradient(135deg, var(--accent-purple-light), var(--accent-cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {diffResult.similarity_percentage}%
              </div>
            </div>

            {/* Formula Explanation Note */}
            <div style={{ maxWidth: '580px', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <strong style={{ color: '#ffffff' }}>Calculation Formula: </strong>
              {diffResult.similarity_formula_explanation}
            </div>
          </div>

          {/* Line Diff Breakdown Counters */}
          <div className="stat-card-grid" style={{ marginBottom: '24px' }}>
            <div className="glass-panel stat-card">
              <span className="stat-label">Identical Lines</span>
              <div className="stat-value" style={{ color: 'var(--text-primary)' }}>
                {diffResult.line_statistics?.identical_lines || 0}
              </div>
            </div>
            <div className="glass-panel stat-card">
              <span className="stat-label">Modified Lines</span>
              <div className="stat-value" style={{ color: 'var(--accent-amber)' }}>
                {diffResult.line_statistics?.modified_lines || 0}
              </div>
            </div>
            <div className="glass-panel stat-card">
              <span className="stat-label">Added in Program B</span>
              <div className="stat-value" style={{ color: 'var(--accent-emerald)' }}>
                +{diffResult.line_statistics?.added_lines || 0}
              </div>
            </div>
            <div className="glass-panel stat-card">
              <span className="stat-label">Removed from Program A</span>
              <div className="stat-value" style={{ color: 'var(--accent-rose)' }}>
                -{diffResult.line_statistics?.removed_lines || 0}
              </div>
            </div>
          </div>

          {/* Fingerprint Match Banner */}
          {diffResult.fingerprint_comparison && (
            <div style={{ padding: '14px 18px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Fingerprint size={16} color="var(--accent-purple-light)" />
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Cryptographic Fingerprint Match:</span>
                {diffResult.fingerprint_comparison.normalized_match ? (
                  <span className="badge badge-emerald">Normalized Match</span>
                ) : (
                  <span className="badge badge-amber">Distinct Signatures</span>
                )}
              </div>
              <p style={{ fontSize: '0.78125rem', color: 'var(--text-muted)' }}>
                {diffResult.fingerprint_comparison.fingerprint_interpretation}
              </p>
            </div>
          )}

          {/* Algorithmic & Structural Comparison Table */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '28px' }}>
            {/* Program A Specs */}
            <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-purple-light)', marginBottom: '10px' }}>
                Program A Profile
              </h4>
              <div style={{ fontSize: '0.8125rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div>Algorithms: <strong>{diffResult.program_a_summary?.algorithms?.join(', ') || 'None recognized'}</strong></div>
                <div>Data Structures: <strong>{diffResult.program_a_summary?.data_structures?.join(', ') || 'None recognized'}</strong></div>
                <div>Worst Case Time: <strong style={{ color: 'var(--accent-purple-light)' }}>{diffResult.program_a_summary?.worst_case_complexity}</strong></div>
                <div>Auxiliary Space: <strong style={{ color: 'var(--accent-amber)' }}>{diffResult.program_a_summary?.space_complexity}</strong></div>
              </div>
            </div>

            {/* Program B Specs */}
            <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '10px' }}>
                Program B Profile
              </h4>
              <div style={{ fontSize: '0.8125rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div>Algorithms: <strong>{diffResult.program_b_summary?.algorithms?.join(', ') || 'None recognized'}</strong></div>
                <div>Data Structures: <strong>{diffResult.program_b_summary?.data_structures?.join(', ') || 'None recognized'}</strong></div>
                <div>Worst Case Time: <strong style={{ color: 'var(--accent-cyan)' }}>{diffResult.program_b_summary?.worst_case_complexity}</strong></div>
                <div>Auxiliary Space: <strong style={{ color: 'var(--accent-amber)' }}>{diffResult.program_b_summary?.space_complexity}</strong></div>
              </div>
            </div>
          </div>

          {/* Line-by-Line Side-by-Side Diff Table */}
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>
            Unified Line-by-Line Diff Stream
          </h4>
          <div style={{ background: '#090d16', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', maxHeight: '450px', overflowY: 'auto' }}>
            {diffResult.side_by_side_diff?.map((row, idx) => (
              <div
                key={idx}
                className={`diff-line ${
                  row.type === 'added' ? 'diff-line-added' :
                  row.type === 'removed' ? 'diff-line-removed' :
                  row.type === 'modified' ? 'diff-line-modified' : 'diff-line-equal'
                }`}
              >
                <div style={{ width: '40px', color: '#475569', textAlign: 'right', marginRight: '12px', userSelect: 'none' }}>
                  {row.line_num_a || ''}
                </div>
                <div style={{ width: '40px', color: '#475569', textAlign: 'right', marginRight: '16px', userSelect: 'none' }}>
                  {row.line_num_b || ''}
                </div>
                <div style={{ width: '20px', fontWeight: 700, color: row.type === 'added' ? '#10b981' : row.type === 'removed' ? '#f43f5e' : '#64748b' }}>
                  {row.type === 'added' ? '+' : row.type === 'removed' ? '-' : row.type === 'modified' ? '~' : ' '}
                </div>
                <div style={{ flex: 1, whiteSpace: 'pre', overflowX: 'auto' }}>
                  {row.line_b !== null && row.line_b !== undefined ? row.line_b : row.line_a}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
