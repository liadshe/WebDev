const addContentService = require("../services/addContentService");

// render add-content page by ejs file named content.ejs
async function renderAddConentPage(req, res){
    try {
        const genres = await addContentService.getAllGenres();
        if (!genres) {
            console.log("No genres found, using empty array");
        }
        res.render("content", { genres });
    } catch (err) {
        console.error("Error fetching genres:", err);
    }
};

async function handleContentSubmission(req, res) {
    try {
    // TO ADD - get rating
    const rating = 5;

    // TO ADD - get durationMinutes
    const durationMinutes = 100;

    // use uploaded files from multer (router uses upload.fields)
    const files = req.files || {};
    const coverFile = files.coverImageFile && files.coverImageFile[0];
    const videoFile = files.videoFile && files.videoFile[0];

    // public URLs (public/ is served as root)
    const coverImagePath = `/uploads/${coverFile.filename}`;
    const videoPath = `/uploads/${videoFile.filename}`;
    
    // normalize incoming fields
    const genre = Array.isArray(req.body.genre) ? req.body.genre : (req.body.genre ? [req.body.genre] : []);
    const cast = typeof req.body.cast === 'string' ? req.body.cast.split(',').map(s => s.trim()).filter(Boolean) : [];

    const contentData = {
        title: req.body.title || 'Untitled',
        description: req.body.description || '',
        genre,
        cast,
        director: req.body.director || '',
        releaseYear: Number(req.body.releaseYear) || undefined,
        durationMinutes: durationMinutes,
        rating: rating,
        videoPath: videoPath,
        coverImagePath: coverImagePath
    };

    await addContentService.addContent(contentData);

    // redirect back to the add form (or you can send JSON)
    res.redirect("/content");
    // TO ADD - send a banner of success to the user

    }
    catch (err) {
        console.log("Error in handleContentSubmission:", err);
        res.status(500).send("Server error - controller");
}
};

module.exports = {
    renderAddConentPage,
    handleContentSubmission
};
