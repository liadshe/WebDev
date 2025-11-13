const addContentService = require("../services/addContentService");
const watchService = require("../services/watchService");
const Episode = require("../models/Episode");

async function getContentDetailsByTitle(req, res) {
  try {
    const title = req.params.title;

    // Fetch main content (series or movie)
    const content = await addContentService.getContentByTitle(title);
    if (!content) {
      return res.status(404).json({ error: "Content not found" });
    }

    // Similar content from genre
    const similarFromSameGenre = await addContentService.getContentByGenre(
      content.genre
    );

    const userId = req.session?.user?._id || null;
    const profile = req.session?.activeProfile?.name || null;

    if (content.type === "series") {
      // 1. Fetch all episodes for this series
      const episodes = await addContentService.getEpisodesBySeriesTitle(title);

      // 2. Build WATCH HISTORY per episode
      let episodeHistories = [];

      if (episodes?.length > 0) {
        episodeHistories = await Promise.all(
          episodes.map(async (ep) => {
            let epHistory = [];

            if (userId) {
              const history =
                await watchService.getWatchHistoryPerContentByProfileID(
                  ep._id,
                  userId,
                  profile
                );
              if (history)
                epHistory = Array.isArray(history) ? history : [history];
            }

            return {
              episodeId: ep._id,
              title: ep.title,
              seasonNumber: ep.seasonNumber,
              episodeNumber: ep.episodeNumber,
              durationSeconds: ep.durationSeconds,
              history: epHistory,
            };
          })
        );
      }

      // 3. Convert episodes into the format watch.js expects
      const episodesForPlayer = (episodes || []).map((ep) => ({
        _id: ep._id,
        title: ep.title,
        seasonNumber: ep.seasonNumber,
        episodeNumber: ep.episodeNumber,
        durationSeconds: ep.durationSeconds,
        videoPath: ep.videoPath,
      }));

      // 4. Check if user finished series
      const hasFinished = userId
        ? await watchService.hasFinishedSeries(profile, content._id, userId)
        : false;

      return res.json({
        ...content,
        type: "series",
        episodes: episodesForPlayer,
        history: episodeHistories,
        similarFromSameGenre,
        hasFinished,
      });
    }

    let history = [];

    if (userId && profile) {
      const movieHistory =
        await watchService.getWatchHistoryPerContentByProfileID(
          content._id,
          userId,
          profile
        );

      if (movieHistory) {
        history = Array.isArray(movieHistory) ? movieHistory : [movieHistory];
      }
    }

    return res.json({
      ...content,
      type: "movie",
      history,
      similarFromSameGenre,
    });
  } catch (err) {
    console.error("Error in getContentDetailsByTitle:", err);
    res.status(500).json({ error: "Failed to load content details" });
  }
}

module.exports = { getContentDetailsByTitle };
