
const $ = (id) => document.getElementById(id);

const samples = {
  java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter array size: ");
        int n = sc.nextInt();

        int[] arr = new int[n];
        int sum = 0;

        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
            sum += arr[i];
        }

        System.out.println("Sum = " + sum);
        sc.close();
    }
}`,
  python: `n = int(input("Enter array size: "))
arr = list(map(int, input("Enter numbers: ").split()))

total = 0
for number in arr:
    total += number

print("Sum =", total)`,
  c: `#include <stdio.h>

int main(void) {
    int n, arr[100], sum = 0;

    printf("Enter array size: ");
    scanf("%d", &n);

    if (n < 1 || n > 100) {
        printf("Invalid size\\n");
        return 1;
    }

    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
        sum += arr[i];
    }

    printf("Sum = %d\\n", sum);
    return 0;
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    int n, sum = 0;
    cin >> n;

    for (int i = 0; i < n; i++) {
        int value;
        cin >> value;
        sum += value;
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

const historyKey = "codedna-history-v1";

function getLanguage() {
  return $("languageSelect")?.value || "java";
}

function getCode() {
  return $("codeInput")?.value || "";
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function setStatus(message, isError = false) {
  const status = $("runStatus");
  if (!status) return;
  status.textContent = message;
  status.style.color = isError ? "#ff7272" : "#a7f3d0";
}

function updateEditor() {
  const code = getCode();
  const lines = code.split("\n").length;

  if ($("lineNumbers")) {
    $("lineNumbers").textContent =
      Array.from({ length: lines }, (_, i) => i + 1).join("\n");
  }

  if ($("lineCount")) $("lineCount").textContent = `${lines} lines`;
  if ($("characterCount")) {
    $("characterCount").textContent = `${code.length} characters`;
  }

  const extension = {
    java: "java",
    python: "py",
    c: "c",
    cpp: "cpp",
    javascript: "js"
  };

  if ($("fileName")) {
    $("fileName").textContent = `main.${extension[getLanguage()] || "txt"}`;
  }
}

function addOutput(text, append = false) {
  const output = $("outputText");
  if (!output) return;

  const welcome = document.querySelector(".terminal-welcome");
  if (welcome) welcome.style.display = "none";

  output.textContent = append
    ? `${output.textContent}\n${text}`
    : String(text);

  if ($("executionStatus")) {
    $("executionStatus").textContent = "Finished";
  }
}

function clearOutput() {
  if ($("outputText")) $("outputText").textContent = "";
  const welcome = document.querySelector(".terminal-welcome");
  if (welcome) welcome.style.display = "";
  if ($("executionStatus")) $("executionStatus").textContent = "Ready";
  setStatus("Ready");
}

function hashCode(code) {
  let hash = 2166136261;

  for (let i = 0; i < code.length; i++) {
    hash ^= code.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16).toUpperCase().padStart(8, "0");
}

function estimateComplexity(code) {
  const text = code.toLowerCase();
  const loops = (text.match(/\b(for|while|foreach)\b/g) || []).length;
  const nestedLoop = /\b(for|while)\b[\s\S]{0,300}\b(for|while)\b/.test(text);
  const recursion = /\b([a-z_]\w*)\s*\([^;]*\)[\s\S]{0,200}\b\1\s*\(/i.test(code);
  const sort = /\.sort\s*\(|sort\s*\(/i.test(code);

  let time = "O(1)";
  if (nestedLoop || (loops >= 2 && /\b(for|while)\b/.test(text))) {
    time = "O(n²) — estimated";
  } else if (loops > 0) {
    time = "O(n) — estimated";
  } else if (recursion) {
    time = "Depends on recursion";
  }

  if (sort && loops === 0) time = "Usually O(n log n) for efficient sorting";

  let space = "O(1) — estimated";
  if (/\bnew\s+\w+\s*\[|malloc\s*\(|calloc\s*\(|\[\s*\]|list\s*\(|vector\s*</i.test(code)) {
    space = "O(n) — possible extra storage";
  }

  return { time, space, lines: code ? code.split("\n").length : 0 };
}

function analyzeCode(code = getCode()) {
  const result = estimateComplexity(code);

  if ($("timeComplexity")) $("timeComplexity").textContent = result.time;
  if ($("spaceComplexity")) $("spaceComplexity").textContent = result.space;
  if ($("resultLines")) $("resultLines").textContent = result.lines;
  if ($("fingerprint")) $("fingerprint").textContent = hashCode(code);

  const stack = [];
  const pairs = { ")": "(", "]": "[", "}": "{" };
  let balanced = true;
  let quote = null;
  let escaped = false;

  for (const char of code) {
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = null;
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if ("([{".includes(char)) stack.push(char);
    if (")]}".includes(char)) {
      if (stack.pop() !== pairs[char]) {
        balanced = false;
        break;
      }
    }
  }

  if (stack.length || quote) balanced = false;

  if ($("analysisDetails")) {
    $("analysisDetails").innerHTML = `
      <p><strong>Bracket check:</strong> ${balanced ? "No obvious mismatch found" : "Possible unmatched bracket or quote"}</p>
      <p><strong>Loop count:</strong> ${(code.match(/\b(for|while|foreach)\b/gi) || []).length}</p>
      <p><strong>Recursion keyword check:</strong> ${/\breturn\b/.test(code) ? "Return statement detected" : "No return statement detected"}</p>
      <p><strong>Fingerprint:</strong> ${hashCode(code)}</p>
      <p><em>These are lightweight estimates, not a full compiler or formal complexity proof.</em></p>
    `;
  }

  if ($("analysisMessage")) {
    $("analysisMessage").textContent = balanced
      ? "Basic checks completed. Run your program to test actual behavior."
      : "Check your brackets or quotation marks. This simple check may not understand every language syntax.";
  }

  if ($("resultsSection")) $("resultsSection").style.display = "block";
  saveHistory(code, getLanguage());
  return result;
}

function saveHistory(code, language) {
  if (!code.trim()) return;

  try {
    const history = JSON.parse(localStorage.getItem(historyKey) || "[]");
    history.unshift({
      code: code.slice(0, 12000),
      language,
      time: new Date().toLocaleString()
    });
    localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 20)));
  } catch {
    // History is optional if browser storage is unavailable.
  }
}

function renderHistory() {
  const container = $("historyList");
  if (!container) return;

  let history = [];

  try {
    history = JSON.parse(localStorage.getItem(historyKey) || "[]");
  } catch {
    history = [];
  }

  if (!history.length) {
    container.textContent = "No saved code yet. Analyze a program to add it here.";
    return;
  }

  container.innerHTML = history.map((item, index) => `
    <div class="history-item">
      <p><strong>${escapeHTML(item.language.toUpperCase())}</strong> · ${escapeHTML(item.time)}</p>
      <pre>${escapeHTML(item.code.slice(0, 300))}</pre>
      <button type="button" data-history-index="${index}">Load code</button>
    </div>
  `).join("");

  container.querySelectorAll("[data-history-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = history[Number(button.dataset.historyIndex)];
      if (!item) return;
      if ($("languageSelect")) $("languageSelect").value = item.language;
      if ($("codeInput")) $("codeInput").value = item.code;
      showPage("editorPage");
      updateEditor();
    });
  });
}

async function runCode() {
  const code = getCode();
  const language = getLanguage();
  const button = $("runButton");

  if (!code.trim()) {
    addOutput("Please enter a program first.");
    setStatus("No code to run", true);
    return;
  }

  if (button) button.disabled = true;
  if ($("executionStatus")) $("executionStatus").textContent = "Running…";
  setStatus("Sending code to execution service…");
  addOutput("Running program…");

  try {
    const response = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        code,
        stdin: $("stdinInput")?.value || ""
      })
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.error || `Request failed (${response.status})`);
    }

    const output = [
      result.compileOutput ? `COMPILE OUTPUT:\n${result.compileOutput}` : "",
      result.stdout || "",
      result.stderr ? `ERROR:\n${result.stderr}` : "",
      !result.stdout && !result.stderr && !result.compileOutput
        ? (result.output || "(Program finished with no output.)")
        : ""
    ].filter(Boolean).join("\n");

    addOutput(output || "(Program finished with no output.)");
    const failed = result.code !== 0 && result.code !== null;

    if ($("executionStatus")) {
      $("executionStatus").textContent = failed ? "Finished with errors" : "Finished";
    }

    setStatus(failed ? "Program returned an error." : "Execution completed.");
    saveHistory(code, language);
  } catch (error) {
    addOutput(`Execution failed:\n${error.message}\n\nCheck that the /api/run backend is deployed and the execution service is available.`);
    setStatus("Execution failed", true);
    if ($("executionStatus")) $("executionStatus").textContent = "Error";
  } finally {
    if (button) button.disabled = false;
  }
}

