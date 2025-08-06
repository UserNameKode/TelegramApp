// Модуль инициализация приложения
class AutoPartsApp {
    constructor() {
        this.screens = {
            home: document.getElementById('home-screen'),
            product: document.getElementById('product-screen'),
            cart: document.getElementById('cart-screen'),
            checkout: document.getElementById('checkout-screen'),
            profile: document.getElementById('profile-screen')
        };
        // Навигация
        document.querySelectorAll('button[data-screen], .btn-back').forEach(btn => {
            btn.addEventListener('click', () => {
                const screen = btn.dataset.screen;
                if (screen) this.showScreen(screen);
            });
        });
        // Инициализация модулей
        window.cart = new Cart();
        window.profile = new Profile();
        window.checkout = new Checkout();
    }

    init() {
        this.showScreen('home');
        this.renderHome();
    }

    showScreen(id) {
        Object.keys(this.screens).forEach(key => {
            const section = this.screens[key];
            if (key === id) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }

    renderHome() {
        const home = this.screens.home;
        home.innerHTML = `
            <h3>Категории</h3>
            <div class="categories"></div>
            <h3>Товары</h3>
            <div class="products"></div>
        `;
        const categoriesEl = home.querySelector('.categories');
        DataService.getCategories().forEach(cat => {
            const card = document.createElement('div');
            card.className = 'card';
            card.textContent = cat.title;
            card.onclick = () => this.renderProducts(cat.id);
            categoriesEl.append(card);
        });
        this.renderProducts();
    }

    renderProducts(categoryId = null) {
        const prodContainer = this.screens.home.querySelector('.products');
        prodContainer.innerHTML = '';
        DataService.getProducts(categoryId).forEach(prod => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${prod.image}" alt="${prod.title}">
                <h4>${prod.title}</h4>
                <p>${prod.price} ₽</p>
                <button class="btn-add">В корзину</button>
            `;
            card.querySelector('.btn-add').addEventListener('click', () => {
                window.cart.addItem(prod);
            });
            prodContainer.append(card);
        });
    }
}

// Инициализация приложения
window.app = new AutoPartsApp();
window.app.init();