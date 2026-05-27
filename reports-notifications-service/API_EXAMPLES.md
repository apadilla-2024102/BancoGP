# Reports & Notifications Service - API Examples

## Service URL
`http://localhost:3004`

## Health Check
```bash
curl http://localhost:3004/health
```

## Authentication
All API endpoints (except `/health`) require an `Authorization` header with a Bearer token.
In development mode (NODE_ENV=development), you can use: `Bearer dev-token`

```bash
# Example with token
curl -H "Authorization: Bearer dev-token" http://localhost:3004/api/reports/statistics
```

---

## 1. Get Statistics

### GET `/api/reports/statistics`
Returns overall statistics for all customers, accounts, and transactions.

**Example:**
```bash
curl -i -H "Authorization: Bearer dev-token" http://localhost:3004/api/reports/statistics
```

**Response (200 OK):**
```json
{
  "message": "Statistics retrieved successfully",
  "data": {
    "timestamp": "2026-05-26T10:30:00.000Z",
    "customers": {
      "total": 1250,
      "active": 950,
      "inactive": 300,
      "newThisMonth": 35
    },
    "accounts": {
      "total": 3200,
      "checking": 1500,
      "savings": 1200,
      "moneyMarket": 500
    },
    "transactions": {
      "total": 28500,
      "thisMonth": 2150,
      "thisWeek": 450
    },
    "balances": {
      "totalBalance": 12500000.50,
      "averagePerAccount": 3906.25
    }
  }
}
```

---

## 2. Generate Account Statement

### POST `/api/reports/account-statement`
Generates an account statement for a specific account in the requested format (JSON, CSV, or PDF).

**Request Body:**
```json
{
  "accountId": "ACC-001",
  "startDate": "2026-01-01",
  "endDate": "2026-05-26",
  "format": "json"
}
```

**Valid Formats:** `json`, `csv`, `pdf`

### Example 1: JSON Format
```bash
curl -X POST http://localhost:3004/api/reports/account-statement \
  -H "Authorization: Bearer dev-token" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "ACC-001",
    "startDate": "2026-01-01",
    "endDate": "2026-05-26",
    "format": "json"
  }'
```

**Response (200 OK):**
```json
{
  "message": "Account statement generated",
  "data": {
    "reportId": "RPT-1716700200000",
    "accountId": "ACC-001",
    "startDate": "2026-01-01",
    "endDate": "2026-05-26",
    "generatedAt": "2026-05-26T10:30:00.000Z",
    "transactions": [
      {
        "id": "TXN001",
        "accountId": "ACC-001",
        "type": "TRANSFER_OUT",
        "amount": 500.00,
        "description": "Transfer to checking",
        "date": "2026-01-15",
        "balance": 4500.00
      },
      {
        "id": "TXN002",
        "accountId": "ACC-001",
        "type": "DEPOSIT",
        "amount": 1200.00,
        "description": "Paycheck deposit",
        "date": "2026-02-01",
        "balance": 5700.00
      }
    ],
    "summary": {
      "totalTransactions": 5,
      "totalDebits": "850.00",
      "totalCredits": "2000.00",
      "netChange": "1150.00",
      "openingBalance": 5000.00,
      "closingBalance": "6150.00"
    }
  }
}
```

### Example 2: CSV Format
```bash
curl -X POST http://localhost:3004/api/reports/account-statement \
  -H "Authorization: Bearer dev-token" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "ACC-002",
    "startDate": "2026-02-01",
    "endDate": "2026-04-30",
    "format": "csv"
  }' \
  -o statement.csv
```

**Output:** Downloads a CSV file with transaction details

### Example 3: PDF Format
```bash
curl -X POST http://localhost:3004/api/reports/account-statement \
  -H "Authorization: Bearer dev-token" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "ACC-003",
    "startDate": "2026-01-01",
    "endDate": "2026-05-26",
    "format": "pdf"
  }' \
  -o statement.pdf
```

**Output:** Downloads a PDF file with formatted statement

---

## 3. Generate Financial Report

### GET `/api/reports/financial`
Generates a comprehensive financial report for the specified date range.

**Query Parameters:**
- `startDate` (optional): Report start date (YYYY-MM-DD)
- `endDate` (optional): Report end date (YYYY-MM-DD)
- `format` (optional): Output format - `json`, `csv`, or `pdf` (default: `json`)