function compareCodes() {
  const codeA = $("compareCodeA")?.value || "";
  const codeB = $("compareCodeB")?.value || "";
  const language = $("compareLanguage")?.value || getLanguage();
  const results = $("compareResults");

  if (!codeA.trim() || !codeB.trim()) {
    if (results) results.textContent = "Enter code in both boxes before comparing.";
    return;
  }

  const a = estimateComplexity(codeA);
  const b = estimateComplexity(codeB);
  const same = codeA.trim().replace(/\s+/g, " ") === codeB.trim().replace(/\s+/g, " ");

  if (!results) return;

  results.innerHTML = `
    <div class="comparison-grid">
      <div class="comparison-card">
        <h3>Code A</h3>
        <p><strong>Language:</strong> ${escapeHTML(language)}</p>
        <p><strong>Time:</strong> ${escapeHTML(a.time)}</p>
        <p><strong>Space:</strong> ${escapeHTML(a.space)}</p>
        <p><strong>Lines:</strong> ${a.lines}</p>
        <p><strong>Fingerprint:</strong> ${hashCode(codeA)}</p>
      </div>
      <div class="comparison-card">
        <h3>Code B</h3>
        <p><strong>Language:</strong> ${escapeHTML(language)}</p>
        <p><strong>Time:</strong> ${escapeHTML(b.time)}</p>
        <p><strong>Space:</strong> ${escapeHTML(b.space)}</p>
        <p><strong>Lines:</strong> ${b.lines}</p>
        <p><strong>Fingerprint:</strong> ${hashCode(codeB)}</p>
      </div>
    </div>
    <p><strong>Text comparison:</strong> ${same ? "The code is identical apart from whitespace." : "The code differs."}</p>
    <p><em>Complexity values are heuristic estimates. This comparison does not prove which program is faster or correct.</em></p>
  `;
}

