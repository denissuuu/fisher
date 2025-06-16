const FISH_TYPES = {
    common: [
        { name: "Sardine", icon: "🐟", value: 1, chance: 40 },
        { name: "Anchovy", icon: "🐠", value: 2, chance: 35 }
    ],
    uncommon: [
        { name: "Salmon", icon: "🐡", value: 5, chance: 10 },
        { name: "Trout", icon: "🎣", value: 6, chance: 6 }
    ],
    rare: [
        { name: "Tuna", icon: "🐬", value: 12, chance: 3 },
        { name: "Swordfish", icon: "🦈", value: 15, chance: 2 }
    ],
    epic: [
        { name: "Gold Fish", icon: "✨", value: 22, chance: 0.8 },
        { name: "Starfish", icon: "⭐", value: 30, chance: 0.5 }
    ],
    legendary: [
        { name: "Royal Jellyfish", icon: "👑", value: 75, chance: 0.2 },
        { name: "Sea Dragon", icon: "🐉", value: 125, chance: 0.05 }
    ]
};

const FISHING_RODS = [
    { 
        id: "basic-rod", 
        name: "Basic Rod", 
        price: 0, 
        catchRateBonus: 0,
        owned: true
    },
    { 
        id: "good-rod", 
        name: "Good Rod", 
        price: 50, 
        catchRateBonus: 5,
        owned: false
    },
    { 
        id: "super-rod", 
        name: "Super Rod", 
        price: 150, 
        catchRateBonus: 10,
        owned: false
    },
    { 
        id: "ultra-rod", 
        name: "Ultra Rod", 
        price: 500, 
        catchRateBonus: 20,
        owned: false
    },
    { 
        id: "master-rod", 
        name: "Master Rod", 
        price: 1000, 
        catchRateBonus: 30,
        owned: false
    },
    { 
        id: "legendary-rod", 
        name: "Legendary Rod", 
        price: 2500, 
        catchRateBonus: 50,
        owned: false
    },
    { 
        id: "mythic-rod", 
        name: "Mythic Rod", 
        price: 5000, 
        catchRateBonus: 75,
        owned: false
    }
];


const RARITY_CLASS = {
    common: "common",
    uncommon: "uncommon",
    rare: "rare",
    epic: "epic",
    legendary: "legendary"
};


const gameState = {
    inventory: [],
    money: 0,
    equippedRod: FISHING_RODS[0], 
    isFishing: false
};

// Fonction pour sauvegarder l'état du jeu
function saveGame() {
    const saveData = {
        money: gameState.money,
        inventory: gameState.inventory,
        equippedRodId: gameState.equippedRod.id,
        ownedRods: FISHING_RODS.map(rod => ({
            id: rod.id,
            owned: rod.owned
        }))
    };
    localStorage.setItem('fisherGameSave', JSON.stringify(saveData));
}

// Fonction pour charger l'état du jeu
function loadGame() {
    const savedData = localStorage.getItem('fisherGameSave');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        // Restaurer l'argent
        gameState.money = data.money;
        
        // Restaurer l'inventaire
        gameState.inventory = data.inventory;
        
        // Restaurer les cannes possédées
        data.ownedRods.forEach(savedRod => {
            const rodIndex = FISHING_RODS.findIndex(r => r.id === savedRod.id);
            if (rodIndex !== -1) {
                FISHING_RODS[rodIndex].owned = savedRod.owned;
            }
        });
        
        // Restaurer la canne équipée
        const equippedRod = FISHING_RODS.find(r => r.id === data.equippedRodId);
        if (equippedRod) {
            gameState.equippedRod = equippedRod;
        }
        
        // Mettre à jour l'interface
        updateStats();
        updateInventoryDisplay();
        initializeShop();
        displayMessage("Game loaded!");
    }
}

// Sauvegarder automatiquement après chaque action importante
function autoSave() {
    saveGame();
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.game-page')) {
        initGame();
        loadGame(); // Charger la partie au démarrage
    }
});


function initGame() {
    const fishButton = document.getElementById('fish-button');
    const sellButton = document.getElementById('sell-button');
    const shopBtn = document.getElementById('shop-button');
    const closeShopBtn = document.getElementById('close-shop');
    const backBtn = document.getElementById('back-to-home');
    
    fishButton.addEventListener('click', startFishing);
    
    // Make sure this line is correctly binding the event handler
    sellButton.addEventListener('click', function() {
        sellAllFish();  // Explicitly call the function
    });
    
    shopBtn.addEventListener('click', openShop);
    closeShopBtn.addEventListener('click', closeShop);
    backBtn.addEventListener('click', () => { window.location.href = 'index.html'; });
    
    initializeShop();
    updateStats();
    displayMessage("Ready to start fishing!");
}


