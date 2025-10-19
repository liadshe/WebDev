const User = require("../models/User");

const getUserByUsername = async (userName) => {
    const user = await User.findOne( userName );
    return user;
}

const getUserByEmail = async (email) => {
    const user = await User.findOne( email );
    return user;
}

const getUserProfiles = async (_id) => {
    const user = await User.findOne( _id );
    console.log("User profiles fetched:", user.profiles);
    return user.profiles;
}

module.exports = {
    getUserByUsername,
    getUserByEmail,
    getUserProfiles
};