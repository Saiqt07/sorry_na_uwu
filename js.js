// Page 1 elements
const page1 = document.getElementById('page1');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');

// Messages
const noUpsetMessage = document.getElementById('no-upset-message');
const page2 = document.getElementById('page2');
const finalMessage = document.getElementById('final-message');

// Page 2 elements
const forgiveYes = document.getElementById('forgive-yes');
const forgiveNo = document.getElementById('forgive-no');
const forgiveBtns = document.getElementById('forgive-btns');

// If user is upset (clicked Yes)
yesBtn.addEventListener('click', function () {
    page1.classList.add('hidden');
    page2.classList.remove('hidden');
});

// If user is not upset (clicked No)
noBtn.addEventListener('click', function () {
    page1.classList.add('hidden');
    noUpsetMessage.style.display = 'block';
    document.body.classList.add('lively-bg');
    setInterval(createSingleHeart, 200); // Create hearts continuously
});

// If user forgives (clicked Yes on page 2)
forgiveYes.addEventListener('click', function () {
    page2.classList.add('hidden');
    finalMessage.style.display = 'block';
    document.body.classList.add('lively-bg');
    setInterval(createSingleHeart, 200); // Create hearts continuously
});

// Make No button move away from cursor (only affects No button on page 2)
function setupMovingButton(noBtn) {
    noBtn.addEventListener('mouseover', function () {
        // Random position within button container
        const container = noBtn.parentElement;
        const containerRect = container.getBoundingClientRect();

        const maxX = containerRect.width - noBtn.offsetWidth;
        const maxY = containerRect.height - noBtn.offsetHeight;

        const x = Math.random() * maxX;
        const y = Math.random() * maxY;

        noBtn.classList.add('btn-move');
        noBtn.style.position = 'absolute';
        noBtn.style.left = x + 'px';
        noBtn.style.top = y + 'px';
    });

    noBtn.addEventListener('click', function (e) {
        e.preventDefault();
        return false;
    });
}

// Setup moving buttons only for page 2
setupMovingButton(forgiveNo);

// Create heart confetti effect
function createConfetti() {
    const colors = ['#ff6b9d', '#ffb6c1', '#ff4785', '#ff85a2', '#f76590'];

    // Create 30 hearts
    for (let i = 0; i < 30; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-confetti';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
        heart.style.animationDelay = (Math.random() * 2) + 's';
        heart.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        heart.style.setProperty('--scale-end', (Math.random() * 0.7 + 0.3));

        // Random size between 10px and 30px
        const size = Math.random() * 20 + 10;
        heart.style.width = size + 'px';
        heart.style.height = size + 'px';

        document.body.appendChild(heart);

        // Make animation infinite by recreating hearts
        heart.addEventListener('animationend', function () {
            this.remove();
            createSingleHeart(); // Create a new heart when one ends
        });
    }
}

// Create a single heart (used for infinite effect)
function createSingleHeart() {
    const colors = ['#ff6b9d', '#ffb6c1', '#ff4785', '#ff85a2', '#f76590'];
    const heart = document.createElement('div');
    heart.className = 'heart-confetti';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
    heart.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];


    document.body.appendChild(heart);

    heart.addEventListener('animationend', function () {
        this.remove();
        createSingleHeart();
    });
}
// ============ MUSIC CONTROL ============
let musicStarted = false;
let musicPlaying = false;
const bgMusic = document.getElementById('bgMusic');

// Attempt to get toggle button, or create a dummy to prevent errors if missing
const musicToggle = document.getElementById('music-toggle') || {
    classList: {
        remove: () => { },
        add: () => { },
        contains: () => false,
        toggle: () => { }
    },
    addEventListener: () => { }
};

// Add toggle listener
if (musicToggle.id === 'music-toggle') {
    musicToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering document click
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.classList.remove('muted');
            musicPlaying = true;
        } else {
            bgMusic.pause();
            musicToggle.classList.add('muted');
            musicPlaying = false;
        }
    });
}


/**
 * Initialize music on first user interaction
 * (Required for mobile autoplay policies)
 */
function initMusic() {
    if (!musicStarted) {
        // Start from beginning
        bgMusic.currentTime = 0;

        bgMusic.play().then(() => {
            musicStarted = true;
            musicPlaying = true;
            musicToggle.classList.remove('muted');
        }).catch(err => {
            console.log('Autoplay prevented:', err);
            // Music will start on next interaction
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Save playing state only (not time)
    setInterval(() => {
        if (!bgMusic.paused) {
            localStorage.setItem('bgMusicPlaying', 'true');
        } else {
            localStorage.setItem('bgMusicPlaying', 'false');
        }
    }, 500); // Check every 500ms

    // Add event listeners for first interaction
    document.body.addEventListener('click', initMusic, { once: true });
    document.body.addEventListener('touchstart', initMusic, { once: true });

    // Check if we should try to auto-play based on previous state
    // (If it was playing before, try to auto-play from start)
    if (localStorage.getItem('bgMusicPlaying') === 'true') {
        initMusic();
    }
});