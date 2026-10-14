#ifndef ALGORITHMS_H
#define ALGORITHMS_H

#include <stdbool.h>
#include "analyzer.h"

#define MAX_DETECTED_ALGORITHMS 32
#define MAX_ALGO_STR 512

typedef struct {
    char name[64];
    char category[64]; // "Searching", "Sorting", "Tree", "Graph", "Stack/Queue", "DP/Greedy", "Recursion"
    bool detected;
    char confidence[32]; // "High", "Medium", "Heuristic"
    char explanation[MAX_ALGO_STR];
    char best_case_time[32];
    char avg_case_time[32];
    char worst_case_time[32];
    char space_complexity[32];
    char indicators[MAX_ALGO_STR];
    int line_hint;
} DetectedAlgorithm;

typedef struct {
    int count;
    DetectedAlgorithm items[MAX_DETECTED_ALGORITHMS];
} AlgorithmReport;

void detect_algorithms(const char *source, const CodeStats *stats, AlgorithmReport *report);

#endif // ALGORITHMS_H
