function renderMainPage(req, res) {
  res.render("main", {
    movies: [
      {
        _id: "ari",
        title: "Ari",
        coverImage: "/uploads/ari.jpeg",
        trailerUrl: "/uploads/ari.mp4",
      },
    ],
  });
}

module.exports = {
  renderMainPage,
};
