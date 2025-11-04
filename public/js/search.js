// Live Filter Search - Filters movies on main.ejs page as you type
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const searchIcon = document.getElementById('search-icon');
    const searchBox = document.getElementById('search-box');
    const searchInput = document.getElementById('search-input');
    const closeSearch = document.getElementById('close-search');
    
    // Check if elements exist
    if (!searchIcon || !searchBox || !searchInput || !closeSearch) {
      console.warn('Search elements not found');
      return;
    }



    // Open search box
    searchIcon.addEventListener('click', function(e) {
      e.stopPropagation();
      searchBox.classList.add('active');
      searchInput.focus();
      if (!overlay) createOverlay();
      overlay.classList.add('active');
    });

    // Close search box and show all movies
    function closeSearchBox() {
      searchBox.classList.remove('active');
      searchInput.value = '';
      if (overlay) overlay.classList.remove('active');
      
      // Show all movies and genres again
      showAllMovies();
    }

    closeSearch.addEventListener('click', function(e) {
      e.preventDefault();
      closeSearchBox();
    });

    // Escape key to close
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && searchBox.classList.contains('active')) {
        closeSearchBox();
      }
    });

    // Live filter as user types
    searchInput.addEventListener('input', function() {
      const query = this.value.trim().toLowerCase();
      
      if (query.length === 0) {
        // If search is empty, show all movies
        showAllMovies();
        return;
      }

      // Filter movies based on query
      filterMovies(query);
    });

    // Filter movies on the page
    function filterMovies(query) {
      // Get all movie covers
      const allCovers = document.querySelectorAll('.cover');
      const allGenreSections = document.querySelectorAll('.genre-section');
      
      let visibleCount = 0;

      // Hide all genre sections first
      allGenreSections.forEach(section => {
        section.style.display = 'none';
      });

      // Check each movie
      allCovers.forEach(cover => {
        const img = cover.querySelector('.cover-image');
        const title = img ? img.getAttribute('alt').toLowerCase() : '';
        const movieId = cover.id;
        
        // Get the genre section this movie belongs to
        const genreRow = cover.closest('.genre-row');
        const genreSection = cover.closest('.genre-section');
        
        // Check if title matches query
        if (title.includes(query)) {
          cover.style.display = 'block';
          visibleCount++;
          
          // Show the genre section if it has visible movies
          if (genreSection) {
            genreSection.style.display = 'block';
          }
        } else {
          cover.style.display = 'none';
        }
      });

      // Hide empty genre sections
      allGenreSections.forEach(section => {
        const genreRow = section.querySelector('.genre-row');
        const visibleMovies = genreRow.querySelectorAll('.cover[style*="display: block"], .cover:not([style*="display: none"])');
        
        if (visibleMovies.length === 0) {
          section.style.display = 'none';
        }
      });

      // Show "no results" message if nothing found
      showNoResultsMessage(visibleCount, query);
    }

    // Show all movies (reset filter)
    function showAllMovies() {
      const allCovers = document.querySelectorAll('.cover');
      const allGenreSections = document.querySelectorAll('.genre-section');
      
      // Show all movies
      allCovers.forEach(cover => {
        cover.style.display = 'block';
      });
      
      // Show all genre sections
      allGenreSections.forEach(section => {
        section.style.display = 'block';
      });

      // Remove "no results" message if it exists
      removeNoResultsMessage();
    }

    // Show "no results" message
    function showNoResultsMessage(count, query) {
      // Remove existing message first
      removeNoResultsMessage();

      if (count === 0) {
        const main = document.querySelector('main');
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-results-message';
        noResultsDiv.innerHTML = `
          <div class="no-results-icon">🔍</div>
          <h2>No movies found</h2>
          <p>No results for "${escapeHtml(query)}"</p>
          <p class="no-results-hint">Try searching for something else</p>
        `;
        main.appendChild(noResultsDiv);
      }
    }

    // Remove "no results" message
    function removeNoResultsMessage() {
      const existing = document.querySelector('.no-results-message');
      if (existing) {
        existing.remove();
      }
    }

    // Helper function to escape HTML
    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // Prevent search box from closing when clicking inside it
    searchBox.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  });
})();