// Content Sorting - Standalone
(function() {
  let currentSort = 'default';
  let originalOrder = {};

  document.addEventListener('DOMContentLoaded', function() {
    console.log('Sort functionality initialized');
    
    const sortIcon = document.getElementById('sortIcon');
    const sortToggle = document.getElementById('sortToggle');
    const sortMenu = document.getElementById('sortMenu');
    const sortOptions = document.querySelectorAll('.sort-option');
    const sortDropdown = document.getElementById('sortDropdown');
    
    if (!sortIcon && !sortToggle) {
      console.warn('Sort trigger elements not found');
      return;
    }

    if (!sortMenu) {
      console.warn('Sort menu not found');
      return;
    }

    // Store original order on page load
    storeOriginalOrder();
    
    // Initialize sorting
    initializeSorting();

    // ========================================
    // SORTING FUNCTIONS
    // ========================================
    function initializeSorting() {
      const trigger = sortIcon || sortToggle;

      // Toggle sort menu
      trigger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        sortMenu.classList.toggle('show');
        
        // Close genre menu if open
        const genreMenu = document.getElementById('genreMenu');
        if (genreMenu) {
          genreMenu.classList.remove('show');
        }
        
        // Close profile dropdown if open
        const profileMenu = document.getElementById('dropdownMenu');
        if (profileMenu) {
          profileMenu.classList.remove('show');
        }
      });

      // Close when clicking outside
      document.addEventListener('click', function(e) {
        if (sortDropdown && !sortDropdown.contains(e.target)) {
          sortMenu.classList.remove('show');
        }
      });

      // Prevent closing when clicking inside menu
      sortMenu.addEventListener('click', function(e) {
        e.stopPropagation();
      });

      // Handle sort option clicks
      sortOptions.forEach(option => {
        option.addEventListener('click', function() {
          const sortType = this.getAttribute('data-sort');
          
          // Update active state
          sortOptions.forEach(opt => opt.classList.remove('active'));
          this.classList.add('active');
          
          // Update current sort
          currentSort = sortType;
          
          // Apply sort
          sortAllGenres(sortType);
          
          // Close menu
          sortMenu.classList.remove('show');
          
          console.log('Sort applied:', sortType);
        });
      });

      // Close on Escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sortMenu.classList.contains('show')) {
          sortMenu.classList.remove('show');
        }
      });

      console.log('Sort dropdown initialized');
    }

    // Store original order of movies
    function storeOriginalOrder() {
      const genreSections = document.querySelectorAll('.genre-section');
      
      genreSections.forEach((section, genreIndex) => {
        const genreRow = section.querySelector('.genre-row');
        if (!genreRow) return;
        
        const covers = Array.from(genreRow.querySelectorAll('.cover'));
        const genreName = section.getAttribute('data-genre');
        
        // Store by genre name instead of index for better reliability
        originalOrder[genreName || genreIndex] = covers.map(cover => ({
          element: cover.cloneNode(true),
          title: cover.querySelector('.cover-image')?.getAttribute('alt') || '',
          id: cover.id,
          originalElement: cover
        }));
      });
      
      console.log('Original order stored for', Object.keys(originalOrder).length, 'genres');
    }

    // Sort all genre sections
    function sortAllGenres(sortType) {
      const genreSections = document.querySelectorAll('.genre-section');
      
      genreSections.forEach((section, genreIndex) => {
        // Skip hidden genre sections (filtered out by genre filter)
        const sectionStyle = window.getComputedStyle(section);
        if (sectionStyle.display === 'none') {
          return;
        }
        
        const genreRow = section.querySelector('.genre-row');
        if (!genreRow) return;
        
        // Get only visible covers
        const covers = Array.from(genreRow.querySelectorAll('.cover'));
        const visibleCovers = covers.filter(cover => {
          const style = window.getComputedStyle(cover);
          return style.display !== 'none';
        });
        
        if (visibleCovers.length === 0) return;
        
        // Create array with titles for sorting
        const items = visibleCovers.map(cover => ({
          element: cover,
          title: cover.querySelector('.cover-image')?.getAttribute('alt') || '',
          id: cover.id
        }));
        
        // Sort based on type
        let sortedItems;
        if (sortType === 'a-z') {
          sortedItems = items.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortType === 'z-a') {
          sortedItems = items.sort((a, b) => b.title.localeCompare(a.title));
        } else {
          // Default - restore original order
          const genreName = section.getAttribute('data-genre');
          const genreKey = genreName || genreIndex;
          
          if (originalOrder[genreKey]) {
            const originalItems = originalOrder[genreKey];
            const visibleIds = new Set(visibleCovers.map(c => c.id));
            sortedItems = originalItems
              .filter(item => visibleIds.has(item.id))
              .map(item => items.find(i => i.id === item.id))
              .filter(Boolean);
          } else {
            sortedItems = items;
          }
        }
        
        // Remove all covers
        covers.forEach(cover => cover.remove());
        
        // Append sorted visible items
        sortedItems.forEach(item => {
          genreRow.appendChild(item.element);
        });
        
        // Re-append hidden covers
        const hiddenCovers = covers.filter(cover => {
          const style = window.getComputedStyle(cover);
          return style.display === 'none';
        });
        hiddenCovers.forEach(cover => {
          genreRow.appendChild(cover);
        });
      });
      
      console.log('Sorted all visible content:', sortType);
    }

    // Export functions for external use
    window.sortContent = sortAllGenres;
    window.getCurrentSort = function() { return currentSort; };
    window.restoreOriginalOrder = storeOriginalOrder;
  });
})();