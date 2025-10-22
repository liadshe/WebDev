const bcrypt = require("bcrypt");
const User = require("../models/User");
const profileService = require("../services/profileService");
const genreService = require("../services/genreService");
const Genre = require("../models/Genres");

async function renderEditProfilePage(req, res) {
    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhh");
  try {
    const { profileId } = req.params;
    const userId = req.session.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    const profile = user.profiles.id(profileId);
    if (!profile) return res.status(404).send("Profile not found");

    const genres = await Genre.find({});
    const genreNames = genres.map(g => g.name); 

    res.render("editProfile", {
      profile,
      genres: genreNames // 👈 Pass to EJS
    });
  } catch (err) {
    console.error("Error loading edit profile page:", err);
    res.status(500).send("Server error");
  }
}

module.exports = { renderEditProfilePage };

async function updateProfile(req, res) {
  try {
    const userId = req.session.userId; 
    const profileId = req.params.profileId;
    const newName = req.body.displayName;
    const { action } = req.body;

    // Handle different form actions
    if (action === "update_name") {
        profileService.updateProfileName(userId, profileId, newName);

    } else if (action === "update_preferences") {
        profileService.updateProfilePreferences(userId, profileId, req.body.preferences);   
    
} else if (action === "update_picture") {
    profileService.updateProfilePicture(userId, profileId, req.body.newPicture);
}
  } catch (err) {
    console.error("Error updating profile name:", err);
    throw err;
  }

  req.session.save(() => {
  res.redirect(`/settings/edit/${req.params.profileId}`);
});
}

module.exports = {
  updateProfile,
  renderEditProfilePage
};