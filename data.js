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
            description: 'Высококачественный масляный фильтр для двигателя. Обеспечивает эффективную очистку масла от загрязнений.',
            price: 850,
            image: '🔧',
            specs: {
                'Тип': 'Масляный фильтр',
                'Материал': 'Синтетическое волокно',
                'Размер': 'Стандартный',
                'Совместимость': 'Универсальный'
            },
            stock: 15
        },
        {
            id: 'engine_002',
            name: 'Воздушный фильтр',
            description: 'Воздушный фильтр двигателя с многослойной фильтрацией. Защищает двигатель от пыли и загрязнений.',
            price: 650,
            image: '🔧',
            specs: {
                'Тип': 'Воздушный фильтр',
                'Материал': 'Бумага + хлопок',
                'Размер': 'Стандартный',
                'Совместимость': 'Универсальный'
            },
            stock: 22
        },
        {
            id: 'engine_003',
            name: 'Ремень ГРМ',
            description: 'Ремень газораспределительного механизма. Высококачественный материал обеспечивает долговечность.',
            price: 3200,
            image: '🔧',
            specs: {
                'Тип': 'Ремень ГРМ',
                'Материал': 'Неопрен',
                'Длина': '1200 мм',
                'Совместимость': 'Универсальный'
            },
            stock: 8
        },
        {
            id: 'engine_004',
            name: 'Свечи зажигания',
            description: 'Комплект свечей зажигания. Обеспечивают стабильное воспламенение топливной смеси.',
            price: 1800,
            image: '🔧',
            specs: {
                'Тип': 'Свечи зажигания',
                'Количество': '4 шт',
                'Калильное число': '6',
                'Совместимость': 'Универсальный'
            },
            stock: 12
        }
    ],
    brakes: [
        {
            id: 'brakes_001',
            name: 'Тормозные колодки',
            description: 'Передние тормозные колодки. Высококачественный фрикционный материал обеспечивает эффективное торможение.',
            price: 2800,
            image: '🛑',
            specs: {
                'Тип': 'Тормозные колодки',
                'Позиция': 'Передние',
                'Материал': 'Органический',
                'Совместимость': 'Универсальный'
            },
            stock: 18
        },
        {
            id: 'brakes_002',
            name: 'Тормозные диски',
            description: 'Вентилируемые тормозные диски. Обеспечивают эффективное охлаждение и отвод тепла.',
            price: 4500,
            image: '🛑',
            specs: {
                'Тип': 'Тормозные диски',
                'Диаметр': '280 мм',
                'Материал': 'Чугун',
                'Совместимость': 'Универсальный'
            },
            stock: 10
        },
        {
            id: 'brakes_003',
            name: 'Тормозная жидкость',
            description: 'Тормозная жидкость DOT 4. Высокая температура кипения и стабильные характеристики.',
            price: 750,
            image: '🛑',
            specs: {
                'Тип': 'Тормозная жидкость',
                'Стандарт': 'DOT 4',
                'Объем': '1 л',
                'Температура кипения': '230°C'
            },
            stock: 25
        }
    ],
    suspension: [
        {
            id: 'suspension_001',
            name: 'Амортизаторы',
            description: 'Передние амортизаторы. Обеспечивают плавность хода и стабильность управления.',
            price: 3800,
            image: '⚙️',
            specs: {
                'Тип': 'Амортизаторы',
                'Позиция': 'Передние',
                'Конструкция': 'Газонаполненные',
                'Совместимость': 'Универсальный'
            },
            stock: 14
        },
        {
            id: 'suspension_002',
            name: 'Пружины подвески',
            description: 'Пружины подвески. Высококачественная сталь обеспечивает долговечность и надежность.',
            price: 2200,
            image: '⚙️',
            specs: {
                'Тип': 'Пружины подвески',
                'Материал': 'Высокопрочная сталь',
                'Диаметр проволоки': '12 мм',
                'Совместимость': 'Универсальный'
            },
            stock: 16
        },
        {
            id: 'suspension_003',
            name: 'Рычаги подвески',
            description: 'Рычаги передней подвески. Прочная конструкция обеспечивает надежность и долговечность.',
            price: 1900,
            image: '⚙️',
            specs: {
                'Тип': 'Рычаги подвески',
                'Позиция': 'Передние',
                'Материал': 'Сталь',
                'Совместимость': 'Универсальный'
            },
            stock: 20
        }
    ],
    electronics: [
        {
            id: 'electronics_001',
            name: 'Аккумулятор',
            description: 'Автомобильный аккумулятор 60 Ач. Высокая пусковая мощность и долгий срок службы.',
            price: 5200,
            image: '⚡',
            specs: {
                'Тип': 'Аккумулятор',
                'Емкость': '60 Ач',
                'Пусковой ток': '540 А',
                'Полярность': 'Прямая'
            },
            stock: 8
        },
        {
            id: 'electronics_002',
            name: 'Генератор',
            description: 'Автомобильный генератор. Обеспечивает зарядку аккумулятора и питание электрооборудования.',
            price: 8500,
            image: '⚡',
            specs: {
                'Тип': 'Генератор',
                'Мощность': '90 А',
                'Напряжение': '14 В',
                'Совместимость': 'Универсальный'
            },
            stock: 5
        },
        {
            id: 'electronics_003',
            name: 'Стартер',
            description: 'Автомобильный стартер. Высокая мощность и надежность запуска двигателя.',
            price: 6800,
            image: '⚡',
            specs: {
                'Тип': 'Стартер',
                'Мощность': '1.4 кВт',
                'Напряжение': '12 В',
                'Совместимость': 'Универсальный'
            },
            stock: 6
        },
        {
            id: 'electronics_004',
            name: 'Блок предохранителей',
            description: 'Блок предохранителей. Защищает электрические цепи от перегрузок и коротких замыканий.',
            price: 1200,
            image: '⚡',
            specs: {
                'Тип': 'Блок предохранителей',
                'Количество предохранителей': '32',
                'Напряжение': '12 В',
                'Совместимость': 'Универсальный'
            },
            stock: 15
        }
    ]
};

