// Genre Filter Functionality
(function() {
  let currentGenre = 'all';

  document.addEventListener('DOMContentLoaded', function() {
    console.log('Genre filter initialized');
    
    const genreToggle = document.getElementById('genreToggle');
    const genreMenu = document.getElementById('genreMenu');
    const genreDropdown = document.getElementById('genreDropdown');
    
    // Exit if genre dropdown doesn't exist (not on series/movies page)
    if (!genreToggle || !genreMenu || !genreDropdown) {
      console.log('Genre dropdown not found - likely on home page');
      return;
    }

    // Initialize genre dropdown
    initializeGenreDropdown();
    populateGenres();

    // ========================================
    // GENRE DROPDOWN FUNCTIONS
    // ========================================
    function initializeGenreDropdown() {
      // Toggle genre menu
      genreToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
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

      console.log('Genre dropdown initialized');
    }

    // Populate genre options from existing content
    function populateGenres() {
      const genreSections = document.querySelectorAll('.genre-section');
      const genres = new Set();

      genreSections.forEach(section => {
        const genre = section.getAttribute('data-genre');
        if (genre) {
          genres.add(genre);
        }
      });

      // Sort genres alphabetically
      const sortedGenres = Array.from(genres).sort();

      // Add genre options to menu
      sortedGenres.forEach(genre => {
        const option = document.createElement('div');
        option.className = 'genre-option';
        option.setAttribute('data-genre', genre);
        option.innerHTML = `<span>${genre}</span>`;
        
        option.addEventListener('click', function() {
          filterByGenre(genre);
          
          // Update active state
          const allOptions = genreMenu.querySelectorAll('.genre-option');
          allOptions.forEach(opt => opt.classList.remove('active'));
          option.classList.add('active');
          
          // Close menu
          genreMenu.classList.remove('show');
        });
        
        genreMenu.appendChild(option);
      });

      // Add click handler to "All Genres" option
      const allOption = genreMenu.querySelector('.genre-option[data-genre="all"]');
      if (allOption) {
        allOption.addEventListener('click', function() {
          filterByGenre('all');
          
          // Update active state
          const allOptions = genreMenu.querySelectorAll('.genre-option');
          allOptions.forEach(opt => opt.classList.remove('active'));
          allOption.classList.add('active');
          
          // Close menu
          genreMenu.classList.remove('show');
        });
      }

      console.log('Populated', sortedGenres.length, 'genres');
    }

    // Filter content by genre
    function filterByGenre(genre) {
      currentGenre = genre;
      const genreSections = document.querySelectorAll('.genre-section');

      if (genre === 'all') {
        // Show all sections
        genreSections.forEach(section => {
          section.style.display = 'block';
        });
        console.log('Showing all genres');
      } else {
        // Show only selected genre
        genreSections.forEach(section => {
          const sectionGenre = section.getAttribute('data-genre');
          if (sectionGenre === genre) {
            section.style.display = 'block';
          } else {
            section.style.display = 'none';
          }
        });
        console.log('Filtered to genre:', genre);
      }

      // Re-apply current sort to visible sections
      if (window.sortContent && window.getCurrentSort) {
        const currentSort = window.getCurrentSort();
        if (currentSort) {
          // Use setTimeout to ensure display changes are applied first
          setTimeout(() => {
            window.sortContent(currentSort);
            console.log('Re-applied sort after genre filter:', currentSort);
          }, 10);
        }
      }
    }

    // Export functions for external use
    window.filterByGenre = filterByGenre;
    window.getCurrentGenre = function() { return currentGenre; };
  });
})();