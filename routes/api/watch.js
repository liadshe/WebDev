const express = require("express");
const router = express.Router();
const watchController = require("../../controllers/watchController");

router.post("/progress", watchController.saveProgress);
router.post("/reset-series", watchController.handleResetSeriesHistory);
router.get(
  "/progress/:userId/:profileName/:contentId",
  watchController.fetchProgress
);

module.exports = router;
