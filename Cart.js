class Cart {
    constructor() {
        this.items = [];
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.render();
    }

    loadFromStorage() {
        const cart = localStorage.getItem('cart');
        this.items = cart ? JSON.parse(cart) : [];
    }

    saveToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateBadge();
    }

    updateBadge() {
        const badge = document.getElementById('cart-badge');
        if (badge) {
            const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                article: product.article,
                manufacturer: product.manufacturer,
                quantity: quantity
            });
        }

        this.saveToStorage();
        this.render();
        this.showAddToCartAnimation(product.id);
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
        this.render();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveToStorage();
            this.render();
        }
    }

    calculateTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    showAddToCartAnimation(productId) {
        const productElement = document.querySelector(`[data-product-id="${productId}"]`);
        const cartButton = document.getElementById('cart-btn');
        
        if (productElement && cartButton) {
            const productRect = productElement.getBoundingClientRect();
            const cartRect = cartButton.getBoundingClientRect();
            
            const particle = document.createElement('div');
            particle.className = 'cart-particle';
            
            const startX = productRect.left + productRect.width / 2;
            const startY = productRect.top + productRect.height / 2;
            const endX = cartRect.left + cartRect.width / 2;
            const endY = cartRect.top + cartRect.height / 2;
            
            particle.style.cssText = `
                position: fixed;
                width: 20px;
                height: 20px;
                background: var(--primary);
                border-radius: 50%;
                z-index: 1000;
                pointer-events: none;
                left: ${startX}px;
                top: ${startY}px;
                transform: translate(-50%, -50%);
                transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            `;
            
            document.body.appendChild(particle);
            
            requestAnimationFrame(() => {
                particle.style.cssText += `
                    left: ${endX}px;
                    top: ${endY}px;
                    transform: translate(-50%, -50%) scale(0.2);
                    opacity: 0;
                `;
            });
            
            setTimeout(() => {
                particle.remove();
                cartButton.classList.add('cart-bump');
                setTimeout(() => cartButton.classList.remove('cart-bump'), 300);
            }, 600);
        }
    }

    render() {
        const cartScreen = document.getElementById('cart-screen');
        if (!cartScreen) return;

        if (this.items.length === 0) {
            cartScreen.innerHTML = `
                <div class="empty-state">
                    <svg class="empty-icon" viewBox="0 0 24 24">
                        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0020 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                    <h2>Корзина пуста</h2>
                    <p>Добавьте товары из каталога</p>
                    <button class="btn-primary" onclick="window.app.showScreen('home')">
                        Перейти к покупкам
                    </button>
                </div>
            `;
            return;
        }

        cartScreen.innerHTML = `
            <div class="cart-content">
                <div class="cart-items">
                    ${this.items.map(item => `
                        <div class="cart-item" data-product-id="${item.id}">
                            <div class="cart-item-image">
                                <img src="${item.image}" alt="${item.title}">
                            </div>
                            <div class="cart-item-content">
                                <div class="cart-item-header">
                                    <h3>${item.title}</h3>
                                    <button class="btn-icon" onclick="window.cart.removeItem('${item.id}')">
                                        <svg viewBox="0 0 24 24">
                                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                        </svg>
                                    </button>
                                </div>
                                <div class="cart-item-details">
                                    <div class="item-meta">
                                        <span class="item-article">Артикул: ${item.article}</span>
                                        <span class="item-manufacturer">Производитель: ${item.manufacturer}</span>
                                    </div>
                                    <div class="item-controls">
                                        <div class="quantity-controls">
                                            <button class="btn-quantity" onclick="window.cart.updateQuantity('${item.id}', ${item.quantity - 1})">−</button>
                                            <span class="quantity">${item.quantity}</span>
                                            <button class="btn-quantity" onclick="window.cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                                        </div>
                                        <div class="item-price">
                                            <span class="price">${item.price * item.quantity} ₽</span>
                                            ${item.quantity > 1 ? `<span class="price-per-item">${item.price} ₽/шт</span>` : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="cart-summary">
                    <div class="summary-content">
                        <div class="summary-row">
                            <span>Товаров в корзине:</span>
                            <span>${this.items.reduce((sum, item) => sum + item.quantity, 0)} шт</span>
                        </div>
                        <div class="summary-row total">
                            <span>Итого:</span>
                            <span class="total-price">${this.calculateTotal()} ₽</span>
                        </div>
                        <button class="btn-primary btn-lg" onclick="window.app.showScreen('checkout')">
                            Оформить заказ
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

// Создаем глобальный экземпляр корзины
window.cart = new Cart();