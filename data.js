// Сервис для работы с данными
const DataService = {
    carBrands: [
        {
            id: 'bmw',
            name: 'BMW',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/512px-BMW.svg.png',
            popular: true
        },
        {
            id: 'mercedes',
            name: 'Mercedes-Benz',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Logo.svg/512px-Mercedes-Logo.svg.png',
            popular: true
        },
        {
            id: 'audi',
            name: 'Audi',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Audi_logo.svg/512px-Audi_logo.svg.png',
            popular: true
        },
        {
            id: 'toyota',
            name: 'Toyota',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Toyota_logo.svg/512px-Toyota_logo.svg.png',
            popular: true
        },
        {
            id: 'hyundai',
            name: 'Hyundai',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Hyundai_Motor_Company_logo.svg/512px-Hyundai_Motor_Company_logo.svg.png',
            popular: true
        },
        {
            id: 'lada',
            name: 'Lada',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Lada_2015_logo.svg/512px-Lada_2015_logo.svg.png',
            popular: true
        },
        {
            id: 'kia',
            name: 'Kia',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Kia_logo.svg/512px-Kia_logo.svg.png',
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
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Land_Rover_2011_logo.svg/512px-Land_Rover_2011_logo.svg.png',
            popular: false
        },
        {
            id: 'honda',
            name: 'Honda',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Honda_Logo.svg/512px-Honda_Logo.svg.png',
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
        // BMW товары для всех категорий
        {
            id: 'p3',
            title: 'Стартер BMW Valeo D6RA552',
            price: 15800,
            image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300',
            categoryId: 'c2',
            brandId: 'bmw',
            article: 'VAL438178',
            manufacturer: 'Valeo',
            description: 'Мощный стартер для BMW с улучшенными характеристиками запуска двигателя.',
            compatibility: ['BMW 1 Series F20', 'BMW 2 Series F22', 'BMW 3 Series F30'],
            inStock: true,
            rating: 4.7,
            reviews: 156
        },
        {
            id: 'p4',
            title: 'Генератор BMW Bosch 0986AG0290',
            price: 18900,
            image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300',
            categoryId: 'c2',
            brandId: 'bmw',
            article: 'B0986AG0290',
            manufacturer: 'Bosch',
            description: 'Высокопроизводительный генератор BMW для обеспечения стабильного электропитания.',
            compatibility: ['BMW X3 F25', 'BMW X4 F26', 'BMW X5 F15'],
            inStock: true,
            rating: 4.8,
            reviews: 203
        },
        {
            id: 'p5',
            title: 'Тормозные колодки BMW',
            price: 3200,
            image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=300',
            categoryId: 'c4',
            brandId: 'bmw',
            article: 'BMW34116850886',
            manufacturer: 'BMW Original',
            description: 'Оригинальные тормозные колодки BMW для эффективного торможения.',
            compatibility: ['BMW X5 F15', 'BMW X6 F16', 'BMW 7 Series G11'],
            inStock: true,
            rating: 4.9,
            reviews: 287
        },
        {
            id: 'p6',
            title: 'Амортизатор BMW Передний',
            price: 8500,
            image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300',
            categoryId: 'c4',
            brandId: 'bmw',
            article: 'BMW31316851101',
            manufacturer: 'Sachs',
            description: 'Газомасляный амортизатор передней подвески BMW.',
            compatibility: ['BMW 3 Series E90', 'BMW 1 Series E87', 'BMW X1 E84'],
            inStock: true,
            rating: 4.6,
            reviews: 142
        },
        // Трансмиссия BMW
        {
            id: 'p7',
            title: 'АКПП BMW 8HP50 Фильтр',
            price: 2400,
            image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300',
            categoryId: 'c3',
            brandId: 'bmw',
            article: 'BMW24117624192',
            manufacturer: 'BMW Original',
            description: 'Оригинальный фильтр автоматической коробки передач BMW 8HP50.',
            compatibility: ['BMW X5 F15', 'BMW X6 F16', 'BMW 5 Series F10'],
            inStock: true,
            rating: 4.7,
            reviews: 178
        },
        {
            id: 'p8',
            title: 'Сцепление BMW Комплект',
            price: 18900,
            image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300',
            categoryId: 'c3',
            brandId: 'bmw',
            article: 'BMW21207568464',
            manufacturer: 'LuK',
            description: 'Полный комплект сцепления для BMW с механической коробкой передач.',
            compatibility: ['BMW 3 Series E46', 'BMW Z4 E85', 'BMW X3 E83'],
            inStock: true,
            rating: 4.8,
            reviews: 234
        },
        // Охлаждение BMW
        {
            id: 'p9',
            title: 'Термостат BMW 83°C',
            price: 1890,
            image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=300',
            categoryId: 'c5',
            brandId: 'bmw',
            article: 'BMW11531436823',
            manufacturer: 'Wahler',
            description: 'Термостат системы охлаждения BMW с температурой открытия 83°C.',
            compatibility: ['BMW 1 Series F20', 'BMW 2 Series F22', 'BMW MINI Cooper'],
            inStock: true,
            rating: 4.4,
            reviews: 167
        },
        {
            id: 'p10',
            title: 'Помпа водяная BMW',
            price: 7800,
            image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=300',
            categoryId: 'c5',
            brandId: 'bmw',
            article: 'BMW11517586925',
            manufacturer: 'BMW Original',
            description: 'Водяной насос (помпа) системы охлаждения BMW.',
            compatibility: ['BMW X1 F48', 'BMW 2 Series F45', 'BMW MINI Countryman'],
            inStock: true,
            rating: 4.6,
            reviews: 145
        },
        // Дополнительные товары BMW для подвески
        {
            id: 'p11',
            title: 'Рычаг подвески BMW передний левый',
            price: 4200,
            image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300',
            categoryId: 'c4',
            brandId: 'bmw',
            article: 'BMW31126851859',
            manufacturer: 'BMW Original',
            description: 'Передний левый рычаг подвески BMW с шаровой опорой.',
            compatibility: ['BMW 5 Series F10', 'BMW 6 Series F12', 'BMW 7 Series F01'],
            inStock: true,
            rating: 4.5,
            reviews: 198
        },
        // Фильтры для тестирования поиска
        {
            id: 'p12',
            title: 'Фильтр воздушный BMW',
            price: 890,
            image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=300',
            categoryId: 'c2',
            brandId: 'bmw',
            article: 'BMW13717521023',
            manufacturer: 'Mann-Filter',
            description: 'Воздушный фильтр BMW для защиты двигателя от пыли.',
            compatibility: ['BMW 3 Series F30', 'BMW 4 Series F32'],
            inStock: true,
            rating: 4.4,
            reviews: 76
        },
        {
            id: 'p13',
            title: 'Фильтр масляный BMW',
            price: 650,
            image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=300',
            categoryId: 'c2',
            brandId: 'bmw',
            article: 'BMW11427508969',
            manufacturer: 'Mahle',
            description: 'Масляный фильтр BMW для очистки моторного масла.',
            compatibility: ['BMW X1 F48', 'BMW X2 F39', 'BMW X3 G01'],
            inStock: true,
            rating: 4.7,
            reviews: 134
        },
        {
            id: 'p14',
            title: 'Фильтр топливный Mercedes',
            price: 1200,
            image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=300',
            categoryId: 'c2',
            brandId: 'mercedes',
            article: 'MB6420920201',
            manufacturer: 'Bosch',
            description: 'Топливный фильтр Mercedes для очистки топлива.',
            compatibility: ['Mercedes C-Class W205', 'Mercedes E-Class W213'],
            inStock: true,
            rating: 4.6,
            reviews: 98
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
        if(!this.userData.viewHistory) this.userData.viewHistory = [];
        this.userData.viewHistory = this.userData.viewHistory.filter(id => id !== productId);
        this.userData.viewHistory.unshift(productId);
        if (this.userData.viewHistory.length > 20) {
            this.userData.viewHistory = this.userData.viewHistory.slice(0, 20);
        }
        // Сохраняем в userData и дублируем в localStorage для быстрых выводов на главной
        this.saveUserData();
        try {
            localStorage.setItem('view_history', JSON.stringify(this.userData.viewHistory));
        } catch(_) {}
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
        const searchTerm = query.toLowerCase().trim();
        console.log(`🔍 ПОИСК: "${searchTerm}"`);
        
        if (!searchTerm) return [];
        
        const results = this.products.filter(product => {
            let found = false;
            let reasons = [];
            
            // Поиск по названию товара
            if (product.title && product.title.toLowerCase().includes(searchTerm)) {
                found = true;
                reasons.push('название');
            }
            
            // Поиск по артикулу/VIN
            if (product.article && product.article.toLowerCase().includes(searchTerm)) {
                found = true;
                reasons.push('артикул');
            }
            
            // Поиск по описанию
            if (product.description && product.description.toLowerCase().includes(searchTerm)) {
                found = true;
                reasons.push('описание');
            }
            
            // Поиск по производителю
            if (product.manufacturer && product.manufacturer.toLowerCase().includes(searchTerm)) {
                found = true;
                reasons.push('производитель');
            }
            
            // Поиск по бренду авто
            const brand = this.getCarBrand(product.brandId);
            if (brand && brand.name && brand.name.toLowerCase().includes(searchTerm)) {
                found = true;
                reasons.push('марка авто');
            }
            
            // Поиск по категории
            const category = this.getCategory(product.categoryId);
            if (category && category.title && category.title.toLowerCase().includes(searchTerm)) {
                found = true;
                reasons.push('категория');
            }
            
            // Поиск по совместимости (модели авто)
            if (product.compatibility && product.compatibility.some(car => 
                car.toLowerCase().includes(searchTerm)
            )) {
                found = true;
                reasons.push('совместимость');
            }
            
            // Специальные поиски
            // Поиск "фильтр" найдет все фильтры
            if (searchTerm.includes('фильтр') && product.title.toLowerCase().includes('фильтр')) {
                found = true;
                reasons.push('тип детали');
            }
            
            // Поиск "масло" найдет все масла
            if (searchTerm.includes('масло') && product.title.toLowerCase().includes('масло')) {
                found = true;
                reasons.push('тип детали');
            }
            
            if (found) {
                console.log(`✅ Найден: "${product.title}" (${reasons.join(', ')})`);
            }
            
            return found;
        });
        
        console.log(`📊 Результат поиска "${searchTerm}": ${results.length} товаров`);
        return results;
    }
};

// Загружаем пользовательские данные при инициализации
DataService.loadUserData();

// Делаем сервис доступным глобально
window.DataService = DataService;