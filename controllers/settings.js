const bcrypt = require("bcrypt");
const User = require("../models/User");
const loginService = require("../services/loginService");

async function renderSettingsPage(req, res) {
  try {
    const userId = req.session.userId; 

    if (!userId) {
      return res.redirect("/login");
    }

    // get user profiles from your service
    const profiles = await loginService.getUserProfiles({ _id: userId });

    // map for display (include id so links render correctly)
    const mappedProfiles = profiles.map(profile => ({
      id: profile._id,
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

async function renderEditProfile(req, res) {
  try {
  const userId = req.session.userId;
  if (!userId) return res.redirect('/login');
  const profileId = req.params.profileId;
  const profiles = await loginService.getUserProfiles({ _id: userId });
  const profile = profiles.find(p => String(p._id) === String(profileId));
    if (!profile) return res.status(404).send('Profile not found');
    res.render('editProfile', { profile });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

module.exports = { renderSettingsPage, renderEditProfile };