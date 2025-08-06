// Сервис для работы с данными
const DataService = {
    categories: [
        { id: 'engine', title: 'Двигатель', icon: '🔧' },
        { id: 'transmission', title: 'Трансмиссия', icon: '⚙️' },
        { id: 'suspension', title: 'Подвеска', icon: '🔩' },
        { id: 'electronics', title: 'Электрика', icon: '⚡' },
        { id: 'body', title: 'Кузов', icon: '🚗' }
    ],

    products: [
        {
            id: 'oil-filter',
            categoryId: 'engine',
            title: 'Масляный фильтр Mann W 914/2',
            description: 'Высококачественный масляный фильтр для легковых автомобилей. Обеспечивает надежную защиту двигателя.',
            price: 850,
            image: 'https://i.ibb.co/VxKrY8M/mann-filter.jpg',
            article: 'W9142',
            manufacturer: 'Mann-Filter',
            inStock: true
        },
        {
            id: 'brake-pads',
            categoryId: 'suspension',
            title: 'Тормозные колодки Brembo P85020',
            description: 'Передние тормозные колодки с высоким коэффициентом трения. Стабильная работа при любых температурах.',
            price: 3200,
            image: 'https://i.ibb.co/0MKXh4k/brembo-pads.jpg',
            article: 'P85020',
            manufacturer: 'Brembo',
            inStock: true
        },
        {
            id: 'timing-belt',
            categoryId: 'engine',
            title: 'Ремень ГРМ Gates 5471XS',
            description: 'Высокопрочный ремень ГРМ для точной синхронизации работы двигателя. Усиленная конструкция.',
            price: 2100,
            image: 'https://i.ibb.co/NyWD5G9/gates-belt.jpg',
            article: '5471XS',
            manufacturer: 'Gates',
            inStock: true
        },
        {
            id: 'spark-plugs',
            categoryId: 'electronics',
            title: 'Свечи зажигания NGK 5960',
            description: 'Иридиевые свечи зажигания с тонким центральным электродом для максимальной эффективности.',
            price: 750,
            image: 'https://i.ibb.co/h9MQc7f/ngk-plugs.jpg',
            article: 'BKR5EIX',
            manufacturer: 'NGK',
            inStock: true
        },
        {
            id: 'shock-absorber',
            categoryId: 'suspension',
            title: 'Амортизатор KYB 344459',
            description: 'Газовый амортизатор для комфортной и безопасной езды. Длительный срок службы.',
            price: 4500,
            image: 'https://i.ibb.co/xSYQJVB/kyb-shock.jpg',
            article: '344459',
            manufacturer: 'KYB',
            inStock: true
        },
        {
            id: 'air-filter',
            categoryId: 'engine',
            title: 'Воздушный фильтр Mahle LX1780',
            description: 'Воздушный фильтр с высокой пропускной способностью. Эффективная защита двигателя.',
            price: 980,
            image: 'https://i.ibb.co/BLRzLpY/mahle-filter.jpg',
            article: 'LX1780',
            manufacturer: 'Mahle',
            inStock: true
        },
        {
            id: 'alternator',
            categoryId: 'electronics',
            title: 'Генератор Bosch 0124525091',
            description: 'Надежный генератор с высокой производительностью. Стабильная работа электросистемы.',
            price: 12500,
            image: 'https://i.ibb.co/sWxLwhk/bosch-alternator.jpg',
            article: '0124525091',
            manufacturer: 'Bosch',
            inStock: true
        },
        {
            id: 'clutch-kit',
            categoryId: 'transmission',
            title: 'Комплект сцепления LuK 624317109',
            description: 'Полный комплект сцепления включая корзину, диск и выжимной подшипник.',
            price: 15800,
            image: 'https://i.ibb.co/0ZJBwX9/luk-clutch.jpg',
            article: '624317109',
            manufacturer: 'LuK',
            inStock: true
        },
        {
            id: 'radiator',
            categoryId: 'engine',
            title: 'Радиатор охлаждения NRF 53425',
            description: 'Алюминиевый радиатор с высокой теплоотдачей. Эффективное охлаждение двигателя.',
            price: 8900,
            image: 'https://i.ibb.co/vX8LKz3/nrf-radiator.jpg',
            article: '53425',
            manufacturer: 'NRF',
            inStock: true
        },
        {
            id: 'wheel-bearing',
            categoryId: 'suspension',
            title: 'Ступичный подшипник SKF VKBA3544',
            description: 'Передний ступичный подшипник в сборе. Высокая надежность и длительный срок службы.',
            price: 3600,
            image: 'https://i.ibb.co/9wXxwKb/skf-bearing.jpg',
            article: 'VKBA3544',
            manufacturer: 'SKF',
            inStock: true
        }
    ],

    orders: [],
    
    getCategories() {
        return this.categories;
    },

    getProducts(categoryId = null) {
        if (categoryId) {
            return this.products.filter(product => product.categoryId === categoryId);
        }
        return this.products;
    },

    getProduct(productId) {
        return this.products.find(product => product.id === productId);
    },

    getOrders() {
        return this.orders;
    },

    async createOrder(orderData) {
        const order = {
            id: 'ORD' + Date.now(),
            ...orderData
        };
        this.orders.push(order);
        return order;
    }
};

// Делаем сервис доступным глобально
window.DataService = DataService;