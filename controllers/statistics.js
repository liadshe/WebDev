const genreService = require('../services/genreService');

const getGenresData =  async (req, res) => {
    const userId = req.session.userId;

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

async function renderStatisticsPage(req, res) {
  try {
    const userId = req.session.userId; 

    if (!userId) {
      return res.redirect("/login");
    }

    const genreData = await genreService.getUserGenrePopularity(userId);

    res.render("statistics", {
      username: req.session.username,
      genreData: genreData
    });
  } catch (err) {
    console.error("Error loading statistics page:", err);
    res.status(500).send("Server error");
  }
};

module.exports = {
    getGenresData,
    renderStatisticsPage
};