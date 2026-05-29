const Invoice = require("../models/Invoice");
const Transaction = require("../models/Transaction");
const { calculateOverallScore } = require("../utils/scoreEngine");

exports.matchInvoices = async (req, res) => {
  try {
    // Read threshold from request body, default to 75
    const threshold = req.body.threshold !== undefined ? Number(req.body.threshold) : 75;

    const invoices = await Invoice.find({ status: "unmatched" });
    const transactions = await Transaction.find({ matchedInvoice: null });

    const matched = [];
    const matchedInvoiceIds = new Set();

    for (const txn of transactions) {
      let bestMatch = null;
      let bestScore = -1;
      let scoreBreakdown = null;

      for (const inv of invoices) {
        if (matchedInvoiceIds.has(inv.id)) {
          continue;
        }

        const scores = calculateOverallScore(txn, inv);

        if (scores.overallScore >= threshold && scores.overallScore > bestScore) {
          bestScore = scores.overallScore;
          bestMatch = inv;
          scoreBreakdown = scores;
        }
      }

      if (bestMatch) {
        // Generate a descriptive, premium match reason
        let reason = `Score ${bestScore}%: `;
        const reasons = [];
        if (scoreBreakdown.amountScore >= 95) {
          reasons.push("amounts match exactly");
        } else if (scoreBreakdown.amountScore >= 80) {
          reasons.push("amounts are very close");
        } else if (scoreBreakdown.amountScore >= 50) {
          reasons.push("amounts are similar");
        }

        if (scoreBreakdown.dateScore === 100) {
          reasons.push("txn date is within the bank's 3-day settlement window");
        } else if (scoreBreakdown.dateScore >= 80) {
          reasons.push("dates are very close");
        } else if (scoreBreakdown.dateScore >= 50) {
          reasons.push("dates are near");
        }

        if (scoreBreakdown.textScore >= 80) {
          reasons.push("strong vendor keyword alignment");
        } else if (scoreBreakdown.textScore >= 40) {
          reasons.push("partial vendor name match");
        }

        if (reasons.length > 0) {
          reason += reasons.join(", ");
        } else {
          reason += "general combination of proximity matches";
        }

        txn.matchedInvoice = bestMatch.id;
        txn.matchScore = bestScore;
        txn.reason = reason;
        bestMatch.status = "matched";

        await txn.save();
        await bestMatch.save();

        matchedInvoiceIds.add(bestMatch.id);

        matched.push({
          invoiceId: bestMatch.id,
          transactionId: txn.id,
          amount: txn.amount,
          matchScore: bestScore,
          reason: reason,
        });
      }
    }

    // Refresh count values
    const allInvoices = await Invoice.find();
    const allTransactions = await Transaction.find();

    const unmatchedInvoices = allInvoices.filter(i => i.status !== "matched");
    const unmatchedTransactions = allTransactions.filter(t => !t.matchedInvoice);

    res.json({
      // Dashboard.jsx expected stats
      totalMatches: matched.length,
      invoicesProcessed: allInvoices.length,
      unmatchedItems: unmatchedInvoices.length + unmatchedTransactions.length,
      details: matched,

      // Backward compatibility format
      matched,
      unmatchedTransactions,
      unmatchedInvoices
    });
  } catch (err) {
    console.error("Reconciliation matching error:", err);
    res.status(500).json({ error: err.message });
  }
};
