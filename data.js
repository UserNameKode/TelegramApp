// Сервис для работы с данными
const DataService = {
    carBrands: [
        {
            id: 'bmw',
            name: 'BMW',
            logo: 'https://i.ibb.co/Pzf1KGz/bmw-logo.png',
            popular: true
        },
        {
            id: 'mercedes',
            name: 'Mercedes-Benz',
            logo: 'https://i.ibb.co/6y8F2zK/mercedes-logo.png',
            popular: true
        },
        {
            id: 'audi',
            name: 'Audi',
            logo: 'https://i.ibb.co/NmKc5Jm/audi-logo.png',
            popular: true
        },
        {
            id: 'toyota',
            name: 'Toyota',
            logo: 'https://i.ibb.co/VWrf4QK/toyota-logo.png',
            popular: true
        },
        {
            id: 'hyundai',
            name: 'Hyundai',
            logo: 'https://i.ibb.co/5xYn1Xq/hyundai-logo.png',
            popular: true
        },
        {
            id: 'lada',
            name: 'Lada',
            logo: 'https://i.ibb.co/ZBqGzDm/lada-logo.png',
            popular: true
        },
        {
            id: 'kia',
            name: 'Kia',
            logo: 'https://i.ibb.co/8sQNqYM/kia-logo.png',
            popular: false
        },
        {
            id: 'vaz',
            name: 'VAZ',
            logo: 'https://i.ibb.co/PxNmF6F/vaz-logo.png',
            popular: false
        },
        {
            id: 'changan',
            name: 'Changan',
            logo: 'https://i.ibb.co/XsyF1jQ/changan-logo.png',
            popular: false
        },
        {
            id: 'landrover',
            name: 'Land Rover',
            logo: 'https://i.ibb.co/8NtjKpK/landrover-logo.png',
            popular: false
        },
        {
            id: 'honda',
            name: 'Honda',
            logo: 'https://i.ibb.co/7vYGz8m/honda-logo.png',
            popular: false
        }
    ],

    categories: [
        { id: 'engine', title: 'Двигатель', icon: '🔧', description: 'Детали двигателя и системы питания' },
        { id: 'transmission', title: 'Трансмиссия', icon: '⚙️', description: 'Коробка передач и сцепление' },
        { id: 'suspension', title: 'Подвеска', icon: '🔩', description: 'Амортизаторы, пружины, стойки' },
        { id: 'electronics', title: 'Электрика', icon: '⚡', description: 'Электрооборудование и приборы' },
        { id: 'body', title: 'Кузов', icon: '🚗', description: 'Кузовные детали и оптика' }
    ],

    products: [
        {
            id: 'oil-filter-bmw',
            brandId: 'bmw',
            categoryId: 'engine',
            title: 'Масляный фильтр Mann W 914/2',
            description: 'Высококачественный масляный фильтр для BMW. Обеспечивает надежную защиту двигателя.',
            price: 1250,
            image: 'https://i.ibb.co/VxKrY8M/mann-filter.jpg',
            article: 'W9142',
            manufacturer: 'Mann-Filter',
            inStock: true,
            compatibility: ['BMW 3 Series', 'BMW 5 Series', 'BMW X3'],
            rating: 4.8,
            reviews: 156
        },
        {
            id: 'brake-pads-mercedes',
            brandId: 'mercedes',
            categoryId: 'suspension',
            title: 'Тормозные колодки Brembo P85020',
            description: 'Передние тормозные колодки с высоким коэффициентом трения для Mercedes.',
            price: 4200,
            image: 'https://i.ibb.co/0MKXh4k/brembo-pads.jpg',
            article: 'P85020',
            manufacturer: 'Brembo',
            inStock: true,
            compatibility: ['Mercedes C-Class', 'Mercedes E-Class'],
            rating: 4.9,
            reviews: 89
        },
        {
            id: 'timing-belt-audi',
            brandId: 'audi',
            categoryId: 'engine',
            title: 'Ремень ГРМ Gates 5471XS',
            description: 'Высокопрочный ремень ГРМ для Audi. Точная синхронизация работы двигателя.',
            price: 2800,
            image: 'https://i.ibb.co/NyWD5G9/gates-belt.jpg',
            article: '5471XS',
            manufacturer: 'Gates',
            inStock: true,
            compatibility: ['Audi A4', 'Audi A6', 'Audi Q5'],
            rating: 4.7,
            reviews: 124
        },
        {
            id: 'spark-plugs-toyota',
            brandId: 'toyota',
            categoryId: 'electronics',
            title: 'Свечи зажигания NGK 5960',
            description: 'Иридиевые свечи зажигания для Toyota с тонким центральным электродом.',
            price: 890,
            image: 'https://i.ibb.co/h9MQc7f/ngk-plugs.jpg',
            article: 'BKR5EIX',
            manufacturer: 'NGK',
            inStock: true,
            compatibility: ['Toyota Camry', 'Toyota Corolla', 'Toyota RAV4'],
            rating: 4.6,
            reviews: 203
        },
        {
            id: 'shock-absorber-hyundai',
            brandId: 'hyundai',
            categoryId: 'suspension',
            title: 'Амортизатор KYB 344459',
            description: 'Газовый амортизатор для Hyundai. Комфортная и безопасная езда.',
            price: 3800,
            image: 'https://i.ibb.co/xSYQJVB/kyb-shock.jpg',
            article: '344459',
            manufacturer: 'KYB',
            inStock: true,
            compatibility: ['Hyundai Solaris', 'Hyundai Creta'],
            rating: 4.5,
            reviews: 67
        },
        {
            id: 'air-filter-lada',
            brandId: 'lada',
            categoryId: 'engine',
            title: 'Воздушный фильтр Mahle LX1780',
            description: 'Воздушный фильтр с высокой пропускной способностью для Lada.',
            price: 650,
            image: 'https://i.ibb.co/BLRzLpY/mahle-filter.jpg',
            article: 'LX1780',
            manufacturer: 'Mahle',
            inStock: true,
            compatibility: ['Lada Vesta', 'Lada X-Ray', 'Lada Granta'],
            rating: 4.4,
            reviews: 298
        },
        {
            id: 'alternator-kia',
            brandId: 'kia',
            categoryId: 'electronics',
            title: 'Генератор Bosch 0124525091',
            description: 'Надежный генератор для Kia с высокой производительностью.',
            price: 9800,
            image: 'https://i.ibb.co/sWxLwhk/bosch-alternator.jpg',
            article: '0124525091',
            manufacturer: 'Bosch',
            inStock: true,
            compatibility: ['Kia Rio', 'Kia Cerato'],
            rating: 4.7,
            reviews: 45
        },
        {
            id: 'clutch-kit-vaz',
            brandId: 'vaz',
            categoryId: 'transmission',
            title: 'Комплект сцепления LuK 624317109',
            description: 'Полный комплект сцепления для ВАЗ включая корзину, диск и выжимной подшипник.',
            price: 12500,
            image: 'https://i.ibb.co/0ZJBwX9/luk-clutch.jpg',
            article: '624317109',
            manufacturer: 'LuK',
            inStock: true,
            compatibility: ['ВАЗ 2110', 'ВАЗ 2112', 'ВАЗ Priora'],
            rating: 4.3,
            reviews: 167
        },
        {
            id: 'radiator-honda',
            brandId: 'honda',
            categoryId: 'engine',
            title: 'Радиатор охлаждения NRF 53425',
            description: 'Алюминиевый радиатор для Honda с высокой теплоотдачей.',
            price: 7500,
            image: 'https://i.ibb.co/vX8LKz3/nrf-radiator.jpg',
            article: '53425',
            manufacturer: 'NRF',
            inStock: true,
            compatibility: ['Honda Civic', 'Honda Accord'],
            rating: 4.6,
            reviews: 78
        },
        {
            id: 'wheel-bearing-landrover',
            brandId: 'landrover',
            categoryId: 'suspension',
            title: 'Ступичный подшипник SKF VKBA3544',
            description: 'Передний ступичный подшипник для Land Rover в сборе.',
            price: 5600,
            image: 'https://i.ibb.co/9wXxwKb/skf-bearing.jpg',
            article: 'VKBA3544',
            manufacturer: 'SKF',
            inStock: true,
            compatibility: ['Land Rover Discovery', 'Land Rover Range Rover'],
            rating: 4.8,
            reviews: 34
        }
    ],

    // Система лояльности
    bonusSystem: {
        pointsPerRuble: 0.01, // 1 балл за 100 рублей
        levels: [
            { name: 'Стандарт', minPoints: 0, discount: 0, color: '#94A3B8' },
            { name: 'Серебро', minPoints: 1000, discount: 3, color: '#C0C0C0' },
            { name: 'Золото', minPoints: 5000, discount: 5, color: '#FFD700' },
            { name: 'Платина', minPoints: 15000, discount: 10, color: '#E5E4E2' }
        ]
    },

    // Пользовательские данные
    userData: {
        bonusPoints: 2500,
        totalSpent: 45000,
        favorites: [],
        viewHistory: [],
        searchHistory: []
    },

    orders: [],
    
    getCarBrands(popular = null) {
        if (popular === null) return this.carBrands;
        return this.carBrands.filter(brand => brand.popular === popular);
    },

    getCategories() {
        return this.categories;
    },

    getProducts(brandId = null, categoryId = null) {
        let products = this.products;
        
        if (brandId) {
            products = products.filter(product => product.brandId === brandId);
        }
        
        if (categoryId) {
            products = products.filter(product => product.categoryId === categoryId);
        }
        
        return products;
    },

    getProduct(productId) {
        return this.products.find(product => product.id === productId);
    },

    getCarBrand(brandId) {
        return this.carBrands.find(brand => brand.id === brandId);
    },

    getCategory(categoryId) {
        return this.categories.find(category => category.id === categoryId);
    },

    getUserLevel() {
        const points = this.userData.bonusPoints;
        return this.bonusSystem.levels
            .reverse()
            .find(level => points >= level.minPoints) || this.bonusSystem.levels[0];
    },

    addToFavorites(productId) {
        if (!this.userData.favorites.includes(productId)) {
            this.userData.favorites.push(productId);
            this.saveUserData();
        }
    },

    removeFromFavorites(productId) {
        this.userData.favorites = this.userData.favorites.filter(id => id !== productId);
        this.saveUserData();
    },

    addToViewHistory(productId) {
        this.userData.viewHistory = this.userData.viewHistory.filter(id => id !== productId);
        this.userData.viewHistory.unshift(productId);
        if (this.userData.viewHistory.length > 20) {
            this.userData.viewHistory = this.userData.viewHistory.slice(0, 20);
        }
        this.saveUserData();
    },

    addBonusPoints(amount) {
        const points = Math.floor(amount * this.bonusSystem.pointsPerRuble);
        this.userData.bonusPoints += points;
        this.userData.totalSpent += amount;
        this.saveUserData();
        return points;
    },

    saveUserData() {
        localStorage.setItem('autoparts_user_data', JSON.stringify(this.userData));
    },

    loadUserData() {
        const stored = localStorage.getItem('autoparts_user_data');
        if (stored) {
            this.userData = { ...this.userData, ...JSON.parse(stored) };
        }
    },

    getOrders() {
        return this.orders;
    },

    async createOrder(orderData) {
        const order = {
            id: 'ORD' + Date.now(),
            date: new Date().toISOString(),
            ...orderData
        };
        this.orders.push(order);
        
        // Начисляем бонусы
        const bonusPoints = this.addBonusPoints(orderData.total);
        
        return { order, bonusPoints };
    },

    searchProducts(query) {
        const lowercaseQuery = query.toLowerCase();
        return this.products.filter(product => 
            product.title.toLowerCase().includes(lowercaseQuery) ||
            product.description.toLowerCase().includes(lowercaseQuery) ||
            product.article.toLowerCase().includes(lowercaseQuery) ||
            product.manufacturer.toLowerCase().includes(lowercaseQuery)
        );
    }
};

// Загружаем пользовательские данные при инициализации
DataService.loadUserData();

// Делаем сервис доступным глобально
window.DataService = DataService;