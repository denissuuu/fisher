import { SHOP_ITEMS } from '../../data/gameData.js';
import { gameState } from '../core/gameState.js';

export function initializeShop() {
    const shopItems = document.getElementById('shop-items');
    const categoryButtons = document.querySelectorAll('.category-button');
    
    // Gérer les clics sur les boutons de catégorie
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Retirer la classe active de tous les boutons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            button.classList.add('active');
            
            // Animation de transition
            shopItems.classList.remove('visible');
            setTimeout(() => {
                displayShopItems(button.dataset.category);
                shopItems.classList.add('visible');
            }, 300);
        });
    });
    
    // Afficher les cannes à pêche par défaut
    displayShopItems('rods');
    shopItems.classList.add('visible');
}

function displayShopItems(category) {
    const shopItems = document.getElementById('shop-items');
    shopItems.innerHTML = '';
    
    SHOP_ITEMS[category].forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = `shop-item ${item.owned ? 'owned' : ''}`;
        itemElement.style.setProperty('--item-index', index);
        
        let buttonText = item.owned ? 'Equip' : 'Buy';
        if (item.type === 'upgrade' && item.owned) {
            buttonText = 'Active';
        }
        
        // Ajouter des icônes pour les statistiques
        const statsIcon = item.catchRateBonus ? 'fa-percentage' : 
                         item.duration ? 'fa-clock' : '';
        
        itemElement.innerHTML = `
            <div class="item-name">
                <i class="fas ${getItemIcon(item.type)}"></i>
                ${item.name}
            </div>
            ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
            ${item.catchRateBonus ? `
                <div class="item-stats">
                    <i class="fas ${statsIcon}"></i>
                    Catch Rate: +${item.catchRateBonus}%
                </div>
            ` : ''}
            ${item.duration ? `
                <div class="item-stats">
                    <i class="fas ${statsIcon}"></i>
                    Uses: ${item.duration}
                </div>
            ` : ''}
            <div class="item-price">
                <i class="fas fa-coins"></i>
                $${item.price}
            </div>
            ${!item.owned ? 
                `<button class="buy-button" ${gameState.money < item.price ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i> Buy
                </button>` : 
                `<button class="buy-button ${item.type === 'upgrade' ? 'active' : 'equip-button'}">
                    <i class="fas ${item.type === 'upgrade' ? 'fa-check' : 'fa-fish'}"></i>
                    ${buttonText}
                </button>`
            }
        `;
        
        const buyButton = itemElement.querySelector('.buy-button');
        if (buyButton) {
            if (item.owned) {
                buyButton.addEventListener('click', () => {
                    if (item.type === 'rod') {
                        equipRod(item);
                        animateButton(buyButton, 'Equipped!');
                    } else if (item.type === 'bait') {
                        equipBait(item);
                        animateButton(buyButton, 'Equipped!');
                    }
                });
            } else {
                buyButton.addEventListener('click', () => {
                    if (gameState.money >= item.price) {
                        if (buyItem(item)) {
                            animateButton(buyButton, 'Purchased!');
                        }
                    }
                });
            }
        }
        
        shopItems.appendChild(itemElement);
        
        // Ajouter l'animation d'apparition
        setTimeout(() => {
            itemElement.classList.add('visible');
        }, 50 * index);
    });
}

function getItemIcon(type) {
    switch(type) {
        case 'rod': return 'fa-fish';
        case 'bait': return 'fa-worm';
        case 'upgrade': return 'fa-star';
        default: return 'fa-box';
    }
}

function animateButton(button, text) {
    const originalText = button.innerHTML;
    button.innerHTML = `<i class="fas fa-check"></i> ${text}`;
    button.classList.add('success');
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.classList.remove('success');
    }, 1500);
}

function buyItem(item) {
    if (gameState.removeMoney(item.price)) {
        // Trouver et mettre à jour l'objet dans SHOP_ITEMS
        const category = Object.keys(SHOP_ITEMS).find(cat => 
            SHOP_ITEMS[cat].some(i => i.id === item.id)
        );
        
        if (category) {
            const itemIndex = SHOP_ITEMS[category].findIndex(i => i.id === item.id);
            if (itemIndex !== -1) {
                SHOP_ITEMS[category][itemIndex].owned = true;
                
                if (item.type === 'rod') {
                    equipRod(SHOP_ITEMS[category][itemIndex]);
                } else if (item.type === 'bait') {
                    equipBait(SHOP_ITEMS[category][itemIndex]);
                } else if (item.type === 'upgrade') {
                    activateUpgrade(SHOP_ITEMS[category][itemIndex]);
                }
                
                // Rafraîchir l'affichage du shop
                displayShopItems(category);
                return true;
            }
        }
    }
    return false;
}

function equipRod(rod) {
    gameState.equipRod(rod);
    document.getElementById('current-rod').textContent = rod.name;
}

function equipBait(bait) {
    gameState.equipBait(bait);
}

function activateUpgrade(upgrade) {
    gameState.activateUpgrade(upgrade);
} 