import { gameState } from './core/gameState.js';
import { initializeUI } from './ui/ui.js';
import { initializeShop } from './game/shop.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le bouton de démarrage sur la page d'accueil
    const startButton = document.getElementById('startGameButton');
    if (startButton) {
        startButton.addEventListener('click', () => {
            window.location.href = 'game.html';
        });
    }

    // Initialiser le jeu si nous sommes sur la page du jeu
    if (document.querySelector('.game-page')) {
        // Charger la partie sauvegardée
        if (gameState.load()) {
            console.log('Game loaded successfully');
        }
        
        // Initialiser l'interface
        initializeUI();
        initializeShop();
    }
}); 