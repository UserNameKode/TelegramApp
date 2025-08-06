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
            const clone = productElement.querySelector('.product-image').cloneNode();
            clone.classList.add('flying-image');
            
            const start = productElement.getBoundingClientRect();
            const end = cartButton.getBoundingClientRect();
            
            clone.style.cssText = `
                position: fixed;
                z-index: 1000;
                top: ${start.top}px;
                left: ${start.left}px;
                width: ${start.width}px;
                height: ${start.height}px;
                transition: all 0.8s cubic-bezier(0.2, 1, 0.3, 1);
            `;
            
            document.body.appendChild(clone);
            
            setTimeout(() => {
                clone.style.cssText += `
                    top: ${end.top}px;
                    left: ${end.left}px;
                    width: 30px;
                    height: 30px;
                    opacity: 0.5;
                    transform: scale(0.3);
                `;
            }, 50);
            
            setTimeout(() => {
                clone.remove();
                cartButton.classList.add('cart-bump');
                setTimeout(() => cartButton.classList.remove('cart-bump'), 300);
            }, 800);
        }
    }

    render() {
        const cartContainer = document.querySelector('.cart-items');
        if (!cartContainer) return;

        if (this.items.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <h3>Корзина пуста</h3>
                    <p>Добавьте товары из каталога</p>
                    <button class="btn btn-primary" onclick="window.app.showScreen('home')">
                        Перейти к покупкам
                    </button>
                </div>
            `;
            return;
        }

        cartContainer.innerHTML = `
            <div class="cart-list">
                ${this.items.map(item => `
                    <div class="cart-item" data-product-id="${item.id}">
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.title}">
                        </div>
                        <div class="cart-item-content">
                            <div class="cart-item-header">
                                <h3 class="cart-item-title">${item.title}</h3>
                                <button class="btn-icon remove-item" onclick="window.cart.removeItem('${item.id}')">
                                    <span class="icon">×</span>
                                </button>
                            </div>
                            <div class="cart-item-article">Артикул: ${item.article}</div>
                            <div class="cart-item-footer">
                                <div class="quantity-controls">
                                    <button class="btn-quantity" onclick="window.cart.updateQuantity('${item.id}', ${item.quantity - 1})">−</button>
                                    <span class="quantity">${item.quantity}</span>
                                    <button class="btn-quantity" onclick="window.cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                                </div>
                                <div class="cart-item-price">
                                    <span class="price">${item.price * item.quantity} ₽</span>
                                    ${item.quantity > 1 ? `<span class="price-per-item">${item.price} ₽ за шт.</span>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="cart-summary">
                <div class="cart-total">
                    <span>Итого:</span>
                    <span class="total-price">${this.calculateTotal()} ₽</span>
                </div>
                <button class="btn btn-primary btn-lg checkout-btn" onclick="window.app.showScreen('checkout')">
                    Оформить заказ
                </button>
            </div>
        `;
    }
}

// Создаем глобальный экземпляр корзины
window.cart = new Cart();