function initializeShop() {
    const rodShop = document.getElementById('rod-shop');
    rodShop.innerHTML = '';
    
    FISHING_RODS.forEach(rod => {
        const rodElement = document.createElement('div');
        rodElement.className = `shop-item ${rod.owned ? 'owned' : ''}`;
        
        rodElement.innerHTML = `
            <div class="item-name">${rod.name}</div>
            <div class="item-stats">Catch Rate: +${rod.catchRateBonus}%</div>
            <div class="item-price">$${rod.price}</div>
            ${!rod.owned ? `<button class="buy-button" ${gameState.money < rod.price ? 'disabled' : ''}>Buy</button>` : 
                          `<button class="buy-button equip-button">Equip</button>`}
        `;
        
        const buyButton = rodElement.querySelector('.buy-button');
        if (buyButton) {
            if (rod.owned) {
                buyButton.addEventListener('click', () => {
                    equipRod(rod);
                    displayMessage(`Equipped ${rod.name}!`);
                });
            } else {
                buyButton.addEventListener('click', () => {
                    if (gameState.money >= rod.price) {
                        buyRod(rod);
                        displayMessage(`Bought ${rod.name} for $${rod.price}!`);
                    }
                });
            }
        }
        
        rodShop.appendChild(rodElement);
    });
}


function buyRod(rod) {
    if (gameState.money < rod.price) return;
    
    gameState.money -= rod.price;
    rod.owned = true;
    
    const rodIndex = FISHING_RODS.findIndex(r => r.id === rod.id);
    FISHING_RODS[rodIndex] = rod;
    
    equipRod(rod);
    updateStats();
    initializeShop();
    autoSave(); // Sauvegarder après l'achat
}


function equipRod(rod) {
    gameState.equippedRod = rod;
    

    document.getElementById('current-rod').textContent = rod.name;
    

    closeShop();
    

    displayMessage(`Equipped ${rod.name}!`);
    autoSave(); // Sauvegarder après l'équipement
}


function openShop() {
    document.getElementById('shop-modal').classList.remove('hidden');
}


function closeShop() {
    document.getElementById('shop-modal').classList.add('hidden');
}


function startFishing() {
    if (gameState.isFishing) return;
    
    const fishButton = document.getElementById('fish-button');

    gameState.isFishing = true;
    fishButton.disabled = true;
    

    displayMessage("Fishing...");
    

    const fishingTime = 1000 + Math.random() * 2000;
    setTimeout(() => {
        catchFish();
    }, fishingTime);
}

// Catch a fish
function catchFish() {
    const fishButton = document.getElementById('fish-button');
    const sellButton = document.getElementById('sell-button');
    
    // Reset game state
    gameState.isFishing = false;
    
    // Get a random fish based on probabilities and equipment bonuses
    const caughtFish = getFishByChance();
    
    // Add to inventory
    gameState.inventory.push(caughtFish);
    
    // Update stats - but money won't change here
    updateStats();
    
    // Display message
    displayMessage(`You caught a ${caughtFish.name} worth $${caughtFish.value}!`);
    
    // Update inventory display
    updateInventoryDisplay();
    
    // Re-enable button
    fishButton.disabled = false;
    sellButton.disabled = false;
    autoSave(); // Sauvegarder après avoir attrapé un poisson
}

// Sell all fish in the inventory
function sellAllFish() {
    console.log("Sell button clicked");  // Debug log
    
    if (gameState.inventory.length === 0) {
        displayMessage("No fish to sell!");
        return;
    }
    
    let totalValue = 0;
    gameState.inventory.forEach(fish => {
        totalValue += fish.value;
    });
    
    // Add money only when selling
    gameState.money += totalValue;
    gameState.inventory = [];
    
    // Update UI
    updateStats();
    updateInventoryDisplay();
    
    // Disable sell button after selling
    document.getElementById('sell-button').disabled = true;
    
    // Show message about sale
    displayMessage(`Sold all fish for $${totalValue}!`);
    autoSave(); // Sauvegarder après la vente
}

// Helper function to get a random fish based on chance and equipment bonuses
function getFishByChance() {
    // Apply catch rate bonus from rod
    const rodBonus = gameState.equippedRod.catchRateBonus;
    
    // Random number between 0 and 100
    const random = Math.random() * 100;
    
    // Flatten the fish types into a single array with their rarities
    const allFish = [];
    
    for (const [rarity, fishes] of Object.entries(FISH_TYPES)) {
        for (const fish of fishes) {
            // Apply bonuses based on rarity
            let adjustedChance = fish.chance;
            
            if (rarity !== 'common') {
                // Increase chance for uncommon+ fish based on rod bonus
                adjustedChance += rodBonus * (rarity === 'legendary' ? 0.2 : 
                                           rarity === 'epic' ? 0.4 : 
                                           rarity === 'rare' ? 0.6 : 
                                           rarity === 'uncommon' ? 0.8 : 0);
            }
            
            allFish.push({...fish, rarity, adjustedChance});
        }
    }
    
    // Sort by adjusted chance (lowest to highest)
    allFish.sort((a, b) => a.adjustedChance - b.adjustedChance);
    
    // Find the fish based on random chance
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
    
    // Fallback to first common fish
    return {
        name: FISH_TYPES.common[0].name,
        icon: FISH_TYPES.common[0].icon,
        value: FISH_TYPES.common[0].value,
        rarity: "common"
    };
}

// Update the stats display
function updateStats() {
    document.getElementById('player-money').textContent = gameState.money;
}

// Display a message
function displayMessage(message) {
    const messageEl = document.getElementById('game-message');
    messageEl.textContent = message;
}

// Update inventory display
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