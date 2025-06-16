// Game data and constants
export const FISH_TYPES = {
    common: [
        { name: "Sardine", icon: "🐟", value: 1, chance: 40 },
        { name: "Anchovy", icon: "🐠", value: 2, chance: 35 },
        { name: "Herring", icon: "🐟", value: 2, chance: 30 },
        { name: "Mackerel", icon: "🐠", value: 3, chance: 25 }
    ],
    uncommon: [
        { name: "Salmon", icon: "🐡", value: 5, chance: 10 },
        { name: "Trout", icon: "🎣", value: 6, chance: 6 },
        { name: "Bass", icon: "🐟", value: 7, chance: 8 },
        { name: "Catfish", icon: "🐠", value: 8, chance: 5 }
    ],
    rare: [
        { name: "Tuna", icon: "🐬", value: 12, chance: 3 },
        { name: "Swordfish", icon: "🦈", value: 15, chance: 2 },
        { name: "Marlin", icon: "🐟", value: 18, chance: 2 },
        { name: "Shark", icon: "🦈", value: 20, chance: 1 }
    ],
    epic: [
        { name: "Gold Fish", icon: "✨", value: 22, chance: 0.8 },
        { name: "Starfish", icon: "⭐", value: 30, chance: 0.5 },
        { name: "Rainbow Trout", icon: "🌈", value: 35, chance: 0.4 },
        { name: "Crystal Fish", icon: "💎", value: 40, chance: 0.3 }
    ],
    legendary: [
        { name: "Royal Jellyfish", icon: "👑", value: 75, chance: 0.2 },
        { name: "Sea Dragon", icon: "🐉", value: 125, chance: 0.05 },
        { name: "Ancient Kraken", icon: "🐙", value: 200, chance: 0.02 },
        { name: "Mythic Leviathan", icon: "🌊", value: 500, chance: 0.01 }
    ]
};

export const SHOP_ITEMS = {
    rods: [
        { 
            id: "basic-rod", 
            name: "Basic Rod", 
            price: 0, 
            catchRateBonus: 0,
            owned: true,
            type: "rod"
        },
        { 
            id: "good-rod", 
            name: "Good Rod", 
            price: 50, 
            catchRateBonus: 5,
            owned: false,
            type: "rod"
        },
        { 
            id: "super-rod", 
            name: "Super Rod", 
            price: 150, 
            catchRateBonus: 10,
            owned: false,
            type: "rod"
        },
        { 
            id: "ultra-rod", 
            name: "Ultra Rod", 
            price: 500, 
            catchRateBonus: 20,
            owned: false,
            type: "rod"
        },
        { 
            id: "master-rod", 
            name: "Master Rod", 
            price: 1000, 
            catchRateBonus: 30,
            owned: false,
            type: "rod"
        },
        { 
            id: "legendary-rod", 
            name: "Legendary Rod", 
            price: 2500, 
            catchRateBonus: 50,
            owned: false,
            type: "rod"
        },
        { 
            id: "mythic-rod", 
            name: "Mythic Rod", 
            price: 5000, 
            catchRateBonus: 75,
            owned: false,
            type: "rod"
        }
    ],
    baits: [
        {
            id: "basic-bait",
            name: "Basic Bait",
            price: 10,
            catchRateBonus: 2,
            owned: false,
            type: "bait",
            duration: 10
        },
        {
            id: "premium-bait",
            name: "Premium Bait",
            price: 50,
            catchRateBonus: 5,
            owned: false,
            type: "bait",
            duration: 15
        },
        {
            id: "magical-bait",
            name: "Magical Bait",
            price: 200,
            catchRateBonus: 10,
            owned: false,
            type: "bait",
            duration: 20
        }
    ],
    upgrades: [
        {
            id: "fishing-net",
            name: "Fishing Net",
            price: 100,
            effect: "doubleFish",
            description: "Chance to catch 2 fish at once",
            owned: false,
            type: "upgrade"
        },
        {
            id: "lucky-charm",
            name: "Lucky Charm",
            price: 300,
            effect: "betterRarity",
            description: "Increased chance for rare fish",
            owned: false,
            type: "upgrade"
        },
        {
            id: "golden-touch",
            name: "Golden Touch",
            price: 1000,
            effect: "moreValue",
            description: "Fish sell for 50% more",
            owned: false,
            type: "upgrade"
        }
    ]
};

export const RARITY_CLASS = {
    common: "common",
    uncommon: "uncommon",
    rare: "rare",
    epic: "epic",
    legendary: "legendary"
}; 