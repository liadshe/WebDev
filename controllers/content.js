const addContentService = require("../services/addContentService");
const dotenv = require("dotenv"); // to load OMDb API key
const axios = require("axios"); // to call external OMDb API
const { getVideoDurationInSeconds } = require("get-video-duration"); // to get video duration
const path = require("path"); // to handle file paths
const logService = require("../services/logService");

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
   res.render("content", {
      user: req.session.activeProfile.name,
      profile: req.session.activeProfile,
      genres: genres || [],
      series: series || [],
      success: req.query.success == "1",
      error: req.query.error == "1",
    });
    return;
  } catch (err) {
    console.error("Error fetching genres:", err);
  }
}

// fetch rating from OMDb API by title, if not found return null
async function getRating(req, title) {
  try {
    const apiKey = process.env.API_KEY;
    const response = await axios.get(`https://www.omdbapi.com/`, {
      params: { t: title, apikey: apiKey },
    });

    if (response.data.Response === "False") {
    await logService.createLog({
          level: "INFO",
          service: "AddContent",
          message: `content ${title} was not found in omdb.`,
        });
        }    
    return response.data.imdbRating;
  } catch (err) {
        await logService.createLog({
          level: "INFO",
          service: "AddContent",
          message: `error accured while fetching rating for ${title}: ${err}.`,
          userId: req.session.user,
        });
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
      await logService.createLog({
      level: "INFO",
      service: "AddContent",
      message: `Error reading video duration: ${err}`,
      userId: req.session.user,
        });

    return null;
  }
}

// hnndle submission of add-content form
async function handleContentSubmission(req, res) {
    try {
    const title = req.body.title;
    if (!title) return res.status(400).json({ error: "Missing title parameter" });

    const files = req.files || {};
    const coverFile = files.coverImageFile && files.coverImageFile[0];
    const videoFile = files.videoFile && files.videoFile[0];

    let coverImagePath = null;
    let videoPath = null;
    let durationSeconds = null;

    if (coverFile) coverImagePath = path.join("uploads", coverFile.filename);
    if (videoFile) {
      videoPath = path.join("uploads", videoFile.filename);
      durationSeconds = await getVideoDuration(path.join(__dirname, "../public", videoPath));
    }

    const genre = Array.isArray(req.body.genre)
      ? req.body.genre
      : req.body.genre ? [req.body.genre] : [];

    const cast = typeof req.body.cast === "string"
      ? req.body.cast.split(",").map(s => s.trim()).filter(Boolean)
      : [];

    const type = req.body.type.toLowerCase();

    // --- EPISODE ---
    if (type === "episode") {
      if (!videoFile) throw new Error("Episode must include a video file");

      let seriesId;
      if (req.body.series && req.body.series.match(/^[0-9a-fA-F]{24}$/)) { // if id is ok 
        seriesId = req.body.series;
      } else {
        const found = await addContentService.getSeriesByTitle(req.body.series); // if not - try to search it yourself
        seriesId = found?.[0]?._id;
      }


      const episodeData = {
        title: req.body.title,
        description: req.body.description || "",
        seasonNumber: Number(req.body.seasonNumber) || 1,
        episodeNumber: Number(req.body.episodeNumber) || 1,
        durationSeconds,
        videoPath,
        series: seriesId
      };

      await addContentService.addEpisode(episodeData);
    }

    // --- MOVIE ---
    else if (type === "movie") {
      if (!coverFile || !videoFile) throw new Error("Movie must include both cover and video");

      const rating = await getRating(req.body.title);
      const movieData = {
        type,
        title,
        description: req.body.description || "",
        genre,
        cast,
        director: req.body.director || "",
        releaseYear: Number(req.body.releaseYear) || undefined,
        durationSeconds,
        rating: rating || "N/A",
        videoPath,
        coverImagePath
      };
      await addContentService.addContent(movieData);
    }

    // --- SERIES ---
    else if (type === "series") {
      if (!coverFile) throw new Error("Series must include a cover image");

      const rating = await getRating(req.body.title);
      const seriesData = {
        type,
        title,
        description: req.body.description || "",
        genre,
        cast,
        director: req.body.director || "",
        releaseYear: Number(req.body.releaseYear) || undefined,
        rating: rating || "N/A",
        coverImagePath
      };
      await addContentService.addContent(seriesData);
    }

    res.redirect("/content?success=1");
  } catch (err) {
    console.error("Error in handleContentSubmission:", err);
    res.redirect("/content?error=1");
  }
}

// gets a title and return the content data by the title
async function getContentDetailsByTitle(req, res){
    const content = await addContentService.getContentByTitle(req.params.title);
    const similarFromSameGenre = await addContentService.getContentByGenre(content.genre);

    // if it's a series, fetch its episodes
    if (content.type === 'series') {
      const episodes = await addContentService.getEpisodesBySeriesTitle(req.params.title);
      return res.json({ ...content, similarFromSameGenre, episodes });
    }

    // otherwise, just return the content
    res.json({...content, similarFromSameGenre});
}



module.exports = {
  renderAddContentPage,
  handleContentSubmission,
  getContentDetailsByTitle,
};
