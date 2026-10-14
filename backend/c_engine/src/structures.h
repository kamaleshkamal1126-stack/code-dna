#ifndef STRUCTURES_H
#define STRUCTURES_H

#include <stdbool.h>
#include "analyzer.h"

#define MAX_DETECTED_ITEMS 32
#define MAX_LINE_STR 128
#define MAX_DESC_STR 512

typedef struct {
    char name[64];
    char category[64];
    bool detected;
    char confidence[32]; // "High", "Medium", "Heuristic"
    char explanation[MAX_DESC_STR];
    char indicators[MAX_DESC_STR];
    int line_hint;
} DetectedDataStructure;

typedef struct {
    int count;
    DetectedDataStructure items[MAX_DETECTED_ITEMS];
} DataStructureReport;

void detect_data_structures(const char *source, const CodeStats *stats, DataStructureReport *report);

#endif // STRUCTURES_H
