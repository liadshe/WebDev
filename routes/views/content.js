const express = require("express");
const multer = require("multer");
const path = require('path');
const fs = require('fs');
const { renderAddConentPage, handleContentSubmission } = require("../../controllers/content");

const router = express.Router();

// ensure uploads dir exists
const uploadsDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// multer storage config
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadsDir);
	},
	filename: function (req, file, cb) {
		const safe = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
		cb(null, safe);
	}
});
const upload = multer({ storage });

router.get("/", renderAddConentPage);

// accept both files (coverImageFile and videoFile)
router.post("/", upload.fields([{ name: 'coverImageFile', maxCount: 1 }, { name: 'videoFile', maxCount: 1 }]), handleContentSubmission);

module.exports = router;
