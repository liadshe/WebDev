const User = require("../models/User");

const getUserByUsername = async (userName) => {
    const user = await User.findOne( userName );
    return user;
}

module.exports = {
    getUserByUsername
};