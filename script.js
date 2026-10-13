```javascript
const $ = id => document.getElementById(id);

let historyData = [];
let nextId = 1;

const languageNames = {
    c: "C",
    cpp: "C++",
    java: "Java",
    python: "Python",
    javascript: "JavaScript"
};

const topicNames = {
    general: "General Code",
    arrays: "Arrays",
    strings: "Strings",
    "linked-lists": "Linked Lists",
    stacks: "Stacks",
    queues: "Queues",
    searching: "Searching",
    sorting: "Sorting",
    recursion: "Recursion",
    trees: "Trees and BST",
    graphs: "Graphs",
    hashing: "Hashing",
    "dynamic-programming": "Dynamic Programming",
    oop: "Object-Oriented Programming",
    "exception-handling": "Exception Handling",
    multithreading: "Multithreading",
    "file-handling": "File Handling"
};

const keywordPatterns = {
    c: /\b(auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)\b/g,
    cpp: /\b(auto|bool|break|case|catch|char|class|const|continue|default|delete|do|double|else|enum|false|float|for|if|int|long|namespace|new|private|protected|public|return|short|signed|sizeof|static|struct|switch|template|this|throw|true|try|using|virtual|void|while)\b/g,
    java: /\b(abstract|boolean|break|byte|case|catch|char|class|continue|default|do|double|else|extends|final|finally|float|for|if|implements|import|instanceof|int|interface|long|new|null|package|private|protected|public|return|short|static|super|switch|this|throw|throws|try|void|while)\b/g,
    python: /\b(and|as|assert|async|await|break|class|continue|def|del|elif|else|except|False|finally|for|from|global|if|import|in|is|lambda|None|nonlocal|not|or|pass|raise|return|True|try|while|with|yield)\b/g,
    javascript: /\b(async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|false|finally|for|function|if|import|in|instanceof|let|new|null|return|static|super|switch|this|throw|true|try|typeof|var|void|while|yield)\b/g
};

function fingerprint(code) {
    let hash = 2166136261;

    for (let i = 0; i < code.length; i++) {
        hash ^= code.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }

    return (hash >>> 0).toString(16).toUpperCase().padStart(8, "0");
}

function countBrackets(code) {
    const stack = [];
    const pairs = { ")": "(", "]": "[", "}": "{" };
    const openers = ["(", "[", "{"];

    let quote = null;
    let escaped = false;

    for (let i = 0; i < code.length; i++) {
        const char = code[i];
        const next = code[i + 1];

        if (escaped) {
            escaped = false;
            continue;
        }

        if (quote) {
            if (char === "\\") {
                escaped = true;
            } else if (char === quote) {
                quote = null;
            }
            continue;
        }

        if (char === '"' || char === "'" || char === "`") {
            quote = char;
            continue;
        }

        if (char === "/" && next === "/") {
            while (i < code.length && code[i] !== "\n") i++;
            continue;
        }

        if (char === "/" && next === "*") {
            i += 2;
            while (i < code.length - 1 &&
                   !(code[i] === "*" && code[i + 1] === "/")) i++;
            i++;
            continue;
        }

        if (char === "#") {
            const isPython = $("languageSelect")?.value === "python";
            if (isPython) {
                while (i < code.length && code[i] !== "\n") i++;
                continue;
            }
        }

        if (openers.includes(char)) {
            stack.push(char);
        } else if (pairs[char]) {
            if (stack.pop() !== pairs[char]) return "Invalid";
        }
    }

    return stack.length === 0 ? "Valid" : "Invalid";
}

function removeCommentsAndStrings(code, language) {
    let result = "";
    let quote = null;
    let escaped = false;
    let lineComment = false;
    let blockComment = false;

    for (let i = 0; i < code.length; i++) {
        const char = code[i];
        const next = code[i + 1];

        if (lineComment) {
            if (char === "\n") {
                lineComment = false;
                result += "\n";
            } else {
                result += " ";
            }
            continue;
        }

        if (blockComment) {
            if (char === "*" && next === "/") {
                blockComment = false;
                result += "  ";
                i++;
            } else {
                result += char === "\n" ? "\n" : " ";
            }
            continue;
        }

        if (quote) {
            if (char === "\\") {
                result += " ";
                if (i + 1 < code.length) {
                    result += code[i + 1] === "\n" ? "\n" : " ";
                    i++;
                }
                continue;
            }

            if (char === quote) quote = null;
            result += char === "\n" ? "\n" : " ";
            continue;
        }

        if (char === "/" && next === "/") {
            lineComment = true;
            result += "  ";
            i++;
            continue;
        }

        if (char === "/" && next === "*") {
            blockComment = true;
            result += "  ";
            i++;
            continue;
        }

        if (language === "python" && char === "#") {
            lineComment = true;
            result += " ";
            continue;
        }

        if (char === "'" || char === '"' ||
            (char === "`" && language === "javascript")) {
            quote = char;
            result += " ";
            continue;
        }

        result += char;
    }

    return result;
}

