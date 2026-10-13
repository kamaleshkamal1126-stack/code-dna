
const $ = (id) => document.getElementById(id);

const samples = {
  java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] arr = {10, 20, 30, 40, 50};
        int sum = 0;

        for (int value : arr) {
            sum += value;
        }

        System.out.println("Sum = " + sum);
        sc.close();
    }
}`,
  python: `numbers = [10, 20, 30, 40, 50]
total = 0

for number in numbers:
    total += number

print("Sum =", total)`,
  c: `#include <stdio.h>

int main(void) {
    int arr[] = {10, 20, 30, 40, 50};
    int n = sizeof(arr) / sizeof(arr[0]);
    int sum = 0;

    for (int i = 0; i < n; i++) {
        sum += arr[i];
    }

    printf("Sum = %d\\n", sum);
    return 0;
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    int arr[] = {10, 20, 30, 40, 50};
    int n = sizeof(arr) / sizeof(arr[0]);
    int sum = 0;

    for (int i = 0; i < n; i++) {
        sum += arr[i];
    }

    cout << "Sum = " << sum << endl;
    return 0;
}`,
  javascript: `const numbers = [10, 20, 30, 40, 50];
let sum = 0;

for (const number of numbers) {
    sum += number;
}

console.log("Sum =", sum);`
};

const HISTORY_KEY = "codedna-history-v2";

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[ch]);
}

function getLanguage() {
  return $("languageSelect")?.value || "java";
}

function getCode() {
  return $("codeInput")?.value || "";
}

function hashCode(code) {
  let hash = 2166136261;

  for (let i = 0; i < code.length; i++) {
    hash ^= code.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16).toUpperCase().padStart(8, "0");
}

function updateEditor() {
  const code = getCode();
  const lines = code.split("\n").length;

  if ($("lineNumbers")) {
    $("lineNumbers").textContent = Array.from(
      { length: lines },
      (_, i) => i + 1
    ).join("\n");
  }

  if ($("lineCount")) {
    $("lineCount").textContent = `${lines} lines`;
  }

  if ($("characterCount")) {
    $("characterCount").textContent = `${code.length} characters`;
  }

  const extensions = {
    java: "java",
    python: "py",
    c: "c",
    cpp: "cpp",
    javascript: "js"
  };

  if ($("fileName")) {
    $("fileName").textContent =
      `main.${extensions[getLanguage()] || "txt"}`;
  }
}

function estimateComplexity(code) {
  const text = code.toLowerCase();

  const loopCount =
    (text.match(/\b(for|while|foreach)\b/g) || []).length;

  const nestedLoop =
    /\b(for|while)\b[\s\S]{0,250}\b(for|while)\b/.test(text);

  const hasSort = /\.sort\s*\(|\bsort\s*\(/i.test(code);
  const hasRecursion =
    /\b([a-z_]\w*)\s*\([^;{}]*\)\s*\{[\s\S]{0,500}?\b\1\s*\(/i.test(code);

  let time = "O(1) — estimated";

  if (nestedLoop) {
    time = "O(n²) — possible nested loops";
  } else if (hasSort) {
    time = "Often O(n log n) — depends on sorting method";
  } else if (loopCount > 0) {
    time = "O(n) — possible linear traversal";
  } else if (hasRecursion) {
    time = "Recursion detected — inspect recurrence";
  }

  let space = "O(1) — possible constant extra space";

  if (
    /\bnew\s+\w+\s*\[|malloc\s*\(|calloc\s*\(|\bvector\s*</i.test(code) ||
    /\blist\s*\(|\[\s*\]/.test(code)
  ) {
    space = "Possible O(n) extra storage";
  }

  return {
    time,
    space,
    lines: code ? code.split("\n").length : 0,
    loops: loopCount,
    fingerprint: hashCode(code)
  };
}

function checkStructure(code) {
  const stack = [];
  const pairs = { ")": "(", "]": "[", "}": "{" };

  let quote = "";
  let escaped = false;
  let mismatch = false;

  for (let i = 0; i < code.length; i++) {
    const ch = code[i];
    const next = code[i + 1];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === quote) {
        quote = "";
      }
      continue;
    }

    if (ch === "/" && next === "/") {
      while (i < code.length && code[i] !== "\n") i++;
      continue;
    }

    if (ch === "/" && next === "*") {
      i += 2;
      while (i < code.length - 1 &&
        !(code[i] === "*" && code[i + 1] === "/")) {
        i++;
      }
      i++;
      continue;
    }

    if (ch === "'" || ch === '"' || ch === "`") {
      quote = ch;
      continue;
    }

    if ("([{".includes(ch)) {
      stack.push(ch);
    } else if (")]}" .includes(ch)) {
      if (stack.pop() !== pairs[ch]) {
        mismatch = true;
        break;
      }
    }
  }

  if (stack.length || quote) mismatch = true;

  return {
    balanced: !mismatch,
    openBrackets: stack.length
  };
}

