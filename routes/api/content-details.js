const express = require("express");
const router = express.Router();
const contentDetailsController = require("../../controllers/content-details");

router.get("/:title", contentDetailsController.getContentDetailsByTitle);

module.exports = router;