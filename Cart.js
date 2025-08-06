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
            if (count > 0) badge.classList.add('pulse-effect');
            else badge.classList.remove('pulse-effect');
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
        window.app.showNotification('Товар добавлен в корзину', 'success');
    }

    showAddToCartAnimation(productId) {
        const productElement = document.querySelector(`[data-product-id="${productId}"]`);
        const cartButton = document.getElementById('cart-btn');
        
        if (productElement && cartButton) {
            const productRect = productElement.getBoundingClientRect();
            const cartRect = cartButton.getBoundingClientRect();
            
            const particle = document.createElement('div');
            particle.className = 'flying-particle';
            
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
            `;
            
            document.body.appendChild(particle);
            
            gsap.to(particle, {
                x: endX - startX,
                y: endY - startY,
                duration: 0.8,
                ease: "power3.out",
                onComplete: () => {
                    particle.remove();
                    cartButton.classList.add('cart-bump');
                    setTimeout(() => cartButton.classList.remove('cart-bump'), 300);
                }
            });
        }
    }

    render() {
        const cartScreen = document.getElementById('cart-screen');
        if (!cartScreen) return;

        if (this.items.length === 0) {
            cartScreen.innerHTML = `
                <div class="empty-state glass-morphism">
                    <div class="empty-icon">
                        <i class="ph ph-shopping-cart"></i>
                    </div>
                    <h2>Корзина пуста</h2>
                    <p>Добавьте товары из каталога</p>
                    <button class="gradient-btn" onclick="window.app.showScreen('home')">
                        <i class="ph ph-arrow-left"></i>
                        <span>Перейти к покупкам</span>
                    </button>
                </div>
            `;
            return;
        }

        cartScreen.innerHTML = `
            <div class="cart-content">
                <div class="cart-items">
                    ${this.items.map(item => `
                        <div class="cart-item glass-morphism" data-product-id="${item.id}">
                            <div class="cart-item-image">
                                <img src="${item.image}" alt="${item.title}">
                            </div>
                            <div class="cart-item-content">
                                <div class="cart-item-header">
                                    <h3>${item.title}</h3>
                                    <button class="btn-icon ripple-effect" onclick="window.cart.removeItem('${item.id}')">
                                        <i class="ph ph-x"></i>
                                    </button>
                                </div>
                                <div class="cart-item-details">
                                    <div class="item-meta">
                                        <span class="item-article">
                                            <i class="ph ph-barcode"></i>
                                            Артикул: ${item.article}
                                        </span>
                                        <span class="item-manufacturer">
                                            <i class="ph ph-factory"></i>
                                            ${item.manufacturer}
                                        </span>
                                    </div>
                                    <div class="item-controls">
                                        <div class="quantity-controls glass-effect">
                                            <button class="btn-quantity ripple-effect" onclick="window.cart.updateQuantity('${item.id}', ${item.quantity - 1})">
                                                <i class="ph ph-minus"></i>
                                            </button>
                                            <span class="quantity">${item.quantity}</span>
                                            <button class="btn-quantity ripple-effect" onclick="window.cart.updateQuantity('${item.id}', ${item.quantity + 1})">
                                                <i class="ph ph-plus"></i>
                                            </button>
                                        </div>
                                        <div class="item-price">
                                            <span class="price gradient-text">${item.price * item.quantity} ₽</span>
                                            ${item.quantity > 1 ? `
                                                <span class="price-per-item">
                                                    <i class="ph ph-info"></i>
                                                    ${item.price} ₽/шт
                                                </span>
                                            ` : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="cart-summary glass-morphism">
                    <div class="summary-content">
                        <div class="summary-header">
                            <h3>Ваш заказ</h3>
                            <span class="items-count">
                                <i class="ph ph-shopping-cart"></i>
                                ${this.items.reduce((sum, item) => sum + item.quantity, 0)} шт
                            </span>
                        </div>
                        <div class="summary-details">
                            <div class="summary-row">
                                <span>Товары</span>
                                <span>${this.calculateTotal()} ₽</span>
                            </div>
                            <div class="summary-row">
                                <span>Доставка</span>
                                <span class="delivery-cost">Бесплатно</span>
                            </div>
                            <div class="summary-row total">
                                <span>Итого</span>
                                <span class="total-price gradient-text">${this.calculateTotal()} ₽</span>
                            </div>
                        </div>
                        <button class="gradient-btn checkout-btn" onclick="window.app.showScreen('checkout')">
                            <span>Оформить заказ</span>
                            <i class="ph ph-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Анимируем появление элементов
        gsap.from('.cart-item', {
            y: 30,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out'
        });

        gsap.from('.cart-summary', {
            x: 30,
            opacity: 0,
            duration: 0.5,
            delay: 0.3,
            ease: 'power3.out'
        });
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
        this.render();
        window.app.showNotification('Товар удален из корзины', 'info');
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity < 1) {
                this.removeItem(productId);
                return;
            }
            item.quantity = quantity;
            this.saveToStorage();
            this.render();
        }
    }

    calculateTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    clearCart() {
        this.items = [];
        this.saveToStorage();
        this.render();
    }
}

// Создаем глобальный экземпляр корзины
window.cart = new Cart();