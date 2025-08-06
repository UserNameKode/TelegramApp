// Сервис для работы с данными
class DataService {
    constructor() {
        this.categories = [
            {
                id: 'engine',
                title: 'Двигатель и компоненты',
                image: 'https://i.ibb.co/M6QMKNP/engine.jpg',
                count: 5
            },
            {
                id: 'brake',
                title: 'Тормозная система',
                image: 'https://i.ibb.co/4WM5tJX/brake.jpg',
                count: 3
            },
            {
                id: 'suspension',
                title: 'Подвеска и ходовая',
                image: 'https://i.ibb.co/tQc6pKq/suspension.jpg',
                count: 4
            },
            {
                id: 'electrical',
                title: 'Электрооборудование',
                image: 'https://i.ibb.co/VvCnMxp/electrical.jpg',
                count: 3
            },
            {
                id: 'body',
                title: 'Кузовные детали',
                image: 'https://i.ibb.co/C2z0KSJ/body.jpg',
                count: 2
            }
        ];

        this.products = [
            // Двигатель
            {
                id: 'engine-1',
                categoryId: 'engine',
                title: 'Поршневая группа ВАЗ 2110',
                price: 12500,
                image: 'https://i.ibb.co/HdKXzKQ/piston-group.jpg',
                description: 'Комплект поршневой группы для ВАЗ 2110. Включает поршни, кольца и пальцы.'
            },
            {
                id: 'engine-2',
                categoryId: 'engine',
                title: 'Комплект ГРМ Ford Focus',
                price: 8900,
                image: 'https://i.ibb.co/0MZ0H5Y/timing-belt.jpg',
                description: 'Комплект ГРМ для Ford Focus 2.0. Ремень, ролики, натяжитель.'
            },
            {
                id: 'engine-3',
                categoryId: 'engine',
                title: 'Масляный насос Toyota',
                price: 5600,
                image: 'https://i.ibb.co/XS8DNzp/oil-pump.jpg',
                description: 'Масляный насос для Toyota Camry 2.4. Оригинал.'
            },

            // Тормоза
            {
                id: 'brake-1',
                categoryId: 'brake',
                title: 'Дисковые тормоза Brembo',
                price: 15800,
                image: 'https://i.ibb.co/VqFgRf7/brembo-brakes.jpg',
                description: 'Комплект передних тормозных дисков Brembo. Высокая производительность.'
            },
            {
                id: 'brake-2',
                categoryId: 'brake',
                title: 'Колодки Ferodo BMW',
                price: 4500,
                image: 'https://i.ibb.co/0MKyqJ6/brake-pads.jpg',
                description: 'Передние тормозные колодки Ferodo для BMW 3 серии.'
            },

            // Подвеска
            {
                id: 'suspension-1',
                categoryId: 'suspension',
                title: 'Амортизаторы KYB',
                price: 7800,
                image: 'https://i.ibb.co/C1Q8Jyq/shock-absorber.jpg',
                description: 'Передние амортизаторы KYB для Honda Civic. Комплект 2 шт.'
            },
            {
                id: 'suspension-2',
                categoryId: 'suspension',
                title: 'Рычаги Audi',
                price: 12300,
                image: 'https://i.ibb.co/xGV2Yyq/control-arm.jpg',
                description: 'Комплект передних рычагов для Audi A4 B8.'
            },

            // Электрика
            {
                id: 'electrical-1',
                categoryId: 'electrical',
                title: 'Генератор Bosch',
                price: 18500,
                image: 'https://i.ibb.co/0XKQ8LS/generator.jpg',
                description: 'Генератор Bosch для Volkswagen Polo 1.6.'
            },
            {
                id: 'electrical-2',
                categoryId: 'electrical',
                title: 'Стартер Valeo',
                price: 14200,
                image: 'https://i.ibb.co/wSxVKqc/starter.jpg',
                description: 'Стартер Valeo для Renault Logan. Новый.'
            },

            // Кузов
            {
                id: 'body-1',
                categoryId: 'body',
                title: 'Капот Hyundai Solaris',
                price: 21500,
                image: 'https://i.ibb.co/0QKwVJy/hood.jpg',
                description: 'Капот для Hyundai Solaris 2017+. Оригинал.'
            },
            {
                id: 'body-2',
                categoryId: 'body',
                title: 'Крылья Toyota Corolla',
                price: 8900,
                image: 'https://i.ibb.co/XxQ3p1d/fender.jpg',
                description: 'Переднее крыло для Toyota Corolla 2019+. Левое и правое.'
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