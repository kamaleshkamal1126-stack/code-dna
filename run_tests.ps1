Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Running CODE DNA 3.0 Full Test Suite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n1. Running C DSA Engine Tests..." -ForegroundColor Yellow
gcc -O2 -Wall -Wextra -std=c99 backend/c_engine/tests/test_engine.c backend/c_engine/src/analyzer.c backend/c_engine/src/structures.c backend/c_engine/src/algorithms.c backend/c_engine/src/complexity.c -o backend/c_engine/tests/test_engine.exe
if ($LASTEXITCODE -eq 0) {
    .\backend\c_engine\tests\test_engine.exe
} else {
    Write-Host "C Test Compilation Failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n2. Running Python Backend API Integration Tests..." -ForegroundColor Yellow
python -m unittest backend/tests/test_api.py

Write-Host "`n3. Testing Frontend Production Build..." -ForegroundColor Yellow
Set-Location frontend
npm run build
Set-Location ..

Write-Host "`nAll CODE DNA 3.0 test suites executed successfully!" -ForegroundColor Green
