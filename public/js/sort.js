// Sort dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
  const sortToggle = document.getElementById('sortToggle');
  const sortMenu = document.getElementById('sortMenu');
  const sortOptions = document.querySelectorAll('.sort-option');

  // Get current sort from URL
  const urlParams = new URLSearchParams(window.location.search);
  const currentSort = urlParams.get('sort') || 'default';

  // Set active sort option based on URL
  sortOptions.forEach(option => {
    if (option.dataset.sort === currentSort) {
      option.classList.add('active');
    } else {
      option.classList.remove('active');
    }
  });

  // Toggle sort menu
  if (sortToggle) {
    sortToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      sortMenu.classList.toggle('show');
    });
  }

  // Handle sort option click
  sortOptions.forEach(option => {
    option.addEventListener('click', function(e) {
      e.preventDefault();
      const sortValue = this.dataset.sort;
      
      // Update active class
      sortOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      
      // Update URL with sort parameter
      const url = new URL(window.location);
      url.searchParams.set('sort', sortValue);
      
      // Reload page with new sort parameter
      window.location.href = url.toString();
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.sort-dropdown')) {
      sortMenu.classList.remove('show');
    }
  });
});