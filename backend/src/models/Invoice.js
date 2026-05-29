const { pool } = require("../config/db");

class Invoice {
  constructor(data) {
    this.id = data.id;
    this.vendor = data.vendor;
    this.amount = typeof data.amount === "string" ? parseFloat(data.amount) : data.amount;
    this.date = data.date;
    this.invoiceNumber = data.invoice_number || data.invoiceNumber;
    this.status = data.status;
    this.createdAt = data.created_at || data.createdAt;
  }

  // Create an invoice
  static async create(data) {
    const { vendor, amount, date, invoiceNumber, status } = data;
    const query = `
      INSERT INTO invoices (vendor, amount, date, invoice_number, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [
      vendor,
      amount,
      date || new Date(),
      invoiceNumber || null,
      status || "unmatched"
    ];
    const { rows } = await pool.query(query, values);
    return new Invoice(rows[0]);
  }

  // Find invoices based on options
  static async find(filter = {}) {
    let query = "SELECT * FROM invoices";
    const values = [];

    if (filter.status) {
      query += " WHERE status = $1";
      values.push(filter.status);
    }

    query += " ORDER BY created_at DESC";

    const { rows } = await pool.query(query, values);
    return rows.map(row => new Invoice(row));
  }

  // Save/update instance
  async save() {
    const query = `
      UPDATE invoices
      SET vendor = $1, amount = $2, date = $3, invoice_number = $4, status = $5
      WHERE id = $6
      RETURNING *
    `;
    const values = [
      this.vendor,
      this.amount,
      this.date,
      this.invoiceNumber,
      this.status,
      this.id
    ];
    const { rows } = await pool.query(query, values);
    if (rows.length > 0) {
      const updated = rows[0];
      this.vendor = updated.vendor;
      this.amount = parseFloat(updated.amount);
      this.date = updated.date;
      this.invoiceNumber = updated.invoice_number;
      this.status = updated.status;
    }
    return this;
  }
}

module.exports = Invoice;
