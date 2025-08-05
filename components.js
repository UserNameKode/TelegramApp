// ===== КОМПОНЕНТЫ UI ДЛЯ TELEGRAM MINIAPP =====

class UIComponents {
    constructor() {
        this.currentScreen = 'home';
        this.cart = this.loadCart();
        this.favorites = this.loadFavorites();
        this.init();
    }

    init() {
        try {
            console.log('Инициализация UI компонентов...');
            this.setupEventListeners();
            this.updateCartBadge();
            this.updateFavoritesBadge();
            console.log('UI компоненты инициализированы');
        } catch (error) {
            console.error('Ошибка инициализации UI компонентов:', error);
        }
    }

    // ===== УПРАВЛЕНИЕ ЭКРАНАМИ =====
    showScreen(screenName) {
        console.log('Переключение на экран:', screenName);
        
        // Скрываем все экраны
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.remove('active');
        });

        // Показываем нужный экран
        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
            console.log('Экран показан:', screenName);
        } else {
            console.error('Экран не найден:', screenName);
        }

        // Обновляем активную кнопку навигации
        this.updateActiveNavButton(screenName);
    }

    updateActiveNavButton(screenName) {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.screen === screenName) {
                btn.classList.add('active');
            }
        });
    }

    // ===== ГЛАВНАЯ СТРАНИЦА =====
    showHome() {
        this.showScreen('home');
        this.renderCategories();
        this.renderProducts();
    }

    renderCategories() {
        const categoriesContainer = document.querySelector('.categories-grid');
        if (!categoriesContainer) return;

        const categories = window.categories || [];
        categoriesContainer.innerHTML = categories.map(category => `
            <div class="category-card" data-category="${category.id}">
                <div class="category-icon">
                    <i class="icon-${category.icon}"></i>
                </div>
                <h3>${category.name}</h3>
                <p>${category.description}</p>
            </div>
        `).join('');
    }

    renderProducts(categoryId = null) {
        const productsContainer = document.querySelector('.products-grid');
        if (!productsContainer) return;

        let products = window.products || [];
        
        if (categoryId) {
            products = products.filter(product => product.categoryId === categoryId);
        }

        productsContainer.innerHTML = products.map(product => this.createProductCard(product)).join('');
    }

    createProductCard(product) {
        const isFavorite = this.isInFavorites(product.id);
        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    ${product.image ? 
                        `<img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` :
                        ''
                    }
                    <div class="product-placeholder" style="${product.image ? 'display: none;' : ''}">
                        <i class="icon-${product.icon}"></i>
                    </div>
                    <button class="btn-favorite ${isFavorite ? 'active' : ''}" data-product-id="${product.id}">
                        <i class="icon-heart"></i>
                    </button>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-meta">
                        <span class="product-brand">${product.brand}</span>
                        <span class="product-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                            ${product.inStock ? 'В наличии' : 'Нет в наличии'}
                        </span>
                    </div>
                    <div class="product-footer">
                        <span class="price">${product.price.toLocaleString()} ₽</span>
                        <button class="btn-add-to-cart" data-product-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                            ${product.inStock ? 'В корзину' : 'Нет в наличии'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // ===== КАТЕГОРИИ =====
    showCategory(categoryId) {
        console.log('Показ категории:', categoryId);
        this.showScreen('category');
        this.renderCategoryProducts(categoryId);
    }

    renderCategoryProducts(categoryId) {
        const category = window.categories?.find(c => c.id === categoryId);
        if (!category) return;

        // Обновляем заголовок
        const categoryTitle = document.querySelector('.category-title');
        if (categoryTitle) {
            categoryTitle.textContent = category.name;
        }

        // Рендерим товары категории
        this.renderProducts(categoryId);
    }

    // ===== ДЕТАЛЬНАЯ СТРАНИЦА ТОВАРА =====
    showProduct(productId) {
        console.log('Показ товара:', productId);
        this.showScreen('product');
        this.renderProductDetail(productId);
    }

    renderProductDetail(productId) {
        const product = window.products?.find(p => p.id === productId);
        if (!product) return;

        const productDetailContainer = document.getElementById('product-detail-screen');
        if (!productDetailContainer) return;

        const isFavorite = this.isInFavorites(product.id);
        
        productDetailContainer.innerHTML = `
            <div class="product-detail">
                <div class="product-detail-header">
                    ${product.image ? 
                        `<img src="${product.image}" alt="${product.name}" class="product-detail-image">` :
                        `<div class="product-placeholder" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 4rem; color: var(--text-muted);">
                            <i class="icon-${product.icon}"></i>
                        </div>`
                    }
                    ${product.inStock ? '<div class="product-detail-badge">В наличии</div>' : ''}
                </div>
                <div class="product-detail-content">
                    <h1 class="product-detail-title">${product.name}</h1>
                    <div class="product-detail-brand">${product.brand}</div>
                    <p class="product-detail-description">${product.description}</p>
                    
                    <div class="product-detail-specs">
                        <div class="spec-item">
                            <div class="spec-label">Бренд</div>
                            <div class="spec-value">${product.brand}</div>
                        </div>
                        <div class="spec-item">
                            <div class="spec-label">Состояние</div>
                            <div class="spec-value">${product.inStock ? 'В наличии' : 'Нет в наличии'}</div>
                        </div>
                        <div class="spec-item">
                            <div class="spec-label">Артикул</div>
                            <div class="spec-value">${product.id}</div>
                        </div>
                    </div>
                    
                    <div class="product-detail-price">${product.price.toLocaleString()} ₽</div>
                    
                    <div class="product-detail-actions">
                        <button class="btn-add-to-cart-large" data-product-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                            ${product.inStock ? 'Добавить в корзину' : 'Нет в наличии'}
                        </button>
                        <button class="btn-favorite-large ${isFavorite ? 'active' : ''}" data-product-id="${product.id}">
                            <i class="icon-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // ===== КОРЗИНА =====
    showCart() {
        console.log('Показ корзины');
        this.showScreen('cart');
        this.renderCart();
    }

    renderCart() {
        const cartContainer = document.getElementById('cart-screen');
        if (!cartContainer) return;

        if (this.cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="cart-empty">
                    <div class="cart-empty-icon">
                        <i class="icon-cart"></i>
                    </div>
                    <h2 class="cart-empty-title">Корзина пуста</h2>
                    <p class="cart-empty-message">Добавьте товары в корзину для оформления заказа</p>
                    <button class="btn-start-shopping" onclick="uiComponents.showHome()">
                        Начать покупки
                    </button>
                </div>
            `;
            return;
        }

        const cartItems = this.cart.map(item => {
            const product = window.products?.find(p => p.id === item.productId);
            if (!product) return '';

            return `
                <div class="cart-item" data-product-id="${item.productId}">
                    <div class="cart-item-image">
                        ${product.image ? 
                            `<img src="${product.image}" alt="${product.name}">` :
                            `<div class="product-placeholder">
                                <i class="icon-${product.icon}"></i>
                            </div>`
                        }
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${product.name}</div>
                        <div class="cart-item-price">${product.price.toLocaleString()} ₽</div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="uiComponents.updateQuantity('${item.productId}', -1)">-</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" onclick="uiComponents.updateQuantity('${item.productId}', 1)">+</button>
                        </div>
                        <button class="btn-remove" onclick="uiComponents.removeFromCart('${item.productId}')">
                            Удалить
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        const total = this.cart.reduce((sum, item) => {
            const product = window.products?.find(p => p.id === item.productId);
            return sum + (product?.price || 0) * item.quantity;
        }, 0);

        cartContainer.innerHTML = `
            <div class="cart-header">
                <h1 class="cart-title">Корзина</h1>
                <span class="cart-count">${this.cart.length} товар(ов)</span>
            </div>
            <div class="cart-items">
                ${cartItems}
            </div>
            <div class="cart-summary">
                <div class="cart-total">
                    <span>Итого:</span>
                    <span>${total.toLocaleString()} ₽</span>
                </div>
                <button class="btn-checkout" onclick="uiComponents.showCheckout()">
                    Оформить заказ
                </button>
            </div>
        `;
    }

    // ===== УПРАВЛЕНИЕ КОРЗИНОЙ =====
    addToCart(productId) {
        console.log('Добавление в корзину:', productId);
        
        const existingItem = this.cart.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ productId, quantity: 1 });
        }
        
        this.saveCart();
        this.updateCartBadge();
        this.showNotification('Товар добавлен в корзину', 'success');
        
        // Обновляем отображение корзины если она открыта
        if (this.currentScreen === 'cart') {
            this.renderCart();
        }
    }

    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.productId === productId);
        if (!item) return;

        item.quantity += change;
        
        if (item.quantity <= 0) {
            this.removeFromCart(productId);
        } else {
            this.saveCart();
            this.updateCartBadge();
            this.renderCart();
        }
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.productId !== productId);
        this.saveCart();
        this.updateCartBadge();
        this.renderCart();
        this.showNotification('Товар удален из корзины', 'info');
    }

    // ===== ИЗБРАННОЕ =====
    toggleFavorite(productId) {
        const index = this.favorites.indexOf(productId);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.showNotification('Удалено из избранного', 'info');
        } else {
            this.favorites.push(productId);
            this.showNotification('Добавлено в избранное', 'success');
        }
        
        this.saveFavorites();
        this.updateFavoritesBadge();
        
        // Обновляем отображение если нужно
        if (this.currentScreen === 'home' || this.currentScreen === 'category') {
            this.renderProducts();
        }
    }

    isInFavorites(productId) {
        return this.favorites.includes(productId);
    }

    // ===== ПРОФИЛЬ =====
    showProfile() {
        console.log('Показ профиля');
        this.showScreen('profile');
        this.renderProfile();
    }

    renderProfile() {
        const profileContainer = document.getElementById('profile-screen');
        if (!profileContainer) return;

        const user = this.getUserInfo();
        const stats = this.getUserStats();

        profileContainer.innerHTML = `
            <div class="profile-header">
                <div class="profile-avatar">
                    <i class="icon-user"></i>
                </div>
                <h2 class="profile-name">${user.name}</h2>
                <p class="profile-email">${user.email}</p>
            </div>
            
            <div class="profile-stats">
                <div class="stat-card">
                    <div class="stat-number">${stats.totalOrders}</div>
                    <div class="stat-label">Заказов</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.totalSpent.toLocaleString()} ₽</div>
                    <div class="stat-label">Потрачено</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${this.favorites.length}</div>
                    <div class="stat-label">Избранное</div>
                </div>
            </div>
            
            <div class="profile-menu">
                <a href="#" class="profile-menu-item" onclick="uiComponents.showOrders()">
                    <div class="profile-menu-icon">
                        <i class="icon-orders"></i>
                    </div>
                    <div class="profile-menu-content">
                        <div class="profile-menu-title">История заказов</div>
                        <div class="profile-menu-subtitle">Просмотр всех заказов</div>
                    </div>
                    <div class="profile-menu-arrow">
                        <i class="icon-arrow-right"></i>
                    </div>
                </a>
                <a href="#" class="profile-menu-item" onclick="uiComponents.showFavorites()">
                    <div class="profile-menu-icon">
                        <i class="icon-heart"></i>
                    </div>
                    <div class="profile-menu-content">
                        <div class="profile-menu-title">Избранное</div>
                        <div class="profile-menu-subtitle">Сохраненные товары</div>
                    </div>
                    <div class="profile-menu-arrow">
                        <i class="icon-arrow-right"></i>
                    </div>
                </a>
                <a href="#" class="profile-menu-item" onclick="uiComponents.showSettings()">
                    <div class="profile-menu-icon">
                        <i class="icon-settings"></i>
                    </div>
                    <div class="profile-menu-content">
                        <div class="profile-menu-title">Настройки</div>
                        <div class="profile-menu-subtitle">Настройки приложения</div>
                    </div>
                    <div class="profile-menu-arrow">
                        <i class="icon-arrow-right"></i>
                    </div>
                </a>
            </div>
        `;
    }

    // ===== ИСТОРИЯ ЗАКАЗОВ =====
    showOrders() {
        console.log('Показ истории заказов');
        this.showScreen('orders');
        this.renderOrders();
    }

    renderOrders() {
        const ordersContainer = document.getElementById('orders-screen');
        if (!ordersContainer) return;

        const orders = this.getOrders();
        
        if (orders.length === 0) {
            ordersContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="icon-orders"></i>
                    </div>
                    <h2 class="empty-state-title">Заказов пока нет</h2>
                    <p class="empty-state-message">Сделайте первый заказ, чтобы увидеть его здесь</p>
                    <button class="btn-start-shopping" onclick="uiComponents.showHome()">
                        Начать покупки
                    </button>
                </div>
            `;
            return;
        }

        const ordersList = orders.map(order => `
            <div class="order-item" onclick="uiComponents.showOrderDetail('${order.id}')">
                <div class="order-header">
                    <div class="order-number">Заказ #${order.id}</div>
                    <div class="order-date">${new Date(order.date).toLocaleDateString()}</div>
                </div>
                <div class="order-status ${order.status}">${this.getStatusText(order.status)}</div>
                <div class="order-total">${order.total.toLocaleString()} ₽</div>
            </div>
        `).join('');

        ordersContainer.innerHTML = `
            <h1 class="section-title">История заказов</h1>
            ${ordersList}
        `;
    }

    // ===== ОФОРМЛЕНИЕ ЗАКАЗА =====
    showCheckout() {
        console.log('Показ оформления заказа');
        this.showScreen('checkout');
        this.renderCheckout();
    }

    renderCheckout() {
        const checkoutContainer = document.getElementById('checkout-screen');
        if (!checkoutContainer) return;

        const total = this.cart.reduce((sum, item) => {
            const product = window.products?.find(p => p.id === item.productId);
            return sum + (product?.price || 0) * item.quantity;
        }, 0);

        checkoutContainer.innerHTML = `
            <h1 class="section-title">Оформление заказа</h1>
            
            <div class="checkout-form">
                <div class="checkout-section">
                    <h2 class="checkout-section-title">Данные получателя</h2>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Имя *</label>
                            <input type="text" class="form-input" id="checkout-name" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Фамилия *</label>
                            <input type="text" class="form-input" id="checkout-surname" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Телефон *</label>
                            <input type="tel" class="form-input" id="checkout-phone" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-input" id="checkout-email">
                        </div>
                    </div>
                </div>
                
                <div class="checkout-section">
                    <h2 class="checkout-section-title">Адрес доставки</h2>
                    <div class="form-row full">
                        <div class="form-group">
                            <label class="form-label">Адрес *</label>
                            <textarea class="form-input form-textarea" id="checkout-address" required></textarea>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Город *</label>
                            <input type="text" class="form-input" id="checkout-city" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Индекс</label>
                            <input type="text" class="form-input" id="checkout-zip">
                        </div>
                    </div>
                </div>
                
                <div class="checkout-summary">
                    <div class="summary-row">
                        <span>Товары (${this.cart.length}):</span>
                        <span>${total.toLocaleString()} ₽</span>
                    </div>
                    <div class="summary-row">
                        <span>Доставка:</span>
                        <span>Бесплатно</span>
                    </div>
                    <div class="summary-row total">
                        <span>Итого:</span>
                        <span>${total.toLocaleString()} ₽</span>
                    </div>
                </div>
                
                <button class="btn-submit-order" onclick="uiComponents.submitOrder()">
                    Оформить заказ
                </button>
            </div>
        `;
    }

    submitOrder() {
        const formData = {
            name: document.getElementById('checkout-name')?.value,
            surname: document.getElementById('checkout-surname')?.value,
            phone: document.getElementById('checkout-phone')?.value,
            email: document.getElementById('checkout-email')?.value,
            address: document.getElementById('checkout-address')?.value,
            city: document.getElementById('checkout-city')?.value,
            zip: document.getElementById('checkout-zip')?.value
        };

        // Проверка обязательных полей
        const requiredFields = ['name', 'surname', 'phone', 'address', 'city'];
        const missingFields = requiredFields.filter(field => !formData[field]);
        
        if (missingFields.length > 0) {
            this.showNotification('Заполните все обязательные поля', 'error');
            return;
        }

        // Создание заказа
        const order = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            status: 'pending',
            items: [...this.cart],
            total: this.cart.reduce((sum, item) => {
                const product = window.products?.find(p => p.id === item.productId);
                return sum + (product?.price || 0) * item.quantity;
            }, 0),
            customer: formData
        };

        // Сохранение заказа
        this.saveOrder(order);
        
        // Очистка корзины
        this.cart = [];
        this.saveCart();
        this.updateCartBadge();
        
        // Показ уведомления об успехе
        this.showNotification('Заказ успешно оформлен!', 'success');
        
        // Переход к истории заказов
        setTimeout(() => {
            this.showOrders();
        }, 2000);
    }

    // ===== УВЕДОМЛЕНИЯ =====
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-header">
                <div class="notification-icon">
                    <i class="icon-${type === 'success' ? 'check' : type === 'error' ? 'close' : type === 'warning' ? 'warning' : 'info'}"></i>
                </div>
                <div class="notification-title">${this.getNotificationTitle(type)}</div>
            </div>
            <div class="notification-message">${message}</div>
        `;

        document.body.appendChild(notification);
        
        // Показываем уведомление
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Скрываем через 3 секунды
        setTimeout(() => {
            notification.classList.add('hiding');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    getNotificationTitle(type) {
        switch (type) {
            case 'success': return 'Успешно';
            case 'error': return 'Ошибка';
            case 'warning': return 'Внимание';
            default: return 'Информация';
        }
    }

    // ===== ОБРАБОТЧИКИ СОБЫТИЙ =====
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            console.log('Click event:', e.target);
            
            // Навигация по категориям
            if (e.target.closest('.category-card')) {
                const card = e.target.closest('.category-card');
                const categoryId = card.dataset.category;
                console.log('Category clicked:', categoryId);
                this.showCategory(categoryId);
                return;
            }
            
            // Навигация по товарам
            if (e.target.closest('.product-card')) {
                const card = e.target.closest('.product-card');
                const productId = card.dataset.productId;
                console.log('Product clicked:', productId);
                this.showProduct(productId);
                return;
            }
            
            // Добавление в корзину
            if (e.target.closest('.btn-add-to-cart')) {
                e.stopPropagation();
                const button = e.target.closest('.btn-add-to-cart');
                const productId = button.dataset.productId;
                console.log('Add to cart clicked:', productId);
                this.addToCart(productId);
                return;
            }
            
            // Избранное
            if (e.target.closest('.btn-favorite')) {
                e.stopPropagation();
                const button = e.target.closest('.btn-favorite');
                const productId = button.dataset.productId;
                console.log('Favorite clicked:', productId);
                this.toggleFavorite(productId);
                return;
            }
            
            // Навигационные кнопки
            if (e.target.closest('.nav-btn')) {
                const button = e.target.closest('.nav-btn');
                const screen = button.dataset.screen;
                console.log('Nav button clicked:', screen);
                
                switch (screen) {
                    case 'home':
                        this.showHome();
                        break;
                    case 'cart':
                        this.showCart();
                        break;
                    case 'profile':
                        this.showProfile();
                        break;
                }
                return;
            }
            
            // Кнопка "Назад"
            if (e.target.closest('.btn-back')) {
                console.log('Back button clicked');
                this.showHome();
                return;
            }
        });
    }

    // ===== ЛОКАЛЬНОЕ ХРАНИЛИЩЕ =====
    loadCart() {
        try {
            const cart = localStorage.getItem('cart');
            return cart ? JSON.parse(cart) : [];
        } catch (error) {
            console.error('Ошибка загрузки корзины:', error);
            return [];
        }
    }

    saveCart() {
        try {
            localStorage.setItem('cart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Ошибка сохранения корзины:', error);
        }
    }

    loadFavorites() {
        try {
            const favorites = localStorage.getItem('favorites');
            return favorites ? JSON.parse(favorites) : [];
        } catch (error) {
            console.error('Ошибка загрузки избранного:', error);
            return [];
        }
    }

    saveFavorites() {
        try {
            localStorage.setItem('favorites', JSON.stringify(this.favorites));
        } catch (error) {
            console.error('Ошибка сохранения избранного:', error);
        }
    }

    saveOrder(order) {
        try {
            const orders = this.getOrders();
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));
        } catch (error) {
            console.error('Ошибка сохранения заказа:', error);
        }
    }

    getOrders() {
        try {
            const orders = localStorage.getItem('orders');
            return orders ? JSON.parse(orders) : [];
        } catch (error) {
            console.error('Ошибка загрузки заказов:', error);
            return [];
        }
    }

    // ===== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ =====
    updateCartBadge() {
        const cartBadge = document.querySelector('.nav-btn[data-screen="cart"] .badge');
        if (cartBadge) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartBadge.textContent = totalItems;
            cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    updateFavoritesBadge() {
        const favoritesBadge = document.querySelector('.nav-btn[data-screen="favorites"] .badge');
        if (favoritesBadge) {
            favoritesBadge.textContent = this.favorites.length;
            favoritesBadge.style.display = this.favorites.length > 0 ? 'block' : 'none';
        }
    }

    getUserInfo() {
        return {
            name: 'Пользователь',
            email: 'user@example.com'
        };
    }

    getUserStats() {
        const orders = this.getOrders();
        const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
        
        return {
            totalOrders: orders.length,
            totalSpent: totalSpent
        };
    }

    getStatusText(status) {
        switch (status) {
            case 'pending': return 'Ожидает обработки';
            case 'processing': return 'В обработке';
            case 'completed': return 'Выполнен';
            case 'cancelled': return 'Отменен';
            default: return 'Неизвестно';
        }
    }

    showFavorites() {
        console.log('Показ избранного');
        this.showScreen('favorites');
        this.renderFavorites();
    }

    renderFavorites() {
        const favoritesContainer = document.getElementById('favorites-screen');
        if (!favoritesContainer) return;

        if (this.favorites.length === 0) {
            favoritesContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="icon-heart"></i>
                    </div>
                    <h2 class="empty-state-title">Избранное пусто</h2>
                    <p class="empty-state-message">Добавьте товары в избранное, чтобы увидеть их здесь</p>
                    <button class="btn-start-shopping" onclick="uiComponents.showHome()">
                        Начать покупки
                    </button>
                </div>
            `;
            return;
        }

        const favoriteProducts = window.products?.filter(product => this.favorites.includes(product.id)) || [];
        const productsHtml = favoriteProducts.map(product => this.createProductCard(product)).join('');

        favoritesContainer.innerHTML = `
            <h1 class="section-title">Избранное</h1>
            <div class="products-grid">
                ${productsHtml}
            </div>
        `;
    }

    showSettings() {
        console.log('Показ настроек');
        this.showNotification('Функция настроек в разработке', 'info');
    }

    showOrderDetail(orderId) {
        console.log('Показ деталей заказа:', orderId);
        this.showNotification('Детали заказа в разработке', 'info');
    }
}

// Создание глобального экземпляра
window.uiComponents = new UIComponents(); 