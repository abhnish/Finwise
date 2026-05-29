/**
 * Scoring logic engine for transaction and invoice reconciliation
 */

/**
 * Calculates similarity score based on amount difference.
 * - Exact match: 100 pts
 * - Linear decay up to $10 difference: 0 pts
 */
function calculateAmountScore(txnAmount, invAmount) {
  const diff = Math.abs(Number(txnAmount) - Number(invAmount));
  return Math.max(0, Math.round(100 - diff * 10));
}

/**
 * Calculates similarity score based on date difference in days.
 * Bank transactions usually settle 0 to 3 days AFTER the invoice date.
 * - Within 0 to 3 days after: 100 pts (Perfect Window)
 * - Before invoice date: decays linearly to 0 over 3 days
 * - More than 3 days after invoice date: decays linearly to 0 over the next 7 days (up to 10 days)
 */
function calculateDateScore(txnDate, invDate) {
  const tDate = new Date(txnDate);
  const iDate = new Date(invDate);
  
  if (isNaN(tDate.getTime()) || isNaN(iDate.getTime())) {
    return 0;
  }

  // Difference in days (txnDate - invDate)
  const diffTime = tDate.getTime() - iDate.getTime();
  const daysDiff = diffTime / (1000 * 60 * 60 * 24);

  if (daysDiff >= 0 && daysDiff <= 3) {
    return 100;
  }

  if (daysDiff < 0) {
    // Transaction date is before invoice date: decay over 3 days
    return Math.max(0, Math.round(100 - Math.abs(daysDiff) * 33.3));
  } else {
    // Transaction date is > 3 days after invoice date: decay over next 7 days
    const excessDays = daysDiff - 3;
    return Math.max(0, Math.round(100 - excessDays * 14.3));
  }
}

/**
 * Calculates text similarity between transaction description and invoice vendor.
 * Token-based matching: checks word overlap.
 */
function calculateTextScore(txnDesc, invVendor) {
  if (!txnDesc || !invVendor) {
    return 0;
  }

  const normalize = (str) =>
    str.toLowerCase()
       .replace(/[^a-z0-9\s]/g, "")
       .split(/\s+/)
       .filter(w => w.length >= 3);

  const txnWords = normalize(txnDesc);
  const invWords = normalize(invVendor);

  if (txnWords.length === 0 || invWords.length === 0) {
    return 0;
  }

  // Count how many words in the vendor name are found in the transaction description
  let matches = 0;
  for (const word of invWords) {
    if (txnWords.includes(word)) {
      matches++;
    }
  }

  return Math.round((matches / invWords.length) * 100);
}

/**
 * Calculates the overall match score between a transaction and an invoice.
 * Weights: Amount (50%), Date (30%), Text/Vendor (20%)
 */
function calculateOverallScore(transaction, invoice) {
  const amountScore = calculateAmountScore(transaction.amount, invoice.amount);
  const dateScore = calculateDateScore(transaction.date, invoice.date);
  const textScore = calculateTextScore(transaction.description, invoice.vendor);

  const overallScore = Math.round(
    amountScore * 0.5 + 
    dateScore * 0.3 + 
    textScore * 0.2
  );

  return {
    overallScore,
    amountScore,
    dateScore,
    textScore
  };
}

module.exports = {
  calculateAmountScore,
  calculateDateScore,
  calculateTextScore,
  calculateOverallScore
};
