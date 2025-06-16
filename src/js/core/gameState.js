import { SHOP_ITEMS } from '../../data/gameData.js';

class GameState {
    constructor() {
        this.inventory = [];
        this.money = 0;
        this.equippedRod = SHOP_ITEMS.rods[0];
        this.activeBait = null;
        this.activeUpgrades = [];
        this.isFishing = false;
    }

    save() {
        const saveData = {
            money: this.money,
            inventory: this.inventory,
            equippedRodId: this.equippedRod.id,
            activeBait: this.activeBait,
            activeUpgrades: this.activeUpgrades,
            ownedItems: {
                rods: SHOP_ITEMS.rods.map(rod => ({ id: rod.id, owned: rod.owned })),
                baits: SHOP_ITEMS.baits.map(bait => ({ id: bait.id, owned: bait.owned })),
                upgrades: SHOP_ITEMS.upgrades.map(upgrade => ({ id: upgrade.id, owned: upgrade.owned }))
            }
        };
        localStorage.setItem('fisherGameSave', JSON.stringify(saveData));
    }

    load() {
        const savedData = localStorage.getItem('fisherGameSave');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            this.money = data.money;
            this.inventory = data.inventory;
            this.activeBait = data.activeBait;
            this.activeUpgrades = data.activeUpgrades || [];
            
            // Restaurer les objets possédés
            if (data.ownedItems) {
                Object.entries(data.ownedItems).forEach(([category, items]) => {
                    items.forEach(savedItem => {
                        const itemIndex = SHOP_ITEMS[category].findIndex(i => i.id === savedItem.id);
                        if (itemIndex !== -1) {
                            SHOP_ITEMS[category][itemIndex].owned = savedItem.owned;
                        }
                    });
                });
            }
            
            // Restaurer la canne équipée
            const equippedRod = SHOP_ITEMS.rods.find(r => r.id === data.equippedRodId);
            if (equippedRod) {
                this.equippedRod = equippedRod;
            }
            
            return true;
        }
        return false;
    }

    addMoney(amount) {
        this.money += amount;
        this.save();
    }

    removeMoney(amount) {
        if (this.money >= amount) {
            this.money -= amount;
            this.save();
            return true;
        }
        return false;
    }

    addToInventory(fish) {
        this.inventory.push(fish);
        this.save();
    }

    clearInventory() {
        this.inventory = [];
        this.save();
    }

    equipRod(rod) {
        this.equippedRod = rod;
        this.save();
    }

    equipBait(bait) {
        this.activeBait = bait;
        this.save();
    }

    activateUpgrade(upgrade) {
        if (!this.activeUpgrades.includes(upgrade.id)) {
            this.activeUpgrades.push(upgrade.id);
            this.save();
        }
    }

    useBait() {
        if (this.activeBait) {
            this.activeBait.duration--;
            if (this.activeBait.duration <= 0) {
                this.activeBait = null;
            }
            this.save();
        }
    }
}

export const gameState = new GameState(); 