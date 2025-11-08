// Content Filter - Filters content by type (movies, series, all)
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    
    // Get filter from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const filterType = urlParams.get('type');
    
    // Apply filter on page load if type parameter exists
    if (filterType) {
      filterContent(filterType);
    }
    
    // Listen for navigation events (if using client-side routing)
    window.addEventListener('popstate', function() {
      const urlParams = new URLSearchParams(window.location.search);
      const filterType = urlParams.get('type');
      if (filterType) {
        filterContent(filterType);
      } else {
        showAllContent();
      }
    });
  });

  // Filter content based on type
  function filterContent(type) {
    console.log('Filtering content by type:', type);
    
    const allCovers = document.querySelectorAll('.cover');
    const allGenreSections = document.querySelectorAll('.genre-section');
    
    let visibleCount = 0;

    // Hide all genre sections first
    allGenreSections.forEach(section => {
      section.style.display = 'none';
    });

    // Filter content items
    allCovers.forEach(cover => {
      const contentType = cover.getAttribute('data-type');
      
      if (type === 'all') {
        cover.style.display = 'block';
        visibleCount++;
      } else if (type === 'movies' && contentType === 'movie') {
        cover.style.display = 'block';
        visibleCount++;
      } else if (type === 'series' && (contentType === 'series' || contentType === 'episode')) {
        cover.style.display = 'block';
        visibleCount++;
      } else {
        cover.style.display = 'none';
      }
    });

    // Show genre sections that have visible content
    allGenreSections.forEach(section => {
      const genreRow = section.querySelector('.genre-row');
      const visibleMovies = genreRow.querySelectorAll('.cover[style*="display: block"], .cover:not([style*="display: none"])');
      
      if (visibleMovies.length > 0) {
        section.style.display = 'block';
      }
    });

    // Show message if no content found
    if (visibleCount === 0) {
      showNoContentMessage(type);
    } else {
      removeNoContentMessage();
    }
  }

  // Show all content (remove filter)
  function showAllContent() {
    console.log('Showing all content');
    
    const allCovers = document.querySelectorAll('.cover');
    const allGenreSections = document.querySelectorAll('.genre-section');
    
    allCovers.forEach(cover => {
      cover.style.display = 'block';
    });
    
    allGenreSections.forEach(section => {
      section.style.display = 'block';
    });

    removeNoContentMessage();
  }

  // Show "no content" message
  function showNoContentMessage(type) {
    removeNoContentMessage();

    const main = document.querySelector('main');
    const noContentDiv = document.createElement('div');
    noContentDiv.className = 'no-content-message';
    
    let message = 'No content found';
    if (type === 'movies') {
      message = 'No movies available';
    } else if (type === 'series') {
      message = 'No TV shows available';
    }
    
    noContentDiv.innerHTML = `
      <h2>${message}</h2>
      <p>Try browsing <a href="/main?type=all">all content</a></p>
    `;
    main.appendChild(noContentDiv);
  }

  // Remove "no content" message
  function removeNoContentMessage() {
    const existing = document.querySelector('.no-content-message');
    if (existing) {
      existing.remove();
    }
  }

  // Make functions available globally if needed
  window.filterContent = filterContent;
  window.showAllContent = showAllContent;
})();