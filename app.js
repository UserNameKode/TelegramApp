// Основная логика приложения Telegram MiniApp

class AutoPartsApp {
    constructor() {
        this.isLoading = true;
        this.init();
    }

    init() {
        // Инициализация приложения
        this.setupLoadingScreen();
        this.initializeApp();
        this.setupEventListeners();
    }

    // Настройка экрана загрузки
    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const appContainer = document.getElementById('app');

        if (loadingScreen && appContainer) {
            // Показываем экран загрузки
            loadingScreen.style.display = 'flex';
            appContainer.style.display = 'none';

            // Имитируем загрузку данных
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 2000); // 2 секунды для демонстрации анимации
        }
    }

    // Скрытие экрана загрузки
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const appContainer = document.getElementById('app');

        if (loadingScreen && appContainer) {
            // Добавляем класс для анимации сборки
            const engineAssembly = loadingScreen.querySelector('.engine-assembly');
            if (engineAssembly) {
                engineAssembly.classList.add('assembling');
            }

            // Плавное скрытие экрана загрузки
            loadingScreen.classList.add('fade-out');

            setTimeout(() => {
                loadingScreen.style.display = 'none';
                appContainer.style.display = 'block';
                
                // Плавное появление основного приложения
                setTimeout(() => {
                    appContainer.classList.add('loaded');
                    this.isLoading = false;
                    
                    // Инициализация после загрузки
                    this.postLoadInitialization();
                }, 100);
            }, 300);
        }
    }

    // Инициализация приложения
    initializeApp() {
        // Проверяем доступность всех необходимых модулей
        if (!window.DataService) {
            console.error('DataService не найден');
            return;
        }

        if (!window.telegramAPI) {
            console.error('TelegramAPI не найден');
            return;
        }

        if (!window.uiComponents) {
            console.error('UIComponents не найден');
            return;
        }

        // Инициализация Telegram API
        telegramAPI.init();

        // Настройка темы
        this.setupTheme();

        // Инициализация UI компонентов
        uiComponents.init();

        console.log('Приложение инициализировано');
    }

    // Пост-загрузочная инициализация
    postLoadInitialization() {
        // Показываем главную страницу
        uiComponents.showHome();

        // Настройка Telegram кнопок
        telegramAPI.hideMainButton();
        telegramAPI.hideBackButton();

        // Уведомление о готовности
        console.log('Приложение готово к использованию');
    }

    // Настройка темы
    setupTheme() {
        // Применяем тему Telegram
        const theme = telegramAPI.getTheme();
        
        if (theme) {
            // Обновляем CSS переменные
            document.documentElement.style.setProperty('--background-dark', theme.bg_color || '#0a0a0a');
            document.documentElement.style.setProperty('--text-primary', theme.text_color || '#ffffff');
            document.documentElement.style.setProperty('--text-secondary', theme.hint_color || '#b0b0b0');
            document.documentElement.style.setProperty('--primary-color', theme.button_color || '#00d4ff');
        }

        // Проверяем предпочтения пользователя
        const settings = uiComponents.getSettings();
        if (!settings.darkMode) {
            document.body.classList.add('light-theme');
        }
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        // Обработка ошибок
        window.addEventListener('error', (e) => {
            console.error('Ошибка приложения:', e.error);
            this.handleError(e.error);
        });

        // Обработка необработанных промисов
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Необработанная ошибка промиса:', e.reason);
            this.handleError(e.reason);
        });

        // Обработка изменения размера окна
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Обработка видимости страницы
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handlePageHidden();
            } else {
                this.handlePageVisible();
            }
        });

        // Обработка онлайн/офлайн статуса
        window.addEventListener('online', () => {
            this.handleOnline();
        });

        window.addEventListener('offline', () => {
            this.handleOffline();
        });
    }

    // Обработка ошибок
    handleError(error) {
        console.error('Ошибка приложения:', error);
        
        // Показываем уведомление пользователю
        if (uiComponents) {
            uiComponents.showNotification('Произошла ошибка. Попробуйте обновить страницу.', 'error');
        }

        // Отправляем отчет об ошибке (в реальном приложении)
        this.sendErrorReport(error);
    }

    // Отправка отчета об ошибке
    sendErrorReport(error) {
        const errorReport = {
            message: error.message || 'Unknown error',
            stack: error.stack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        console.log('Отчет об ошибке:', errorReport);
        // В реальном приложении здесь была бы отправка на сервер
    }

    // Обработка изменения размера окна
    handleResize() {
        // Пересчитываем размеры элементов
        if (performanceOptimizer) {
            performanceOptimizer.optimizeForMobile();
        }

        // Обновляем отображение
        if (uiComponents) {
            uiComponents.updateCartDisplay();
        }
    }

    // Обработка скрытия страницы
    handlePageHidden() {
        console.log('Страница скрыта');
        
        // Сохраняем состояние
        if (uiComponents) {
            uiComponents.saveCartToStorage();
        }

        // Останавливаем анимации для экономии ресурсов
        this.pauseAnimations();
    }

    // Обработка показа страницы
    handlePageVisible() {
        console.log('Страница видна');
        
        // Возобновляем анимации
        this.resumeAnimations();

        // Обновляем данные если нужно
        this.refreshData();
    }

    // Обработка подключения к интернету
    handleOnline() {
        console.log('Подключение к интернету восстановлено');
        
        if (uiComponents) {
            uiComponents.showNotification('Подключение к интернету восстановлено');
        }

        // Обновляем данные
        this.refreshData();
    }

    // Обработка отключения от интернету
    handleOffline() {
        console.log('Подключение к интернету потеряно');
        
        if (uiComponents) {
            uiComponents.showNotification('Подключение к интернету потеряно', 'error');
        }
    }

    // Приостановка анимаций
    pauseAnimations() {
        const animatedElements = document.querySelectorAll('.animated, .product-card, .category-card');
        animatedElements.forEach(element => {
            element.style.animationPlayState = 'paused';
        });
    }

    // Возобновление анимаций
    resumeAnimations() {
        const animatedElements = document.querySelectorAll('.animated, .product-card, .category-card');
        animatedElements.forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }

    // Обновление данных
    refreshData() {
        // В реальном приложении здесь была бы синхронизация с сервером
        console.log('Обновление данных...');
    }

    // Дебаунсинг для оптимизации
    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Получение информации о приложении
    getAppInfo() {
        return {
            name: 'АвтоЗапчасти',
            version: '1.0.0',
            platform: telegramAPI.isTelegram() ? 'Telegram' : 'Web',
            userAgent: navigator.userAgent,
            screenSize: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            timestamp: new Date().toISOString()
        };
    }

    // Экспорт данных приложения
    exportAppData() {
        const data = {
            appInfo: this.getAppInfo(),
            cart: uiComponents ? uiComponents.cart : [],
            favorites: uiComponents ? uiComponents.getFavorites() : [],
            settings: uiComponents ? uiComponents.getSettings() : {},
            orders: DataService ? DataService.getOrderHistory() : []
        };

        return data;
    }

    // Импорт данных приложения
    importAppData(data) {
        try {
            if (data.cart && uiComponents) {
                uiComponents.cart = data.cart;
                uiComponents.saveCartToStorage();
                uiComponents.updateCartBadge();
            }

            if (data.favorites && uiComponents) {
                localStorage.setItem('autoparts_favorites', JSON.stringify(data.favorites));
            }

            if (data.settings && uiComponents) {
                uiComponents.saveSettings(data.settings);
            }

            console.log('Данные успешно импортированы');
            return true;
        } catch (error) {
            console.error('Ошибка импорта данных:', error);
            return false;
        }
    }

    // Очистка всех данных приложения
    clearAllData() {
        try {
            // Очищаем localStorage
            localStorage.clear();

            // Сбрасываем состояние компонентов
            if (uiComponents) {
                uiComponents.cart = [];
                uiComponents.updateCartBadge();
                uiComponents.updateCartDisplay();
            }

            // Очищаем кэш
            if (performanceOptimizer && performanceOptimizer.cache) {
                performanceOptimizer.cache.clear();
            }

            console.log('Все данные приложения очищены');
            return true;
        } catch (error) {
            console.error('Ошибка очистки данных:', error);
            return false;
        }
    }

    // Получение статистики приложения
    getAppStats() {
        const stats = {
            cartItems: uiComponents ? uiComponents.cart.length : 0,
            favoritesCount: uiComponents ? uiComponents.getFavorites().length : 0,
            ordersCount: DataService ? DataService.getOrderHistory().length : 0,
            localStorageSize: this.getLocalStorageSize(),
            uptime: Date.now() - this.startTime,
            errors: this.errorCount || 0
        };

        return stats;
    }

    // Получение размера localStorage
    getLocalStorageSize() {
        let size = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                size += localStorage[key].length + key.length;
            }
        }
        return size;
    }

    // Перезапуск приложения
    restart() {
        console.log('Перезапуск приложения...');
        
        // Сохраняем важные данные
        const importantData = this.exportAppData();
        
        // Очищаем состояние
        this.clearAllData();
        
        // Перезагружаем страницу
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

// Создание экземпляра приложения
const app = new AutoPartsApp();

// Экспорт для использования в других модулях
window.app = app;

// Глобальные обработчики
window.addEventListener('load', () => {
    console.log('Приложение "АвтоЗапчасти" загружено');
});

// Обработка ошибок загрузки ресурсов
window.addEventListener('error', (e) => {
    if (e.target.tagName === 'LINK' || e.target.tagName === 'SCRIPT') {
        console.error('Ошибка загрузки ресурса:', e.target.src || e.target.href);
    }
}, true);

console.log('Основной модуль приложения загружен'); 