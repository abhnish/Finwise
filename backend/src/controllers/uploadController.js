const fs = require("fs");
const pdfParse = require("pdf-parse");
const Invoice = require("../models/Invoice");

exports.uploadInvoice = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;

    const amountMatch = text.match(/₹\s?([\d,]+)/);
    const amount = amountMatch
      ? Number(amountMatch[1].replace(/,/g, ""))
      : 0;

    const invoice = await Invoice.create({
      vendor: "Unknown",
      amount,
      invoiceDate: new Date(),
    });

    res.json({
      message: "Invoice uploaded & processed",
      extractedTextPreview: text.slice(0, 300),
      invoice,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
