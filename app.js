class AutoPartsApp {
    constructor() {
        this.currentScreen = 'home';
        this.cart = null;
        this.profile = null;
        this.checkout = null;
        this._searchDebounceTimer = null;
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

        // Скрываем кнопку назад на главной странице
        const backBtn = document.getElementById('nav-back-btn');
        if (backBtn) {
            backBtn.style.display = 'none';
        }

        const userLevel = DataService.getUserLevel();

        homeScreen.innerHTML = `
            <!-- Автомобильная шапка -->
            <div class="hero-banner">
                <div class="car-animation">
                    <div class="car-photo-container">
                        <!-- Контейнер для Lottie-анимации автомобиля -->
                        <div id="car-lottie" class="car-photo" aria-label="Анимация автомобиля"></div>
                        
                        <!-- Фоллбек убран: используем только Lottie -->
                    </div>
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

            <!-- Живые результаты поиска (без перерисовки поля ввода) -->
            <div id="live-search-results"></div>

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

        // Если доступна Lottie, подгружаем анимацию Mustang (локально с фоллбеком)
        if (window.lottie) {
            const container = document.getElementById('car-lottie');
            const fallbackUrl = 'https://assets7.lottiefiles.com/packages/lf20_Vf1VfF.json';
            const localUrl = 'Mustang.json';

            const loadFromData = (data) => {
                try { if (window.__carLottie && window.__carLottie.destroy) window.__carLottie.destroy(); } catch(_) {}
                const anim = lottie.loadAnimation({
                    container,
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    animationData: data
                });
                try { anim.setSpeed(1.15); } catch(_) {}
                window.__carLottie = anim;
            };

            const loadFromPath = (url) => {
                try { if (window.__carLottie && window.__carLottie.destroy) window.__carLottie.destroy(); } catch(_) {}
                const anim = lottie.loadAnimation({ container, renderer: 'svg', loop: true, autoplay: true, path: url });
                try { anim.setSpeed(1.15); } catch(_) {}
                window.__carLottie = anim;
            };

            // Пытаемся загрузить локальный JSON и отдать его как animationData (надёжнее для GitHub Pages)
            fetch(localUrl, { cache: 'no-store' })
                .then(r => r.ok ? r.json() : Promise.reject())
                .then(data => loadFromData(data))
                .catch(() => loadFromPath(fallbackUrl));

            // Автовосстановление анимации при скрытии/показе WebView
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible' && window.__carLottie) {
                    try { window.__carLottie.play(); } catch(_) {}
                }
            });
        }

        this.setupHomeEventListeners();
        this.setupUIEffects();
    }

    performSearch() {
        console.log('🔍 === ЗАПУСК ПОИСКА ===');
        
        const searchInput = document.getElementById('search-input');
        if (!searchInput) {
            console.error('❌ Поле поиска не найдено!');
            return;
        }
        
        const query = searchInput.value.trim();
        console.log('📝 Запрос поиска:', `"${query}"`);
        
        if (query.length < 1) {
            console.log('🔄 Пустой запрос, возвращаемся на главную');
            this.renderHome();
            return;
        }

        console.log('🔎 Выполняем поиск...');
        const searchResults = DataService.searchProducts(query);
        console.log(`✅ Найдено товаров: ${searchResults.length}`);
        
        if (searchResults.length > 0) {
            console.log('📦 Первые результаты:', searchResults.slice(0, 3));
        }
        
        // Показываем кнопку назад для результатов поиска
        const backBtn = document.getElementById('nav-back-btn');
        if (backBtn) {
            backBtn.style.display = 'block';
        }
        
        this.renderSearchResults(searchResults, query);
    }

    renderSearchResults(results, query) {
        const homeScreen = document.getElementById('home-screen');
        homeScreen.innerHTML = `
            <div class="search-results">
                <div class="search-header">
                    <button class="btn-back" onclick="window.app.renderHome()">← Назад</button>
                    <h2>Результаты поиска: "${query}"</h2>
                    <p class="search-count">Найдено ${results.length} товаров</p>
                </div>
                
                <div class="search-input-container">
                    <input type="text" id="search-input" placeholder="Поиск по артикулу, названию или VIN..." value="${query}">
                    <button class="search-btn" id="search-btn">🔍</button>
                </div>

                ${results.length > 0 ? `
                    <div class="products search-products">
                        ${results.map(product => {
                            const brand = DataService.getCarBrand(product.brandId);
                            return `
                                <div class="card product-card" data-product-id="${product.id}">
                                    <div class="product-badge">⭐ ${product.rating}</div>
                                    <img src="${product.image}" alt="${product.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMzM0MTU1Ii8+PHRleHQgeD0iMTAwIiB5PSI2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk0QTNCOCIgZm9udC1zaXplPSIxNCI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+Cg=='">
                                    <div class="product-info">
                                        <h4>${product.title}</h4>
                                        <p class="product-brand">${brand?.name}</p>
                                        <p class="product-article">Артикул: ${product.article}</p>
                                        <p class="product-price">${product.price.toLocaleString()} ₽</p>
                                        <div class="product-actions">
                                            <button class="btn-favorite ${DataService.userData.favorites.includes(product.id) ? 'active' : ''}" data-product-id="${product.id}">♡</button>
                                            <button class="btn-add" data-product-id="${product.id}">В корзину</button>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : `
                    <div class="no-results">
                        <div class="no-results-icon">🔍</div>
                        <h3>Ничего не найдено</h3>
                        <p>Попробуйте изменить поисковой запрос или проверьте правильность написания.</p>
                        <button class="btn-back-search" onclick="window.app.renderHome()">Вернуться к каталогу</button>
                    </div>
                `}
            </div>
        `;

        this.setupSearchEventListeners();
    }

    setupSearchEventListeners() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');

        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.performSearch();
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSearch();
            });
        }

        // Обработчики для товаров в результатах поиска
        this.setupProductEventListeners();
        this.setupUIEffects();
    }

    applyFilter(filter) {
        let filteredProducts = DataService.getProducts();
        
        switch(filter) {
            case 'inStock':
                filteredProducts = filteredProducts.filter(p => p.inStock);
                break;
            case 'popular':
                filteredProducts = filteredProducts.filter(p => p.rating >= 4.5);
                break;
            case 'all':
            default:
                // Показываем все товары
                break;
        }

        this.renderFilteredProducts(filteredProducts, filter);
    }

    renderFilteredProducts(products, filterType) {
        const productsContainer = document.querySelector('.products');
        if (!productsContainer) return;

        const filterTitle = {
            'all': 'Все товары',
            'inStock': 'Товары в наличии', 
            'popular': 'Популярные товары'
        };

        productsContainer.innerHTML = products.slice(0, 12).map(product => `
            <div class="card product-card" data-product-id="${product.id}">
                <div class="product-badge">⭐ ${product.rating}</div>
                <img src="${product.image}" alt="${product.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMzM0MTU1Ii8+PHRleHQgeD0iMTAwIiB5PSI2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk0QTNCOCIgZm9udC1zaXplPSIxNCI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+Cg=='">
                <div class="product-info">
                    <h4>${product.title}</h4>
                    <p class="product-brand">${DataService.getCarBrand(product.brandId)?.name}</p>
                    <p class="product-price">${product.price.toLocaleString()} ₽</p>
                    <div class="product-actions">
                        <button class="btn-favorite ${DataService.userData.favorites.includes(product.id) ? 'active' : ''}" data-product-id="${product.id}">♡</button>
                        <button class="btn-add" data-product-id="${product.id}">В корзину</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Обновляем заголовок секции
        const sectionHeader = document.querySelector('.products').previousElementSibling;
        if (sectionHeader && sectionHeader.classList.contains('section-header')) {
            sectionHeader.querySelector('h3').textContent = filterTitle[filterType] || 'Товары';
            const subtitle = sectionHeader.querySelector('.section-subtitle');
            if (subtitle) {
                subtitle.textContent = `Показано ${products.length} товаров`;
            }
        }

        this.setupProductEventListeners();
        this.setupUIEffects();
    }

    setupHomeEventListeners() {
        // Поиск
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        const liveResults = document.getElementById('live-search-results');

        if (searchInput) {
            console.log('=== НАСТРОЙКА ПОИСКА ===');
            console.log('Поле поиска найдено:', searchInput);

            // Дебаунс-обработка ввода, без перерисовки всей страницы
            searchInput.addEventListener('input', (e) => {
                const value = e.target.value;
                clearTimeout(this._searchDebounceTimer);
                this._searchDebounceTimer = setTimeout(() => {
                    const query = value.trim();
                    if (query.length < 1) { if (liveResults) liveResults.innerHTML = ''; return; }
                    const results = DataService.searchProducts(query).slice(0, 6);
                    if (liveResults) {
                        liveResults.innerHTML = results.length ? `
                            <div class="products search-products mini">
                              ${results.map(p => `
                                <div class=\"card product-card\" data-product-id=\"${p.id}\">
                                  <img src=\"${p.image}\" alt=\"${p.title}\"/>
                                  <div class=\"product-info\">
                                    <h4>${p.title}</h4>
                                    <p class=\"product-brand\">${DataService.getCarBrand(p.brandId)?.name || ''}</p>
                                    <p class=\"product-price\">${(p.price||0).toLocaleString()} ₽</p>
                                  </div>
                                </div>`).join('')}
                            </div>
                        ` : '<div class="no-results small">Ничего не найдено</div>';
                        // навешиваем обработчики на мини-карточки
                        this.setupProductEventListeners();
                    }
                }, 220);
            });

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch();
                    setTimeout(() => {
                        const si = document.getElementById('search-input');
                        if (si) si.focus();
                    }, 0);
                }
            });
        } else {
            console.error('❌ ПОЛЕ ПОИСКА НЕ НАЙДЕНО!');
        }

        if (searchBtn) {
            console.log('Кнопка поиска найдена:', searchBtn);
            
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('КЛИК ПО КНОПКЕ ПОИСКА');
                this.performSearch();
            });
        } else {
            console.error('❌ КНОПКА ПОИСКА НЕ НАЙДЕНА!');
        }

        // Фильтры
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                // Убираем активный класс со всех чипов
                document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                // Добавляем активный класс к нажатому
                e.target.classList.add('active');
                
                const filter = e.target.getAttribute('data-filter');
                this.applyFilter(filter);
            });
        });

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
        this.setupUIEffects();
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
                    console.log(`КАТЕГОРИЯ ${category.title}: ${categoryProducts.length} товаров для бренда ${brandId}`);
                    return `
                        <div class="card category-card clickable-category" 
                             data-brand="${brandId}" 
                             data-category="${category.id}"
                             onclick="window.app.renderBrandCategoryProducts('${brandId}', '${category.id}')">
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
                const targetButton = e.currentTarget;
                const productId = targetButton.getAttribute('data-product-id');
                const product = DataService.getProduct(productId);
                if (product) {
                    this.cart.addItem(product);

                    targetButton.textContent = 'Добавлено!';
                    targetButton.style.background = '#059669';
                    setTimeout(() => {
                        targetButton.textContent = targetButton.classList.contains('btn-add-large') ? 'Добавить в корзину' : 'В корзину';
                        targetButton.style.background = '#10B981';
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
                const targetButton = e.currentTarget; // гарантированно сама кнопка
                const productId = targetButton.getAttribute('data-product-id');
                const product = DataService.getProduct(productId);
                if (product) {
                    this.cart.addItem(product);

                    // Визуальная обратная связь
                    targetButton.textContent = 'Добавлено!';
                    targetButton.style.background = '#059669';
                    setTimeout(() => {
                        targetButton.textContent = 'В корзину';
                        targetButton.style.background = '#10B981';
                    }, 1000);
                }
            });
        });
        this.setupUIEffects();
    }
}

// Глобально доступный объект приложения
window.app = new AutoPartsApp();

// Визуальные микроэффекты: параллакс, плавные ховеры, пульс фильтров
AutoPartsApp.prototype.setupUIEffects = function(rootElement) {
    const root = rootElement || document;

    const maxTilt = 6; // градусов
    const applyTilt = (el, e) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        const rotateX = (dy * -maxTilt).toFixed(2);
        const rotateY = (dx * maxTilt).toFixed(2);
        el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    const resetTilt = (el) => { el.style.transform = ''; };

    root.querySelectorAll('.card').forEach(card => {
        if (card.__tiltBound) return;
        card.__tiltBound = true;
        card.addEventListener('mousemove', (e) => applyTilt(card, e));
        card.addEventListener('mouseleave', () => resetTilt(card));
        card.addEventListener('touchstart', () => resetTilt(card), { passive: true });
    });

    root.querySelectorAll('.brand-card').forEach(card => {
        if (card.__brandBound) return;
        card.__brandBound = true;
        card.addEventListener('mouseenter', () => card.classList.add('hovered'));
        card.addEventListener('mouseleave', () => card.classList.remove('hovered'));
    });

    root.querySelectorAll('.filter-chip').forEach(chip => {
        if (chip.__chipBound) return;
        chip.__chipBound = true;
        chip.addEventListener('click', () => {
            chip.classList.add('pulse');
            setTimeout(() => chip.classList.remove('pulse'), 240);
        });
    });
};