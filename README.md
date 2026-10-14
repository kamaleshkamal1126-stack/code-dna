# CODE DNA 3.0 – DSA Code Analyzer and Comparison Platform

> *"Understand the Structure. Analyze the Complexity. Discover the Code."*

---

## 1. Project Introduction

**CODE DNA 3.0** is an educational, developer-grade web platform primarily engineered for analyzing, understanding, and comparing Data Structures and Algorithms (DSA) programs written in **C**.

Built specifically for Computer Science & Engineering (CSE) students and educators, CODE DNA 3.0 provides static AST lexical inspection, cryptographic code fingerprinting, line-by-line semantic diff analysis, and conservative Big-O complexity estimation—all without executing untrusted user code on the host server.

---

## 2. Key Features

1. **Executive Dashboard (`/`)**:
   - Live metrics calculated directly from database records (Total saved projects, total analyses, unique data structures, unique algorithms).
   - Dynamic frequency distribution bars for detected structures and algorithms.
   - Meaningful empty states for fresh accounts.
   - Real-time engine health indicators (`API Online`, `Native C Engine Ready`).

2. **C Code Analyzer (`/analyzer`)**:
   - Primary workbench featuring a monospace code editor with line numbers and syntax styling.
   - 10+ pre-packaged classical C programs (BST, Quick Sort, Binary Search, Bubble Sort, Stacks, Queues, Dijkstra, Recursive Fibonacci).
   - Local `.c` file upload support.
   - Multi-tab analysis report:
     - **Basic Code Statistics**: Total lines, non-empty lines, comment lines, characters, functions, loops, loop nesting depth, conditionals, recursive patterns.
     - **Data Structure Detection**: Arrays, Strings, Singly/Doubly/Circular Linked Lists, Stacks, Queues, Circular Queues, Binary Trees, BSTs, Heaps, Graphs, and Hash Tables with confidence badges and structural indicators.
     - **Algorithm Detection**: Linear/Binary Search, Bubble/Selection/Insertion/Merge/Quick/Heap Sort, BFS, DFS, Dijkstra, Tree Traversals, BST operations, DP, and Recursion.
     - **Complexity Analysis**: Best, Average, Worst time complexity, Auxiliary space complexity, derivation reasoning, and conservative static analysis disclaimers.
     - **Structural Checks**: Parentheses, curly braces, and square bracket balancing with unclosed issue diagnostics.
   - Export analysis report as JSON.
   - Save directly to persistent database projects.

3. **Dual Code Comparator (`/comparator`)**:
   - Side-by-side code editors comparing two C implementations.
   - Presets for classic algorithmic comparisons (e.g., Linear Search vs Binary Search, Bubble Sort vs Quick Sort, Array Stack vs Linked-List Stack).
   - Longest Common Subsequence (Myers / LCS) line diff with transparent percentage formula explanation.
   - Line statistics: Identical, modified, added, and removed lines.
   - Cryptographic SHA-256 fingerprint matching indicator.
   - Structural delta analysis (differences in loops, nesting, recursion, functions).

4. **Algorithm Complexity Lab (`/complexity-lab`)**:
   - Interactive scale slider ($n \in [1..50]$) illustrating divergent operation growth.
   - SVG asymptotic growth curves comparing $O(1), O(\log n), O(n), O(n \log n), O(n^2), O(2^n)$.
   - Classical DSA catalog with best, worst, and space complexities.
   - Theoretical Big-O caveats explicitly labeled (distinguishing asymptotic theory from hardware benchmarks).

5. **Code Fingerprint & Identity Studio (`/fingerprint`)**:
   - Cryptographic SHA-256 hashing.
   - Distinguishes **Exact-Source Fingerprint** from **Normalized-Source Fingerprint**.
   - Deterministic normalization documentation: comment stripping (block & line), whitespace canonicalization, and edge trimming.
   - Dual snippet hasher to test whether two programs have matching normalized signatures.

6. **DSA Explorer (`/dsa-explorer`)**:
   - Comprehensive curriculum covering 9 categories: Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Searching & Sorting, Hashing, Recursion & DP.
   - Each topic includes: beginner definition, conceptual explanation, complete C source code, sample input/output, step-by-step dry run walkthrough, time complexity, and auxiliary space complexity.
   - One-click **"Open in C Analyzer"** action.

7. **Saved Projects (`/projects`)**:
   - Persistent project management backed by SQLite / MySQL.
   - Filter by DSA category and search by title or tags.
   - Edit metadata, delete projects, and reload source code into the Analyzer.

8. **Analysis History (`/history`)**:
   - Full audit trail of past analyses persisted in the database.
   - View past Big-O estimates, detected patterns, and code snapshots.
   - Reopen past analyses in the analyzer, delete single records, or clear history.

9. **DSA Learning Center (`/learning-center`)**:
   - Educational guides covering:
     - C Pointer mechanics and virtual memory segmentation (Stack, Heap, Data, Code).
     - The double-pointer (`struct Node** head`) pattern.
     - Dynamic memory functions (`malloc`, `calloc`, `realloc`, `free`) and memory safety.
     - Asymptotic notations ($O$, $\Omega$, $\Theta$).

