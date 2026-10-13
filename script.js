
const $ = id => document.getElementById(id);

let historyData = [];
let nextId = 1;
let comparisonCount = 0;

const pages = ["dashboard", "analyzer", "compare", "history"];

$("loginForm").addEventListener("submit", event => {
    event.preventDefault();

    const username = $("username").value.trim();
    const password = $("password").value;

    if (!username || !password) {
        $("loginMessage").textContent = "Enter a username and password.";
        return;
    }

    $("loginPage").classList.add("hidden");
    $("app").classList.remove("hidden");
    $("welcomeUser").textContent = "Signed in as " + username;
    showPage("dashboard");
});

$("logoutBtn").addEventListener("click", () => {
    $("app").classList.add("hidden");
    $("loginPage").classList.remove("hidden");
    $("password").value = "";
});

function showPage(page) {
    pages.forEach(name => $(name + "Page").classList.toggle("hidden", name !== page));

    document.querySelectorAll(".nav-btn").forEach(button => {
        button.classList.toggle("active", button.dataset.page === page);
    });

    const titles = {
        dashboard: "Dashboard",
        analyzer: "Code Analyzer",
        compare: "Compare Code",
        history: "Analysis History"
    };

    $("pageTitle").textContent = titles[page] || "Dashboard";
}

document.querySelectorAll(".nav-btn").forEach(button => {
    button.addEventListener("click", () => showPage(button.dataset.page));
});

document.querySelectorAll("[data-goto]").forEach(button => {
    button.addEventListener("click", () => showPage(button.dataset.goto));
});

function fingerprint(code) {
    let hash = 14695981039346656037n;

    for (let i = 0; i < code.length; i++) {
        hash ^= BigInt(code.charCodeAt(i));
        hash = BigInt.asUintN(64, hash * 1099511628211n);
    }

    return hash.toString(16).padStart(16, "0").toUpperCase();
}

function countBrackets(code) {
    const stack = [];
    const pairs = { ")": "(", "]": "[", "}": "{" };
    const openers = ["(", "[", "{"];

    for (const char of code) {
        if (openers.includes(char)) {
            stack.push(char);
        } else if (pairs[char]) {
            if (stack.pop() !== pairs[char]) return "Invalid";
        }
    }

    return stack.length === 0 ? "Valid" : "Invalid";
}

function analyzeCode(code) {
    const keywords = [
        "int", "float", "double", "char", "void", "if", "else",
        "for", "while", "do", "switch", "case", "return",
        "class", "public", "private", "static", "new", "try",
        "catch", "throw", "import", "const", "struct"
    ];

    const keywordPattern = new RegExp("\\b(" + keywords.join("|") + ")\\b", "g");
    const keywordMatches = code.match(keywordPattern) || [];
    const loopMatches = code.match(/\b(for|while|do)\b/g) || [];

    return {
        chars: code.length,
        lines: code.length ? code.split("\n").length : 0,
        keywords: keywordMatches.length,
        loops: loopMatches.length,
        brackets: countBrackets(code),
        fingerprint: fingerprint(code)
    };
}

$("loadSample").addEventListener("click", () => {
    $("codeInput").value = `#include <stdio.h>

int main() {
    int a[] = {10, 20, 30, 40, 50};
    int key = 30;

    for (int i = 0; i < 5; i++) {
        if (a[i] == key) {
            printf("Found");
            break;
        }
    }

    return 0;
}`;
    $("analyzerMessage").textContent = "Sample code loaded.";
});

$("clearCode").addEventListener("click", () => {
    $("codeInput").value = "";
    $("analysisResults").classList.add("hidden");
    $("analyzerMessage").textContent = "";
});

