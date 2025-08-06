class AutoPartsApp {
    constructor() {
        this.currentScreen = 'home';
        this.navigationHistory = [];
        this.init();
    }

    async init() {
        try {
            window.logInitialization('AutoPartsApp.init: Начало инициализации');
            
            // Инициализируем компоненты
            await this.initializeModules();
            
            // Настраиваем обработчики событий
            this.setupEventHandlers();
            
            // Показываем начальный экран
            this.showScreen('home');
            
            // Скрываем экран загрузки
            this.hideLoadingScreen();
            
            window.logInitialization('AutoPartsApp.init: Инициализация завершена');
        } catch (error) {
            console.error('Ошибка при инициализации приложения:', error);
            this.handleError(error);
        }
    }

    async initializeModules() {
        window.logInitialization('AutoPartsApp.initializeModules: Начало инициализации модулей');
        
        // Инициализируем навигацию
        this.setupNavigation();
        
        // Отрисовываем категории
        this.renderCategories();
        
        // Отрисовываем товары
        this.renderProducts();
        
        window.logInitialization('AutoPartsApp.initializeModules: Модули инициализированы');
    }

    setupEventHandlers() {
        // Обработчики навигации
        document.querySelectorAll('[data-screen]').forEach(button => {
            button.addEventListener('click', (e) => {
                const screen = e.currentTarget.dataset.screen;
                this.showScreen(screen);
            });
        });

        // Обработчики добавления в корзину
        document.querySelectorAll('.btn-add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.productId;
                const product = window.DataService.getProduct(productId);
                if (product) {
                    window.cart.addItem(product);
                }
            });
        });

        // Обработка ошибок
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
    }

    setupNavigation() {
        const backButton = document.querySelector('.btn-back');
        if (backButton) {
            backButton.addEventListener('click', () => this.goBack());
        }
    }

    showScreen(screenId) {
        window.logInitialization(`AutoPartsApp.showScreen: Переключение на экран ${screenId}`);
        
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.style.display = screen.id === `${screenId}-screen` ? 'block' : 'none';
        });

        // Обновляем историю навигации
        if (this.currentScreen !== screenId) {
            this.navigationHistory.push(this.currentScreen);
            this.currentScreen = screenId;
        }

        // Обновляем видимость кнопки "Назад"
        const backButton = document.querySelector('.btn-back');
        if (backButton) {
            backButton.style.display = this.navigationHistory.length > 0 ? 'block' : 'none';
        }

        // Обновляем контент если нужно
        if (screenId === 'home') {
            this.renderProducts();
        }
    }

    goBack() {
        if (this.navigationHistory.length > 0) {
            const previousScreen = this.navigationHistory.pop();
            this.currentScreen = previousScreen;
            this.showScreen(previousScreen);
        }
    }

    renderCategories() {
        const categoriesContainer = document.querySelector('.categories');
        if (!categoriesContainer) return;

        const categories = window.DataService.getCategories();
        categoriesContainer.innerHTML = categories.map(category => `
            <div class="category-card" data-category="${category.id}">
                <span class="category-icon">${category.icon}</span>
                <h3>${category.title}</h3>
            </div>
        `).join('');

        // Добавляем обработчики
        categoriesContainer.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const categoryId = card.dataset.category;
                this.renderProducts(categoryId);
            });
        });
    }

    renderProducts(categoryId = null) {
        const productsContainer = document.querySelector('.products');
        if (!productsContainer) return;

        const products = window.DataService.getProducts(categoryId);
        
        if (products.length === 0) {
            productsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <h3>Товары не найдены</h3>
                    <p>Попробуйте выбрать другую категорию</p>
                </div>
            `;
            return;
        }

        productsContainer.innerHTML = products.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-article">Артикул: ${product.article}</p>
                    <p class="product-manufacturer">Производитель: ${product.manufacturer}</p>
                    <div class="product-footer">
                        <span class="product-price">${product.price} ₽</span>
                        <button class="btn btn-primary btn-add-to-cart" data-product-id="${product.id}">
                            В корзину
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Обновляем обработчики добавления в корзину
        this.setupEventHandlers();
    }

    hideLoadingScreen() {
        window.logInitialization('AutoPartsApp.hideLoadingScreen: Начало скрытия экрана загрузки');
        
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        if (!loadingScreen || !app) {
            window.logInitialization('AutoPartsApp.hideLoadingScreen: Не найдены необходимые элементы');
            return;
        }

        // Устанавливаем начальное состояние
        loadingScreen.style.opacity = '1';
        app.style.opacity = '0';
        app.style.display = 'block';

        // Запускаем анимацию
        requestAnimationFrame(() => {
            loadingScreen.style.transition = 'opacity 0.8s ease-out';
            app.style.transition = 'opacity 0.8s ease-out';

            loadingScreen.style.opacity = '0';
            app.style.opacity = '1';

            setTimeout(() => {
                loadingScreen.style.display = 'none';
                window.logInitialization('AutoPartsApp.hideLoadingScreen: Экран загрузки скрыт');
            }, 800);
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }, 100);
    }

    showLoading() {
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Загрузка...</p>
        `;
        document.body.appendChild(loading);
    }

    hideLoading() {
        const loading = document.querySelector('.loading-overlay');
        if (loading) {
            loading.remove();
        }
    }

    handleError(error) {
        console.error('Ошибка в приложении:', error);
        this.showNotification(
            'Произошла ошибка. Пожалуйста, попробуйте позже.',
            'error'
        );
    }

    handleUnhandledRejection(event) {
        console.error('Необработанная ошибка Promise:', event.reason);
        this.handleError(event.reason);
    }
}

// Создаем глобальный экземпляр приложения
window.app = new AutoPartsApp();