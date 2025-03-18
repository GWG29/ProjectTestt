// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check for saved theme preference or use default light theme
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply the saved theme on page load
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update toggle button icon based on current theme
    updateThemeToggleIcon(currentTheme);
    
    // Add event listener to theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            // Get current theme
            const currentTheme = document.documentElement.getAttribute('data-theme');
            
            // Toggle theme
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            // Add transition class to body for smooth transition
            document.body.classList.add('theme-transition');
            
            // Set the new theme
            document.documentElement.setAttribute('data-theme', newTheme);
            
            // Save theme preference to localStorage
            localStorage.setItem('theme', newTheme);
            
            // Update toggle button icon
            updateThemeToggleIcon(newTheme);
            
            // Remove transition class after transition completes
            setTimeout(() => {
                document.body.classList.remove('theme-transition');
            }, 500);
        });
    }
});

// Function to update the theme toggle icon based on current theme
function updateThemeToggleIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('img');
        if (themeIcon) {
            // Set icon based on current theme
            themeIcon.src = theme === 'light' ? 'moon.svg' : 'sun.svg';
            themeIcon.alt = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
        }
    }
}