const Invoice = require("../models/Invoice");
const Transaction = require("../models/Transaction");

exports.matchInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ status: "unmatched" });
    const transactions = await Transaction.find({ matchedInvoice: null });

    const matched = [];

    for (const txn of transactions) {
      for (const inv of invoices) {
        const amountDiff = Math.abs(txn.amount - inv.amount);

        const dateDiff =
          Math.abs(
            new Date(txn.transactionDate) - new Date(inv.invoiceDate)
          ) /
          (1000 * 60 * 60 * 24);

        if (amountDiff <= 5 && dateDiff <= 3) {
          txn.matchedInvoice = inv._id;
          txn.matchScore = 90;
          inv.status = "matched";

          await txn.save();
          await inv.save();

          matched.push({
            transactionId: txn._id,
            invoiceId: inv._id,
            matchScore: 90,
            reason: "Amount and date matched",
          });

          break;
        }
      }
    }

    res.json({
      matched,
      unmatchedTransactions: transactions.filter(
        (t) => !t.matchedInvoice
      ),
      unmatchedInvoices: invoices.filter((i) => i.status !== "matched"),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
