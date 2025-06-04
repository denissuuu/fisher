// Main application initialization

document.addEventListener('DOMContentLoaded', () => {
    console.log('Fisher application initialized');
    
    // Check which page we're on
    const isGamePage = document.querySelector('.game-page') !== null;
    
    if (isGamePage) {
        console.log('Game page loaded - initializing game components');
        // We'll initialize the game logic here or call functions from game.js
    } else {
        console.log('Home page loaded');
    }
});