// Сервис для работы с данными
class DataService {
    constructor() {
        this.categories = [
            {
                id: 'engine',
                title: 'Двигатель и компоненты',
                image: 'https://i.ibb.co/9T4Vv0m/engine.jpg',
                count: 5,
                description: 'Двигатели, поршни, клапаны и другие компоненты'
            },
            {
                id: 'brake',
                title: 'Тормозная система',
                image: 'https://i.ibb.co/1RW9ykw/brake.jpg',
                count: 3,
                description: 'Тормозные диски, колодки, суппорты'
            },
            {
                id: 'suspension',
                title: 'Подвеска и ходовая',
                image: 'https://i.ibb.co/0M8yh7c/suspension.jpg',
                count: 4,
                description: 'Амортизаторы, пружины, рычаги'
            },
            {
                id: 'electrical',
                title: 'Электрооборудование',
                image: 'https://i.ibb.co/vw8YM0L/electrical.jpg',
                count: 3,
                description: 'Генераторы, стартеры, датчики'
            },
            {
                id: 'body',
                title: 'Кузовные детали',
                image: 'https://i.ibb.co/Kj3kW9v/body.jpg',
                count: 2,
                description: 'Капоты, крылья, бамперы'
            }
        ];

        this.products = [
            // Двигатель
            {
                id: 'engine-1',
                categoryId: 'engine',
                title: 'Поршневая группа ВАЗ 2110',
                price: 12500,
                image: 'https://i.ibb.co/3WJQd1H/vaz-piston.jpg',
                description: 'Комплект поршневой группы для ВАЗ 2110. Включает поршни, кольца и пальцы.',
                manufacturer: 'АвтоВАЗ',
                article: 'PG-2110-001'
            },
            {
                id: 'engine-2',
                categoryId: 'engine',
                title: 'Комплект ГРМ Ford Focus',
                price: 8900,
                image: 'https://i.ibb.co/XxTNGxk/ford-timing.jpg',
                description: 'Комплект ГРМ для Ford Focus 2.0. Ремень, ролики, натяжитель.',
                manufacturer: 'Gates',
                article: 'K015603XS'
            },
            {
                id: 'engine-3',
                categoryId: 'engine',
                title: 'Масляный насос Toyota',
                price: 5600,
                image: 'https://i.ibb.co/Lx6ztyL/toyota-oil.jpg',
                description: 'Масляный насос для Toyota Camry 2.4. Оригинал.',
                manufacturer: 'Toyota',
                article: '15100-28020'
            },

            // Тормоза
            {
                id: 'brake-1',
                categoryId: 'brake',
                title: 'Дисковые тормоза Brembo',
                price: 15800,
                image: 'https://i.ibb.co/GCwPnxP/brembo.jpg',
                description: 'Комплект передних тормозных дисков Brembo. Высокая производительность.',
                manufacturer: 'Brembo',
                article: '09.C881.13'
            },
            {
                id: 'brake-2',
                categoryId: 'brake',
                title: 'Колодки Ferodo BMW',
                price: 4500,
                image: 'https://i.ibb.co/W2zqBgL/ferodo.jpg',
                description: 'Передние тормозные колодки Ferodo для BMW 3 серии.',
                manufacturer: 'Ferodo',
                article: 'FDB4765'
            },

            // Подвеска
            {
                id: 'suspension-1',
                categoryId: 'suspension',
                title: 'Амортизаторы KYB',
                price: 7800,
                image: 'https://i.ibb.co/0mbL3Qp/kyb.jpg',
                description: 'Передние амортизаторы KYB для Honda Civic. Комплект 2 шт.',
                manufacturer: 'KYB',
                article: '334841'
            },
            {
                id: 'suspension-2',
                categoryId: 'suspension',
                title: 'Рычаги Audi',
                price: 12300,
                image: 'https://i.ibb.co/C1j7tYd/audi-arm.jpg',
                description: 'Комплект передних рычагов для Audi A4 B8.',
                manufacturer: 'Lemförder',
                article: '3463202'
            },

            // Электрика
            {
                id: 'electrical-1',
                categoryId: 'electrical',
                title: 'Генератор Bosch',
                price: 18500,
                image: 'https://i.ibb.co/9gGGfRz/bosch-gen.jpg',
                description: 'Генератор Bosch для Volkswagen Polo 1.6.',
                manufacturer: 'Bosch',
                article: '0124525087'
            },
            {
                id: 'electrical-2',
                categoryId: 'electrical',
                title: 'Стартер Valeo',
                price: 14200,
                image: 'https://i.ibb.co/xS8zfCN/valeo-starter.jpg',
                description: 'Стартер Valeo для Renault Logan. Новый.',
                manufacturer: 'Valeo',
                article: '458204'
            },

            // Кузов
            {
                id: 'body-1',
                categoryId: 'body',
                title: 'Капот Hyundai Solaris',
                price: 21500,
                image: 'https://i.ibb.co/mCgbb7h/solaris-hood.jpg',
                description: 'Капот для Hyundai Solaris 2017+. Оригинал.',
                manufacturer: 'Hyundai',
                article: '66400-H5000'
            },
            {
                id: 'body-2',
                categoryId: 'body',
                title: 'Крылья Toyota Corolla',
                price: 8900,
                image: 'https://i.ibb.co/0XZvLk6/corolla-fender.jpg',
                description: 'Переднее крыло для Toyota Corolla 2019+. Левое и правое.',
                manufacturer: 'Toyota',
                article: '53801-02A30'
            }
        ];
    }

    // Методы для работы с категориями
    getCategories() {
        return this.categories;
    }

    getCategoryById(id) {
        return this.categories.find(category => category.id === id);
    }

    // Методы для работы с товарами
    getProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    getProductsByCategory(categoryId) {
        return this.products.filter(product => product.categoryId === categoryId);
    }

    // Методы для работы с корзиной
    getCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    }

    addToCart(productId, quantity = 1) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ productId, quantity });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
    }

    removeFromCart(productId) {
        const cart = this.getCart();
        const updatedCart = cart.filter(item => item.productId !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    }

    updateCartItemQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.productId === productId);
        
        if (item) {
            item.quantity = quantity;
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }

    clearCart() {
        localStorage.removeItem('cart');
    }

    // Методы для работы с избранным
    getFavorites() {
        const favorites = localStorage.getItem('favorites');
        return favorites ? JSON.parse(favorites) : [];
    }

    toggleFavorite(productId) {
        const favorites = this.getFavorites();
        const index = favorites.indexOf(productId);

        if (index === -1) {
            favorites.push(productId);
        } else {
            favorites.splice(index, 1);
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    // Методы для работы с заказами
    getOrders() {
        const orders = localStorage.getItem('orders');
        return orders ? JSON.parse(orders) : [];
    }

    createOrder(orderData) {
        const orders = this.getOrders();
        const newOrder = {
            id: Date.now().toString(),
            ...orderData,
            status: 'new',
            createdAt: new Date().toISOString()
        };

        orders.push(newOrder);
        localStorage.setItem('orders', JSON.stringify(orders));
        this.clearCart();

        return newOrder;
    }
}

// Создаем глобальный экземпляр сервиса
window.DataService = new DataService();