function analyzeCode(code = getCode(), language = getLanguage()) {
  if (!code.trim()) {
    if ($("analysisMessage")) {
      $("analysisMessage").textContent = "Enter some code to analyze.";
    }
    if ($("resultsSection")) $("resultsSection").hidden = false;
    return;
  }

  const result = estimateComplexity(code);
  const structure = checkStructure(code);

  if ($("timeComplexity")) {
    $("timeComplexity").textContent = result.time;
  }

  if ($("spaceComplexity")) {
    $("spaceComplexity").textContent = result.space;
  }

  if ($("resultLines")) {
    $("resultLines").textContent = result.lines;
  }

  if ($("fingerprint")) {
    $("fingerprint").textContent = result.fingerprint;
  }

  if ($("analysisDetails")) {
    $("analysisDetails").innerHTML = `
      <p><strong>Language:</strong> ${escapeHTML(language.toUpperCase())}</p>
      <p><strong>Loop keywords:</strong> ${result.loops}</p>
      <p><strong>Bracket check:</strong>
        ${structure.balanced
          ? "No obvious mismatch detected"
          : "Possible unmatched bracket or quotation mark"}
      </p>
      <p><strong>Non-empty lines:</strong>
        ${code.split("\n").filter(line => line.trim()).length}
      </p>
      <p><strong>Code fingerprint:</strong> ${result.fingerprint}</p>
    `;
  }

  if ($("analysisMessage")) {
    $("analysisMessage").textContent =
      "Analysis finished. Complexity is estimated using simple pattern checks and may not reflect the actual algorithm.";
  }

  if ($("resultsSection")) $("resultsSection").hidden = false;

  saveHistory(code, language);
}

function loadSample() {
  const language = getLanguage();

  if ($("codeInput")) {
    $("codeInput").value = samples[language] || samples.java;
  }

  updateEditor();

  if ($("resultsSection")) $("resultsSection").hidden = true;
}

function clearEditor() {
  if ($("codeInput")) $("codeInput").value = "";
  updateEditor();

  if ($("resultsSection")) $("resultsSection").hidden = true;
}

