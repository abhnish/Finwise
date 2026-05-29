const express = require("express");
const multer = require("multer");
const router = express.Router();

const transactionController = require("../controllers/transactionController");
const upload = multer({ dest: "uploads/" });

router.post("/", transactionController.createTransaction);
router.get("/", transactionController.getTransactions);
router.post("/upload", upload.single("file"), transactionController.uploadStatement);

module.exports = router;
