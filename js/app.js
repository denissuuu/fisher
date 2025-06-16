

document.addEventListener('DOMContentLoaded', () => {
    console.log('Fisher application initialized');
    
    const isGamePage = document.querySelector('.game-page') !== null;
    
    if (isGamePage) {
        console.log('Game page loaded - initializing game components');
    } else {
        console.log('Home page loaded');
    }
});