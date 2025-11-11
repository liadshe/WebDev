const express = require("express");
const router = express.Router();
const genreController = require("../../controllers/genre");

// return json of contents by given genre
router.get("/:genre", genreController.getContentByGenre);

module.exports = router;