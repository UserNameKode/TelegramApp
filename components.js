// Класс для управления UI компонентами
class UIComponents {
    constructor() {
        this.currentScreen = 'home';
        this.init();
    }

    init() {
        try {
            // Инициализируем обработчики событий
            this.setupEventListeners();
            
            // Показываем домашний экран
            this.showHome();
            
            console.log('UI компоненты инициализированы');
        } catch (error) {
            console.error('Ошибка инициализации UI компонентов:', error);
            throw error;
        }
    }

    setupEventListeners() {
        // Навигация
        document.querySelectorAll('[data-screen]').forEach(button => {
            button.addEventListener('click', (e) => {
                const screen = e.currentTarget.dataset.screen;
                this.showScreen(screen);
            });
        });

        // Кнопка "Назад"
        document.querySelector('.btn-back').addEventListener('click', () => {
            this.handleBackButton();
        });

        // Корзина
        document.getElementById('cart-btn').addEventListener('click', () => {
            this.showCart();
        });

        // Профиль
        document.getElementById('profile-btn').addEventListener('click', () => {
            this.showProfile();
        });
    }

    // Методы для работы с экранами
    showScreen(screenName) {
        // Скрываем все экраны
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Показываем нужный экран
        const screen = document.getElementById(`${screenName}-screen`);
        if (screen) {
            screen.classList.add('active');
            this.currentScreen = screenName;
            this.updateActiveNavButton(screenName);
        }
    }

    handleBackButton() {
        switch (this.currentScreen) {
            case 'home':
                window.telegramAPI.closeApp();
                break;
            case 'category':
                this.showHome();
                break;
            case 'product':
                this.showCategory(this.lastCategoryId);
                break;
            default:
                this.showHome();
        }
    }

