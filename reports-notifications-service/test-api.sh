#!/bin/bash

# Reports Service Test Examples
# URL
BASE_URL="http://localhost:3004"
TOKEN="Bearer dev-token"

echo "======================================"
echo "Reports Service - Quick Test Script"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Health Check
echo -e "${BLUE}1. Testing Health Check...${NC}"
curl -s -i "$BASE_URL/health"
echo -e "\n"

# 2. Get Statistics
echo -e "${BLUE}2. Testing Statistics Endpoint...${NC}"
curl -s -H "Authorization: $TOKEN" "$BASE_URL/api/reports/statistics" | jq .
echo -e "\n"

# 3. Financial Report (JSON)
echo -e "${BLUE}3. Testing Financial Report (JSON)...${NC}"
curl -s -H "Authorization: $TOKEN" \
  "$BASE_URL/api/reports/financial?startDate=2026-01-01&endDate=2026-05-26&format=json" | jq .
echo -e "\n"

# 4. Account Statement (JSON)
echo -e "${BLUE}4. Testing Account Statement (JSON)...${NC}"
curl -s -X POST "$BASE_URL/api/reports/account-statement" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "ACC-001",
    "startDate": "2026-01-01",
    "endDate": "2026-05-26",
    "format": "json"
  }' | jq .
echo -e "\n"

# 5. Account Statement (CSV) - Download
echo -e "${BLUE}5. Downloading Account Statement (CSV)...${NC}"
curl -s -X POST "$BASE_URL/api/reports/account-statement" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "ACC-002",
    "startDate": "2026-02-01",
    "endDate": "2026-04-30",
    "format": "csv"
  }' -o statement.csv
echo "✓ Saved to: statement.csv"
echo -e "\n"

# 6. Account Statement (PDF) - Download
echo -e "${BLUE}6. Downloading Account Statement (PDF)...${NC}"
curl -s -X POST "$BASE_URL/api/reports/account-statement" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "ACC-003",
    "startDate": "2026-01-01",
    "endDate": "2026-05-26",
    "format": "pdf"
  }' -o statement.pdf
echo "✓ Saved to: statement.pdf"
echo -e "\n"

# 7. Financial Report (PDF) - Download
echo -e "${BLUE}7. Downloading Financial Report (PDF)...${NC}"
curl -s -H "Authorization: $TOKEN" \
  "$BASE_URL/api/reports/financial?startDate=2026-01-01&endDate=2026-05-26&format=pdf" \
  -o financial-report.pdf
echo "✓ Saved to: financial-report.pdf"
echo -e "\n"

# 8. Test Error - Missing Token
echo -e "${BLUE}8. Testing Error - Missing Authorization Token...${NC}"
curl -s -i "$BASE_URL/api/reports/statistics" | head -20
echo -e "\n"

# 9. Test Error - Invalid Date Format
echo -e "${BLUE}9. Testing Error - Invalid Date Format...${NC}"
curl -s -X POST "$BASE_URL/api/reports/account-statement" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "ACC-001",
    "startDate": "invalid-date",
    "endDate": "2026-05-26",
    "format": "json"
  }' | jq .
echo -e "\n"

# 10. Test Error - Invalid Format
echo -e "${BLUE}10. Testing Error - Invalid Format...${NC}"
curl -s -X POST "$BASE_URL/api/reports/account-statement" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "ACC-001",
    "startDate": "2026-01-01",
    "endDate": "2026-05-26",
    "format": "xml"
  }' | jq .
echo -e "\n"

echo -e "${GREEN}======================================"
echo "All tests completed!"
echo "======================================${NC}"
echo ""
echo "Generated files:"
ls -lh *.csv *.pdf 2>/dev/null || echo "No files generated"
