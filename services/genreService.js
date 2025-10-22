const genres = require("../models/Genres");

// Get all genres from DB
const getAllGenres = async () => {
    const genres = await genres.find({});
    const genreNames = genres.map(g => g.name); 
    return genreNames
}

module.exports = {
    getAllGenres
};