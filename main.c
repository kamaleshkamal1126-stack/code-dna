
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#define MAX_CODE 500

typedef struct {
    int loops;
    int conditions;
    int operators;
} CodeStats;

void analyzeComplexity(char code[]) {
    CodeStats stats = {0, 0, 0};
    int length = strlen(code);

    for (int i = 0; i < length; i++) {
        if (strncmp(&code[i], "for", 3) == 0 &&
            (i == 0 || !(code[i - 1] >= 'a' &&
                         code[i - 1] <= 'z')) &&
            !(code[i + 3] >= 'a' && code[i + 3] <= 'z')) {
            stats.loops++;
        }

        if (strncmp(&code[i], "while", 5) == 0 &&
            (i == 0 || !(code[i - 1] >= 'a' &&
                         code[i - 1] <= 'z')) &&
            !(code[i + 5] >= 'a' && code[i + 5] <= 'z')) {
            stats.loops++;
        }

        if (strncmp(&code[i], "do", 2) == 0 &&
            (i == 0 || !(code[i - 1] >= 'a' &&
                         code[i - 1] <= 'z')) &&
            !(code[i + 2] >= 'a' && code[i + 2] <= 'z')) {
            stats.loops++;
        }

        if (strncmp(&code[i], "if", 2) == 0 &&
            (i == 0 || !(code[i - 1] >= 'a' &&
                         code[i - 1] <= 'z')) &&
            !(code[i + 2] >= 'a' && code[i + 2] <= 'z')) {
            stats.conditions++;
        }

        if (strncmp(&code[i], "switch", 6) == 0 &&
            (i == 0 || !(code[i - 1] >= 'a' &&
                         code[i - 1] <= 'z')) &&
            !(code[i + 6] >= 'a' && code[i + 6] <= 'z')) {
            stats.conditions++;
        }

        if (code[i] == '+' || code[i] == '-' ||
            code[i] == '*' || code[i] == '/' ||
            code[i] == '=' || code[i] == '%' ||
            code[i] == '<' || code[i] == '>') {
            stats.operators++;
        }
    }

    printf("\n========== COMPLEXITY REPORT ==========\n");
    printf("Code length       : %d characters\n", length);
    printf("Loops detected    : %d\n", stats.loops);
    printf("Conditions found  : %d\n", stats.conditions);
    printf("Operators found   : %d\n", stats.operators);

    if (stats.loops == 0) {
        printf("Simple estimate   : No loop detected\n");
    } else if (stats.loops == 1) {
        printf("Simple estimate   : At least one loop detected\n");
    } else {
        printf("Simple estimate   : Multiple loops detected\n");
    }

    printf("=======================================\n");
}

int main(void) {
    char code[MAX_CODE];

    printf("=======================================\n");
    printf("              CODE DNA\n");
    printf("       CODE COMPLEXITY ANALYZER\n");
    printf("=======================================\n");

    printf("Enter a one-line C code snippet:\n");
    if (fgets(code, sizeof(code), stdin) == NULL) {
        printf("Input error.\n");
        return 1;
    }

    code[strcspn(code, "\n")] = '\0';

    analyzeComplexity(code);

    return 0;
}