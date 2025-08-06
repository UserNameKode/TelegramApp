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
        window.uiComponents.showNotification('Профиль обновлен', 'success');
    }

    addAddress(address) {
        this.userData.addresses.push(address);
        this.saveUserData();
        this.render();
    }

    removeAddress(index) {
        this.userData.addresses.splice(index, 1);
        this.saveUserData();
        this.render();
    }

    updateNotifications(settings) {
        this.userData.notifications = { ...this.userData.notifications, ...settings };
        this.saveUserData();
        this.render();
    }

    render() {
        const profileContainer = document.querySelector('.profile-info');
        if (!profileContainer) return;

        profileContainer.innerHTML = `
            <div class="profile-header">
                <div class="profile-avatar">
                    ${this.userData.firstName ? this.userData.firstName[0] : '👤'}
                </div>
                <div class="profile-title">
                    <h2>${this.userData.firstName ? `${this.userData.firstName} ${this.userData.lastName}` : 'Ваш профиль'}</h2>
                    <p class="profile-subtitle">${this.userData.email || 'Укажите ваши данные'}</p>
                </div>
            </div>

            <div class="profile-sections">
                <!-- Личные данные -->
                <section class="profile-section">
                    <h3>Личные данные</h3>
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
                        <button type="submit" class="btn btn-primary">Сохранить</button>
                    </form>
                </section>

                <!-- Адреса доставки -->
                <section class="profile-section">
                    <h3>Адреса доставки</h3>
                    <div class="addresses-list">
                        ${this.userData.addresses.map((address, index) => `
                            <div class="address-card">
                                <div class="address-content">
                                    <h4>${address.title}</h4>
                                    <p>${address.street}, ${address.city}</p>
                                </div>
                                <button class="btn-icon" onclick="window.profile.removeAddress(${index})">
                                    <span class="icon">×</span>
                                </button>
                            </div>
                        `).join('') || '<p class="empty-text">Нет сохраненных адресов</p>'}
                        <button class="btn btn-outline add-address-btn">
                            <span class="icon">+</span> Добавить адрес
                        </button>
                    </div>
                </section>

                <!-- Настройки уведомлений -->
                <section class="profile-section">
                    <h3>Уведомления</h3>
                    <div class="notifications-settings">
                        <div class="setting-item">
                            <label class="switch">
                                <input type="checkbox" 
                                    ${this.userData.notifications.orderStatus ? 'checked' : ''}
                                    onchange="window.profile.updateNotifications({orderStatus: this.checked})">
                                <span class="slider"></span>
                            </label>
                            <div class="setting-content">
                                <h4>Статус заказа</h4>
                                <p>Уведомления об изменении статуса заказа</p>
                            </div>
                        </div>
                        <div class="setting-item">
                            <label class="switch">
                                <input type="checkbox"
                                    ${this.userData.notifications.promotions ? 'checked' : ''}
                                    onchange="window.profile.updateNotifications({promotions: this.checked})">
                                <span class="slider"></span>
                            </label>
                            <div class="setting-content">
                                <h4>Акции и скидки</h4>
                                <p>Уведомления о специальных предложениях</p>
                            </div>
                        </div>
                        <div class="setting-item">
                            <label class="switch">
                                <input type="checkbox"
                                    ${this.userData.notifications.newProducts ? 'checked' : ''}
                                    onchange="window.profile.updateNotifications({newProducts: this.checked})">
                                <span class="slider"></span>
                            </label>
                            <div class="setting-content">
                                <h4>Новые товары</h4>
                                <p>Уведомления о поступлении новых товаров</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- История заказов -->
                <section class="profile-section">
                    <h3>История заказов</h3>
                    <div class="orders-history">
                        ${this.renderOrdersHistory()}
                    </div>
                </section>
            </div>
        `;

        this.setupEventListeners();
    }

    renderOrdersHistory() {
        const orders = window.DataService.getOrders();
        
        if (orders.length === 0) {
            return `
                <div class="empty-orders">
                    <div class="empty-icon">📦</div>
                    <p>У вас пока нет заказов</p>
                    <button class="btn btn-primary" onclick="window.uiComponents.showHome()">
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
                    <button class="btn btn-outline" onclick="window.profile.reorderItems('${order.id}')">
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

    reorderItems(orderId) {
        const order = window.DataService.getOrders().find(o => o.id === orderId);
        if (order) {
            order.items.forEach(item => {
                window.cart.addItem(item, item.quantity);
            });
            window.uiComponents.showCart();
        }
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

        const addAddressBtn = document.querySelector('.add-address-btn');
        if (addAddressBtn) {
            addAddressBtn.addEventListener('click', () => {
                this.showAddAddressModal();
            });
        }
    }

    showAddAddressModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Добавить адрес</h3>
                <form id="address-form" class="address-form">
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
                        <button type="button" class="btn btn-outline" onclick="this.closest('.modal').remove()">
                            Отмена
                        </button>
                        <button type="submit" class="btn btn-primary">
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
}

// Создаем глобальный экземпляр профиля
window.profile = new Profile();