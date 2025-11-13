const genreService = require("../services/genreService");
const addContentService = require("../services/addContentService");
const loginService = require("../services/loginService");
const recommendationService = require("../services/recommendationService");

async function renderMainPage(req, res) {
  try {
    // Check if user is logged in
    if (!req.session.user) {
      return res.redirect("/login");
    }

    const activeProfileId = req.query.profileId;
    
    const user = await loginService.getUserById(req.session.user._id);
    if (!user) {
      return res.redirect("/login");
    }
    // Fetch genres from the DB
    const genres = await genreService.getAllGenres();

    // Fetch movies from the DB
    //const movies = await addContentService.getAllContent();
    const sortOption = req.query.sort || 'default'; // Get sort parameter from query
     let movies;
    if (sortOption === 'newest') {
      // Get newest 10 items per genre
      movies = await addContentService.getNewestContentByGenre(10);
    } else {
      // Get all content with specified sorting
      movies = await addContentService.getAllContent(sortOption);
    }

    // Group movies by genre
    const moviesByGenre = {};
    genres.forEach((g) => {
      if (sortOption === 'newest') {
        // Limit to 10 newest per genre
        moviesByGenre[g] = movies
          .filter((movie) => movie.genre.includes(g))
          .slice(0, 10);
      } else {
        moviesByGenre[g] = movies.filter((movie) => movie.genre.includes(g));
      }
    });
    
    const activeProfile = req.session.activeProfile;
    
    // If no profile is selected or profile not found, use the first profile
    if (!activeProfile && user.profiles && user.profiles.length > 0) {
      activeProfile = user.profiles[0];
    }
    
    const type = req.query.type || 'all';
    
        // Get most popular content (top 10)
    const mostPopular = await recommendationService.getMostPopularContent(10);
    
    // Get personalized recommendations for active profile
    let personalizedRecommendations = [];
    if (activeProfile) {
      personalizedRecommendations = await recommendationService.getPersonalizedRecommendations(
        req.session.user._id,
        activeProfile.name,
        10
      );
    }

    // Render the main page
    res.render("main", {
      moviesByGenre: moviesByGenre,
      user: req.session.user,
      activeProfile: activeProfileId,
      profile: activeProfile || { picture: 'default.jpg', name: 'User' },
      pageType: type,
      sortOption: sortOption, 
      mostPopular: mostPopular, // Pass most popular content
      personalizedRecommendations: personalizedRecommendations,
      allGenres: genres 

    });
  } catch (err) {
    console.error("Error fetching movies:", err);
    res.status(500).send("Failed to load movies");
  }
}

module.exports = { renderMainPage };
