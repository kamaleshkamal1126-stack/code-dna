
"use strict";

const $ = id => document.getElementById(id);

const LANGUAGES = {
  c: "C",
  cpp: "C++",
  java: "Java",
  python: "Python",
  javascript: "JavaScript"
};

const TOPICS = {
  general: "General Programming",
  arrays: "Arrays",
  strings: "Strings",
  "linked-lists": "Linked Lists",
  stacks: "Stacks",
  queues: "Queues",
  searching: "Searching",
  sorting: "Sorting",
  recursion: "Recursion",
  trees: "Trees",
  graphs: "Graphs",
  hashing: "Hashing",
  "dynamic-programming": "Dynamic Programming",
  oop: "Object-Oriented Programming",
  "exception-handling": "Exception Handling",
  multithreading: "Multithreading",
  "file-handling": "File Handling"
};

const HISTORY_KEY = "codedna_history_v3";
let lastFingerprint = "";

function hashCode(text) {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).toUpperCase().padStart(8, "0");
}

function removeCommentsAndStrings(code, language) {
  let result = "";
  let state = "normal";
  let quote = "";
  let escaped = false;

  for (let i = 0; i < code.length; i++) {
    const c = code[i];
    const next = code[i + 1];

    if (state === "line") {
      if (c === "\n") {
        result += "\n";
        state = "normal";
      } else {
        result += " ";
      }
      continue;
    }

    if (state === "block") {
      if (c === "*" && next === "/") {
        result += "  ";
        i++;
        state = "normal";
      } else {
        result += c === "\n" ? "\n" : " ";
      }
      continue;
    }

    if (state === "string") {
      result += c === "\n" ? "\n" : " ";
      if (escaped) escaped = false;
      else if (c === "\\") escaped = true;
      else if (c === quote) state = "normal";
      continue;
    }

    if (language === "python" && c === "#") {
      result += " ";
      state = "line";
      continue;
    }

    if (["c", "cpp"].includes(language) && c === "#") {
      result += " ";
      state = "line";
      continue;
    }

    if (c === "/" && next === "/") {
      result += "  ";
      i++;
      state = "line";
      continue;
    }

    if (c === "/" && next === "*") {
      result += "  ";
      i++;
      state = "block";
      continue;
    }

    if (c === '"' || c === "'" || c === "`") {
      result += " ";
      quote = c;
      state = "string";
      continue;
    }

    result += c;
  }

  return result;
}

function bracketsValid(code) {
  const stack = [];
  const pairs = { ")": "(", "]": "[", "}": "{" };

  for (const character of code) {
    if ("([{".includes(character)) {
      stack.push(character);
    } else if (pairs[character]) {
      if (stack.pop() !== pairs[character]) return false;
    }
  }

  return stack.length === 0;
}

function getLoopCount(code) {
  return (code.match(/\b(for|while|do)\b/g) || []).length;
}

