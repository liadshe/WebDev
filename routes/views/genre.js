const express = require("express");
const router = express.Router();
const contentController = require("../../controllers/content");

router.get("/:genre", contentController.renderGenrePage);

module.exports = router;