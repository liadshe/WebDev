const Genre = require("../models/Genres");


// send generes from db 
const getAllGenres = async () => {
    const genres = await Genre.find();
    return genres;
}


// add content to db



module.exports = { getAllGenres }; 