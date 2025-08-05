// Файл оптимизации производительности для Telegram MiniApp

class PerformanceOptimizer {
    constructor() {
        this.observers = new Map();
        this.debounceTimers = new Map();
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupPerformanceMonitoring();
        this.optimizeImages();
        this.setupLazyLoading();
    }

    // Настройка Intersection Observer для ленивой загрузки
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    if (element.dataset.lazy) {
                        this.loadLazyElement(element);
                    }
                }
            });
        }, options);
    }

    // Ленивая загрузка элементов
    setupLazyLoading() {
        document.querySelectorAll('[data-lazy]').forEach(element => {
            this.intersectionObserver.observe(element);
        });
    }

    // Загрузка ленивого элемента
    loadLazyElement(element) {
        const type = element.dataset.lazy;
        
        switch (type) {
            case 'image':
                if (element.dataset.src) {
                    element.src = element.dataset.src;
                    element.removeAttribute('data-src');
                }
                break;
            case 'content':
                if (element.dataset.content) {
                    element.innerHTML = element.dataset.content;
                    element.removeAttribute('data-content');
                }
                break;
        }
        
        element.removeAttribute('data-lazy');
        this.intersectionObserver.unobserve(element);
    }

    // Оптимизация изображений
    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Добавляем lazy loading для изображений
            if (!img.loading) {
                img.loading = 'lazy';
            }
            
            // Добавляем обработку ошибок
            img.addEventListener('error', () => {
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMkEyQjJDIi8+CjxwYXRoIGQ9Ik0xMDAgMTEwQzExMC41IDExMCAxMTkgMTAxLjUgMTE5IDkxQzExOSA4MC41IDExMC41IDcyIDEwMCA3MkM4OS41IDcyIDgxIDgwLjUgODEgOTFDODEgMTAxLjUgODkuNSAxMTAgMTAwIDExMFoiIGZpbGw9IiM0QTVBN0IiLz4KPC9zdmc+';
            });
        });
    }

    // Дебаунсинг для оптимизации частых вызовов
    debounce(func, delay, key = 'default') {
        return (...args) => {
            if (this.debounceTimers.has(key)) {
                clearTimeout(this.debounceTimers.get(key));
            }
            
            const timer = setTimeout(() => {
                func.apply(this, args);
                this.debounceTimers.delete(key);
            }, delay);
            
            this.debounceTimers.set(key, timer);
        };
    }

    // Троттлинг для ограничения частоты вызовов
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Мониторинг производительности
    setupPerformanceMonitoring() {
        // Мониторинг времени загрузки
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`Время загрузки: ${loadTime.toFixed(2)}ms`);
            
            // Отправка метрик в аналитику (если есть)
            if (window.telegramAPI && window.telegramAPI.tg) {
                this.sendPerformanceMetrics({
                    loadTime: loadTime,
                    userAgent: navigator.userAgent,
                    screenSize: `${screen.width}x${screen.height}`
                });
            }
        });

        // Мониторинг памяти
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
                    console.warn('Высокое потребление памяти');
                    this.cleanupMemory();
                }
            }, 30000); // Проверка каждые 30 секунд
        }
    }

    // Очистка памяти
    cleanupMemory() {
        // Очистка неиспользуемых обработчиков событий
        this.debounceTimers.forEach(timer => clearTimeout(timer));
        this.debounceTimers.clear();
        
        // Очистка observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        // Принудительный сбор мусора (если доступен)
        if (window.gc) {
            window.gc();
        }
    }

    // Отправка метрик производительности
    sendPerformanceMetrics(metrics) {
        // В реальном приложении здесь была бы отправка на сервер
        console.log('Метрики производительности:', metrics);
    }

    // Оптимизация анимаций
    optimizeAnimations() {
        // Использование transform вместо top/left для анимаций
        const animatedElements = document.querySelectorAll('.animated');
        animatedElements.forEach(element => {
            element.style.willChange = 'transform';
        });
    }

    // Предзагрузка критических ресурсов
    preloadCriticalResources() {
        const criticalResources = [
            '/styles/main.css',
            '/styles/components.css',
            '/scripts/app.js'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }

    // Оптимизация для мобильных устройств
    optimizeForMobile() {
        if (window.innerWidth <= 768) {
            // Уменьшение количества элементов на экране
            const productCards = document.querySelectorAll('.product-card');
            if (productCards.length > 6) {
                productCards.forEach((card, index) => {
                    if (index >= 6) {
                        card.style.display = 'none';
                    }
                });
            }

            // Оптимизация touch событий
            this.optimizeTouchEvents();
        }
    }

    // Оптимизация touch событий
    optimizeTouchEvents() {
        let touchStartY = 0;
        let touchEndY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;
            
            // Предотвращение случайных свайпов
            if (Math.abs(diff) < 50) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    // Кэширование данных
    setupCaching() {
        // Кэширование категорий
        if (!localStorage.getItem('cached_categories')) {
            const categories = DataService.getCategories();
            localStorage.setItem('cached_categories', JSON.stringify(categories));
        }

        // Кэширование популярных товаров
        if (!localStorage.getItem('cached_popular_products')) {
            const popularProducts = DataService.getProductsByCategory('engine').slice(0, 4);
            localStorage.setItem('cached_popular_products', JSON.stringify(popularProducts));
        }
    }

    // Получение кэшированных данных
    getCachedData(key) {
        const cached = localStorage.getItem(`cached_${key}`);
        return cached ? JSON.parse(cached) : null;
    }

    // Очистка устаревшего кэша
    clearStaleCache() {
        const cacheKeys = ['categories', 'popular_products'];
        const cacheAge = 24 * 60 * 60 * 1000; // 24 часа

        cacheKeys.forEach(key => {
            const timestamp = localStorage.getItem(`cached_${key}_timestamp`);
            if (timestamp && Date.now() - parseInt(timestamp) > cacheAge) {
                localStorage.removeItem(`cached_${key}`);
                localStorage.removeItem(`cached_${key}_timestamp`);
            }
        });
    }
}

// Создание глобального экземпляра оптимизатора
const performanceOptimizer = new PerformanceOptimizer();

// Экспорт для использования в других модулях
window.performanceOptimizer = performanceOptimizer;

// Автоматическая оптимизация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    performanceOptimizer.optimizeForMobile();
    performanceOptimizer.setupCaching();
    performanceOptimizer.optimizeAnimations();
});

// Очистка при выгрузке страницы
window.addEventListener('beforeunload', () => {
    performanceOptimizer.cleanupMemory();
});

console.log('Модуль оптимизации производительности загружен'); 