(function() {
  let currentGenre = 'all';

  document.addEventListener('DOMContentLoaded', function() {
    console.log('Genre filter initialized');
    
    const genreToggle = document.getElementById('genreToggle');
    const genreMenu = document.getElementById('genreMenu');
    const genreDropdown = document.getElementById('genreDropdown');
    
    // Exit if genre dropdown doesn't exist
    if (!genreToggle || !genreMenu || !genreDropdown) {
      console.log('Genre dropdown not found - likely on a different page');
      return;
    }

    console.log('Genre dropdown elements found - initializing...');

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
        
        console.log('Genre dropdown toggled:', !isOpen ? 'opened' : 'closed');
        
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

      console.log('Genre dropdown event listeners attached');
    }

    // Populate genre options from existing content
    function populateGenres() {
      console.log('Populating genres from page content...');
      
      const genreSections = document.querySelectorAll('.genre-section');
      console.log('Found', genreSections.length, 'genre sections');
      
      const genres = new Set();

      genreSections.forEach((section, index) => {
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
        
        // IMPORTANT: Click handler to navigate to /genre/Action, /genre/Drama, etc.
        option.addEventListener('click', function(e) {
          e.preventDefault();
          
          console.log('Genre clicked:', genre);
          console.log('Navigating to: /genre/' + genre);
          
          // Close the menu
          genreMenu.classList.remove('show');
          
          // Navigate to the genre page
          window.location.href = `/genre/${encodeURIComponent(genre)}`;
        });
        
        genreMenu.appendChild(option);
      });

      // Add click handler to "All Genres" option
      const allOption = genreMenu.querySelector('.genre-option[data-genre="all"]');
      if (allOption) {
        allOption.addEventListener('click', function(e) {
          e.preventDefault();          
          // Close the menu
          genreMenu.classList.remove('show');
          
          // Navigate back to main page showing all genres
          window.location.href = '/main';
        });
      }

    }

    // Export current genre for external use
    window.getCurrentGenre = function() { return currentGenre; };
  });
})();