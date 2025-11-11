const express = require("express");
const router = express.Router();
const genreController = require("../../controllers/genre");

router.get("/:genre", genreController.renderGenrePage);

module.exports = router;