### Example 1: JSON Format (Default)
```bash
curl -i -H "Authorization: Bearer dev-token" \
  "http://localhost:3004/api/reports/financial?startDate=2026-01-01&endDate=2026-05-26&format=json"
```

**Response (200 OK):**
```json
{
  "message": "Financial report generated",
  "data": {
    "reportId": "FIN-1716700200000",
    "startDate": "2026-01-01",
    "endDate": "2026-05-26",
    "generatedAt": "2026-05-26T10:30:00.000Z",
    "summary": {
      "totalRevenue": 250000.50,
      "totalExpenses": 180000.75,
      "netIncome": 70000.75,
      "operatingMargin": "28%",
      "accountsReceivable": 45000.00,
      "accountsPayable": 32000.00
    },
    "breakdown": {
      "byDepartment": {
        "sales": 150000.00,
        "operations": 60000.00,
        "administration": 40000.50
      },
      "byCategory": {
        "salaries": 120000.00,
        "operations": 35000.00,
        "marketing": 15000.75,
        "utilities": 10000.00
      }
    },
    "metrics": {
      "debtToEquityRatio": 0.75,
      "currentRatio": 2.1,
      "quickRatio": 1.8,
      "returnOnAssets": "12%"
    }
  }
}
```

### Example 2: CSV Format
```bash
curl -H "Authorization: Bearer dev-token" \
  "http://localhost:3004/api/reports/financial?startDate=2026-01-01&endDate=2026-05-26&format=csv" \
  -o financial-report.csv
```

### Example 3: PDF Format
```bash
curl -H "Authorization: Bearer dev-token" \
  "http://localhost:3004/api/reports/financial?startDate=2026-01-01&endDate=2026-05-26&format=pdf" \
  -o financial-report.pdf
```

---

## Error Examples

### Missing Authorization Token
```bash
curl http://localhost:3004/api/reports/statistics
```

**Response (401 Unauthorized):**
```json
{
  "error": "Token not provided"
}
```

### Invalid Date Format
```bash
curl -X POST http://localhost:3004/api/reports/account-statement \
  -H "Authorization: Bearer dev-token" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "ACC-001",
    "startDate": "invalid-date",
    "endDate": "2026-05-26",
    "format": "json"
  }'
```

**Response (400 Bad Request):**
```json
{
  "error": "Validation error",
  "details": [
    {
      "message": "\"startDate\" must be a valid date",
      "path": ["startDate"]
    }
  ]
}
```

### Invalid Format
```bash
curl -X POST http://localhost:3004/api/reports/account-statement \
  -H "Authorization: Bearer dev-token" \
  -H "Content-Type: application/json" \
  -d '{
    "accountId": "ACC-001",
    "startDate": "2026-01-01",
    "endDate": "2026-05-26",
    "format": "xml"
  }'
```

**Response (400 Bad Request):**
```json
{
  "error": "Invalid format. Use json, csv, or pdf"
}
```

---

## PowerShell Examples

If using PowerShell instead of curl:

### Get Statistics
```powershell
$headers = @{ "Authorization" = "Bearer dev-token" }
Invoke-WebRequest -Uri "http://localhost:3004/api/reports/statistics" -Headers $headers | ConvertFrom-Json
```

### Account Statement (JSON)
```powershell
$headers = @{
    "Authorization" = "Bearer dev-token"
    "Content-Type" = "application/json"
}
$body = @{
    accountId = "ACC-001"
    startDate = "2026-01-01"
    endDate = "2026-05-26"
    format = "json"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3004/api/reports/account-statement" `
  -Method POST -Headers $headers -Body $body | ConvertFrom-Json
```

### Download PDF Statement
```powershell
$headers = @{
    "Authorization" = "Bearer dev-token"
    "Content-Type" = "application/json"
}
$body = @{
    accountId = "ACC-001"
    startDate = "2026-01-01"
    endDate = "2026-05-26"
    format = "pdf"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3004/api/reports/account-statement" `
  -Method POST -Headers $headers -Body $body `
  -OutFile "statement.pdf"

# Open the PDF
& "statement.pdf"
```

---

## Testing with Postman

1. Create a new request in Postman
2. Set Authorization to "Bearer Token" with value: `dev-token`
3. Use the URLs and request bodies from the examples above
4. For file downloads, set the response type to "blob" or download the file directly

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Dates should be in YYYY-MM-DD format
- The service uses mock data for demonstration
- For production, integrate with actual transaction and financial data sources
- PDF generation requires `pdfkit` package (already included)
- All amounts are in the base currency unit
