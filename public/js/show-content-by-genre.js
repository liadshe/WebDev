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
  // Only stop if we are *currently* loading.
  if (loading) return;
  loading = true;

  const loadingIndicator = document.getElementById("loading");
  loadingIndicator.style.display = "block";

  // Check if we reached the end last time. If so, reset to loop.
  if (allLoaded) {
    skip = 0;
    allLoaded = false;
    loadingIndicator.innerText = "Loading..."; // Reset text
  }

  // Fetch with the correct 'skip' query parameter
  const res = await fetch(`/api/genre/${encodeURIComponent(genre)}?skip=${skip}`);
  const data = await res.json();

  // Check if the fetch returned no data
  if (data.length === 0) {
    if (skip === 0) {
      // This means the genre has no content at all.
      loadingIndicator.innerText = "No content found for this genre.";
    } else {
      // This means we've finished a full loop.
      loadingIndicator.innerText = "No more content. Looping...";
    }
    
    allLoaded = true; // Mark the end of this *cycle*.
    loading = false; // Allow the *next* scroll to trigger a new load.
    return; // Stop this function call.
  }

  // Get the grid to add new items
  const grid = document.getElementById("movie-grid");
  
  // Create and append new elements
  data.forEach(movie => {
    const div = document.createElement("div");
    div.className = "cover";
    div.id = movie._id; // REQUIRED for content-details.js
    div.dataset.type = movie.type; // REQUIRED for content-details.js

    // Add 'watched' class for filtering
    if (movie.watched) {
      div.classList.add("watched-item");
    }

    // Set the inner HTML
    div.innerHTML = `<img src="/${movie.coverImagePath}" alt="${movie.title}" class="cover-image">`;
    grid.appendChild(div);
  });

  // Call the function from content-details.js to update progress bars
  if (typeof updateAllProgressBars === 'function') {
    updateAllProgressBars();
  }

  // Update counters and state
  skip += data.length;
  loading = false;
  loadingIndicator.style.display = "none";
}
  loadMovies();

  window.addEventListener("scroll", () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 400) {
      loadMovies();
    }
  });
});

