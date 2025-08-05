// Демо-данные для Telegram MiniApp "АвтоЗапчасти"

// Категории товаров
const categories = {
    engine: {
        id: 'engine',
        name: 'Двигатель',
        description: 'Детали двигателя и системы',
        icon: '🔧'
    },
    brakes: {
        id: 'brakes',
        name: 'Тормоза',
        description: 'Тормозная система',
        icon: '🛑'
    },
    suspension: {
        id: 'suspension',
        name: 'Подвеска',
        description: 'Подвеска и ходовая часть',
        icon: '⚙️'
    },
    electronics: {
        id: 'electronics',
        name: 'Электроника',
        description: 'Электронные компоненты',
        icon: '⚡'
    }
};

// Товары по категориям
const products = {
    engine: [
        {
            id: 'engine_001',
            name: 'Масляный фильтр',
            description: 'Высококачественный масляный фильтр для двигателя',
            price: 850,
            brand: 'Bosch',
            inStock: true,
            icon: 'filter',
            image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=300&fit=crop&crop=center'
        },
        {
            id: 'engine_002',
            name: 'Воздушный фильтр',
            description: 'Воздушный фильтр двигателя с многослойной фильтрацией',
            price: 650,
            brand: 'Mann',
            inStock: true,
            icon: 'filter',
            image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=300&fit=crop&crop=center'
        },
        {
            id: 'engine_003',
            name: 'Ремень ГРМ',
            description: 'Ремень газораспределительного механизма',
            price: 3200,
            brand: 'Gates',
            inStock: true,
            icon: 'belt',
            image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=300&fit=crop&crop=center'
        }
    ],
    brakes: [
        {
            id: 'brakes_001',
            name: 'Тормозные колодки',
            description: 'Передние тормозные колодки',
            price: 2800,
            brand: 'Brembo',
            inStock: true,
            icon: 'brake',
            image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=300&fit=crop&crop=center'
        },
        {
            id: 'brakes_002',
            name: 'Тормозные диски',
            description: 'Вентилируемые тормозные диски',
            price: 4500,
            brand: 'Brembo',
            inStock: true,
            icon: 'disc',
            image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=300&fit=crop&crop=center'
        }
    ],
    suspension: [
        {
            id: 'suspension_001',
            name: 'Амортизаторы',
            description: 'Передние амортизаторы подвески',
            price: 8500,
            brand: 'KYB',
            inStock: true,
            icon: 'shock'
        },
        {
            id: 'suspension_002',
            name: 'Пружины подвески',
            description: 'Комплект пружин подвески',
            price: 3200,
            brand: 'Eibach',
            inStock: true,
            icon: 'spring'
        }
    ],
    electronics: [
        {
            id: 'electronics_001',
            name: 'Аккумулятор',
            description: 'Автомобильный аккумулятор 60 Ач',
            price: 6500,
            brand: 'Varta',
            inStock: true,
            icon: 'battery'
        },
        {
            id: 'electronics_002',
            name: 'Генератор',
            description: 'Автомобильный генератор 90А',
            price: 12000,
            brand: 'Bosch',
            inStock: true,
            icon: 'generator'
        }
    ]
};

// Профиль пользователя
const userProfile = {
    name: 'Александр Петров',
    phone: '+7 (999) 123-45-67',
    email: 'alex@example.com',
    address: 'г. Москва, ул. Примерная, д. 1, кв. 1'
};

// История заказов
const orderHistory = [
    {
        id: 'ORD001',
        date: '2024-01-15',
        status: 'completed',
        total: 8500,
        items: [
            { id: 'engine_001', name: 'Масляный фильтр', quantity: 2, price: 850 },
            { id: 'brakes_001', name: 'Тормозные колодки', quantity: 1, price: 2800 }
        ]
    },
    {
        id: 'ORD002',
        date: '2024-01-10',
        status: 'processing',
        total: 12000,
        items: [
            { id: 'electronics_002', name: 'Генератор', quantity: 1, price: 12000 }
        ]
    },
    {
        id: 'ORD003',
        date: '2024-01-05',
        status: 'pending',
        total: 6500,
        items: [
            { id: 'electronics_001', name: 'Аккумулятор', quantity: 1, price: 6500 }
        ]
    }
];

// Сервис для работы с данными
const DataService = {
    // Получение категорий
    getCategories() {
        return Object.values(categories);
    },

    // Получение категории по ID
    getCategory(categoryId) {
        return categories[categoryId];
    },

    // Получение товаров по категории
    getProductsByCategory(categoryId) {
        return products[categoryId] || [];
    },

    // Получение товара по ID
    getProduct(productId) {
        for (const categoryProducts of Object.values(products)) {
            const product = categoryProducts.find(p => p.id === productId);
            if (product) return product;
        }
        return null;
    },

    // Получение профиля пользователя
    getUserProfile() {
        return userProfile;
    },

    // Получение истории заказов
    getOrderHistory() {
        return orderHistory;
    },

    // Получение заказа по ID
    getOrder(orderId) {
        return orderHistory.find(order => order.id === orderId);
    },

    // Поиск товаров
    searchProducts(query) {
        const results = [];
        const searchQuery = query.toLowerCase();

        for (const categoryProducts of Object.values(products)) {
            for (const product of categoryProducts) {
                if (product.name.toLowerCase().includes(searchQuery) ||
                    product.description.toLowerCase().includes(searchQuery) ||
                    product.brand.toLowerCase().includes(searchQuery)) {
                    results.push(product);
                }
            }
        }

        return results;
    },

    // Создание нового заказа
    createOrder(orderData) {
        const newOrder = {
            id: `ORD${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            status: 'pending',
            total: orderData.total,
            items: orderData.items,
            customer: orderData.customer
        };

        orderHistory.unshift(newOrder);
        return newOrder;
    }
};

// Экспорт для использования в других модулях
window.DataService = DataService; 