#include "complexity.h"
#include <string.h>
#include <stdio.h>

void evaluate_complexity(
    const CodeStats *stats,
    const DataStructureReport *ds_report,
    const AlgorithmReport *algo_report,
    ComplexityReport *comp_report
) {
    (void)ds_report; // Reserved for structural space overhead heuristics
    if (!comp_report) return;
    memset(comp_report, 0, sizeof(ComplexityReport));
    
    // Set standard static-analysis caveat
    strncpy(comp_report->caveats,
            "Estimates are derived via static AST pattern recognition and conservative structural heuristics. "
            "Actual runtime behavior depends on input distribution, branch conditions, and data scale.",
            511);
    
    // 1. If high-confidence algorithm detected, use its verified canonical complexity
    for (int i = 0; i < algo_report->count; i++) {
        const DetectedAlgorithm *a = &algo_report->items[i];
        if (strcmp(a->confidence, "High") == 0) {
            // Priority: Sorting / Graph / Tree / Search algorithms
            if (strcmp(a->name, "Merge Sort") == 0 ||
                strcmp(a->name, "Quick Sort") == 0 ||
                strcmp(a->name, "Heap Sort") == 0 ||
                strcmp(a->name, "Bubble Sort") == 0 ||
                strcmp(a->name, "Selection Sort") == 0 ||
                strcmp(a->name, "Insertion Sort") == 0 ||
                strcmp(a->name, "Binary Search") == 0 ||
                strcmp(a->name, "Dijkstra's Shortest Path") == 0 ||
                strcmp(a->name, "Breadth-First Search (BFS)") == 0 ||
                strcmp(a->name, "Depth-First Search (DFS)") == 0) {
                
                strncpy(comp_report->best_case, a->best_case_time, 31);
                strncpy(comp_report->average_case, a->avg_case_time, 31);
                strncpy(comp_report->worst_case, a->worst_case_time, 31);
                strncpy(comp_report->space_complexity, a->space_complexity, 31);
                strncpy(comp_report->confidence, "High (Canonical DSA Match)", 31);
                comp_report->is_confident = true;
                
                snprintf(comp_report->reasoning, 1023,
                         "Recognized canonical %s implementation pattern. "
                         "Best Case: %s; Average Case: %s; Worst Case: %s; Auxiliary Space: %s. "
                         "Derived from standard algorithm characteristics and verified code structures.",
                         a->name, a->best_case_time, a->avg_case_time, a->worst_case_time, a->space_complexity);
                return;
            }
        }
    }
    
    // 2. Check for multi-branch recursive tree (e.g. Fibonacci: T(n) = T(n-1) + T(n-2) -> O(2^n))
    for (int f = 0; f < stats->function_count; f++) {
        if (stats->functions[f].is_recursive && stats->functions[f].recursive_calls_count >= 2) {
            strncpy(comp_report->best_case, "O(2^n)", 31);
            strncpy(comp_report->average_case, "O(2^n)", 31);
            strncpy(comp_report->worst_case, "O(2^n)", 31);
            strncpy(comp_report->space_complexity, "O(n)", 31);
            strncpy(comp_report->confidence, "Moderate (Exponential Tree)", 31);
            comp_report->is_confident = true;
            
            snprintf(comp_report->reasoning, 1023,
                     "Detected recursive function '%s' invoking itself %d times per activation without memoization. "
                     "Forms an exponential recursion tree with branching factor >= 2, yielding O(2^n) time complexity "
                     "and O(n) maximum call stack depth.",
                     stats->functions[f].name, stats->functions[f].recursive_calls_count);
            return;
        }
    }
    
    // 3. Single-branch recursion (e.g. Factorial: T(n) = T(n-1) + O(1) -> O(n))
    if (stats->recursive_patterns_count > 0 && stats->max_loop_nesting == 0) {
        strncpy(comp_report->best_case, "O(1)", 31);
        strncpy(comp_report->average_case, "O(n)", 31);
        strncpy(comp_report->worst_case, "O(n)", 31);
        strncpy(comp_report->space_complexity, "O(n)", 31);
        strncpy(comp_report->confidence, "Moderate (Linear Recursion)", 31);
        comp_report->is_confident = true;
        
        snprintf(comp_report->reasoning, 1023,
                 "Detected linear recursive pattern with single self-call per activation. "
                 "Decrements input until base case is reached, executing O(n) calls with O(n) auxiliary call-stack frames.");
        return;
    }
    
    // 4. Nested Loop Heuristics
    if (stats->max_loop_nesting >= 3) {
        strncpy(comp_report->best_case, "O(n^3)", 31);
        strncpy(comp_report->average_case, "O(n^3)", 31);
        strncpy(comp_report->worst_case, "O(n^3)", 31);
        strncpy(comp_report->space_complexity, "O(1)", 31);
        strncpy(comp_report->confidence, "Moderate (Deep Nesting)", 31);
        comp_report->is_confident = true;
        
        snprintf(comp_report->reasoning, 1023,
                 "Detected 3+ levels of nested iteration (max depth: %d). "
                 "Assuming each loop iterates proportional to input scale n, theoretical time complexity scales as O(n^3).",
                 stats->max_loop_nesting);
        return;
    } else if (stats->max_loop_nesting == 2) {
        strncpy(comp_report->best_case, "O(n)", 31);
        strncpy(comp_report->average_case, "O(n^2)", 31);
        strncpy(comp_report->worst_case, "O(n^2)", 31);
        strncpy(comp_report->space_complexity, "O(1)", 31);
        strncpy(comp_report->confidence, "Moderate (Nested Loops)", 31);
        comp_report->is_confident = true;
        
        snprintf(comp_report->reasoning, 1023,
                 "Detected quadratic nested loops (depth 2). "
                 "Outer and inner iterations scale proportionally to input size, yielding O(n^2) worst/average time complexity "
                 "with O(1) auxiliary memory.");
        return;
    } else if (stats->max_loop_nesting == 1) {
        strncpy(comp_report->best_case, "O(1)", 31);
        strncpy(comp_report->average_case, "O(n)", 31);
        strncpy(comp_report->worst_case, "O(n)", 31);
        strncpy(comp_report->space_complexity, "O(1)", 31);
        strncpy(comp_report->confidence, "Moderate (Single Loop)", 31);
        comp_report->is_confident = true;
        
        snprintf(comp_report->reasoning, 1023,
                 "Detected single non-nested loop structure. Traversal executes in linear time O(n) "
                 "with O(1) constant auxiliary space.");
        return;
    } else if (stats->loop_count == 0 && stats->recursive_patterns_count == 0 && stats->total_lines > 0) {
        // Pure sequential code
        strncpy(comp_report->best_case, "O(1)", 31);
        strncpy(comp_report->average_case, "O(1)", 31);
        strncpy(comp_report->worst_case, "O(1)", 31);
        strncpy(comp_report->space_complexity, "O(1)", 31);
        strncpy(comp_report->confidence, "High (Constant Time)", 31);
        comp_report->is_confident = true;
        
        snprintf(comp_report->reasoning, 1023,
                 "No looping statements or recursive invocations detected. "
                 "Program executes a fixed sequence of basic instructions in constant time O(1) and auxiliary space O(1).");
        return;
    }
    
    // 5. If ambiguous or indeterminate
    comp_report->is_confident = false;
    strncpy(comp_report->best_case, "Undetermined", 31);
    strncpy(comp_report->average_case, "Undetermined", 31);
    strncpy(comp_report->worst_case, "Undetermined", 31);
    strncpy(comp_report->space_complexity, "Undetermined", 31);
    strncpy(comp_report->confidence, "Low / Inferred", 31);
    strncpy(comp_report->reasoning,
            "Complexity could not be determined confidently. Manual review is recommended. "
            "Code features irregular control flow, dynamic jumps, or fragmented syntax.", 1023);
}
