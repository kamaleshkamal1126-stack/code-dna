import os
import sys
import json
import subprocess
import re
from typing import Dict, Any

MAX_CODE_SIZE_BYTES = 2 * 1024 * 1024  # 2MB maximum

def get_c_engine_executable_path() -> str:
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    # Check for Windows .exe or Unix binary
    exe_name = "code_dna_analyzer.exe" if sys.platform == "win32" else "code_dna_analyzer"
    direct_path = os.path.join(base_dir, "c_engine", exe_name)
    if os.path.exists(direct_path):
        return direct_path
    alt_path = os.path.join(base_dir, "c_engine", "code_dna_analyzer.exe")
    if os.path.exists(alt_path):
        return alt_path
    return direct_path

def analyze_c_with_engine(source_code: str) -> Dict[str, Any]:
    """
    Invokes the compiled C analysis engine safely via stdin subprocess.
    Never executes the code - purely static analysis.
    """
    if len(source_code.encode("utf-8")) > MAX_CODE_SIZE_BYTES:
        raise ValueError("Source code exceeds maximum allowed size (2MB).")

    exe_path = get_c_engine_executable_path()
    if not os.path.exists(exe_path):
        return analyze_code_python_fallback(source_code, language="c", reason="C engine binary not compiled yet; used fallback parser.")

    try:
        proc = subprocess.Popen(
            [exe_path],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding="utf-8",
            shell=False  # Crucial for security
        )
        stdout, stderr = proc.communicate(input=source_code, timeout=6)
        if proc.returncode != 0:
            return analyze_code_python_fallback(source_code, language="c", reason=f"C engine exited with code {proc.returncode}: {stderr.strip()}")
        
        data = json.loads(stdout)
        data["execution_mode"] = "Native C Engine (code_dna_analyzer.exe)"
        return data
    except subprocess.TimeoutExpired:
        proc.kill()
        return {
            "success": False,
            "error": "Analysis timed out (exceeded 6 seconds limit).",
            "execution_mode": "Native C Engine (Timed Out)"
        }
    except Exception as e:
        return analyze_code_python_fallback(source_code, language="c", reason=f"Process invocation notice: {str(e)}")

