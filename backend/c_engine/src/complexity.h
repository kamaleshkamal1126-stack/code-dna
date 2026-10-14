#ifndef COMPLEXITY_H
#define COMPLEXITY_H

#include <stdbool.h>
#include "analyzer.h"
#include "structures.h"
#include "algorithms.h"

typedef struct {
    char best_case[32];
    char average_case[32];
    char worst_case[32];
    char space_complexity[32];
    char confidence[32];
    bool is_confident;
    char reasoning[1024];
    char caveats[512];
} ComplexityReport;

void evaluate_complexity(
    const CodeStats *stats,
    const DataStructureReport *ds_report,
    const AlgorithmReport *algo_report,
    ComplexityReport *comp_report
);

#endif // COMPLEXITY_H
