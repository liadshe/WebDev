const bcrypt = require("bcrypt");
const User = require("../models/User");
// const Profile = require("../models/Profile");
const loginService = require("../services/loginService");

async function updateProfile(req, res) {
  try {
    const userId = req.session.userId; 
    const profileId = req.params.profileId;
    const newName = req.body.displayName;
    const { action } = req.body;
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!" , req.params, "!!!!!!!!!!!!!!!!!!!!!!")

    // Handle different form actions
    if (action === "update_name") {
        console.log("Updating profile name to:", newName);
        const user = await User.findOneAndUpdate(
            { _id: userId, "profiles._id": profileId },
            { $set: { "profiles.$.name": newName } },
            { new: true } // return updated doc
        );}

  } catch (err) {
    console.error("Error updating profile name:", err);
    throw err;
  }

  req.session.save(() => {
  res.redirect(`/settings/edit/${req.params.profileId}`);
});
}

// else if (action === "update_preferences") {
//   // If checkboxes are used, req.body.preferences can be a string or array
    //   let { preferences } = req.body;
    //   if (!Array.isArray(preferences)) {
    //     preferences = preferences ? [preferences] : [];
    //   }
    //   await Profile.findByIdAndUpdate(profileId, { preferences });
    // } 
    // else if (action === "update_picture") {
    //   const { newPicture } = req.body;
    //   await Profile.findByIdAndUpdate(profileId, { picture: newPicture });
    // }

  // Redirect back to settings page after update

//   } catch (error) {
//     console.error("Error updating profile:", error);
//     res.status(500).send("Internal Server Error");
//   }

module.exports = {
  updateProfile
};