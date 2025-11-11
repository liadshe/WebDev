const addContentService = require("../services/addContentService");
const watchService = require("../services/watchService");

// gets a title and return the content data by the title
async function getContentDetailsByTitle(req, res){
    const content = await addContentService.getContentByTitle(req.params.title);
    const similarFromSameGenre = await addContentService.getContentByGenre(content.genre);
    
    // get profile's history watch of this specific content
    const contentId = content._id;
    const userId = req.session.user._id;
    const profile = req.session.activeProfile.name;    
    const history = await getWatchHistoryPerContentByProfileID(contentId, userId, profile);


    // if it's a series, fetch its episodes
    if (content.type === 'series') {
      const episodes = await addContentService.getEpisodesBySeriesTitle(req.params.title);
      return res.json({ ...content, history, similarFromSameGenre, episodes });
    }

    // otherwise, just return the content
    res.json({...content, history, similarFromSameGenre});
}


async function getWatchHistoryPerContentByProfileID(contentId, userId, profile)
{
    const history = await watchService.getWatchHistoryPerContentByProfileID(contentId, userId, profile);
    return history;

}


module.exports = { getContentDetailsByTitle};