10. **About Project (`/about`)**:
    - Architectural overview and security principles.
    - Live system diagnostics widget querying `/api/health`.

---

## 3. Technology Stack

- **DSA Analysis Engine**: C (C99 standard, compiled via GCC / MinGW).
- **Backend**: Python 3.10+ / 3.14, Flask, Flask-SQLAlchemy, Flask-CORS, PyJWT, Werkzeug.
- **Frontend**: React 18, Vite 5, React Router DOM 6, Lucide React, Vanilla CSS design tokens.
- **Database**: SQLite (centralized and configurable via `DATABASE_URL` for MySQL or PostgreSQL).

---

## 4. Architecture Diagram

```
[ User Browser (React 18 + Vite) ]
             |
             | HTTP REST API (JSON / Bearer Token)
             v
[ Flask Backend Server (port 5000) ]
      |                 |                   |
      |                 |                   |
      v                 v                   v
[ SQLAlchemy ORM ]  [ Diff & Hash ]   [ Native C Engine (Subprocess) ]
      |           (Myers / SHA-256)   (code_dna_analyzer.exe)
      v                                     |
[ SQLite Database ]                         v
(codedna.db)                          [ Tokenizer & Lexer ]
                                      [ Bracket Balance Checker ]
                                      [ DSA Pattern Detector ]
                                      [ Complexity Estimator ]
```

---

## 5. Folder Structure

```
CODE -DNA/
├── backend/
│   ├── app/
│   │   ├── database/          # Centralized SQLAlchemy URI & DB instance
│   │   ├── models/            # User, Project, AnalysisHistory, CodeComparison
│   │   ├── routes/            # auth, analysis, projects, comparison, dsa, health
│   │   ├── services/          # c_analyzer_service, diff_service, fingerprint_service, dsa_curriculum
│   │   └── __init__.py        # Flask app factory, CORS, and error handlers
│   ├── c_engine/
│   │   ├── src/
│   │   │   ├── analyzer.h & .c      # Tokenizer, bracket balance, functions, loops
│   │   │   ├── structures.h & .c    # Linked Lists, Trees, Stacks, Queues, Graphs
│   │   │   ├── algorithms.h & .c    # Sorting, Searching, Traversals, Dijkstra
│   │   │   ├── complexity.h & .c    # Best/Avg/Worst time and auxiliary space
│   │   │   └── main.c               # Safe CLI entry point producing structured JSON
│   │   ├── tests/
│   │   │   └── test_engine.c        # Automated C test harness
│   │   ├── Makefile
│   │   └── code_dna_analyzer.exe    # Compiled native binary
│   ├── tests/
│   │   └── test_api.py        # Python backend integration tests
│   ├── .env.example
│   ├── Procfile               # Cloud deployment descriptor
│   ├── requirements.txt       # Python dependencies
│   └── run.py                 # Backend launch script
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/        # Navbar, Sidebar, AuthModal
│   │   ├── context/           # AuthContext (JWT session management)
│   │   ├── pages/             # All 10 application pages
│   │   ├── services/          # api.js client
│   │   ├── App.jsx
│   │   ├── index.css          # Vanilla CSS design system
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   ├── vercel.json            # Vercel SPA rewrite config
│   └── vite.config.js
├── run_tests.ps1              # One-click test runner script (PowerShell)
└── README.md
```

---

## 6. Prerequisites

Ensure the following tools are installed:
- **GCC / MinGW**: (Verify with `gcc --version`)
- **Python**: 3.10 or higher (Verify with `python --version`)
- **Node.js**: v18 or v20 LTS (Verify with `node --version`, `npm --version`)

---

## 7. Step-by-Step Installation & Setup (Windows PowerShell)

### Step 1: Compile the Native C Analysis Engine

Open PowerShell and navigate to the project root:
```powershell
Set-Location "c:\Users\KAMALESH\Desktop\CODE -DNA"

# Compile code_dna_analyzer.exe
gcc -O2 -Wall -Wextra -std=c99 `
    backend/c_engine/src/main.c `
    backend/c_engine/src/analyzer.c `
    backend/c_engine/src/structures.c `
    backend/c_engine/src/algorithms.c `
    backend/c_engine/src/complexity.c `
    -o backend/c_engine/code_dna_analyzer.exe
```

### Step 2: Set Up the Python Backend

```powershell
# Install backend requirements
python -m pip install -r backend/requirements.txt

# (Optional) Copy .env.example to .env
Copy-Item backend/.env.example backend/.env
```

### Step 3: Set Up the React Frontend

```powershell
Set-Location frontend

# Install npm dependencies
npm install

# (Optional) Copy .env.example to .env
Copy-Item .env.example .env

Set-Location ..
```

---

## 8. Running the Application

### Running the Backend Server (Port 5000)

