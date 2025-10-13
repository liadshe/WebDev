const express = require("express");
const router = express.Router();
//const { render } = require("../../controllers/settings");
const { getAllProfiles } = require("../../controllers/settings");

router.get("/", getAllProfiles);

module.exports = router;