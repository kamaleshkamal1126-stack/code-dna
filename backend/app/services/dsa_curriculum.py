"""
CODE DNA 3.0 Comprehensive DSA Explorer Curriculum
Contains logically correct C implementations, beginner-friendly explanations,
example inputs, example outputs, dry-runs, and theoretical complexities.
"""

from typing import List, Dict, Any

DSA_CATEGORIES = [
    {
        "id": "arrays",
        "name": "Arrays",
        "description": "Contiguous memory allocations and constant-time index based data manipulation.",
        "icon": "Layers"
    },
    {
        "id": "linked-lists",
        "name": "Linked Lists",
        "description": "Dynamic node chains connected via pointers (Singly, Doubly, Circular).",
        "icon": "GitCommit"
    },
    {
        "id": "stacks",
        "name": "Stacks",
        "description": "Last-In First-Out (LIFO) structures with push, pop, and peek operations.",
        "icon": "Square"
    },
    {
        "id": "queues",
        "name": "Queues",
        "description": "First-In First-Out (FIFO) structures, circular buffers, and double-ended queues.",
        "icon": "AlignJustify"
    },
    {
        "id": "trees",
        "name": "Trees & BST",
        "description": "Hierarchical structures, binary search trees, and DFS/BFS tree traversals.",
        "icon": "GitFork"
    },
    {
        "id": "graphs",
        "name": "Graphs",
        "description": "Networks of vertices and edges, representations, BFS, DFS, and Dijkstra shortest paths.",
        "icon": "Share2"
    },
    {
        "id": "searching-sorting",
        "name": "Searching & Sorting",
        "description": "Fundamental algorithms from Linear/Binary Search to Quick Sort and Merge Sort.",
        "icon": "ArrowDownUp"
    },
    {
        "id": "hashing",
        "name": "Hashing",
        "description": "Direct addressing, hash functions, linear probing, and collision chaining.",
        "icon": "Hash"
    },
    {
        "id": "recursion-dp",
        "name": "Recursion & DP",
        "description": "Self-referencing recurrence, memoization tables, tabulation, and optimal substructure.",
        "icon": "Cpu"
    }
]

