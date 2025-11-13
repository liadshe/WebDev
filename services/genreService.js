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

const deleteGenre = async (id) => {
  try {
    const deleted = await Genres.findByIdAndDelete(id);
    if (!deleted) throw new Error("Genre not found");
    return deleted;
  } catch (error) {
    console.error("Error deleting genre:", error);
    throw error;
  }
};

// add genre - not in used, to support CRUD
const addGenre = async (name) => {
  try {
    // normalize genre name
    const normalized = name
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('-');

    // avoid duplicates
    const existing = await Genres.findOne({ name: normalized });
    if (existing) throw new Error("Genre already exists");

    const genre = new Genres({ name: normalized });
    const saved = await genre.save();
    return saved;
  } catch (error) {
    console.error("Error adding genre:", error);
    throw error;
  }
};

// get genre by id - not in used, to support CRUD
const getGenreById = async (id) => {
  try {
    const genre = await Genres.findById(id);
    if (!genre) throw new Error("Genre not found");
    return genre;
  } catch (error) {
    console.error("Error getting genre by ID:", error);
    throw error;
  }
};

// update genre - not in used, to support CRUD
const updateGenre = async (id, newName) => {
  try {
    const normalized = newName
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('-');

    const updated = await Genres.findByIdAndUpdate(
      id,
      { name: normalized },
      { new: true, runValidators: true }
    );
    if (!updated) throw new Error("Genre not found");
    return updated;
  } catch (error) {
    console.error("Error updating genre:", error);
    throw error;
  }
};

module.exports = {
    getAllGenres,
    getUserGenrePopularity,
    addGenre,
    deleteGenre, 
    getGenreById,
    updateGenre
};