// UI компоненты для Telegram MiniApp

class UIComponents {
    constructor() {
        this.cart = [];
        this.currentScreen = 'home';
        this.screenHistory = [];
        this.init();
    }

    init() {
        try {
            this.loadCartFromStorage();
            this.setupEventListeners();
            this.updateCartBadge();
            console.log('UI компоненты инициализированы');
        } catch (error) {
            console.error('Ошибка инициализации UI компонентов:', error);
        }
    }

    // Загрузка корзины из localStorage
    loadCartFromStorage() {
        const savedCart = localStorage.getItem('autoparts_cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    }

    // Сохранение корзины в localStorage
    saveCartToStorage() {
        localStorage.setItem('autoparts_cart', JSON.stringify(this.cart));
    }

    // Обновление счетчика корзины
    updateCartBadge() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    // Добавление товара в корзину
    addToCart(productId) {
        const product = DataService.getProduct(productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCartToStorage();
        this.updateCartBadge();
        this.showNotification('Товар добавлен в корзину');
    }

    // Удаление товара из корзины
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCartToStorage();
        this.updateCartBadge();
        this.updateCartDisplay();
        this.showNotification('Товар удален из корзины');
    }

    // Обновление количества товара
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCartToStorage();
                this.updateCartBadge();
                this.updateCartDisplay();
            }
        }
    }

    // Показать уведомление
    showNotification(message, type = 'success') {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#00ff88' : '#ff4757'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Удаляем через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Переключение экранов
    showScreen(screenId) {
        // Скрываем все экраны
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.remove('active'));

        // Показываем нужный экран
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
            this.screenHistory.push(screenId);
        }

        // Настройка кнопки назад
        if (screenId === 'home') {
            telegramAPI.hideBackButton();
        } else {
            telegramAPI.showBackButton();
        }
    }

    // Показать главную страницу
    showHome() {
        this.showScreen('home-screen');
    }

    // Показать категорию
    showCategory(categoryId) {
        const category = DataService.getCategory(categoryId);
        const products = DataService.getProductsByCategory(categoryId);

        if (category) {
            document.getElementById('category-title').textContent = category.name;
            this.renderProducts(products);
            this.showScreen('category-screen');
        }
    }

    // Показать товар
    showProduct(productId) {
        const product = DataService.getProduct(productId);
        if (product) {
            this.renderProductDetail(product);
            this.showScreen('product-screen');
        }
    }

    // Показать корзину
    showCart() {
        this.updateCartDisplay();
        this.showScreen('cart-screen');
    }

    // Показать оформление заказа
    showCheckout() {
        this.showScreen('checkout-screen');
    }

    // Показать профиль
    showProfile() {
        this.loadUserProfile();
        this.showScreen('profile-screen');
    }

    // Показать историю заказов
    showOrderHistory() {
        this.loadOrderHistory();
        this.showScreen('orders-screen');
    }

    // Рендеринг товаров
    renderProducts(products) {
        const container = document.getElementById('products-grid');
        if (!container) return;

        container.innerHTML = products.map(product => this.createProductCard(product)).join('');
    }

    // Создание карточки товара
    createProductCard(product) {
        const isFavorite = this.isInFavorites(product.id);
        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <div class="product-placeholder">
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
                        <span class="product-availability ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                            ${product.inStock ? 'В наличии' : 'Нет в наличии'}
                        </span>
                    </div>
                    <div class="product-price">
                        <span class="price">${product.price.toLocaleString()} ₽</span>
                        ${product.oldPrice ? `<span class="old-price">${product.oldPrice.toLocaleString()} ₽</span>` : ''}
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn-add-to-cart" data-product-id="${product.id}">
                        <i class="icon-cart-plus"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // Рендеринг детальной страницы товара
    renderProductDetail(product) {
        const container = document.getElementById('product-detail');
        if (!container) return;

        container.innerHTML = `
            <div class="product-detail-image">
                <i class="icon-${product.icon}"></i>
            </div>
            <div class="product-detail-info">
                <h3>${product.name}</h3>
                <p class="product-detail-description">${product.description}</p>
                <div class="product-specs">
                    <h4>Характеристики</h4>
                    <div class="spec-item">
                        <span class="spec-label">Бренд:</span>
                        <span class="spec-value">${product.brand}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Наличие:</span>
                        <span class="spec-value">${product.inStock ? 'В наличии' : 'Нет в наличии'}</span>
                    </div>
                </div>
                <div class="product-detail-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn" data-action="decrease" data-product-id="${product.id}">-</button>
                        <span class="quantity-display" data-product-id="${product.id}">1</span>
                        <button class="quantity-btn" data-action="increase" data-product-id="${product.id}">+</button>
                    </div>
                    <button class="add-to-cart-btn" data-product-id="${product.id}">
                        Добавить в корзину - ${product.price.toLocaleString()} ₽
                    </button>
                </div>
            </div>
        `;
    }

    // Обновление отображения корзины
    updateCartDisplay() {
        const container = document.getElementById('cart-items');
        const totalElement = document.getElementById('cart-total');
        
        if (!container) return;

        if (this.cart.length === 0) {
            container.innerHTML = '<p class="text-center">Корзина пуста</p>';
            if (totalElement) totalElement.textContent = '0 ₽';
            return;
        }

        container.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="icon-${item.icon}"></i>
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn" data-action="decrease" data-product-id="${item.id}">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" data-action="increase" data-product-id="${item.id}">+</button>
                        <button class="remove-item-btn" data-product-id="${item.id}">Удалить</button>
                    </div>
                </div>
            </div>
        `).join('');

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (totalElement) totalElement.textContent = `${total.toLocaleString()} ₽`;
    }

    // Загрузка профиля пользователя
    loadUserProfile() {
        const profile = DataService.getUserProfile();
        const orders = DataService.getOrderHistory();
        const favorites = this.getFavorites();

        document.getElementById('user-name').textContent = profile.name;
        document.getElementById('user-phone').textContent = profile.phone;

        // Добавляем статистику
        const profileContent = document.querySelector('.profile-content');
        if (profileContent) {
            const statsHTML = `
                <div class="profile-stats">
                    <div class="stat-item">
                        <span class="stat-number">${orders.length}</span>
                        <span class="stat-label">Заказов</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${favorites.length}</span>
                        <span class="stat-label">Избранное</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${this.cart.length}</span>
                        <span class="stat-label">В корзине</span>
                    </div>
                </div>
                <div class="profile-actions">
                    <button class="btn-profile-action" data-action="favorites">
                        <i class="icon-heart"></i>
                        Избранные товары
                    </button>
                    <button class="btn-profile-action" data-action="settings">
                        <i class="icon-settings"></i>
                        Настройки
                    </button>
                    <button class="btn-profile-action" data-action="edit-profile">
                        <i class="icon-edit"></i>
                        Редактировать профиль
                    </button>
                </div>
            `;
            
            const existingStats = profileContent.querySelector('.profile-stats');
            if (existingStats) {
                existingStats.remove();
            }
            const existingActions = profileContent.querySelector('.profile-actions');
            if (existingActions) {
                existingActions.remove();
            }
            
            profileContent.insertAdjacentHTML('beforeend', statsHTML);
        }
    }

    // Загрузка истории заказов
    loadOrderHistory() {
        const orders = DataService.getOrderHistory();
        const container = document.getElementById('orders-list');
        
        if (!container) return;

        if (orders.length === 0) {
            container.innerHTML = '<p class="text-center">История заказов пуста</p>';
            return;
        }

        container.innerHTML = orders.map(order => this.createOrderHistoryItem(order)).join('');
    }

    // Создание элемента истории заказа
    createOrderHistoryItem(order) {
        const statusText = {
            'completed': 'Выполнен',
            'processing': 'В обработке',
            'pending': 'Ожидает'
        };

        return `
            <div class="order-item" data-order-id="${order.id}">
                <div class="order-header">
                    <span class="order-number">Заказ #${order.id}</span>
                    <span class="order-status ${order.status}">${statusText[order.status]}</span>
                </div>
                <div class="order-date">${order.date}</div>
                <div class="order-summary">
                    <span>${order.items.length} товаров</span>
                    <span>${order.total.toLocaleString()} ₽</span>
                </div>
                <div class="order-actions">
                    <button class="btn-repeat-order" data-order-id="${order.id}">
                        Повторить заказ
                    </button>
                </div>
            </div>
        `;
    }

    // Работа с избранным
    getFavorites() {
        const favorites = localStorage.getItem('autoparts_favorites');
        return favorites ? JSON.parse(favorites) : [];
    }

    addToFavorites(productId) {
        const favorites = this.getFavorites();
        if (!favorites.includes(productId)) {
            favorites.push(productId);
            localStorage.setItem('autoparts_favorites', JSON.stringify(favorites));
        }
    }

    removeFromFavorites(productId) {
        const favorites = this.getFavorites();
        const updatedFavorites = favorites.filter(id => id !== productId);
        localStorage.setItem('autoparts_favorites', JSON.stringify(updatedFavorites));
    }

    isInFavorites(productId) {
        const favorites = this.getFavorites();
        return favorites.includes(productId);
    }

    // Показать избранные товары
    showFavorites() {
        const favorites = this.getFavorites();
        const favoriteProducts = favorites.map(id => DataService.getProduct(id)).filter(Boolean);
        
        document.getElementById('category-title').textContent = 'Избранные товары';
        this.renderProducts(favoriteProducts);
        this.showScreen('category-screen');
    }

    // Настройки приложения
    showSettings() {
        const settings = this.getSettings();
        
        const settingsHTML = `
            <div class="settings-container">
                <div class="setting-group">
                    <h3>Уведомления</h3>
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="notifications" ${settings.notifications ? 'checked' : ''}>
                            Получать уведомления
                        </label>
                    </div>
                </div>
                
                <div class="setting-group">
                    <h3>Внешний вид</h3>
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="dark-mode" ${settings.darkMode ? 'checked' : ''}>
                            Темная тема
                        </label>
                    </div>
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="animations" ${settings.animations ? 'checked' : ''}>
                            Анимации
                        </label>
                    </div>
                </div>
                
                <div class="setting-group">
                    <h3>Данные</h3>
                    <button class="btn-danger" id="clear-data">Очистить все данные</button>
                    <button class="btn-secondary" id="export-data">Экспорт данных</button>
                </div>
            </div>
        `;

        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = settingsHTML;
        this.setupSettingsEventListeners();
    }

    getSettings() {
        const settings = localStorage.getItem('autoparts_settings');
        return settings ? JSON.parse(settings) : {
            notifications: true,
            darkMode: true,
            animations: true
        };
    }

    saveSettings(settings) {
        localStorage.setItem('autoparts_settings', JSON.stringify(settings));
    }

    setupSettingsEventListeners() {
        // Обработчики настроек
        document.getElementById('clear-data')?.addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите очистить все данные?')) {
                localStorage.clear();
                this.cart = [];
                this.updateCartBadge();
                this.showNotification('Все данные очищены');
                this.showHome();
            }
        });

        document.getElementById('export-data')?.addEventListener('click', () => {
            const data = {
                cart: this.cart,
                favorites: this.getFavorites(),
                settings: this.getSettings()
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'autoparts_data.json';
            a.click();
            URL.revokeObjectURL(url);
            
            this.showNotification('Данные экспортированы');
        });
    }

    // Редактирование профиля
    showEditProfile() {
        const profile = DataService.getUserProfile();
        
        const editHTML = `
            <div class="edit-profile-form">
                <div class="form-group">
                    <label for="edit-name">Имя</label>
                    <input type="text" id="edit-name" value="${profile.name}">
                </div>
                <div class="form-group">
                    <label for="edit-phone">Телефон</label>
                    <input type="tel" id="edit-phone" value="${profile.phone}">
                </div>
                <div class="form-group">
                    <label for="edit-email">Email</label>
                    <input type="email" id="edit-email" value="${profile.email}">
                </div>
                <div class="form-group">
                    <label for="edit-address">Адрес</label>
                    <textarea id="edit-address">${profile.address}</textarea>
                </div>
                <div class="form-actions">
                    <button class="btn-secondary" id="cancel-edit">Отмена</button>
                    <button class="submit-btn" id="save-profile">Сохранить</button>
                </div>
            </div>
        `;

        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = editHTML;
        
        document.getElementById('save-profile')?.addEventListener('click', () => this.saveProfile());
        document.getElementById('cancel-edit')?.addEventListener('click', () => this.showProfile());
    }

    saveProfile() {
        const name = document.getElementById('edit-name').value;
        const phone = document.getElementById('edit-phone').value;
        const email = document.getElementById('edit-email').value;
        const address = document.getElementById('edit-address').value;

        // В реальном приложении здесь был бы запрос к серверу
        this.showNotification('Профиль обновлен');
        this.showProfile();
    }

    // Повторение заказа
    repeatOrder(orderId) {
        const order = DataService.getOrder(orderId);
        if (!order) {
            this.showNotification('Заказ не найден', 'error');
            return;
        }

        // Очищаем текущую корзину
        this.cart = [];
        
        // Добавляем все товары из заказа в корзину
        order.items.forEach(item => {
            const product = DataService.getProduct(item.id);
            if (product) {
                this.cart.push({
                    ...product,
                    quantity: item.quantity
                });
            }
        });

        this.saveCartToStorage();
        this.updateCartBadge();
        this.updateCartDisplay();
        
        this.showNotification(`Заказ #${orderId} добавлен в корзину`);
        this.showCart();
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        // Навигация
        document.addEventListener('click', (e) => {
            // Категории
            if (e.target.closest('.category-card')) {
                const card = e.target.closest('.category-card');
                const categoryId = card.dataset.category;
                this.showCategory(categoryId);
            }

            // Товары
            if (e.target.closest('.product-card')) {
                const card = e.target.closest('.product-card');
                const productId = card.dataset.productId;
                this.showProduct(productId);
            }

            // Кнопки добавления в корзину
            if (e.target.closest('.btn-add-to-cart')) {
                const button = e.target.closest('.btn-add-to-cart');
                const productId = button.dataset.productId;
                this.addToCart(productId);
            }

            // Кнопки навигации
            if (e.target.closest('#cart-btn')) {
                this.showCart();
            }

            if (e.target.closest('#profile-btn')) {
                this.showProfile();
            }

            if (e.target.closest('#search-btn')) {
                this.toggleSearch();
            }

            if (e.target.closest('#search-close')) {
                this.toggleSearch();
            }

            // Кнопка назад
            if (e.target.closest('.back-btn')) {
                this.goBack();
            }

            // Кнопка оформления заказа
            if (e.target.closest('#checkout-btn')) {
                this.showCheckout();
            }

            // Форма оформления заказа
            if (e.target.closest('#checkout-form')) {
                e.preventDefault();
                this.processOrder();
            }

            // Меню профиля
            if (e.target.closest('.profile-menu-item')) {
                const item = e.target.closest('.profile-menu-item');
                const action = item.dataset.action;
                
                switch (action) {
                    case 'orders':
                        this.showOrderHistory();
                        break;
                    case 'favorites':
                        this.showFavorites();
                        break;
                    case 'settings':
                        this.showSettings();
                        break;
                }
            }

            // Действия профиля
            if (e.target.closest('.btn-profile-action')) {
                const button = e.target.closest('.btn-profile-action');
                const action = button.dataset.action;
                
                switch (action) {
                    case 'favorites':
                        this.showFavorites();
                        break;
                    case 'settings':
                        this.showSettings();
                        break;
                    case 'edit-profile':
                        this.showEditProfile();
                        break;
                }
            }

            // Кнопки избранного
            if (e.target.closest('.btn-favorite')) {
                const button = e.target.closest('.btn-favorite');
                const productId = button.dataset.productId;
                
                if (this.isInFavorites(productId)) {
                    this.removeFromFavorites(productId);
                    button.classList.remove('active');
                } else {
                    this.addToFavorites(productId);
                    button.classList.add('active');
                }
            }

            // Кнопки количества
            if (e.target.closest('.quantity-btn')) {
                const button = e.target.closest('.quantity-btn');
                const action = button.dataset.action;
                const productId = button.dataset.productId;
                
                if (action === 'increase') {
                    this.addToCart(productId);
                } else if (action === 'decrease') {
                    const item = this.cart.find(item => item.id === productId);
                    if (item) {
                        this.updateQuantity(productId, item.quantity - 1);
                    }
                }
            }

            // Удаление из корзины
            if (e.target.closest('.remove-item-btn')) {
                const button = e.target.closest('.remove-item-btn');
                const productId = button.dataset.productId;
                this.removeFromCart(productId);
            }

            // Повторение заказа
            if (e.target.closest('.btn-repeat-order')) {
                const button = e.target.closest('.btn-repeat-order');
                const orderId = button.dataset.orderId;
                this.repeatOrder(orderId);
            }

            // Закрытие модального окна
            if (e.target.closest('#modal-close')) {
                this.hideModal();
            }
        });

        // Поиск
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Кнопка назад Telegram
        document.addEventListener('telegramBackButton', () => {
            this.goBack();
        });
    }

    // Переключение поиска
    toggleSearch() {
        const searchBar = document.getElementById('search-bar');
        const searchInput = document.getElementById('search-input');
        
        if (searchBar.style.display === 'none') {
            searchBar.style.display = 'flex';
            searchInput.focus();
        } else {
            searchBar.style.display = 'none';
            searchInput.value = '';
            this.handleSearch('');
        }
    }

    // Обработка поиска
    handleSearch(query) {
        if (query.trim() === '') {
            this.showHome();
            return;
        }

        const results = DataService.searchProducts(query);
        document.getElementById('category-title').textContent = `Поиск: ${query}`;
        this.renderProducts(results);
        this.showScreen('category-screen');
    }

    // Навигация назад
    goBack() {
        if (this.screenHistory.length > 1) {
            this.screenHistory.pop(); // Убираем текущий экран
            const previousScreen = this.screenHistory[this.screenHistory.length - 1];
            
            switch (previousScreen) {
                case 'home-screen':
                    this.showHome();
                    break;
                case 'category-screen':
                    // Возвращаемся к категориям
                    this.showHome();
                    break;
                case 'cart-screen':
                    this.showCart();
                    break;
                case 'profile-screen':
                    this.showProfile();
                    break;
                default:
                    this.showHome();
            }
        } else {
            this.showHome();
        }
    }

    // Обработка заказа
    processOrder() {
        const form = document.getElementById('checkout-form');
        const formData = new FormData(form);
        
        const orderData = {
            customer: {
                name: formData.get('name') || document.getElementById('name').value,
                phone: formData.get('phone') || document.getElementById('phone').value,
                address: formData.get('address') || document.getElementById('address').value,
                delivery: formData.get('delivery') || document.getElementById('delivery').value
            },
            items: this.cart,
            total: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };

        // Создаем заказ
        const order = DataService.createOrder(orderData);
        
        // Очищаем корзину
        this.cart = [];
        this.saveCartToStorage();
        this.updateCartBadge();
        
        // Показываем успешное сообщение
        this.showSuccessModal(order);
    }

    // Показать модальное окно успеха
    showSuccessModal(order) {
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    // Скрыть модальное окно
    hideModal() {
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.style.display = 'none';
            this.showHome();
        }
    }
}

// Создаем глобальный экземпляр
const uiComponents = new UIComponents();

// Экспорт для использования в других модулях
window.uiComponents = uiComponents; 