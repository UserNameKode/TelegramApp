// API для интеграции с Telegram Web App

class TelegramAPI {
    constructor() {
        this.webApp = null;
        this.init();
    }

    init() {
        try {
            // Проверяем, запущено ли приложение в Telegram
            if (window.Telegram && window.Telegram.WebApp) {
                this.webApp = window.Telegram.WebApp;
                this.setupTelegram();
            } else {
                // Демо-режим для тестирования вне Telegram
                this.setupDemoMode();
            }
            console.log('Telegram API инициализирован');
        } catch (error) {
            console.error('Ошибка инициализации Telegram API:', error);
            this.setupDemoMode();
        }
    }

    setupTelegram() {
        // Инициализация Telegram Web App
        this.webApp.ready();
        
        // Настройка темы
        this.setupTheme();
        
        // Настройка кнопок
        this.setupButtons();
        
        console.log('Telegram Web App инициализирован');
    }

    setupDemoMode() {
        // Создаем мок-объект для демо-режима
        this.webApp = {
            ready: () => console.log('Демо-режим: WebApp готов'),
            expand: () => console.log('Демо-режим: WebApp развернут'),
            close: () => console.log('Демо-режим: WebApp закрыт'),
            MainButton: {
                text: '',
                color: '',
                textColor: '',
                isVisible: false,
                isActive: false,
                show: () => console.log('Демо-режим: Главная кнопка показана'),
                hide: () => console.log('Демо-режим: Главная кнопка скрыта'),
                setText: (text) => { this.webApp.MainButton.text = text; },
                setParams: (params) => {
                    if (params.color) this.webApp.MainButton.color = params.color;
                    if (params.text_color) this.webApp.MainButton.textColor = params.text_color;
                },
                onClick: (callback) => { this.webApp.MainButton.onClickCallback = callback; },
                offClick: () => { this.webApp.MainButton.onClickCallback = null; }
            },
            BackButton: {
                isVisible: false,
                show: () => console.log('Демо-режим: Кнопка назад показана'),
                hide: () => console.log('Демо-режим: Кнопка назад скрыта'),
                onClick: (callback) => { this.webApp.BackButton.onClickCallback = callback; },
                offClick: () => { this.webApp.BackButton.onClickCallback = null; }
            },
            themeParams: {
                bg_color: '#0a0a0a',
                text_color: '#ffffff',
                hint_color: '#b0b0b0',
                link_color: '#00d4ff',
                button_color: '#00d4ff',
                button_text_color: '#ffffff'
            },
            initData: '',
            initDataUnsafe: {
                user: {
                    id: 123456789,
                    first_name: 'Демо',
                    last_name: 'Пользователь',
                    username: 'demo_user',
                    language_code: 'ru'
                }
            }
        };
        
        console.log('Демо-режим активирован');
    }

    setupTheme() {
        // Применяем тему Telegram
        const theme = this.webApp.themeParams;
        
        // Обновляем CSS переменные
        document.documentElement.style.setProperty('--background-dark', theme.bg_color || '#0a0a0a');
        document.documentElement.style.setProperty('--text-primary', theme.text_color || '#ffffff');
        document.documentElement.style.setProperty('--text-secondary', theme.hint_color || '#b0b0b0');
        document.documentElement.style.setProperty('--primary-color', theme.button_color || '#00d4ff');
    }

    setupButtons() {
        // Настройка главной кнопки
        this.webApp.MainButton.setParams({
            color: '#00d4ff',
            text_color: '#ffffff'
        });

        // Настройка кнопки назад (с проверкой поддержки)
        if (this.webApp.BackButton && this.webApp.BackButton.onClick) {
            this.webApp.BackButton.onClick(() => {
                this.handleBackButton();
            });
        }
    }

    // Показать главную кнопку
    showMainButton(text, callback) {
        this.webApp.MainButton.setText(text);
        this.webApp.MainButton.onClick(callback);
        this.webApp.MainButton.show();
        this.webApp.MainButton.isVisible = true;
    }

    // Скрыть главную кнопку
    hideMainButton() {
        this.webApp.MainButton.hide();
        this.webApp.MainButton.offClick();
        this.webApp.MainButton.isVisible = false;
    }

    // Показать кнопку назад
    showBackButton() {
        if (this.webApp.BackButton && this.webApp.BackButton.show) {
            this.webApp.BackButton.show();
            this.webApp.BackButton.isVisible = true;
        }
    }

    // Скрыть кнопку назад
    hideBackButton() {
        if (this.webApp.BackButton && this.webApp.BackButton.hide) {
            this.webApp.BackButton.hide();
            this.webApp.BackButton.isVisible = false;
        }
    }

    // Обработка кнопки назад
    handleBackButton() {
        // Эмитируем событие для обработки в приложении
        const event = new CustomEvent('telegramBackButton');
        document.dispatchEvent(event);
    }

    // Получить данные пользователя
    getUser() {
        if (this.webApp.initDataUnsafe && this.webApp.initDataUnsafe.user) {
            return this.webApp.initDataUnsafe.user;
        }
        return null;
    }

    // Показать уведомление
    showAlert(message) {
        if (this.webApp.showAlert) {
            this.webApp.showAlert(message);
        } else {
            alert(message);
        }
    }

    // Показать подтверждение
    showConfirm(message, callback) {
        if (this.webApp.showConfirm) {
            this.webApp.showConfirm(message, callback);
        } else {
            const result = confirm(message);
            if (callback) callback(result);
        }
    }

    // Показать popup
    showPopup(title, message, buttons = []) {
        if (this.webApp.showPopup) {
            this.webApp.showPopup({ title, message, buttons });
        } else {
            // Демо-режим: показываем как alert
            this.showAlert(`${title}\n\n${message}`);
        }
    }

    // Закрыть приложение
    close() {
        if (this.webApp.close) {
            this.webApp.close();
        } else {
            console.log('Демо-режим: приложение закрыто');
        }
    }

    // Развернуть приложение
    expand() {
        if (this.webApp.expand) {
            this.webApp.expand();
        }
    }

    // Проверить, запущено ли в Telegram
    isTelegram() {
        return window.Telegram && window.Telegram.WebApp;
    }

    // Получить тему
    getTheme() {
        return this.webApp.themeParams;
    }

    // Установить заголовок
    setHeaderColor(color) {
        if (this.webApp.setHeaderColor) {
            this.webApp.setHeaderColor(color);
        }
    }

    // Установить цвет фона
    setBackgroundColor(color) {
        if (this.webApp.setBackgroundColor) {
            this.webApp.setBackgroundColor(color);
        }
    }
}

// Создаем глобальный экземпляр
const telegramAPI = new TelegramAPI();

// Экспорт для использования в других модулях
window.telegramAPI = telegramAPI; 