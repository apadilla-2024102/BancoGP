const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const PDFDocument = require('pdfkit');

const reportController = {
  generateAccountStatement: async (req, res, next) => {
    try {
      const { accountId, startDate, endDate, format } = req.body;
      const reportId = `RPT-${Date.now()}`;

      // Validate dates
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({
          error: 'Invalid date format. Use YYYY-MM-DD format'
        });
      }

      // Mock transaction data
      const transactions = [
        {
          id: 'TXN001',
          accountId,
          type: 'TRANSFER_OUT',
          amount: 500.00,
          description: 'Transfer to checking',
          date: '2026-01-15',
          balance: 4500.00
        },
        {
          id: 'TXN002',
          accountId,
          type: 'DEPOSIT',
          amount: 1200.00,
          description: 'Paycheck deposit',
          date: '2026-02-01',
          balance: 5700.00
        },
        {
          id: 'TXN003',
          accountId,
          type: 'WITHDRAWAL',
          amount: 200.00,
          description: 'ATM withdrawal',
          date: '2026-02-10',
          balance: 5500.00
        },
        {
          id: 'TXN004',
          accountId,
          type: 'TRANSFER_IN',
          amount: 800.00,
          description: 'Transfer from savings',
          date: '2026-03-05',
          balance: 6300.00
        },
        {
          id: 'TXN005',
          accountId,
          type: 'BILL_PAYMENT',
          amount: 150.00,
          description: 'Utility bill payment',
          date: '2026-03-15',
          balance: 6150.00
        }
      ];

      // Filter transactions by date range
      const filteredTransactions = transactions.filter(t => {
        const txDate = new Date(t.date);
        return txDate >= start && txDate <= end;
      });

      const totalDebits = filteredTransactions
        .filter(t => ['TRANSFER_OUT', 'WITHDRAWAL', 'BILL_PAYMENT'].includes(t.type))
        .reduce((sum, t) => sum + t.amount, 0);

      const totalCredits = filteredTransactions
        .filter(t => ['DEPOSIT', 'TRANSFER_IN'].includes(t.type))
        .reduce((sum, t) => sum + t.amount, 0);

      const reportData = {
        reportId,
        accountId,
        startDate,
        endDate,
        generatedAt: new Date().toISOString(),
        transactions: filteredTransactions,
        summary: {
          totalTransactions: filteredTransactions.length,
          totalDebits: totalDebits.toFixed(2),
          totalCredits: totalCredits.toFixed(2),
          netChange: (totalCredits - totalDebits).toFixed(2),
          openingBalance: 5000.00,
          closingBalance: (5000 + totalCredits - totalDebits).toFixed(2)
        }
      };

      // Si solicita descarga de archivo
      if (format === 'csv') {
        const csv = generateCSV(reportData);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="statement-${reportId}.csv"`);
        return res.send(csv);
      }

      if (format === 'pdf') {
        const pdf = generatePDF(reportData);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="statement-${reportId}.pdf"`);
        return pdf.pipe(res);
      }

      // Por defecto retorna JSON con URL de descarga simulada
      res.status(200).json({
        message: 'Account statement generated',
        data: {
          reportId,
          accountId,
          url: `/reports/download/${reportId}`,
          summary: reportData.summary
        }
      });
    } catch (error) {
      next(error);
    }
  },

  generateFinancialReport: async (req, res, next) => {
    try {
      const { startDate, endDate, format } = req.query;
      const reportId = `FIN-${Date.now()}`;

      const financialData = {
        reportId,
        startDate: startDate || '2026-01-01',
        endDate: endDate || new Date().toISOString().split('T')[0],
        generatedAt: new Date().toISOString(),
        summary: {
          totalRevenue: 250000.50,
          totalExpenses: 180000.75,
          netIncome: 70000.75,
          operatingMargin: '28%',
          accountsReceivable: 45000.00,
          accountsPayable: 32000.00
        },
        breakdown: {
          byDepartment: {
            sales: 150000.00,
            operations: 60000.00,
            administration: 40000.50
          },
          byCategory: {
            salaries: 120000.00,
            operations: 35000.00,
            marketing: 15000.75,
            utilities: 10000.00
          }
        },
        metrics: {
          debtToEquityRatio: 0.75,
          currentRatio: 2.1,
          quickRatio: 1.8,
          returnOnAssets: '12%'
        }
      };

      // Si solicita descarga de archivo
      if (format === 'csv') {
        const csv = generateFinancialCSV(financialData);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="financial-${reportId}.csv"`);
        return res.send(csv);
      }

      if (format === 'pdf') {
        const pdf = generateFinancialPDF(financialData);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="financial-${reportId}.pdf"`);
        return pdf.pipe(res);
      }

      // Por defecto retorna JSON con URL de descarga simulada
      res.status(200).json({
        message: 'Financial report generated',
        data: {
          reportId,
          url: `/reports/download/${reportId}`,
          summary: financialData.summary
        }
      });
    } catch (error) {
      next(error);
    }
  },

  getStatistics: async (req, res, next) => {
    try {
      const statistics = {
        totalCustomers: 1250,
        activeCustomers: 950,
        inactiveCustomers: 300,
        newCustomersThisMonth: 35,
        totalAccounts: 3200,
        checkingAccounts: 1500,
        savingsAccounts: 1200,
        moneyMarketAccounts: 500,
        totalTransactions: 28500,
        transactionsThisMonth: 2150,
        transactionsThisWeek: 450,
        dailyDeposits: 120,
        dailyWithdrawals: 85,
        dailyTransfers: 245,
        totalBalance: 12500000.50,
        averageBalance: 3906.25,
        medianBalance: 2500.00,
        largestBalance: 500000.00,
        smallestBalance: 50.00,
        averageTransactionAmount: 438.60,
        totalDeposits: 6250000.00,
        totalWithdrawals: 5200000.00,
        netFlowThisMonth: 1050000.00
      };

      res.status(200).json({
        message: 'Statistics retrieved successfully',
        data: statistics
      });
    } catch (error) {
      next(error);
    }
  }
};

