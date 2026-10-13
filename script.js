
"use strict";

const $ = (id) => document.getElementById(id);

const samples = {
  java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a number: ");
        int n = sc.nextInt();

        for (int i = 1; i <= n; i++) {
            System.out.println(i);
        }
        sc.close();
    }
}`,
  python: `n = int(input("Enter a number: "))

for i in range(1, n + 1):
    print(i)`,
  c: `#include <stdio.h>

int main(void) {
    int n;
    printf("Enter a number: ");
    scanf("%d", &n);

    for (int i = 1; i <= n; i++) {
        printf("%d\\n", i);
    }
    return 0;
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    int n;
    cout << "Enter a number: ";
    cin >> n;

    for (int i = 1; i <= n; i++) {
        cout << i << endl;
    }
    return 0;
}`,
  javascript: `const n = 5;

for (let i = 1; i <= n; i++) {
    console.log(i);
}`
};

const languageNames = {
  java: "Java",
  python: "Python",
  c: "C",
  cpp: "C++",
  javascript: "JavaScript"
};

function getCode() {
  return $("codeInput").value;
}

function getLanguage() {
  return $("languageSelect").value;
}

function updateEditor() {
  const code = getCode();
  const lines = code.split("\n").length;

  $("lineNumbers").textContent = Array.from(
    { length: lines }, (_, i) => i + 1
  ).join("\n");

  $("lineCount").textContent = `${lines} line${lines === 1 ? "" : "s"}`;
  $("characterCount").textContent = `${code.length} characters`;

  const extensions = {
    java: "Main.java",
    python: "main.py",
    c: "main.c",
    cpp: "main.cpp",
    javascript: "main.js"
  };

  $("fileName").textContent = extensions[getLanguage()] || "code.txt";
}

function showOutput(message, isError = false) {
  const output = $("outputText");
  output.textContent = message;
  output.style.display = "block";
  output.style.color = isError ? "#fca5a5" : "#b9f6c8";

  const welcome = document.querySelector(".terminal-welcome");
  if (welcome) welcome.style.display = "none";
}

function clearOutput() {
  $("outputText").textContent = "";
  $("outputText").style.display = "none";

  const welcome = document.querySelector(".terminal-welcome");
  if (welcome) welcome.style.display = "block";

  $("executionStatus").textContent = "No execution yet";
}

function fingerprint(code) {
  let hash = 2166136261;

  for (let i = 0; i < code.length; i++) {
    hash ^= code.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16).toUpperCase().padStart(8, "0");
}

function removeCommentsAndStrings(code, language) {
  let text = code;

  text = text.replace(
    /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/gs,
    " "
  );

  text = text.replace(/\/\*[\s\S]*?\*\//g, " ");
  text = text.replace(/\/\/.*$/gm, " ");

  if (language === "python") {
    text = text.replace(/#.*$/gm, " ");
    text = text.replace(/^\s*("""|''')[\s\S]*?\1/gm, " ");
  } else if (language !== "c" && language !== "cpp") {
    text = text.replace(/#.*$/gm, " ");
  }

  return text;
}

function checkBrackets(code) {
  const stack = [];
  const pairs = { ")": "(", "]": "[", "}": "{" };

  for (const ch of code) {
    if ("([{".includes(ch)) {
      stack.push(ch);
    } else if (")]}".includes(ch)) {
      if (stack.pop() !== pairs[ch]) return false;
    }
  }

  return stack.length === 0;
}

function estimateComplexity(code, language) {
  const clean = removeCommentsAndStrings(code, language);
  const loopCount = (clean.match(
    /\b(for|while|do)\b|\.forEach\s*\(/g
  ) || []).length;

  const nested = /\bfor\b[\s\S]{0,300}\bfor\b|\bwhile\b[\s\S]{0,300}\bwhile\b/.test(clean);
  const recursive = /\b(\w+)\s*\([^;{}]*\)[\s\S]{0,100}\b\1\s*\(/.test(clean);
  const sortCall = /\b(sort|sorted|Arrays\.sort|Collections\.sort)\s*\(/.test(clean);

  let time = "O(1)";
  let reason = "No obvious loop or repeated operation was detected.";

  if (nested) {
    time = "O(n²) approx.";
    reason = "Potential nested loops detected.";
  } else if (recursive) {
    time = "O(n) or more";
    reason = "Possible recursion detected; inspect the recurrence.";
  } else if (sortCall) {
    time = "O(n log n) approx.";
    reason = "A sorting call was detected.";
  } else if (loopCount > 0) {
    time = "O(n) approx.";
    reason = "One or more loops were detected.";
  }

  const arrayAllocation =
    /\bnew\s+\w+\s*\[|\bnew\s+Array\s*\(|\[\s*.*\]/.test(clean);

  const space = arrayAllocation ? "O(n) approx." : "O(1) approx.";

  return { time, space, loopCount, reason };
}

function analyzeCode() {
  const code = getCode();
  const language = getLanguage();

  if (!code.trim()) {
    $("analysisMessage").textContent = "Enter code before analyzing.";
    return;
  }

  const result = estimateComplexity(code, language);
  const lines = code.split("\n").filter(line => line.trim()).length;

  $("timeComplexity").textContent = result.time;
  $("spaceComplexity").textContent = result.space;
  $("resultLines").textContent = lines;
  $("fingerprint").textContent = fingerprint(code);
  $("analysisDetails").textContent =
    `Language: ${languageNames[language]}. ` +
    `Loop-like constructs detected: ${result.loopCount}. ` +
    `Bracket status: ${checkBrackets(code) ? "Valid" : "Check required"}. ` +
    result.reason;

  $("analysisMessage").textContent =
    "Complexity is estimated using simple pattern matching, not a formal proof.";

  saveHistory({
    language,
    time: result.time,
    fingerprint: fingerprint(code),
    date: new Date().toLocaleString()
  });
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem("codedna_history") || "[]");
  } catch {
    return [];
  }
}

function saveHistory(item) {
  const history = getHistory();
  history.unshift(item);
  localStorage.setItem("codedna_history", JSON.stringify(history.slice(0, 20)));
  renderHistory();
}

function renderHistory() {
  const history = getHistory();
  const container = $("historyList");

  if (!history.length) {
    container.textContent = "No history yet. Analyze some code first.";
    return;
  }

  container.replaceChildren();

  history.forEach(item => {
    const row = document.createElement("div");
    row.style.padding = "12px";
    row.style.marginBottom = "8px";
    row.style.border = "1px solid #29293b";
    row.style.borderRadius = "8px";

    const title = document.createElement("strong");
    title.textContent = `${languageNames[item.language] || item.language} — ${item.time}`;

    const detail = document.createElement("p");
    detail.className = "muted";
    detail.textContent = `${item.date} · ${item.fingerprint}`;

    row.append(title, detail);
    container.appendChild(row);
  });
}

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.toggle("hidden", page.id !== pageId);
  });

  document.querySelectorAll(".nav").forEach(button => {
    button.classList.toggle("active", button.dataset.page === pageId);
  });

  const titles = {
    editorPage: "Code Editor",
    historyPage: "History",
    aboutPage: "About"
  };

  $("pageTitle").textContent = titles[pageId] || "CODE DNA";
}

async function runCode() {
  const code = getCode().trim();
  const language = getLanguage();

  if (!code) {
    showOutput("Please enter a program first.", true);
    return;
  }

  showOutput("Preparing execution...", false);
  $("runStatus").textContent = "Execution requested";
  $("executionStatus").textContent = "Execution service not connected";

  showOutput(
    "Java/Python execution is not connected yet.\n\n" +
    "The website UI and static analysis can work in the browser, " +
    "but Java and Python need a secure code-execution service.\n\n" +
    "Next, we will connect a backend execution API. Do not run " +
    "untrusted code directly on your computer or expose private API keys.",
    true
  );

  $("runStatus").textContent = `${languageNames[language]} runner pending`;
}

$("codeInput").addEventListener("input", updateEditor);

$("languageSelect").addEventListener("change", () => {
  updateEditor();
});

$("sampleButton").addEventListener("click", () => {
  $("codeInput").value = samples[getLanguage()] || "";
  updateEditor();
  clearOutput();
  $("runStatus").textContent = "Sample loaded";
});

$("analyzeButton").addEventListener("click", analyzeCode);

$("runButton").addEventListener("click", runCode);

$("clearButton").addEventListener("click", () => {
  $("codeInput").value = "";
  updateEditor();
  clearOutput();
  $("runStatus").textContent = "Ready to run";
  $("analysisMessage").textContent = "";
  $("timeComplexity").textContent = "—";
  $("spaceComplexity").textContent = "—";
  $("resultLines").textContent = "0";
  $("fingerprint").textContent = "—";
  $("analysisDetails").textContent = "Analyze your code to see the results.";
});

$("clearOutputButton").addEventListener("click", clearOutput);

$("clearHistoryButton").addEventListener("click", () => {
  localStorage.removeItem("codedna_history");
  renderHistory();
});

document.querySelectorAll(".nav").forEach(button => {
  button.addEventListener("click", () => showPage(button.dataset.page));
});

$("languageSelect").value = "java";
$("codeInput").value = samples.java;
updateEditor();
renderHistory();