    updateActiveNavButton(screenName) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        const button = document.querySelector(`[data-screen="${screenName}"]`);
        if (button) {
            button.classList.add('active');
        }
    }

    // Методы для работы с домашним экраном
    showHome() {
        this.showScreen('home');
        this.renderCategories();
        this.renderFeaturedProducts();
    }

    renderCategories() {
        const categoriesGrid = document.querySelector('.categories-grid');
        const categories = window.DataService.getCategories();

        categoriesGrid.innerHTML = categories.map(category => `
            <div class="category-card" data-category-id="${category.id}">
                <img src="${category.image}" alt="${category.title}" class="category-image">
                <div class="category-content">
                    <h3 class="category-title">${category.title}</h3>
                    <span class="category-count">${category.count} товаров</span>
                </div>
            </div>
        `).join('');

        // Добавляем обработчики
        categoriesGrid.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const categoryId = card.dataset.categoryId;
                this.showCategory(categoryId);
            });
        });
    }

    renderFeaturedProducts() {
        const productsGrid = document.querySelector('.products-grid');
        const products = window.DataService.getProducts().slice(0, 4); // Показываем только 4 товара

        productsGrid.innerHTML = products.map(product => this.createProductCard(product)).join('');

        // Добавляем обработчики
        this.setupProductEventListeners(productsGrid);
    }

    // Методы для работы с категориями
    showCategory(categoryId) {
        this.lastCategoryId = categoryId;
        this.showScreen('category');
        
        const category = window.DataService.getCategoryById(categoryId);
        const categoryHeader = document.querySelector('.category-header');
        categoryHeader.innerHTML = `
            <h2 class="category-title">${category.title}</h2>
            <p class="category-description">Все товары в категории</p>
        `;

        this.renderCategoryProducts(categoryId);
    }

    renderCategoryProducts(categoryId) {
        const productsGrid = document.querySelector('.products-grid');
        const products = window.DataService.getProductsByCategory(categoryId);

        productsGrid.innerHTML = products.map(product => this.createProductCard(product)).join('');

        // Добавляем обработчики
        this.setupProductEventListeners(productsGrid);
    }

    // Методы для работы с товарами
    createProductCard(product) {
        return `
            <div class="product-card" data-product-id="${product.id}">
                <img src="${product.image}" alt="${product.title}" class="product-image">
                <div class="product-content">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-price">${product.price} ₽</div>
                    <p class="product-description">${product.description}</p>
                    <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                        В корзину
                    </button>
                </div>
            </div>
        `;
    }

    setupProductEventListeners(container) {
        // Клик по карточке товара
        container.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('add-to-cart')) {
                    const productId = card.dataset.productId;
                    this.showProduct(productId);
                }
            });
        });

        // Клик по кнопке "В корзину"
        container.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = button.dataset.productId;
                this.addToCart(productId);
            });
        });
    }

    showProduct(productId) {
        this.showScreen('product');
        const product = window.DataService.getProductById(productId);
        const productDetail = document.querySelector('.product-detail');

        productDetail.innerHTML = `
            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-detail-content">
                <h2 class="product-detail-title">${product.title}</h2>
                <div class="product-detail-price">${product.price} ₽</div>
                <p class="product-detail-description">${product.description}</p>
                <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                    Добавить в корзину
                </button>
            </div>
        `;

        // Добавляем обработчик
        productDetail.querySelector('.add-to-cart').addEventListener('click', () => {
            this.addToCart(productId);
        });
    }

    // Методы для работы с корзиной
    addToCart(productId) {
        window.DataService.addToCart(productId);
        this.updateCartBadge();
        this.showNotification('Товар добавлен в корзину', 'success');
    }

    updateCartBadge() {
        const cart = window.DataService.getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cart-badge').textContent = totalItems;
    }

    showCart() {
        this.showScreen('cart');
        const cart = window.DataService.getCart();
        const cartItems = document.querySelector('.cart-items');
        const cartSummary = document.querySelector('.cart-summary');

        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <h3>Корзина пуста</h3>
                    <p>Добавьте товары из каталога</p>
                </div>
            `;
            cartSummary.innerHTML = '';
            return;
        }

        let total = 0;
        cartItems.innerHTML = cart.map(item => {
            const product = window.DataService.getProductById(item.productId);
            total += product.price * item.quantity;
            return `
                <div class="cart-item" data-product-id="${product.id}">
                    <img src="${product.image}" alt="${product.title}" class="cart-item-image">
                    <div class="cart-item-content">
                        <h3 class="cart-item-title">${product.title}</h3>
                        <div class="cart-item-price">${product.price} ₽</div>
                        <div class="cart-item-quantity">
                            <button class="btn-quantity minus">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="btn-quantity plus">+</button>
                        </div>
                    </div>
                    <button class="btn-remove">×</button>
                </div>
            `;
        }).join('');

        cartSummary.innerHTML = `
            <div class="cart-total">
                <span>Итого:</span>
                <span class="total-price">${total} ₽</span>
            </div>
            <button class="btn btn-primary checkout-btn">Оформить заказ</button>
        `;

        // Добавляем обработчики
        this.setupCartEventListeners();
    }

    setupCartEventListeners() {
        // Изменение количества
        document.querySelectorAll('.btn-quantity').forEach(button => {
            button.addEventListener('click', (e) => {
                const item = e.target.closest('.cart-item');
                const productId = item.dataset.productId;
                const quantity = parseInt(item.querySelector('.quantity').textContent);
                
                if (e.target.classList.contains('plus')) {
                    this.updateQuantity(productId, quantity + 1);
                } else {
                    if (quantity > 1) {
                        this.updateQuantity(productId, quantity - 1);
                    }
                }
            });
        });

        // Удаление товара
        document.querySelectorAll('.btn-remove').forEach(button => {
            button.addEventListener('click', (e) => {
                const item = e.target.closest('.cart-item');
                const productId = item.dataset.productId;
                this.removeFromCart(productId);
            });
        });

        // Оформление заказа
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.showCheckout();
            });
        }
    }

    updateQuantity(productId, quantity) {
        window.DataService.updateCartItemQuantity(productId, quantity);
        this.showCart(); // Перерисовываем корзину
    }

    removeFromCart(productId) {
        window.DataService.removeFromCart(productId);
        this.updateCartBadge();
        this.showCart(); // Перерисовываем корзину
    }

    // Методы для работы с заказом
    showCheckout() {
        this.showScreen('checkout');
        window.telegramAPI.showMainButton();
        window.telegramAPI.setMainButtonText('Подтвердить заказ');
        window.telegramAPI.setMainButtonCallback(() => {
            this.submitOrder();
        });
    }

    submitOrder() {
        const form = document.getElementById('checkout-form');
        const formData = new FormData(form);
        const orderData = {
            items: window.DataService.getCart(),
            customer: {
                name: formData.get('name'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                comment: formData.get('comment')
            }
        };

        const order = window.DataService.createOrder(orderData);
        this.showOrderSuccess(order);
    }

    showOrderSuccess(order) {
        const modal = document.getElementById('modal');
        modal.classList.add('active');

        document.getElementById('modal-close').addEventListener('click', () => {
            modal.classList.remove('active');
            this.showHome();
        });
    }

    // Вспомогательные методы
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Создаем глобальный экземпляр компонентов
window.UIComponents = UIComponents;