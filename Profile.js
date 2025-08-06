class Profile {
    constructor() {
        this.userData = null;
        this.init();
    }

    init() {
        this.loadUserData();
        this.render();
    }

    loadUserData() {
        const userData = localStorage.getItem('userData');
        this.userData = userData ? JSON.parse(userData) : {
            firstName: '',
            lastName: '',
            phone: '',
            email: '',
            addresses: [],
            notifications: {
                orderStatus: true,
                promotions: false,
                newProducts: false
            }
        };
    }

    saveUserData() {
        localStorage.setItem('userData', JSON.stringify(this.userData));
    }

    updateUserData(data) {
        this.userData = { ...this.userData, ...data };
        this.saveUserData();
        this.render();
        window.app.showNotification('Профиль обновлен', 'success');
    }

    render() {
        const profileScreen = document.getElementById('profile-screen');
        if (!profileScreen) return;

        profileScreen.innerHTML = `
            <div class="profile-content">
                <div class="profile-header glass-morphism">
                    <div class="profile-avatar gradient-bg">
                        ${this.userData.firstName ? this.userData.firstName[0].toUpperCase() : 
                        '<i class="ph ph-user"></i>'}
                    </div>
                    <div class="profile-info">
                        <h2>${this.userData.firstName ? 
                            `${this.userData.firstName} ${this.userData.lastName}` : 
                            'Ваш профиль'}</h2>
                        <p>${this.userData.email || 'Укажите ваши данные'}</p>
                    </div>
                    <div class="quick-stats">
                        <div class="stat">
                            <i class="ph ph-shopping-cart"></i>
                            <span>0 заказов</span>
                        </div>
                        <div class="stat">
                            <i class="ph ph-heart"></i>
                            <span>0 избранных</span>
                        </div>
                    </div>
                </div>

                <div class="profile-sections">
                    <!-- Личные данные -->
                    <div class="profile-section glass-morphism">
                        <div class="section-header">
                            <h3>
                                <i class="ph ph-user-circle"></i>
                                Личные данные
                            </h3>
                        </div>
                        <form id="personal-form" class="profile-form">
                            <div class="form-group glass-effect">
                                <label>Имя</label>
                                <input type="text" name="firstName" 
                                    value="${this.userData.firstName}" 
                                    placeholder="Введите имя">
                                <i class="ph ph-user"></i>
                            </div>
                            <div class="form-group glass-effect">
                                <label>Фамилия</label>
                                <input type="text" name="lastName" 
                                    value="${this.userData.lastName}" 
                                    placeholder="Введите фамилию">
                                <i class="ph ph-user"></i>
                            </div>
                            <div class="form-group glass-effect">
                                <label>Телефон</label>
                                <input type="tel" name="phone" 
                                    value="${this.userData.phone}" 
                                    placeholder="+7 (___) ___-__-__">
                                <i class="ph ph-phone"></i>
                            </div>
                            <div class="form-group glass-effect">
                                <label>Email</label>
                                <input type="email" name="email" 
                                    value="${this.userData.email}" 
                                    placeholder="example@mail.com">
                                <i class="ph ph-envelope"></i>
                            </div>
                            <button type="submit" class="gradient-btn">
                                <i class="ph ph-check"></i>
                                <span>Сохранить</span>
                            </button>
                        </form>
                    </div>

                    <!-- Адреса -->
                    <div class="profile-section glass-morphism">
                        <div class="section-header">
                            <h3>
                                <i class="ph ph-map-pin"></i>
                                Адреса доставки
                            </h3>
                            <button class="btn-outline-gradient" onclick="window.profile.showAddAddressModal()">
                                <i class="ph ph-plus"></i>
                                <span>Добавить</span>
                            </button>
                        </div>
                        <div class="addresses-list">
                            ${this.userData.addresses.map((address, index) => `
                                <div class="address-card glass-effect">
                                    <div class="address-icon">
                                        <i class="ph ph-house"></i>
                                    </div>
                                    <div class="address-content">
                                        <h4>${address.title}</h4>
                                        <p>${address.street}, ${address.city}</p>
                                    </div>
                                    <button class="btn-icon ripple-effect" onclick="window.profile.removeAddress(${index})">
                                        <i class="ph ph-trash"></i>
                                    </button>
                                </div>
                            `).join('') || `
                                <div class="empty-state">
                                    <i class="ph ph-map-pin"></i>
                                    <p>Нет сохраненных адресов</p>
                                </div>
                            `}
                        </div>
                    </div>

                    <!-- Уведомления -->
                    <div class="profile-section glass-morphism">
                        <div class="section-header">
                            <h3>
                                <i class="ph ph-bell"></i>
                                Уведомления
                            </h3>
                        </div>
                        <div class="notifications-list">
                            <div class="notification-item glass-effect">
                                <div class="notification-icon">
                                    <i class="ph ph-package"></i>
                                </div>
                                <div class="notification-content">
                                    <h4>Статус заказа</h4>
                                    <p>Уведомления об изменении статуса заказа</p>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" 
                                        ${this.userData.notifications.orderStatus ? 'checked' : ''}
                                        onchange="window.profile.updateNotifications({orderStatus: this.checked})">
                                    <span class="slider"></span>
                                </label>
                            </div>
                            <div class="notification-item glass-effect">
                                <div class="notification-icon">
                                    <i class="ph ph-percent"></i>
                                </div>
                                <div class="notification-content">
                                    <h4>Акции и скидки</h4>
                                    <p>Уведомления о специальных предложениях</p>
                                </div>
                                <label class="switch">
                                    <input type="checkbox"
                                        ${this.userData.notifications.promotions ? 'checked' : ''}
                                        onchange="window.profile.updateNotifications({promotions: this.checked})">
                                    <span class="slider"></span>
                                </label>
                            </div>
                            <div class="notification-item glass-effect">
                                <div class="notification-icon">
                                    <i class="ph ph-star"></i>
                                </div>
                                <div class="notification-content">
                                    <h4>Новые товары</h4>
                                    <p>Уведомления о поступлении новых товаров</p>
                                </div>
                                <label class="switch">
                                    <input type="checkbox"
                                        ${this.userData.notifications.newProducts ? 'checked' : ''}
                                        onchange="window.profile.updateNotifications({newProducts: this.checked})">
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- История заказов -->
                    <div class="profile-section glass-morphism">
                        <div class="section-header">
                            <h3>
                                <i class="ph ph-clock-counter-clockwise"></i>
                                История заказов
                            </h3>
                        </div>
                        <div class="orders-history">
                            ${this.renderOrdersHistory()}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Анимируем появление элементов
        gsap.from('.profile-header', {
            y: -30,
            opacity: 0,
            duration: 0.5,
            ease: 'power3.out'
        });

        gsap.from('.profile-section', {
            y: 30,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out'
        });

        this.setupEventListeners();
    }

    renderOrdersHistory() {
        const orders = window.DataService.getOrders();
        
        if (orders.length === 0) {
            return `
                <div class="empty-state">
                    <i class="ph ph-shopping-bag"></i>
                    <p>У вас пока нет заказов</p>
                    <button class="gradient-btn" onclick="window.app.showScreen('home')">
                        <i class="ph ph-shopping-cart"></i>
                        <span>Начать покупки</span>
                    </button>
                </div>
            `;
        }

        return orders.map(order => `
            <div class="order-card glass-effect">
                <div class="order-header">
                    <div class="order-info">
                        <h4>Заказ #${order.id}</h4>
                        <span class="order-date">
                            <i class="ph ph-calendar"></i>
                            ${new Date(order.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <span class="order-status ${order.status}">
                        <i class="ph ph-${this.getStatusIcon(order.status)}"></i>
                        ${this.getStatusText(order.status)}
                    </span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.title}">
                            <div class="order-item-info">
                                <span class="item-title">${item.title}</span>
                                <span class="item-quantity">×${item.quantity}</span>
                            </div>
                            <span class="item-price gradient-text">${item.price * item.quantity} ₽</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-footer">
                    <span class="order-total">
                        <i class="ph ph-currency-circle-dollar"></i>
                        Итого: ${this.calculateOrderTotal(order)} ₽
                    </span>
                    <button class="btn-outline-gradient" onclick="window.profile.reorderItems('${order.id}')">
                        <i class="ph ph-repeat"></i>
                        <span>Повторить заказ</span>
                    </button>
                </div>
            </div>
        `).join('');
    }

    getStatusIcon(status) {
        const icons = {
            new: 'package',
            processing: 'spinner',
            shipped: 'truck',
            delivered: 'check-circle',
            cancelled: 'x-circle'
        };
        return icons[status] || 'info';
    }

    getStatusText(status) {
        const statuses = {
            new: 'Новый',
            processing: 'В обработке',
            shipped: 'Отправлен',
            delivered: 'Доставлен',
            cancelled: 'Отменен'
        };
        return statuses[status] || status;
    }

    calculateOrderTotal(order) {
        return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    setupEventListeners() {
        const personalForm = document.getElementById('personal-form');
        if (personalForm) {
            personalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData.entries());
                this.updateUserData(data);
            });
        }
    }

    showAddAddressModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content glass-morphism">
                <div class="modal-header">
                    <h3>
                        <i class="ph ph-map-pin"></i>
                        Добавить адрес
                    </h3>
                    <button class="btn-icon ripple-effect" onclick="this.closest('.modal').remove()">
                        <i class="ph ph-x"></i>
                    </button>
                </div>
                <form id="address-form" class="modal-form">
                    <div class="form-group glass-effect">
                        <label>Название</label>
                        <input type="text" name="title" placeholder="Например: Дом, Работа" required>
                        <i class="ph ph-bookmark"></i>
                    </div>
                    <div class="form-group glass-effect">
                        <label>Город</label>
                        <input type="text" name="city" required>
                        <i class="ph ph-buildings"></i>
                    </div>
                    <div class="form-group glass-effect">
                        <label>Улица, дом, квартира</label>
                        <input type="text" name="street" required>
                        <i class="ph ph-house"></i>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-outline-gradient" onclick="this.closest('.modal').remove()">
                            <i class="ph ph-x"></i>
                            <span>Отмена</span>
                        </button>
                        <button type="submit" class="gradient-btn">
                            <i class="ph ph-check"></i>
                            <span>Добавить</span>
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Анимация появления
        gsap.from(modal.querySelector('.modal-content'), {
            y: 30,
            opacity: 0,
            duration: 0.3,
            ease: 'power3.out'
        });

        const form = modal.querySelector('#address-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            this.addAddress(data);
            modal.remove();
        });
    }

    addAddress(address) {
        this.userData.addresses.push(address);
        this.saveUserData();
        this.render();
        window.app.showNotification('Адрес добавлен', 'success');
    }

    removeAddress(index) {
        this.userData.addresses.splice(index, 1);
        this.saveUserData();
        this.render();
        window.app.showNotification('Адрес удален', 'success');
    }

    updateNotifications(settings) {
        this.userData.notifications = { ...this.userData.notifications, ...settings };
        this.saveUserData();
        this.render();
    }

    reorderItems(orderId) {
        const order = window.DataService.getOrders().find(o => o.id === orderId);
        if (order) {
            order.items.forEach(item => {
                window.cart.addItem(item, item.quantity);
            });
            window.app.showScreen('cart');
            window.app.showNotification('Товары добавлены в корзину', 'success');
        }
    }
}

// Создаем глобальный экземпляр профиля
window.profile = new Profile();