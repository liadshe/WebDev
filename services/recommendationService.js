const Content = require("../models/Content");
const WatchHistory = require("../models/watchHistory");
const User = require("../models/User");

/**
 * Get the most popular content based on watch history
 * Groups by contentId and counts total watches
 */
async function getMostPopularContent(limit = 10) {
  try {
    // Aggregate watch history to find most watched content
    const popularContent = await WatchHistory.aggregate([
      {
        $group: {
          _id: "$contentId",
          watchCount: { $sum: 1 },
          uniqueUsers: { $addToSet: "$userId" },
        },
      },
      {
        $project: {
          contentId: "$_id",
          watchCount: 1,
          uniqueUserCount: { $size: "$uniqueUsers" },
        },
      },
      {
        $sort: { watchCount: -1, uniqueUserCount: -1 },
      },
      {
        $limit: limit,
      },
    ]);

    // Get full content details
    const contentIds = popularContent.map((item) => item.contentId);
    const contents = await Content.find({ _id: { $in: contentIds } }).lean();

    // Map watch counts to content
    const contentMap = {};
    contents.forEach((content) => {
      contentMap[content._id.toString()] = content;
    });

    const result = popularContent
      .map((item) => {
        const content = contentMap[item.contentId.toString()];
        if (content) {
          return {
            ...content,
            watchCount: item.watchCount,
            uniqueUserCount: item.uniqueUserCount,
          };
        }
        return null;
      })
      .filter(Boolean);

    return result;
  } catch (err) {
    console.error("Error getting most popular content:", err);
    return [];
  }
}

/**
 * 1. Genres from watched content
 * 2. Genres from liked content
 * 3. Genre preferences
 * 4. Content similar to what they've liked
 */
async function getPersonalizedRecommendations(userId, profileName, limit = 10) {
  try {
    // Get user and profile data
    const user = await User.findById(userId).lean();
    if (!user) return [];

    const profile = user.profiles.find((p) => p.name === profileName);
    if (!profile) return [];

    // Get watch history for this profile
    const watchHistory = await WatchHistory.find({
      userId: userId,
      profileName: profileName,
    })
      .populate("contentId")
      .lean();

    // Get liked content IDs
    const likedContentIds = profile.likedContent || [];

    // Get liked content details
    const likedContent = await Content.find({
      _id: { $in: likedContentIds },
    }).lean();

    // Extract genres from watched content
    const watchedGenres = {};
    watchHistory.forEach((history) => {
      if (history.contentId && history.contentId.genre) {
        history.contentId.genre.forEach((genre) => {
          watchedGenres[genre] = (watchedGenres[genre] || 0) + 1;
        });
      }
    });

    // Extract genres from liked content (weight these more heavily)
    const likedGenres = {};
    likedContent.forEach((content) => {
      if (content.genre) {
        content.genre.forEach((genre) => {
          likedGenres[genre] = (likedGenres[genre] || 0) + 3; // 3x weight for liked
        });
      }
    });

    // Combine genre preferences
    const genrePreferences = profile.genrePreferences || [];
    const preferredGenres = {};
    genrePreferences.forEach((genre) => {
      preferredGenres[genre] = 2; // 2x weight for preferences
    });

    // Merge all genre scores
    const genreScores = {};
    [watchedGenres, likedGenres, preferredGenres].forEach((genreSet) => {
      Object.keys(genreSet).forEach((genre) => {
        genreScores[genre] = (genreScores[genre] || 0) + genreSet[genre];
      });
    });

    // Get top genres
    const topGenres = Object.keys(genreScores)
      .sort((a, b) => genreScores[b] - genreScores[a])
      .slice(0, 5);

    // Get IDs of content already watched or liked to exclude them
    const watchedContentIds = watchHistory
      .map((h) => h.contentId?._id?.toString())
      .filter(Boolean);
    const likedContentIdStrings = likedContentIds.map((id) => id.toString());
    const excludeIds = [...new Set([...watchedContentIds, ...likedContentIdStrings])];

    // Find recommended content based on top genres
    let recommendations = [];
    if (topGenres.length > 0) {
      recommendations = await Content.find({
        _id: { $nin: excludeIds },
        genre: { $in: topGenres },
      })
        .limit(limit * 2) // Get more than needed for scoring
        .lean();

      // Score recommendations based on genre matches
      recommendations = recommendations.map((content) => {
        let score = 0;
        content.genre.forEach((genre) => {
          score += genreScores[genre] || 0;
        });
        return { ...content, recommendationScore: score };
      });

      // Sort by score and limit
      recommendations.sort((a, b) => b.recommendationScore - a.recommendationScore);
      recommendations = recommendations.slice(0, limit);
    }

    // If not enough recommendations, fill with popular content
    if (recommendations.length < limit) {
      const popularContent = await getMostPopularContent(limit);
      const popularFiltered = popularContent.filter(
        (content) => !excludeIds.includes(content._id.toString())
      );
      recommendations = [
        ...recommendations,
        ...popularFiltered.slice(0, limit - recommendations.length),
      ];
    }

    return recommendations;
  } catch (err) {
    console.error("Error getting personalized recommendations:", err);
    return [];
  }
}


