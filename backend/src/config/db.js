const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://localhost/finwise"
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("PostgreSQL Connected successfully");
    
    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        vendor VARCHAR(255) NOT NULL,
        amount NUMERIC(12, 2) NOT NULL,
        date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        invoice_number VARCHAR(100),
        status VARCHAR(50) DEFAULT 'unmatched',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        description TEXT NOT NULL,
        amount NUMERIC(12, 2) NOT NULL,
        date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        category VARCHAR(100) DEFAULT 'Uncategorized',
        matched_invoice INTEGER REFERENCES invoices(id) ON DELETE SET NULL DEFAULT NULL,
        match_score INTEGER DEFAULT 0,
        reason TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure reason column exists for existing tables
    await client.query(`
      ALTER TABLE transactions ADD COLUMN IF NOT EXISTS reason TEXT;
    `);

    // Seed mock transactions if table is empty
    const txnCheck = await client.query("SELECT COUNT(*) FROM transactions");
    const count = parseInt(txnCheck.rows[0].count, 10);
    if (count === 0) {
      console.log("Seeding mock transactions...");
      const mockTxns = [
        ["AWS Cloud Services", 150.00, new Date(Date.now() - 24 * 60 * 60 * 1000), "Infrastructure"],
        ["Google Workspace Suite", 45.50, new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), "Software"],
        ["Github Copilot Enterprise", 19.00, new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), "Software"],
        ["Uber Business Ride", 24.50, new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), "Travel"],
        ["Starbucks Coffee", 12.80, new Date(Date.now() - 12 * 60 * 60 * 1000), "Meals"],
        ["Zoom Video Communications", 14.99, new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), "Software"],
        ["Slack Technologies", 8.00, new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), "Software"]
      ];

      for (const txn of mockTxns) {
        await client.query(
          "INSERT INTO transactions (description, amount, date, category) VALUES ($1, $2, $3, $4)",
          txn
        );
      }
      console.log("Mock transactions seeded!");
    }

    client.release();
  } catch (err) {
    console.error("PostgreSQL connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
module.exports.pool = pool;
