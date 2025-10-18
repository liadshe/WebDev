const Content = require("../models/Content");
const { genres } = require("../models/Genres"); 
const addContentService = require("../services/addContentService");

// get genres from db
async function getAllGenres(req,res) {
    try {
            const genres = await addContentService.getAllGenres();
            res.json(genres)
    } catch(err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};


// render add-content page by ejs file named add-content.ejs
function renderAddConentPage(req, res){
  res.render("content", { genres });
};


// send data to db
// async function handleContentSubmission(req, res) {
//     const { title, discription, year, genere, cast, director} = req.body;

// };

module.exports = {
    renderAddConentPage,
    getAllGenres,
 //   handleContentSubmission
};
