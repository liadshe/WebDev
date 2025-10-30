const bcrypt = require("bcrypt");
const User = require("../models/User");
const profileService = require("../services/profileService");
const genreService = require("../services/genreService");
const Genre = require("../models/Genres");

async function renderEditProfilePage(req, res) {
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

async function deleteProfile(req, res) {
    console.log("in delete profile controller");
  try {
    const { profileId } = req.params;
    const userId = req.session.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    const profile = user.profiles.id(profileId);
    if (!profile) return res.status(404).send("Profile not found");
    profileService.deleteProfile(userId, profileId);

  } catch (err) {
    console.error("Error loading edit profile page:", err);
    res.status(500).send("Server error");
  }
  req.session.save(() => {
  res.redirect("/settings");
});
}

async function createProfile(req, res) {
    console.log("in create profile controller");
  try {
    const userId = req.session.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");




  } catch (err) {
    console.error("Error loading edit profile page:", err);
    res.status(500).send("Server error");
  }
  req.session.save(() => {
  res.redirect("/settings");
});
}

async function renderProfileCreationPage(req,res) {
    try {
      console.log("!!!!!!!!!!!!!!!!!!! in render profile creation !!!!!!!!!!!!!!!!!!!!!1")
    const userId = req.session.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    const genres = await Genre.find({});
    const genreNames = genres.map(g => g.name); 

    res.render("createProfile", {
      genres: genreNames
    });
  } catch (err) {
    console.error("Error loading edit profile page:", err);
    res.status(500).send("Server error");
  }

}

module.exports = {
  updateProfile,
  renderEditProfilePage, 
  deleteProfile,
  createProfile,
  renderProfileCreationPage
};