function analyzeCode(code, language) {
    const cleanCode = removeCommentsAndStrings(code, language);
    const keywordMatches = cleanCode.match(keywordPatterns[language]) || [];
    const loopMatches = cleanCode.match(/\b(for|while|do)\b/g) || [];
    const functionMatches = language === "python"
        ? cleanCode.match(/\bdef\s+\w+\s*\(/g) || []
        : cleanCode.match(/\bfunction\s+\w*\s*\(|\b\w+\s+\w+\s*\([^;{}]*\)\s*\{/g) || [];

    const lines = code.length ? code.split("\n").length : 0;
    const brackets = countBrackets(code);
    const fingerprintValue = fingerprint(code);

    let time = "Not determined";
    let space = "Not determined";
    const details = [];

    if (loopMatches.length === 0) {
        time = "Possibly O(1)";
        details.push("No common loop keywords were detected.");
    } else if (loopMatches.length === 1) {
        time = "Possibly O(n)";
        details.push("One loop keyword was detected. Check its bounds and iterations.");
    } else {
        time = "Possibly O(n²) or more";
        details.push("Multiple loop keywords were detected. Confirm whether loops are nested or sequential.");
    }

    if (/\b(return\s+\w+\s*\(|\bdef\s+\w+|\bfunction\b)/.test(cleanCode)) {
        details.push("A function or method definition may be present.");
    }

    if (/\b(new|malloc|calloc|realloc|ArrayList|HashMap|list|dict|set)\b/.test(cleanCode)) {
        space = "Possible additional memory";
        details.push("Possible dynamic allocation or collection usage detected.");
    } else {
        space = "Possibly O(1) auxiliary space";
    }

    if (/\b(if|elif|else|switch|case)\b/.test(cleanCode)) {
        details.push("Conditional logic was detected.");
    }

    if (/\b(class|interface|struct)\b/.test(cleanCode)) {
        details.push("A class, interface, or structure declaration may be present.");
    }

    if (/\b(try|catch|except|throw|throws)\b/.test(cleanCode)) {
        details.push("Exception-handling patterns were detected.");
    }

    if (/\b(def|function)\b/.test(cleanCode) ||
        language === "java" || language === "c" || language === "cpp") {
        details.push("Functions or methods should be examined to identify calls and recursion.");
    }

    details.push("Detected keywords: " + keywordMatches.length);
    details.push("Detected loop keywords: " + loopMatches.length);
    details.push("Detected possible function definitions: " + functionMatches.length);
    details.push("Bracket balance: " + brackets);
    details.push("Fingerprint: " + fingerprintValue);
    details.push("These are heuristic estimates, not compiler validation or a full complexity proof.");

    return {
        chars: code.length,
        lines,
        keywords: keywordMatches.length,
        loops: loopMatches.length,
        brackets,
        fingerprint: fingerprintValue,
        time,
        space,
        details
    };
}

function updateEditorCounts() {
    const code = $("codeInput").value;
    $("lineCount").textContent =
        "Lines: " + (code.length ? code.split("\n").length : 0);
    $("characterCount").textContent = "Characters: " + code.length;
}

function showPage(page) {
    document.querySelectorAll(".page-section").forEach(section => {
        section.classList.add("hidden");
    });

    const target = $(page + "Page");
    if (target) target.classList.remove("hidden");

    document.querySelectorAll(".nav-item").forEach(button => {
        button.classList.toggle("active", button.dataset.page === page);
    });

    const titles = {
        analyzer: "Code Analyzer",
        history: "Analysis History",
        about: "About CODE DNA"
    };

    $("pageTitle").textContent = titles[page] || "CODE DNA";
}

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
    $("userDisplay").textContent = username;
    $("loginMessage").textContent = "";
    showPage("analyzer");
});

$("logoutButton").addEventListener("click", () => {
    $("app").classList.add("hidden");
    $("loginPage").classList.remove("hidden");
    $("password").value = "";
});

$("languageSelect").addEventListener("change", () => {
    const language = $("languageSelect").value;
    $("languageBadge").textContent = languageNames[language];
});

$("codeInput").addEventListener("input", updateEditorCounts);

$("analyzeButton").addEventListener("click", () => {
    const code = $("codeInput").value;
    const language = $("languageSelect").value;
    const topic = $("topicSelect").value;

    if (!code.trim()) {
        $("analysisMessage").textContent = "Please paste your code first.";
        $("resultsSection").classList.add("hidden");
        return;
    }

    const result = analyzeCode(code, language);

    $("resultLanguage").textContent = languageNames[language];
    $("resultTopic").textContent = topicNames[topic];
    $("resultLines").textContent = result.lines;
    $("timeComplexity").textContent = result.time;
    $("spaceComplexity").textContent = result.space;

    const details = $("analysisDetails");
    details.replaceChildren();

    result.details.forEach(message => {
        const paragraph = document.createElement("p");
        paragraph.textContent = message;
        details.appendChild(paragraph);
    });

    $("resultsSection").classList.remove("hidden");
    $("analysisMessage").textContent = "Analysis completed.";

    historyData.unshift({
        id: nextId++,
        language: languageNames[language],
        topic: topicNames[topic],
        lines: result.lines,
        fingerprint: result.fingerprint,
        time: result.time
    });

    renderHistory();
});

$("clearButton").addEventListener("click", () => {
    $("codeInput").value = "";
    $("resultsSection").classList.add("hidden");
    $("analysisMessage").textContent = "";
    updateEditorCounts();
});

function renderHistory() {
    const list = $("historyList");
    list.replaceChildren();

    if (historyData.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No analyses yet. Analyze some code to get started.";
        list.appendChild(message);
        return;
    }

    historyData.forEach(item => {
        const card = document.createElement("div");
        card.className = "history-item";

        const heading = document.createElement("h3");
        heading.textContent = "#" + item.id + " — " + item.language;

        const topic = document.createElement("p");
        topic.textContent = "Topic: " + item.topic;

        const lines = document.createElement("p");
        lines.textContent = "Lines: " + item.lines;

        const complexity = document.createElement("p");
        complexity.textContent = "Estimated time: " + item.time;

        const hash = document.createElement("p");
        hash.textContent = "Fingerprint: " + item.fingerprint;

        card.append(heading, topic, lines, complexity, hash);
        list.appendChild(card);
    });
}

$("clearHistoryButton").addEventListener("click", () => {
    historyData = [];
    renderHistory();
});

document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", () => showPage(button.dataset.page));
});

updateEditorCounts();
renderHistory();
```
