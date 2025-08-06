// Класс для работы с Telegram Web App API
class TelegramAPI {
    constructor() {
        this.webApp = window.Telegram.WebApp;
        this.init();
    }

    init() {
        try {
            // Проверяем доступность Telegram Web App
            if (!this.webApp) {
                throw new Error('Telegram Web App не доступен');
            }

            // Инициализируем WebApp
            this.webApp.ready();

            // Получаем параметры запуска
            const initData = this.webApp.initData;
            const initDataUnsafe = this.webApp.initDataUnsafe;
            const colorScheme = this.webApp.colorScheme;
            const themeParams = this.webApp.themeParams;

            // Применяем тему
            document.documentElement.setAttribute('data-theme', colorScheme);
            this.setThemeColors(themeParams);

            // Настраиваем кнопки
            this.setupButtons();

            console.log('Telegram API инициализирован');
        } catch (error) {
            console.error('Ошибка инициализации Telegram API:', error);
            throw error;
        }
    }

    setThemeColors(themeParams) {
        const colors = {
            '--tg-theme-bg-color': themeParams.bg_color || '#ffffff',
            '--tg-theme-text-color': themeParams.text_color || '#000000',
            '--tg-theme-hint-color': themeParams.hint_color || '#999999',
            '--tg-theme-link-color': themeParams.link_color || '#2481cc',
            '--tg-theme-button-color': themeParams.button_color || '#2481cc',
            '--tg-theme-button-text-color': themeParams.button_text_color || '#ffffff'
        };

        Object.entries(colors).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });
    }

    setupButtons() {
        // Настраиваем основную кнопку
        if (this.webApp.MainButton) {
            this.webApp.MainButton.setParams({
                text: 'Оформить заказ',
                color: this.webApp.themeParams?.button_color || '#2481cc',
                text_color: this.webApp.themeParams?.button_text_color || '#ffffff'
            });
        }

        // Настраиваем обработчики событий
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        // Обработчик закрытия приложения
        window.addEventListener('beforeunload', () => {
            try {
                if (this.webApp) {
                    this.webApp.close();
                }
            } catch (error) {
                console.error('Ошибка при закрытии приложения:', error);
            }
        });
    }

    // Методы для работы с MainButton
    showMainButton() {
        if (this.webApp.MainButton) {
            this.webApp.MainButton.show();
        }
    }

    hideMainButton() {
        if (this.webApp.MainButton) {
            this.webApp.MainButton.hide();
        }
    }

    setMainButtonText(text) {
        if (this.webApp.MainButton) {
            this.webApp.MainButton.setParams({ text: text });
        }
    }

    setMainButtonCallback(callback) {
        if (this.webApp.MainButton) {
            this.webApp.MainButton.onClick(callback);
        }
    }

    // Методы для работы с данными пользователя
    getUserData() {
        if (this.webApp.initDataUnsafe) {
            return {
                userId: this.webApp.initDataUnsafe.user?.id,
                username: this.webApp.initDataUnsafe.user?.username,
                firstName: this.webApp.initDataUnsafe.user?.first_name,
                lastName: this.webApp.initDataUnsafe.user?.last_name
            };
        }
        return null;
    }

    // Методы для работы с темой
    isDarkMode() {
        return this.webApp.colorScheme === 'dark';
    }

    getThemeParams() {
        return this.webApp.themeParams;
    }

    // Методы для навигации
    closeApp() {
        if (this.webApp) {
            this.webApp.close();
        }
    }

    expandApp() {
        if (this.webApp.expand) {
            this.webApp.expand();
        }
    }
}

// Создаем глобальный экземпляр API
window.telegramAPI = new TelegramAPI();