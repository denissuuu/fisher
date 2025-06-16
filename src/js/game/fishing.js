import { FISH_TYPES } from '../../data/gameData.js';
import { gameState } from '../core/gameState.js';

export function startFishing() {
    if (gameState.isFishing) return;
    
    gameState.isFishing = true;
    return new Promise((resolve) => {
        const fishingTime = 1000 + Math.random() * 2000;
        setTimeout(() => {
            const caughtFish = catchFish();
            gameState.isFishing = false;
            resolve(caughtFish);
        }, fishingTime);
    });
}

function catchFish() {
    const caughtFish = getFishByChance();
    
    // Appliquer les effets des upgrades
    if (gameState.activeUpgrades.includes('fishing-net') && Math.random() < 0.3) {
        // 30% de chance d'attraper un deuxième poisson
        const secondFish = getFishByChance();
        gameState.addToInventory(secondFish);
    }
    
    // Appliquer l'effet de l'appât actif
    if (gameState.activeBait) {
        gameState.useBait();
    }
    
    gameState.addToInventory(caughtFish);
    return caughtFish;
}

function getFishByChance() {
    let catchRateBonus = gameState.equippedRod.catchRateBonus;
    
    // Ajouter le bonus de l'appât actif
    if (gameState.activeBait) {
        catchRateBonus += gameState.activeBait.catchRateBonus;
    }
    
    // Ajouter le bonus de Lucky Charm
    if (gameState.activeUpgrades.includes('lucky-charm')) {
        catchRateBonus += 10;
    }
    
    const random = Math.random() * 100;
    const allFish = [];
    
    for (const [rarity, fishes] of Object.entries(FISH_TYPES)) {
        for (const fish of fishes) {
            let adjustedChance = fish.chance;
            
            if (rarity !== 'common') {
                adjustedChance += catchRateBonus * (rarity === 'legendary' ? 0.2 : 
                                               rarity === 'epic' ? 0.4 : 
                                               rarity === 'rare' ? 0.6 : 
                                               rarity === 'uncommon' ? 0.8 : 0);
            }
            
            allFish.push({...fish, rarity, adjustedChance});
        }
    }
    
    allFish.sort((a, b) => a.adjustedChance - b.adjustedChance);
    
    let cumulativeChance = 0;
    for (const fish of allFish) {
        cumulativeChance += fish.adjustedChance;
        if (random <= cumulativeChance) {
            return {
                name: fish.name,
                icon: fish.icon,
                value: fish.value,
                rarity: fish.rarity
            };
        }
    }
    
    return {
        name: FISH_TYPES.common[0].name,
        icon: FISH_TYPES.common[0].icon,
        value: FISH_TYPES.common[0].value,
        rarity: "common"
    };
} 