import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Upload,
  Download,
  Bookmark,
  Layers,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  Code2,
  FileText,
  Copy,
  Check,
  ChevronDown
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SAMPLE_PROGRAMS = [
  {
    name: 'Binary Search Tree (BST)',
    category: 'Trees',
    code: `/* CODE DNA 3.0: Binary Search Tree Implementation */
#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *left;
    struct Node *right;
};

struct Node* insertBST(struct Node* root, int val) {
    if (root == NULL) {
        struct Node* n = (struct Node*)malloc(sizeof(struct Node));
        n->data = val;
        n->left = n->right = NULL;
        return n;
    }
    if (val < root->data) {
        root->left = insertBST(root->left, val);
    } else if (val > root->data) {
        root->right = insertBST(root->right, val);
    }
    return root;
}

void inorder(struct Node* root) {
    if (root != NULL) {
        inorder(root->left);
        printf("%d ", root->data);
        inorder(root->right);
    }
}

int main() {
    struct Node* root = NULL;
    root = insertBST(root, 50);
    insertBST(root, 30);
    insertBST(root, 70);
    insertBST(root, 20);
    inorder(root);
    return 0;
}`,
  },
  {
    name: 'Quick Sort (Divide & Conquer)',
    category: 'Sorting',
    code: `/* CODE DNA 3.0: QuickSort with Lomuto Partition */
#include <stdio.h>

void swap(int *a, int *b) {
    int t = *a; *a = *b; *b = t;
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
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
    int arr[] = {64, 25, 12, 22, 11};
    int n = sizeof(arr)/sizeof(arr[0]);
    quickSort(arr, 0, n - 1);
    for(int i = 0; i < n; i++) printf("%d ", arr[i]);
    return 0;
}`,
  },
  {
    name: 'Binary Search (Logarithmic)',
    category: 'Searching',
    code: `/* CODE DNA 3.0: Binary Search */
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
    int arr[] = {2, 4, 8, 16, 32, 64, 128};
    int n = sizeof(arr)/sizeof(arr[0]);
    int pos = binarySearch(arr, n, 32);
    printf("Found at: %d\\n", pos);
    return 0;
}`,
  },
  {
    name: 'Bubble Sort (Quadratic)',
    category: 'Sorting',
    code: `/* CODE DNA 3.0: Bubble Sort */
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
    int arr[] = {5, 1, 4, 2, 8};
    bubbleSort(arr, 5);
    return 0;
}`,
  },
  {
    name: 'Stack LIFO Implementation',
    category: 'Stacks',
    code: `/* CODE DNA 3.0: Array Stack */
#include <stdio.h>
#define MAX 10

int stack[MAX];
int top = -1;

void push(int x) {
    if (top == MAX - 1) return;
    stack[++top] = x;
}

int pop() {
    if (top == -1) return -1;
    return stack[top--];
}

int peek() {
    return (top >= 0) ? stack[top] : -1;
}

int main() {
    push(42);
    push(99);
    printf("%d\\n", pop());
    return 0;
}`,
  },
  {
    name: 'Circular Queue (Modulo Buffering)',
    category: 'Queues',
    code: `/* CODE DNA 3.0: Circular Queue */
#include <stdio.h>
#define MAX 5

int q[MAX];
int front = -1, rear = -1;

void enqueue(int val) {
    if ((rear + 1) % MAX == front) return;
    if (front == -1) front = 0;
    rear = (rear + 1) % MAX;
    q[rear] = val;
}

int dequeue() {
    if (front == -1) return -1;
    int val = q[front];
    if (front == rear) { front = rear = -1; }
    else { front = (front + 1) % MAX; }
    return val;
}

int main() {
    enqueue(10);
    enqueue(20);
    dequeue();
    return 0;
}`,
  },
  {
    name: 'Dijkstra Shortest Path',
    category: 'Graphs',
    code: `/* CODE DNA 3.0: Dijkstra Graph Shortest Path */
#include <stdio.h>
#include <stdbool.h>
#define V 4
#define INF 99999

int minDistance(int dist[], bool visited[]) {
    int min = INF, min_idx = -1;
    for (int v = 0; v < V; v++) {
        if (!visited[v] && dist[v] <= min) {
            min = dist[v]; min_idx = v;
        }
    }
    return min_idx;
}

void dijkstra(int graph[V][V], int src) {
    int dist[V];
    bool visited[V];
    for (int i = 0; i < V; i++) { dist[i] = INF; visited[i] = false; }
    dist[src] = 0;

    for (int count = 0; count < V - 1; count++) {
        int u = minDistance(dist, visited);
        visited[u] = true;
        for (int v = 0; v < V; v++) {
            if (!visited[v] && graph[u][v] && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
            }
        }
    }
}

int main() {
    int graph[V][V] = { {0, 5, INF, 10}, {INF, 0, 3, INF}, {INF, INF, 0, 1}, {INF, INF, INF, 0} };
    dijkstra(graph, 0);
    return 0;
}`,
  },
  {
    name: 'Recursive Fibonacci (Exponential Tree)',
    category: 'Recursion',
    code: `/* CODE DNA 3.0: Fibonacci Dual Recursive Tree */
#include <stdio.h>

int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}

int main() {
    int res = fib(6);
    printf("Result: %d\\n", res);
    return 0;
}`,
  }
];

