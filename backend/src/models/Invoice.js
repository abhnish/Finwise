const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  vendor: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  invoiceDate: {
    type: Date,
    required: true,
  },
  invoiceNumber: {
    type: String,
  },
  status: {
    type: String,
    enum: ["matched", "unmatched"],
    default: "unmatched",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
