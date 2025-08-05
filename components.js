// Компоненты интерфейса для Telegram MiniApp
class UIComponents {
    constructor() {
        this.cart = [];
        this.init();
    }

    // Инициализация компонентов
    init() {
        this.loadCartFromStorage();
        this.setupEventListeners();
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

    // Настройка обработчиков событий
    setupEventListeners() {
        // Обработка поиска
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Обработка кнопки корзины
        const cartButton = document.getElementById('cart-button');
        if (cartButton) {
            cartButton.addEventListener('click', () => {
                this.showCart();
            });
        }

        // Обработка кнопки профиля
        const profileButton = document.getElementById('profile-button');
        if (profileButton) {
            profileButton.addEventListener('click', () => {
                this.showProfile();
            });
        }

        // Обработка кнопок избранного
        document.addEventListener('click', (e) => {
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
        });
    }

    // Создание карточки категории
    createCategoryCard(category) {
        return `
            <div class="category-card" data-category-id="${category.id}">
                <div class="category-icon">
                    <i class="icon-${category.icon}"></i>
                </div>
                <div class="category-info">
                    <h3>${category.name}</h3>
                    <p>${category.description}</p>
                    <span class="category-count">${category.productCount} товаров</span>
                </div>
                <div class="category-arrow">
                    <i class="icon-arrow-right"></i>
                </div>
            </div>
        `;
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

    // Создание элемента корзины
    createCartItem(item) {
        return `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-image">
                    <div class="product-placeholder">
                        <i class="icon-${item.icon}"></i>
                    </div>
                </div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-brand">${item.brand}</p>
                    <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-product-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-product-id="${item.id}">+</button>
                </div>
                <div class="cart-item-total">
                    ${(item.price * item.quantity).toLocaleString()} ₽
                </div>
                <button class="cart-item-remove" data-product-id="${item.id}">
                    <i class="icon-trash"></i>
                </button>
            </div>
        `;
    }

    // Создание элемента истории заказов
    createOrderHistoryItem(order) {
        const statusClass = this.getOrderStatusClass(order.status);
        const statusText = this.getOrderStatusText(order.status);
        
        return `
            <div class="order-item" data-order-id="${order.id}">
                <div class="order-header">
                    <div class="order-info">
                        <h4>Заказ #${order.id}</h4>
                        <span class="order-date">${new Date(order.date).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div class="order-status ${statusClass}">
                        ${statusText}
                    </div>
                </div>
                <div class="order-products">
                    ${order.items.map(item => `
                        <div class="order-product">
                            <span class="product-name">${item.name}</span>
                            <span class="product-quantity">x${item.quantity}</span>
                            <span class="product-price">${item.price.toLocaleString()} ₽</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-footer">
                    <div class="order-total">
                        <span>Итого:</span>
                        <strong>${order.total.toLocaleString()} ₽</strong>
                    </div>
                    <div class="order-actions">
                        <button class="btn-order-details" data-order-id="${order.id}">
                            Подробности
                        </button>
                        <button class="btn-repeat-order" data-order-id="${order.id}">
                            Повторить заказ
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Получение класса статуса заказа
    getOrderStatusClass(status) {
        const statusClasses = {
            'pending': 'status-pending',
            'confirmed': 'status-confirmed',
            'shipped': 'status-shipped',
            'delivered': 'status-delivered',
            'cancelled': 'status-cancelled'
        };
        return statusClasses[status] || 'status-pending';
    }

    // Получение текста статуса заказа
    getOrderStatusText(status) {
        const statusTexts = {
            'pending': 'Ожидает подтверждения',
            'confirmed': 'Подтвержден',
            'shipped': 'Отправлен',
            'delivered': 'Доставлен',
            'cancelled': 'Отменен'
        };
        return statusTexts[status] || 'Неизвестно';
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
    }

    // Изменение количества товара в корзине
    updateCartQuantity(productId, delta) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;

        item.quantity += delta;
        
        if (item.quantity <= 0) {
            this.removeFromCart(productId);
        } else {
            this.saveCartToStorage();
            this.updateCartBadge();
            this.updateCartDisplay();
        }
    }

    // Обновление бейджа корзины
    updateCartBadge() {
        const cartBadge = document.getElementById('cart-badge');
        if (cartBadge) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartBadge.textContent = totalItems;
            cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    // Обновление отображения корзины
    updateCartDisplay() {
        const cartItemsContainer = document.getElementById('cart-items');
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = this.cart.map(item => 
                this.createCartItem(item)
            ).join('');
            
            this.setupCartEventListeners();
        }

        this.updateCartTotal();
    }

    // Обновление общей суммы корзины
    updateCartTotal() {
        const cartTotal = document.getElementById('cart-total');
        if (cartTotal) {
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `${total.toLocaleString()} ₽`;
        }
    }

    // Настройка обработчиков событий корзины
    setupCartEventListeners() {
        // Кнопки добавления в корзину
        document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.productId;
                this.addToCart(productId);
            });
        });

        // Кнопки изменения количества
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.productId;
                const delta = e.currentTarget.classList.contains('plus') ? 1 : -1;
                this.updateCartQuantity(productId, delta);
            });
        });

        // Кнопки удаления из корзины
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.productId;
                this.removeFromCart(productId);
            });
        });
    }

    // Обработка поиска
    handleSearch(query) {
        if (query.length < 2) {
            this.showHomeScreen();
            return;
        }

        const results = DataService.searchProducts(query);
        this.showSearchResults(results, query);
    }

    // Показ результатов поиска
    showSearchResults(results, query) {
        const mainContent = document.getElementById('main-content');
        const searchResultsHTML = `
            <div class="screen active">
                <div class="search-results-header">
                    <h2>Результаты поиска</h2>
                    <p>Найдено ${results.length} товаров по запросу "${query}"</p>
                </div>
                <div class="search-results-grid">
                    ${results.map(product => this.createProductCard(product)).join('')}
                </div>
                ${results.length === 0 ? `
                    <div class="no-results">
                        <i class="icon-search"></i>
                        <h3>Ничего не найдено</h3>
                        <p>Попробуйте изменить запрос</p>
                    </div>
                ` : ''}
            </div>
        `;
        
        mainContent.innerHTML = searchResultsHTML;
        this.setupCartEventListeners();
    }

    // Показ экрана корзины
    showCart() {
        this.showScreen('cart-screen');
        this.updateCartDisplay();
        telegramAPI.showMainButton('Оформить заказ', () => {
            this.showCheckout();
        });
    }

    // Показ экрана профиля
    showProfile() {
        this.showScreen('profile-screen');
        this.loadUserProfile();
        telegramAPI.hideMainButton();
    }

    // Показ экрана оформления заказа
    showCheckout() {
        this.showScreen('checkout-screen');
        this.loadCheckoutForm();
        telegramAPI.showMainButton('Подтвердить заказ', () => {
            this.processOrder();
        });
    }

    // Показ экрана истории заказов
    showOrderHistory() {
        this.showScreen('orders-screen');
        this.loadOrderHistory();
        telegramAPI.hideMainButton();
    }

    // Показ главного экрана
    showHomeScreen() {
        this.showScreen('home-screen');
        this.loadCategories();
        telegramAPI.hideMainButton();
    }

    // Показ экрана категории
    showCategory(categoryId) {
        this.showScreen('category-screen');
        this.loadCategoryProducts(categoryId);
        telegramAPI.hideMainButton();
    }

    // Показ экрана товара
    showProduct(productId) {
        this.showScreen('product-screen');
        this.loadProductDetails(productId);
        telegramAPI.showMainButton('Добавить в корзину', () => {
            this.addToCart(productId);
        });
    }

    // Переключение экранов
    showScreen(screenId) {
        // Скрываем все экраны
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Показываем нужный экран
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }

    // Загрузка категорий
    loadCategories() {
        const categoriesContainer = document.getElementById('categories-grid');
        if (categoriesContainer) {
            const categories = DataService.getCategories();
            categoriesContainer.innerHTML = categories.map(category => 
                this.createCategoryCard(category)
            ).join('');
            
            // Добавляем обработчики для карточек категорий
            document.querySelectorAll('.category-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    const categoryId = e.currentTarget.dataset.categoryId;
                    this.showCategory(categoryId);
                });
            });
        }
    }

    // Загрузка товаров категории
    loadCategoryProducts(categoryId) {
        const productsContainer = document.getElementById('category-products');
        if (productsContainer) {
            const products = DataService.getProductsByCategory(categoryId);
            const category = DataService.getCategory(categoryId);
            
            // Обновляем заголовок
            const categoryTitle = document.getElementById('category-title');
            if (categoryTitle) {
                categoryTitle.textContent = category.name;
            }
            
            productsContainer.innerHTML = products.map(product => 
                this.createProductCard(product)
            ).join('');
            
            this.setupCartEventListeners();
            
            // Добавляем обработчики для карточек товаров
            document.querySelectorAll('.product-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    if (!e.target.closest('.btn-add-to-cart')) {
                        const productId = e.currentTarget.dataset.productId;
                        this.showProduct(productId);
                    }
                });
            });
        }
    }

    // Загрузка деталей товара
    loadProductDetails(productId) {
        const product = DataService.getProduct(productId);
        if (!product) return;

        const productContainer = document.getElementById('product-details');
        if (productContainer) {
            productContainer.innerHTML = `
                <div class="product-detail-image">
                    <div class="product-placeholder large">
                        <i class="icon-${product.icon}"></i>
                    </div>
                </div>
                <div class="product-detail-info">
                    <h2>${product.name}</h2>
                    <p class="product-detail-description">${product.description}</p>
                    <div class="product-detail-meta">
                        <div class="meta-item">
                            <span class="meta-label">Бренд:</span>
                            <span class="meta-value">${product.brand}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Артикул:</span>
                            <span class="meta-value">${product.sku}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Наличие:</span>
                            <span class="meta-value ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                                ${product.inStock ? 'В наличии' : 'Нет в наличии'}
                            </span>
                        </div>
                    </div>
                    <div class="product-detail-price">
                        <span class="price">${product.price.toLocaleString()} ₽</span>
                        ${product.oldPrice ? `<span class="old-price">${product.oldPrice.toLocaleString()} ₽</span>` : ''}
                    </div>
                    <div class="product-detail-actions">
                        <button class="btn-add-to-cart-large" data-product-id="${product.id}">
                            <i class="icon-cart-plus"></i>
                            Добавить в корзину
                        </button>
                    </div>
                </div>
            `;
            
            // Добавляем обработчик для кнопки добавления в корзину
            const addToCartBtn = productContainer.querySelector('.btn-add-to-cart-large');
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', () => {
                    this.addToCart(productId);
                });
            }
        }
    }

    // Загрузка профиля пользователя
    loadUserProfile() {
        const profileContainer = document.getElementById('profile-content');
        if (profileContainer) {
            const userProfile = DataService.getUserProfile();
            const favorites = this.getFavorites();
            
            profileContainer.innerHTML = `
                <div class="profile-header">
                    <div class="profile-avatar">
                        <i class="icon-user"></i>
                    </div>
                    <div class="profile-info">
                        <h2>${userProfile.name}</h2>
                        <p>${userProfile.email}</p>
                        <p>${userProfile.phone}</p>
                    </div>
                </div>
                <div class="profile-stats">
                    <div class="stat-item">
                        <span class="stat-number">${userProfile.totalOrders}</span>
                        <span class="stat-label">Заказов</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${userProfile.totalSpent.toLocaleString()} ₽</span>
                        <span class="stat-label">Потрачено</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${favorites.length}</span>
                        <span class="stat-label">Избранное</span>
                    </div>
                </div>
                <div class="profile-actions">
                    <button class="btn-profile-action" id="btn-order-history">
                        <i class="icon-history"></i>
                        История заказов
                    </button>
                    <button class="btn-profile-action" id="btn-favorites">
                        <i class="icon-heart"></i>
                        Избранные товары
                    </button>
                    <button class="btn-profile-action" id="btn-settings">
                        <i class="icon-settings"></i>
                        Настройки
                    </button>
                    <button class="btn-profile-action" id="btn-edit-profile">
                        <i class="icon-edit"></i>
                        Редактировать профиль
                    </button>
                </div>
            `;
            
            // Добавляем обработчики
            document.getElementById('btn-order-history').addEventListener('click', () => {
                this.showOrderHistory();
            });
            
            document.getElementById('btn-favorites').addEventListener('click', () => {
                this.showFavorites();
            });
            
            document.getElementById('btn-settings').addEventListener('click', () => {
                this.showSettings();
            });
            
            document.getElementById('btn-edit-profile').addEventListener('click', () => {
                this.showEditProfile();
            });
        }
    }

    // Загрузка истории заказов
    loadOrderHistory() {
        const ordersContainer = document.getElementById('orders-list');
        if (ordersContainer) {
            const orders = DataService.getOrderHistory();
            ordersContainer.innerHTML = orders.map(order => 
                this.createOrderHistoryItem(order)
            ).join('');
            
            // Добавляем обработчики для кнопок деталей заказа
            document.querySelectorAll('.btn-order-details').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const orderId = e.currentTarget.dataset.orderId;
                    this.showOrderDetails(orderId);
                });
            });

            // Добавляем обработчики для кнопок повторения заказа
            document.querySelectorAll('.btn-repeat-order').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const orderId = e.currentTarget.dataset.orderId;
                    this.repeatOrder(orderId);
                });
            });
        }
    }

    // Загрузка формы оформления заказа
    loadCheckoutForm() {
        const checkoutContainer = document.getElementById('checkout-form');
        if (checkoutContainer) {
            const userProfile = DataService.getUserProfile();
            checkoutContainer.innerHTML = `
                <div class="checkout-section">
                    <h3>Данные получателя</h3>
                    <div class="form-group">
                        <label for="checkout-name">Имя и фамилия</label>
                        <input type="text" id="checkout-name" value="${userProfile.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="checkout-phone">Телефон</label>
                        <input type="tel" id="checkout-phone" value="${userProfile.phone}" required>
                    </div>
                    <div class="form-group">
                        <label for="checkout-email">Email</label>
                        <input type="email" id="checkout-email" value="${userProfile.email}" required>
                    </div>
                </div>
                <div class="checkout-section">
                    <h3>Адрес доставки</h3>
                    <div class="form-group">
                        <label for="checkout-address">Адрес</label>
                        <textarea id="checkout-address" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="checkout-comment">Комментарий к заказу</label>
                        <textarea id="checkout-comment"></textarea>
                    </div>
                </div>
                <div class="checkout-summary">
                    <h3>Итого к оплате</h3>
                    <div class="summary-item">
                        <span>Товары (${this.cart.length}):</span>
                        <span>${this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()} ₽</span>
                    </div>
                    <div class="summary-item">
                        <span>Доставка:</span>
                        <span>Бесплатно</span>
                    </div>
                    <div class="summary-total">
                        <span>Итого:</span>
                        <span>${this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()} ₽</span>
                    </div>
                </div>
            `;
        }
    }

    // Обработка заказа
    processOrder() {
        const name = document.getElementById('checkout-name')?.value;
        const phone = document.getElementById('checkout-phone')?.value;
        const email = document.getElementById('checkout-email')?.value;
        const address = document.getElementById('checkout-address')?.value;
        const comment = document.getElementById('checkout-comment')?.value;

        if (!name || !phone || !email || !address) {
            this.showNotification('Пожалуйста, заполните все обязательные поля', 'error');
            return;
        }

        const orderData = {
            items: this.cart,
            customer: { name, phone, email, address, comment },
            total: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            date: new Date().toISOString()
        };

        const order = DataService.createOrder(orderData);
        
        // Очищаем корзину
        this.cart = [];
        this.saveCartToStorage();
        this.updateCartBadge();
        
        // Показываем успешное сообщение
        this.showSuccessModal(order);
    }

    // Показ модального окна успеха
    showSuccessModal(order) {
        const modal = document.getElementById('success-modal');
        const modalContent = modal.querySelector('.modal-content');
        
        modalContent.innerHTML = `
            <div class="success-icon">
                <i class="icon-check"></i>
            </div>
            <h2>Заказ оформлен!</h2>
            <p>Ваш заказ #${order.id} успешно создан</p>
            <div class="order-summary">
                <p>Сумма: ${order.total.toLocaleString()} ₽</p>
                <p>Ожидаемая доставка: 2-3 дня</p>
            </div>
            <button class="btn-primary" onclick="uiComponents.closeSuccessModal()">
                Вернуться в магазин
            </button>
        `;
        
        modal.style.display = 'flex';
    }

    // Закрытие модального окна успеха
    closeSuccessModal() {
        const modal = document.getElementById('success-modal');
        modal.style.display = 'none';
        this.showHomeScreen();
    }

    // Показ уведомления
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="icon-${type === 'success' ? 'check' : 'alert'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Автоматическое скрытие
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Показ деталей заказа
    showOrderDetails(orderId) {
        const order = DataService.getOrder(orderId);
        if (!order) return;

        telegramAPI.showPopup(
            `Заказ #${order.id}`,
            `Дата: ${new Date(order.date).toLocaleDateString('ru-RU')}\nСтатус: ${this.getOrderStatusText(order.status)}\nСумма: ${order.total.toLocaleString()} ₽`,
            [{ type: 'ok', text: 'Закрыть' }]
        );
    }

    // Работа с избранными товарами
    getFavorites() {
        const favorites = localStorage.getItem('favorites');
        return favorites ? JSON.parse(favorites) : [];
    }

    addToFavorites(productId) {
        const favorites = this.getFavorites();
        if (!favorites.includes(productId)) {
            favorites.push(productId);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            this.showNotification('Товар добавлен в избранное');
        }
    }

    removeFromFavorites(productId) {
        const favorites = this.getFavorites();
        const updatedFavorites = favorites.filter(id => id !== productId);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        this.showNotification('Товар удален из избранного');
    }

    isInFavorites(productId) {
        const favorites = this.getFavorites();
        return favorites.includes(productId);
    }

    // Показ избранных товаров
    showFavorites() {
        const favorites = this.getFavorites();
        const products = favorites.map(id => DataService.getProduct(id)).filter(Boolean);
        
        const contentContainer = document.getElementById('main-content');
        if (contentContainer) {
            contentContainer.innerHTML = `
                <div class="screen-header">
                    <h2>Избранные товары</h2>
                    <p>${products.length} товаров в избранном</p>
                </div>
                <div class="products-grid">
                    ${products.map(product => this.createProductCard(product)).join('')}
                </div>
            `;
            
            // Добавляем обработчики для кнопок избранного
            document.querySelectorAll('.btn-favorite').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = e.currentTarget.dataset.productId;
                    this.removeFromFavorites(productId);
                    this.showFavorites(); // Обновляем список
                });
            });
        }
    }

    // Показ настроек приложения
    showSettings() {
        const contentContainer = document.getElementById('main-content');
        if (contentContainer) {
            const settings = this.getSettings();
            
            contentContainer.innerHTML = `
                <div class="screen-header">
                    <h2>Настройки</h2>
                </div>
                <div class="settings-container">
                    <div class="setting-group">
                        <h3>Уведомления</h3>
                        <div class="setting-item">
                            <label>
                                <input type="checkbox" id="notify-orders" ${settings.notifyOrders ? 'checked' : ''}>
                                Уведомления о заказах
                            </label>
                        </div>
                        <div class="setting-item">
                            <label>
                                <input type="checkbox" id="notify-promo" ${settings.notifyPromo ? 'checked' : ''}>
                                Промо-акции и скидки
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
                        <div class="setting-item">
                            <button class="btn-danger" id="btn-clear-data">Очистить все данные</button>
                        </div>
                        <div class="setting-item">
                            <button class="btn-secondary" id="btn-export-data">Экспорт данных</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Добавляем обработчики
            this.setupSettingsEventListeners();
        }
    }

    // Получение настроек
    getSettings() {
        const settings = localStorage.getItem('app-settings');
        return settings ? JSON.parse(settings) : {
            notifyOrders: true,
            notifyPromo: false,
            darkMode: true,
            animations: true
        };
    }

    // Сохранение настроек
    saveSettings(settings) {
        localStorage.setItem('app-settings', JSON.stringify(settings));
    }

    // Настройка обработчиков событий настроек
    setupSettingsEventListeners() {
        // Чекбоксы настроек
        document.querySelectorAll('.setting-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const settings = this.getSettings();
                settings[checkbox.id] = checkbox.checked;
                this.saveSettings(settings);
                this.showNotification('Настройки сохранены');
            });
        });

        // Кнопка очистки данных
        document.getElementById('btn-clear-data').addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите очистить все данные? Это действие нельзя отменить.')) {
                localStorage.clear();
                this.cart = [];
                this.showNotification('Все данные очищены');
                location.reload();
            }
        });

        // Кнопка экспорта данных
        document.getElementById('btn-export-data').addEventListener('click', () => {
            const data = {
                cart: this.cart,
                favorites: this.getFavorites(),
                settings: this.getSettings(),
                profile: DataService.getUserProfile()
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'autoparts-data.json';
            a.click();
            URL.revokeObjectURL(url);
            
            this.showNotification('Данные экспортированы');
        });
    }

    // Показ формы редактирования профиля
    showEditProfile() {
        const userProfile = DataService.getUserProfile();
        const contentContainer = document.getElementById('main-content');
        
        if (contentContainer) {
            contentContainer.innerHTML = `
                <div class="screen-header">
                    <h2>Редактировать профиль</h2>
                </div>
                <div class="edit-profile-form">
                    <div class="form-group">
                        <label for="edit-name">Имя и фамилия</label>
                        <input type="text" id="edit-name" value="${userProfile.name}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-email">Email</label>
                        <input type="email" id="edit-email" value="${userProfile.email}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-phone">Телефон</label>
                        <input type="tel" id="edit-phone" value="${userProfile.phone}" required>
                    </div>
                    <div class="form-group">
                        <label for="edit-address">Адрес по умолчанию</label>
                        <textarea id="edit-address">${userProfile.address || ''}</textarea>
                    </div>
                    <div class="form-actions">
                        <button class="btn-primary" id="btn-save-profile">Сохранить</button>
                        <button class="btn-secondary" id="btn-cancel-edit">Отмена</button>
                    </div>
                </div>
            `;
            
            // Добавляем обработчики
            document.getElementById('btn-save-profile').addEventListener('click', () => {
                this.saveProfile();
            });
            
            document.getElementById('btn-cancel-edit').addEventListener('click', () => {
                this.loadUserProfile();
            });
        }
    }

    // Сохранение профиля
    saveProfile() {
        const name = document.getElementById('edit-name').value.trim();
        const email = document.getElementById('edit-email').value.trim();
        const phone = document.getElementById('edit-phone').value.trim();
        const address = document.getElementById('edit-address').value.trim();
        
        if (!name || !email || !phone) {
            this.showNotification('Заполните все обязательные поля', 'error');
            return;
        }
        
        // В реальном приложении здесь был бы запрос к серверу
        // Для демо просто показываем уведомление
        this.showNotification('Профиль обновлен');
        this.loadUserProfile();
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
}

// Создание глобального экземпляра
const uiComponents = new UIComponents();

// Экспорт для использования в других модулях
window.uiComponents = uiComponents; 