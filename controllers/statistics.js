const { get } = require('mongoose');
const genreService = require('../services/genreService');
const watchService = require('../services/watchService');

const getGenresData =  async (req, res) => {
    const userId = req.session.user._id;

    try {
        const data = await genreService.getUserGenrePopularity(userId);

        if (data.length === 0) {
            return res.status(200).json({
                message: "User found, no favorite genres recorded.",
                data: []
            });
    }
    res.json( data );
} catch (err) {
    console.error("Error fetching genre data:", err);
    res.status(500).json({ error: "Server error fetching genre data" });
}
};

const getDailyWatch = async (req, res) => {
  const userId = req.session.user._id;
  try {
    const data = await watchService.getUserDailyWatch(userId);
    res.status(200).json({
      message: data.length ? "Watch data found." : "User found, no watch logs recorded.",
      data,
    });
  } catch (err) {
    console.error("Error fetching daily watch data:", err);
    res.status(500).json({ error: "Server error fetching daily watch data" });
  }
};

async function renderStatisticsPage(req, res) {
  try {
    const userId = req.session.user._id;
    if (!userId) {
      return res.redirect("/login");
    }

    const genreData = await genreService.getUserGenrePopularity(userId);
    const dailyWatchData = await watchService.getUserDailyWatch(userId);

    res.render("statistics", {
      username: req.session.username,
      genreData,
      dailyWatchData
    });
  } catch (err) {
    console.error("Error loading statistics page:", err);
    res.status(500).send("Server error");
  }
}


module.exports = {
    getGenresData,
    getDailyWatch,
    renderStatisticsPage
};