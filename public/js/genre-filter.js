(function() {
  let currentGenre = 'all';

  document.addEventListener('DOMContentLoaded', function() {
    
    const genreToggle = document.getElementById('genreToggle');
    const genreMenu = document.getElementById('genreMenu');
    const genreDropdown = document.getElementById('genreDropdown');
    
    // Exit if genre dropdown doesn't exist
    if (!genreToggle || !genreMenu || !genreDropdown) {
      return;
    }

    // Initialize genre dropdown
    initializeGenreDropdown();
    populateGenres();


    function initializeGenreDropdown() {
      // Toggle genre menu
      genreToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isOpen = genreMenu.classList.contains('show');
        genreMenu.classList.toggle('show');
                
        // Close sort menu if open
        const sortMenu = document.getElementById('sortMenu');
        if (sortMenu) {
          sortMenu.classList.remove('show');
        }
        
        // Close profile dropdown if open
        const profileMenu = document.getElementById('dropdownMenu');
        if (profileMenu) {
          profileMenu.classList.remove('show');
        }
      });

      // Close when clicking outside
      document.addEventListener('click', function(e) {
        if (!genreDropdown.contains(e.target)) {
          genreMenu.classList.remove('show');
        }
      });

      // Prevent closing when clicking inside menu
      genreMenu.addEventListener('click', function(e) {
        e.stopPropagation();
      });

      // Close on Escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && genreMenu.classList.contains('show')) {
          genreMenu.classList.remove('show');
        }
      });

    }

    // Populate genre options from existing content
    function populateGenres() {
    const menu = document.getElementById("genreMenu");
    const genresData = menu.getAttribute("data-genres");

    let genres = [];
    try {
        genres = JSON.parse(genresData);
    } catch (err) {
        console.error("Failed to parse genres:", err);
        return;
    }

    // Remove old items except "All Genres"
    const allOption = menu.querySelector('.genre-option[data-genre="all"]');
    menu.innerHTML = "";
    menu.appendChild(allOption);

    // Add all genres from server
    genres.forEach(genre => {
        const option = document.createElement("div");
        option.className = "genre-option";
        option.dataset.genre = genre;
        option.innerHTML = `<span>${genre}</span>`;
        
        option.addEventListener("click", () => {
            window.location.href = `/genre/${encodeURIComponent(genre)}`;
        });

        menu.appendChild(option);
    });
}

    // Export current genre for external use
    window.getCurrentGenre = function() { return currentGenre; };
  });
})();