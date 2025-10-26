const express = require("express");
const router = express.Router();
const { handleRegister } = require("../../controllers/register");

// Handle Register form submission
router.post("/", handleRegister);

module.exports = router;
