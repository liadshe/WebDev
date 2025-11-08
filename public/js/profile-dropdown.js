// Profile Dropdown Menu - Click to toggle functionality
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const profileIcon = document.getElementById('profileIcon');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const profileDropdown = document.getElementById('profileDropdown');
    
    // Check if elements exist
    if (!profileIcon || !dropdownMenu) {
      console.warn('Profile dropdown elements not found');
      return;
    }

    // Toggle dropdown when clicking profile icon
    profileIcon.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent event from bubbling up
      dropdownMenu.classList.toggle('show');
      console.log('Profile dropdown toggled:', dropdownMenu.classList.contains('show'));
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!profileDropdown.contains(e.target)) {
        if (dropdownMenu.classList.contains('show')) {
          dropdownMenu.classList.remove('show');
          console.log('Profile dropdown closed - clicked outside');
        }
      }
    });

    // Prevent dropdown from closing when clicking inside it
    dropdownMenu.addEventListener('click', function(e) {
      e.stopPropagation();
    });

    // Close dropdown when pressing Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && dropdownMenu.classList.contains('show')) {
        dropdownMenu.classList.remove('show');
        console.log('Profile dropdown closed - Escape key pressed');
      }
    });

    // Optional: Close dropdown after clicking a link
    const dropdownLinks = dropdownMenu.querySelectorAll('a');
    dropdownLinks.forEach(link => {
      link.addEventListener('click', function() {
        // Dropdown will close automatically when navigating
        console.log('Navigating to:', this.getAttribute('href'));
      });
    });
  });
})();
