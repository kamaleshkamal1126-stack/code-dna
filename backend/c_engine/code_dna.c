
#include <stdio.h>
#include <string.h>

#define MAX 10000

int main() {
    char code1[MAX], code2[MAX];
    int same = 0, total, i;
    float similarity;

    printf("=== CODE DNA 3.0 ===\n");
    printf("Enter first code (one line): ");
    fgets(code1, MAX, stdin);

    printf("Enter second code (one line): ");
    fgets(code2, MAX, stdin);

    int len1 = strlen(code1);
    int len2 = strlen(code2);

    total = len1 > len2 ? len1 : len2;

    for (i = 0; i < len1 && i < len2; i++) {
        if (code1[i] == code2[i]) {
            same++;
        }
    }

    if (total == 0) {
        similarity = 100.0;
    } else {
        similarity = (float)same / total * 100;
    }

    printf("\nSimilarity: %.2f%%\n", similarity);

    if (similarity >= 80)
        printf("Result: Highly similar\n");
    else if (similarity >= 50)
        printf("Result: Moderately similar\n");
    else
        printf("Result: Less similar\n");

    return 0;
}
