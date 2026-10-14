#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <assert.h>
#include "../src/analyzer.h"
#include "../src/structures.h"
#include "../src/algorithms.h"
#include "../src/complexity.h"

static int tests_run = 0;
static int tests_passed = 0;

#define TEST_ASSERT(cond, msg) do { \
    tests_run++; \
    if (cond) { \
        tests_passed++; \
        printf("  [PASS] %s\n", msg); \
    } else { \
        printf("  [FAIL] %s\n", msg); \
    } \
} while(0)

void test_bracket_balance() {
    printf("Running Bracket Balance Tests...\n");
    CodeStats stats;
    
    // Test 1: Balanced brackets
    const char *balanced_code = "int main() { int arr[10]; return 0; }";
    analyze_source_code(balanced_code, &stats);
    TEST_ASSERT(stats.paren_balanced == true, "Balanced parentheses check");
    TEST_ASSERT(stats.brace_balanced == true, "Balanced curly braces check");
    TEST_ASSERT(stats.bracket_balanced == true, "Balanced square brackets check");
    
    // Test 2: Unbalanced parenthesis
    const char *unbalanced_code = "int main() { if (x > 0 { return 1; } }";
    analyze_source_code(unbalanced_code, &stats);
    TEST_ASSERT(stats.paren_balanced == false, "Unbalanced parentheses detected correctly");
    TEST_ASSERT(stats.suspicious_issues_count > 0, "Suspicious issue flagged for unbalanced paren");
}

void test_data_structure_detection() {
    printf("Running Data Structure Detection Tests...\n");
    
    // Singly Linked List code
    const char *sll_code = 
        "#include <stdio.h>\n"
        "#include <stdlib.h>\n"
        "struct Node { int data; struct Node* next; };\n"
        "void insert(struct Node** head, int val) {\n"
        "    struct Node* n = (struct Node*)malloc(sizeof(struct Node));\n"
        "    n->data = val; n->next = *head; *head = n;\n"
        "}\n";
    CodeStats stats;
    DataStructureReport ds_rep;
    analyze_source_code(sll_code, &stats);
    detect_data_structures(sll_code, &stats, &ds_rep);
    
    bool found_sll = false;
    for (int i = 0; i < ds_rep.count; i++) {
        if (strstr(ds_rep.items[i].name, "Linked List") != NULL) found_sll = true;
    }
    TEST_ASSERT(found_sll, "Detected Singly Linked List pattern in struct Node");
    
    // Stack code
    const char *stack_code = 
        "int stack[100]; int top = -1;\n"
        "void push(int x) { stack[++top] = x; }\n"
        "int pop() { return stack[top--]; }\n";
    analyze_source_code(stack_code, &stats);
    detect_data_structures(stack_code, &stats, &ds_rep);
    
    bool found_stack = false;
    for (int i = 0; i < ds_rep.count; i++) {
        if (strstr(ds_rep.items[i].name, "Stack") != NULL) found_stack = true;
    }
    TEST_ASSERT(found_stack, "Detected Stack structure from push/pop and top");
    
    // Binary Tree code
    const char *tree_code = 
        "struct TreeNode { int val; struct TreeNode *left; struct TreeNode *right; };\n";
    analyze_source_code(tree_code, &stats);
    detect_data_structures(tree_code, &stats, &ds_rep);
    
    bool found_tree = false;
    for (int i = 0; i < ds_rep.count; i++) {
        if (strstr(ds_rep.items[i].name, "Binary Tree") != NULL) found_tree = true;
    }
    TEST_ASSERT(found_tree, "Detected Binary Tree left/right child pointers");
}

