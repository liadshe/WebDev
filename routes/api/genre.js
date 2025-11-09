const express = require("express");
const router = express.Router();
const contentController = require("../../controllers/content");

// return json of contents by given genre
router.get("/:genre", contentController.getContentByGenre);

module.exports = router;