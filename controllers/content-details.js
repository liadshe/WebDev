const addContentService = require("../services/addContentService");
const watchService = require("../services/watchService");
const Episode = require("../models/Episode");

async function getContentDetailsByTitle(req, res) {
  try {
    const content = await addContentService.getContentByTitle(req.params.title);
    if (!content) return res.status(404).json({ error: "Content not found" });

    const similarFromSameGenre = await addContentService.getContentByGenre(content.genre);
    const userId = req.session?.user?._id;
    const profile = req.session?.activeProfile?.name;

    if (content.type === "series") {
      const episodes = await addContentService.getEpisodesBySeriesTitle(req.params.title);

      if (episodes?.length > 0) {
        const episodeHistories = await Promise.all(
          episodes.map(async (ep) => {
            const epHistory = userId
              ? await watchService.getWatchHistoryPerContentByProfileID(ep._id, userId, profile)
              : null;

            return {
              episodeId: ep._id,
              title: ep.title,
              seasonNumber: ep.seasonNumber,
              episodeNumber: ep.episodeNumber,
              durationSeconds: ep.durationSeconds,
              history: Array.isArray(epHistory) ? epHistory : epHistory ? [epHistory] : [],
            };
          })
        );

        const hasFinished = await watchService.hasFinishedSeries(profile, content._id, userId);

        return res.json({
          ...content,
          type: "series",
          history: episodeHistories,
          similarFromSameGenre,
          hasFinished,
        });
      }

      return res.json({
        ...content,
        type: "series",
        history: [],
        similarFromSameGenre,
      });
    }

    let history = [];
    if (userId && profile) {
      const movieHistory = await watchService.getWatchHistoryPerContentByProfileID(
        content._id,
        userId,
        profile
      );
      if (movieHistory) history = Array.isArray(movieHistory) ? movieHistory : [movieHistory];
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
