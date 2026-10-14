import React, { useState } from 'react';
import {
  TrendingUp,
  Sliders,
  Info,
  Layers,
  ArrowRight,
  ShieldAlert,
  Zap,
  HelpCircle
} from 'lucide-react';

const ALGORITHMS_CATALOG = [
  {
    name: 'Binary Search',
    complexityClass: 'O(log n)',
    best: 'O(1)',
    avg: 'O(log n)',
    worst: 'O(log n)',
    space: 'O(1)',
    explanation: 'Halves the search space at each comparison. With n=1,000,000 items, binary search requires only ~20 comparisons.',
    category: 'Searching',
  },
  {
    name: 'Linear Search',
    complexityClass: 'O(n)',
    best: 'O(1)',
    avg: 'O(n)',
    worst: 'O(n)',
    space: 'O(1)',
    explanation: 'Scans every element sequentially. Runtime scales directly proportional to input size n.',
    category: 'Searching',
  },
  {
    name: 'Quick Sort',
    complexityClass: 'O(n log n)',
    best: 'O(n log n)',
    avg: 'O(n log n)',
    worst: 'O(n^2)',
    space: 'O(log n)',
    explanation: 'Partitions array around pivot. Recursion tree has depth log n, each level doing n work. Worst case O(n^2) when pivot choices are skewed.',
    category: 'Sorting',
  },
  {
    name: 'Merge Sort',
    complexityClass: 'O(n log n)',
    best: 'O(n log n)',
    avg: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(n)',
    explanation: 'Guaranteed O(n log n) division and merge. Requires O(n) auxiliary temporary arrays during merge step.',
    category: 'Sorting',
  },
  {
    name: 'Bubble Sort',
    complexityClass: 'O(n^2)',
    best: 'O(n)',
    avg: 'O(n^2)',
    worst: 'O(n^2)',
    space: 'O(1)',
    explanation: 'Quadratic nested loops comparing adjacent elements. Execution steps scale as n*(n-1)/2.',
    category: 'Sorting',
  },
  {
    name: 'Naive Recursive Fibonacci',
    complexityClass: 'O(2^n)',
    best: 'O(2^n)',
    avg: 'O(2^n)',
    worst: 'O(2^n)',
    space: 'O(n)',
    explanation: 'Each function call spawns 2 additional recursive calls, forming a binary recursion tree with 2^n total leaves.',
    category: 'Recursion',
  },
  {
    name: 'Array Element Access',
    complexityClass: 'O(1)',
    best: 'O(1)',
    avg: 'O(1)',
    worst: 'O(1)',
    space: 'O(1)',
    explanation: 'Constant-time index computation: base_address + (index * element_size). Immediate memory access.',
    category: 'Array',
  },
];

