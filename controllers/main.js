const genreService = require("../services/genreService");
const addContentService = require("../services/addContentService");

async function renderMainPage(req, res) {
  try {
    // Check if user is logged in
    if (!req.session.user) {
      console.log("User not logged in, redirecting to /login");
      return res.redirect("/login");
    }
    const activeProfileId = req.query.profileId;
    // Fetch genres from the DB
    const genres = await genreService.getAllGenres();

    // Fetch movies from the DB
    const movies = await addContentService.getAllContent();

    // Group movies by genre
    const moviesByGenre = {};
    genres.forEach((g) => {
      moviesByGenre[g] = movies.filter((movie) => movie.genre.includes(g));
    });

    console.log("Movies by genre:", Object.keys(moviesByGenre));

    // Render the main page
    res.render("main", {
      moviesByGenre: moviesByGenre,
      user: req.session.user,
      activeProfile: activeProfileId,
    });
  } catch (err) {
    console.error("Error fetching movies:", err);
    res.status(500).send("Failed to load movies");
  }
}


module.exports = { renderMainPage };
