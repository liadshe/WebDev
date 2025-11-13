const express = require('express');
const statisticsController = require('../../controllers/statistics');
const router = express.Router();
const ensureAuth = require("../../middlewares/authMiddleware");

router.get('/', ensureAuth, statisticsController.renderStatisticsPage);

module.exports = router;