$("analyzeBtn").addEventListener("click", () => {
    const code = $("codeInput").value;

    if (!code.trim()) {
        $("analyzerMessage").textContent = "Please paste some code first.";
        return;
    }

    const result = analyzeCode(code);

    $("charCount").textContent = result.chars;
    $("lineCount").textContent = result.lines;
    $("keywordCount").textContent = result.keywords;
    $("loopCount").textContent = result.loops;
    $("bracketStatus").textContent = result.brackets;
    $("fingerprint").textContent = result.fingerprint;
    $("analysisResults").classList.remove("hidden");
    $("analyzerMessage").textContent = "Analysis completed.";

    historyData.unshift({
        id: nextId++,
        chars: result.chars,
        lines: result.lines,
        fingerprint: result.fingerprint
    });

    renderHistory();
    updateStats();
});

function renderHistory() {
    const search = $("historySearch").value.trim().toLowerCase();
    const filtered = historyData.filter(item =>
        String(item.id).includes(search) ||
        item.fingerprint.toLowerCase().includes(search)
    );

    $("historyBody").innerHTML = "";

    filtered.forEach(item => {
        const row = document.createElement("tr");

        [item.id, item.chars, item.lines, item.fingerprint].forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        $("historyBody").appendChild(row);
    });

    $("emptyHistory").classList.toggle("hidden", filtered.length > 0);
}

$("historySearch").addEventListener("input", renderHistory);

$("clearHistory").addEventListener("click", () => {
    historyData = [];
    renderHistory();
    updateStats();
});

function updateStats() {
    $("totalAnalyses").textContent = historyData.length;
    $("uniqueFingerprints").textContent =
        new Set(historyData.map(item => item.fingerprint)).size;
    $("totalComparisons").textContent = comparisonCount;
}

function normalizeCode(code) {
    return code.replace(/\s+/g, "").toLowerCase();
}

function calculateSimilarity(codeA, codeB) {
    const a = normalizeCode(codeA);
    const b = normalizeCode(codeB);

    if (a === b) return 100;
    if (!a.length || !b.length) return 0;

    // Longest common subsequence using a memory-efficient dynamic program.
    let previous = new Array(b.length + 1).fill(0);

    for (let i = 1; i <= a.length; i++) {
        const current = new Array(b.length + 1).fill(0);

        for (let j = 1; j <= b.length; j++) {
            if (a[i - 1] === b[j - 1]) {
                current[j] = previous[j - 1] + 1;
            } else {
                current[j] = Math.max(previous[j], current[j - 1]);
            }
        }

        previous = current;
    }

    const common = previous[b.length];
    return Math.round((2 * common / (a.length + b.length)) * 100);
}

$("compareBtn").addEventListener("click", () => {
    const a = $("codeOne").value;
    const b = $("codeTwo").value;

    if (!a.trim() || !b.trim()) {
        $("compareMessage").textContent = "Paste code into both boxes first.";
        $("compareResults").classList.add("hidden");
        return;
    }

    const score = calculateSimilarity(a, b);
    comparisonCount++;

    $("similarityPercent").textContent = score + "%";
    $("similarityBar").style.width = score + "%";

    let label;
    if (score === 100) {
        label = "Identical after whitespace removal";
    } else if (score >= 75) {
        label = "High textual similarity";
    } else if (score >= 40) {
        label = "Moderate textual similarity";
    } else {
        label = "Low textual similarity";
    }

    $("similarityLabel").textContent = label;
    $("compareDescription").textContent =
        "The snippets have an estimated textual similarity of " + score + "%.";
    $("compareResults").classList.remove("hidden");
    $("compareMessage").textContent = "";
    updateStats();
});

$("compareSample").addEventListener("click", () => {
    $("codeOne").value = `int search(int a[], int n, int key) {
    for (int i = 0; i < n; i++) {
        if (a[i] == key) {
            return i;
        }
    }
    return -1;
}`;

    $("codeTwo").value = `int search(int a[], int n, int key) {
    for (int i = 0; i < n; i++) {
        if (a[i] == key) {
            return i;
        }
    }
    return -1;
}`;

    $("compareMessage").textContent = "Two identical test snippets loaded.";
});

$("clearCompare").addEventListener("click", () => {
    $("codeOne").value = "";
    $("codeTwo").value = "";
    $("compareResults").classList.add("hidden");
    $("compareMessage").textContent = "";
});