import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Cpu,
  Layers,
  Code2,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Terminal,
  TrendingUp
} from 'lucide-react';

const MODULES = [
  {
    id: 'pointers',
    title: 'Pointers & Memory Architecture in C',
    icon: Cpu,
    summary: 'The foundation of all dynamic data structures: addressing, dereferencing, and the C memory layout.',
    content: (
      <div>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-purple-light)', marginBottom: '8px' }}>
          Memory Segmentation: Stack vs. Heap
        </h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
          When a C program runs, its virtual memory is split into distinct segments:
        </p>
        <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
          <li><strong>Stack: </strong>Stores local variables and function activation frames. Allocation and deallocation are automatic (LIFO). Fast, but limited in size.</li>
          <li><strong>Heap: </strong>Dynamic memory pool controlled by the programmer via <code>malloc()</code> and <code>free()</code>. Persists until explicitly freed.</li>
          <li><strong>Data Segment: </strong>Stores global and static variables initialized before runtime.</li>
          <li><strong>Text / Code: </strong>Contains read-only machine instructions compiled from your C code.</li>
        </ul>

        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '8px' }}>
          Double Pointers (<code>struct Node** head</code>) Pattern
        </h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
          In linked lists, why do we pass <code>&head</code> to functions like <code>insertHead(struct Node** head, int val)</code>?
          Because C is strictly pass-by-value. Passing <code>struct Node* head</code> only passes a copy of the pointer. Modifying the copy inside the function does not change the actual caller's head. Passing a pointer to the pointer allows direct mutation of the caller's head variable.
        </p>

        <pre style={{ padding: '14px', background: '#090d16', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#e2e8f0' }}>
{`// Correct Double Pointer Mutator Pattern:
void insertAtBeginning(struct Node** headRef, int new_data) {
    struct Node* new_node = (struct Node*)malloc(sizeof(struct Node));
    new_node->data = new_data;
    new_node->next = *headRef; // Link to old head
    *headRef = new_node;       // Mutate caller's head pointer directly
}`}
        </pre>
      </div>
    ),
  },
  {
    id: 'dynamic-memory',
    title: 'Dynamic Memory Allocation & Leak Prevention',
    icon: Layers,
    summary: 'Mastering malloc, calloc, realloc, and free without segmentation faults.',
    content: (
      <div>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: '8px' }}>
          The Four Standard Memory Allocation Functions
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <strong style={{ color: 'var(--accent-purple-light)', fontFamily: 'var(--font-mono)' }}>malloc(size_t size)</strong>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Allocates uninitialized bytes. Contains indeterminate junk values until written.
            </p>
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>calloc(num, size)</strong>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Allocates contiguous memory and automatically zeroes out all bits to 0.
            </p>
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <strong style={{ color: 'var(--accent-blue-light)', fontFamily: 'var(--font-mono)' }}>realloc(ptr, new_size)</strong>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Resizes previously allocated memory block while preserving existing contents.
            </p>
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <strong style={{ color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)' }}>free(ptr)</strong>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Releases memory back to OS heap. Avoid double free and dangling pointers.
            </p>
          </div>
        </div>

        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '8px' }}>
          The Golden Rules of Memory Safety
        </h4>
        <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          <li>Always verify <code>if (ptr == NULL)</code> after allocation to handle out-of-memory errors gracefully.</li>
          <li>For every <code>malloc()</code> call, ensure an unambiguous corresponding <code>free()</code> is executed before program termination.</li>
          <li>Set pointers to <code>NULL</code> immediately after freeing: <code>free(p); p = NULL;</code> to prevent dangling pointer bugs.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'asymptotics',
    title: 'Asymptotic Complexity Cheat-Sheet',
    icon: TrendingUp,
    summary: 'Demystifying Big-O, worst-case invariants, and auxiliary memory bounds.',
    content: (
      <div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
          Asymptotic analysis characterizes algorithm performance as the input size n approaches infinity:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ padding: '12px 14px', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontWeight: 700, color: 'var(--accent-purple-light)' }}>Big-O Notation (O) — Asymptotic Upper Bound</span>
            <p style={{ fontSize: '0.78125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Defines the guaranteed worst-case execution roof. For all n &gt; n₀, T(n) ≤ c · f(n).
            </p>
          </div>
          <div style={{ padding: '12px 14px', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>Big-Omega (Ω) — Asymptotic Lower Bound</span>
            <p style={{ fontSize: '0.78125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Defines the best-case execution floor. An algorithm requires at least this many operations.
            </p>
          </div>
          <div style={{ padding: '12px 14px', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>Big-Theta (Θ) — Asymptotically Tight Bound</span>
            <p style={{ fontSize: '0.78125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Occurs when upper bound and lower bound match (e.g. Merge Sort is always Θ(n log n)).
            </p>
          </div>
        </div>
      </div>
    ),
  },
];

export default function LearningCenter() {
  const [activeModule, setActiveModule] = useState(MODULES[0]);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-purple">CSE Developer Academy</span>
          <span className="badge badge-emerald">C & DSA Engineering</span>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          DSA Learning Center
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Essential principles, memory layout diagrams, and architectural guidelines for writing robust Data Structures in C.
        </p>
      </div>

      {/* Modules Selector Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {MODULES.map((m) => {
          const Icon = m.icon;
          const isSelected = activeModule.id === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveModule(m)}
              className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Icon size={16} />
              <span>{m.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Module Content */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <activeModule.icon size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{activeModule.title}</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{activeModule.summary}</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
          {activeModule.content}
        </div>
      </div>
    </div>
  );
}
