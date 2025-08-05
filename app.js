// ===== ОСНОВНОЕ ПРИЛОЖЕНИЕ TELEGRAM MINIAPP =====

class AutoPartsApp {
    constructor() {
        this.isInitialized = false;
        this.isLoading = true;
        this.currentTheme = 'light';
        this.init();
    }

    async init() {
        try {
            console.log('Инициализация приложения AutoParts...');
            
            // Настройка экрана загрузки
            this.setupLoadingScreen();
            
            // Инициализация модулей
            await this.initializeModules();
            
            // Настройка приложения
            this.setupApp();
            
            // Скрытие экрана загрузки
            this.hideLoadingScreen();
            
            this.isInitialized = true;
            console.log('Приложение успешно инициализировано');
            
        } catch (error) {
            console.error('Ошибка инициализации приложения:', error);
            this.handleError(error);
        }
    }

    setupLoadingScreen() {
        const loadingScreen = document.querySelector('.loading-screen');
        const progressBar = document.querySelector('.loading-progress-bar');
        
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
        
        if (progressBar) {
            progressBar.style.width = '0%';
        }
    }

    async initializeModules() {
        console.log('Инициализация модулей...');
        
        // Проверяем доступность модулей
        const modules = {
            'DataService': window.DataService,
            'telegramAPI': window.telegramAPI,
            'uiComponents': window.uiComponents,
            'performanceOptimizer': window.performanceOptimizer
        };

        for (const [name, module] of Object.entries(modules)) {
            if (module && typeof module.init === 'function') {
                try {
                    await module.init();
                    console.log(`Модуль ${name} инициализирован`);
                } catch (error) {
                    console.error(`Ошибка инициализации модуля ${name}:`, error);
                }
            } else {
                console.warn(`Модуль ${name} не найден или не имеет метода init`);
            }
        }

        // Обновляем прогресс загрузки
        this.updateLoadingProgress(50);
    }

    setupApp() {
        console.log('Настройка приложения...');
        
        // Настройка темы
        this.setupTheme();
        
        // Настройка обработчиков событий
        this.setupEventHandlers();
        
        // Настройка производительности
        this.setupPerformance();
        
        // Инициализация после загрузки
        this.postLoadInitialization();
        
        // Обновляем прогресс загрузки
        this.updateLoadingProgress(100);
    }

