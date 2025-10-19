const User = require("../models/User");

const getUserByUsername = async (userName) => {
    const user = await User.findOne( userName );
    return user;
}

const getUserByEmail = async (email) => {
    const user = await User.findOne( email );
    return user;
}

module.exports = {
    getUserByUsername,
    getUserByEmail
};