// Демо-профиль пользователя
const userProfile = {
    name: 'Александр Петров',
    phone: '+7 (999) 123-45-67',
    email: 'alex.petrov@example.com',
    address: 'г. Москва, ул. Примерная, д. 123, кв. 45'
};

// Демо-история заказов
const orderHistory = [
    {
        id: 'ORD-001',
        date: '2024-01-15',
        status: 'completed',
        items: [
            { id: 'engine_001', name: 'Масляный фильтр', quantity: 2, price: 850 },
            { id: 'brakes_001', name: 'Тормозные колодки', quantity: 1, price: 2800 }
        ],
        total: 4500,
        delivery: 'Курьер',
        address: 'г. Москва, ул. Примерная, д. 123, кв. 45'
    },
    {
        id: 'ORD-002',
        date: '2024-01-10',
        status: 'processing',
        items: [
            { id: 'suspension_001', name: 'Амортизаторы', quantity: 2, price: 3800 },
            { id: 'electronics_001', name: 'Аккумулятор', quantity: 1, price: 5200 }
        ],
        total: 12800,
        delivery: 'Самовывоз',
        address: 'г. Москва, ул. Примерная, д. 123, кв. 45'
    },
    {
        id: 'ORD-003',
        date: '2024-01-05',
        status: 'completed',
        items: [
            { id: 'brakes_003', name: 'Тормозная жидкость', quantity: 1, price: 750 },
            { id: 'engine_004', name: 'Свечи зажигания', quantity: 1, price: 1800 }
        ],
        total: 2550,
        delivery: 'Курьер',
        address: 'г. Москва, ул. Примерная, д. 123, кв. 45'
    }
];

// Функции для работы с данными
const DataService = {
    // Получить все категории
    getCategories() {
        return Object.values(categories);
    },

    // Получить категорию по ID
    getCategory(categoryId) {
        return categories[categoryId];
    },

    // Получить товары категории
    getProductsByCategory(categoryId) {
        return products[categoryId] || [];
    },

    // Получить товар по ID
    getProduct(productId) {
        for (const categoryProducts of Object.values(products)) {
            const product = categoryProducts.find(p => p.id === productId);
            if (product) return product;
        }
        return null;
    },

    // Получить профиль пользователя
    getUserProfile() {
        return userProfile;
    },

    // Получить историю заказов
    getOrderHistory() {
        return orderHistory;
    },

    // Получить заказ по ID
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
                    product.description.toLowerCase().includes(searchQuery)) {
                    results.push(product);
                }
            }
        }

        return results;
    },

    // Создать новый заказ
    createOrder(orderData) {
        const newOrder = {
            id: `ORD-${Date.now().toString().slice(-6)}`,
            date: new Date().toISOString().split('T')[0],
            status: 'pending',
            items: orderData.items,
            total: orderData.total,
            delivery: orderData.delivery,
            address: orderData.address
        };

        orderHistory.unshift(newOrder);
        return newOrder;
    }
};

// Экспорт для использования в других модулях
window.DataService = DataService; 