void test_algorithm_detection() {
    printf("Running Algorithm Detection Tests...\n");
    CodeStats stats;
    AlgorithmReport algo_rep;
    
    // Binary Search
    const char *bs_code = 
        "int binarySearch(int arr[], int n, int key) {\n"
        "    int low = 0, high = n - 1;\n"
        "    while (low <= high) {\n"
        "        int mid = (low + high) / 2;\n"
        "        if (arr[mid] == key) return mid;\n"
        "        else if (arr[mid] < key) low = mid + 1;\n"
        "        else high = mid - 1;\n"
        "    }\n"
        "    return -1;\n"
        "}\n";
    analyze_source_code(bs_code, &stats);
    detect_algorithms(bs_code, &stats, &algo_rep);
    bool found_bs = false;
    for (int i = 0; i < algo_rep.count; i++) {
        if (strcmp(algo_rep.items[i].name, "Binary Search") == 0) found_bs = true;
    }
    TEST_ASSERT(found_bs, "Detected Binary Search with O(log n) time complexity");
    
    // Bubble Sort
    const char *bubble_code = 
        "void bubbleSort(int arr[], int n) {\n"
        "    for (int i = 0; i < n - 1; i++) {\n"
        "        for (int j = 0; j < n - i - 1; j++) {\n"
        "            if (arr[j] > arr[j + 1]) {\n"
        "                int temp = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = temp;\n"
        "            }\n"
        "        }\n"
        "    }\n"
        "}\n";
    analyze_source_code(bubble_code, &stats);
    detect_algorithms(bubble_code, &stats, &algo_rep);
    bool found_bubble = false;
    for (int i = 0; i < algo_rep.count; i++) {
        if (strcmp(algo_rep.items[i].name, "Bubble Sort") == 0) found_bubble = true;
    }
    TEST_ASSERT(found_bubble, "Detected Bubble Sort with adjacent swap arr[j] > arr[j+1]");
}

void test_complexity_estimation() {
    printf("Running Complexity Estimation Tests...\n");
    CodeStats stats;
    DataStructureReport ds_rep;
    AlgorithmReport algo_rep;
    ComplexityReport comp_rep;
    
    // Quadratic nested loop
    const char *quadratic_code = 
        "void matrixMult(int n) {\n"
        "    for (int i = 0; i < n; i++) {\n"
        "        for (int j = 0; j < n; j++) {\n"
        "            int val = i * j;\n"
        "        }\n"
        "    }\n"
        "}\n";
    analyze_source_code(quadratic_code, &stats);
    detect_data_structures(quadratic_code, &stats, &ds_rep);
    detect_algorithms(quadratic_code, &stats, &algo_rep);
    evaluate_complexity(&stats, &ds_rep, &algo_rep, &comp_rep);
    TEST_ASSERT(strcmp(comp_rep.worst_case, "O(n^2)") == 0, "Evaluated nested loops to O(n^2)");
    
    // Recursion test (Fibonacci)
    const char *fib_code = 
        "int fib(int n) {\n"
        "    if (n <= 1) return n;\n"
        "    return fib(n - 1) + fib(n - 2);\n"
        "}\n";
    analyze_source_code(fib_code, &stats);
    detect_data_structures(fib_code, &stats, &ds_rep);
    detect_algorithms(fib_code, &stats, &algo_rep);
    evaluate_complexity(&stats, &ds_rep, &algo_rep, &comp_rep);
    TEST_ASSERT(stats.recursive_patterns_count > 0, "Detected recursive calls in fib");
    TEST_ASSERT(strcmp(comp_rep.worst_case, "O(2^n)") == 0, "Evaluated dual recursive branches to O(2^n)");
}

int main() {
    printf("=== CODE DNA 3.0 C ENGINE TEST SUITE ===\n\n");
    test_bracket_balance();
    test_data_structure_detection();
    test_algorithm_detection();
    test_complexity_estimation();
    
    printf("\nTotal Tests Run: %d, Passed: %d\n", tests_run, tests_passed);
    if (tests_run == tests_passed) {
        printf("ALL C ENGINE TESTS PASSED!\n");
        return 0;
    } else {
        printf("SOME TESTS FAILED!\n");
        return 1;
    }
}
