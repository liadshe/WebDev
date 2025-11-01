const Genres = require("../models/Genres");
const User = require("../models/User");
const mongoose = require("mongoose");

// Get all genres from DB
const getAllGenres = async () => {
    const genres = await Genres.find({});
    const genreNames = genres.map(g => g.name);
    return genreNames
}

// Get genres popularity
const getUserGenrePopularity = async (userId) => {
    const objectId = new mongoose.Types.ObjectId(userId);
    console.log(`Running aggregation for user: ${userId}`);

    try {
        const genreData = await User.aggregate([
            { $match: { _id: objectId } },
            { $unwind: "$profiles" },
            { $unwind: "$profiles.genrePreferences" },
            {
                $group: {
                    _id: "$profiles.genrePreferences",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    label: '$_id',
                    value: '$count'
                }
            }
        ]);
        return genreData;
    } catch (error) {
        console.error("Error during genre popularity aggregation:", error);
        throw error;
    }
};


module.exports = {
    getAllGenres,
    getUserGenrePopularity
};