export default function Analyzer() {
  const { user } = useAuth();
  
  const [code, setCode] = useState(SAMPLE_PROGRAMS[0].code);
  const [language, setLanguage] = useState('c');
  const [title, setTitle] = useState('BST Implementation');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'structures' | 'algorithms' | 'complexity' | 'structural-checks'

  // Save Project Modal state
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [saveDesc, setSaveDesc] = useState('');
  const [saveCategory, setSaveCategory] = useState('General DSA');
  const [saveTags, setSaveTags] = useState('');
  const [saveStatus, setSaveStatus] = useState(null);

  // Check if code was queued from another page (e.g. DSA Explorer or Saved Projects)
  useEffect(() => {
    const queuedCode = sessionStorage.getItem('codedna_load_code');
    const queuedTitle = sessionStorage.getItem('codedna_load_title');
    if (queuedCode) {
      setCode(queuedCode);
      if (queuedTitle) setTitle(queuedTitle);
      sessionStorage.removeItem('codedna_load_code');
      sessionStorage.removeItem('codedna_load_title');
    }
  }, []);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Please provide or paste source code before running analysis.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const data = await api.analysis.analyze(code, language, title, null, true);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Analysis failed. Please verify connection to the backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCode(event.target.result);
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    };
    reader.readAsText(file);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      await api.projects.create({
        title: saveTitle || title || 'Untitled Project',
        description: saveDesc,
        language,
        source_code: code,
        category: saveCategory,
        tags: saveTags.split(',').map((t) => t.trim()).filter(Boolean),
      });
      setSaveStatus('Project saved successfully to database!');
      setTimeout(() => {
        setIsSaveModalOpen(false);
        setSaveStatus(null);
      }, 1500);
    } catch (err) {
      setSaveStatus(`Error saving: ${err.message}`);
    }
  };

  const handleDownloadReport = () => {
    if (!result) return;
    const reportStr = JSON.stringify(result, null, 2);
    const blob = new Blob([reportStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codedna_report_${(title || 'analysis').toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-purple">Core Analysis Engine</span>
            <span className="badge badge-cyan">Static AST Inspection</span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            C Code Analyzer
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Parse C programs with the native C analyzer engine. Discover data structures, algorithm patterns, and theoretical Big-O complexity.
          </p>
        </div>

        {/* Toolbar Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Preset Selector */}
          <div style={{ position: 'relative' }}>
            <select
              className="form-select"
              style={{ width: 'auto', paddingRight: '28px', background: 'var(--bg-surface-elevated)' }}
              onChange={(e) => {
                const sample = SAMPLE_PROGRAMS.find((s) => s.name === e.target.value);
                if (sample) {
                  setCode(sample.code);
                  setTitle(sample.name);
                  setResult(null);
                }
              }}
              value=""
            >
              <option value="" disabled>Load Sample C Program...</option>
              {SAMPLE_PROGRAMS.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          {/* File Upload (.c) */}
          <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
            <Upload size={14} />
            <span>Upload .c</span>
            <input
              type="file"
              accept=".c,.cpp,.h,.txt"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </label>

          {/* Clear */}
          <button
            onClick={() => { setCode(''); setResult(null); }}
            className="btn btn-secondary btn-sm"
            title="Clear Editor"
          >
            <RotateCcw size={14} />
            <span>Clear</span>
          </button>

          {/* Analyze CTA */}
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="btn btn-primary"
            style={{ minWidth: '150px' }}
          >
            <Play size={16} fill="currentColor" />
            <span>{loading ? 'Analyzing...' : 'Analyze Code'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Metadata Input */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="text"
              className="form-input"
              style={{ width: '260px', padding: '6px 12px', fontSize: '0.8125rem' }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Program Title..."
            />
            <select
              className="form-select"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8125rem' }}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="c">C Language (Primary Native Engine)</option>
              <option value="cpp">C++ (Secondary)</option>
              <option value="python">Python (Secondary)</option>
              <option value="java">Java (Secondary)</option>
              <option value="javascript">JavaScript (Secondary)</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => {
                navigator.clipboard.writeText(code);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="btn btn-secondary btn-sm"
            >
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
            <button
              onClick={() => {
                setSaveTitle(title);
                setIsSaveModalOpen(true);
              }}
              className="btn btn-secondary btn-sm"
            >
              <Bookmark size={14} />
              <span>Save Project</span>
            </button>
          </div>
        </div>

        {/* Monospace Code Editor */}
        <div className="code-editor-container">
          <div className="code-editor-gutter">
            {lineNumbers.map((num) => (
              <div key={num}>{num}</div>
            ))}
          </div>
          <textarea
            className="code-editor-textarea"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your C source code here..."
            spellCheck={false}
          />
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fda4af',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <AlertTriangle size={20} />
          <div>
            <div style={{ fontWeight: 600 }}>Analysis Error</div>
            <div style={{ fontSize: '0.8125rem' }}>{error}</div>
          </div>
        </div>
      )}

      {/* Analysis Results Display */}
      {result && (
        <div className="glass-panel animate-fade-in" style={{ padding: '24px' }}>
          {/* Header & Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-emerald)',
                }}
              >
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Analysis Report</h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Engine: <span style={{ color: 'var(--accent-cyan)' }}>{result.execution_mode || result.engine}</span>
                  {result.history_id && ` • Audit Record #${result.history_id}`}
                </div>
              </div>
            </div>

            <button
              onClick={handleDownloadReport}
              className="btn btn-secondary btn-sm"
            >
              <Download size={14} />
              <span>Download JSON Report</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '24px', overflowX: 'auto' }}>
            {[
              { id: 'overview', label: 'Overview & Stats' },
              { id: 'structures', label: `Data Structures (${result.data_structures?.length || 0})` },
              { id: 'algorithms', label: `Algorithms (${result.algorithms?.length || 0})` },
              { id: 'complexity', label: 'Complexity Analysis' },
              { id: 'structural-checks', label: 'Structural Checks' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ whiteSpace: 'nowrap' }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Overview & Stats */}
          {activeTab === 'overview' && (
            <div>
              <div className="stat-card-grid">
                <div className="glass-panel stat-card">
                  <span className="stat-label">Total Lines</span>
                  <div className="stat-value">{result.statistics?.total_lines || 0}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Non-empty: {result.statistics?.non_empty_lines || 0}
                  </span>
                </div>
                <div className="glass-panel stat-card">
                  <span className="stat-label">Functions Detected</span>
                  <div className="stat-value">{result.statistics?.function_count || 0}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Recursive: {result.statistics?.recursive_patterns_count || 0}
                  </span>
                </div>
                <div className="glass-panel stat-card">
                  <span className="stat-label">Loop Statements</span>
                  <div className="stat-value">{result.statistics?.loop_count || 0}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Max Nesting Depth: {result.statistics?.max_loop_nesting || 0}
                  </span>
                </div>
                <div className="glass-panel stat-card">
                  <span className="stat-label">Conditionals</span>
                  <div className="stat-value">{result.statistics?.conditional_count || 0}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    if/else & switch blocks
                  </span>
                </div>
              </div>

              {/* Detected Functions Table */}
              {result.functions && result.functions.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '12px' }}>
                    Function Signatures
                  </h4>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                      <thead>
                        <tr style={{ background: 'var(--bg-surface-elevated)', textAlign: 'left' }}>
                          <th style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)' }}>Function</th>
                          <th style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)' }}>Return Type</th>
                          <th style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)' }}>Lines</th>
                          <th style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)' }}>Recursion</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.functions.map((fn, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                              {fn.name}()
                            </td>
                            <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>
                              {fn.return_type}
                            </td>
                            <td style={{ padding: '10px 14px' }}>
                              L{fn.start_line} - L{fn.end_line || fn.start_line}
                            </td>
                            <td style={{ padding: '10px 14px' }}>
                              {fn.is_recursive ? (
                                <span className="badge badge-rose">Recursive ({fn.recursive_calls_count} self-calls)</span>
                              ) : (
                                <span className="badge badge-emerald">Iterative</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Data Structures */}
          {activeTab === 'structures' && (
            <div>
              {result.data_structures && result.data_structures.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {result.data_structures.map((ds, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '16px 20px',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                            {ds.name}
                          </span>
                          <span className="badge badge-purple">{ds.category}</span>
                        </div>
                        <span className={`badge ${ds.confidence === 'High' ? 'badge-emerald' : 'badge-amber'}`}>
                          {ds.confidence} Confidence
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '8px' }}>
                        {ds.explanation}
                      </p>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        Heuristic Indicators: {ds.indicators}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No complex data structures detected in this snippet.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Algorithms */}
          {activeTab === 'algorithms' && (
            <div>
              {result.algorithms && result.algorithms.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {result.algorithms.map((algo, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '18px 20px',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                            {algo.name}
                          </span>
                          <span className="badge badge-blue">{algo.category}</span>
                        </div>
                        <span className="badge badge-emerald">{algo.confidence} Confidence</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                        {algo.explanation}
                      </p>

                      {/* Complexity Pills */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                        <div style={{ padding: '6px 12px', background: 'var(--bg-surface-elevated)', borderRadius: '6px', fontSize: '0.75rem' }}>
                          Best Case: <strong style={{ color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>{algo.best_case}</strong>
                        </div>
                        <div style={{ padding: '6px 12px', background: 'var(--bg-surface-elevated)', borderRadius: '6px', fontSize: '0.75rem' }}>
                          Average Case: <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{algo.average_case}</strong>
                        </div>
                        <div style={{ padding: '6px 12px', background: 'var(--bg-surface-elevated)', borderRadius: '6px', fontSize: '0.75rem' }}>
                          Worst Case: <strong style={{ color: 'var(--accent-purple-light)', fontFamily: 'var(--font-mono)' }}>{algo.worst_case}</strong>
                        </div>
                        <div style={{ padding: '6px 12px', background: 'var(--bg-surface-elevated)', borderRadius: '6px', fontSize: '0.75rem' }}>
                          Auxiliary Space: <strong style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>{algo.space_complexity}</strong>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        Indicators: {algo.indicators}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No standard sorting, searching, or graph algorithm patterns recognized.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Complexity Analysis */}
          {activeTab === 'complexity' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--accent-emerald)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Best-Case Time</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)', marginTop: '4px' }}>
                    {result.complexity?.best_case || 'N/A'}
                  </div>
                </div>
                <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--accent-cyan)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Average-Case Time</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginTop: '4px' }}>
                    {result.complexity?.average_case || 'N/A'}
                  </div>
                </div>
                <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--accent-purple)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Worst-Case Time</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-purple-light)', marginTop: '4px' }}>
                    {result.complexity?.worst_case || 'N/A'}
                  </div>
                </div>
                <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--accent-amber)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auxiliary Space</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)', marginTop: '4px' }}>
                    {result.complexity?.space_complexity || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Reasoning Card */}
              <div style={{ padding: '18px 20px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: '#ffffff' }}>
                  Analytical Derivation
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {result.complexity?.reasoning}
                </p>
                <div style={{ marginTop: '10px', fontSize: '0.75rem', color: 'var(--accent-purple-light)' }}>
                  Confidence Rating: <strong>{result.complexity?.confidence}</strong>
                </div>
              </div>

              {/* Conservative Static Analysis Caveat Banner */}
              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(59, 130, 246, 0.08)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  fontSize: '0.8125rem',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                }}
              >
                <Info size={16} color="var(--accent-blue-light)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#ffffff' }}>Static Analysis Notice: </strong>
                  {result.complexity?.caveats || 'Estimates are derived via static syntax structure recognition and do not represent physical hardware benchmarks.'}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Structural Checks */}
          {activeTab === 'structural-checks' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Parentheses '()'</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    {result.statistics?.paren_balanced ? (
                      <span className="badge badge-emerald">Balanced</span>
                    ) : (
                      <span className="badge badge-rose">Unbalanced</span>
                    )}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {result.statistics?.open_paren_count} open / {result.statistics?.close_paren_count} close
                    </span>
                  </div>
                </div>

                <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Curly Braces '{}'</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    {result.statistics?.brace_balanced ? (
                      <span className="badge badge-emerald">Balanced</span>
                    ) : (
                      <span className="badge badge-rose">Unbalanced</span>
                    )}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {result.statistics?.open_brace_count} open / {result.statistics?.close_brace_count} close
                    </span>
                  </div>
                </div>

                <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Square Brackets '[]'</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    {result.statistics?.bracket_balanced ? (
                      <span className="badge badge-emerald">Balanced</span>
                    ) : (
                      <span className="badge badge-rose">Unbalanced</span>
                    )}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {result.statistics?.open_bracket_count} open / {result.statistics?.close_bracket_count} close
                    </span>
                  </div>
                </div>
              </div>

              {/* Suspicious Issues */}
              {result.statistics?.suspicious_issues && result.statistics.suspicious_issues.length > 0 ? (
                <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent-amber)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={16} />
                    <span>Structural Notices ({result.statistics.suspicious_issues.length})</span>
                  </h4>
                  <ul style={{ paddingLeft: '20px', fontSize: '0.8125rem', color: '#fcd34d' }}>
                    {result.statistics.suspicious_issues.map((issue, idx) => (
                      <li key={idx} style={{ marginBottom: '4px' }}>{issue}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#6ee7b7', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} />
                  <span>No syntax or structural bracket anomalies detected.</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Save Project Modal */}
      {isSaveModalOpen && (
        <div className="modal-overlay" onClick={() => setIsSaveModalOpen(false)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>
              Save Program to Projects
            </h3>
            {saveStatus && (
              <div style={{ padding: '10px 14px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', fontSize: '0.8125rem', marginBottom: '14px' }}>
                {saveStatus}
              </div>
            )}
            <form onSubmit={handleSaveProject} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  DSA Category
                </label>
                <select
                  className="form-select"
                  value={saveCategory}
                  onChange={(e) => setSaveCategory(e.target.value)}
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
                  rows={2}
                  value={saveDesc}
                  onChange={(e) => setSaveDesc(e.target.value)}
                  placeholder="Notes about implementation..."
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={saveTags}
                  onChange={(e) => setSaveTags(e.target.value)}
                  placeholder="e.g. bst, tree, recursion, exam-prep"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsSaveModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
