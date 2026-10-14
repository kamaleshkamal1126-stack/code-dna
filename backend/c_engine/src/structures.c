#include "structures.h"
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

void detect_data_structures(const char *source, const CodeStats *stats, DataStructureReport *report) {
    if (!source || !report) return;
    report->count = 0;
    
    // 1. Singly Linked List
    bool has_next_ptr = contains_sub(source, "->next") || contains_sub(source, "*next") || contains_sub(source, "-> next");
    bool has_prev_ptr = contains_sub(source, "->prev") || contains_sub(source, "*prev") || contains_sub(source, "-> prev");
    bool has_struct_node = contains_sub(source, "struct Node") || contains_sub(source, "struct node") || contains_sub(source, "Node*");
    
    // 2. Doubly Linked List
    if (has_next_ptr && has_prev_ptr) {
        DetectedDataStructure *ds = &report->items[report->count++];
        strncpy(ds->name, "Doubly Linked List", 63);
        strncpy(ds->category, "Linked Lists", 63);
        ds->detected = true;
        strncpy(ds->confidence, "High", 31);
        strncpy(ds->explanation, "Detected self-referential node structure featuring both bidirectional pointers ('next' and 'prev') enabling forward and backward traversals.", MAX_DESC_STR - 1);
        strncpy(ds->indicators, "struct Node with 'next' and 'prev' pointer dereferences (e.g. node->prev, node->next).", MAX_DESC_STR - 1);
        ds->line_hint = 1;
    } else if (has_next_ptr) {
        // Singly Linked List or Circular Linked List
        bool is_circular = contains_sub(source, "tail->next = head") ||
                           contains_sub(source, "last->next = head") ||
                           contains_sub(source, "temp != head") ||
                           contains_word(source, "circular");
        
        if (is_circular) {
            DetectedDataStructure *ds = &report->items[report->count++];
            strncpy(ds->name, "Circular Linked List", 63);
            strncpy(ds->category, "Linked Lists", 63);
            ds->detected = true;
            strncpy(ds->confidence, "High", 31);
            strncpy(ds->explanation, "Detected linked list structure where the tail node reconnects back to the head node or loop checks termination against head pointer.", MAX_DESC_STR - 1);
            strncpy(ds->indicators, "Tail connecting to head (tail->next = head) or loop while (ptr != head).", MAX_DESC_STR - 1);
            ds->line_hint = 1;
        } else {
            DetectedDataStructure *ds = &report->items[report->count++];
            strncpy(ds->name, "Singly Linked List", 63);
            strncpy(ds->category, "Linked Lists", 63);
            ds->detected = true;
            strncpy(ds->confidence, has_struct_node ? "High" : "Medium", 31);
            strncpy(ds->explanation, "Detected self-referential linear node chain linked via single directional 'next' pointers with dynamic allocation.", MAX_DESC_STR - 1);
            strncpy(ds->indicators, "Struct node with 'next' pointer dereferences and pointer traversals.", MAX_DESC_STR - 1);
            ds->line_hint = 1;
        }
    }
    
    // 3. Binary Tree & Binary Search Tree
    bool has_left = contains_sub(source, "->left") || contains_sub(source, "*left");
    bool has_right = contains_sub(source, "->right") || contains_sub(source, "*right");
    if (has_left && has_right) {
        bool has_bst_compare = (contains_sub(source, "< root->") || contains_sub(source, "> root->") ||
                                contains_sub(source, "< node->") || contains_sub(source, "> node->") ||
                                contains_word(source, "bst") || contains_word(source, "BST"));
        if (has_bst_compare) {
            DetectedDataStructure *ds = &report->items[report->count++];
            strncpy(ds->name, "Binary Search Tree (BST)", 63);
            strncpy(ds->category, "Trees", 63);
            ds->detected = true;
            strncpy(ds->confidence, "High", 31);
            strncpy(ds->explanation, "Detected hierarchical binary tree with left and right child pointers paired with ordering comparisons (val < root->data) characteristic of BSTs.", MAX_DESC_STR - 1);
            strncpy(ds->indicators, "Node pointers 'left' and 'right' combined with key ordering branches.", MAX_DESC_STR - 1);
            ds->line_hint = 1;
        } else {
            DetectedDataStructure *ds = &report->items[report->count++];
            strncpy(ds->name, "Binary Tree", 63);
            strncpy(ds->category, "Trees", 63);
            ds->detected = true;
            strncpy(ds->confidence, "High", 31);
            strncpy(ds->explanation, "Detected non-linear hierarchical node structure with left and right subtrees.", MAX_DESC_STR - 1);
            strncpy(ds->indicators, "Pointers to left and right child nodes (e.g. node->left, node->right).", MAX_DESC_STR - 1);
            ds->line_hint = 1;
        }
    }
    
    // 4. Stack
    bool has_push = contains_word(source, "push");
    bool has_pop = contains_word(source, "pop");
    bool has_top = contains_word(source, "top") || contains_sub(source, "->top");
    if ((has_push && has_pop) || (has_top && (has_push || has_pop))) {
        DetectedDataStructure *ds = &report->items[report->count++];
        strncpy(ds->name, "Stack (LIFO)", 63);
        strncpy(ds->category, "Stacks", 63);
        ds->detected = true;
        strncpy(ds->confidence, (has_push && has_pop && has_top) ? "High" : "Medium", 31);
        strncpy(ds->explanation, "Detected Last-In-First-Out (LIFO) data structure with standard push/pop access semantics and top tracking index.", MAX_DESC_STR - 1);
        strncpy(ds->indicators, "Functions push(), pop(), and top stack-pointer management.", MAX_DESC_STR - 1);
        ds->line_hint = 1;
    }
    
    // 5. Queue & Circular Queue
    bool has_enqueue = contains_word(source, "enqueue") || contains_word(source, "insertQueue");
    bool has_dequeue = contains_word(source, "dequeue") || contains_word(source, "deleteQueue");
    bool has_front_rear = contains_word(source, "front") && contains_word(source, "rear");
    bool has_modulo_queue = contains_sub(source, "% MAX") || contains_sub(source, "% SIZE") || contains_sub(source, "% capacity");
    
    if ((has_enqueue && has_dequeue) || (has_front_rear && (has_enqueue || has_dequeue))) {
        if (has_modulo_queue || contains_word(source, "circularQueue") || contains_word(source, "circular")) {
            DetectedDataStructure *ds = &report->items[report->count++];
            strncpy(ds->name, "Circular Queue", 63);
            strncpy(ds->category, "Queues", 63);
            ds->detected = true;
            strncpy(ds->confidence, "High", 31);
            strncpy(ds->explanation, "Detected FIFO circular queue utilizing modulo arithmetic for index wrap-around between front and rear bounds.", MAX_DESC_STR - 1);
            strncpy(ds->indicators, "Enqueue/dequeue with modulo expression (rear + 1) % MAX.", MAX_DESC_STR - 1);
            ds->line_hint = 1;
        } else {
            DetectedDataStructure *ds = &report->items[report->count++];
            strncpy(ds->name, "Linear Queue (FIFO)", 63);
            strncpy(ds->category, "Queues", 63);
            ds->detected = true;
            strncpy(ds->confidence, "High", 31);
            strncpy(ds->explanation, "Detected First-In-First-Out (FIFO) sequential structure managed via front and rear indexing pointers.", MAX_DESC_STR - 1);
            strncpy(ds->indicators, "enqueue() / dequeue() routines with front and rear pointers.", MAX_DESC_STR - 1);
            ds->line_hint = 1;
        }
    }
    
    // 6. Heap / Priority Queue
    bool has_heapify = contains_word(source, "heapify") || contains_word(source, "siftDown") || contains_word(source, "siftUp");
    bool has_heap_idx = contains_sub(source, "2 * i + 1") || contains_sub(source, "2*i + 1") || contains_sub(source, "(i - 1) / 2");
    if (has_heapify || (has_heap_idx && contains_word(source, "heap"))) {
        DetectedDataStructure *ds = &report->items[report->count++];
        strncpy(ds->name, "Heap / Priority Queue", 63);
        strncpy(ds->category, "Trees & Heaps", 63);
        ds->detected = true;
        strncpy(ds->confidence, "High", 31);
        strncpy(ds->explanation, "Detected binary heap representation using array indexing formulas 2*i + 1 (left) and (i - 1)/2 (parent) with heapify maintenance.", MAX_DESC_STR - 1);
        strncpy(ds->indicators, "heapify() procedure and complete binary tree array mapping arithmetic.", MAX_DESC_STR - 1);
        ds->line_hint = 1;
    }
    
    // 7. Graph
    bool has_adj_matrix = contains_sub(source, "adj[") || contains_sub(source, "graph[") || contains_sub(source, "matrix[");
    bool has_adj_list = contains_sub(source, "adjList") || contains_sub(source, "AdjListNode");
    bool has_visited = contains_word(source, "visited");
    bool has_vertices = contains_word(source, "vertices") || contains_word(source, "addEdge") || contains_word(source, "numVertices");
    
    if ((has_adj_matrix || has_adj_list) && (has_visited || has_vertices)) {
        DetectedDataStructure *ds = &report->items[report->count++];
        strncpy(ds->name, has_adj_list ? "Graph (Adjacency List)" : "Graph (Adjacency Matrix)", 63);
        strncpy(ds->category, "Graphs", 63);
        ds->detected = true;
        strncpy(ds->confidence, "High", 31);
        strncpy(ds->explanation, has_adj_list ? "Detected graph representation utilizing array of adjacency linked lists for vertices."
                                              : "Detected graph representation utilizing 2D adjacency matrix matrix[V][V].", MAX_DESC_STR - 1);
        strncpy(ds->indicators, "Graph nodes with visited array tracking and edge connections.", MAX_DESC_STR - 1);
        ds->line_hint = 1;
    }
    
    // 8. Hash Table
    bool has_hash_func = contains_word(source, "hash") || contains_word(source, "hashFunction") || contains_sub(source, "% TABLE_SIZE") || contains_sub(source, "% SIZE");
    bool has_table = contains_word(source, "hashTable") || contains_word(source, "bucket") || contains_word(source, "linearProbing");
    if (has_hash_func && (has_table || (contains_word(source, "insert") && contains_sub(source, "%")))) {
        DetectedDataStructure *ds = &report->items[report->count++];
        strncpy(ds->name, "Hash Table", 63);
        strncpy(ds->category, "Hashing", 63);
        ds->detected = true;
        strncpy(ds->confidence, "High", 31);
        strncpy(ds->explanation, "Detected associative hash table implementation computing bucket positions via modulus key hashing.", MAX_DESC_STR - 1);
        strncpy(ds->indicators, "Hash calculation index formula and key-value or bucket mapping.", MAX_DESC_STR - 1);
        ds->line_hint = 1;
    }
    
    // 9. Arrays
    if (stats->open_bracket_count > 0 && report->count < MAX_DETECTED_ITEMS) {
        DetectedDataStructure *ds = &report->items[report->count++];
        strncpy(ds->name, "Array", 63);
        strncpy(ds->category, "Arrays", 63);
        ds->detected = true;
        strncpy(ds->confidence, "High", 31);
        strncpy(ds->explanation, "Detected contiguous fixed or dynamically allocated memory indexed via bracket notation [].", MAX_DESC_STR - 1);
        strncpy(ds->indicators, "Array declaration and subscript access patterns detected.", MAX_DESC_STR - 1);
        ds->line_hint = 1;
    }
    
    // 10. Strings
    if (contains_sub(source, "char ") || contains_sub(source, "char*") || contains_sub(source, "<string.h>")) {
        DetectedDataStructure *ds = &report->items[report->count++];
        strncpy(ds->name, "String (char array/pointer)", 63);
        strncpy(ds->category, "Strings", 63);
        ds->detected = true;
        strncpy(ds->confidence, "High", 31);
        strncpy(ds->explanation, "Detected null-terminated sequence of characters represented as char array or pointer.", MAX_DESC_STR - 1);
        strncpy(ds->indicators, "char data types and string handling operations.", MAX_DESC_STR - 1);
        ds->line_hint = 1;
    }
}
