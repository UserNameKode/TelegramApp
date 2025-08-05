// Главный файл приложения Telegram MiniApp
class AutoPartsApp {
    constructor() {
        this.currentScreen = 'home';
        this.isLoading = true;
        this.init();
    }

    // Инициализация приложения
    init() {
        console.log('Инициализация Telegram MiniApp "АвтоЗапчасти"');
        
        // Ждем загрузки DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupApp();
            });
        } else {
            this.setupApp();
        }
    }

    // Настройка приложения
    setupApp() {
        // Инициализируем компоненты
        this.initializeComponents();
        
        // Настраиваем обработчики событий
        this.setupEventHandlers();
        
        // Запускаем экран загрузки
        this.startLoadingScreen();
    }

    // Инициализация компонентов
    initializeComponents() {
        // Обновляем бейдж корзины
        uiComponents.updateCartBadge();
        
        // Загружаем категории на главный экран
        uiComponents.loadCategories();
        
        console.log('Компоненты инициализированы');
    }

    // Настройка обработчиков событий
    setupEventHandlers() {
        // Обработка навигации
        this.setupNavigation();
        
        // Обработка поиска
        this.setupSearch();
        
        // Обработка кнопок Telegram
        this.setupTelegramButtons();
        
        // Обработка переходов между экранами
        this.setupScreenTransitions();
    }

    // Настройка навигации
    setupNavigation() {
        // Кнопка "Назад" в навигации
        const backButton = document.getElementById('nav-back');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.handleBackNavigation();
            });
        }

        // Кнопка "Домой" в навигации
        const homeButton = document.getElementById('nav-home');
        if (homeButton) {
            homeButton.addEventListener('click', () => {
                this.navigateToHome();
            });
        }

        // Обработка кнопки "Назад" Telegram
        telegramAPI.tg.BackButton.onClick(() => {
            this.handleBackNavigation();
        });
    }

    // Настройка поиска
    setupSearch() {
        const searchToggle = document.getElementById('search-toggle');
        const searchBar = document.getElementById('search-bar');
        const searchInput = document.getElementById('search-input');
        const searchClose = document.getElementById('search-close');

        if (searchToggle) {
            searchToggle.addEventListener('click', () => {
                this.toggleSearch();
            });
        }

        if (searchClose) {
            searchClose.addEventListener('click', () => {
                this.closeSearch();
            });
        }

        // Обработка поиска при вводе
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    uiComponents.handleSearch(e.target.value);
                }, 300);
            });
        }
    }

    // Настройка кнопок Telegram
    setupTelegramButtons() {
        // Главная кнопка
        telegramAPI.tg.MainButton.onClick(() => {
            this.handleMainButtonClick();
        });
    }

    // Настройка переходов между экранами
    setupScreenTransitions() {
        // Обработка кликов по карточкам категорий
        document.addEventListener('click', (e) => {
            const categoryCard = e.target.closest('.category-card');
            if (categoryCard) {
                const categoryId = categoryCard.dataset.categoryId;
                this.navigateToCategory(categoryId);
                return;
            }

            const productCard = e.target.closest('.product-card');
            if (productCard && !e.target.closest('.btn-add-to-cart')) {
                const productId = productCard.dataset.productId;
                this.navigateToProduct(productId);
                return;
            }
        });
    }

    // Запуск экрана загрузки
    startLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const appContainer = document.getElementById('app');

        if (loadingScreen && appContainer) {
            // Показываем экран загрузки
            loadingScreen.style.display = 'flex';
            appContainer.style.display = 'none';

            // Симулируем загрузку данных
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 3000); // 3 секунды для демонстрации анимации
        }
    }

    // Скрытие экрана загрузки
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const appContainer = document.getElementById('app');

        if (loadingScreen && appContainer) {
            // Анимация исчезновения экрана загрузки
            loadingScreen.style.opacity = '0';
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                appContainer.style.display = 'block';
                
                // Анимация появления основного приложения
                setTimeout(() => {
                    appContainer.style.opacity = '1';
                    this.isLoading = false;
                    this.navigateToHome();
                }, 100);
            }, 500);
        }
    }

    // Переключение поиска
    toggleSearch() {
        const searchBar = document.getElementById('search-bar');
        const searchInput = document.getElementById('search-input');
        
        if (searchBar) {
            if (searchBar.style.display === 'none' || !searchBar.style.display) {
                searchBar.style.display = 'flex';
                setTimeout(() => {
                    searchBar.classList.add('active');
                    if (searchInput) {
                        searchInput.focus();
                    }
                }, 10);
            } else {
                this.closeSearch();
            }
        }
    }

    // Закрытие поиска
    closeSearch() {
        const searchBar = document.getElementById('search-bar');
        const searchInput = document.getElementById('search-input');
        
        if (searchBar) {
            searchBar.classList.remove('active');
            setTimeout(() => {
                searchBar.style.display = 'none';
                if (searchInput) {
                    searchInput.value = '';
                }
                uiComponents.showHomeScreen();
            }, 300);
        }
    }

    // Обработка навигации "Назад"
    handleBackNavigation() {
        switch (this.currentScreen) {
            case 'category':
                this.navigateToHome();
                break;
            case 'product':
                this.navigateToCategory(this.lastCategoryId);
                break;
            case 'cart':
                this.navigateToHome();
                break;
            case 'checkout':
                this.navigateToCart();
                break;
            case 'profile':
                this.navigateToHome();
                break;
            case 'orders':
                this.navigateToProfile();
                break;
            default:
                this.navigateToHome();
        }
    }

    // Обработка клика по главной кнопке
    handleMainButtonClick() {
        switch (this.currentScreen) {
            case 'product':
                const productId = this.getCurrentProductId();
                if (productId) {
                    uiComponents.addToCart(productId);
                }
                break;
            case 'cart':
                this.navigateToCheckout();
                break;
            case 'checkout':
                uiComponents.processOrder();
                break;
        }
    }

    // Навигация на главный экран
    navigateToHome() {
        this.currentScreen = 'home';
        uiComponents.showHomeScreen();
        telegramAPI.hideMainButton();
        telegramAPI.hideBackButton();
        this.updateNavigation();
    }

    // Навигация к категории
    navigateToCategory(categoryId) {
        this.currentScreen = 'category';
        this.lastCategoryId = categoryId;
        uiComponents.showCategory(categoryId);
        telegramAPI.hideMainButton();
        telegramAPI.showBackButton();
        this.updateNavigation();
    }

    // Навигация к товару
    navigateToProduct(productId) {
        this.currentScreen = 'product';
        this.currentProductId = productId;
        uiComponents.showProduct(productId);
        telegramAPI.showMainButton('Добавить в корзину');
        telegramAPI.showBackButton();
        this.updateNavigation();
    }

    // Навигация к корзине
    navigateToCart() {
        this.currentScreen = 'cart';
        uiComponents.showCart();
        telegramAPI.showMainButton('Оформить заказ');
        telegramAPI.showBackButton();
        this.updateNavigation();
    }

    // Навигация к оформлению заказа
    navigateToCheckout() {
        this.currentScreen = 'checkout';
        uiComponents.showCheckout();
        telegramAPI.showMainButton('Подтвердить заказ');
        telegramAPI.showBackButton();
        this.updateNavigation();
    }

    // Навигация к профилю
    navigateToProfile() {
        this.currentScreen = 'profile';
        uiComponents.showProfile();
        telegramAPI.hideMainButton();
        telegramAPI.showBackButton();
        this.updateNavigation();
    }

    // Навигация к истории заказов
    navigateToOrders() {
        this.currentScreen = 'orders';
        uiComponents.showOrderHistory();
        telegramAPI.hideMainButton();
        telegramAPI.showBackButton();
        this.updateNavigation();
    }

    // Обновление навигации
    updateNavigation() {
        const navBack = document.getElementById('nav-back');
        const navHome = document.getElementById('nav-home');
        const navTitle = document.getElementById('nav-title');

        if (navBack) {
            navBack.style.display = this.currentScreen === 'home' ? 'none' : 'block';
        }

        if (navHome) {
            navHome.style.display = this.currentScreen === 'home' ? 'none' : 'block';
        }

        if (navTitle) {
            const titles = {
                'home': 'АвтоЗапчасти',
                'category': 'Категория',
                'product': 'Товар',
                'cart': 'Корзина',
                'checkout': 'Оформление',
                'profile': 'Профиль',
                'orders': 'История заказов'
            };
            navTitle.textContent = titles[this.currentScreen] || 'АвтоЗапчасти';
        }
    }

    // Получение текущего ID товара
    getCurrentProductId() {
        return this.currentProductId;
    }

    // Показ уведомления
    showNotification(message, type = 'success') {
        uiComponents.showNotification(message, type);
    }

    // Показ попапа
    showPopup(title, message, buttons = []) {
        telegramAPI.showPopup(title, message, buttons);
    }

    // Показ алерта
    showAlert(message) {
        telegramAPI.showAlert(message);
    }

    // Показ подтверждения
    showConfirm(message, callback) {
        telegramAPI.showConfirm(message, callback);
    }

    // Получение данных пользователя
    getUserData() {
        return telegramAPI.getUserData();
    }

    // Получение данных чата
    getChatData() {
        return telegramAPI.getChatData();
    }

    // Обновление темы
    updateTheme() {
        telegramAPI.setupTheme();
    }

    // Очистка корзины
    clearCart() {
        uiComponents.cart = [];
        uiComponents.saveCartToStorage();
        uiComponents.updateCartBadge();
        uiComponents.updateCartDisplay();
    }

    // Получение статистики
    getStats() {
        return {
            totalProducts: DataService.getCategories().reduce((sum, cat) => sum + cat.productCount, 0),
            cartItems: uiComponents.cart.reduce((sum, item) => sum + item.quantity, 0),
            cartTotal: uiComponents.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            userOrders: DataService.getUserProfile().totalOrders
        };
    }

    // Экспорт данных (для демонстрации)
    exportData() {
        return {
            user: this.getUserData(),
            chat: this.getChatData(),
            cart: uiComponents.cart,
            stats: this.getStats(),
            orders: DataService.getOrderHistory()
        };
    }

    // Сброс приложения (для демонстрации)
    resetApp() {
        this.clearCart();
        localStorage.removeItem('autoparts_cart');
        this.navigateToHome();
        this.showNotification('Приложение сброшено', 'success');
    }
}

// Создание глобального экземпляра приложения
const app = new AutoPartsApp();

// Экспорт для использования в других модулях
window.app = app;

// Глобальные функции для демонстрации
window.showHome = () => app.navigateToHome();
window.showCart = () => app.navigateToCart();
window.showProfile = () => app.navigateToProfile();
window.clearCart = () => app.clearCart();
window.resetApp = () => app.resetApp();
window.getStats = () => app.getStats();
window.exportData = () => app.exportData();

// Обработка ошибок
window.addEventListener('error', (e) => {
    console.error('Ошибка приложения:', e.error);
    app.showNotification('Произошла ошибка', 'error');
});

// Обработка необработанных промисов
window.addEventListener('unhandledrejection', (e) => {
    console.error('Необработанная ошибка промиса:', e.reason);
    app.showNotification('Произошла ошибка', 'error');
});

console.log('Telegram MiniApp "АвтоЗапчасти" загружен'); 