const Content = require("../models/Content");
const Episode = require("../models/Episode");

async function renderWatchPage(req, res) {
  try {
    if (!req.session.user) return res.redirect("/login");

    let content = await Content.findById(req.params.id).lean();
    if (!content)
      {
        content = await Episode.findById(req.params.id).lean();
        if(!content)
        {
          return res.status(404).send("content not found");
        }
      } 


    const user = req.session.user;
    const activeProfile = req.session.activeProfile || {
      name: "Default Profile",
    };

    return res.render("watch", { content, user, activeProfile });
  } catch (err) {
    console.error(" Error rendering watch page:", err);
    return res.status(500).send("Error loading watch page");
  }
}

module.exports = { renderWatchPage };
