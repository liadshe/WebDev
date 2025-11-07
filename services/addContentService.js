const Genre = require("../models/Genres");
const Content = require("../models/Content");
const Episode = require("../models/Episode");


// send genres from db - return array of names of genres
const getAllGenres = async () => {
    // select only the name field and return as plain objects
    const genres = await Genre.find().select("name -_id").lean();
    const names = Array.isArray(genres) ? genres.map(g => g.name) : [];
    return names;
}

const getAllSeries = async () => {
    const series = await Content.find({ type: 'series' }).lean();
    return series;
}

async function getSeriesByTitle(title)
{
    console.log("Searching for series with title:", title);
    const series = await Content.find({type: 'series', title: title}).lean();
    console.log("Found series:", series);
    return series;
}

// add content to db - movie/series
const addContent = async (contentData) => {
    const newContent = new Content(contentData);
    const saved = await newContent.save();
    return saved;
};

const addEpisode = async (episodeData) => {
    const newEpisode = new Episode(episodeData);
    const saved = await newEpisode.save();
    return saved;
}
const getAllContent = async () => {
    const contents = await Content.find().populate("genre").lean();
    return contents;
}
module.exports = { getAllGenres, getAllSeries, getSeriesByTitle, addContent, addEpisode, getAllContent };