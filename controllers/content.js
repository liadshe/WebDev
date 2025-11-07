const addContentService = require("../services/addContentService");
const dotenv = require("dotenv"); // to load OMDb API key
const axios = require("axios"); // to call external OMDb API
const { getVideoDurationInSeconds } = require("get-video-duration"); // to get video duration
const path = require("path"); // to handle file paths

dotenv.config();

// render add-content page by ejs file named content.ejs
async function renderAddContentPage(req, res) {
  try {
    const genres = await addContentService.getAllGenres();
    const series = await addContentService.getAllSeries();
    if (!genres) {
      console.log("No genres found, using empty array");
    }
    if (!series) {
      console.log("No series found, using empty array");
    }
    console.log(series);
    res.render("content", {
      genres,
      series,
      success: req.query.success == "1",
      error: req.query.error == "1",
    });
    return;
  } catch (err) {
    console.error("Error fetching genres:", err);
  }
}

// fetch rating from OMDb API by title, if not found return null
async function getRating(title) {
  try {
    const apiKey = process.env.OMDB_API_KEY;
    const response = await axios.get(`https://www.omdbapi.com/`, {
      params: { t: title, apikey: apiKey },
    });

    if (response.data.Response === "False") {
      console.log("Movie not found");
    }
    return response.data.imdbRating;
  } catch (err) {
    console.error("Error fetching rating from OMDb:", err);
  }
  return null;
}

// get video duration in seconds
async function getVideoDuration(videoPath) {
  try {
    const absolutePath = path.resolve(videoPath);
    const durationSeconds = await getVideoDurationInSeconds(absolutePath);
    return durationSeconds;
  } catch (err) {
    console.error("Error reading video duration:", err);
    return null;
  }
}

async function handleContentSubmission(req, res) {
  try {
    const title = req.body.title;
    if (!title)
      return res.status(400).json({ error: "Missing title parameter" });

    const rating = await getRating(req.body.title);

    // use uploaded files from multer (router uses upload.fields)
    const files = req.files || {};
    const coverFile = files.coverImageFile && files.coverImageFile[0];
    const videoFile = files.videoFile && files.videoFile[0];

    // public URLs (public/ is served as root)
    const coverImagePath = path.join("uploads", coverFile.filename);
    const videoPath = path.join("uploads", videoFile.filename);

    const durationMinutes = await getVideoDuration(videoPath);

    // normalize incoming fields
    const genre = Array.isArray(req.body.genre)
      ? req.body.genre
      : req.body.genre
      ? [req.body.genre]
      : [];
    const cast =
      typeof req.body.cast === "string"
        ? req.body.cast
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

    const contentData = {
      type: req.body.type.toLowerCase(), 
      title: req.body.title || "Untitled",
      description: req.body.description || "",
      genre,
      cast,
      director: req.body.director || "",
      releaseYear: Number(req.body.releaseYear) || undefined,
      durationMinutes: durationMinutes,
      rating: rating,
      videoPath: videoPath,
      coverImagePath: coverImagePath,
    };

    await addContentService.addContent(contentData);

    // redirect back to the add form (or you can send JSON)
    res.redirect("/content?success=1");
  } catch (err) {
    console.log("Error in handleContentSubmission:", err);
    res.redirect("/content?error=1");
  }
}

module.exports = {
  renderAddContentPage,
  handleContentSubmission,
};
