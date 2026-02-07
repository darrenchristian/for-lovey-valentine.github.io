document.addEventListener('DOMContentLoaded', () => {
    const heartsContainer = document.getElementById('hearts-container');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const mainText = document.getElementById('main-text');
    let yesScale = 1;

    // Initial gentle rain
    let rainInterval = setInterval(createHeart, 300);

    /* 
     * Function to create a falling heart or rose
     * type: 'heart' (default) or 'mix' (hearts and roses)
     */
    function createHeart(type = 'heart') {
        const heart = document.createElement('div');
        heart.classList.add('falling-element');

        const symbols = ['❤️', '💖', '💕', '💗', '💓'];
        if (type === 'mix') {
            symbols.push('🌹', '💐', '🌸');
        }

        heart.innerText = symbols[Math.floor(Math.random() * symbols.length)];

        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 2 + 3 + 's'; // 3-5 seconds
        heart.style.fontSize = Math.random() * 1.5 + 1 + 'rem'; // 1-2.5rem

        heartsContainer.appendChild(heart);

        // Remove element after animation ends to prevent memory leak
        setTimeout(() => {
            heart.remove();
        }, 5000);
    }

    /* 
     * Function to create explosion effect on click
     */
    function createExplosion(x, y) {
        const particleCount = 20; // Number of particles
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.innerText = '❤️';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';

            // Random direction for explosion
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 100 + 50; // Distance to travel
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);

            // Random particle size
            const size = Math.random() * 1 + 0.5 + 'rem';
            particle.style.fontSize = size;

            heartsContainer.appendChild(particle);

            // Cleanup
            particle.addEventListener('animationend', () => {
                particle.remove();
            });
        }
    }

    /* 
     * Global click listener for explosions
     */
    document.addEventListener('click', (e) => {
        // Create explosion at click coordinates
        createExplosion(e.clientX, e.clientY);
    });

    /* 
     * "No" Button Interaction
     */
    noBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering window click if desired, though explosion is nice here too

        // Shake the Yes button
        yesBtn.classList.remove('shake');
        void yesBtn.offsetWidth; // Trigger reflow to restart animation
        yesBtn.classList.add('shake');

        // Scale up the Yes button
        yesScale += 0.2;
        yesBtn.style.transform = `scale(${yesScale})`;
        yesBtn.style.setProperty('--scale-factor', yesScale); // Update custom property for shake animation if needed

        // Optional: Move No button randomly? (Not requested, but fun. Sticking to scaling Yes for now)
    });

    /* 
     * "Yes" Button Interaction
     */
    yesBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        // Change Text
        mainText.innerHTML = "Darren ❤️ Paulyn";

        // Trigger massive explosion at button center
        const rect = yesBtn.getBoundingClientRect();
        createExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);

        // Intensify Rain with Roses
        clearInterval(rainInterval);
        rainInterval = setInterval(() => createHeart('mix'), 100); // Faster rain

        // Hide Buttons? Or keep them? User didn't specify, but usually you hide "No".
        noBtn.style.display = 'none';

        // Move container up slightly to make room
        const container = document.querySelector('.container');
        if (container) container.classList.add('shifted');

        // SHOW FILM ROLL
        const filmRoll = document.getElementById('film-roll-container');
        if (filmRoll) {
            filmRoll.classList.add('active');
        }

        // PLAY MUSIC
        const audio = document.getElementById('bg-music');
        if (audio) {
            audio.volume = 0.5; // Start at 50%
            audio.play().catch(error => {
                console.log("Audio play failed (browser policy):", error);
            });
        }

        // Optional: Celebrate with multiple explosions
        let celebrationInterval = setInterval(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            createExplosion(x, y);
        }, 300);

        // Stop random explosions after 3 seconds
        setTimeout(() => clearInterval(celebrationInterval), 3000);
    });
});