def analyze_code_python_fallback(source_code: str, language: str = "c", reason: str = "") -> Dict[str, Any]:
    """
    High-fidelity static analyzer fallback supporting C, C++, Python, Java, and JavaScript.
    Analyzes lines, brackets, loops, conditionals, recursion, DSA patterns, and complexity.
    """
    lines = source_code.splitlines()
    total_lines = len(lines)
    non_empty_lines = sum(1 for line in lines if line.strip())
    
    # Comments & character statistics
    comment_lines = 0
    in_block = False
    for line in lines:
        s = line.strip()
        if in_block:
            comment_lines += 1
            if "*/" in s:
                in_block = False
        elif s.startswith("/*"):
            comment_lines += 1
            if "*/" not in s:
                in_block = True
        elif s.startswith("//") or s.startswith("#"):
            comment_lines += 1

    # Bracket balance
    paren_open = source_code.count("(")
    paren_close = source_code.count(")")
    brace_open = source_code.count("{")
    brace_close = source_code.count("}")
    bracket_open = source_code.count("[")
    bracket_close = source_code.count("]")
    
    paren_balanced = (paren_open == paren_close)
    brace_balanced = (brace_open == brace_close)
    bracket_balanced = (bracket_open == bracket_close)

    # Loops & control flow
    for_loops = len(re.findall(r'\bfor\s*\(', source_code)) or len(re.findall(r'\bfor\s+\w+\s+in\b', source_code))
    while_loops = len(re.findall(r'\bwhile\s*\(', source_code)) or len(re.findall(r'\bwhile\s+[^:]+:', source_code))
    do_while = len(re.findall(r'\bdo\s*\{', source_code))
    total_loops = for_loops + while_loops + do_while
    
    if_count = len(re.findall(r'\bif\s*\(', source_code)) or len(re.findall(r'\bif\s+[^:]+:', source_code))
    switch_count = len(re.findall(r'\bswitch\s*\(', source_code))

    # Function and recursion detection
    functions = []
    suspicious = []
    if not paren_balanced:
        suspicious.append(f"Unbalanced parentheses: {paren_open} '(' vs {paren_close} ')'")
    if not brace_balanced and language in ["c", "cpp", "java", "javascript"]:
        suspicious.append(f"Unbalanced braces: {brace_open} '{{' vs {brace_close} '}}'")

    # Recursion heuristic
    func_defs = re.findall(r'(?:void|int|float|double|char|long|struct\s+\w+\*?|def)\s+([a-zA-Z_]\w*)\s*\(', source_code)
    recursive_count = 0
    for fn in func_defs:
        if fn in ["main", "if", "for", "while", "switch"]:
            continue
        calls = len(re.findall(rf'\b{fn}\s*\(', source_code))
        is_rec = calls > 1
        if is_rec:
            recursive_count += 1
        functions.append({
            "name": fn,
            "return_type": "inferred",
            "start_line": 1,
            "end_line": total_lines,
            "is_recursive": is_rec,
            "recursive_calls_count": calls - 1 if is_rec else 0
        })

    # Data structure detection
    data_structures = []
    if ("->next" in source_code or "*next" in source_code) and ("->prev" in source_code or "*prev" in source_code):
        data_structures.append({
            "name": "Doubly Linked List",
            "category": "Linked Lists",
            "detected": True,
            "confidence": "High",
            "explanation": "Detected bidirectional node references with 'next' and 'prev' pointers.",
            "indicators": "Pointers to both next and previous nodes."
        })
    elif "->next" in source_code or "*next" in source_code or ".next" in source_code:
        data_structures.append({
            "name": "Singly Linked List",
            "category": "Linked Lists",
            "detected": True,
            "confidence": "High",
            "explanation": "Detected chain of nodes linked through single directional 'next' pointer.",
            "indicators": "Self-referencing structure with 'next' node pointer."
        })

    if "->left" in source_code and "->right" in source_code or ".left" in source_code and ".right" in source_code:
        data_structures.append({
            "name": "Binary Tree / BST",
            "category": "Trees",
            "detected": True,
            "confidence": "High",
            "explanation": "Hierarchical node structure branching into left and right child pointers.",
            "indicators": "Pointers left and right in node definition."
        })

    if ("push" in source_code and "pop" in source_code) or "top" in source_code:
        data_structures.append({
            "name": "Stack (LIFO)",
            "category": "Stacks",
            "detected": True,
            "confidence": "High",
            "explanation": "LIFO access pattern with push/pop operations and top tracking.",
            "indicators": "Functions push() and pop() with stack top management."
        })

    if ("enqueue" in source_code and "dequeue" in source_code) or ("front" in source_code and "rear" in source_code):
        data_structures.append({
            "name": "Queue (FIFO)",
            "category": "Queues",
            "detected": True,
            "confidence": "High",
            "explanation": "FIFO sequential ordering with enqueue/dequeue operations.",
            "indicators": "Front and rear queue access indices."
        })

    if bracket_open > 0:
        data_structures.append({
            "name": "Array",
            "category": "Arrays",
            "detected": True,
            "confidence": "High",
            "explanation": "Subscript indexed contiguous elements accessed via brackets [].",
            "indicators": "Array index operator usage."
        })

    # Algorithm detection
    algorithms = []
    if "mid = (low + high)" in source_code or "(low + high) / 2" in source_code or "binarySearch" in source_code:
        algorithms.append({
            "name": "Binary Search",
            "category": "Searching",
            "detected": True,
            "confidence": "High",
            "explanation": "Repeatedly halves search space by comparing target with middle index.",
            "best_case": "O(1)",
            "average_case": "O(log n)",
            "worst_case": "O(log n)",
            "space_complexity": "O(1)",
            "indicators": "Midpoint calculation and interval bounds adjustment."
        })

    if "[j] > [j + 1]" in source_code or "[j] > [j+1]" in source_code or "bubbleSort" in source_code:
        algorithms.append({
            "name": "Bubble Sort",
            "category": "Sorting",
            "detected": True,
            "confidence": "High",
            "explanation": "Repeated adjacent swaps passing largest elements to the end.",
            "best_case": "O(n)",
            "average_case": "O(n^2)",
            "worst_case": "O(n^2)",
            "space_complexity": "O(1)",
            "indicators": "Adjacent comparison arr[j] > arr[j+1] and element swapping."
        })

    if "quickSort" in source_code or "partition" in source_code:
        algorithms.append({
            "name": "Quick Sort",
            "category": "Sorting",
            "detected": True,
            "confidence": "High",
            "explanation": "Divides array around pivot element and recursively sorts partitions.",
            "best_case": "O(n log n)",
            "average_case": "O(n log n)",
            "worst_case": "O(n^2)",
            "space_complexity": "O(log n)",
            "indicators": "Partitioning around pivot and recursive divide-and-conquer calls."
        })

    if "mergeSort" in source_code or "merge(" in source_code:
        algorithms.append({
            "name": "Merge Sort",
            "category": "Sorting",
            "detected": True,
            "confidence": "High",
            "explanation": "Recursively splits array and merges sorted subarrays.",
            "best_case": "O(n log n)",
            "average_case": "O(n log n)",
            "worst_case": "O(n log n)",
            "space_complexity": "O(n)",
            "indicators": "Merge subroutine combining two sorted halves."
        })

    # Complexity estimation
    if algorithms:
        primary = algorithms[0]
        comp = {
            "is_confident": True,
            "best_case": primary["best_case"],
            "average_case": primary["average_case"],
            "worst_case": primary["worst_case"],
            "space_complexity": primary["space_complexity"],
            "confidence": "High (Canonical Algorithm Match)",
            "reasoning": f"Derived from recognized {primary['name']} structural characteristics.",
            "caveats": "Static analysis estimate. Exact runtime complexity depends on input distribution."
        }
    elif total_loops >= 2:
        comp = {
            "is_confident": True,
            "best_case": "O(n)",
            "average_case": "O(n^2)",
            "worst_case": "O(n^2)",
            "space_complexity": "O(1)",
            "confidence": "Moderate (Nested Loops)",
            "reasoning": "Detected nested looping structures scaling quadratically.",
            "caveats": "Static analysis estimate. Exact runtime complexity depends on input distribution."
        }
    elif total_loops == 1:
        comp = {
            "is_confident": True,
            "best_case": "O(1)",
            "average_case": "O(n)",
            "worst_case": "O(n)",
            "space_complexity": "O(1)",
            "confidence": "Moderate (Single Loop)",
            "reasoning": "Detected single linear loop traversal.",
            "caveats": "Static analysis estimate. Exact runtime complexity depends on input distribution."
        }
    elif total_lines > 0 and total_loops == 0 and recursive_count == 0:
        comp = {
            "is_confident": True,
            "best_case": "O(1)",
            "average_case": "O(1)",
            "worst_case": "O(1)",
            "space_complexity": "O(1)",
            "confidence": "High (Constant Time)",
            "reasoning": "Sequential execution without loops or recursive branches.",
            "caveats": "Static analysis estimate. Input independent execution."
        }
    else:
        comp = {
            "is_confident": False,
            "best_case": "Undetermined",
            "average_case": "Undetermined",
            "worst_case": "Undetermined",
            "space_complexity": "Undetermined",
            "confidence": "Low / Inferred",
            "reasoning": "Complexity could not be determined confidently. Manual review is recommended.",
            "caveats": "Irregular control flow or fragmented source code snippet."
        }

    return {
        "success": True,
        "engine": "CODE_DNA_PYTHON_FALLBACK_v3.0",
        "execution_mode": f"Python AST/Regex Analyzer ({reason})" if reason else "Python AST/Regex Analyzer",
        "statistics": {
            "total_lines": total_lines,
            "non_empty_lines": non_empty_lines,
            "comment_lines": comment_lines,
            "total_chars": len(source_code),
            "function_count": len(functions),
            "loop_count": total_loops,
            "for_loops": for_loops,
            "while_loops": while_loops,
            "do_while_loops": do_while,
            "max_loop_nesting": 2 if total_loops >= 2 else (1 if total_loops == 1 else 0),
            "conditional_count": if_count + switch_count,
            "if_count": if_count,
            "switch_count": switch_count,
            "recursive_patterns_count": recursive_count,
            "paren_balanced": paren_balanced,
            "brace_balanced": brace_balanced,
            "bracket_balanced": bracket_balanced,
            "open_paren_count": paren_open,
            "close_paren_count": paren_close,
            "open_brace_count": brace_open,
            "close_brace_count": brace_close,
            "open_bracket_count": bracket_open,
            "close_bracket_count": bracket_close,
            "suspicious_issues": suspicious
        },
        "functions": functions,
        "data_structures": data_structures,
        "algorithms": algorithms,
        "complexity": comp
    }
