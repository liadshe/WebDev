const express = require("express");
const router = express.Router();
const contentController = require("../../controllers/content");

router.get("/:title", contentController.getContentDetailsByTitle);

module.exports = router;