    setupTheme() {
        try {
            // Загружаем сохраненную тему
            const savedTheme = localStorage.getItem('theme') || 'light';
            this.setTheme(savedTheme);
            
            // Настройка переключателя темы
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                themeToggle.addEventListener('click', () => {
                    this.toggleTheme();
                });
            }
        } catch (error) {
            console.error('Ошибка настройки темы:', error);
        }
    }

    setTheme(theme) {
        try {
            this.currentTheme = theme;
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            
            // Обновляем иконку переключателя
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) {
                const icon = themeToggle.querySelector('i');
                if (icon) {
                    icon.className = theme === 'dark' ? 'icon-sun' : 'icon-moon';
                }
            }
        } catch (error) {
            console.error('Ошибка установки темы:', error);
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setupEventHandlers() {
        try {
            // Обработка изменения размера окна
            window.addEventListener('resize', this.handleResize.bind(this));
            
            // Обработка скрытия/показа страницы
            document.addEventListener('visibilitychange', this.handlePageVisibility.bind(this));
            
            // Обработка онлайн/офлайн статуса
            window.addEventListener('online', this.handleOnline.bind(this));
            window.addEventListener('offline', this.handleOffline.bind(this));
            
            // Обработка ошибок
            window.addEventListener('error', this.handleError.bind(this));
            window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
            
        } catch (error) {
            console.error('Ошибка настройки обработчиков событий:', error);
        }
    }

    setupPerformance() {
        try {
            if (window.performanceOptimizer && typeof window.performanceOptimizer.optimize === 'function') {
                window.performanceOptimizer.optimize();
            }
        } catch (error) {
            console.error('Ошибка настройки производительности:', error);
        }
    }

    postLoadInitialization() {
        try {
            // Показываем главную страницу
            if (window.uiComponents && typeof window.uiComponents.showHome === 'function') {
                window.uiComponents.showHome();
            } else {
                console.error('uiComponents.showHome не найден');
            }

            // Настройка Telegram кнопок
            if (window.telegramAPI && typeof window.telegramAPI.hideMainButton === 'function') {
                window.telegramAPI.hideMainButton();
            }
            if (window.telegramAPI && typeof window.telegramAPI.hideBackButton === 'function') {
                window.telegramAPI.hideBackButton();
            }

            // Уведомление о готовности
            console.log('Приложение готово к использованию');
            
        } catch (error) {
            console.error('Ошибка в postLoadInitialization:', error);
        }
    }

    updateLoadingProgress(percent) {
        const progressBar = document.querySelector('.loading-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
    }

    hideLoadingScreen() {
        try {
            const loadingScreen = document.querySelector('.loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
            this.isLoading = false;
        } catch (error) {
            console.error('Ошибка скрытия экрана загрузки:', error);
        }
    }

    handleError(error) {
        console.error('Ошибка приложения:', error);
        
        // Показываем уведомление об ошибке
        if (window.uiComponents && typeof window.uiComponents.showNotification === 'function') {
            window.uiComponents.showNotification('Произошла ошибка. Попробуйте обновить страницу.', 'error');
        }
        
        // Логируем ошибку для аналитики
        this.logError(error);
    }

    handleUnhandledRejection(event) {
        console.error('Необработанное отклонение промиса:', event.reason);
        this.handleError(new Error('Необработанное отклонение промиса: ' + event.reason));
    }

    handleResize() {
        try {
            // Обновляем размеры и позиции элементов
            if (window.performanceOptimizer && typeof window.performanceOptimizer.handleResize === 'function') {
                window.performanceOptimizer.handleResize();
            }
        } catch (error) {
            console.error('Ошибка обработки изменения размера:', error);
        }
    }

    handlePageVisibility() {
        try {
            if (document.hidden) {
                this.handlePageHidden();
            } else {
                this.handlePageVisible();
            }
        } catch (error) {
            console.error('Ошибка обработки видимости страницы:', error);
        }
    }

    handlePageHidden() {
        try {
            // Сохраняем состояние приложения
            this.saveAppState();
            
            // Приостанавливаем анимации и таймеры
            if (window.performanceOptimizer && typeof window.performanceOptimizer.pauseAnimations === 'function') {
                window.performanceOptimizer.pauseAnimations();
            }
        } catch (error) {
            console.error('Ошибка обработки скрытия страницы:', error);
        }
    }

    handlePageVisible() {
        try {
            // Восстанавливаем состояние приложения
            this.restoreAppState();
            
            // Возобновляем анимации
            if (window.performanceOptimizer && typeof window.performanceOptimizer.resumeAnimations === 'function') {
                window.performanceOptimizer.resumeAnimations();
            }
        } catch (error) {
            console.error('Ошибка обработки показа страницы:', error);
        }
    }

    handleOnline() {
        try {
            console.log('Приложение онлайн');
            if (window.uiComponents && typeof window.uiComponents.showNotification === 'function') {
                window.uiComponents.showNotification('Соединение восстановлено', 'success');
            }
        } catch (error) {
            console.error('Ошибка обработки онлайн статуса:', error);
        }
    }

    handleOffline() {
        try {
            console.log('Приложение офлайн');
            if (window.uiComponents && typeof window.uiComponents.showNotification === 'function') {
                window.uiComponents.showNotification('Нет соединения с интернетом', 'warning');
            }
        } catch (error) {
            console.error('Ошибка обработки офлайн статуса:', error);
        }
    }

    saveAppState() {
        try {
            const state = {
                currentScreen: window.uiComponents?.currentScreen || 'home',
                cart: window.uiComponents?.cart || [],
                favorites: window.uiComponents?.favorites || [],
                theme: this.currentTheme,
                timestamp: Date.now()
            };
            
            localStorage.setItem('app_state', JSON.stringify(state));
        } catch (error) {
            console.error('Ошибка сохранения состояния приложения:', error);
        }
    }

    restoreAppState() {
        try {
            const savedState = localStorage.getItem('app_state');
            if (savedState) {
                const state = JSON.parse(savedState);
                
                // Проверяем актуальность состояния (не старше 1 часа)
                if (Date.now() - state.timestamp < 3600000) {
                    this.currentTheme = state.theme || 'light';
                    this.setTheme(this.currentTheme);
                }
            }
        } catch (error) {
            console.error('Ошибка восстановления состояния приложения:', error);
        }
    }

    logError(error) {
        try {
            const errorLog = {
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href
            };
            
            // В реальном приложении здесь был бы отправка на сервер
            console.error('Лог ошибки:', errorLog);
            
            // Сохраняем в localStorage для отладки
            const errorLogs = JSON.parse(localStorage.getItem('error_logs') || '[]');
            errorLogs.push(errorLog);
            
            // Ограничиваем количество логов
            if (errorLogs.length > 10) {
                errorLogs.shift();
            }
            
            localStorage.setItem('error_logs', JSON.stringify(errorLogs));
        } catch (logError) {
            console.error('Ошибка логирования:', logError);
        }
    }

    // Методы для работы с данными
    exportAppData() {
        try {
            const data = {
                cart: window.uiComponents?.cart || [],
                favorites: window.uiComponents?.favorites || [],
                orders: window.uiComponents?.getOrders() || [],
                settings: {
                    theme: this.currentTheme
                },
                timestamp: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `autoparts_data_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            return true;
        } catch (error) {
            console.error('Ошибка экспорта данных:', error);
            return false;
        }
    }

    importAppData(file) {
        return new Promise((resolve, reject) => {
            try {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        
                        // Восстанавливаем данные
                        if (data.cart && window.uiComponents) {
                            window.uiComponents.cart = data.cart;
                            window.uiComponents.saveCart();
                        }
                        
                        if (data.favorites && window.uiComponents) {
                            window.uiComponents.favorites = data.favorites;
                            window.uiComponents.saveFavorites();
                        }
                        
                        if (data.orders && window.uiComponents) {
                            localStorage.setItem('orders', JSON.stringify(data.orders));
                        }
                        
                        if (data.settings?.theme) {
                            this.setTheme(data.settings.theme);
                        }
                        
                        // Обновляем интерфейс
                        if (window.uiComponents) {
                            window.uiComponents.updateCartBadge();
                            window.uiComponents.updateFavoritesBadge();
                        }
                        
                        resolve(true);
                    } catch (parseError) {
                        reject(new Error('Неверный формат файла'));
                    }
                };
                reader.onerror = () => reject(new Error('Ошибка чтения файла'));
                reader.readAsText(file);
            } catch (error) {
                reject(error);
            }
        });
    }

    clearAllData() {
        try {
            // Очищаем все данные
            localStorage.clear();
            
            // Сбрасываем состояние приложения
            if (window.uiComponents) {
                window.uiComponents.cart = [];
                window.uiComponents.favorites = [];
                window.uiComponents.updateCartBadge();
                window.uiComponents.updateFavoritesBadge();
            }
            
            // Сбрасываем тему
            this.setTheme('light');
            
            return true;
        } catch (error) {
            console.error('Ошибка очистки данных:', error);
            return false;
        }
    }

    getAppStats() {
        try {
            const stats = {
                cartItems: window.uiComponents?.cart?.length || 0,
                favoritesCount: window.uiComponents?.favorites?.length || 0,
                ordersCount: window.uiComponents?.getOrders()?.length || 0,
                theme: this.currentTheme,
                isOnline: navigator.onLine,
                userAgent: navigator.userAgent,
                screenSize: `${window.innerWidth}x${window.innerHeight}`,
                timestamp: new Date().toISOString()
            };
            
            return stats;
        } catch (error) {
            console.error('Ошибка получения статистики:', error);
            return null;
        }
    }

    // Методы для тестирования
    runTests() {
        try {
            const tests = [
                this.testDataLoading(),
                this.testCartFunctionality(),
                this.testFavoritesFunctionality(),
                this.testNavigation(),
                this.testThemeSwitching()
            ];
            
            return Promise.all(tests);
        } catch (error) {
            console.error('Ошибка выполнения тестов:', error);
            return Promise.reject(error);
        }
    }

    async testDataLoading() {
        try {
            const categories = window.categories || [];
            const products = window.products || [];
            
            return {
                name: 'Data Loading',
                passed: categories.length > 0 && products.length > 0,
                details: {
                    categories: categories.length,
                    products: products.length
                }
            };
        } catch (error) {
            return {
                name: 'Data Loading',
                passed: false,
                error: error.message
            };
        }
    }

    async testCartFunctionality() {
        try {
            if (!window.uiComponents) {
                throw new Error('UI Components not available');
            }
            
            const initialCartLength = window.uiComponents.cart.length;
            window.uiComponents.addToCart('test_product');
            const afterAddLength = window.uiComponents.cart.length;
            
            return {
                name: 'Cart Functionality',
                passed: afterAddLength > initialCartLength,
                details: {
                    initial: initialCartLength,
                    afterAdd: afterAddLength
                }
            };
        } catch (error) {
            return {
                name: 'Cart Functionality',
                passed: false,
                error: error.message
            };
        }
    }

    async testFavoritesFunctionality() {
        try {
            if (!window.uiComponents) {
                throw new Error('UI Components not available');
            }
            
            const initialFavoritesLength = window.uiComponents.favorites.length;
            window.uiComponents.toggleFavorite('test_product');
            const afterToggleLength = window.uiComponents.favorites.length;
            
            return {
                name: 'Favorites Functionality',
                passed: afterToggleLength !== initialFavoritesLength,
                details: {
                    initial: initialFavoritesLength,
                    afterToggle: afterToggleLength
                }
            };
        } catch (error) {
            return {
                name: 'Favorites Functionality',
                passed: false,
                error: error.message
            };
        }
    }

    async testNavigation() {
        try {
            if (!window.uiComponents) {
                throw new Error('UI Components not available');
            }
            
            window.uiComponents.showHome();
            const homeScreen = document.getElementById('home-screen');
            
            return {
                name: 'Navigation',
                passed: homeScreen && homeScreen.classList.contains('active'),
                details: {
                    homeScreenExists: !!homeScreen,
                    homeScreenActive: homeScreen?.classList.contains('active')
                }
            };
        } catch (error) {
            return {
                name: 'Navigation',
                passed: false,
                error: error.message
            };
        }
    }

    async testThemeSwitching() {
        try {
            const initialTheme = this.currentTheme;
            this.toggleTheme();
            const newTheme = this.currentTheme;
            
            return {
                name: 'Theme Switching',
                passed: initialTheme !== newTheme,
                details: {
                    initialTheme,
                    newTheme
                }
            };
        } catch (error) {
            return {
                name: 'Theme Switching',
                passed: false,
                error: error.message
            };
        }
    }
}

// Инициализация приложения после загрузки страницы
function initializeApp() {
    try {
        console.log('Запуск инициализации приложения...');
        
        // Проверяем доступность необходимых модулей
        if (typeof window.DataService === 'undefined') {
            console.error('DataService не найден');
            return;
        }
        
        if (typeof window.telegramAPI === 'undefined') {
            console.error('telegramAPI не найден');
            return;
        }
        
        if (typeof window.uiComponents === 'undefined') {
            console.error('uiComponents не найден');
            return;
        }
        
        // Создаем экземпляр приложения
        window.app = new AutoPartsApp();
        
    } catch (error) {
        console.error('Ошибка инициализации приложения:', error);
        
        // Показываем сообщение об ошибке на экране загрузки
        const loadingContainer = document.querySelector('.loading-container');
        if (loadingContainer) {
            loadingContainer.innerHTML = `
                <h2 class="loading-title">Ошибка загрузки</h2>
                <p class="loading-subtitle">Произошла ошибка при инициализации приложения</p>
                <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: white; border: none; border-radius: 8px; cursor: pointer;">
                    Обновить страницу
                </button>
            `;
        }
    }
}

// Запускаем инициализацию после полной загрузки страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // Если DOM уже загружен, запускаем сразу
    initializeApp();
}

// Альтернативный способ инициализации через window.onload
window.addEventListener('load', () => {
    // Дополнительная инициализация после загрузки всех ресурсов
    if (window.app && !window.app.isInitialized) {
        console.log('Дополнительная инициализация после загрузки ресурсов...');
        // Здесь можно добавить дополнительную логику
    }
}); 