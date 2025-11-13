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

// not in use - only to support CRUD
const deleteUser = async (id) => {
  try {
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) throw new Error("User not found");
    return deleted;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};


module.exports = {
    getUserByUsername,
    getUserByEmail,
    getUserProfiles,
    getUserById
};