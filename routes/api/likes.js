const express = require("express");
const router = express.Router();
const likesController = require("../../controllers/likes");

router.post("/toggle", likesController.toggleLike);

module.exports = router;
