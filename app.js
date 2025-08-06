class AutoPartsApp {
    constructor() {
        this.currentScreen = 'home';
        this.cart = null;
        this.profile = null;
        this.checkout = null;
    }

    async init() {
        console.log('Инициализация AutoPartsApp...');
        
        // Инициализируем модули
        this.cart = new Cart();
        this.profile = new Profile();
        this.checkout = new Checkout();
        
        // Делаем доступными глобально
        window.cart = this.cart;
        window.profile = this.profile;
        window.checkout = this.checkout;
        
        // Настраиваем навигацию
        this.setupNavigation();
        
        // Рендерим главный экран
        this.renderHome();
        
        // Показываем главный экран
        this.showScreen('home');
        
        console.log('AutoPartsApp инициализирован');
    }

    setupNavigation() {
        // Навигационные кнопки
        document.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-screen')) {
                const screen = e.target.getAttribute('data-screen');
                this.showScreen(screen);
            }
        });

        // Кнопка "Назад" в навигации
        document.getElementById('nav-back-btn').addEventListener('click', () => {
            this.goBack();
        });
    }

    goBack() {
        // Логика возврата к предыдущему экрану
        if (this.currentScreen === 'cart' || this.currentScreen === 'profile' || this.currentScreen === 'checkout') {
            this.showScreen('home');
        } else {
            this.renderHome(); // Возврат к главной из категории
        }
    }

    showScreen(screenName) {
        // Скрываем все экраны
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Показываем нужный экран
        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
            
            // Рендерим содержимое экрана
            switch(screenName) {
                case 'home':
                    this.renderHome();
                    break;
                case 'cart':
                    this.cart.render();
                    break;
                case 'profile':
                    this.profile.render();
                    break;
                case 'checkout':
                    this.checkout.render();
                    break;
            }
        }
    }

    renderHome() {
        const homeScreen = document.getElementById('home-screen');
        if (!homeScreen) return;

        const userLevel = DataService.getUserLevel();

        homeScreen.innerHTML = `
            <!-- Автомобильная шапка -->
            <div class="hero-banner">
                <div class="car-animation">
                    <svg class="car-icon" viewBox="0 0 200 100">
                        <!-- Кузов автомобиля -->
                        <path d="M20 60 L40 40 L160 40 L180 60 L180 70 L20 70 Z" fill="#2563EB" stroke="#1d4ed8" stroke-width="2"/>
                        <!-- Окна -->
                        <path d="M45 45 L155 45 L170 60 L35 60 Z" fill="#87CEEB" opacity="0.7"/>
                        <!-- Колеса -->
                        <circle cx="50" cy="75" r="12" fill="#1f2937" stroke="#374151" stroke-width="2"/>
                        <circle cx="150" cy="75" r="12" fill="#1f2937" stroke="#374151" stroke-width="2"/>
                        <circle cx="50" cy="75" r="8" fill="#6b7280"/>
                        <circle cx="150" cy="75" r="8" fill="#6b7280"/>
                        <!-- Фары (анимированные) -->
                        <circle class="headlight left" cx="25" cy="55" r="5" fill="#FBBF24"/>
                        <circle class="headlight right" cx="175" cy="55" r="5" fill="#FBBF24"/>
                        <!-- Решетка радиатора -->
                        <rect x="175" y="50" width="5" height="15" fill="#374151"/>
                    </svg>
                </div>
                <div class="hero-content">
                    <h1>Запчасти для любого автомобиля</h1>
                    <p>В наличии и под заказ • Оригинальные и аналоги • Быстрая доставка</p>
                </div>
                <div class="bonus-indicator">
                    <span class="bonus-level" style="color: ${userLevel.color}">
                        ${userLevel.name} • ${DataService.userData.bonusPoints} баллов
                    </span>
                </div>
            </div>

            <!-- Поиск -->
            <div class="search-section">
                <div class="search-container">
                    <input type="text" id="search-input" placeholder="Поиск по артикулу, названию или VIN...">
                    <button class="search-btn" id="search-btn">🔍</button>
                </div>
                <div class="quick-filters">
                    <button class="filter-chip active" data-filter="all">Все</button>
                    <button class="filter-chip" data-filter="inStock">В наличии</button>
                    <button class="filter-chip" data-filter="popular">Популярные</button>
                </div>
            </div>

            <!-- Марки автомобилей -->
            <div class="section-header">
                <h3>Выберите марку автомобиля</h3>
                <p class="section-subtitle">Найдите запчасти для вашего авто</p>
            </div>
            <div class="car-brands">
                ${DataService.getCarBrands(true).map(brand => `
                    <div class="brand-card" data-brand="${brand.id}">
                        <div class="brand-logo">
                            <img src="${brand.logo}" alt="${brand.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMzM0MTU1Ii8+PHRleHQgeD0iMzAiIHk9IjM1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTRBM0I4IiBmb250LXNpemU9IjEwIj5CRAND4PC90ZXh0Pjwvc3ZnPgo='">
                        </div>
                        <span class="brand-name">${brand.name}</span>
                    </div>
                `).join('')}
                <div class="brand-card more-brands" data-brand="all">
                    <div class="brand-logo">
                        <span class="more-icon">+${DataService.getCarBrands(false).length}</span>
                    </div>
                    <span class="brand-name">Ещё марки</span>
                </div>
            </div>

            <!-- Категории -->
            <div class="section-header">
                <h3>Категории запчастей</h3>
            </div>
            <div class="categories">
                ${DataService.getCategories().map(category => `
                    <div class="card category-card" data-category="${category.id}">
                        <div class="category-icon">${category.icon}</div>
                        <h4>${category.title}</h4>
                        <p class="category-description">${category.description}</p>
                    </div>
                `).join('')}
            </div>

            <!-- Популярные товары -->
            <div class="section-header">
                <h3>Популярные товары</h3>
                <p class="section-subtitle">Часто покупаемые запчасти</p>
            </div>
            <div class="products">
                ${DataService.getProducts().slice(0, 6).map(product => `
                    <div class="card product-card" data-product-id="${product.id}">
                        <div class="product-badge">⭐ ${product.rating}</div>
                        <img src="${product.image}" alt="${product.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMzM0MTU1Ii8+PHRleHQgeD0iMTAwIiB5PSI2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk0QTNCOCIgZm9udC1zaXplPSIxNCI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+Cg=='">
                        <div class="product-info">
                            <h4>${product.title}</h4>
                            <p class="product-brand">${DataService.getCarBrand(product.brandId)?.name}</p>
                            <p class="product-price">${product.price} ₽</p>
                            <div class="product-actions">
                                <button class="btn-favorite ${DataService.userData.favorites.includes(product.id) ? 'active' : ''}" data-product-id="${product.id}">♡</button>
                                <button class="btn-add" data-product-id="${product.id}">В корзину</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        this.setupHomeEventListeners();
    }

    setupHomeEventListeners() {
        // Марки автомобилей
        document.querySelectorAll('.brand-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const brandId = e.currentTarget.getAttribute('data-brand');
                if (brandId === 'all') {
                    this.renderAllBrands();
                } else {
                    this.renderBrandProducts(brandId);
                }
            });
        });

        // Категории
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const categoryId = e.currentTarget.getAttribute('data-category');
                this.renderCategoryProducts(categoryId);
            });
        });

        // Кнопки "В корзину"
        document.querySelectorAll('.btn-add[data-product-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = e.target.getAttribute('data-product-id');
                const product = DataService.getProduct(productId);
                if (product) {
                    this.cart.addItem(product);
                    
                    btn.textContent = 'Добавлено!';
                    btn.style.background = '#059669';
                    setTimeout(() => {
                        btn.textContent = 'В корзину';
                        btn.style.background = '#10B981';
                    }, 1000);
                }
            });
        });

        // Кнопки избранного
        document.querySelectorAll('.btn-favorite').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = e.target.getAttribute('data-product-id');
                if (DataService.userData.favorites.includes(productId)) {
                    DataService.removeFromFavorites(productId);
                    btn.classList.remove('active');
                    btn.textContent = '♡';
                } else {
                    DataService.addToFavorites(productId);
                    btn.classList.add('active');
                    btn.textContent = '♥';
                }
            });
        });

        // Поиск
        document.getElementById('search-btn').addEventListener('click', () => {
            this.performSearch();
        });

        document.getElementById('search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // Просмотр товаров для истории
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('btn-add') && !e.target.classList.contains('btn-favorite')) {
                    const productId = card.getAttribute('data-product-id');
                    DataService.addToViewHistory(productId);
                    this.showProductDetails(productId);
                }
            });
        });
    }

    performSearch() {
        const query = document.getElementById('search-input').value.trim();
        if (query) {
            const results = DataService.searchProducts(query);
            this.renderSearchResults(query, results);
        }
    }

    renderProducts(categoryId) {
        const products = DataService.getProducts(categoryId);
        const category = DataService.getCategories().find(c => c.id === categoryId);
        
        const homeScreen = document.getElementById('home-screen');
        if (!homeScreen) return;

        homeScreen.innerHTML = `
            <div style="margin-bottom: 20px;">
                <button class="btn-back" onclick="window.app.renderHome()">← Назад к категориям</button>
            </div>
            <h3>${category.icon} ${category.title}</h3>
            <div class="products">
                ${products.map(product => `
                    <div class="card product-card">
                        <img src="${product.image}" alt="${product.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMzM0MTU1Ci8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5NEEzQjgiIGZvbnQtc2l6ZT0iMTQiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K'">
                        <h4>${product.title}</h4>
                        <p class="product-description">${product.description}</p>
                        <p class="product-price">${product.price} ₽</p>
                        <button class="btn-add" data-product-id="${product.id}">В корзину</button>
                    </div>
                `).join('')}
            </div>
        `;

        // Добавляем обработчики для кнопок "В корзину"
        document.querySelectorAll('.btn-add[data-product-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-product-id');
                const product = DataService.getProduct(productId);
                if (product) {
                    this.cart.addItem(product);
                    
                    // Визуальная обратная связь
                    btn.textContent = 'Добавлено!';
                    btn.style.background = '#059669';
                    setTimeout(() => {
                        btn.textContent = 'В корзину';
                        btn.style.background = '#10B981';
                    }, 1000);
                }
            });
        });
    }
}

// Глобально доступный объект приложения
window.app = new AutoPartsApp();