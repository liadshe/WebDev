const Content = require("../models/Content");

async function renderMainPage(req, res) {
  try {
    // Check if user is logged in
    if (!req.session.user) {
      console.log("User not logged in, redirecting to /login");
      return res.redirect("/login");
    }

    // Fetch movies from the DB
    const movies = await Content.find({}).lean();

    // Pull data from session
    const user = req.session.user;
    const activeProfile = req.session.activeProfile || {
      name: "Default Profile",
    };
    console.log(
      `Rendering main page for user: ${user.username}, profile: ${activeProfile.name}`
    );

    // Render the main page
    res.render("main", { movies, user, activeProfile });
  } catch (err) {
    console.error("Error fetching movies:", err);
    res.status(500).send("Failed to load movies");
  }
}

module.exports = { renderMainPage };