function showPage(pageId) {
  ["editorPage", "comparePage", "historyPage", "aboutPage"].forEach((id) => {
    const page = $(id);
    if (page) page.style.display = id === pageId ? "block" : "none";
  });

  document.querySelectorAll(".nav[data-page]").forEach((nav) => {
    nav.classList.toggle("active", nav.dataset.page === pageId);
  });

  if (pageId === "historyPage") renderHistory();
}

function loadSample() {
  const language = getLanguage();
  if ($("codeInput")) $("codeInput").value = samples[language] || samples.java;
  if ($("stdinInput")) $("stdinInput").value = language === "java" || language === "c"
    ? "5\n10 20 30 40 50"
    : language === "python"
      ? "5\n10 20 30 40 50"
      : "";
  updateEditor();
  clearOutput();
}

document.addEventListener("DOMContentLoaded", () => {
  if ($("codeInput")) {
    $("codeInput").value = samples[getLanguage()] || samples.java;
    $("codeInput").addEventListener("input", updateEditor);
  }

  $("languageSelect")?.addEventListener("change", () => {
    updateEditor();
    setStatus("Language changed. Select Load Sample to insert example code.");
  });

  $("sampleButton")?.addEventListener("click", loadSample);
  $("analyzeButton")?.addEventListener("click", () => analyzeCode());
  $("runButton")?.addEventListener("click", runCode);
  $("clearOutputButton")?.addEventListener("click", clearOutput);

  $("clearButton")?.addEventListener("click", () => {
    if ($("codeInput")) $("codeInput").value = "";
    updateEditor();
    clearOutput();
  });

  $("compareButton")?.addEventListener("click", compareCodes);

  $("clearHistoryButton")?.addEventListener("click", () => {
    localStorage.removeItem(historyKey);
    renderHistory();
  });

  document.querySelectorAll(".nav[data-page]").forEach((nav) => {
    nav.addEventListener("click", () => showPage(nav.dataset.page));
  });

  updateEditor();
  showPage("editorPage");
});
