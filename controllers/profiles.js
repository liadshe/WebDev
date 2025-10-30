const profileService = require("../services/profileService");
const loginService = require("../services/loginService");
const genreService = require("../services/genreService");

async function renderEditProfilePage(req, res) {
  try {
    const { profileId } = req.params;
    const userId = req.session.userId;

    const user = await loginService.getUserById(userId);
    if (!user) return res.status(404).send("User not found");

    const profile = user.profiles.id(profileId);
    if (!profile) return res.status(404).send("Profile not found");

    const genres = await genreService.getAllGenres();
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
  try {
    const { profileId } = req.params;
    const userId = req.session.userId;

    const user = await loginService.getUserById(userId);
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
  try {
    const userId = req.session.userId;

    if (!userId) return res.status(401).send('Not authenticated');

    const user = await loginService.getUserById(userId);
    if (!user) return res.status(404).send("User not found");

    // enforce max profiles (schema also validates)
    if (user.profiles && user.profiles.length >= 5) {
      req.session.error = 'Maximum number of profiles reached';
      return req.session.save(() => res.redirect('/settings'));
    }

    // collect fields from any form submission
    const displayName = (req.body.displayName || '').trim();
    let preferences = req.body.preferences;
    if (typeof preferences === 'string') preferences = [preferences];
    if (!Array.isArray(preferences)) preferences = [];
  const picture = req.body.newPicture || req.body.picture || 'default.jpg';

    if (!displayName) {
      req.session.error = 'Profile name is required';
      return req.session.save(() => res.redirect('/settings'));
    }

    user.profiles.push({
      name: displayName,
      picture: picture,
      genrePreferences: preferences
    });

    await user.save();

  } catch (err) {
    console.error("Error creating profile:", err);
    return res.status(500).send("Server error");
  }
  req.session.save(() => {
    res.redirect("/settings");
  });
}

async function renderProfileCreationPage(req,res) {
    try {
    const userId = req.session.userId;

    const user = await loginService.getUserById(userId);
    if (!user) return res.status(404).send("User not found");

    const genres = await genreService.getAllGenres();
    const genreNames = genres.map(g => g.name);

    const profilesCount = user.profiles ? user.profiles.length : 0;

    res.render("createProfile", {
      genres: genreNames,
      profilesCount
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