In a PowerShell terminal:
```powershell
python backend/run.py
```
The backend starts at `http://127.0.0.1:5000`.

### Running the Frontend Dev Server (Port 5173)

In a second PowerShell terminal:
```powershell
Set-Location frontend
npm run dev -- --host 127.0.0.1 --port 5173
```
Open your browser and navigate to:
```
http://127.0.0.1:5173/
```

---

## 9. Running Tests

We provide automated test suites for the C Engine, Python backend, and Frontend.

Run all tests with a single command:
```powershell
powershell -ExecutionPolicy Bypass -File .\run_tests.ps1
```

Or run individual suites manually:

1. **C Engine Test Suite**:
   ```powershell
   gcc -O2 -Wall -Wextra -std=c99 `
       backend/c_engine/tests/test_engine.c `
       backend/c_engine/src/analyzer.c `
       backend/c_engine/src/structures.c `
       backend/c_engine/src/algorithms.c `
       backend/c_engine/src/complexity.c `
       -o backend/c_engine/tests/test_engine.exe
   .\backend\c_engine\tests\test_engine.exe
   ```
   *Verifies bracket balance, linked list, stack, tree, binary search, bubble sort, nested loops, and recursion.*

2. **Python Backend Test Suite**:
   ```powershell
   python -m unittest backend/tests/test_api.py
   ```
   *Verifies health endpoint, user registration/login, C analysis endpoint, project CRUD, code comparison, and DSA curriculum endpoints.*

3. **Frontend Production Build Check**:
   ```powershell
   Set-Location frontend
   npm run build
   Set-Location ..
   ```

---

## 10. REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service status, DB connectivity, C engine readiness |
| `POST` | `/api/auth/register` | Register user (username, email, password) |
| `POST` | `/api/auth/login` | Login user, returns JWT token |
| `GET` | `/api/auth/me` | Current authenticated user profile |
| `POST` | `/api/auth/logout` | Invalidate session |
| `POST` | `/api/analyze` | Run static analysis on C source code |
| `GET` | `/api/analysis-history` | List user's analysis history |
| `GET` | `/api/analysis-history/<id>` | Retrieve specific analysis report |
| `DELETE` | `/api/analysis-history/<id>` | Delete historical record |
| `DELETE` | `/api/analysis-history` | Clear all analysis history |
| `GET` | `/api/projects` | List saved projects (supports `?category=` and `?q=`) |
| `POST` | `/api/projects` | Create a new saved project |
| `GET` | `/api/projects/<id>` | Retrieve project details |
| `PUT` | `/api/projects/<id>` | Update project title, code, or tags |
| `DELETE` | `/api/projects/<id>` | Delete project |
| `POST` | `/api/compare` | Compare two programs via LCS diff and fingerprinting |
| `GET` | `/api/comparisons` | List past comparison records |
| `GET` | `/api/dsa/categories` | List DSA explorer categories |
| `GET` | `/api/dsa/topics` | List DSA topics with dry runs and C implementations |
| `GET` | `/api/dsa/examples` | Curated sample C programs |

---

## 11. Production Deployment Guide

### Frontend Deployment (Vercel)
1. Push repository to GitHub.
2. In Vercel, import the `frontend/` directory as the Root Directory.
3. Set the Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-backend-domain.com/api`
4. The included `frontend/vercel.json` ensures client-side routing works for all 10 routes.

### Backend Deployment (Render / Railway / Cloud VM)
1. Deploy the `backend/` folder on a Linux VM or container service.
2. Ensure GCC is available in the container build step:
   ```bash
   gcc -O2 -Wall -Wextra -std=c99 \
       c_engine/src/main.c c_engine/src/analyzer.c c_engine/src/structures.c \
       c_engine/src/algorithms.c c_engine/src/complexity.c \
       -o c_engine/code_dna_analyzer
   ```
3. Set Environment Variables:
   - `DATABASE_URL`: Managed PostgreSQL or MySQL URI (e.g. `postgresql://user:pass@host:5432/codedna_db`).
   - `SECRET_KEY`: Strong random 32+ character string.
   - `JWT_SECRET`: Strong random 32+ character string.
4. Launch via Gunicorn using the included `Procfile`:
   ```bash
   gunicorn run:app --bind 0.0.0.0:$PORT
   ```

---

## 12. Security Architecture & Invariants

- **Static Analysis Only**: Submitted C programs are **never executed or compiled to runnable machine code on the server**.
- **Process Sandboxing & Timeouts**: Subprocess execution of `code_dna_analyzer.exe` is bounded by a strict 6-second timeout.
- **Request Size Capping**: Request bodies are capped at 2MB to prevent memory exhaustion attacks.
- **Input Validation**: Code input is passed securely through standard input pipes, completely eliminating shell injection vulnerabilities.
- **Password Protection**: Passwords are securely hashed with PBKDF2/scrypt salt using Werkzeug Security.

---

## 13. License & Academic Integrity

Developed for CSE students and algorithmic researchers. Free to use for educational and research purposes.
