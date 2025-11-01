const express = require('express');
const statisticsController = require('../../controllers/statistics');
const router = express.Router();

router.get('/:userId/genre-popularity', statisticsController.getGenresData);

module.exports = router;