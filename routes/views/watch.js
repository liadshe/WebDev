const express = require("express");
const router = express.Router();
const { renderWatchPage } = require("../../controllers/watch");

// /watch/:id page
router.get("/:id", renderWatchPage);

module.exports = router;
