const Genre = require("../models/Genres");
const Content = require("../models/Content");


// send genres from db - return array of names of genres
const getAllGenres = async () => {
    // select only the name field and return as plain objects
    const genres = await Genre.find().select("name -_id").lean();
    const names = Array.isArray(genres) ? genres.map(g => g.name) : [];
    return names;
}

// add content to db
const addContent = async (contentData) => {
    console.log("Adding content to database:", contentData);    
    // Implementation for adding content to the database
    const newContent = new Content(contentData);
    const saved = await newContent.save();
    return saved;
};

module.exports = { getAllGenres, addContent };