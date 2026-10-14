#include "algorithms.h"
#include <string.h>
#include <ctype.h>

static bool contains_word(const char *source, const char *word) {
    if (!source || !word) return false;
    const char *pos = source;
    size_t wlen = strlen(word);
    
    while ((pos = strstr(pos, word)) != NULL) {
        bool start_ok = (pos == source || (!isalnum((unsigned char)*(pos - 1)) && *(pos - 1) != '_'));
        bool end_ok = (!isalnum((unsigned char)*(pos + wlen)) && *(pos + wlen) != '_');
        if (start_ok && end_ok) return true;
        pos += wlen;
    }
    return false;
}

static bool contains_sub(const char *source, const char *sub) {
    return (source && sub && strstr(source, sub) != NULL);
}

void detect_algorithms(const char *source, const CodeStats *stats, AlgorithmReport *report) {
    if (!source || !report) return;
    report->count = 0;
    
    // 1. Binary Search
    bool has_mid = contains_sub(source, "low + high") || contains_sub(source, "low + (high - low)") || contains_sub(source, "(l + r) / 2") || contains_sub(source, "(low + high)/2");
    bool has_binary_bounds = (contains_sub(source, "low <= high") || contains_sub(source, "l <= r") || contains_sub(source, "low < high"));
    bool has_binary_shifts = (contains_sub(source, "low = mid + 1") || contains_sub(source, "high = mid - 1") || contains_sub(source, "l = m + 1") || contains_sub(source, "r = m - 1"));
    if ((has_mid && has_binary_bounds) || (has_binary_bounds && has_binary_shifts) || contains_word(source, "binarySearch")) {
        DetectedAlgorithm *algo = &report->items[report->count++];
        strncpy(algo->name, "Binary Search", 63);
        strncpy(algo->category, "Searching", 63);
        algo->detected = true;
        strncpy(algo->confidence, (has_mid && has_binary_shifts) ? "High" : "Medium", 31);
        strncpy(algo->explanation, "Divides sorted search interval repeatedly in half by comparing query with the midpoint element.", MAX_ALGO_STR - 1);
        strncpy(algo->best_case_time, "O(1)", 31);
        strncpy(algo->avg_case_time, "O(log n)", 31);
        strncpy(algo->worst_case_time, "O(log n)", 31);
        strncpy(algo->space_complexity, "O(1)", 31);
        strncpy(algo->indicators, "Midpoint calculation mid = (low + high)/2 and interval halving bounds adjustment.", MAX_ALGO_STR - 1);
        algo->line_hint = 1;
    }
    
    // 2. Linear Search
    bool has_linear_check = (contains_sub(source, "== key") || contains_sub(source, "== target") || contains_sub(source, "== x")) && stats->loop_count > 0;
    if ((has_linear_check && !has_mid) || contains_word(source, "linearSearch")) {
        DetectedAlgorithm *algo = &report->items[report->count++];
        strncpy(algo->name, "Linear Search", 63);
        strncpy(algo->category, "Searching", 63);
        algo->detected = true;
        strncpy(algo->confidence, "High", 31);
        strncpy(algo->explanation, "Sequentially checks each element in the collection until target match is found or end is reached.", MAX_ALGO_STR - 1);
        strncpy(algo->best_case_time, "O(1)", 31);
        strncpy(algo->avg_case_time, "O(n)", 31);
        strncpy(algo->worst_case_time, "O(n)", 31);
        strncpy(algo->space_complexity, "O(1)", 31);
        strncpy(algo->indicators, "Single loop iteration with equality check arr[i] == target.", MAX_ALGO_STR - 1);
        algo->line_hint = 1;
    }
    
    // 3. Bubble Sort
    bool has_bubble_swap = contains_sub(source, "[j] > ") && (contains_sub(source, "[j + 1]") || contains_sub(source, "[j+1]"));
    if (has_bubble_swap || contains_word(source, "bubbleSort")) {
        DetectedAlgorithm *algo = &report->items[report->count++];
        strncpy(algo->name, "Bubble Sort", 63);
        strncpy(algo->category, "Sorting", 63);
        algo->detected = true;
        strncpy(algo->confidence, "High", 31);
        strncpy(algo->explanation, "Repeatedly steps through list, compares adjacent elements, and swaps them if they are in the wrong order.", MAX_ALGO_STR - 1);
        strncpy(algo->best_case_time, "O(n)", 31);
        strncpy(algo->avg_case_time, "O(n^2)", 31);
        strncpy(algo->worst_case_time, "O(n^2)", 31);
        strncpy(algo->space_complexity, "O(1)", 31);
        strncpy(algo->indicators, "Nested iteration comparing adjacent indices (arr[j] > arr[j+1]) and swapping.", MAX_ALGO_STR - 1);
        algo->line_hint = 1;
    }
    
    // 4. Selection Sort
    bool has_min_idx = contains_word(source, "min_idx") || contains_word(source, "minIndex") || contains_word(source, "min_pos");
    if ((has_min_idx && stats->max_loop_nesting >= 2) || contains_word(source, "selectionSort")) {
        DetectedAlgorithm *algo = &report->items[report->count++];
        strncpy(algo->name, "Selection Sort", 63);
        strncpy(algo->category, "Sorting", 63);
        algo->detected = true;
        strncpy(algo->confidence, "High", 31);
        strncpy(algo->explanation, "Divides array into sorted and unsorted subarrays; repeatedly finds minimum element from unsorted part and places it at the front.", MAX_ALGO_STR - 1);
        strncpy(algo->best_case_time, "O(n^2)", 31);
        strncpy(algo->avg_case_time, "O(n^2)", 31);
        strncpy(algo->worst_case_time, "O(n^2)", 31);
        strncpy(algo->space_complexity, "O(1)", 31);
        strncpy(algo->indicators, "Tracking minimum element index (min_idx) across inner loop and swap at outer loop.", MAX_ALGO_STR - 1);
        algo->line_hint = 1;
    }
    
    // 5. Insertion Sort
    bool has_insertion_key = contains_sub(source, "key = arr[i]") || contains_sub(source, "key = a[i]") || (contains_word(source, "key") && contains_sub(source, "arr[j + 1] = arr[j]"));
    if (has_insertion_key || contains_word(source, "insertionSort")) {
        DetectedAlgorithm *algo = &report->items[report->count++];
        strncpy(algo->name, "Insertion Sort", 63);
        strncpy(algo->category, "Sorting", 63);
        algo->detected = true;
        strncpy(algo->confidence, "High", 31);
        strncpy(algo->explanation, "Builds sorted array one item at a time by picking current element and shifting greater elements rightward.", MAX_ALGO_STR - 1);
        strncpy(algo->best_case_time, "O(n)", 31);
        strncpy(algo->avg_case_time, "O(n^2)", 31);
        strncpy(algo->worst_case_time, "O(n^2)", 31);
        strncpy(algo->space_complexity, "O(1)", 31);
        strncpy(algo->indicators, "Key element extraction and backwards element shifting while (j >= 0 && arr[j] > key).", MAX_ALGO_STR - 1);
        algo->line_hint = 1;
    }
    
    // 6. Merge Sort
    bool has_merge_fn = contains_word(source, "merge") && (contains_word(source, "mergeSort") || stats->recursive_patterns_count > 0);
    if (has_merge_fn || contains_word(source, "mergeSort")) {
        DetectedAlgorithm *algo = &report->items[report->count++];
        strncpy(algo->name, "Merge Sort", 63);
        strncpy(algo->category, "Sorting", 63);
        algo->detected = true;
        strncpy(algo->confidence, "High", 31);
        strncpy(algo->explanation, "Divide-and-conquer sorting algorithm that splits array into halves, recursively sorts them, and merges sorted sub-arrays.", MAX_ALGO_STR - 1);
        strncpy(algo->best_case_time, "O(n log n)", 31);
        strncpy(algo->avg_case_time, "O(n log n)", 31);
        strncpy(algo->worst_case_time, "O(n log n)", 31);
        strncpy(algo->space_complexity, "O(n)", 31);
        strncpy(algo->indicators, "merge() subroutine combining two halves and recursive division mergeSort(arr, l, r).", MAX_ALGO_STR - 1);
        algo->line_hint = 1;
    }
    
    // 7. Quick Sort
    bool has_partition = contains_word(source, "partition") || contains_word(source, "pivot");
    if ((has_partition && (contains_word(source, "quickSort") || stats->recursive_patterns_count > 0)) || contains_word(source, "quickSort")) {
        DetectedAlgorithm *algo = &report->items[report->count++];
        strncpy(algo->name, "Quick Sort", 63);
        strncpy(algo->category, "Sorting", 63);
        algo->detected = true;
        strncpy(algo->confidence, "High", 31);
        strncpy(algo->explanation, "Divide-and-conquer sorting algorithm that selects a pivot element and partitions array around pivot, recursively sorting partitions.", MAX_ALGO_STR - 1);
        strncpy(algo->best_case_time, "O(n log n)", 31);
        strncpy(algo->avg_case_time, "O(n log n)", 31);
        strncpy(algo->worst_case_time, "O(n^2)", 31);
        strncpy(algo->space_complexity, "O(log n)", 31);
        strncpy(algo->indicators, "partition() subroutine with pivot selection and recursive quickSort calls.", MAX_ALGO_STR - 1);
        algo->line_hint = 1;
    }
    
    // 8. Heap Sort
    if (contains_word(source, "heapSort") || (contains_word(source, "heapify") && contains_sub(source, "for (int i = n - 1"))) {
        DetectedAlgorithm *algo = &report->items[report->count++];
        strncpy(algo->name, "Heap Sort", 63);
        strncpy(algo->category, "Sorting", 63);
        algo->detected = true;
        strncpy(algo->confidence, "High", 31);
        strncpy(algo->explanation, "Comparison-based sorting utilizing binary heap to extract max/min element repeatedly and reheapify remaining tree.", MAX_ALGO_STR - 1);
        strncpy(algo->best_case_time, "O(n log n)", 31);
        strncpy(algo->avg_case_time, "O(n log n)", 31);
        strncpy(algo->worst_case_time, "O(n log n)", 31);
        strncpy(algo->space_complexity, "O(1)", 31);
        strncpy(algo->indicators, "heapify() procedures and extraction loop from n-1 down to 0.", MAX_ALGO_STR - 1);
        algo->line_hint = 1;
    }
    
    // 9. Tree Traversals
    bool has_inorder = contains_word(source, "inorder") || contains_word(source, "inOrder");
    bool has_preorder = contains_word(source, "preorder") || contains_word(source, "preOrder");
    bool has_postorder = contains_word(source, "postorder") || contains_word(source, "postOrder");
    if (has_inorder || has_preorder || has_postorder) {
        DetectedAlgorithm *algo = &report->items[report->count++];
        strncpy(algo->name, "Binary Tree Traversal (DFS)", 63);
        strncpy(algo->category, "Trees", 63);
        algo->detected = true;
        strncpy(algo->confidence, "High", 31);
        strncpy(algo->explanation, "Depth-first recursive traversal of binary tree hierarchy (Inorder: L-N-R, Preorder: N-L-R, Postorder: L-R-N).", MAX_ALGO_STR - 1);
        strncpy(algo->best_case_time, "O(n)", 31);
        strncpy(algo->avg_case_time, "O(n)", 31);
        strncpy(algo->worst_case_time, "O(n)", 31);
        strncpy(algo->space_complexity, "O(h)", 31);
        strncpy(algo->indicators, "Recursive sub-tree traversal routines (inorder/preorder/postorder).", MAX_ALGO_STR - 1);
        algo->line_hint = 1;
    }
    
    // 10. BST Insertion & Search
    bool has_bst_insert = contains_word(source, "insertBST") || (contains_word(source, "insert") && contains_sub(source, "root->left"));
    bool has_bst_search = contains_word(source, "searchBST") || (contains_word(source, "search") && contains_sub(source, "root->data"));
    if (has_bst_insert || has_bst_search) {
        DetectedAlgorithm *algo = &report->items[report->count++];
        strncpy(algo->name, "BST Insertion / Search", 63);
        strncpy(algo->category, "Trees", 63);
        algo->detected = true;
        strncpy(algo->confidence, "High", 31);
        strncpy(algo->explanation, "Navigates binary search tree ordering invariants to locate, insert, or delete nodes in logarithmic expected time.", MAX_ALGO_STR - 1);
        strncpy(algo->best_case_time, "O(1)", 31);
        strncpy(algo->avg_case_time, "O(log n)", 31);
        strncpy(algo->worst_case_time, "O(n)", 31);
        strncpy(algo->space_complexity, "O(h)", 31);
        strncpy(algo->indicators, "Left/right branch routing based on key comparisons root->data.", MAX_ALGO_STR - 1);
        algo->line_hint = 1;
    }
    
    // 11. Graph BFS (Breadth-First Search)
    bool has_bfs = contains_word(source, "bfs") || contains_word(source, "BFS") || contains_word(source, "breadthFirstSearch");
    if (has_bfs) {
        DetectedAlgorithm *algo = &report->items[report->count++];
        strncpy(algo->name, "Breadth-First Search (BFS)", 63);
        strncpy(algo->category, "Graphs", 63);
        algo->detected = true;
        strncpy(algo->confidence, "High", 31);
        strncpy(algo->explanation, "Level-order traversal exploring all neighbor nodes at current depth before moving to nodes at the next depth level using a queue.", MAX_ALGO_STR - 1);
        strncpy(algo->best_case_time, "O(V + E)", 31);
        strncpy(algo->avg_case_time, "O(V + E)", 31);
        strncpy(algo->worst_case_time, "O(V + E)", 31);
        strncpy(algo->space_complexity, "O(V)", 31);
        strncpy(algo->indicators, "Queue usage with visited vertex marking and neighbor loop exploration.", MAX_ALGO_STR - 1);
        algo->line_hint = 1;
    }
    
    // 12. Graph DFS (Depth-First Search)
    bool has_dfs = contains_word(source, "dfs") || contains_word(source, "DFS") || contains_word(source, "depthFirstSearch");
    if (has_dfs) {
        DetectedAlgorithm *algo = &report->items[report->count++];
        strncpy(algo->name, "Depth-First Search (DFS)", 63);
        strncpy(algo->category, "Graphs", 63);
        algo->detected = true;
        strncpy(algo->confidence, "High", 31);
        strncpy(algo->explanation, "Explores as far as possible along each branch before backtracking, utilizing recursion or explicit stack with visited states.", MAX_ALGO_STR - 1);
        strncpy(algo->best_case_time, "O(V + E)", 31);
        strncpy(algo->avg_case_time, "O(V + E)", 31);
        strncpy(algo->worst_case_time, "O(V + E)", 31);
        strncpy(algo->space_complexity, "O(V)", 31);
        strncpy(algo->indicators, "Recursive or stack exploration of vertices marked via visited[].", MAX_ALGO_STR - 1);
        algo->line_hint = 1;
    }
    
    // 13. Dijkstra Shortest Path
    bool has_dijkstra = contains_word(source, "dijkstra") || contains_word(source, "Dijkstra") ||
                         (contains_sub(source, "dist[") && contains_sub(source, "dist[u] + graph[u][v]"));
    if (has_dijkstra) {
        DetectedAlgorithm *algo = &report->items[report->count++];
        strncpy(algo->name, "Dijkstra's Shortest Path", 63);
        strncpy(algo->category, "Graphs", 63);
        algo->detected = true;
        strncpy(algo->confidence, "High", 31);
        strncpy(algo->explanation, "Computes shortest paths from single source vertex to all other vertices in a weighted graph with non-negative edge weights.", MAX_ALGO_STR - 1);
        strncpy(algo->best_case_time, "O(V^2)", 31);
        strncpy(algo->avg_case_time, "O(V^2)", 31);
        strncpy(algo->worst_case_time, "O(V^2)", 31);
        strncpy(algo->space_complexity, "O(V)", 31);
        strncpy(algo->indicators, "dist[] array relaxation: dist[v] = dist[u] + weight.", MAX_ALGO_STR - 1);
        algo->line_hint = 1;
    }
    
    // 14. Dynamic Programming (Tabulation / Memoization)
    bool has_dp = contains_sub(source, "dp[") || contains_word(source, "memo") || contains_word(source, "fibTable");
    if (has_dp && stats->loop_count > 0) {
        DetectedAlgorithm *algo = &report->items[report->count++];
        strncpy(algo->name, "Dynamic Programming Pattern", 63);
        strncpy(algo->category, "DP/Greedy", 63);
        algo->detected = true;
        strncpy(algo->confidence, "Medium", 31);
        strncpy(algo->explanation, "Solves complex problems by breaking them down into simpler overlapping subproblems and storing subproblem results in a dp array.", MAX_ALGO_STR - 1);
        strncpy(algo->best_case_time, "O(n)", 31);
        strncpy(algo->avg_case_time, "O(n)", 31);
        strncpy(algo->worst_case_time, "O(n)", 31);
        strncpy(algo->space_complexity, "O(n)", 31);
        strncpy(algo->indicators, "Lookup table array (dp[]) with state transition recurrence.", MAX_ALGO_STR - 1);
        algo->line_hint = 1;
    }
    
    // 15. Recursion
    if (stats->recursive_patterns_count > 0 && report->count < MAX_DETECTED_ALGORITHMS) {
        DetectedAlgorithm *algo = &report->items[report->count++];
        strncpy(algo->name, "Recursive Function Pattern", 63);
        strncpy(algo->category, "Recursion", 63);
        algo->detected = true;
        strncpy(algo->confidence, "High", 31);
        strncpy(algo->explanation, "Function invokes itself directly to solve smaller subproblem instances until terminating at base cases.", MAX_ALGO_STR - 1);
        strncpy(algo->best_case_time, "O(n)", 31);
        strncpy(algo->avg_case_time, "O(n)", 31);
        strncpy(algo->worst_case_time, "O(n)", 31);
        strncpy(algo->space_complexity, "O(n)", 31);
        strncpy(algo->indicators, "Self-referencing function calls detected in function body.", MAX_ALGO_STR - 1);
        algo->line_hint = 1;
    }
    
    // 16. Linked List Insertion / Deletion / Reversal
    bool has_ll_ops = contains_word(source, "insertAtBeginning") || contains_word(source, "insertAtEnd") ||
                      contains_word(source, "deleteNode") || contains_word(source, "reverseList") ||
                      contains_sub(source, "curr->next = prev");
    if (has_ll_ops) {
        DetectedAlgorithm *algo = &report->items[report->count++];
        strncpy(algo->name, "Linked List Operations", 63);
        strncpy(algo->category, "Linked Lists", 63);
        algo->detected = true;
        strncpy(algo->confidence, "High", 31);
        strncpy(algo->explanation, "Standard pointer updates for node insertion, deletion, or in-place pointer reversal.", MAX_ALGO_STR - 1);
        strncpy(algo->best_case_time, "O(1)", 31);
        strncpy(algo->avg_case_time, "O(n)", 31);
        strncpy(algo->worst_case_time, "O(n)", 31);
        strncpy(algo->space_complexity, "O(1)", 31);
        strncpy(algo->indicators, "Pointer reassignments (prev, curr, next) traversing node chain.", MAX_ALGO_STR - 1);
        algo->line_hint = 1;
    }
}
