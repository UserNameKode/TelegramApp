// Оптимизация производительности для Telegram MiniApp

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
        if ('IntersectionObserver' in window) {
            this.intersectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadLazyElement(entry.target);
                        this.intersectionObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px',
                threshold: 0.1
            });
        }
    }

    // Ленивая загрузка элементов
    setupLazyLoading() {
        const lazyElements = document.querySelectorAll('[data-lazy]');
        lazyElements.forEach(element => {
            if (this.intersectionObserver) {
                this.intersectionObserver.observe(element);
            } else {
                // Fallback для старых браузеров
                this.loadLazyElement(element);
            }
        });
    }

    // Загрузка ленивого элемента
    loadLazyElement(element) {
        const type = element.dataset.lazy;
        
        switch (type) {
            case 'image':
                const src = element.dataset.src;
                if (src) {
                    element.src = src;
                    element.classList.remove('lazy');
                }
                break;
            case 'content':
                // Загрузка контента по требованию
                this.loadContent(element);
                break;
        }
    }

    // Оптимизация изображений
    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Добавляем lazy loading для изображений
            if (!img.loading) {
                img.loading = 'lazy';
            }
            
            // Оптимизация размера для мобильных устройств
            if (window.innerWidth <= 768) {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
            }
        });
    }

    // Дебаунсинг для оптимизации частых вызовов
    debounce(func, delay, key = 'default') {
        if (this.debounceTimers.has(key)) {
            clearTimeout(this.debounceTimers.get(key));
        }
        
        const timer = setTimeout(() => {
            func();
            this.debounceTimers.delete(key);
        }, delay);
        
        this.debounceTimers.set(key, timer);
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
        }
    }

    // Мониторинг производительности
    setupPerformanceMonitoring() {
        if ('performance' in window) {
            // Мониторинг времени загрузки
            window.addEventListener('load', () => {
                const navigation = performance.getEntriesByType('navigation')[0];
                const loadTime = navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0;
                console.log(`Время загрузки страницы: ${loadTime}ms`);
                
                // Отправляем метрики
                this.sendPerformanceMetrics({
                    loadTime,
                    type: 'pageLoad'
                });
            });

            // Мониторинг памяти
            if ('memory' in performance) {
                setInterval(() => {
                    const memoryInfo = performance.memory;
                    console.log(`Использование памяти: ${Math.round(memoryInfo.usedJSHeapSize / 1048576)}MB`);
                    
                    if (memoryInfo.usedJSHeapSize > memoryInfo.jsHeapSizeLimit * 0.8) {
                        this.cleanupMemory();
                    }
                }, 30000); // Проверяем каждые 30 секунд
            }
        }
    }

    // Очистка памяти
    cleanupMemory() {
        // Очищаем неиспользуемые таймеры
        this.debounceTimers.forEach((timer, key) => {
            clearTimeout(timer);
        });
        this.debounceTimers.clear();

        // Очищаем observers
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }

        // Принудительная сборка мусора (если доступна)
        if (window.gc) {
            window.gc();
        }

        console.log('Очистка памяти выполнена');
    }

    // Отправка метрик производительности
    sendPerformanceMetrics(metrics) {
        // В реальном приложении здесь была бы отправка на сервер
        console.log('Метрики производительности:', metrics);
    }

    // Оптимизация анимаций
    optimizeAnimations() {
        // Используем transform вместо изменения позиции
        const animatedElements = document.querySelectorAll('.animated');
        animatedElements.forEach(element => {
            element.style.willChange = 'transform';
        });

        // Оптимизация для мобильных устройств
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
        }
    }

    // Предзагрузка критических ресурсов
    preloadCriticalResources() {
        const criticalResources = [
            'main.css',
            'components.css',
            'animations.css'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = 'style';
            document.head.appendChild(link);
        });
    }

    // Оптимизация для мобильных устройств
    optimizeForMobile() {
        if (window.innerWidth <= 768) {
            // Отключаем некоторые анимации на мобильных
            document.body.classList.add('mobile-optimized');
            
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

            // Обработка свайпов
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    // Свайп вверх
                    this.handleSwipeUp();
                } else {
                    // Свайп вниз
                    this.handleSwipeDown();
                }
            }
        }, { passive: true });
    }

    // Обработка свайпа вверх
    handleSwipeUp() {
        // Можно добавить навигацию или другие действия
        console.log('Свайп вверх');
    }

    // Обработка свайпа вниз
    handleSwipeDown() {
        // Можно добавить навигацию или другие действия
        console.log('Свайп вниз');
    }

    // Кэширование данных
    setupCaching() {
        // Кэширование в localStorage
        this.cache = {
            set: (key, data, ttl = 3600000) => { // TTL по умолчанию 1 час
                const item = {
                    data,
                    timestamp: Date.now(),
                    ttl
                };
                localStorage.setItem(`cache_${key}`, JSON.stringify(item));
            },
            
            get: (key) => {
                const item = localStorage.getItem(`cache_${key}`);
                if (!item) return null;
                
                const cached = JSON.parse(item);
                const now = Date.now();
                
                if (now - cached.timestamp > cached.ttl) {
                    localStorage.removeItem(`cache_${key}`);
                    return null;
                }
                
                return cached.data;
            },
            
            clear: () => {
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('cache_')) {
                        localStorage.removeItem(key);
                    }
                });
            }
        };

        // Очистка устаревшего кэша
        this.clearStaleCache();
    }

    // Получение кэшированных данных
    getCachedData(key) {
        return this.cache ? this.cache.get(key) : null;
    }

    // Очистка устаревшего кэша
    clearStaleCache() {
        if (this.cache) {
            this.cache.clear();
        }
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