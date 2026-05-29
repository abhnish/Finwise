const fs = require("fs");
const Transaction = require("../models/Transaction");

// Custom zero-dependency CSV parser
function parseCSV(text) {
  const lines = text.split(/\r?\n/);
  const result = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const row = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    result.push(row);
  }
  return result;
}

exports.createTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.uploadStatement = async (req, res) => {
  let tempFilePath = null;
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No statement file uploaded" });
    }

    tempFilePath = req.file.path;
    const csvContent = fs.readFileSync(tempFilePath, "utf8");
    const rows = parseCSV(csvContent);

    if (rows.length < 2) {
      return res.status(400).json({ error: "CSV file is empty or has insufficient rows" });
    }

    const headers = rows[0].map(h => h.toLowerCase().trim());
    
    // Find column indices based on keyword matching
    let dateIdx = headers.findIndex(h => h.includes("date") || h.includes("txn") || h.includes("time"));
    let descIdx = headers.findIndex(h => h.includes("desc") || h.includes("narrative") || h.includes("particular") || h.includes("memo") || h.includes("detail") || h.includes("payee") || h.includes("description"));
    let amtIdx = headers.findIndex(h => h.includes("amt") || h.includes("amount") || h.includes("value") || h.includes("total") || h.includes("price") || h.includes("debit") || h.includes("credit"));
    let catIdx = headers.findIndex(h => h.includes("cat") || h.includes("type") || h.includes("group") || h.includes("category"));

    // Fallbacks if headers not detected
    if (dateIdx === -1) dateIdx = 0;
    if (descIdx === -1) descIdx = 1;
    if (amtIdx === -1) amtIdx = 2;
    if (catIdx === -1) catIdx = 3;

    const imported = [];
    
    // Skip header row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length <= Math.max(dateIdx, descIdx, amtIdx)) continue;

      const dateStr = row[dateIdx];
      const descStr = row[descIdx];
      const amtStr = row[amtIdx];
      const catStr = catIdx !== -1 && catIdx < row.length ? row[catIdx] : "Uncategorized";

      if (!descStr || !amtStr) continue;

      // Clean amount string from commas, currency symbols, and extra spaces
      const cleanAmt = amtStr.replace(/[\$₹€,\s]/g, "");
      const amount = parseFloat(cleanAmt);
      if (isNaN(amount)) continue;

      // Parse date
      let date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        date = new Date();
      }

      const txn = await Transaction.create({
        description: descStr,
        amount,
        date,
        category: catStr
      });
      
      imported.push(txn);
    }

    res.json({
      message: `${imported.length} transactions successfully imported`,
      count: imported.length,
      transactions: imported
    });
  } catch (err) {
    console.error("Statement upload error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (err) {
        console.error("Error deleting CSV temp file:", err);
      }
    }
  }
};
