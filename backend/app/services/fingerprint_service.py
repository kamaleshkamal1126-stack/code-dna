import hashlib
import re

def normalize_c_source(code: str) -> str:
    """
    Deterministic normalization for C source code:
    1. Remove block comments /* ... */
    2. Remove single-line comments // ...
    3. Remove Python/scripting comments # if present (except preprocessor lines)
    4. Normalize all whitespace sequences (tabs, multiple spaces, linebreaks) to a single space
    5. Strip leading and trailing whitespace
    """
    if not code:
        return ""
    
    # 1. Strip block comments
    no_block = re.sub(r'/\*[\s\S]*?\*/', '', code)
    
    # 2. Strip single-line comments
    no_line = re.sub(r'//.*', '', no_block)
    
    # 3. Collapse whitespace
    collapsed = re.sub(r'\s+', ' ', no_line).strip()
    return collapsed

def generate_code_fingerprints(code: str, language: str = "c"):
    """
    Generates exact and normalized SHA-256 fingerprints with metadata.
    """
    if not code:
        code = ""
    
    raw_bytes = code.encode('utf-8')
    exact_sha256 = hashlib.sha256(raw_bytes).hexdigest()
    
    normalized = normalize_c_source(code)
    norm_bytes = normalized.encode('utf-8')
    normalized_sha256 = hashlib.sha256(norm_bytes).hexdigest()
    
    return {
        "language": language,
        "exact_fingerprint": exact_sha256,
        "normalized_fingerprint": normalized_sha256,
        "exact_length": len(code),
        "normalized_length": len(normalized),
        "normalization_method": "Comments removed (block & line), whitespace collapsed, trimmed",
        "hash_algorithm": "SHA-256 (FIPS 180-4 standard)"
    }
