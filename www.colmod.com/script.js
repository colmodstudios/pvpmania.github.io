document.addEventListener('DOMContentLoaded', () => {
    // --- Dark/Light Mode Toggle Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check if the current page is the main menu by checking the body class
    // This allows different default background colors to be set via CSS variables
    const isMainMenuPage = document.querySelector('.header') !== null; // A simple way to detect if it's the main menu

    if (isMainMenuPage) {
        body.classList.add('main-menu-page');
    }

    // 1. Check for a saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');

    // 2. Apply the saved theme on page load, or detect system preference
    if (savedTheme) {
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    }

    // 3. Add event listener to the toggle button
    if (themeToggle) { // Ensure the button exists before adding listener
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');

            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // --- YouTube Feed Logic ---
    const API_KEY = 'AIzaSyCctdfbNDGSTgBvPfuqezsfwbEX7hj6EMc'; // This will be automatically provided by the Canvas runtime
    const CHANNEL_ID = 'UCrDZ6OmnAz4gCnP4VwNzIHA'; // Colmod Studios Channel ID
    const videoContainer = document.getElementById('youtube-feed');

    if (videoContainer) { // Only fetch if the YouTube feed container exists
        fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=5`)
            .then(response => {
                if (!response.ok) {
                    // Log the status and text for debugging API errors
                    console.error(`YouTube API error: ${response.status} - ${response.statusText}`);
                    throw new Error('YouTube API request failed');
                }
                return response.json();
            })
            .then(data => {
                if (data.items && data.items.length > 0) {
                    data.items.forEach(video => {
                        // Ensure it's a video and not a channel or playlist from search results
                        if (video.id.kind === 'youtube#video') {
                            const videoElement = document.createElement('iframe');
                            videoElement.className = 'youtube-video';
                            videoElement.src = `https://www.youtube.com/embed/${video.id.videoId}`;
                            videoElement.frameBorder = "0";
                            videoElement.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"; // Added common allow attributes
                            videoElement.allowFullscreen = true;
                            videoContainer.appendChild(videoElement);
                        }
                    });
                } else {
                    console.log('No YouTube videos found for this channel.');
                    videoContainer.innerHTML = '<p>No recent videos found. Please check the channel ID or API key if running externally.</p>';
                    videoContainer.style.color = body.classList.contains('dark-mode') ? 'white' : '#333'; // Ensure message is visible
                }
            })
            .catch(error => {
                console.error('Error fetching YouTube videos:', error);
                if (videoContainer) {
                    videoContainer.innerHTML = '<p>Failed to load YouTube videos. Please try again later or check your network connection.</p>';
                    videoContainer.style.color = body.classList.contains('dark-mode') ? 'white' : '#333'; // Ensure error message is visible
                }
            });
    }
});
