const genreService = require("../services/genreService");
const addContentService = require("../services/addContentService");
const loginService = require("../services/loginService");

async function renderMainPage(req, res) {
  try {
    // Check if user is logged in
    if (!req.session.user) {
      console.log("User not logged in, redirecting to /login");
      return res.redirect("/login");
    }

    const activeProfileId = req.query.profileId;
    
    const user = await loginService.getUserById(req.session.user._id);
    if (!user) {
      console.log("User not found, redirecting to /login");
      return res.redirect("/login");
    }
    // Fetch genres from the DB
    const genres = await genreService.getAllGenres();

    // Fetch movies from the DB
    const movies = await addContentService.getAllContent();

    // Group movies by genre
    const moviesByGenre = {};
    genres.forEach((g) => {
      moviesByGenre[g] = movies.filter((movie) => movie.genre.includes(g));
    });
    
    // Find the active profile
    let activeProfile = null;
    if (activeProfileId) {
      activeProfile = user.profiles.id(activeProfileId);
    }
    
    // If no profile is selected or profile not found, use the first profile
    if (!activeProfile && user.profiles && user.profiles.length > 0) {
      activeProfile = user.profiles[0];
    }
    
    const type = req.query.type || 'all';
    
    // Render the main page
    res.render("main", {
      moviesByGenre: moviesByGenre,
      user: req.session.user,
      activeProfile: activeProfileId,
      profile: activeProfile || { picture: 'default.jpg', name: 'User' },
      pageType: type,

    });
  } catch (err) {
    console.error("Error fetching movies:", err);
    res.status(500).send("Failed to load movies");
  }
}


module.exports = { renderMainPage };
