const bcrypt = require("bcrypt");
const User = require("../models/User");
const loginService = require("../services/loginService");

async function renderSettingsPage(req, res) {
  try {
    const userId = req.session.userId; // ✅ use session, not req.user

    if (!userId) {
      return res.redirect("/login");
    }

    // get user profiles from your service
    const profiles = await loginService.getUserProfiles({ _id: userId });

    // map for display
    const mappedProfiles = profiles.map(profile => ({
      name: profile.name,
      picture: profile.picture
        ? `/images/${profile.picture}`    
        : '/images/default.jpg'
    }));
    console.log("Mapped Profiles:", mappedProfiles);

    res.render("settings", {
      username: req.session.username, 
      profiles: mappedProfiles
    });
  } catch (err) {
    console.error("Error loading settings page:", err);
    res.status(500).send("Server error");
  }
}

module.exports = { renderSettingsPage };