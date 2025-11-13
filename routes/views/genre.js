const express = require("express");
const router = express.Router();
const genreController = require("../../controllers/genre");
const ensureAuth = require("../../middlewares/authMiddleware");

router.get("/:genre", ensureAuth, genreController.renderGenrePage);

module.exports = router;