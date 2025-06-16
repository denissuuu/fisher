// This file manages the user interface elements, including updating the display, showing messages, and handling button clicks.

document.addEventListener('DOMContentLoaded', function() {
    const starsContainer = document.querySelector('.stars');
    if (starsContainer) {
        generateStarryBackground();
    }
    
    // Generate underwater elements if we're on the game page
    if (document.querySelector('.game-page')) {
        generateUnderwaterElements();
    }
    
    const startButton = document.getElementById('startGameButton');
    if (startButton) {
        startButton.addEventListener('click', function() {
            window.location.href = 'game.html';
        });
        
        const starButtons = document.querySelectorAll('.star-button');
        starButtons.forEach(button => {
            button.addEventListener('click', function() {
                makeStarShine(button);
            });
        });
    }
    
    const backButton = document.getElementById('back-to-home');
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
});

function generateUnderwaterElements() {
    const gamePage = document.querySelector('.game-page');
    
    // Generate bubbles
    for (let i = 0; i < 20; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.width = `${5 + Math.random() * 15}px`;
        bubble.style.height = bubble.style.width;
        bubble.style.animationDelay = `${Math.random() * 5}s`;
        gamePage.appendChild(bubble);
    }
    
    // Generate seaweed
    for (let i = 0; i < 10; i++) {
        const seaweed = document.createElement('div');
        seaweed.classList.add('seaweed');
        seaweed.style.left = `${Math.random() * 100}%`;
        seaweed.style.height = `${100 + Math.random() * 150}px`;
        seaweed.style.animationDelay = `${Math.random() * 2}s`;
        gamePage.appendChild(seaweed);
    }
    
    // Generate light rays
    for (let i = 0; i < 5; i++) {
        const ray = document.createElement('div');
        ray.classList.add('light-ray');
        ray.style.left = `${Math.random() * 100}%`;
        ray.style.animationDelay = `${Math.random() * 4}s`;
        gamePage.appendChild(ray);
    }
}

function generateStarryBackground() {
    const starsContainer = document.querySelector('.stars');
    
    
    createStars(300, 'tiny');
    createStars(200, 'small');
    createStars(100, 'medium');
    createStars(50, 'large');
    createStars(20, 'extra-large');
    
   
    createShootingStars(5);
    
   
    function createStars(count, sizeClass) {
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.classList.add('star', sizeClass);
            
           
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            
            
            const delay = Math.random() * 5;
            const duration = 3 + Math.random() * 4;
            star.style.animationDelay = `${delay}s`;
            star.style.animationDuration = `${duration}s`;
            
            starsContainer.appendChild(star);
        }
    }
    
    
    function createShootingStars(count) {
        for (let i = 0; i < count; i++) {
            const shootingStar = document.createElement('div');
            shootingStar.classList.add('shooting-star');
            
           
            const startX = Math.random() * 80;
            const startY = Math.random() * 40;
            const angle = 15 + Math.random() * 30;
            
            shootingStar.style.left = `${startX}%`;
            shootingStar.style.top = `${startY}%`;
            shootingStar.style.width = `${100 + Math.random() * 150}px`;
            shootingStar.style.transform = `rotate(${angle}deg)`;
            
            
            const delay = Math.random() * 15;
            shootingStar.style.animationDelay = `${delay}s`;
            
            starsContainer.appendChild(shootingStar);
        }
    }
}


function makeStarShine(starButton) {

    if (starButton.classList.contains('shining')) return;
    

    starButton.classList.add('shining');
    

    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    starButton.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
        starButton.classList.remove('shining');
    }, 700);
}