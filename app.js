// Основной класс приложения
class AutoPartsApp {
    constructor() {
        this.init();
    }

    async init() {
        try {
            // Показываем экран загрузки
            this.setupLoadingScreen();

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
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        if (loadingScreen && app) {
            loadingScreen.style.display = 'flex';
            app.style.display = 'none';
        }
    }

    async initializeModules() {
        try {
            // Инициализируем все модули
            if (window.DataService) {
                await window.DataService.init();
            }

            window.uiComponents = new window.UIComponents();

        } catch (error) {
            console.error('Ошибка инициализации модулей:', error);
            throw error;
        }
    }

    postLoadInitialization() {
        try {
            // Скрываем экран загрузки
            this.hideLoadingScreen();

            // Показываем главный экран
            if (window.uiComponents) {
                window.uiComponents.showHome();
            }

        } catch (error) {
            console.error('Ошибка пост-инициализации:', error);
            throw error;
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        if (loadingScreen && app) {
            // Добавляем класс для анимации скрытия
            loadingScreen.classList.add('hidden');
            
            // После завершения анимации скрываем элемент
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                app.style.display = 'block';
                app.classList.add('fade-in');
            }, 1500); // Увеличили время для демонстрации анимации
        }
    }

    handleError(error) {
        console.error('Произошла ошибка:', error);

        // Показываем уведомление об ошибке
        if (window.uiComponents) {
            window.uiComponents.showNotification('Произошла ошибка', error.message, 'error');
        }
    }
}

// Создаем экземпляр приложения после загрузки всех скриптов
window.addEventListener('DOMContentLoaded', () => {
    window.app = new AutoPartsApp();
});