function compareCodes() {
  const codeA = $("compareCodeA")?.value || "";
  const codeB = $("compareCodeB")?.value || "";
  const language = $("compareLanguage")?.value || "java";
  const results = $("compareResults");

  if (!results) return;

  if (!codeA.trim() || !codeB.trim()) {
    results.textContent = "Enter code in both Code A and Code B.";
    return;
  }

  const a = estimateComplexity(codeA);
  const b = estimateComplexity(codeB);

  const normalizedA = codeA.trim().replace(/\s+/g, " ");
  const normalizedB = codeB.trim().replace(/\s+/g, " ");
  const identical = normalizedA === normalizedB;

  const linesA = codeA.split("\n").filter(line => line.trim()).length;
  const linesB = codeB.split("\n").filter(line => line.trim()).length;

  results.innerHTML = `
    <h2>Comparison Results</h2>
    <div class="comparison-grid">
      <article class="comparison-card">
        <h3>Code A</h3>
        <p><strong>Language:</strong> ${escapeHTML(language)}</p>
        <p><strong>Time:</strong> ${escapeHTML(a.time)}</p>
        <p><strong>Space:</strong> ${escapeHTML(a.space)}</p>
        <p><strong>Non-empty lines:</strong> ${linesA}</p>
        <p><strong>Fingerprint:</strong> ${a.fingerprint}</p>
      </article>
      <article class="comparison-card">
        <h3>Code B</h3>
        <p><strong>Language:</strong> ${escapeHTML(language)}</p>
        <p><strong>Time:</strong> ${escapeHTML(b.time)}</p>
        <p><strong>Space:</strong> ${escapeHTML(b.space)}</p>
        <p><strong>Non-empty lines:</strong> ${linesB}</p>
        <p><strong>Fingerprint:</strong> ${b.fingerprint}</p>
      </article>
    </div>
    <p><strong>Text result:</strong>
      ${identical
        ? "Both samples are identical apart from whitespace."
        : "The code samples differ."}
    </p>
    <p><strong>Line-count difference:</strong>
      ${Math.abs(linesA - linesB)} line(s)
    </p>
    <p class="notice">
      Complexity estimates are heuristic, not proof of actual runtime,
      memory use, correctness, or performance.
    </p>
  `;
}

function saveHistory(code, language) {
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");

    history.unshift({
      code: code.slice(0, 10000),
      language,
      time: new Date().toLocaleString()
    });

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
  } catch {
    // Analysis still works if browser storage is unavailable.
  }
}

function renderHistory() {
  const container = $("historyList");
  if (!container) return;

  let history = [];

  try {
    history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    history = [];
  }

  if (!history.length) {
    container.textContent = "No analysis history yet.";
    return;
  }

  container.innerHTML = history.map((item, index) => `
    <article class="history-item">
      <p><strong>${escapeHTML(item.language.toUpperCase())}</strong></p>
      <p>${escapeHTML(item.time)}</p>
      <pre>${escapeHTML(item.code.slice(0, 250))}</pre>
      <button type="button" class="button secondary"
        data-history-index="${index}">Load Code</button>
    </article>
  `).join("");

  container.querySelectorAll("[data-history-index]").forEach(button => {
    button.addEventListener("click", () => {
      const item = history[Number(button.dataset.historyIndex)];
      if (!item) return;

      if ($("languageSelect")) {
        $("languageSelect").value = item.language;
      }

      if ($("codeInput")) $("codeInput").value = item.code;

      updateEditor();
      showPage("editorPage");
    });
  });
}

function showPage(pageId) {
  const pageTitles = {
    editorPage: "Code Analyzer",
    comparePage: "Code Comparator",
    historyPage: "Analysis History",
    aboutPage: "About CODE DNA"
  };

  ["editorPage", "comparePage", "historyPage", "aboutPage"].forEach(id => {
    const page = $(id);
    if (page) page.hidden = id !== pageId;
  });

  document.querySelectorAll(".nav[data-page]").forEach(button => {
    button.classList.toggle("active", button.dataset.page === pageId);
  });

  if ($("pageTitle")) {
    $("pageTitle").textContent = pageTitles[pageId] || "CODE DNA";
  }

  if (pageId === "historyPage") renderHistory();
}

document.addEventListener("DOMContentLoaded", () => {
  if ($("codeInput")) {
    $("codeInput").value = samples[getLanguage()] || samples.java;
    $("codeInput").addEventListener("input", updateEditor);
  }

  $("languageSelect")?.addEventListener("change", () => {
    updateEditor();
  });

  $("sampleButton")?.addEventListener("click", loadSample);
  $("analyzeButton")?.addEventListener("click", () => analyzeCode());
  $("clearButton")?.addEventListener("click", clearEditor);
  $("compareButton")?.addEventListener("click", compareCodes);

  $("clearHistoryButton")?.addEventListener("click", () => {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {
      // Ignore unavailable storage.
    }
    renderHistory();
  });

  document.querySelectorAll(".nav[data-page]").forEach(button => {
    button.addEventListener("click", () => showPage(button.dataset.page));
  });

  updateEditor();
  showPage("editorPage");
});
