const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");
const Invoice = require("../models/Invoice");

// Helper function to extract structured fields from raw text
function parseInvoiceText(text) {
  // 1. Extract Vendor
  let vendor = "Unknown Vendor";
  const vendorKeywords = [
    { name: "AWS", regex: /AWS|Amazon Web Services/i },
    { name: "Google", regex: /Google/i },
    { name: "GitHub", regex: /GitHub/i },
    { name: "Uber", regex: /Uber/i },
    { name: "Starbucks", regex: /Starbucks/i },
    { name: "Slack", regex: /Slack/i },
    { name: "Zoom", regex: /Zoom/i },
    { name: "Apple", regex: /Apple/i },
    { name: "Adobe", regex: /Adobe/i },
    { name: "Microsoft", regex: /Microsoft/i }
  ];

  for (const kw of vendorKeywords) {
    if (kw.regex.test(text)) {
      vendor = kw.name;
      break;
    }
  }

  if (vendor === "Unknown Vendor") {
    const markers = [
      /Seller:\s*([^\n\r]+)/i,
      /Vendor:\s*([^\n\r]+)/i,
      /From:\s*([^\n\r]+)/i,
      /Invoice From:\s*([^\n\r]+)/i
    ];
    for (const marker of markers) {
      const match = text.match(marker);
      if (match && match[1].trim()) {
        vendor = match[1].trim();
        break;
      }
    }
    
    if (vendor === "Unknown Vendor") {
      const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length > 0) {
        vendor = lines[0].slice(0, 50);
      }
    }
  }

  // 2. Extract Amount
  let amount = 0;
  const amountPatterns = [
    /(?:Total|Amount Due|Total Amount|Grand Total|Balance Due|Amount Paid)[\s:]*[\$₹€]?\s*([\d,]+\.\d{2})/i,
    /(?:Total|Amount Due|Total Amount|Grand Total|Balance Due|Amount Paid)[\s:]*[\$₹€]?\s*([\d,]+)/i,
    /[\$₹€]\s*([\d,]+\.\d{2})/i,
    /[\$₹€]\s*([\d,]+)/i,
    /([\d,]+\.\d{2})/
  ];

  for (const pattern of amountPatterns) {
    const match = text.match(pattern);
    if (match) {
      const cleanVal = match[1].replace(/,/g, "");
      const val = parseFloat(cleanVal);
      if (!isNaN(val) && val > 0) {
        amount = val;
        break;
      }
    }
  }

  // 3. Extract Invoice Date
  let invoiceDate = new Date();
  const datePatterns = [
    /(?:Invoice\s*Date|Date\s*of\s*Issue|Billing\s*Date|Date)[\s:]*([A-Za-z0-9\s,\-\/]+)/i,
    /(\d{4}-\d{2}-\d{2})/,
    /(\d{2}\/\d{2}\/\d{4})/,
    /(\d{2}-\d{2}-\d{4})/
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      const parsedDate = new Date(match[1].trim());
      if (!isNaN(parsedDate.getTime())) {
        invoiceDate = parsedDate;
        break;
      }
    }
  }

  // 4. Extract Invoice Number
  let invoiceNumber = null;
  const invNumPatterns = [
    /(?:Invoice\s*(?:No|Number|#)?)[\s:]*([A-Za-z0-9\-]+)/i,
    /(?:Inv\s*(?:No|Number|#)?)[\s:]*([A-Za-z0-9\-]+)/i
  ];

  for (const pattern of invNumPatterns) {
    const match = text.match(pattern);
    if (match && match[1].trim()) {
      invoiceNumber = match[1].trim();
      break;
    }
  }

  return {
    vendor,
    amount,
    date: invoiceDate,
    invoiceNumber
  };
}

exports.uploadInvoice = async (req, res) => {
  let tempFilePath = null;
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    tempFilePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    const isImage = req.file.mimetype.startsWith("image/") || [".png", ".jpg", ".jpeg"].includes(ext);

    let text = "";
    if (isImage) {
      console.log("Image receipt uploaded. Starting OCR via Tesseract.js...");
      const ocrResult = await Tesseract.recognize(tempFilePath, "eng");
      text = ocrResult.data.text;
      console.log("OCR Text extraction complete.");
    } else {
      console.log("PDF invoice uploaded. Extracting text directly...");
      const dataBuffer = fs.readFileSync(tempFilePath);
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text;
    }

    const parsedData = parseInvoiceText(text);

    const invoice = await Invoice.create({
      vendor: parsedData.vendor,
      amount: parsedData.amount,
      date: parsedData.date,
      invoiceNumber: parsedData.invoiceNumber,
      status: "unmatched"
    });

    res.json({
      message: isImage ? "Receipt image uploaded, OCR parsed & processed" : "Invoice PDF uploaded & processed",
      extractedTextPreview: text.slice(0, 300),
      invoice,
    });
  } catch (err) {
    console.error("Invoice processing error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (err) {
        console.error("Error deleting temp file:", err);
      }
    }
  }
};
