// This file manages the user interface elements, including updating the display, showing messages, and handling button clicks.

document.addEventListener('DOMContentLoaded', function() {
    // Generate stars on any page that has the stars container
    const starsContainer = document.querySelector('.stars');
    if (starsContainer) {
        generateStarryBackground();
    }
    
    // Check if we're on the home page by looking for the start button
    const startButton = document.getElementById('startGameButton');
    if (startButton) {
        startButton.addEventListener('click', function() {
            // Redirect to the game page
            window.location.href = 'game.html';
        });
        
        // Add click effect to star buttons
        const starButtons = document.querySelectorAll('.star-button');
        starButtons.forEach(button => {
            button.addEventListener('click', function() {
                makeStarShine(button);
            });
        });
    }
    
    // Check if we're on the game page by looking for the back button
    const backButton = document.getElementById('back-to-home');
    if (backButton) {
        backButton.addEventListener('click', function() {
            // Redirect back to the home page
            window.location.href = 'index.html';
        });
    }
});

// Function to generate an immersive starry background with lots of stars
function generateStarryBackground() {
    const starsContainer = document.querySelector('.stars');
    
    // Create many stars of different sizes
    createStars(300, 'tiny');
    createStars(200, 'small');
    createStars(100, 'medium');
    createStars(50, 'large');
    createStars(20, 'extra-large');
    
    // Add shooting stars
    createShootingStars(5);
    
    // Function to create stars of a specific size
    function createStars(count, sizeClass) {
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.classList.add('star', sizeClass);
            
            // Random position
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            
            // Random animation delay and duration for twinkling
            const delay = Math.random() * 5;
            const duration = 3 + Math.random() * 4;
            star.style.animationDelay = `${delay}s`;
            star.style.animationDuration = `${duration}s`;
            
            starsContainer.appendChild(star);
        }
    }
    
    // Function to create shooting stars
    function createShootingStars(count) {
        for (let i = 0; i < count; i++) {
            const shootingStar = document.createElement('div');
            shootingStar.classList.add('shooting-star');
            
            // Random position, size, and angle
            const startX = Math.random() * 80;
            const startY = Math.random() * 40;
            const angle = 15 + Math.random() * 30;
            
            shootingStar.style.left = `${startX}%`;
            shootingStar.style.top = `${startY}%`;
            shootingStar.style.width = `${100 + Math.random() * 150}px`;
            shootingStar.style.transform = `rotate(${angle}deg)`;
            
            // Random animation delay
            const delay = Math.random() * 15;
            shootingStar.style.animationDelay = `${delay}s`;
            
            starsContainer.appendChild(shootingStar);
        }
    }
}

// Function to make a star button shine when clicked
function makeStarShine(starButton) {
    // Don't allow multiple clicks at once
    if (starButton.classList.contains('shining')) return;
    
    // Add a temporary class for animation
    starButton.classList.add('shining');
    
    // Make a little sparkle effect
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    starButton.appendChild(sparkle);
    
    // Remove the sparkle effect after animation completes
    setTimeout(() => {
        sparkle.remove();
        starButton.classList.remove('shining');
    }, 700);
}