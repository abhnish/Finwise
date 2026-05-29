const { pool } = require("../config/db");

class Transaction {
  constructor(data) {
    this.id = data.id;
    this.description = data.description;
    this.amount = typeof data.amount === "string" ? parseFloat(data.amount) : data.amount;
    this.date = data.date;
    this.category = data.category || "Uncategorized";
    this.matchedInvoice = data.matched_invoice || null;
    this.matched = !!this.matchedInvoice; // Boolean flag for frontend
    this.matchScore = data.match_score || 0;
    this.reason = data.reason || null;
    this.createdAt = data.created_at || data.createdAt;
  }

  // Create a transaction
  static async create(data) {
    const { description, amount, date, category, matchedInvoice, matchScore, reason } = data;
    const query = `
      INSERT INTO transactions (description, amount, date, category, matched_invoice, match_score, reason)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      description,
      amount,
      date || new Date(),
      category || "Uncategorized",
      matchedInvoice || null,
      matchScore || 0,
      reason || null
    ];
    const { rows } = await pool.query(query, values);
    return new Transaction(rows[0]);
  }

  // Find transactions based on options
  static async find(filter = {}) {
    let query = "SELECT * FROM transactions";
    const values = [];

    // Map matchedInvoice filter: { matchedInvoice: null }
    if (filter.hasOwnProperty("matchedInvoice")) {
      if (filter.matchedInvoice === null) {
        query += " WHERE matched_invoice IS NULL";
      } else {
        query += " WHERE matched_invoice = $1";
        values.push(filter.matchedInvoice);
      }
    }

    query += " ORDER BY date DESC";

    const { rows } = await pool.query(query, values);
    return rows.map(row => new Transaction(row));
  }

  // Save/update instance
  async save() {
    const query = `
      UPDATE transactions
      SET description = $1, amount = $2, date = $3, category = $4, matched_invoice = $5, match_score = $6, reason = $7
      WHERE id = $8
      RETURNING *
    `;
    const values = [
      this.description,
      this.amount,
      this.date,
      this.category,
      this.matchedInvoice,
      this.matchScore,
      this.reason,
      this.id
    ];
    const { rows } = await pool.query(query, values);
    if (rows.length > 0) {
      const updated = rows[0];
      this.description = updated.description;
      this.amount = parseFloat(updated.amount);
      this.date = updated.date;
      this.category = updated.category;
      this.matchedInvoice = updated.matched_invoice;
      this.matched = !!updated.matched_invoice;
      this.matchScore = updated.match_score;
      this.reason = updated.reason;
    }
    return this;
  }
}

module.exports = Transaction;
