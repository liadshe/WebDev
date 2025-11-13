document.addEventListener("DOMContentLoaded", () => {
  let genre = document.body.dataset.genre; 
  
  // normelize genre name
  genre = genre
  .split('-')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  .join('-'); 
   
  let skip = 0;
  let loading = false;
  let allLoaded = false;


  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".filter-btn.active").classList.remove("active");
        btn.classList.add("active");

        const type = btn.dataset.filter;
        filterMovies(type);
    });
});

  function filterMovies(type) {
      document.querySelectorAll(".cover").forEach(item => {
          const watched = item.classList.contains("watched-item");

          if (type === "all") {
              item.style.display = "block";
          } else if (type === "watched") {
              item.style.display = watched ? "block" : "none";
          } else if (type === "unwatched") {
              item.style.display = watched ? "none" : "block";
          }
      });
  }
  async function loadMovies() {
    if (loading || allLoaded) return;
    loading = true;
    document.getElementById("loading").style.display = "block";

    const res = await fetch(`/api/genre/${encodeURIComponent(genre)}`);
    const data = await res.json();
    if (data.length === 0) {
      allLoaded = true;
      document.getElementById("loading").innerText = "No more movies";
      return;
    }

    const grid = document.getElementById("movie-grid");
    data.forEach(movie => {
      const div = document.createElement("div");
      div.className = "cover";
      div.innerHTML = `<img src="/${movie.coverImagePath}" alt="${movie.title}" class="cover-image">`;
      grid.appendChild(div);
    });

    skip += data.length;
    loading = false;
    document.getElementById("loading").style.display = "none";
  }

  loadMovies();

  window.addEventListener("scroll", () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 400) {
      loadMovies();
    }
  });
});

