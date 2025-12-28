const express = require("express");
const { matchInvoices } = require("../controllers/matchController");

const router = express.Router();

router.post("/", matchInvoices);

module.exports = router;
