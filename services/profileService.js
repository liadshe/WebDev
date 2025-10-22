const User = require("../models/User");

// Update profile name
const updateProfileName = async (userId, profileId, newName) => {
    await User.findOneAndUpdate(
                { _id: userId, "profiles._id": profileId },
                { $set: { "profiles.$.name": newName } },
                { new: true } 
            );}

// Update profile preferences
const updateProfilePreferences = async (userId, profileId, preferences) => {
    if (!Array.isArray(preferences)) {
        preferences = preferences ? [preferences] : [];
    }
    
    await User.findOneAndUpdate(
        { _id: userId, "profiles._id": profileId },
        { $set: { "profiles.$.genrePreferences": preferences } },
        { new: true }
    );}

// Update profile picture
const updateProfilePicture = async (userId, profileId, newPicture) => {    
    await User.findOneAndUpdate(
        { _id: userId, "profiles._id": profileId },
        { $set: { "profiles.$.picture": newPicture } },
        { new: true }
    );}

// Delete profile 
const deleteProfile = async (userId, profileId) => {
    const user = await User.findById(userId);
    const profile = user.profiles.id(profileId);
    profile.deleteOne();
    await user.save();
};

module.exports = {
    updateProfileName,
    updateProfilePreferences,
    updateProfilePicture,
    deleteProfile
};