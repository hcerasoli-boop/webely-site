const canvas = document.getElementById('hero-canvas');
const context = canvas.getContext('2d');
const heroSection = document.getElementById('hero');

// Configuration
const frameCount = 192;
const fps = 24; // Target FPS
const frameInterval = 1000 / fps;
let currentFrameIndex = 0;
let lastDrawTime = 0;
let isLoaded = false;

// Image storage
const images = [];

// Helper to get image path
const getFramePath = (index) => {
    return `assets/hero-frames/frame_${index.toString().padStart(3, '0')}.jpg`;
};

// Canvas Resizing
const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // If not playing yet, draw the first frame or current frame if available
    if (images[currentFrameIndex] && images[currentFrameIndex].complete) {
        render();
    }
};

window.addEventListener('resize', resizeCanvas);


// Image scaling to cover (object-fit: cover equivalent)
const drawImageCover = (ctx, img, canvasWidth, canvasHeight) => {
    const imgRatio = img.width / img.height;
    const canvasRatio = canvasWidth / canvasHeight;

    let renderWidth, renderHeight, xStart, yStart;

    if (imgRatio < canvasRatio) {
        renderWidth = canvasWidth;
        renderHeight = renderWidth / imgRatio;
        xStart = 0;
        yStart = (canvasHeight - renderHeight) / 2;
    } else {
        renderHeight = canvasHeight;
        renderWidth = renderHeight * imgRatio;
        yStart = 0;
        xStart = (canvasWidth - renderWidth) / 2;
    }

    ctx.drawImage(img, xStart, yStart, renderWidth, renderHeight);
};

// Rendering
const render = () => {
    if (!images[currentFrameIndex]) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawImageCover(context, images[currentFrameIndex], canvas.width, canvas.height);
};

// Animation Loop
const animate = (timestamp) => {
    if (!lastDrawTime) lastDrawTime = timestamp;

    const elapsed = timestamp - lastDrawTime;

    if (elapsed > frameInterval) {
        // Only advance if the next frame is ready
        const nextFrameIndex = (currentFrameIndex + 1) % frameCount;

        if (images[currentFrameIndex] && images[currentFrameIndex].complete) {
            // Visualize loading state if needed, or just play what's available
            // But we want smooth playback. If we play faster than load, it might stutter.
            // Strategy: Buffer. Wait until first 24 frames are loaded to start.

            if (images[nextFrameIndex] && images[nextFrameIndex].complete) {
                render(); // Draw current frame
                if (isLoaded || loadedCount > 24) { // Start advancing after buffer
                    currentFrameIndex = nextFrameIndex;
                    lastDrawTime = timestamp - (elapsed % frameInterval);
                    if (!canvas.classList.contains('loaded')) canvas.classList.add('loaded');
                }
            }
        }
    }

    requestAnimationFrame(animate);
};

let loadedCount = 0;

// Preloading
const preloadImages = () => {
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = getFramePath(i);
        img.onload = () => {
            loadedCount++;
            if (loadedCount === frameCount) {
                isLoaded = true;
            }
        };
        images.push(img);
    }
};


// Initialization
const init = () => {
    resizeCanvas();
    preloadImages();
    requestAnimationFrame(animate);
};


// Mobile Menu Toggle
const toggleBtn = document.querySelector('.mobile-menu-toggle');
const nav = document.querySelector('nav');

if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        // Add mobile styling classes if needed
        if (nav.style.display === 'flex') {
            nav.style.flexDirection = 'column';
            nav.style.position = 'absolute';
            nav.style.top = '100%';
            nav.style.left = '0';
            nav.style.width = '100%';
            nav.style.background = 'var(--bg-secondary)'; // opaque
            nav.style.padding = '1rem';
        }
    });
}

// Start
init();
