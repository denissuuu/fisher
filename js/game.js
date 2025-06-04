// Game mechanics and logic

// Fish types with rarities and values (in dollars)
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

// Fishing rods available in the shop
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
    }
];

// Rarity colors for fish display
const RARITY_CLASS = {
    common: "common",
    uncommon: "uncommon",
    rare: "rare",
    epic: "epic",
    legendary: "legendary"
};

// Game state
const gameState = {
    inventory: [],
    money: 0,
    equippedRod: FISHING_RODS[0], // Basic rod
    isFishing: false
};

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.game-page')) {
        initGame();
    }
});

// Initialize the game
function initGame() {
    // Get DOM elements
    const fishButton = document.getElementById('fish-button');
    const shopBtn = document.getElementById('shop-button');
    const closeShopBtn = document.getElementById('close-shop');
    const backBtn = document.getElementById('back-to-home');
    
    // Add event listeners
    fishButton.addEventListener('click', startFishing);
    shopBtn.addEventListener('click', openShop);
    closeShopBtn.addEventListener('click', closeShop);
    backBtn.addEventListener('click', () => { window.location.href = 'index.html'; });
    
    // Initialize shop
    initializeShop();
    
    // Update the UI
    updateStats();
    
    // Display welcome message
    displayMessage("Ready to start fishing!");
}

// Initialize the shop with items
function initializeShop() {
    const rodShop = document.getElementById('rod-shop');
    rodShop.innerHTML = '';
    
    // Add fishing rods to shop
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
        
        // Add event listener
        const buyButton = rodElement.querySelector('.buy-button');
        if (buyButton) {
            if (rod.owned) {
                // Equip rod if owned
                buyButton.addEventListener('click', () => equipRod(rod));
            } else {
                // Buy rod if not owned
                buyButton.addEventListener('click', () => buyRod(rod));
            }
        }
        
        rodShop.appendChild(rodElement);
    });
}

// Buy a rod from the shop
function buyRod(rod) {
    if (gameState.money < rod.price) return;
    
    // Deduct money
    gameState.money -= rod.price;
    
    // Mark as owned
    rod.owned = true;
    
    // Update the rod in the array
    const rodIndex = FISHING_RODS.findIndex(r => r.id === rod.id);
    FISHING_RODS[rodIndex] = rod;
    
    // Equip the new rod
    equipRod(rod);
    
    // Update UI
    updateStats();
    initializeShop();
}

// Equip a rod
function equipRod(rod) {
    gameState.equippedRod = rod;
    
    // Update the current rod display
    document.getElementById('current-rod').textContent = rod.name;
    
    // Close shop after equipping
    closeShop();
    
    // Update message
    displayMessage(`Equipped ${rod.name}!`);
}

// Open shop modal
function openShop() {
    document.getElementById('shop-modal').classList.remove('hidden');
}

// Close shop modal
function closeShop() {
    document.getElementById('shop-modal').classList.add('hidden');
}

// Start fishing
function startFishing() {
    if (gameState.isFishing) return;
    
    const fishButton = document.getElementById('fish-button');
    
    // Update game state
    gameState.isFishing = true;
    fishButton.disabled = true;
    
    // Display message
    displayMessage("Fishing...");
    
    // Wait for a fish (random time between 1-3 seconds)
    const fishingTime = 1000 + Math.random() * 2000;
    setTimeout(() => {
        catchFish();
    }, fishingTime);
}

// Catch a fish
function catchFish() {
    const fishButton = document.getElementById('fish-button');
    
    // Reset game state
    gameState.isFishing = false;
    
    // Get a random fish based on probabilities and equipment bonuses
    const caughtFish = getFishByChance();
    
    // Add to inventory
    gameState.inventory.push(caughtFish);
    gameState.money += caughtFish.value;
    
    // Update stats
    updateStats();
    
    // Display message
    displayMessage(`You caught a ${caughtFish.name} worth $${caughtFish.value}!`);
    
    // Update inventory display
    updateInventoryDisplay();
    
    // Re-enable button
    fishButton.disabled = false;
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
    
    // Clear "no fish" message if it exists
    const emptyMessage = inventoryEl.querySelector('.empty-inventory');
    if (emptyMessage) {
        inventoryEl.innerHTML = '';
    }
    
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
        
        // Check if this fish type is already displayed
        let fishEl = document.querySelector(`.inventory-item[data-fish="${fish.name}-${fish.rarity}"]`);
        
        if (!fishEl) {
            // Create new element if not already displayed
            fishEl = document.createElement('div');
            fishEl.className = `inventory-item ${RARITY_CLASS[fish.rarity]}`;
            fishEl.setAttribute('data-fish', `${fish.name}-${fish.rarity}`);
            
            fishEl.innerHTML = `
                ${fish.icon} ${fish.name}: <span class="fish-count">${count}x</span> ($${fish.value} each)
            `;
            
            inventoryEl.appendChild(fishEl);
        } else {
            // Update the count if already displayed
            fishEl.querySelector('.fish-count').textContent = `${count}x`;
        }
    });
}