// Helper function to generate CSV
function generateCSV(reportData) {
  let csv = 'Account Statement Report\n';
  csv += `Report ID: ${reportData.reportId}\n`;
  csv += `Account ID: ${reportData.accountId}\n`;
  csv += `Period: ${reportData.startDate} to ${reportData.endDate}\n`;
  csv += `Generated: ${reportData.generatedAt}\n\n`;

  csv += 'Opening Balance,Total Credits,Total Debits,Net Change,Closing Balance\n';
  csv += `${reportData.summary.openingBalance},${reportData.summary.totalCredits},${reportData.summary.totalDebits},${reportData.summary.netChange},${reportData.summary.closingBalance}\n\n`;

  csv += 'Transaction Details\n';
  csv += 'Date,Type,Description,Amount,Balance\n';
  reportData.transactions.forEach(t => {
    csv += `${t.date},${t.type},"${t.description}",${t.amount},${t.balance}\n`;
  });

  return csv;
}

// Helper function to generate PDF
function generatePDF(reportData) {
  const doc = new PDFDocument();
  
  doc.fontSize(20).text('Account Statement', { align: 'center' });
  doc.fontSize(12);
  doc.text(`Report ID: ${reportData.reportId}`);
  doc.text(`Account ID: ${reportData.accountId}`);
  doc.text(`Period: ${reportData.startDate} to ${reportData.endDate}`);
  doc.text(`Generated: ${new Date(reportData.generatedAt).toLocaleString()}`);
  
  doc.moveDown();
  doc.fontSize(14).text('Summary', { underline: true });
  doc.fontSize(11);
  doc.text(`Total Transactions: ${reportData.summary.totalTransactions}`);
  doc.text(`Opening Balance: $${reportData.summary.openingBalance}`);
  doc.text(`Total Credits: $${reportData.summary.totalCredits}`);
  doc.text(`Total Debits: $${reportData.summary.totalDebits}`);
  doc.text(`Closing Balance: $${reportData.summary.closingBalance}`);
  
  doc.moveDown();
  doc.fontSize(14).text('Transaction Details', { underline: true });
  doc.fontSize(10);
  
  doc.text('Date | Type | Description | Amount');
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  
  reportData.transactions.forEach(t => {
    doc.text(`${t.date} | ${t.type} | ${t.description.substring(0, 20)} | $${t.amount}`);
  });
  
  doc.end();
  return doc;
}

// Helper function to generate Financial Report CSV
function generateFinancialCSV(reportData) {
  let csv = 'Financial Report\n';
  csv += `Report ID: ${reportData.reportId}\n`;
  csv += `Period: ${reportData.startDate} to ${reportData.endDate}\n`;
  csv += `Generated: ${reportData.generatedAt}\n\n`;

  csv += 'Metric,Value\n';
  csv += `Total Revenue,"$${reportData.summary.totalRevenue}"\n`;
  csv += `Total Expenses,"$${reportData.summary.totalExpenses}"\n`;
  csv += `Net Income,"$${reportData.summary.netIncome}"\n`;
  csv += `Operating Margin,${reportData.summary.operatingMargin}\n\n`;

  csv += 'By Department,Amount\n';
  Object.entries(reportData.breakdown.byDepartment).forEach(([dept, amount]) => {
    csv += `${dept},"$${amount}"\n`;
  });

  return csv;
}

// Helper function to generate Financial Report PDF
function generateFinancialPDF(reportData) {
  const doc = new PDFDocument();
  
  doc.fontSize(20).text('Financial Report', { align: 'center' });
  doc.fontSize(12);
  doc.text(`Report ID: ${reportData.reportId}`);
  doc.text(`Period: ${reportData.startDate} to ${reportData.endDate}`);
  doc.text(`Generated: ${new Date(reportData.generatedAt).toLocaleString()}`);
  
  doc.moveDown();
  doc.fontSize(14).text('Financial Summary', { underline: true });
  doc.fontSize(11);
  doc.text(`Total Revenue: $${reportData.summary.totalRevenue}`);
  doc.text(`Total Expenses: $${reportData.summary.totalExpenses}`);
  doc.text(`Net Income: $${reportData.summary.netIncome}`);
  doc.text(`Operating Margin: ${reportData.summary.operatingMargin}`);
  
  doc.moveDown();
  doc.fontSize(14).text('Revenue by Department', { underline: true });
  doc.fontSize(11);
  Object.entries(reportData.breakdown.byDepartment).forEach(([dept, amount]) => {
    doc.text(`${dept}: $${amount}`);
  });
  
  doc.moveDown();
  doc.fontSize(14).text('Financial Metrics', { underline: true });
  doc.fontSize(11);
  Object.entries(reportData.metrics).forEach(([metric, value]) => {
    doc.text(`${metric}: ${value}`);
  });
  
  doc.end();
  return doc;
}

module.exports = reportController;
