const express = require("express");
const router = express.Router();
const { renderAddConentPage, handleContentSubmission } = require("../../controllers/content");

// Render the add-content page
router.get("/", renderAddConentPage);

// Handle add-content form submission
//router.post("/", handleContentSubmission);
module.exports = router;