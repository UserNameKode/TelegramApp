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
                <div class="profile-header">
                    <div class="profile-avatar">
                        ${this.userData.firstName ? this.userData.firstName[0].toUpperCase() : ''}
                    </div>
                    <div class="profile-info">
                        <h2>${this.userData.firstName ? `${this.userData.firstName} ${this.userData.lastName}` : 'Ваш профиль'}</h2>
                        <p>${this.userData.email || 'Укажите ваши данные'}</p>
                    </div>
                </div>

                <div class="profile-sections">
                    <!-- Личные данные -->
                    <div class="profile-section">
                        <div class="section-header">
                            <h3>Личные данные</h3>
                            <svg class="section-icon" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        </div>
                        <form id="personal-form" class="profile-form">
                            <div class="form-group">
                                <label>Имя</label>
                                <input type="text" name="firstName" value="${this.userData.firstName}" placeholder="Введите имя">
                            </div>
                            <div class="form-group">
                                <label>Фамилия</label>
                                <input type="text" name="lastName" value="${this.userData.lastName}" placeholder="Введите фамилию">
                            </div>
                            <div class="form-group">
                                <label>Телефон</label>
                                <input type="tel" name="phone" value="${this.userData.phone}" placeholder="+7 (___) ___-__-__">
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" name="email" value="${this.userData.email}" placeholder="example@mail.com">
                            </div>
                            <button type="submit" class="btn-primary">Сохранить</button>
                        </form>
                    </div>

                    <!-- Адреса -->
                    <div class="profile-section">
                        <div class="section-header">
                            <h3>Адреса доставки</h3>
                            <svg class="section-icon" viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                        </div>
                        <div class="addresses-list">
                            ${this.userData.addresses.map((address, index) => `
                                <div class="address-card">
                                    <div class="address-content">
                                        <h4>${address.title}</h4>
                                        <p>${address.street}, ${address.city}</p>
                                    </div>
                                    <button class="btn-icon" onclick="window.profile.removeAddress(${index})">
                                        <svg viewBox="0 0 24 24">
                                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                        </svg>
                                    </button>
                                </div>
                            `).join('') || `
                                <div class="empty-state">
                                    <svg class="empty-icon" viewBox="0 0 24 24">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                    </svg>
                                    <p>Нет сохраненных адресов</p>
                                </div>
                            `}
                            <button class="btn-outline btn-add-address" onclick="window.profile.showAddAddressModal()">
                                <svg viewBox="0 0 24 24">
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                </svg>
                                Добавить адрес
                            </button>
                        </div>
                    </div>

                    <!-- Уведомления -->
                    <div class="profile-section">
                        <div class="section-header">
                            <h3>Уведомления</h3>
                            <svg class="section-icon" viewBox="0 0 24 24">
                                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
                            </svg>
                        </div>
                        <div class="notifications-list">
                            <div class="notification-item">
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
                            <div class="notification-item">
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
                            <div class="notification-item">
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
                    <div class="profile-section">
                        <div class="section-header">
                            <h3>История заказов</h3>
                            <svg class="section-icon" viewBox="0 0 24 24">
                                <path d="M13 12h7v1.5h-7zm0-2.5h7V11h-7zm0 5h7V16h-7zM21 4H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 15h-9V6h9v13z"/>
                            </svg>
                        </div>
                        <div class="orders-history">
                            ${this.renderOrdersHistory()}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    renderOrdersHistory() {
        const orders = window.DataService.getOrders();
        
        if (orders.length === 0) {
            return `
                <div class="empty-state">
                    <svg class="empty-icon" viewBox="0 0 24 24">
                        <path d="M13 12h7v1.5h-7zm0-2.5h7V11h-7zm0 5h7V16h-7zM21 4H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 15h-9V6h9v13z"/>
                    </svg>
                    <p>У вас пока нет заказов</p>
                    <button class="btn-primary" onclick="window.app.showScreen('home')">
                        Начать покупки
                    </button>
                </div>
            `;
        }

        return orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-info">
                        <h4>Заказ #${order.id}</h4>
                        <span class="order-date">${new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span class="order-status ${order.status}">${this.getStatusText(order.status)}</span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.title}">
                            <div class="order-item-info">
                                <span class="item-title">${item.title}</span>
                                <span class="item-quantity">×${item.quantity}</span>
                            </div>
                            <span class="item-price">${item.price * item.quantity} ₽</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-footer">
                    <span class="order-total">Итого: ${this.calculateOrderTotal(order)} ₽</span>
                    <button class="btn-outline" onclick="window.profile.reorderItems('${order.id}')">
                        <svg viewBox="0 0 24 24">
                            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                        </svg>
                        Повторить заказ
                    </button>
                </div>
            </div>
        `).join('');
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
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Добавить адрес</h3>
                    <button class="btn-icon" onclick="this.closest('.modal').remove()">
                        <svg viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>
                <form id="address-form" class="modal-form">
                    <div class="form-group">
                        <label>Название</label>
                        <input type="text" name="title" placeholder="Например: Дом, Работа" required>
                    </div>
                    <div class="form-group">
                        <label>Город</label>
                        <input type="text" name="city" required>
                    </div>
                    <div class="form-group">
                        <label>Улица, дом, квартира</label>
                        <input type="text" name="street" required>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-outline" onclick="this.closest('.modal').remove()">
                            Отмена
                        </button>
                        <button type="submit" class="btn-primary">
                            Добавить
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

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