const express = require("express");
const router = express.Router();
const ensureAuth = require("../../middlewares/authMiddleware");
const { renderSettingsPage } = require("../../controllers/settings");

router.get("/", ensureAuth, renderSettingsPage);


module.exports = router;