function getFunctionCount(code, language) {
  let pattern;

  if (language === "python") {
    pattern = /^\s*def\s+[A-Za-z_]\w*\s*\(/gm;
  } else if (language === "javascript") {
    pattern = /\bfunction\s+[A-Za-z_$]\w*\s*\(|(?:const|let|var)\s+[A-Za-z_$]\w*\s*=/g;
  } else if (language === "java") {
    pattern = /\b(?:public|private|protected|static|final|void|int|double|float|boolean|String)\s+\w+\s*\([^;]*\)\s*\{/g;
  } else {
    pattern = /\b[A-Za-z_]\w*\s*\([^;{}]*\)\s*\{/g;
  }

  return (code.match(pattern) || []).length;
}

function estimateComplexity(code, language, loops) {
  const recursive = language === "python"
    ? /^\s*def\s+(\w+)\s*\([^)]*\)\s*:[\s\S]*?\b\1\s*\(/m.test(code)
    : /\bfunction\s+(\w+)\s*\([^)]*\)\s*\{[\s\S]*?\b\1\s*\(/.test(code);

  if (recursive) {
    return {
      time: "Check recursion",
      space: "Depends on recursion"
    };
  }

  if (loops >= 2) {
    return {
      time: "O(n²) possible",
      space: "O(1) possible"
    };
  }

  if (loops === 1) {
    return {
      time: "O(n) possible",
      space: "O(1) possible"
    };
  }

  return {
    time: "O(1) possible",
    space: "O(1) possible"
  };
}

function analyzeCode(code, language, topic) {
  const clean = removeCommentsAndStrings(code, language);
  const lines = code ? code.split(/\r\n|\r|\n/) : [];
  const nonEmptyLines = lines.filter(line => line.trim()).length;
  const loops = getLoopCount(clean);
  const functions = getFunctionCount(clean, language);
  const conditionals = (clean.match(/\b(if|else|elif|switch|case)\b/g) || []).length;
  const complexity = estimateComplexity(clean, language, loops);
  const fingerprint = hashCode(clean.replace(/\s+/g, " ").trim());

  const notes = [
    "Complexity results are approximate pattern-based estimates.",
    "Loop count does not always reveal the actual algorithm complexity.",
    "A balanced-bracket check does not prove that the code compiles."
  ];

  if (topic === "searching") {
    notes.push("Linear search is usually O(n); binary search is usually O(log n).");
  }

  if (topic === "sorting") {
    notes.push("Sorting complexity depends on the algorithm, such as insertion sort or merge sort.");
  }

  if (topic === "graphs") {
    notes.push("Graph algorithms often use vertex and edge counts, such as V and E.");
  }

  if (topic === "dynamic-programming") {
    notes.push("Dynamic programming complexity depends on the number of states and work per state.");
  }

  return {
    language,
    topic,
    characters: code.length,
    lines: lines.length,
    nonEmptyLines,
    loops,
    functions,
    conditionals,
    bracketStatus: bracketsValid(clean),
    fingerprint,
    time: complexity.time,
    space: complexity.space,
    notes
  };
}

function safeHistoryRead() {
  try {
    const value = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function safeHistoryWrite(items) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 50)));
  } catch {
    showMessage("Analysis completed, but history could not be saved.", "error");
  }
}

function showMessage(message, type = "") {
  const element = $("analysisMessage");
  if (!element) return;
  element.textContent = message;
  element.className = "message" + (type ? " " + type : "");
}

function updateCounters() {
  const code = $("codeInput").value;
  $("lineCount").textContent = code ? code.split(/\r\n|\r|\n/).length + " lines" : "0 lines";
  $("characterCount").textContent = code.length + " characters";
}

function displayResults(result) {
  $("resultsSection").classList.remove("hidden");
  $("resultLanguage").textContent = LANGUAGES[result.language];
  $("resultTopic").textContent = TOPICS[result.topic] || result.topic;
  $("resultLines").textContent = result.nonEmptyLines;
  $("timeComplexity").textContent = result.time;
  $("spaceComplexity").textContent = result.space;

  $("analysisDetails").innerHTML = `
    <div class="detail-row"><span>Characters</span><strong>${result.characters}</strong></div>
    <div class="detail-row"><span>Loop count</span><strong>${result.loops}</strong></div>
    <div class="detail-row"><span>Possible functions</span><strong>${result.functions}</strong></div>
    <div class="detail-row"><span>Conditional patterns</span><strong>${result.conditionals}</strong></div>
    <div class="detail-row"><span>Bracket status</span><strong>${result.bracketStatus ? "Valid" : "Check required"}</strong></div>
    <div class="detail-notes"><h4>Notes</h4><ul>${result.notes.map(note => `<li>${note}</li>`).join("")}</ul></div>
  `;

  lastFingerprint = result.fingerprint;
  $("fingerprintBox").classList.remove("hidden");
  $("codeFingerprint").textContent = result.fingerprint;
}

function runAnalysis(code, language, topic) {
  const result = analyzeCode(code, language, topic);
  displayResults(result);
  return result;
}

function renderHistory() {
  const history = safeHistoryRead();
  const container = $("historyList");

  if (!history.length) {
    container.innerHTML = '<div class="empty-state"><h3>No analysis yet</h3><p>Your saved analyses will appear here.</p></div>';
    return;
  }

  container.innerHTML = history.map((item, index) => `
    <article class="history-item">
      <div class="history-icon">⌘</div>
      <div class="history-info">
        <strong>${LANGUAGES[item.language] || item.language} · ${TOPICS[item.topic] || item.topic}</strong>
        <p>${item.time} · ${item.lines} non-empty lines</p>
        <p>Time estimate: ${item.complexity} · Fingerprint: ${item.fingerprint}</p>
      </div>
      <button class="secondary-button history-load" data-index="${index}" type="button">View</button>
    </article>
  `).join("");

  container.querySelectorAll(".history-load").forEach(button => {
    button.addEventListener("click", () => {
      const item = safeHistoryRead()[Number(button.dataset.index)];
      if (!item) return;

      $("languageSelect").value = item.language;
      $("topicSelect").value = item.topic;
      $("codeInput").value = item.code;
      updateCounters();
      runAnalysis(item.code, item.language, item.topic);
      showPage("analyzerPage");
      showMessage("Saved analysis loaded.", "success");
    });
  });
}

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.toggle("hidden", page.id !== pageId);
    page.classList.toggle("active-page", page.id === pageId);
  });

  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.toggle("active", button.dataset.page === pageId);
  });

  const titles = {
    analyzerPage: "Code Analyzer",
    comparePage: "Code Comparison",
    historyPage: "Analysis History",
    aboutPage: "About CODE DNA"
  };

  $("pageTitle").textContent = titles[pageId] || "CODE DNA";

  if (pageId === "historyPage") renderHistory();
}