async function getSimilarContent(contentId, limit = 6) {
  try {
    const content = await Content.findById(contentId).lean();
    if (!content) return [];

    // Find content with matching genres, cast, or director
    const similar = await Content.find({
      _id: { $ne: contentId },
      $or: [
        { genre: { $in: content.genre } },
        { cast: { $in: content.cast || [] } },
        { director: content.director },
      ],
    })
      .limit(limit * 2)
      .lean();

    // Score by similarity
    const scored = similar.map((item) => {
      let score = 0;
      // Genre matches
      const genreMatches = item.genre.filter((g) => content.genre.includes(g)).length;
      score += genreMatches * 3;

      // Cast matches
      if (content.cast && item.cast) {
        const castMatches = item.cast.filter((c) => content.cast.includes(c)).length;
        score += castMatches * 2;
      }

      // Director match
      if (content.director && item.director === content.director) {
        score += 5;
      }

      // Same type (movie/series)
      if (item.type === content.type) {
        score += 1;
      }

      return { ...item, similarityScore: score };
    });

    // Sort by score and return top results
    scored.sort((a, b) => b.similarityScore - a.similarityScore);
    return scored.slice(0, limit);
  } catch (err) {
    console.error("Error getting similar content:", err);
    return [];
  }
}

async function getPopularContentByGenre(genre, limit = 10) {
  try {
    // First, get all content IDs for this genre
    const genreContent = await Content.find({ genre: genre }).select('_id').lean();
    const genreContentIds = genreContent.map(c => c._id);

    if (genreContentIds.length === 0) {
      return [];
    }

    // Aggregate watch history for content in this genre
    const popularContent = await WatchHistory.aggregate([
      {
        $match: {
          contentId: { $in: genreContentIds }
        }
      },
      {
        $group: {
          _id: "$contentId",
          watchCount: { $sum: 1 },
          uniqueUsers: { $addToSet: "$userId" },
        },
      },
      {
        $project: {
          contentId: "$_id",
          watchCount: 1,
          uniqueUserCount: { $size: "$uniqueUsers" },
        },
      },
      {
        $sort: { watchCount: -1, uniqueUserCount: -1 },
      },
      {
        $limit: limit,
      },
    ]);

    // Get full content details
    const contentIds = popularContent.map((item) => item.contentId);
    const contents = await Content.find({ _id: { $in: contentIds } }).lean();

    // Map watch counts to content
    const contentMap = {};
    contents.forEach((content) => {
      contentMap[content._id.toString()] = content;
    });

    const result = popularContent
      .map((item) => {
        const content = contentMap[item.contentId.toString()];
        if (content) {
          return {
            ...content,
            watchCount: item.watchCount,
            uniqueUserCount: item.uniqueUserCount,
          };
        }
        return null;
      })
      .filter(Boolean);

    return result;
  } catch (err) {
    console.error("Error getting popular content by genre:", err);
    return [];
  }
}

module.exports = {
  getMostPopularContent,
  getPersonalizedRecommendations,
  getSimilarContent,
  getPopularContentByGenre
};