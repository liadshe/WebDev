const Content = require("../models/Content");

async function renderMainPage(req, res) {
  try {
    const movie = await Content.findById(req.params.id).lean();
    if (!movie) return res.status(404).send("Movie not found");

    const user = req.session.user;
    const activeProfile = req.session.activeProfile || {
      name: "Default Profile",
    };

    return res.render("watch", { movie, user, activeProfile });
  } catch (err) {
    console.error("❌ Error rendering watch page:", err);
    return res.status(500).send("Error loading watch page");
  }
}

module.exports = { renderMainPage };
