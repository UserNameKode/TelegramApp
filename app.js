class AutoPartsApp {
    constructor() {
        this.init().catch(error => {
            console.error('Ошибка при инициализации:', error);
            this.handleError(error);
        });
    }

    async init() {
        try {
            window.debugLog('Начало инициализации приложения');

            // Проверяем доступность Telegram WebApp
            if (!window.Telegram?.WebApp) {
                throw new Error('Telegram WebApp не доступен');
            }

            // Показываем экран загрузки
            this.showLoadingScreen();

            // Инициализируем WebApp
            window.Telegram.WebApp.ready();
            window.debugLog('Telegram WebApp инициализирован');

            // Инициализируем компоненты
            await this.initializeComponents();

            // Показываем приложение
            await this.showApp();

        } catch (error) {
            console.error('Ошибка инициализации:', error);
            throw error;
        }
    }

    showLoadingScreen() {
        window.debugLog('Показываем экран загрузки');
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        if (loadingScreen && app) {
            loadingScreen.style.display = 'flex';
            loadingScreen.style.opacity = '1';
            app.style.display = 'none';
        }
    }

    async initializeComponents() {
        window.debugLog('Инициализация компонентов');
        
        // Создаем экземпляры компонентов
        window.cart = new Cart();
        window.profile = new Profile();
        window.checkout = new Checkout();

        // Инициализируем UI компоненты
        this.initializeUI();

        // Даем время на загрузку
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    initializeUI() {
        window.debugLog('Инициализация UI');

        // Настраиваем обработчики событий
        document.querySelectorAll('[data-screen]').forEach(button => {
            button.addEventListener('click', (e) => {
                const screen = e.currentTarget.dataset.screen;
                this.showScreen(screen);
            });
        });

        // Кнопка "Назад"
        const backButton = document.querySelector('.btn-back');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.handleBackButton();
            });
        }
    }

    async showApp() {
        window.debugLog('Показываем приложение');
        
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        if (!loadingScreen || !app) {
            throw new Error('Не найдены необходимые элементы DOM');
        }

        // Показываем приложение
        app.style.display = 'block';
        app.style.opacity = '0';

        // Запускаем анимацию перехода
        requestAnimationFrame(() => {
            // Скрываем загрузку
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.5s ease';
            
            // Показываем приложение
            app.style.opacity = '1';
            app.style.transition = 'opacity 0.5s ease';
            
            // После завершения анимации
            setTimeout(() => {
                loadingScreen.remove();
                this.showScreen('home');
                window.debugLog('Приложение запущено');
            }, 500);
        });
    }

    showScreen(screenName) {
        window.debugLog(`Показываем экран: ${screenName}`);
        
        // Скрываем все экраны
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Показываем нужный экран
        const screen = document.getElementById(`${screenName}-screen`);
        if (screen) {
            screen.classList.add('active');
            
            // Обновляем активную кнопку
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            const activeButton = document.querySelector(`[data-screen="${screenName}"]`);
            if (activeButton) {
                activeButton.classList.add('active');
            }
        }
    }

    handleBackButton() {
        window.debugLog('Нажата кнопка "Назад"');
        this.showScreen('home');
    }

    handleError(error) {
        console.error('Произошла ошибка:', error);
        window.debugLog(`Ошибка: ${error.message}`);

        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.innerHTML = `
                <div class="error-message">
                    <h2>Ошибка</h2>
                    <p>${error.message}</p>
                    <button onclick="location.reload()" class="btn btn-accent">
                        Попробовать снова
                    </button>
                </div>
            `;
        }
    }
}

// Создаем экземпляр приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    window.debugLog('DOM загружен, создаем приложение');
    window.app = new AutoPartsApp();
});