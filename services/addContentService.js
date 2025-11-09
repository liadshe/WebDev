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
    console.log(series);
    return series;
}

async function getSeriesByTitle(title)
{
    const series = await Content.find({type: 'series', title: title}).lean();
    return series;
}

async function getContentByTitle(title)
{
    const content = await Content.findOne({title: title}).lean();
    return content;
}

async function getContentByGenre(genres, skip = 0, limit = 10) {
  if (!Array.isArray(genres)) genres = [genres];

  const content = await Content.find({
    genre: { $in: genres }
  })
    .skip(skip)
    .limit(limit)
    .lean();
  return content;
}


async function getEpisodesBySeriesTitle(title)
{
    const wantedSeries = await getSeriesByTitle(title);
    const episodes = await Episode.find({series: wantedSeries}).lean();
    return episodes;
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
module.exports = { getAllGenres, getAllSeries,getContentByTitle, getSeriesByTitle, getContentByGenre, getEpisodesBySeriesTitle, addContent, addEpisode, getAllContent };