// controllers/searchController.js - CORRECTED VERSION WITH DEBUGGING

const addContentService = require("../services/addContentService");

// Make sure this function is exported correctly
async function searchContent(req, res) {
  try {
    console.log("Search route hit with query:", req.query.q);
    
    const query = req.query.q;
    
    // Validate query
    if (!query || query.trim().length < 2) {
      console.log("Query too short or empty");
      return res.json({ results: [] });
    }

    // Get all content
    const allContent = await addContentService.getAllContent();
    
    // Search logic: filter by title or genre
    const searchTerm = query.toLowerCase().trim();
    const results = allContent.filter(movie => {
      // Search in title
      const titleMatch = movie.title && movie.title.toLowerCase().includes(searchTerm);
      
      // Search in genres
      const genreMatch = movie.genre && movie.genre.some(g => 
        g.toLowerCase().includes(searchTerm)
      );
      
      // Search in description (if available)
      const descriptionMatch = movie.description && 
        movie.description.toLowerCase().includes(searchTerm);
      
      return titleMatch || genreMatch || descriptionMatch;
    });

    // Limit results to avoid overwhelming the UI
    const limitedResults = results.slice(0, 10);

    res.json({ results: limitedResults });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ 
      error: "Search failed",
      message: error.message 
    });
  }
}

// IMPORTANT: Make sure to export the function
module.exports = { 
  searchContent 
};

// Alternative export if your app uses different syntax:
// module.exports.searchContent = searchContent;