# Reports Service Test Examples (PowerShell)
# Usage: .\test-api.ps1

param(
    [string]$BaseUrl = "http://localhost:3004",
    [string]$Token = "dev-token"
)

$headers = @{
    "Authorization" = "Bearer $Token"
    "Content-Type" = "application/json"
}

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Reports Service - Quick Test Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 1. Health Check
Write-Host "1. Testing Health Check..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/health" -Method Get
    Write-Host "✓ Status: $($response.StatusCode)" -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 2 | Write-Host
}
catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 2. Get Statistics
Write-Host "2. Testing Statistics Endpoint..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/reports/statistics" -Headers $headers -Method Get
    Write-Host "✓ Status: $($response.StatusCode)" -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 3 | Write-Host
}
catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 3. Financial Report (JSON)
Write-Host "3. Testing Financial Report (JSON)..." -ForegroundColor Blue
try {
    $uri = "$BaseUrl/api/reports/financial?startDate=2026-01-01&endDate=2026-05-26&format=json"
    $response = Invoke-WebRequest -Uri $uri -Headers $headers -Method Get
    Write-Host "✓ Status: $($response.StatusCode)" -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 3 | Write-Host
}
catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 4. Account Statement (JSON)
Write-Host "4. Testing Account Statement (JSON)..." -ForegroundColor Blue
try {
    $body = @{
        accountId = "ACC-001"
        startDate = "2026-01-01"
        endDate = "2026-05-26"
        format = "json"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/reports/account-statement" `
        -Headers $headers -Method Post -Body $body
    Write-Host "✓ Status: $($response.StatusCode)" -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 3 | Write-Host
}
catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 5. Account Statement (CSV) - Download
Write-Host "5. Downloading Account Statement (CSV)..." -ForegroundColor Blue
try {
    $body = @{
        accountId = "ACC-002"
        startDate = "2026-02-01"
        endDate = "2026-04-30"
        format = "csv"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/reports/account-statement" `
        -Headers $headers -Method Post -Body $body -OutFile "statement.csv"
    Write-Host "✓ Downloaded: statement.csv" -ForegroundColor Green
}
catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 6. Account Statement (PDF) - Download
Write-Host "6. Downloading Account Statement (PDF)..." -ForegroundColor Blue
try {
    $body = @{
        accountId = "ACC-003"
        startDate = "2026-01-01"
        endDate = "2026-05-26"
        format = "pdf"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/reports/account-statement" `
        -Headers $headers -Method Post -Body $body -OutFile "statement.pdf"
    Write-Host "✓ Downloaded: statement.pdf" -ForegroundColor Green
}
catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 7. Financial Report (PDF) - Download
Write-Host "7. Downloading Financial Report (PDF)..." -ForegroundColor Blue
try {
    $uri = "$BaseUrl/api/reports/financial?startDate=2026-01-01&endDate=2026-05-26&format=pdf"
    $response = Invoke-WebRequest -Uri $uri -Headers $headers -Method Get `
        -OutFile "financial-report.pdf"
    Write-Host "✓ Downloaded: financial-report.pdf" -ForegroundColor Green
}
catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 8. Test Error - Missing Token
Write-Host "8. Testing Error - Missing Authorization Token..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/reports/statistics" -Method Get -ErrorAction Stop
}
catch {
    Write-Host "✓ Expected error received: $($_.Exception.Response.StatusCode)" -ForegroundColor Green
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "  Message: Token not provided" -ForegroundColor Gray
    }
}
Write-Host ""

# 9. Test Error - Invalid Date Format
Write-Host "9. Testing Error - Invalid Date Format..." -ForegroundColor Blue
try {
    $body = @{
        accountId = "ACC-001"
        startDate = "invalid-date"
        endDate = "2026-05-26"
        format = "json"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/reports/account-statement" `
        -Headers $headers -Method Post -Body $body -ErrorAction Stop
}
catch {
    Write-Host "✓ Expected error received: $($_.Exception.Response.StatusCode)" -ForegroundColor Green
    Write-Host "  Message: Validation error" -ForegroundColor Gray
}
Write-Host ""

# 10. Test Error - Invalid Format
Write-Host "10. Testing Error - Invalid Format..." -ForegroundColor Blue
try {
    $body = @{
        accountId = "ACC-001"
        startDate = "2026-01-01"
        endDate = "2026-05-26"
        format = "xml"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/reports/account-statement" `
        -Headers $headers -Method Post -Body $body -ErrorAction Stop
}
catch {
    Write-Host "✓ Expected error received: $($_.Exception.Response.StatusCode)" -ForegroundColor Green
    Write-Host "  Message: Invalid format. Use json, csv, or pdf" -ForegroundColor Gray
}
Write-Host ""

Write-Host "=====================================" -ForegroundColor Green
Write-Host "All tests completed!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

# Check for generated files
Write-Host "Generated files:" -ForegroundColor Yellow
Get-Item -Path "*.csv", "*.pdf" -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "  ✓ $($_.Name) ($($_.Length) bytes)" -ForegroundColor Cyan
}
