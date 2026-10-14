#include "analyzer.h"
#include <ctype.h>

void init_code_stats(CodeStats *stats) {
    if (!stats) return;
    memset(stats, 0, sizeof(CodeStats));
    stats->paren_balanced = true;
    stats->brace_balanced = true;
    stats->bracket_balanced = true;
}

static bool is_ident_char(char c) {
    return isalnum((unsigned char)c) || c == '_';
}

static bool is_ident_start(char c) {
    return isalpha((unsigned char)c) || c == '_';
}

static bool is_control_keyword(const char *word) {
    return (strcmp(word, "if") == 0 ||
            strcmp(word, "else") == 0 ||
            strcmp(word, "for") == 0 ||
            strcmp(word, "while") == 0 ||
            strcmp(word, "do") == 0 ||
            strcmp(word, "switch") == 0 ||
            strcmp(word, "return") == 0 ||
            strcmp(word, "sizeof") == 0 ||
            strcmp(word, "case") == 0 ||
            strcmp(word, "struct") == 0);
}

void analyze_source_code(const char *source, CodeStats *stats) {
    if (!source || !stats) return;
    init_code_stats(stats);
    
    int len = (int)strlen(source);
    stats->total_chars = len;
    
    // Stack for bracket matching
    char bracket_stack[4096];
    int bracket_sp = 0;
    
    bool in_line_comment = false;
    bool in_block_comment = false;
    bool in_string = false;
    bool in_char = false;
    
    int current_line = 1;
    bool line_has_content = false;
    bool line_has_comment = false;
    
    // Loop nesting tracking
    int current_loop_depth = 0;
    int loop_brace_depth[64];
    int loop_depth_ptr = 0;
    int current_brace_depth = 0;
    
    // Function detection state
    char current_func_name[MAX_TOKEN_LEN] = "";
    int current_func_start_line = 0;
    int current_func_brace_depth = 0;
    bool inside_func_body = false;
    
    // Candidate function tokens
    char last_ident[MAX_TOKEN_LEN] = "";
    char last_func_candidate[MAX_TOKEN_LEN] = "";
    char last_func_return_type[MAX_TOKEN_LEN] = "";
    int candidate_line = 1;

    for (int i = 0; i < len; i++) {
        char c = source[i];
        char next = (i + 1 < len) ? source[i + 1] : '\0';
        
        if (c == '\n') {
            stats->total_lines++;
            if (line_has_content) stats->non_empty_lines++;
            if (line_has_comment) stats->comment_lines++;
            
            in_line_comment = false;
            line_has_content = false;
            line_has_comment = false;
            current_line++;
            continue;
        }
        
        if (!isspace((unsigned char)c)) {
            line_has_content = true;
        }
        
        // Handle comments
        if (!in_string && !in_char) {
            if (!in_line_comment && !in_block_comment) {
                if (c == '/' && next == '/') {
                    in_line_comment = true;
                    line_has_comment = true;
                    i++; // skip next
                    continue;
                } else if (c == '/' && next == '*') {
                    in_block_comment = true;
                    line_has_comment = true;
                    i++; // skip next
                    continue;
                }
            } else if (in_block_comment) {
                if (c == '*' && next == '/') {
                    in_block_comment = false;
                    i++; // skip next
                    continue;
                }
                continue;
            } else if (in_line_comment) {
                continue;
            }
        }
        
        if (in_line_comment || in_block_comment) {
            continue;
        }
        
        // Handle string and char literals
        if (!in_char && c == '"' && (i == 0 || source[i - 1] != '\\')) {
            in_string = !in_string;
            continue;
        }
        if (!in_string && c == '\'' && (i == 0 || source[i - 1] != '\\')) {
            in_char = !in_char;
            continue;
        }
        if (in_string || in_char) {
            continue;
        }
        
        // Brackets and Nesting
        if (c == '(') {
            stats->open_paren_count++;
            if (bracket_sp < 4000) bracket_stack[bracket_sp++] = '(';
            
            // If before '(', we had an identifier that isn't a control keyword, it could be a function definition!
            if (!inside_func_body && strlen(last_ident) > 0 && !is_control_keyword(last_ident)) {
                snprintf(last_func_candidate, sizeof(last_func_candidate), "%s", last_ident);
                candidate_line = current_line;
            }
        } else if (c == ')') {
            stats->close_paren_count++;
            if (bracket_sp > 0 && bracket_stack[bracket_sp - 1] == '(') {
                bracket_sp--;
            } else {
                stats->paren_balanced = false;
            }
        } else if (c == '[') {
            stats->open_bracket_count++;
            if (bracket_sp < 4000) bracket_stack[bracket_sp++] = '[';
        } else if (c == ']') {
            stats->close_bracket_count++;
            if (bracket_sp > 0 && bracket_stack[bracket_sp - 1] == '[') {
                bracket_sp--;
            } else {
                stats->bracket_balanced = false;
            }
        } else if (c == '{') {
            stats->open_brace_count++;
            current_brace_depth++;
            if (bracket_sp < 4000) bracket_stack[bracket_sp++] = '{';
            
            // Check if this brace opens a function body
            if (!inside_func_body && strlen(last_func_candidate) > 0) {
                inside_func_body = true;
                current_func_brace_depth = current_brace_depth;
                snprintf(current_func_name, sizeof(current_func_name), "%s", last_func_candidate);
                current_func_start_line = candidate_line;
                
                if (stats->function_count < MAX_FUNCTIONS) {
                    FunctionInfo *fi = &stats->functions[stats->function_count++];
                    snprintf(fi->name, sizeof(fi->name), "%s", current_func_name);
                    snprintf(fi->return_type, sizeof(fi->return_type), "%s",
                             strlen(last_func_return_type) > 0 ? last_func_return_type : "int");
                    fi->start_line = current_func_start_line;
                    fi->is_recursive = false;
                    fi->recursive_calls_count = 0;
                    fi->max_loop_depth = 0;
                }
                last_func_candidate[0] = '\0';
            }
        } else if (c == '}') {
            stats->close_brace_count++;
            if (bracket_sp > 0 && bracket_stack[bracket_sp - 1] == '{') {
                bracket_sp--;
            } else {
                stats->brace_balanced = false;
            }
            
            // Pop loop nesting if loop opened with brace at this depth
            if (loop_depth_ptr > 0 && loop_brace_depth[loop_depth_ptr - 1] == current_brace_depth) {
                loop_depth_ptr--;
                if (current_loop_depth > 0) current_loop_depth--;
            }
            
            // Function body end
            if (inside_func_body && current_brace_depth == current_func_brace_depth) {
                inside_func_body = false;
                if (stats->function_count > 0) {
                    stats->functions[stats->function_count - 1].end_line = current_line;
                }
                current_func_name[0] = '\0';
            }
            
            current_brace_depth--;
        } else if (c == ';') {
            // Semicolon clears candidate if we weren't opening a function
            if (!inside_func_body) {
                last_func_candidate[0] = '\0';
            }
        }
        
        // Tokenizer for identifiers and keywords
        if (is_ident_start(c)) {
            char token[MAX_TOKEN_LEN];
            int ti = 0;
            token[ti++] = c;
            while (i + 1 < len && is_ident_char(source[i + 1]) && ti < MAX_TOKEN_LEN - 1) {
                token[ti++] = source[++i];
            }
            token[ti] = '\0';
            
            // Analyze token
            if (strcmp(token, "for") == 0) {
                stats->loop_count++;
                stats->for_loops++;
                current_loop_depth++;
                if (loop_depth_ptr < 60) loop_brace_depth[loop_depth_ptr++] = current_brace_depth + 1;
                if (current_loop_depth > stats->max_loop_nesting) {
                    stats->max_loop_nesting = current_loop_depth;
                }
            } else if (strcmp(token, "while") == 0) {
                stats->loop_count++;
                stats->while_loops++;
                current_loop_depth++;
                if (loop_depth_ptr < 60) loop_brace_depth[loop_depth_ptr++] = current_brace_depth + 1;
                if (current_loop_depth > stats->max_loop_nesting) {
                    stats->max_loop_nesting = current_loop_depth;
                }
            } else if (strcmp(token, "do") == 0) {
                stats->loop_count++;
                stats->do_while_loops++;
                current_loop_depth++;
                if (loop_depth_ptr < 60) loop_brace_depth[loop_depth_ptr++] = current_brace_depth + 1;
                if (current_loop_depth > stats->max_loop_nesting) {
                    stats->max_loop_nesting = current_loop_depth;
                }
            } else if (strcmp(token, "if") == 0) {
                stats->conditional_count++;
                stats->if_count++;
            } else if (strcmp(token, "switch") == 0) {
                stats->conditional_count++;
                stats->switch_count++;
            } else {
                // Check if identifier calls the current enclosing function (Recursion!)
                if (inside_func_body && strlen(current_func_name) > 0 && strcmp(token, current_func_name) == 0) {
                    // Peek if followed by '('
                    int p = i + 1;
                    while (p < len && isspace((unsigned char)source[p])) p++;
                    if (p < len && source[p] == '(') {
                        stats->recursive_patterns_count++;
                        if (stats->function_count > 0) {
                            stats->functions[stats->function_count - 1].is_recursive = true;
                            stats->functions[stats->function_count - 1].recursive_calls_count++;
                        }
                    }
                }
                
                // Track candidate for return type or function name
                if (!inside_func_body) {
                    snprintf(last_func_return_type, sizeof(last_func_return_type), "%s", last_ident);
                }
                snprintf(last_ident, sizeof(last_ident), "%s", token);
            }
        }
    }
    
    // Check final line
    if (line_has_content) stats->non_empty_lines++;
    if (line_has_comment) stats->comment_lines++;
    if (len > 0 && source[len - 1] != '\n') stats->total_lines++;
    
    // Evaluate bracket balances
    if (stats->open_paren_count != stats->close_paren_count || bracket_sp > 0) {
        for (int b = 0; b < bracket_sp; b++) {
            if (bracket_stack[b] == '(') stats->paren_balanced = false;
            if (bracket_stack[b] == '{') stats->brace_balanced = false;
            if (bracket_stack[b] == '[') stats->bracket_balanced = false;
        }
    }
    
    // Suspicious structural check reporting
    if (!stats->paren_balanced) {
        snprintf(stats->suspicious_issues[stats->suspicious_issues_count++], 255,
                 "Unbalanced parentheses: %d '(' vs %d ')'", stats->open_paren_count, stats->close_paren_count);
    }
    if (!stats->brace_balanced) {
        snprintf(stats->suspicious_issues[stats->suspicious_issues_count++], 255,
                 "Unbalanced curly braces: %d '{' vs %d '}'", stats->open_brace_count, stats->close_brace_count);
    }
    if (!stats->bracket_balanced) {
        snprintf(stats->suspicious_issues[stats->suspicious_issues_count++], 255,
                 "Unbalanced square brackets: %d '[' vs %d ']'", stats->open_bracket_count, stats->close_bracket_count);
    }
    
    // Check if main() exists
    bool has_main = false;
    for (int f = 0; f < stats->function_count; f++) {
        if (strcmp(stats->functions[f].name, "main") == 0) {
            has_main = true;
            break;
        }
    }
    if (!has_main && stats->function_count > 0) {
        snprintf(stats->suspicious_issues[stats->suspicious_issues_count++], 255,
                 "No 'main()' entry function detected (code appears to be a library or snippet).");
    }
}
