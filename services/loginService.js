const User = require("../models/User");

const getUserById = async (id) => {
    const user = await User.findById( id );
    return user;
}

const getUserByUsername = async (userName) => {
    const user = await User.findOne( userName );
    return user;
}

const getUserByEmail = async (email) => {
    const user = await User.findOne( email );
    return user;
}

const getUserProfiles = async (_id) => {
    const user = await User.findOne( {_id} );
    return user.profiles;
}

module.exports = {
    getUserByUsername,
    getUserByEmail,
    getUserProfiles,
    getUserById
};