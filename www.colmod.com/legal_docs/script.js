document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // 1. Check for a saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');

    // 2. Apply the saved theme on page load, or detect system preference
    if (savedTheme) {
        // If a theme is explicitly saved, use it
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode'); // Ensure light mode is active
        }
    } else {
        // If no theme is saved, check the user's system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark'); // Save system preference for consistency
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light'); // Save system preference for consistency
        }
    }

    // 3. Add event listener to the toggle button
    themeToggle.addEventListener('click', () => {
        // Toggle the 'dark-mode' class on the body
        body.classList.toggle('dark-mode');

        // Save the current theme preference to localStorage
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
});
