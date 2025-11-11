const addContentService = require("../services/addContentService");


// returns all content from specific genre
  async function getContentByGenre(req, res) {
  try {
    const genre = req.params.genre;
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(process.env.MOVIE_LIMIT || 10);
    let genreContent;
    if (genre == "All")
    {
     genreContent = await addContentService.getAllContent(); 
    }
    else{
     genreContent = await addContentService.getContentByGenre(genre, skip, limit);
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
  const givengenre = req.params.genre;
  const user = req.session.user;  
  const profile =  { picture: 'default.jpg', name: 'User' }; // change when profile saved in session

  res.render('genre', {user,profile,givengenre})

}

module.exports = {
    renderGenrePage,
    getContentByGenre
}