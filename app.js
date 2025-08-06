// Основной класс приложения
class AutoPartsApp {
    constructor() {
        // Сразу запускаем инициализацию
        this.init().catch(error => {
            console.error('Ошибка при инициализации:', error);
            this.handleError(error);
        });
    }

    async init() {
        try {
            console.log('Начало инициализации приложения');

            // Проверяем доступность Telegram WebApp
            if (!window.Telegram?.WebApp) {
                throw new Error('Telegram WebApp не доступен');
            }

            // Показываем экран загрузки
            this.showLoadingScreen();

            // Инициализируем все модули
            await this.initializeModules();

            // Запускаем приложение
            this.startApp();

        } catch (error) {
            console.error('Ошибка инициализации:', error);
            throw error;
        }
    }

    showLoadingScreen() {
        console.log('Показываем экран загрузки');
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        if (loadingScreen && app) {
            loadingScreen.style.display = 'flex';
            loadingScreen.style.opacity = '1';
            app.style.display = 'none';
        }
    }

    async initializeModules() {
        console.log('Инициализация модулей');
        
        // Инициализируем компоненты
        window.uiComponents = new window.UIComponents();
        
        // Даем время на загрузку
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return Promise.resolve();
    }

    startApp() {
        console.log('Запуск приложения');
        
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
            
            // Показываем приложение
            app.style.opacity = '1';
            
            // После завершения анимации
            setTimeout(() => {
                loadingScreen.remove();
                
                // Показываем домашний экран
                if (window.uiComponents) {
                    window.uiComponents.showHome();
                }
                
                console.log('Приложение запущено');
            }, 500);
        });
    }

    handleError(error) {
        console.error('Ошибка в приложении:', error);

        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.innerHTML = `
                <div class="error-message">
                    <h2>Ошибка загрузки</h2>
                    <p>${error.message}</p>
                    <button onclick="location.reload()" class="btn btn-accent">
                        Попробовать снова
                    </button>
                </div>
            `;
        }
    }
}

// Запускаем приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, создаем приложение');
    window.app = new AutoPartsApp();
});