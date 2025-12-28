const express = require("express");
const cors = require("cors");

/* -------- Route Imports -------- */
const invoiceRoutes = require("./routes/invoiceRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const matchRoutes = require("./routes/matchRoutes");

const app = express();

/* -------- Global Middlewares -------- */
app.use(cors());
app.use(express.json());

/* -------- Health Check -------- */
app.get("/", (req, res) => {
  res.status(200).send("FinWise Backend is Running 🚀");
});

/* -------- API Routes -------- */
app.use("/api/invoices", invoiceRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/match", matchRoutes);

/* -------- 404 Handler -------- */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