function compareCodes() {
  const codeA = $("compareCodeA").value;
  const codeB = $("compareCodeB").value;
  const language = $("compareLanguage").value;
  const topic = $("compareTopic").value;
  const output = $("compareResults");

  output.classList.remove("hidden");

  if (!codeA.trim() || !codeB.trim()) {
    output.innerHTML = '<p class="message error">Enter code in both boxes.</p>';
    return;
  }

  const a = analyzeCode(codeA, language, topic);
  const b = analyzeCode(codeB, language, topic);
  const match = a.fingerprint === b.fingerprint;

  output.innerHTML = `
    <div class="comparison-banner ${match ? "match" : ""}">
      <strong>${match ? "Fingerprints match" : "Fingerprints differ"}</strong>
      <p>Fingerprints are basic hashes and cannot prove code originality or plagiarism.</p>
    </div>
    <div class="stats-grid">
      <article class="stat-card"><span>Code A lines</span><strong>${a.nonEmptyLines}</strong><p>${a.time}</p><code>${a.fingerprint}</code></article>
      <article class="stat-card"><span>Code B lines</span><strong>${b.nonEmptyLines}</strong><p>${b.time}</p><code>${b.fingerprint}</code></article>
      <article class="stat-card"><span>Line difference</span><strong>${Math.abs(a.nonEmptyLines - b.nonEmptyLines)}</strong></article>
    </div>
  `;
}

$("loginForm").addEventListener("submit", event => {
  event.preventDefault();
  const username = $("username").value.trim();
  const password = $("password").value;

  if (!username || !password) {
    $("loginMessage").textContent = "Enter a username and password.";
    return;
  }

  sessionStorage.setItem("codedna_user", username);
  $("userDisplay").textContent = username;
  $("userDisplay").previousElementSibling.textContent = username.charAt(0).toUpperCase();
  $("loginPage").classList.add("hidden");
  $("app").classList.remove("hidden");
  showPage("analyzerPage");
});

$("logoutButton").addEventListener("click", () => {
  sessionStorage.removeItem("codedna_user");
  $("app").classList.add("hidden");
  $("loginPage").classList.remove("hidden");
});

document.querySelectorAll(".nav-item").forEach(button => {
  button.addEventListener("click", () => showPage(button.dataset.page));
});

$("codeInput").addEventListener("input", updateCounters);

$("clearButton").addEventListener("click", () => {
  $("codeInput").value = "";
  $("resultsSection").classList.add("hidden");
  updateCounters();
  showMessage("Editor cleared.", "success");
});

$("analyzeButton").addEventListener("click", () => {
  const code = $("codeInput").value;
  if (!code.trim()) {
    showMessage("Paste some code before analyzing.", "error");
    return;
  }

  const language = $("languageSelect").value;
  const topic = $("topicSelect").value;
  const result = runAnalysis(code, language, topic);

  const history = safeHistoryRead();
  history.unshift({
    time: new Date().toLocaleString(),
    language,
    topic,
    lines: result.nonEmptyLines,
    complexity: result.time,
    fingerprint: result.fingerprint,
    code
  });

  safeHistoryWrite(history);
  showMessage("Analysis completed.", "success");
});

$("copyFingerprintButton").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(lastFingerprint);
    $("copyFingerprintButton").textContent = "Copied!";
  } catch {
    showMessage("Clipboard permission is unavailable.", "error");
  }
});

$("clearHistoryButton").addEventListener("click", () => {
  if (confirm("Clear all analysis history?")) {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
  }
});

$("compareButton").addEventListener("click", compareCodes);

updateCounters();

const savedUser = sessionStorage.getItem("codedna_user");
if (savedUser) {
  $("userDisplay").textContent = savedUser;
  $("userDisplay").previousElementSibling.textContent = savedUser.charAt(0).toUpperCase();
  $("loginPage").classList.add("hidden");
  $("app").classList.remove("hidden");
} else {
  $("app").classList.add("hidden");
  $("loginPage").classList.remove("hidden");
}
