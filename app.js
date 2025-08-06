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

        homeScreen.innerHTML = `
            <h3>Категории</h3>
            <div class="categories">
                ${DataService.getCategories().map(category => `
                    <div class="card category-card" data-category="${category.id}">
                        <h4>${category.icon} ${category.title}</h4>
                    </div>
                `).join('')}
            </div>

            <h3>Популярные товары</h3>
            <div class="products">
                ${DataService.getProducts().slice(0, 6).map(product => `
                    <div class="card product-card">
                        <img src="${product.image}" alt="${product.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMzM0MTU1Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5NEEzQjgiIGZvbnQtc2l6ZT0iMTQiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K'">
                        <h4>${product.title}</h4>
                        <p class="product-price">${product.price} ₽</p>
                        <button class="btn-add" data-product-id="${product.id}">В корзину</button>
                    </div>
                `).join('')}
            </div>
        `;

        // Добавляем обработчики для категорий
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const categoryId = e.currentTarget.getAttribute('data-category');
                this.renderProducts(categoryId);
            });
        });

        // Добавляем обработчики для кнопок "В корзину"
        document.querySelectorAll('.btn-add[data-product-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
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