#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "analyzer.h"
#include "structures.h"
#include "algorithms.h"
#include "complexity.h"

#define MAX_CODE_SIZE (2 * 1024 * 1024) // 2MB safety limit

static void print_escaped_json_string(FILE *out, const char *s) {
    if (!s) {
        fputs("\"\"", out);
        return;
    }
    fputc('"', out);
    for (const char *p = s; *p; p++) {
        switch (*p) {
            case '\\': fputs("\\\\", out); break;
            case '"':  fputs("\\\"", out); break;
            case '\b': fputs("\\b", out);  break;
            case '\f': fputs("\\f", out);  break;
            case '\n': fputs("\\n", out);  break;
            case '\r': fputs("\\r", out);  break;
            case '\t': fputs("\\t", out);  break;
            default:
                if ((unsigned char)*p < 32) {
                    fprintf(out, "\\u%04x", (unsigned char)*p);
                } else {
                    fputc(*p, out);
                }
                break;
        }
    }
    fputc('"', out);
}

int main(int argc, char *argv[]) {
    char *filepath = NULL;
    for (int i = 1; i < argc; i++) {
        if (strcmp(argv[i], "--file") == 0 && i + 1 < argc) {
            filepath = argv[++i];
        }
    }

    char *code_buffer = (char *)malloc(MAX_CODE_SIZE);
    if (!code_buffer) {
        fprintf(stderr, "{\"error\": \"Memory allocation failed\"}\n");
        return 1;
    }

    size_t total_read = 0;
    if (filepath) {
        FILE *fp = fopen(filepath, "rb");
        if (!fp) {
            fprintf(stderr, "{\"error\": \"Could not open source file\"}\n");
            free(code_buffer);
            return 1;
        }
        total_read = fread(code_buffer, 1, MAX_CODE_SIZE - 1, fp);
        fclose(fp);
    } else {
        total_read = fread(code_buffer, 1, MAX_CODE_SIZE - 1, stdin);
    }

    code_buffer[total_read] = '\0';

    if (total_read == 0) {
        printf("{\n");
        printf("  \"success\": true,\n");
        printf("  \"engine\": \"CODE_DNA_C_ENGINE_v3.0\",\n");
        printf("  \"empty_input\": true,\n");
        printf("  \"statistics\": {\n");
        printf("    \"total_lines\": 0,\n");
        printf("    \"non_empty_lines\": 0,\n");
        printf("    \"comment_lines\": 0,\n");
        printf("    \"total_chars\": 0,\n");
        printf("    \"function_count\": 0,\n");
        printf("    \"loop_count\": 0,\n");
        printf("    \"max_loop_nesting\": 0,\n");
        printf("    \"conditional_count\": 0,\n");
        printf("    \"recursive_patterns_count\": 0,\n");
        printf("    \"paren_balanced\": true,\n");
        printf("    \"brace_balanced\": true,\n");
        printf("    \"bracket_balanced\": true,\n");
        printf("    \"suspicious_issues\": [\"Input source is empty.\"]\n");
        printf("  },\n");
        printf("  \"functions\": [],\n");
        printf("  \"data_structures\": [],\n");
        printf("  \"algorithms\": [],\n");
        printf("  \"complexity\": {\n");
        printf("    \"is_confident\": false,\n");
        printf("    \"best_case\": \"N/A\",\n");
        printf("    \"average_case\": \"N/A\",\n");
        printf("    \"worst_case\": \"N/A\",\n");
        printf("    \"space_complexity\": \"N/A\",\n");
        printf("    \"confidence\": \"None\",\n");
        printf("    \"reasoning\": \"No source code provided to evaluate.\",\n");
        printf("    \"caveats\": \"Empty input.\"\n");
        printf("  }\n");
        printf("}\n");
        free(code_buffer);
        return 0;
    }

    CodeStats stats;
    DataStructureReport ds_report;
    AlgorithmReport algo_report;
    ComplexityReport comp_report;

    analyze_source_code(code_buffer, &stats);
    detect_data_structures(code_buffer, &stats, &ds_report);
    detect_algorithms(code_buffer, &stats, &algo_report);
    evaluate_complexity(&stats, &ds_report, &algo_report, &comp_report);

    // Print JSON output
    printf("{\n");
    printf("  \"success\": true,\n");
    printf("  \"engine\": \"CODE_DNA_C_ENGINE_v3.0\",\n");
    printf("  \"empty_input\": false,\n");
    printf("  \"statistics\": {\n");
    printf("    \"total_lines\": %d,\n", stats.total_lines);
    printf("    \"non_empty_lines\": %d,\n", stats.non_empty_lines);
    printf("    \"comment_lines\": %d,\n", stats.comment_lines);
    printf("    \"total_chars\": %d,\n", stats.total_chars);
    printf("    \"function_count\": %d,\n", stats.function_count);
    printf("    \"loop_count\": %d,\n", stats.loop_count);
    printf("    \"for_loops\": %d,\n", stats.for_loops);
    printf("    \"while_loops\": %d,\n", stats.while_loops);
    printf("    \"do_while_loops\": %d,\n", stats.do_while_loops);
    printf("    \"max_loop_nesting\": %d,\n", stats.max_loop_nesting);
    printf("    \"conditional_count\": %d,\n", stats.conditional_count);
    printf("    \"if_count\": %d,\n", stats.if_count);
    printf("    \"switch_count\": %d,\n", stats.switch_count);
    printf("    \"recursive_patterns_count\": %d,\n", stats.recursive_patterns_count);
    printf("    \"paren_balanced\": %s,\n", stats.paren_balanced ? "true" : "false");
    printf("    \"brace_balanced\": %s,\n", stats.brace_balanced ? "true" : "false");
    printf("    \"bracket_balanced\": %s,\n", stats.bracket_balanced ? "true" : "false");
    printf("    \"open_paren_count\": %d,\n", stats.open_paren_count);
    printf("    \"close_paren_count\": %d,\n", stats.close_paren_count);
    printf("    \"open_brace_count\": %d,\n", stats.open_brace_count);
    printf("    \"close_brace_count\": %d,\n", stats.close_brace_count);
    printf("    \"open_bracket_count\": %d,\n", stats.open_bracket_count);
    printf("    \"close_bracket_count\": %d,\n", stats.close_bracket_count);
    printf("    \"suspicious_issues\": [");
    for (int i = 0; i < stats.suspicious_issues_count; i++) {
        print_escaped_json_string(stdout, stats.suspicious_issues[i]);
        if (i < stats.suspicious_issues_count - 1) printf(", ");
    }
    printf("]\n");
    printf("  },\n");

    // Functions array
    printf("  \"functions\": [\n");
    for (int f = 0; f < stats.function_count; f++) {
        printf("    {\n");
        printf("      \"name\": ");
        print_escaped_json_string(stdout, stats.functions[f].name);
        printf(",\n      \"return_type\": ");
        print_escaped_json_string(stdout, stats.functions[f].return_type);
        printf(",\n      \"start_line\": %d,\n", stats.functions[f].start_line);
        printf("      \"end_line\": %d,\n", stats.functions[f].end_line);
        printf("      \"is_recursive\": %s,\n", stats.functions[f].is_recursive ? "true" : "false");
        printf("      \"recursive_calls_count\": %d\n", stats.functions[f].recursive_calls_count);
        printf("    }%s\n", (f < stats.function_count - 1) ? "," : "");
    }
    printf("  ],\n");

    // Data structures array
    printf("  \"data_structures\": [\n");
    for (int d = 0; d < ds_report.count; d++) {
        printf("    {\n");
        printf("      \"name\": ");
        print_escaped_json_string(stdout, ds_report.items[d].name);
        printf(",\n      \"category\": ");
        print_escaped_json_string(stdout, ds_report.items[d].category);
        printf(",\n      \"detected\": true,\n");
        printf("      \"confidence\": ");
        print_escaped_json_string(stdout, ds_report.items[d].confidence);
        printf(",\n      \"explanation\": ");
        print_escaped_json_string(stdout, ds_report.items[d].explanation);
        printf(",\n      \"indicators\": ");
        print_escaped_json_string(stdout, ds_report.items[d].indicators);
        printf("\n    }%s\n", (d < ds_report.count - 1) ? "," : "");
    }
    printf("  ],\n");

    // Algorithms array
    printf("  \"algorithms\": [\n");
    for (int a = 0; a < algo_report.count; a++) {
        printf("    {\n");
        printf("      \"name\": ");
        print_escaped_json_string(stdout, algo_report.items[a].name);
        printf(",\n      \"category\": ");
        print_escaped_json_string(stdout, algo_report.items[a].category);
        printf(",\n      \"detected\": true,\n");
        printf("      \"confidence\": ");
        print_escaped_json_string(stdout, algo_report.items[a].confidence);
        printf(",\n      \"explanation\": ");
        print_escaped_json_string(stdout, algo_report.items[a].explanation);
        printf(",\n      \"best_case\": ");
        print_escaped_json_string(stdout, algo_report.items[a].best_case_time);
        printf(",\n      \"average_case\": ");
        print_escaped_json_string(stdout, algo_report.items[a].avg_case_time);
        printf(",\n      \"worst_case\": ");
        print_escaped_json_string(stdout, algo_report.items[a].worst_case_time);
        printf(",\n      \"space_complexity\": ");
        print_escaped_json_string(stdout, algo_report.items[a].space_complexity);
        printf(",\n      \"indicators\": ");
        print_escaped_json_string(stdout, algo_report.items[a].indicators);
        printf("\n    }%s\n", (a < algo_report.count - 1) ? "," : "");
    }
    printf("  ],\n");

    // Complexity object
    printf("  \"complexity\": {\n");
    printf("    \"is_confident\": %s,\n", comp_report.is_confident ? "true" : "false");
    printf("    \"best_case\": ");
    print_escaped_json_string(stdout, comp_report.best_case);
    printf(",\n    \"average_case\": ");
    print_escaped_json_string(stdout, comp_report.average_case);
    printf(",\n    \"worst_case\": ");
    print_escaped_json_string(stdout, comp_report.worst_case);
    printf(",\n    \"space_complexity\": ");
    print_escaped_json_string(stdout, comp_report.space_complexity);
    printf(",\n    \"confidence\": ");
    print_escaped_json_string(stdout, comp_report.confidence);
    printf(",\n    \"reasoning\": ");
    print_escaped_json_string(stdout, comp_report.reasoning);
    printf(",\n    \"caveats\": ");
    print_escaped_json_string(stdout, comp_report.caveats);
    printf("\n  }\n");
    printf("}\n");

    free(code_buffer);
    return 0;
}
