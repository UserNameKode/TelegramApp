// Telegram Web App API интеграция
class TelegramAPI {
    constructor() {
        this.tg = null;
        this.init();
    }

    // Инициализация Telegram Web App
    init() {
        if (window.Telegram && window.Telegram.WebApp) {
            this.tg = window.Telegram.WebApp;
            this.setupApp();
        } else {
            console.warn('Telegram Web App API не доступен');
            // Для демонстрации создаем заглушку
            this.createMockTelegramAPI();
        }
    }

    // Настройка приложения
    setupApp() {
        // Расширяем на весь экран
        this.tg.expand();
        
        // Настраиваем тему
        this.setupTheme();
        
        // Настраиваем кнопки
        this.setupMainButton();
        
        // Обработчики событий
        this.setupEventHandlers();
        
        // Готовность приложения
        this.tg.ready();
    }

    // Настройка темы
    setupTheme() {
        const theme = this.tg.themeParams;
        
        // Применяем цвета Telegram к CSS переменным
        if (theme.bg_color) {
            document.documentElement.style.setProperty('--background-dark', theme.bg_color);
        }
        if (theme.text_color) {
            document.documentElement.style.setProperty('--text-primary', theme.text_color);
        }
        if (theme.hint_color) {
            document.documentElement.style.setProperty('--text-secondary', theme.hint_color);
        }
        if (theme.link_color) {
            document.documentElement.style.setProperty('--primary-color', theme.link_color);
        }
        if (theme.button_color) {
            document.documentElement.style.setProperty('--accent-color', theme.button_color);
        }
        if (theme.button_text_color) {
            document.documentElement.style.setProperty('--text-primary', theme.button_text_color);
        }
    }

    // Настройка главной кнопки
    setupMainButton() {
        this.tg.MainButton.setText('Оформить заказ');
        this.tg.MainButton.color = '#00d4ff';
        this.tg.MainButton.textColor = '#ffffff';
        this.tg.MainButton.isVisible = false;
    }

    // Показать главную кнопку
    showMainButton(text = 'Оформить заказ', callback = null) {
        this.tg.MainButton.setText(text);
        this.tg.MainButton.isVisible = true;
        
        if (callback) {
            this.tg.MainButton.onClick(callback);
        }
    }

    // Скрыть главную кнопку
    hideMainButton() {
        this.tg.MainButton.isVisible = false;
    }

    // Настройка обработчиков событий
    setupEventHandlers() {
        // Обработка нажатия на главную кнопку
        this.tg.MainButton.onClick(() => {
            console.log('Главная кнопка нажата');
            // Логика будет добавлена в app.js
        });

        // Обработка нажатия на кнопку "Назад"
        this.tg.BackButton.onClick(() => {
            console.log('Кнопка "Назад" нажата');
            // Логика будет добавлена в app.js
        });
    }

    // Показать кнопку "Назад"
    showBackButton() {
        this.tg.BackButton.isVisible = true;
    }

    // Скрыть кнопку "Назад"
    hideBackButton() {
        this.tg.BackButton.isVisible = false;
    }

    // Показать всплывающее окно
    showPopup(title, message, buttons = []) {
        this.tg.showPopup({
            title: title,
            message: message,
            buttons: buttons
        });
    }

    // Показать уведомление
    showAlert(message) {
        this.tg.showAlert(message);
    }

    // Показать подтверждение
    showConfirm(message, callback) {
        this.tg.showConfirm(message, callback);
    }

    // Получить данные пользователя
    getUserData() {
        return {
            id: this.tg.initDataUnsafe?.user?.id,
            firstName: this.tg.initDataUnsafe?.user?.first_name,
            lastName: this.tg.initDataUnsafe?.user?.last_name,
            username: this.tg.initDataUnsafe?.user?.username,
            languageCode: this.tg.initDataUnsafe?.user?.language_code
        };
    }

    // Получить данные чата
    getChatData() {
        return {
            id: this.tg.initDataUnsafe?.chat?.id,
            type: this.tg.initDataUnsafe?.chat?.type,
            title: this.tg.initDataUnsafe?.chat?.title
        };
    }

    // Создание заглушки для демонстрации
    createMockTelegramAPI() {
        console.log('Создание заглушки Telegram API для демонстрации');
        
        this.tg = {
            expand: () => console.log('Приложение развернуто'),
            ready: () => console.log('Приложение готово'),
            themeParams: {
                bg_color: '#0a0a0a',
                text_color: '#ffffff',
                hint_color: '#b0b0b0',
                link_color: '#00d4ff',
                button_color: '#ff6b35',
                button_text_color: '#ffffff'
            },
            MainButton: {
                text: '',
                color: '#00d4ff',
                textColor: '#ffffff',
                isVisible: false,
                onClick: (callback) => {
                    this.mainButtonCallback = callback;
                },
                setText: (text) => {
                    this.tg.MainButton.text = text;
                    console.log('Главная кнопка:', text);
                }
            },
            BackButton: {
                isVisible: false,
                onClick: (callback) => {
                    this.backButtonCallback = callback;
                }
            },
            showPopup: (options) => {
                console.log('Попап:', options);
                // Создаем простой попап для демонстрации
                this.createMockPopup(options);
            },
            showAlert: (message) => {
                console.log('Алерт:', message);
                alert(message);
            },
            showConfirm: (message, callback) => {
                console.log('Подтверждение:', message);
                const result = confirm(message);
                if (callback) callback(result);
            },
            initDataUnsafe: {
                user: {
                    id: 123456789,
                    first_name: 'Демо',
                    last_name: 'Пользователь',
                    username: 'demo_user',
                    language_code: 'ru'
                },
                chat: {
                    id: -987654321,
                    type: 'private',
                    title: 'Демо чат'
                }
            }
        };
    }

    // Создание заглушки попапа
    createMockPopup(options) {
        const popup = document.createElement('div');
        popup.className = 'mock-popup';
        popup.innerHTML = `
            <div class="mock-popup-content">
                <h3>${options.title}</h3>
                <p>${options.message}</p>
                <div class="mock-popup-buttons">
                    ${options.buttons.map(btn => 
                        `<button class="mock-popup-btn" data-type="${btn.type}">${btn.text}</button>`
                    ).join('')}
                </div>
            </div>
        `;
        
        popup.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        const content = popup.querySelector('.mock-popup-content');
        content.style.cssText = `
            background: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 20px;
            max-width: 300px;
            text-align: center;
        `;
        
        const buttons = popup.querySelectorAll('.mock-popup-btn');
        buttons.forEach(btn => {
            btn.style.cssText = `
                background: var(--primary-color);
                color: white;
                border: none;
                padding: 8px 16px;
                margin: 5px;
                border-radius: 6px;
                cursor: pointer;
            `;
            
            btn.addEventListener('click', () => {
                document.body.removeChild(popup);
            });
        });
        
        document.body.appendChild(popup);
    }

    // Симуляция нажатия главной кнопки (для демонстрации)
    simulateMainButtonClick() {
        if (this.mainButtonCallback) {
            this.mainButtonCallback();
        }
    }

    // Симуляция нажатия кнопки "Назад" (для демонстрации)
    simulateBackButtonClick() {
        if (this.backButtonCallback) {
            this.backButtonCallback();
        }
    }
}

// Создание глобального экземпляра
const telegramAPI = new TelegramAPI();

// Экспорт для использования в других модулях
window.telegramAPI = telegramAPI; 