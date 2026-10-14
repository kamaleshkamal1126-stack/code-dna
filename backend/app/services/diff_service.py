import difflib
from typing import Dict, Any, List

def compute_code_diff(code_a: str, code_b: str, analysis_a: Dict[str, Any], analysis_b: Dict[str, Any]) -> Dict[str, Any]:
    """
    Performs line-based Myers diff algorithm and structural comparison.
    Calculates similarity percentage with clear formula explanation.
    """
    lines_a = code_a.splitlines()
    lines_b = code_b.splitlines()

    matcher = difflib.SequenceMatcher(None, lines_a, lines_b)
    ratio = matcher.ratio()
    similarity_percentage = round(ratio * 100, 2)

    # Compute line counts and breakdown
    opcodes = matcher.get_opcodes()
    identical_lines_count = 0
    added_lines_count = 0
    removed_lines_count = 0
    modified_lines_count = 0

    side_by_side: List[Dict[str, Any]] = []

    for tag, i1, i2, j1, j2 in opcodes:
        if tag == 'equal':
            for line_a, line_b in zip(lines_a[i1:i2], lines_b[j1:j2]):
                identical_lines_count += 1
                side_by_side.append({
                    "type": "equal",
                    "line_a": line_a,
                    "line_b": line_b,
                    "line_num_a": i1 + 1,
                    "line_num_b": j1 + 1
                })
        elif tag == 'replace':
            count = max(i2 - i1, j2 - j1)
            modified_lines_count += count
            for k in range(count):
                la = lines_a[i1 + k] if (i1 + k) < i2 else None
                lb = lines_b[j1 + k] if (j1 + k) < j2 else None
                side_by_side.append({
                    "type": "modified",
                    "line_a": la,
                    "line_b": lb,
                    "line_num_a": (i1 + k + 1) if la is not None else None,
                    "line_num_b": (j1 + k + 1) if lb is not None else None
                })
        elif tag == 'delete':
            for la in lines_a[i1:i2]:
                removed_lines_count += 1
                side_by_side.append({
                    "type": "removed",
                    "line_a": la,
                    "line_b": None,
                    "line_num_a": i1 + 1,
                    "line_num_b": None
                })
        elif tag == 'insert':
            for lb in lines_b[j1:j2]:
                added_lines_count += 1
                side_by_side.append({
                    "type": "added",
                    "line_a": None,
                    "line_b": lb,
                    "line_num_a": None,
                    "line_num_b": j1 + 1
                })

    # Structural metric diffs
    stats_a = analysis_a.get("statistics", {})
    stats_b = analysis_b.get("statistics", {})

    structural_differences = {
        "loop_count_diff": stats_b.get("loop_count", 0) - stats_a.get("loop_count", 0),
        "loop_nesting_diff": stats_b.get("max_loop_nesting", 0) - stats_a.get("max_loop_nesting", 0),
        "function_count_diff": stats_b.get("function_count", 0) - stats_a.get("function_count", 0),
        "recursion_diff": stats_b.get("recursive_patterns_count", 0) - stats_a.get("recursive_patterns_count", 0),
        "lines_diff": stats_b.get("total_lines", 0) - stats_a.get("total_lines", 0)
    }

    # Extract detected DS and algorithms
    ds_a = [d.get("name") for d in analysis_a.get("data_structures", [])]
    ds_b = [d.get("name") for d in analysis_b.get("data_structures", [])]
    algo_a = [a.get("name") for a in analysis_a.get("algorithms", [])]
    algo_b = [a.get("name") for a in analysis_b.get("algorithms", [])]

    comp_a = analysis_a.get("complexity", {})
    comp_b = analysis_b.get("complexity", {})

    return {
        "similarity_percentage": similarity_percentage,
        "similarity_formula_explanation": (
            "Calculated using Ratcliff-Obershelp & Myers longest common subsequence: "
            "2 * (identical line matches) / (total lines Program A + total lines Program B). "
            "Note: Lexical or line similarity is not proof of semantic functional equivalence."
        ),
        "line_statistics": {
            "total_lines_a": len(lines_a),
            "total_lines_b": len(lines_b),
            "identical_lines": identical_lines_count,
            "modified_lines": modified_lines_count,
            "added_lines": added_lines_count,
            "removed_lines": removed_lines_count
        },
        "side_by_side_diff": side_by_side,
        "structural_differences": structural_differences,
        "program_a_summary": {
            "data_structures": ds_a,
            "algorithms": algo_a,
            "worst_case_complexity": comp_a.get("worst_case", "N/A"),
            "space_complexity": comp_a.get("space_complexity", "N/A")
        },
        "program_b_summary": {
            "data_structures": ds_b,
            "algorithms": algo_b,
            "worst_case_complexity": comp_b.get("worst_case", "N/A"),
            "space_complexity": comp_b.get("space_complexity", "N/A")
        }
    }
