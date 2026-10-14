#ifndef ANALYZER_H
#define ANALYZER_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

#define MAX_TOKEN_LEN 256
#define MAX_FUNCTIONS 64
#define MAX_LINE_LEN 4096

typedef enum {
    TOKEN_KEYWORD,
    TOKEN_IDENTIFIER,
    TOKEN_NUMBER,
    TOKEN_STRING,
    TOKEN_CHAR,
    TOKEN_OPERATOR,
    TOKEN_PUNCTUATION,
    TOKEN_LPAREN,
    TOKEN_RPAREN,
    TOKEN_LBRACE,
    TOKEN_RBRACE,
    TOKEN_LBRACKET,
    TOKEN_RBRACKET,
    TOKEN_SEMICOLON,
    TOKEN_COMMA,
    TOKEN_UNKNOWN,
    TOKEN_EOF
} TokenType;

typedef struct {
    TokenType type;
    char text[MAX_TOKEN_LEN];
    int line;
    int col;
} Token;

typedef struct {
    char name[MAX_TOKEN_LEN];
    char return_type[MAX_TOKEN_LEN];
    int start_line;
    int end_line;
    int param_count;
    bool is_recursive;
    int recursive_calls_count;
    int max_loop_depth;
} FunctionInfo;

typedef struct {
    int total_lines;
    int non_empty_lines;
    int comment_lines;
    int total_chars;
    int function_count;
    FunctionInfo functions[MAX_FUNCTIONS];
    int loop_count;
    int for_loops;
    int while_loops;
    int do_while_loops;
    int max_loop_nesting;
    int conditional_count;
    int if_count;
    int else_if_count;
    int switch_count;
    int recursive_patterns_count;
    
    // Bracket balance diagnostics
    bool paren_balanced;
    bool brace_balanced;
    bool bracket_balanced;
    int open_paren_count;
    int close_paren_count;
    int open_brace_count;
    int close_brace_count;
    int open_bracket_count;
    int close_bracket_count;
    
    // Suspicious fragments
    int suspicious_issues_count;
    char suspicious_issues[16][256];
} CodeStats;

// Core analyzer prototypes
void init_code_stats(CodeStats *stats);
void analyze_source_code(const char *source, CodeStats *stats);

#endif // ANALYZER_H
