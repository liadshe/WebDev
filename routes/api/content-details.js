const express = require("express");
const router = express.Router();
const contentController = require("../../min/content");

router.get("/:title", contentController.getContentDetailsByTitle);

module.exports = router;