export default function ComplexityLab() {
  const [inputN, setInputN] = useState(24);
  const [selectedAlgo, setSelectedAlgo] = useState(ALGORITHMS_CATALOG[2]); // Quick Sort default

  // Calculate theoretical step numbers for given N
  const n = inputN;
  const stepsO1 = 1;
  const stepsOlogN = Math.round(Math.log2(n || 1));
  const stepsON = n;
  const stepsOnLogN = Math.round(n * Math.log2(n || 1));
  const stepsOn2 = n * n;
  const stepsO2n = n <= 30 ? Math.pow(2, n) : '10^9+ (Overflow)';

  // SVG Chart Dimensions
  const svgWidth = 600;
  const svgHeight = 280;
  const padding = 40;

  // Generate SVG path points for range x in [1..40]
  const generatePath = (fn) => {
    const points = [];
    for (let x = 1; x <= 40; x++) {
      const rawY = fn(x);
      // Clamp Y to height
      const yClamped = Math.min(rawY, 1600);
      const px = padding + (x / 40) * (svgWidth - 2 * padding);
      const py = svgHeight - padding - (yClamped / 1600) * (svgHeight - 2 * padding);
      points.push(`${px},${py}`);
    }
    return points.join(' ');
  };

  const pathO1 = generatePath(() => 10);
  const pathOlogN = generatePath((x) => Math.log2(x) * 35);
  const pathON = generatePath((x) => x * 15);
  const pathOnLogN = generatePath((x) => x * Math.log2(x) * 6);
  const pathOn2 = generatePath((x) => x * x);
  const pathO2n = generatePath((x) => Math.pow(1.5, x));

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-purple">Theoretical Big-O Lab</span>
          <span className="badge badge-blue">Asymptotic Growth Visualizer</span>
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Algorithm Complexity Lab
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Explore theoretical growth curves and asymptotic classifications. Understand why O(n log n) algorithms scale to millions of elements while O(n²) bottlenecks at scale.
        </p>
      </div>

      {/* Interactive Input Size Slider */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={18} color="var(--accent-purple-light)" />
              <span>Interactive Scale Slider: Input Size (n)</span>
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Adjust n to observe the diverging computational steps across complexity classes
            </span>
          </div>
          <div style={{ padding: '6px 16px', background: 'var(--bg-surface-elevated)', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Current Scale: </span>
            <strong style={{ fontSize: '1.125rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>n = {inputN}</strong>
          </div>
        </div>

        <input
          type="range"
          min="1"
          max="50"
          value={inputN}
          onChange={(e) => setInputN(parseInt(e.target.value, 10))}
          style={{ width: '100%', height: '8px', accentColor: 'var(--accent-purple)', cursor: 'pointer' }}
        />

        {/* Live Step Counts Grid for Current N */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginTop: '20px' }}>
          <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>O(1) Constant</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '4px' }}>{stepsO1} op</div>
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 700 }}>O(log n) Logarithmic</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '4px' }}>~{stepsOlogN} ops</div>
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 700 }}>O(n) Linear</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '4px' }}>{stepsON} ops</div>
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 700 }}>O(n log n) Linearithmic</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '4px' }}>~{stepsOnLogN} ops</div>
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 700 }}>O(n²) Quadratic</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '4px' }}>{stepsOn2} ops</div>
          </div>
          <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 700 }}>O(2ⁿ) Exponential</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '4px' }}>{stepsO2n.toLocaleString()} ops</div>
          </div>
        </div>
      </div>

      {/* SVG Interactive Growth Curves Chart */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Theoretical Asymptotic Growth Curves</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              X-Axis: Input Size (n) • Y-Axis: Relative Computational Operations
            </span>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '0.75rem' }}>
            <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>● O(1)</span>
            <span style={{ color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '4px' }}>● O(log n)</span>
            <span style={{ color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '4px' }}>● O(n)</span>
            <span style={{ color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '4px' }}>● O(n log n)</span>
            <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>● O(n²)</span>
            <span style={{ color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '4px' }}>● O(2ⁿ)</span>
          </div>
        </div>

        <div className="chart-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: '100%' }}>
            {/* Grid Lines */}
            <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#334155" strokeWidth="1.5" />
            <line x1={padding} y1={padding} x2={padding} y2={svgHeight - padding} stroke="#334155" strokeWidth="1.5" />

            {/* Curves */}
            <polyline fill="none" stroke="#10b981" strokeWidth="2.5" points={pathO1} />
            <polyline fill="none" stroke="#06b6d4" strokeWidth="2.5" points={pathOlogN} />
            <polyline fill="none" stroke="#3b82f6" strokeWidth="2.5" points={pathON} />
            <polyline fill="none" stroke="#8b5cf6" strokeWidth="2.5" points={pathOnLogN} />
            <polyline fill="none" stroke="#f59e0b" strokeWidth="2.5" points={pathOn2} />
            <polyline fill="none" stroke="#f43f5e" strokeWidth="2.5" points={pathO2n} />

            {/* Labels */}
            <text x={svgWidth - padding - 60} y={svgHeight - padding - 15} fill="#10b981" fontSize="11" fontFamily="monospace">O(1)</text>
            <text x={svgWidth - padding - 80} y={svgHeight - padding - 45} fill="#06b6d4" fontSize="11" fontFamily="monospace">O(log n)</text>
            <text x={svgWidth - padding - 70} y={svgHeight - padding - 100} fill="#3b82f6" fontSize="11" fontFamily="monospace">O(n)</text>
            <text x={svgWidth - padding - 110} y={svgHeight - padding - 150} fill="#8b5cf6" fontSize="11" fontFamily="monospace">O(n log n)</text>
            <text x={260} y={60} fill="#f59e0b" fontSize="11" fontFamily="monospace">O(n²)</text>
            <text x={110} y={60} fill="#f43f5e" fontSize="11" fontFamily="monospace">O(2ⁿ)</text>
          </svg>
        </div>

        {/* Mandatory Theoretical Disclaimer */}
        <div style={{ marginTop: '14px', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.78125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={16} color="var(--accent-amber)" />
          <span>
            <strong>Theoretical Specification: </strong>
            Charts represent theoretical asymptotic Big-O growth curves, not hardware benchmarks or measured wall-clock execution times.
          </span>
        </div>
      </div>

      {/* Algorithm Complexity Catalog */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
          Classical DSA Complexity Catalog
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {ALGORITHMS_CATALOG.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedAlgo(item)}
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: selectedAlgo?.name === item.name ? 'rgba(139, 92, 246, 0.12)' : 'var(--bg-surface)',
                border: selectedAlgo?.name === item.name ? '1px solid var(--accent-purple)' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                  {item.name}
                </span>
                <span className="badge badge-purple">{item.complexityClass}</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: 1.5 }}>
                {item.explanation}
              </p>
              <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Best: <strong style={{ color: '#10b981' }}>{item.best}</strong></span>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{ color: 'var(--text-muted)' }}>Worst: <strong style={{ color: '#f43f5e' }}>{item.worst}</strong></span>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <span style={{ color: 'var(--text-muted)' }}>Space: <strong style={{ color: '#06b6d4' }}>{item.space}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
