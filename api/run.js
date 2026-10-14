
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST requests are allowed."
    });
  }

  try {
    const { language, code, stdin = "" } = req.body || {};

    const runtimes = {
      java: "java",
      python: "python",
      c: "c++",
      cpp: "c++",
      javascript: "javascript"
    };

    if (!runtimes[language]) {
      return res.status(400).json({
        error: "Unsupported language."
      });
    }

    if (typeof code !== "string" || !code.trim()) {
      return res.status(400).json({
        error: "Please provide source code."
      });
    }

    if (code.length > 20000 || String(stdin).length > 5000) {
      return res.status(413).json({
        error: "Code or input is too large."
      });
    }

    const response = await fetch(
      "https://emkc.org/api/v2/piston/execute",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          language: runtimes[language],
          version: "*",
          files: [
            {
              name: language === "java" ? "Main.java" :
                    language === "python" ? "main.py" :
                    language === "c" ? "main.c" :
                    language === "cpp" ? "main.cpp" : "main.js",
              content: code
            }
          ],
          stdin: String(stdin),
          run_timeout: 5000,
          compile_timeout: 10000
        }),
        signal: AbortSignal.timeout(15000)
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return res.status(502).json({
        error: "Execution service is unavailable.",
        details: result.message || ""
      });
    }

    return res.status(200).json({
      output: result.run?.output || "",
      stdout: result.run?.stdout || "",
      stderr: result.run?.stderr || "",
      compileOutput: result.compile?.output || "",
      code: result.run?.code ?? null,
      signal: result.run?.signal ?? null
    });
  } catch (error) {
    return res.status(502).json({
      error: "Could not contact the execution service. Please try again."
    });
  }
}
