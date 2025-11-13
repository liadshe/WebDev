const addContentService = require("../services/addContentService");
const genreService = require("../services/genreService");
const recommendationService = require("../services/recommendationService");
const watchService = require("../services/watchService"); 


// returns all content from specific genre
  async function getContentByGenre(req, res) {
  try {
    let genre = req.params.genre;

    genre = genre
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('-');

    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(process.env.CONTENT_LIMIT);
    let genreContent;
    if (genre == "All")
    {
     genreContent = await addContentService.getAllContent(); 
    }
    else{
     genreContent = await addContentService.getContentByGenre(genre, skip, limit);
    }

    const profileName = req.session.activeProfile;
    const userId = req.session.user._id;

    for (let movie of genreContent) {
      const history = await watchService.getWatchHistoryPerContentByProfileID(
        movie._id,
        userId,
        profileName
      );

      // Mark as watched only if finished flag true
      movie.watched = history.length > 0 && history[0].finished === true;
    }

    res.json(genreContent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
 
// render 
async function renderGenrePage(req,res)
{
  let givengenre = req.params.genre;

  givengenre = givengenre
  .split('-')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  .join('-');
  const user = req.session.user;  
  const activeProfile = req.session.activeProfile;
  // If no profile is selected or profile not found, use the first profile
  if (!activeProfile && user.profiles && user.profiles.length > 0) {
    activeProfile = user.profiles[0];
  }
  
  const genres = await genreService.getAllGenres();
  const popularInGenre = await recommendationService.getPopularContentByGenre(givengenre);

  res.render('genre', {
    user,
    profile: activeProfile || { picture: 'default.jpg', name: 'User' },
    givengenre,
    allGenres: genres ,
    popularInGenre: popularInGenre 
  })

}

module.exports = {
    renderGenrePage,
    getContentByGenre
}