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
                    <svg class="car-icon" viewBox="0 0 280 120">
                        <defs>
                            <!-- Градиенты для фар -->
                            <radialGradient id="headlightGlow" cx="50%" cy="50%" r="60%">
                                <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:1" />
                                <stop offset="30%" style="stop-color:#FBBF24;stop-opacity:0.9" />
                                <stop offset="70%" style="stop-color:#F59E0B;stop-opacity:0.6" />
                                <stop offset="100%" style="stop-color:#D97706;stop-opacity:0.2" />
                            </radialGradient>
                            
                            <!-- Свечение фар -->
                            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                                <feMerge> 
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        
                        <!-- ПЕРЕДНЯЯ ЧАСТЬ BMW -->
                        
                        <!-- Капот -->
                        <path d="M40 35 L240 35 L235 55 L45 55 Z" fill="#C0C0C0" stroke="#A0A0A0" stroke-width="1"/>
                        
                        <!-- Решетка радиатора BMW (знаменитые "ноздри") -->
                        <g class="bmw-grille">
                            <!-- Левая ноздря -->
                            <path d="M120 45 Q125 40 130 45 Q125 55 120 50 Z" fill="#1A1A1A" stroke="#333" stroke-width="1"/>
                            <!-- Правая ноздря -->
                            <path d="M150 45 Q155 40 160 45 Q155 55 150 50 Z" fill="#1A1A1A" stroke="#333" stroke-width="1"/>
                            <!-- Центральная планка -->
                            <rect x="130" y="42" width="20" height="12" fill="#333" stroke="#555" stroke-width="1"/>
                            <!-- Хромированная рамка -->
                            <path d="M115 40 Q140 35 165 40 Q160 60 140 58 Q120 60 115 40" fill="none" stroke="#E5E5E5" stroke-width="2"/>
                        </g>
                        
                        <!-- Фары BMW (характерная форма "ангельские глазки") -->
                        <g class="bmw-headlights">
                            <!-- Левая фара -->
                            <g class="left-headlight">
                                <!-- Корпус фары -->
                                <ellipse cx="70" cy="48" rx="25" ry="12" fill="#E5E5E5" stroke="#C0C0C0" stroke-width="2"/>
                                <!-- Основной свет -->
                                <ellipse class="main-beam" cx="75" cy="48" rx="15" ry="8" fill="url(#headlightGlow)" filter="url(#glow)"/>
                                <!-- Ангельские глазки (характерные кольца BMW) -->
                                <circle class="angel-eye" cx="70" cy="48" r="10" fill="none" stroke="#FBBF24" stroke-width="2" opacity="0.8"/>
                                <circle class="angel-eye-inner" cx="70" cy="48" r="6" fill="none" stroke="#FFFFFF" stroke-width="1" opacity="0.6"/>
                                <!-- Отражатель -->
                                <ellipse cx="65" cy="45" rx="8" ry="4" fill="#F0F0F0" opacity="0.7"/>
                            </g>
                            
                            <!-- Правая фара -->
                            <g class="right-headlight">
                                <!-- Корпус фары -->
                                <ellipse cx="210" cy="48" rx="25" ry="12" fill="#E5E5E5" stroke="#C0C0C0" stroke-width="2"/>
                                <!-- Основной свет -->
                                <ellipse class="main-beam" cx="205" cy="48" rx="15" ry="8" fill="url(#headlightGlow)" filter="url(#glow)"/>
                                <!-- Ангельские глазки -->
                                <circle class="angel-eye" cx="210" cy="48" r="10" fill="none" stroke="#FBBF24" stroke-width="2" opacity="0.8"/>
                                <circle class="angel-eye-inner" cx="210" cy="48" r="6" fill="none" stroke="#FFFFFF" stroke-width="1" opacity="0.6"/>
                                <!-- Отражатель -->
                                <ellipse cx="215" cy="45" rx="8" ry="4" fill="#F0F0F0" opacity="0.7"/>
                            </g>
                        </g>
                        
                        <!-- Нижний бампер -->
                        <path d="M50 55 L230 55 L225 70 L55 70 Z" fill="#D0D0D0" stroke="#B0B0B0" stroke-width="1"/>
                        
                        <!-- Воздухозаборник в бампере -->
                        <rect x="110" y="58" width="60" height="8" fill="#2A2A2A" stroke="#444" stroke-width="1"/>
                        
                        <!-- Противотуманные фары -->
                        <circle cx="80" cy="62" r="6" fill="#E0E0E0" stroke="#C0C0C0" stroke-width="1"/>
                        <circle cx="200" cy="62" r="6" fill="#E0E0E0" stroke="#C0C0C0" stroke-width="1"/>
                        <circle class="fog-light left" cx="80" cy="62" r="3" fill="#FBBF24" opacity="0.7"/>
                        <circle class="fog-light right" cx="200" cy="62" r="3" fill="#FBBF24" opacity="0.7"/>
                        
                        <!-- BMW логотип (упрощенный) -->
                        <circle cx="140" cy="48" r="8" fill="#FFFFFF" stroke="#0066CC" stroke-width="2"/>
                        <path d="M135 43 Q140 40 145 43 Q140 53 135 48 Z" fill="#0066CC"/>
                        <path d="M145 43 Q140 53 135 48" fill="none" stroke="#FFFFFF" stroke-width="1"/>
                        
                        <!-- Свет от фар -->
                        <ellipse class="light-cone left" cx="30" cy="48" rx="35" ry="15" fill="url(#headlightGlow)" opacity="0.3" transform="rotate(-5 30 48)"/>
                        <ellipse class="light-cone right" cx="250" cy="48" rx="35" ry="15" fill="url(#headlightGlow)" opacity="0.3" transform="rotate(5 250 48)"/>
                    </svg>
                </div>
                <div class="hero-content">
                    <h1>Запчасти для любого автомобиля</h1>
                    <p>В наличии и под заказ • Оригинальные и аналоги • Быстрая доставка</p>
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

    renderBrandProducts(brandId) {
        const homeScreen = document.getElementById('home-screen');
        const brand = DataService.getCarBrand(brandId);
        const products = DataService.getProducts(brandId);

        homeScreen.innerHTML = `
            <div class="breadcrumb">
                <button class="btn-back" onclick="window.app.renderHome()">← Главная</button>
                <span class="breadcrumb-separator">/</span>
                <span>${brand.name}</span>
            </div>
            
            <div class="brand-header">
                <img src="${brand.logo}" alt="${brand.name}" class="brand-logo-large">
                <div>
                    <h2>${brand.name}</h2>
                    <p>Найдено ${products.length} товаров</p>
                </div>
            </div>

            <div class="categories">
                ${DataService.getCategories().map(category => {
                    const categoryProducts = DataService.getProducts(brandId, category.id);
                    return `
                        <div class="card category-card ${categoryProducts.length === 0 ? 'disabled' : ''}" 
                             ${categoryProducts.length > 0 ? `onclick="window.app.renderBrandCategoryProducts('${brandId}', '${category.id}')"` : ''}>
                            <div class="category-icon">${category.icon}</div>
                            <h4>${category.title}</h4>
                            <p class="category-count">${categoryProducts.length} товаров</p>
                        </div>
                    `;
                }).join('')}
            </div>

            <h3>Все товары ${brand.name}</h3>
            <div class="products">
                ${products.map(product => `
                    <div class="card product-card" data-product-id="${product.id}">
                        <div class="product-badge">⭐ ${product.rating}</div>
                        <img src="${product.image}" alt="${product.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMzM0MTU1Ii8+PHRleHQgeD0iMTAwIiB5PSI2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk0QTNCOCIgZm9udC1zaXplPSIxNCI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+Cg=='">
                        <div class="product-info">
                            <h4>${product.title}</h4>
                            <p class="product-brand">${brand.name}</p>
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

        this.setupProductEventListeners();
    }

    renderCategoryProducts(categoryId) {
        const homeScreen = document.getElementById('home-screen');
        const category = DataService.getCategory(categoryId);
        const products = DataService.getProducts(null, categoryId);

        homeScreen.innerHTML = `
            <div class="breadcrumb">
                <button class="btn-back" onclick="window.app.renderHome()">← Главная</button>
                <span class="breadcrumb-separator">/</span>
                <span>${category.title}</span>
            </div>
            
            <div class="category-header">
                <div class="category-icon-large">${category.icon}</div>
                <div>
                    <h2>${category.title}</h2>
                    <p>${category.description}</p>
                    <span class="product-count">Найдено ${products.length} товаров</span>
                </div>
            </div>

            <div class="products">
                ${products.map(product => `
                    <div class="card product-card" data-product-id="${product.id}">
                        <div class="product-badge">⭐ ${product.rating}</div>
                        <img src="${product.image}" alt="${product.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMzM0MTU1Ci8+PHRleHQgeD0iMTAwIiB5PSI2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk0QTNCOCIgZm9udC1zaXplPSIxNCI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+Cg=='">
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

        this.setupProductEventListeners();
    }

    renderAllBrands() {
        const homeScreen = document.getElementById('home-screen');
        const allBrands = DataService.getCarBrands();

        homeScreen.innerHTML = `
            <div class="breadcrumb">
                <button class="btn-back" onclick="window.app.renderHome()">← Главная</button>
                <span class="breadcrumb-separator">/</span>
                <span>Все марки</span>
            </div>
            
            <h2>Все марки автомобилей</h2>
            
            <div class="car-brands-all">
                ${allBrands.map(brand => {
                    const brandProducts = DataService.getProducts(brand.id);
                    return `
                        <div class="brand-card-large" data-brand="${brand.id}">
                            <div class="brand-logo">
                                <img src="${brand.logo}" alt="${brand.name}">
                            </div>
                            <div class="brand-info">
                                <h4>${brand.name}</h4>
                                <p>${brandProducts.length} товаров</p>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        // Добавляем обработчики
        document.querySelectorAll('.brand-card-large').forEach(card => {
            card.addEventListener('click', (e) => {
                const brandId = e.currentTarget.getAttribute('data-brand');
                this.renderBrandProducts(brandId);
            });
        });
    }

    setupProductEventListeners() {
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

        // Клик по товару для просмотра деталей
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

    showProductDetails(productId) {
        const product = DataService.getProduct(productId);
        if (!product) return;

        const brand = DataService.getCarBrand(product.brandId);
        const category = DataService.getCategory(product.categoryId);
        const homeScreen = document.getElementById('home-screen');

        homeScreen.innerHTML = `
            <div class="breadcrumb">
                <button class="btn-back" onclick="window.app.goBack()">← Назад</button>
                <span class="breadcrumb-separator">/</span>
                <span>${brand?.name}</span>
                <span class="breadcrumb-separator">/</span>
                <span>${category?.title}</span>
                <span class="breadcrumb-separator">/</span>
                <span>${product.title}</span>
            </div>

            <div class="product-detail">
                <div class="product-detail-image">
                    <img src="${product.image}" alt="${product.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMzM0MTU1Ii8+PHRleHQgeD0iMjAwIiB5PSIxNTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5NEEzQjgiIGZvbnQtc2l6ZT0iMTgiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPgo='">
                    <div class="product-rating">
                        <span class="rating-stars">⭐⭐⭐⭐⭐</span>
                        <span class="rating-value">${product.rating}</span>
                        <span class="rating-count">(${product.reviews} отзывов)</span>
                    </div>
                </div>

                <div class="product-detail-info">
                    <div class="product-detail-header">
                        <h1>${product.title}</h1>
                        <button class="btn-favorite-large ${DataService.userData.favorites.includes(productId) ? 'active' : ''}" data-product-id="${productId}">
                            ${DataService.userData.favorites.includes(productId) ? '♥' : '♡'}
                        </button>
                    </div>

                    <div class="product-meta">
                        <div class="meta-item">
                            <span class="meta-label">Артикул:</span>
                            <span class="meta-value">${product.article}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Производитель:</span>
                            <span class="meta-value">${product.manufacturer}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Марка автомобиля:</span>
                            <span class="meta-value">${brand?.name}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Категория:</span>
                            <span class="meta-value">${category?.title}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Наличие:</span>
                            <span class="meta-value ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                                ${product.inStock ? '✅ В наличии' : '❌ Нет в наличии'}
                            </span>
                        </div>
                    </div>

                    <div class="product-description">
                        <h3>Описание</h3>
                        <p>${product.description}</p>
                    </div>

                    ${product.compatibility ? `
                        <div class="product-compatibility">
                            <h3>Совместимость</h3>
                            <div class="compatibility-list">
                                ${product.compatibility.map(model => `
                                    <span class="compatibility-item">${model}</span>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <div class="product-actions-detail">
                        <div class="price-section">
                            <span class="current-price">${product.price.toLocaleString()} ₽</span>
                            <span class="price-note">за штуку</span>
                        </div>
                        <div class="action-buttons">
                            <button class="btn-add-large" data-product-id="${productId}" ${!product.inStock ? 'disabled' : ''}>
                                ${!product.inStock ? 'Нет в наличии' : 'Добавить в корзину'}
                            </button>
                            <button class="btn-buy-now" data-product-id="${productId}" ${!product.inStock ? 'disabled' : ''}>
                                Купить сейчас
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="related-products">
                <h3>Похожие товары</h3>
                <div class="products">
                    ${DataService.getProducts(product.brandId, product.categoryId)
                        .filter(p => p.id !== productId)
                        .slice(0, 4)
                        .map(relatedProduct => `
                            <div class="card product-card" data-product-id="${relatedProduct.id}">
                                <div class="product-badge">⭐ ${relatedProduct.rating}</div>
                                <img src="${relatedProduct.image}" alt="${relatedProduct.title}">
                                <div class="product-info">
                                    <h4>${relatedProduct.title}</h4>
                                    <p class="product-price">${relatedProduct.price} ₽</p>
                                    <div class="product-actions">
                                        <button class="btn-favorite ${DataService.userData.favorites.includes(relatedProduct.id) ? 'active' : ''}" data-product-id="${relatedProduct.id}">♡</button>
                                        <button class="btn-add" data-product-id="${relatedProduct.id}">В корзину</button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                </div>
            </div>
        `;

        this.setupProductDetailEventListeners();
    }

    setupProductDetailEventListeners() {
        // Кнопка добавления в корзину
        document.querySelectorAll('.btn-add-large, .btn-add').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = e.target.getAttribute('data-product-id');
                const product = DataService.getProduct(productId);
                if (product) {
                    this.cart.addItem(product);
                    
                    btn.textContent = 'Добавлено!';
                    btn.style.background = '#059669';
                    setTimeout(() => {
                        btn.textContent = e.target.classList.contains('btn-add-large') ? 'Добавить в корзину' : 'В корзину';
                        btn.style.background = '#10B981';
                    }, 1500);
                }
            });
        });

        // Кнопка "Купить сейчас"
        document.querySelectorAll('.btn-buy-now').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-product-id');
                const product = DataService.getProduct(productId);
                if (product) {
                    this.cart.addItem(product);
                    this.showScreen('checkout');
                }
            });
        });

        // Кнопки избранного
        document.querySelectorAll('.btn-favorite, .btn-favorite-large').forEach(btn => {
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

        // Клик по похожим товарам
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