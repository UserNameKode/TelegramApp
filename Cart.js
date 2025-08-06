class Cart {
    constructor() {
        this.items = [];
        this.loadFromStorage();
    }

    loadFromStorage() {
        const stored = localStorage.getItem('cart');
        this.items = stored ? JSON.parse(stored) : [];
        this.updateBadge();
    }

    saveToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateBadge();
    }

    addItem(product) {
        const existing = this.items.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.saveToStorage();
        this.render();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
        this.render();
    }

    updateQuantity(productId, change) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveToStorage();
                this.render();
            }
        }
    }

    updateBadge() {
        const badge = document.getElementById('cart-badge');
        if (badge) {
            const total = this.items.reduce((sum, item) => sum + item.quantity, 0);
            badge.textContent = total;
            badge.style.display = total > 0 ? 'inline' : 'none';
        }
    }

    calculateTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    render() {
        const cartScreen = document.getElementById('cart-screen');
        if (!cartScreen) return;

        if (this.items.length === 0) {
            cartScreen.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-icon">🛒</div>
                    <h3>Корзина пуста</h3>
                    <p>Добавьте товары из каталога для оформления заказа</p>
                    <button class="btn-add" data-screen="home">Перейти к покупкам</button>
                </div>
            `;
            return;
        }

        cartScreen.innerHTML = `
            <div class="cart-header">
                <h3>Корзина</h3>
                <span class="cart-count">${this.items.length} товар${this.items.length > 1 ? 'а' : ''}</span>
            </div>
            
            <div class="cart-items">
                ${this.items.map(item => `
                    <div class="cart-item glass-card">
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMzM0MTU1Ii8+Cjx0ZXh0IHg9IjMwIiB5PSIzNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk0QTNCOCIgZm9udC1zaXplPSIxMCI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo='">
                        </div>
                        <div class="cart-item-info">
                            <h4>${item.title}</h4>
                            <p class="cart-item-article">Артикул: ${item.article || 'Н/Д'}</p>
                            <p class="cart-item-price">${item.price} ₽ за шт.</p>
                        </div>
                        <div class="cart-item-controls">
                            <div class="quantity-controls">
                                <button class="qty-btn minus" onclick="window.cart.updateQuantity('${item.id}', -1)">−</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="qty-btn plus" onclick="window.cart.updateQuantity('${item.id}', 1)">+</button>
                            </div>
                            <p class="cart-item-total">${item.price * item.quantity} ₽</p>
                            <button class="remove-btn" onclick="window.cart.removeItem('${item.id}')" title="Удалить">🗑️</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="cart-summary glass-card">
                <div class="summary-row">
                    <span>Товары (${this.items.reduce((sum, item) => sum + item.quantity, 0)} шт.)</span>
                    <span class="summary-price">${this.calculateTotal()} ₽</span>
                </div>
                <div class="summary-row total">
                    <span>Итого к оплате</span>
                    <span class="summary-price total-price">${this.calculateTotal()} ₽</span>
                </div>
                <button class="btn-checkout" data-screen="checkout">
                    Оформить заказ
                    <span class="checkout-arrow">→</span>
                </button>
            </div>
        `;

        // Добавляем обработчик для кнопки оформления заказа
        document.querySelector('.btn-checkout').addEventListener('click', (e) => {
            window.app.showScreen('checkout');
        });
    }
}