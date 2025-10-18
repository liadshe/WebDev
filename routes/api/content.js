const express = require("express");
const router = express.Router();
const {
  addContent,
  getAllContent,
  getContentById,
  updateContentById,
  deleteContentById,
} = require("../../controllers/content");


// CREATE - Add a new content
router.post("/", addContent);

// READ - Get all content
///api/content/
router.get("/", getAllContent);

// READ - Get content by id
router.get("/:id", getContentById);

// UPDATE - Update content by id
router.put("/:id", updateContentById);

// DELETE - Delete content by id
router.delete("/:id", deleteContentById);

module.exports = router;

const form = document.getElementById("addContentForm");

