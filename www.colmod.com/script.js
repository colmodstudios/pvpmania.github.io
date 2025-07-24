document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const preferencesBtn = document.getElementById('preferences-btn');
    const floatingButtonsContainer = document.getElementById('floating-buttons-container');

    // --- Dark/Light Mode Toggle Logic ---

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
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');

            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // --- Floating Buttons Container Logic ---
    if (preferencesBtn && floatingButtonsContainer) {
        preferencesBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            floatingButtonsContainer.classList.toggle('active');
        });

        document.addEventListener('click', (event) => {
            if (!floatingButtonsContainer.contains(event.target) && !preferencesBtn.contains(event.target) && floatingButtonsContainer.classList.contains('active')) {
                floatingButtonsContainer.classList.remove('active');
            }
        });
    }


    // --- Smooth Scroll for Contact Button ---
    const contactScrollBtn = document.querySelector('.contact-scroll-btn');
    if (contactScrollBtn) {
        contactScrollBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const footer = document.getElementById('contact-info');
            if (footer) {
                footer.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }

    // --- YouTube Feed Logic (only runs if #youtube-section exists) ---
    const API_KEY = 'AIzaSyCctdfbNDGSTgBvPfuqezsfwbEX7hj6EMc'; // <--- IMPORTANT: Replace with your actual YouTube Data API v3 Key
    const CHANNEL_ID = 'UCrDZ6OmnAz4gCnP4VwNzIHA'; // Colmod Studios Channel ID
    const youtubeFeedSection = document.getElementById('youtube-section');
    const youtubeFeedContainer = document.getElementById('youtube-feed');
    const loadingMessageYoutube = youtubeFeedContainer ? youtubeFeedContainer.querySelector('.loading-message') : null;

    if (youtubeFeedSection && youtubeFeedContainer) {
        const fetchYouTubeVideos = () => {
            if (loadingMessageYoutube) loadingMessageYoutube.textContent = 'Loading videos...';

            fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=5`)
                .then(response => {
                    if (!response.ok) {
                        console.error(`YouTube API error: ${response.status} - ${response.statusText}`);
                        throw new Error('YouTube API request failed');
                    }
                    return response.json();
                })
                .then(data => {
                    let videosWrapper = youtubeFeedContainer.querySelector('.youtube-feed-container-wrapper');
                    if (videosWrapper) videosWrapper.remove();

                    if (loadingMessageYoutube) loadingMessageYoutube.remove();

                    videosWrapper = document.createElement('div');
                    videosWrapper.className = 'youtube-feed-container-wrapper';

                    if (data.items && data.items.length > 0) {
                        data.items.forEach(video => {
                            if (video.id.kind === 'youtube#video') {
                                const videoElement = document.createElement('iframe');
                                videoElement.className = 'youtube-video';
                                videoElement.src = `https://www.youtube.com/embed/${video.id.videoId}`;
                                videoElement.frameBorder = "0";
                                videoElement.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                                videoElement.allowFullscreen = true;
                                videosWrapper.appendChild(videoElement);
                            }
                        });
                        youtubeFeedContainer.appendChild(videosWrapper);
                    } else {
                        console.log('No YouTube videos found for this channel.');
                        youtubeFeedContainer.innerHTML += '<p>No recent videos found. Please check the channel ID or API key.</p>';
                    }
                })
                .catch(error => {
                    console.error('Error fetching YouTube videos:', error);
                    if (loadingMessageYoutube) loadingMessageYoutube.remove();
                    youtubeFeedContainer.innerHTML += '<p>Failed to load YouTube videos. Please try again later or check your network connection.</p>';
                });
        };
        fetchYouTubeVideos();
    }

    // --- Dynamic Game Card Loading Logic (for games/index.html) ---
    const gamesContainer = document.getElementById('games-container');
    const loadingMessageGames = gamesContainer ? gamesContainer.querySelector('.loading-message') : null;

    if (gamesContainer && window.location.pathname.includes('/games/index.html')) {
        if (loadingMessageGames) loadingMessageGames.remove(); // Remove loading message

        // Directly create the Pvpmania game card
        const gameCard = document.createElement('article');
        gameCard.className = 'game-card featured-pvpmania'; // Keep the featured-pvpmania class

        gameCard.innerHTML = `
            <a href="https://gamejolt.com/games/PvpMania/798632" target="_blank" rel="noopener noreferrer">
                <img src="../Resources/image-5uagxxdi.png" alt="Pvpmania Game Thumbnail">
                <div class="game-card-content">
                    <h3 class="game-card-title">Pvpmania</h3>
                    <p class="game-card-description">Dive into thrilling real-time combat with unique tanks and strategic gameplay. Dominate the arena in this action-packed experience!</p>
                    <button class="game-card-button">Play Now</button>
                </div>
            </a>
        `;
        gamesContainer.appendChild(gameCard);
    }


    // --- Canvas Background Animation Logic ---
    const canvas = document.getElementById('full-page-canvas'); // Targets the full-page canvas
    const ctx = canvas ? canvas.getContext('2d') : null;

    if (canvas && ctx) {
        let particles = [];
        const numParticles = 80;
        const maxRadius = 2.5;
        const minRadius = 0.8;
        const maxSpeed = 0.4;
        const lineDistance = 120;
        const mouseRadius = 80;
        let mouse = { x: null, y: null };

        function getCanvasColors() {
            const style = getComputedStyle(document.body);
            return {
                particleColor1: style.getPropertyValue('--canvas-particle-color-1').trim(),
                particleColor2: style.getPropertyValue('--canvas-particle-color-2').trim(),
                lineColor: style.getPropertyValue('--canvas-line-color').trim(),
                shadowColor: style.getPropertyValue('--canvas-shadow-color').trim()
            };
        }

        class Particle {
            constructor(x, y, radius, dx, dy, color) {
                this.x = x;
                this.y = y;
                this.radius = radius;
                this.dx = dx;
                this.dy = dy;
                this.color = color;
                this.originalRadius = radius;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.closePath();
            }

            update() {
                if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                    this.dx = -this.dx;
                }
                if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
                    this.dy = -this.dy;
                }

                this.x += this.dx;
                this.y += this.dy;

                let colors = getCanvasColors();
                if (mouse.x !== null && mouse.y !== null) {
                    let distance = Math.sqrt(Math.pow(mouse.x - this.x, 2) + Math.pow(mouse.y - this.y, 2));
                    if (distance < mouseRadius) {
                        if (this.radius < maxRadius * 1.5) {
                            this.radius += 0.08;
                        }
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, this.radius + 3, 0, Math.PI * 2, false);
                        ctx.shadowBlur = 10;
                        ctx.shadowColor = colors.shadowColor;
                        ctx.fillStyle = colors.shadowColor;
                        ctx.fill();
                        ctx.restore();
                    } else if (this.radius > this.originalRadius) {
                        this.radius -= 0.05;
                    }
                } else if (this.radius > this.originalRadius) {
                    this.radius -= 0.03;
                }

                this.draw();
            }
        }

        function initParticles() {
            particles = [];
            const colors = getCanvasColors();
            for (let i = 0; i < numParticles; i++) {
                let radius = Math.random() * (maxRadius - minRadius) + minRadius;
                let x = Math.random() * (canvas.width - radius * 2) + radius;
                let y = Math.random() * (canvas.height - radius * 2) + radius;
                let dx = (Math.random() - 0.5) * maxSpeed * 2;
                let dy = (Math.random() - 0.5) * maxSpeed * 2;
                let color = i % 2 === 0 ? colors.particleColor1 : colors.particleColor2;
                particles.push(new Particle(x, y, radius, dx, dy, color));
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const colors = getCanvasColors();

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();

                for (let j = i; j < particles.length; j++) {
                    let p1 = particles[i];
                    let p2 = particles[j];
                    let distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

                    if (distance < lineDistance) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = colors.lineColor;
                        ctx.lineWidth = 0.7;
                        ctx.shadowBlur = 5;
                        ctx.shadowColor = colors.shadowColor;
                        ctx.stroke();
                        ctx.closePath();
                        ctx.shadowBlur = 0;
                    }
                }
            }
        }

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = document.body.scrollHeight; // Covers entire scrollable height
            initParticles();
        }

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', (event) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        });
        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        resizeCanvas();
        animate();
    }
});
