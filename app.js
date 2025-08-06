// Основной класс приложения
class AutoPartsApp {
    constructor() {
        this.init();
    }

    async init() {
        try {
            console.log('Инициализация приложения...');
            
            // Показываем экран загрузки
            this.setupLoadingScreen();

            // Инициализируем Telegram WebApp
            if (!window.Telegram || !window.Telegram.WebApp) {
                throw new Error('Telegram WebApp не доступен');
            }

            // Инициализируем WebApp
            window.Telegram.WebApp.ready();
            
            // Инициализируем модули
            await this.initializeModules();

            // Завершаем инициализацию
            this.postLoadInitialization();

        } catch (error) {
            console.error('Ошибка инициализации приложения:', error);
            this.handleError(error);
        }
    }

    setupLoadingScreen() {
        console.log('Настройка экрана загрузки...');
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        if (loadingScreen && app) {
            loadingScreen.style.display = 'flex';
            app.style.display = 'none';
        }
    }

    async initializeModules() {
        console.log('Инициализация модулей...');
        try {
            // Инициализируем все модули последовательно
            if (window.DataService) {
                console.log('Инициализация DataService...');
                await window.DataService.init();
            }

            console.log('Инициализация UI компонентов...');
            window.uiComponents = new window.UIComponents();

            return Promise.resolve();
        } catch (error) {
            console.error('Ошибка инициализации модулей:', error);
            throw error;
        }
    }

    postLoadInitialization() {
        console.log('Завершение инициализации...');
        try {
            // Запускаем таймер для имитации загрузки
            setTimeout(() => {
                this.hideLoadingScreen();
                
                // Показываем главный экран
                if (window.uiComponents) {
                    window.uiComponents.showHome();
                }
            }, 2000);

        } catch (error) {
            console.error('Ошибка пост-инициализации:', error);
            throw error;
        }
    }

    hideLoadingScreen() {
        console.log('Скрытие экрана загрузки...');
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        if (loadingScreen && app) {
            // Показываем приложение
            app.style.display = 'block';
            app.style.opacity = '0';
            
            // Плавно скрываем экран загрузки и показываем приложение
            requestAnimationFrame(() => {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.transition = 'opacity 0.5s ease';
                
                app.style.opacity = '1';
                app.style.transition = 'opacity 0.5s ease';
                
                // Удаляем экран загрузки после завершения анимации
                setTimeout(() => {
                    loadingScreen.remove();
                    console.log('Приложение загружено');
                }, 500);
            });
        }
    }

    handleError(error) {
        console.error('Произошла ошибка:', error);

        // Показываем уведомление об ошибке
        if (window.uiComponents) {
            window.uiComponents.showNotification(
                'Произошла ошибка при загрузке приложения', 
                'error'
            );
        }

        // Показываем сообщение об ошибке на экране загрузки
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

// Создаем экземпляр приложения после полной загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, запуск приложения...');
    window.app = new AutoPartsApp();
});