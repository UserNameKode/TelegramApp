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
                    <svg class="car-icon" viewBox="0 0 320 160">
                        <defs>
                            <!-- Градиенты для фар -->
                            <radialGradient id="headlightGlow" cx="50%" cy="50%" r="70%">
                                <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:1" />
                                <stop offset="20%" style="stop-color:#FBBF24;stop-opacity:0.9" />
                                <stop offset="60%" style="stop-color:#F59E0B;stop-opacity:0.7" />
                                <stop offset="100%" style="stop-color:#D97706;stop-opacity:0.3" />
                            </radialGradient>
                            
                            <!-- Свечение фар -->
                            <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
                                <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                                <feMerge> 
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>

                            <!-- Металлический градиент -->
                            <linearGradient id="metalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style="stop-color:#F8F9FA;stop-opacity:1" />
                                <stop offset="30%" style="stop-color:#E9ECEF;stop-opacity:1" />
                                <stop offset="70%" style="stop-color:#CED4DA;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#ADB5BD;stop-opacity:1" />
                            </linearGradient>
                        </defs>
                        
                        <!-- РЕАЛИСТИЧНЫЙ АВТОМОБИЛЬ (вид спереди) -->
                        
                        <!-- Основной кузов и капот -->
                        <path d="M60 40 L260 40 L280 65 L280 100 L40 100 L40 65 Z" fill="url(#metalGrad)" stroke="#6C757D" stroke-width="2"/>
                        
                        <!-- Лобовое стекло -->
                        <path d="M70 50 L250 50 L265 70 L55 70 Z" fill="#4FC3F7" opacity="0.6" stroke="#0277BD" stroke-width="1"/>
                        
                        <!-- Решетка радиатора (более крупная и заметная) -->
                        <g class="car-grille">
                            <rect x="120" y="65" width="80" height="25" fill="#212529" stroke="#6C757D" stroke-width="2" rx="4"/>
                            <!-- Горизонтальные планки решетки -->
                            <line x1="125" y1="70" x2="195" y2="70" stroke="#ADB5BD" stroke-width="2"/>
                            <line x1="125" y1="75" x2="195" y2="75" stroke="#ADB5BD" stroke-width="2"/>
                            <line x1="125" y1="80" x2="195" y2="80" stroke="#ADB5BD" stroke-width="2"/>
                            <line x1="125" y1="85" x2="195" y2="85" stroke="#ADB5BD" stroke-width="2"/>
                            <!-- Центральный логотип -->
                            <circle cx="160" cy="77" r="8" fill="#E9ECEF" stroke="#6C757D" stroke-width="2"/>
                        </g>
                        
                        <!-- БОЛЬШИЕ ФАРЫ (главный элемент!) -->
                        <g class="car-headlights">
                            <!-- Левая фара -->
                            <g class="left-headlight">
                                <!-- Корпус фары (большой и заметный) -->
                                <ellipse cx="90" cy="75" rx="30" ry="20" fill="#F8F9FA" stroke="#6C757D" stroke-width="3"/>
                                <!-- Внутренняя часть фары -->
                                <ellipse cx="90" cy="75" rx="25" ry="16" fill="#E9ECEF" stroke="#ADB5BD" stroke-width="1"/>
                                <!-- Основной луч (яркий и заметный) -->
                                <ellipse class="main-beam" cx="90" cy="75" rx="18" ry="12" fill="url(#headlightGlow)" filter="url(#glow)"/>
                                <!-- Дополнительные светодиоды -->
                                <circle cx="85" cy="70" r="3" fill="#FBBF24" opacity="0.9"/>
                                <circle cx="95" cy="70" r="3" fill="#FBBF24" opacity="0.9"/>
                                <circle cx="85" cy="80" r="3" fill="#FBBF24" opacity="0.9"/>
                                <circle cx="95" cy="80" r="3" fill="#FBBF24" opacity="0.9"/>
                                <!-- Отражатель -->
                                <ellipse cx="90" cy="75" rx="8" ry="5" fill="#FFF3CD" opacity="0.8"/>
                            </g>
                            
                            <!-- Правая фара -->
                            <g class="right-headlight">
                                <!-- Корпус фары -->
                                <ellipse cx="230" cy="75" rx="30" ry="20" fill="#F8F9FA" stroke="#6C757D" stroke-width="3"/>
                                <!-- Внутренняя часть фары -->
                                <ellipse cx="230" cy="75" rx="25" ry="16" fill="#E9ECEF" stroke="#ADB5BD" stroke-width="1"/>
                                <!-- Основной луч -->
                                <ellipse class="main-beam" cx="230" cy="75" rx="18" ry="12" fill="url(#headlightGlow)" filter="url(#glow)"/>
                                <!-- Дополнительные светодиоды -->
                                <circle cx="225" cy="70" r="3" fill="#FBBF24" opacity="0.9"/>
                                <circle cx="235" cy="70" r="3" fill="#FBBF24" opacity="0.9"/>
                                <circle cx="225" cy="80" r="3" fill="#FBBF24" opacity="0.9"/>
                                <circle cx="235" cy="80" r="3" fill="#FBBF24" opacity="0.9"/>
                                <!-- Отражатель -->
                                <ellipse cx="230" cy="75" rx="8" ry="5" fill="#FFF3CD" opacity="0.8"/>
                            </g>
                        </g>
                        
                        <!-- Нижний бампер -->
                        <path d="M50 90 L270 90 L280 110 L40 110 Z" fill="url(#metalGrad)" stroke="#6C757D" stroke-width="2"/>
                        
                        <!-- Номерной знак -->
                        <rect x="135" y="95" width="50" height="12" fill="#FFFFFF" stroke="#212529" stroke-width="1" rx="2"/>
                        <text x="160" y="103" text-anchor="middle" fill="#212529" font-size="8" font-family="Arial">A123BC</text>
                        
                        <!-- Противотуманные фары -->
                        <circle cx="100" cy="100" r="8" fill="#F8F9FA" stroke="#6C757D" stroke-width="2"/>
                        <circle cx="220" cy="100" r="8" fill="#F8F9FA" stroke="#6C757D" stroke-width="2"/>
                        <circle class="fog-light left" cx="100" cy="100" r="5" fill="#FBBF24" opacity="0.8"/>
                        <circle class="fog-light right" cx="220" cy="100" r="5" fill="#FBBF24" opacity="0.8"/>
                        
                        <!-- МОЩНЫЕ СВЕТОВЫЕ ЛУЧИ ОТ ФАР -->
                        <ellipse class="light-cone left" cx="40" cy="75" rx="50" ry="25" fill="url(#headlightGlow)" opacity="0.4" transform="rotate(-8 40 75)"/>
                        <ellipse class="light-cone right" cx="280" cy="75" rx="50" ry="25" fill="url(#headlightGlow)" opacity="0.4" transform="rotate(8 280 75)"/>
                        
                        <!-- Дополнительные лучи для реализма -->
                        <ellipse class="light-beam-extra left" cx="20" cy="75" rx="30" ry="15" fill="#FBBF24" opacity="0.2" transform="rotate(-8 20 75)"/>
                        <ellipse class="light-beam-extra right" cx="300" cy="75" rx="30" ry="15" fill="#FBBF24" opacity="0.2" transform="rotate(8 300 75)"/>
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