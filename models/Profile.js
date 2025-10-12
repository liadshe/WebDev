const mongoose = require("mongoose");

const profileSchema =mongoose.Schema({
    name: String,
    userName: {
        type: String, 
        required: true
    },
    profilePicture: String,
    preferences: [String]
});

module.exports = mongoose.model("Profile", profileSchema);