const genres = require("../models/Genres");

// Get all genres from DB
const getAllGenres = async () => {
    const Genres = await genres.find({});
    const genreNames = Genres.map(g => g.name);
    return genreNames
}

module.exports = {
    getAllGenres
};