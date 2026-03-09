// Navbar Navigation Fix - Prevent Double Navigation
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navMenu = document.getElementById('navMenu');
    
    // Toggle mobile menu
    if (hamburgerMenu && navMenu) {
        hamburgerMenu.addEventListener('click', function() {
            hamburgerMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburgerMenu.contains(event.target) && !navMenu.contains(event.target)) {
                hamburgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
        
        // Close menu when window resizes to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                hamburgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
    
    // Handle navigation item clicks
    const navItems = document.querySelectorAll('.nav-item, .nav-tab');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Close mobile menu if open
            if (hamburgerMenu && navMenu) {
                hamburgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
});
