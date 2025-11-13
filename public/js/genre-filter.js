// Genre Filter Functionality
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
    populateGenresFromDB();


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

    }

    // Populate genre options from database (via data attribute)
    function populateGenresFromDB() {
      console.log('Populating genres from database...');
      
      // Get genres from data attribute
      const genresData = genreMenu.getAttribute('data-genres');
      
      if (!genresData) {
        console.warn('No genres data found in data-genres attribute');
        return;
      }

      let genres = [];
      try {
        genres = JSON.parse(genresData);
        console.log('Parsed genres from database:', genres);
      } catch (e) {
        console.error('Error parsing genres data:', e);
        return;
      }

      if (!Array.isArray(genres) || genres.length === 0) {
        console.warn('No genres available from database');
        return;
      }

      // Sort genres alphabetically
      const sortedGenres = [...genres].sort();
      console.log('Total genres from DB:', sortedGenres.length);

      // Add genre options to menu
      sortedGenres.forEach(genre => {
        const option = document.createElement('div');
        option.className = 'genre-option';
        option.setAttribute('data-genre', genre);
        option.innerHTML = `<span>${genre}</span>`;
        
        // Click handler to navigate to /genre/Action, /genre/Drama, etc.
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
          
          console.log('"All Genres" clicked');
          console.log('Navigating to: /main');
          
          // Close the menu
          genreMenu.classList.remove('show');
          
          // Navigate back to main page showing all genres
          window.location.href = '/main';
        });
        console.log('"All Genres" option configured');
      }

      console.log('✓ Genre dropdown populated with', sortedGenres.length, 'genres from database');
    }

    // Export current genre for external use
    window.getCurrentGenre = function() { return currentGenre; };
  });
})();