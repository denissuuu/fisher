import { RARITY_CLASS } from '../../data/gameData.js';
import { gameState } from '../core/gameState.js';
import { startFishing } from '../game/fishing.js';

export function initializeUI() {
    const fishButton = document.getElementById('fish-button');
    const sellButton = document.getElementById('sell-button');
    const shopBtn = document.getElementById('shop-button');
    const closeShopBtn = document.getElementById('close-shop');
    const backBtn = document.getElementById('back-to-home');
    
    fishButton.addEventListener('click', handleFishing);
    sellButton.addEventListener('click', handleSell);
    shopBtn.addEventListener('click', openShop);
    closeShopBtn.addEventListener('click', closeShop);
    backBtn.addEventListener('click', () => { window.location.href = 'index.html'; });
    
    updateStats();
    displayMessage("Ready to start fishing!");
}

async function handleFishing() {
    if (gameState.isFishing) return;
    
    const fishButton = document.getElementById('fish-button');
    fishButton.disabled = true;
    displayMessage("Fishing...");
    
    const caughtFish = await startFishing();
    displayMessage(`You caught a ${caughtFish.name} worth $${caughtFish.value}!`);
    
    fishButton.disabled = false;
    document.getElementById('sell-button').disabled = false;
    updateInventoryDisplay();
}

function handleSell() {
    if (gameState.inventory.length === 0) {
        displayMessage("No fish to sell!");
        return;
    }
    
    let totalValue = 0;
    gameState.inventory.forEach(fish => {
        let fishValue = fish.value;
        // Appliquer l'effet Golden Touch
        if (gameState.activeUpgrades.includes('golden-touch')) {
            fishValue = Math.floor(fishValue * 1.5);
        }
        totalValue += fishValue;
    });
    
    gameState.addMoney(totalValue);
    gameState.clearInventory();
    
    updateStats();
    updateInventoryDisplay();
    document.getElementById('sell-button').disabled = true;
    displayMessage(`Sold all fish for $${totalValue}!`);
}

function updateStats() {
    document.getElementById('player-money').textContent = gameState.money;
}

function displayMessage(message) {
    const messageEl = document.getElementById('game-message');
    messageEl.textContent = message;
}

function updateInventoryDisplay() {
    const inventoryEl = document.getElementById('inventory');
    
    if (gameState.inventory.length === 0) {
        inventoryEl.innerHTML = '<p class="empty-inventory">No fish caught yet.</p>';
        return;
    }
    
    inventoryEl.innerHTML = '';
    
    // Group fish by type and count
    const fishCounts = {};
    gameState.inventory.forEach(fish => {
        const key = `${fish.name}-${fish.rarity}`;
        fishCounts[key] = fishCounts[key] || { fish: fish, count: 0 };
        fishCounts[key].count++;
    });
    
    // Create elements for each fish type
    Object.values(fishCounts).forEach(item => {
        const fish = item.fish;
        const count = item.count;
        
        const fishEl = document.createElement('div');
        fishEl.className = `inventory-item ${RARITY_CLASS[fish.rarity]}`;
        fishEl.setAttribute('data-fish', `${fish.name}-${fish.rarity}`);
        
        fishEl.innerHTML = `
            ${fish.icon} ${fish.name}: <span class="fish-count">${count}x</span> ($${fish.value} each)
        `;
        
        inventoryEl.appendChild(fishEl);
    });
}

function openShop() {
    document.getElementById('shop-modal').classList.remove('hidden');
}

function closeShop() {
    document.getElementById('shop-modal').classList.add('hidden');
} 