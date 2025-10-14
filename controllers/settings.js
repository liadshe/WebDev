const profileService = require("../services/profilesService");

// const render = (req, res) => {
//     const profiles = profileService.getAllProfiles();
//     res.render("profiles", { profiles });
// };

// module.exports = {render};
  
async function getAllProfiles(req,res) {
    try {
        const profiles = await profileService.getAllProfiles();
        // Map profiles to match EJS expectations
        const mappedProfiles = profiles.map(profile => ({
            name: profile.name,
            displayName: profile.userName,
            image: profile.profilePicture ? `/public/images/${profile.profilePicture}` : '/public/images/default.jpg'
        }));
        res.render("settings", { profiles: mappedProfiles });
    } catch(err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

module.exports={getAllProfiles};

// const renderSettingsPage = async (req, res) => {
//     try {
//         const profiles = await profileService.getAllProfiles(req.user.id);
//         res.render("settings", { profiles }); // EJS template
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Server error");
//     }
// };

// module.exports = { renderSettingsPage };