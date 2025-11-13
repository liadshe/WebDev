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
    const series = await Content.find({type: 'series', title: title}).lean();
    return series;
}

async function getContentByTitle(title)
{
    const content = await Content.findOne({title: title}).lean();
    return content;
}

async function getContentByGenre(genres, skip, limit) {
  if (!Array.isArray(genres)) genres = [genres];

  const normalizedGenres = genres.map(genre =>
    genre
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('-')
  );

  const content = await Content.find({
    genre: { $in: normalizedGenres }
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

// Get all content with optional sorting
const getAllContent = async (sortOption = 'default') => {
    let query = Content.find().populate("genre");
    
    switch(sortOption) {
        case 'a-z':
            query = query.sort({ title: 1 }); // A to Z ascending
            break;
        case 'newest':
            query = query.sort({ uploadTime: -1 }); // Newest first
            break;
        case 'default':
        default:
            // No sorting, default MongoDB order
            break;
    }
    
    const contents = await query.lean();
    return contents;
}
// Get newest content limited to a specific number per genre
const getNewestContentByGenre = async (limit = 10) => {
    const contents = await Content.find()
        .sort({ uploadTime: -1 })
        .populate("genre")
        .lean();
    
    return contents;
}

async function getTypeById(contentId)
{
    const content = await Content.findById(contentId).lean();
    return content.type;
}

// delete content by ID - not in used, but to support CRUD
const deleteContent = async (id) => {
  try {
    const deleted = await Content.findByIdAndDelete(id);
    return deleted;
  } catch (err) {
    console.error("Error deleting content:", err);
    throw err;
  }
};

// update Content by ID - not in used, but to suppot CRUD
const updateContent = async (id, updateData) => {
  try {
    const updated = await Content.findByIdAndUpdate(id, updateData, {
      new: true, // return the updated document
      runValidators: true // ensure schema validation
    });
    return updated;
  } catch (err) {
    console.error("Error updating content:", err);
    throw err;
  }
};

module.exports = { getAllGenres, getAllSeries,getContentByTitle, getSeriesByTitle, getContentByGenre,getNewestContentByGenre, getTypeById, getEpisodesBySeriesTitle, addContent, addEpisode, getAllContent, deleteContent, updateContent };