class Profile {
    constructor() {
        this.userData = this.loadUserData();
        this.activeTab = 'personal';
    }

    loadUserData() {
        const stored = localStorage.getItem('userData');
        return stored ? JSON.parse(stored) : {
            firstName: '',
            phone: '',
            email: '',
            address: '',
            orders: [],
            favorites: [],
            bonusPoints: 2500,
            totalSpent: 45000,
            notifications: {
                orders: true,
                promotions: true,
                news: false
            }
        };
    }

    saveUserData() {
        localStorage.setItem('userData', JSON.stringify(this.userData));
        DataService.userData = { ...DataService.userData, ...this.userData };
    }

    render() {
        const profileScreen = document.getElementById('profile-screen');
        if (!profileScreen) return;

        const userLevel = DataService.getUserLevel();

        profileScreen.innerHTML = `
            <!-- Профиль заголовок -->
            <div class="profile-header">
                <div class="profile-avatar">
                    <div class="avatar-circle">
                        <span class="avatar-text">${this.userData.firstName ? this.userData.firstName[0].toUpperCase() : 'П'}</span>
                    </div>
                </div>
                <div class="profile-info">
                    <h2>${this.userData.firstName || 'Пользователь'}</h2>
                    <p class="profile-phone">${this.userData.phone || 'Добавьте номер телефона'}</p>
                </div>
                <div class="profile-level">
                    <div class="level-badge" style="background: ${userLevel.color}">
                        ${userLevel.name}
                    </div>
                    <div class="bonus-points">
                        <span class="bonus-count">${this.userData.bonusPoints}</span>
                        <span class="bonus-label">баллов</span>
                    </div>
                </div>
            </div>

            <!-- Бонусная система -->
            <div class="bonus-system glass-card">
                <h3>💎 Программа лояльности</h3>
                <div class="bonus-progress">
                    <div class="progress-info">
                        <span>Текущий уровень: <strong style="color: ${userLevel.color}">${userLevel.name}</strong></span>
                        <span class="discount">Скидка: ${userLevel.discount}%</span>
                    </div>
                    <div class="progress-bar-bonus">
                        <div class="progress-fill-bonus" style="width: ${this.getBonusProgress()}%"></div>
                    </div>
                    <div class="progress-levels">
                        ${DataService.bonusSystem.levels.map(level => `
                            <div class="level-point ${this.userData.bonusPoints >= level.minPoints ? 'active' : ''}" 
                                 style="--level-color: ${level.color}">
                                <span class="level-name">${level.name}</span>
                                <span class="level-points">${level.minPoints} б.</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="bonus-stats">
                    <div class="stat-item">
                        <span class="stat-value">${this.userData.totalSpent.toLocaleString()} ₽</span>
                        <span class="stat-label">Потрачено всего</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${this.userData.orders.length}</span>
                        <span class="stat-label">Заказов</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${this.userData.favorites.length}</span>
                        <span class="stat-label">В избранном</span>
                    </div>
                </div>
            </div>

            <!-- Вкладки -->
            <div class="profile-tabs">
                <button class="tab-btn ${this.activeTab === 'personal' ? 'active' : ''}" data-tab="personal">
                    👤 Личные данные
                </button>
                <button class="tab-btn ${this.activeTab === 'orders' ? 'active' : ''}" data-tab="orders">
                    📦 Заказы
                </button>
                <button class="tab-btn ${this.activeTab === 'favorites' ? 'active' : ''}" data-tab="favorites">
                    ❤️ Избранное
                </button>
                <button class="tab-btn ${this.activeTab === 'settings' ? 'active' : ''}" data-tab="settings">
                    ⚙️ Настройки
                </button>
            </div>

            <!-- Содержимое вкладок -->
            <div class="tab-content">
                ${this.renderTabContent()}
            </div>
        `;

        this.setupEventListeners();
    }

    renderTabContent() {
        switch (this.activeTab) {
            case 'personal':
                return `
                    <div class="profile-section glass-card">
                        <h3>Личная информация</h3>
                        <div class="profile-field">
                            <label>Имя *</label>
                            <input type="text" id="user-name" value="${this.userData.firstName}" placeholder="Введите имя">
                        </div>
                        <div class="profile-field">
                            <label>Телефон *</label>
                            <input type="tel" id="user-phone" value="${this.userData.phone}" placeholder="+7 (___) ___-__-__">
                        </div>
                        <div class="profile-field">
                            <label>Email</label>
                            <input type="email" id="user-email" value="${this.userData.email}" placeholder="example@mail.com">
                        </div>
                        <div class="profile-field">
                            <label>Адрес доставки</label>
                            <textarea id="user-address" placeholder="Укажите адрес для доставки" rows="3">${this.userData.address}</textarea>
                        </div>
                        <button class="btn-save" onclick="window.profile.saveProfile()">
                            💾 Сохранить изменения
                        </button>
                    </div>
                `;

            case 'orders':
                return `
                    <div class="profile-section glass-card">
                        <h3>История заказов</h3>
                        <div class="orders-list">
                            ${this.userData.orders.length === 0 ? `
                                <div class="empty-state">
                                    <div class="empty-icon">📦</div>
                                    <h4>Заказов пока нет</h4>
                                    <p>Ваши заказы появятся здесь после оформления</p>
                                    <button class="btn-add" data-screen="home">Перейти к покупкам</button>
                                </div>
                            ` : this.userData.orders.map(order => `
                                <div class="order-item">
                                    <div class="order-header">
                                        <span class="order-number">Заказ #${order.id}</span>
                                        <span class="order-date">${new Date(order.date).toLocaleDateString()}</span>
                                    </div>
                                    <div class="order-details">
                                        <span class="order-status status-${order.status || 'new'}">
                                            ${this.getOrderStatusText(order.status || 'new')}
                                        </span>
                                        <span class="order-total">${order.total} ₽</span>
                                    </div>
                                    <div class="order-items">
                                        ${order.items?.slice(0, 2).map(item => `
                                            <span class="order-item-name">${item.title}</span>
                                        `).join(', ')}
                                        ${order.items?.length > 2 ? ` и ещё ${order.items.length - 2}` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;

            case 'favorites':
                const favoriteProducts = this.userData.favorites.map(id => DataService.getProduct(id)).filter(Boolean);
                return `
                    <div class="profile-section glass-card">
                        <h3>Избранные товары</h3>
                        <div class="favorites-list">
                            ${favoriteProducts.length === 0 ? `
                                <div class="empty-state">
                                    <div class="empty-icon">💖</div>
                                    <h4>Нет избранных товаров</h4>
                                    <p>Добавляйте товары в избранное для быстрого доступа</p>
                                    <button class="btn-add" data-screen="home">Найти товары</button>
                                </div>
                            ` : favoriteProducts.map(product => `
                                <div class="favorite-item">
                                    <img src="${product.image}" alt="${product.title}">
                                    <div class="favorite-info">
                                        <h4>${product.title}</h4>
                                        <p class="favorite-brand">${DataService.getCarBrand(product.brandId)?.name}</p>
                                        <p class="favorite-price">${product.price} ₽</p>
                                    </div>
                                    <div class="favorite-actions">
                                        <button class="btn-remove" onclick="window.profile.removeFromFavorites('${product.id}')">🗑️</button>
                                        <button class="btn-add" onclick="window.cart.addItem(${JSON.stringify(product).replace(/"/g, '&quot;')})">В корзину</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;

            case 'settings':
                return `
                    <div class="profile-section glass-card">
                        <h3>Уведомления</h3>
                        <div class="settings-list">
                            <div class="setting-item">
                                <div class="setting-info">
                                    <span class="setting-title">Уведомления о заказах</span>
                                    <span class="setting-description">Статус доставки и изменения заказа</span>
                                </div>
                                <label class="toggle">
                                    <input type="checkbox" ${this.userData.notifications.orders ? 'checked' : ''} data-notification="orders">
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div class="setting-item">
                                <div class="setting-info">
                                    <span class="setting-title">Акции и скидки</span>
                                    <span class="setting-description">Специальные предложения и промокоды</span>
                                </div>
                                <label class="toggle">
                                    <input type="checkbox" ${this.userData.notifications.promotions ? 'checked' : ''} data-notification="promotions">
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div class="setting-item">
                                <div class="setting-info">
                                    <span class="setting-title">Новости компании</span>
                                    <span class="setting-description">Новые товары и новости</span>
                                </div>
                                <label class="toggle">
                                    <input type="checkbox" ${this.userData.notifications.news ? 'checked' : ''} data-notification="news">
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="danger-zone">
                            <h4>⚠️ Опасная зона</h4>
                            <button class="btn-danger" onclick="window.profile.clearAllData()">
                                🗑️ Очистить все данные
                            </button>
                        </div>
                    </div>
                `;

            default:
                return '<div>Содержимое не найдено</div>';
        }
    }

    setupEventListeners() {
        // Переключение вкладок
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.activeTab = e.target.getAttribute('data-tab');
                this.render();
            });
        });

        // Настройки уведомлений
        document.querySelectorAll('input[data-notification]').forEach(input => {
            input.addEventListener('change', (e) => {
                const notificationType = e.target.getAttribute('data-notification');
                this.userData.notifications[notificationType] = e.target.checked;
                this.saveUserData();
            });
        });

        // Кнопки навигации
        document.querySelectorAll('[data-screen]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const screen = e.target.getAttribute('data-screen');
                window.app.showScreen(screen);
            });
        });
    }

    getBonusProgress() {
        const currentLevel = DataService.getUserLevel();
        const currentIndex = DataService.bonusSystem.levels.findIndex(l => l.name === currentLevel.name);
        const nextLevel = DataService.bonusSystem.levels[currentIndex + 1];
        
        if (!nextLevel) return 100; // Максимальный уровень
        
        const progress = ((this.userData.bonusPoints - currentLevel.minPoints) / 
                         (nextLevel.minPoints - currentLevel.minPoints)) * 100;
        return Math.min(100, Math.max(0, progress));
    }

    getOrderStatusText(status) {
        const statuses = {
            'new': '🔄 Новый',
            'processing': '⏳ Обрабатывается',
            'shipped': '🚚 Доставляется',
            'delivered': '✅ Доставлен',
            'cancelled': '❌ Отменён'
        };
        return statuses[status] || '❓ Неизвестно';
    }

    saveProfile() {
        this.userData.firstName = document.getElementById('user-name').value;
        this.userData.phone = document.getElementById('user-phone').value;
        this.userData.email = document.getElementById('user-email').value;
        this.userData.address = document.getElementById('user-address').value;
        
        this.saveUserData();
        
        // Показываем уведомление
        this.showNotification('✅ Профиль сохранён!', 'success');
        this.render(); // Перерендерим для обновления заголовка
    }

    removeFromFavorites(productId) {
        this.userData.favorites = this.userData.favorites.filter(id => id !== productId);
        DataService.removeFromFavorites(productId);
        this.saveUserData();
        this.render();
    }

    clearAllData() {
        if (confirm('Вы уверены? Все данные будут удалены безвозвратно.')) {
            localStorage.clear();
            this.userData = this.loadUserData();
            this.showNotification('🗑️ Все данные очищены', 'info');
            this.render();
        }
    }

    showNotification(message, type = 'info') {
        // Простое уведомление
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10B981' : '#3B82F6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    addOrder(order) {
        this.userData.orders.unshift({
            id: order.id,
            date: order.date,
            total: order.total,
            items: order.items,
            status: 'new'
        });
        this.saveUserData();
        this.render();
    }
}