DSA_TOPICS: List[Dict[str, Any]] = [
    # --- ARRAYS ---
    {
        "id": "array-traversal",
        "category_id": "arrays",
        "title": "Array Traversal",
        "definition": "Visiting and processing each element in a contiguous array sequentially.",
        "explanation": "In C, arrays occupy a contiguous block of memory. To traverse an array, a loop counter starts at index 0 and advances one by one until the total size n is reached. Accessing each index arr[i] requires pointer arithmetic arr + i, taking constant time O(1).",
        "time_complexity": "O(n)",
        "space_complexity": "O(1)",
        "example_input": "Array: [10, 20, 30, 40, 50], Size: 5",
        "example_output": "10 20 30 40 50",
        "dry_run": (
            "1. Initialize i = 0.\n"
            "2. Iteration 0: i < 5 is true -> print arr[0] (10) -> i becomes 1.\n"
            "3. Iteration 1: i < 5 is true -> print arr[1] (20) -> i becomes 2.\n"
            "4. Continues until i = 5; loop condition 5 < 5 fails, program terminates."
        ),
        "c_code": """#include <stdio.h>

void traverseArray(int arr[], int n) {
    printf("Array Elements: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");
}

int main() {
    int arr[] = {10, 20, 30, 40, 50};
    int n = sizeof(arr) / sizeof(arr[0]);
    traverseArray(arr, n);
    return 0;
}"""
    },
    {
        "id": "array-insertion",
        "category_id": "arrays",
        "title": "Array Insertion",
        "definition": "Inserting a new element at a specific index by shifting existing elements rightward.",
        "explanation": "Because array memory is fixed and contiguous, inserting an element at index pos requires all elements from pos up to n-1 to be shifted one position to the right to make space for the new item.",
        "time_complexity": "O(n)",
        "space_complexity": "O(1)",
        "example_input": "Array: [1, 2, 4, 5], Insert 3 at position 2",
        "example_output": "1 2 3 4 5",
        "dry_run": (
            "1. Start shifting backwards from index 3 down to index 2.\n"
            "2. arr[4] = arr[3] (5 shifts to index 4).\n"
            "3. arr[3] = arr[2] (4 shifts to index 3).\n"
            "4. Insert 3 into vacant index 2.\n"
            "5. Size increases from 4 to 5."
        ),
        "c_code": """#include <stdio.h>

void insertAtPosition(int arr[], int *n, int element, int pos) {
    for (int i = *n; i > pos; i--) {
        arr[i] = arr[i - 1];
    }
    arr[pos] = element;
    (*n)++;
}

int main() {
    int arr[10] = {1, 2, 4, 5};
    int n = 4;
    insertAtPosition(arr, &n, 3, 2);
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    return 0;
}"""
    },

    # --- LINKED LISTS ---
    {
        "id": "singly-linked-list",
        "category_id": "linked-lists",
        "title": "Singly Linked List",
        "definition": "A linear collection of data nodes linked dynamically where each node points to the next node.",
        "explanation": "Unlike arrays, linked lists allocate memory per node on the heap using malloc(). Each struct Node holds the payload data and a pointer struct Node* next. The head pointer marks the beginning, and the tail points to NULL.",
        "time_complexity": "O(1) Insertion at head, O(n) Traversal & Search",
        "space_complexity": "O(n) auxiliary heap nodes",
        "example_input": "Insert 10, then 20, then 30 at beginning",
        "example_output": "30 -> 20 -> 10 -> NULL",
        "dry_run": (
            "1. Allocate Node with data=10, next=NULL. Head points to 10.\n"
            "2. Allocate Node with data=20, next points to old head (10). Head points to 20.\n"
            "3. Allocate Node with data=30, next points to 20. Head points to 30.\n"
            "4. Traversing prints 30 -> 20 -> 10 -> NULL."
        ),
        "c_code": """#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

void insertHead(struct Node** head, int val) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = val;
    newNode->next = *head;
    *head = newNode;
}

void printList(struct Node* head) {
    struct Node* temp = head;
    while (temp != NULL) {
        printf("%d -> ", temp->data);
        temp = temp->next;
    }
    printf("NULL\\n");
}

int main() {
    struct Node* head = NULL;
    insertHead(&head, 10);
    insertHead(&head, 20);
    insertHead(&head, 30);
    printList(head);
    return 0;
}"""
    },
    {
        "id": "doubly-linked-list",
        "category_id": "linked-lists",
        "title": "Doubly Linked List",
        "definition": "A two-way node chain containing both next and previous pointers.",
        "explanation": "Each node in a doubly linked list contains two pointers: next (forward traversal) and prev (backward traversal). This allows bidirectional movement and O(1) node deletion when a pointer to the target node is given.",
        "time_complexity": "O(1) Insert at head/tail, O(n) Traversal",
        "space_complexity": "O(n) with extra pointer overhead per node",
        "example_input": "Insert 5, 15, 25 at front",
        "example_output": "Forward: 25 <-> 15 <-> 5",
        "dry_run": (
            "1. Allocate Node(5): prev=NULL, next=NULL.\n"
            "2. Insert Node(15): newNode->next=head, head->prev=newNode, head=newNode.\n"
            "3. Insert Node(25): newNode->next=head, head->prev=newNode, head=newNode."
        ),
        "c_code": """#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* prev;
    struct Node* next;
};

void insertFront(struct Node** head, int val) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = val;
    newNode->prev = NULL;
    newNode->next = *head;
    if (*head != NULL) (*head)->prev = newNode;
    *head = newNode;
}

void display(struct Node* head) {
    struct Node* curr = head;
    while (curr) {
        printf("%d <-> ", curr->data);
        curr = curr->next;
    }
    printf("NULL\\n");
}

int main() {
    struct Node* head = NULL;
    insertFront(&head, 5);
    insertFront(&head, 15);
    insertFront(&head, 25);
    display(head);
    return 0;
}"""
    },

    # --- STACKS ---
    {
        "id": "stack-array",
        "category_id": "stacks",
        "title": "Stack (Array Implementation)",
        "definition": "LIFO collection managed using a fixed-size array and a top index pointer.",
        "explanation": "A stack follows Last-In First-Out. Elements are pushed onto the top and popped off the top. When top reaches MAX-1, pushing triggers an overflow. When top is -1, popping triggers an underflow.",
        "time_complexity": "O(1) for push, pop, and peek",
        "space_complexity": "O(MAX) static memory",
        "example_input": "Push 100, Push 200, Push 300, Pop()",
        "example_output": "Popped: 300, Current Top: 200",
        "dry_run": (
            "1. top starts at -1.\n"
            "2. push(100): top=0, stack[0]=100.\n"
            "3. push(200): top=1, stack[1]=200.\n"
            "4. push(300): top=2, stack[2]=300.\n"
            "5. pop(): returns stack[2]=300, top decrements to 1."
        ),
        "c_code": """#include <stdio.h>
#define MAX 5

int stack[MAX];
int top = -1;

void push(int val) {
    if (top == MAX - 1) {
        printf("Stack Overflow!\\n");
        return;
    }
    stack[++top] = val;
}

int pop() {
    if (top == -1) {
        printf("Stack Underflow!\\n");
        return -1;
    }
    return stack[top--];
}

int peek() {
    if (top == -1) return -1;
    return stack[top];
}

int main() {
    push(100);
    push(200);
    push(300);
    printf("Popped: %d\\n", pop());
    printf("Current Top: %d\\n", peek());
    return 0;
}"""
    },

    # --- QUEUES ---
    {
        "id": "circular-queue",
        "category_id": "queues",
        "title": "Circular Queue",
        "definition": "A FIFO queue where the last position is connected back to the first position using modulo arithmetic.",
        "explanation": "In standard linear queues, dequeued slots are wasted unless elements are shifted. A circular queue reuses freed space by wrapping indices around: rear = (rear + 1) % MAX and front = (front + 1) % MAX.",
        "time_complexity": "O(1) Enqueue, O(1) Dequeue",
        "space_complexity": "O(MAX) fixed memory",
        "example_input": "Enqueue 10, 20, 30, Dequeue, Enqueue 40, 50, 60 (wrap-around)",
        "example_output": "Elements served in strict FIFO sequence without memory waste",
        "dry_run": (
            "1. front = -1, rear = -1.\n"
            "2. enqueue(10): front=0, rear=0.\n"
            "3. enqueue(20): rear=1; enqueue(30): rear=2.\n"
            "4. dequeue(): front advances to 1, slot 0 is now reusable.\n"
            "5. Next enqueue wraps rear around using (rear + 1) % MAX."
        ),
        "c_code": """#include <stdio.h>
#define MAX 5

int q[MAX];
int front = -1, rear = -1;

void enqueue(int val) {
    if ((rear + 1) % MAX == front) {
        printf("Queue is Full!\\n");
        return;
    }
    if (front == -1) front = 0;
    rear = (rear + 1) % MAX;
    q[rear] = val;
}

int dequeue() {
    if (front == -1) {
        printf("Queue is Empty!\\n");
        return -1;
    }
    int val = q[front];
    if (front == rear) {
        front = -1;
        rear = -1;
    } else {
        front = (front + 1) % MAX;
    }
    return val;
}

int main() {
    enqueue(10);
    enqueue(20);
    enqueue(30);
    printf("Dequeued: %d\\n", dequeue());
    enqueue(40);
    return 0;
}"""
    },

    # --- TREES & BST ---
    {
        "id": "binary-search-tree",
        "category_id": "trees",
        "title": "Binary Search Tree (BST)",
        "definition": "A binary tree where keys in the left subtree are smaller than the root, and keys in the right subtree are greater.",
        "explanation": "Binary Search Trees provide fast logarithmic lookup and insertion by maintaining the binary search invariant at every node. An inorder traversal (Left-Root-Right) of a BST outputs elements in strictly sorted ascending order.",
        "time_complexity": "O(log n) average search/insert, O(n) worst case (skewed tree)",
        "space_complexity": "O(h) call stack memory where h is tree height",
        "example_input": "Insert keys: 50, 30, 70, 20, 40, 60, 80",
        "example_output": "Inorder traversal: 20 30 40 50 60 70 80",
        "dry_run": (
            "1. Insert 50 as root.\n"
            "2. Insert 30: 30 < 50 -> left child of 50.\n"
            "3. Insert 70: 70 > 50 -> right child of 50.\n"
            "4. Insert 20: 20 < 50, 20 < 30 -> left child of 30.\n"
            "5. Inorder traversal (Left, Root, Right) recursively visits nodes in sorted order."
        ),
        "c_code": """#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *left;
    struct Node *right;
};

struct Node* insertBST(struct Node* root, int val) {
    if (root == NULL) {
        struct Node* n = (struct Node*)malloc(sizeof(struct Node));
        n->data = val;
        n->left = n->right = NULL;
        return n;
    }
    if (val < root->data) {
        root->left = insertBST(root->left, val);
    } else if (val > root->data) {
        root->right = insertBST(root->right, val);
    }
    return root;
}

void inorder(struct Node* root) {
    if (root != NULL) {
        inorder(root->left);
        printf("%d ", root->data);
        inorder(root->right);
    }
}

int main() {
    struct Node* root = NULL;
    root = insertBST(root, 50);
    insertBST(root, 30);
    insertBST(root, 70);
    insertBST(root, 20);
    insertBST(root, 40);
    printf("Inorder Traversal: ");
    inorder(root);
    printf("\\n");
    return 0;
}"""
    },

    # --- SEARCHING & SORTING ---
    {
        "id": "binary-search",
        "category_id": "searching-sorting",
        "title": "Binary Search",
        "definition": "Efficient divide-and-conquer search algorithm on pre-sorted arrays.",
        "explanation": "Binary search compares the target value against the middle element of the array. If they match, the index is returned. If the target is smaller, the search continues in the left half; otherwise in the right half. The search space is cut in half at every step.",
        "time_complexity": "Best: O(1), Average: O(log n), Worst: O(log n)",
        "space_complexity": "O(1) iterative",
        "example_input": "Sorted Array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], Target: 23",
        "example_output": "Target 23 found at index 5",
        "dry_run": (
            "1. low = 0, high = 9.\n"
            "2. Step 1: mid = (0 + 9)/2 = 4. arr[4] = 16. Target 23 > 16 -> low = 5.\n"
            "3. Step 2: mid = (5 + 9)/2 = 7. arr[7] = 56. Target 23 < 56 -> high = 6.\n"
            "4. Step 3: mid = (5 + 6)/2 = 5. arr[5] = 23. Match found! Return index 5."
        ),
        "c_code": """#include <stdio.h>

int binarySearch(int arr[], int n, int key) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == key) return mid;
        if (arr[mid] < key) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

int main() {
    int arr[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int n = sizeof(arr) / sizeof(arr[0]);
    int key = 23;
    int idx = binarySearch(arr, n, key);
    if (idx != -1) printf("Found %d at index %d\\n", key, idx);
    else printf("Not found\\n");
    return 0;
}"""
    },
    {
        "id": "quick-sort",
        "category_id": "searching-sorting",
        "title": "Quick Sort",
        "definition": "Fast divide-and-conquer sorting algorithm based on partitioning around a chosen pivot element.",
        "explanation": "QuickSort picks an element as pivot (e.g. the last element), partitions the array so all elements smaller than the pivot are placed before it and all greater elements after it, and recursively sorts the sub-arrays.",
        "time_complexity": "Best: O(n log n), Average: O(n log n), Worst: O(n^2)",
        "space_complexity": "O(log n) auxiliary call stack",
        "example_input": "Array: [10, 80, 30, 90, 40, 50, 70]",
        "example_output": "Sorted: [10, 30, 40, 50, 70, 80, 90]",
        "dry_run": (
            "1. Pivot = 70. Partition scans array.\n"
            "2. Elements <= 70 (10, 30, 40, 50) placed left of pivot.\n"
            "3. Elements > 70 (80, 90) placed right of pivot.\n"
            "4. Pivot 70 placed at index 4.\n"
            "5. Recursively sort sub-arrays [10, 30, 40, 50] and [80, 90]."
        ),
        "c_code": """#include <stdio.h>

void swap(int *a, int *b) {
    int t = *a; *a = *b; *b = t;
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int main() {
    int arr[] = {10, 80, 30, 90, 40, 50, 70};
    int n = sizeof(arr) / sizeof(arr[0]);
    quickSort(arr, 0, n - 1);
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    printf("\\n");
    return 0;
}"""
    },

    # --- GRAPHS ---
    {
        "id": "dijkstra-shortest-path",
        "category_id": "graphs",
        "title": "Dijkstra's Shortest Path",
        "definition": "Greedy graph algorithm finding minimum weight path from a source vertex to all vertices in a weighted graph.",
        "explanation": "Dijkstra maintains a distance array dist[] initialized to infinity except dist[source]=0. At each step, it selects the unvisited vertex with the minimum known distance, marks it visited, and relaxes the distances of all adjacent vertices.",
        "time_complexity": "O(V^2) with Adjacency Matrix, O((V + E) log V) with Min-Heap",
        "space_complexity": "O(V) for distance and visited arrays",
        "example_input": "5 vertices, Source = 0",
        "example_output": "Vertex 0 -> 0, Vertex 1 -> 4, Vertex 2 -> 12, Vertex 3 -> 19, Vertex 4 -> 21",
        "dry_run": (
            "1. dist = [0, inf, inf, inf, inf], visited = [F, F, F, F, F].\n"
            "2. Pick u=0 (dist=0). Relax neighbors 1 (dist=4) and 2 (dist=12).\n"
            "3. Next pick u=1 (dist=4). Relax neighbors.\n"
            "4. Continues until all V vertices are visited and shortest paths finalized."
        ),
        "c_code": """#include <stdio.h>
#include <stdbool.h>
#define V 5
#define INF 999999

int minDistance(int dist[], bool visited[]) {
    int min = INF, min_index = -1;
    for (int v = 0; v < V; v++) {
        if (!visited[v] && dist[v] <= min) {
            min = dist[v];
            min_index = v;
        }
    }
    return min_index;
}

void dijkstra(int graph[V][V], int src) {
    int dist[V];
    bool visited[V];
    for (int i = 0; i < V; i++) {
        dist[i] = INF;
        visited[i] = false;
    }
    dist[src] = 0;

    for (int count = 0; count < V - 1; count++) {
        int u = minDistance(dist, visited);
        visited[u] = true;
        for (int v = 0; v < V; v++) {
            if (!visited[v] && graph[u][v] && dist[u] != INF && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
            }
        }
    }

    printf("Vertex \\t Distance from Source\\n");
    for (int i = 0; i < V; i++) printf("%d \\t %d\\n", i, dist[i]);
}

int main() {
    int graph[V][V] = {
        {0, 4, 12, 0, 0},
        {4, 0, 8, 15, 0},
        {12, 8, 0, 7, 9},
        {0, 15, 7, 0, 2},
        {0, 0, 9, 2, 0}
    };
    dijkstra(graph, 0);
    return 0;
}"""
    },

    # --- RECURSION & DP ---
    {
        "id": "fibonacci-memoization",
        "category_id": "recursion-dp",
        "title": "Fibonacci with Memoization (DP)",
        "definition": "Optimizing exponential recursive Fibonacci computation to linear time by caching overlapping subproblem results.",
        "explanation": "Naive recursive Fibonacci computes fib(n-1) + fib(n-2) with O(2^n) time complexity due to redundant recomputations. Memoization stores computed values in a lookup table memo[], cutting work down to O(n).",
        "time_complexity": "Naive: O(2^n), Memoized DP: O(n)",
        "space_complexity": "O(n) for cache array and recursion stack",
        "example_input": "n = 10",
        "example_output": "Fibonacci(10) = 55",
        "dry_run": (
            "1. Initialize memo array with -1.\n"
            "2. fib(10) calls fib(9) and fib(8).\n"
            "3. Once fib(8) is computed during fib(9)'s subtree, it is stored in memo[8].\n"
            "4. When the right branch needs fib(8), it returns memo[8] in O(1) time without re-evaluating."
        ),
        "c_code": """#include <stdio.h>
#define MAX 100

long long memo[MAX];

long long fibMemo(int n) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    memo[n] = fibMemo(n - 1) + fibMemo(n - 2);
    return memo[n];
}

int main() {
    for (int i = 0; i < MAX; i++) memo[i] = -1;
    int n = 10;
    printf("Fibonacci(%d) = %lld\\n", n, fibMemo(n));
    return 0;
}"""
    }
]

def get_categories():
    return DSA_CATEGORIES

def get_topics(category_id: str = None):
    if category_id:
        return [t for t in DSA_TOPICS if t["category_id"] == category_id]
    return DSA_TOPICS

def get_topic_by_id(topic_id: str):
    for t in DSA_TOPICS:
        if t["id"] == topic_id:
            return t
    return None
