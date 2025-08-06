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

    updateBadge() {
        const badge = document.getElementById('cart-badge');
        if (badge) {
            const total = this.items.reduce((sum, item) => sum + item.quantity, 0);
            badge.textContent = total;
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
                <div style="text-align: center; padding: 40px;">
                    <h3>Корзина пуста</h3>
                    <p style="color: #94A3B8; margin: 16px 0;">Добавьте товары из каталога</p>
                    <button class="btn-add" onclick="window.app.showScreen('home')">Перейти к покупкам</button>
                </div>
            `;
            return;
        }

        cartScreen.innerHTML = `
            <h3>Корзина (${this.items.length})</h3>
            <div class="cart-items">
                ${this.items.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.title}">
                        <div class="cart-item-info">
                            <h4>${item.title}</h4>
                            <p>${item.price} ₽ × ${item.quantity}</p>
                        </div>
                        <button onclick="window.cart.removeItem('${item.id}')" style="background: #EF4444; border: none; color: white; padding: 8px; border-radius: 4px; cursor: pointer;">×</button>
                    </div>
                `).join('')}
            </div>
            <div class="cart-total">
                Итого: ${this.calculateTotal()} ₽
            </div>
            <button class="btn-add" onclick="window.app.showScreen('checkout')" style="margin-top: 16px;">
                Оформить заказ
            </button>
        `;
    }
}