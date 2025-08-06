class Profile {
    constructor() {
        this.userData = this.loadUserData();
    }

    loadUserData() {
        const stored = localStorage.getItem('userData');
        return stored ? JSON.parse(stored) : {
            firstName: '',
            phone: '',
            email: '',
            orders: []
        };
    }

    saveUserData() {
        localStorage.setItem('userData', JSON.stringify(this.userData));
    }

    render() {
        const profileScreen = document.getElementById('profile-screen');
        if (!profileScreen) return;

        profileScreen.innerHTML = `
            <div class="profile-section">
                <h3>Личные данные</h3>
                <div class="profile-field">
                    <label>Имя</label>
                    <input type="text" id="user-name" value="${this.userData.firstName}" placeholder="Введите имя">
                </div>
                <div class="profile-field">
                    <label>Телефон</label>
                    <input type="tel" id="user-phone" value="${this.userData.phone}" placeholder="+7 (___) ___-__-__">
                </div>
                <div class="profile-field">
                    <label>Email</label>
                    <input type="email" id="user-email" value="${this.userData.email}" placeholder="example@mail.com">
                </div>
                <button class="btn-add" onclick="window.profile.saveProfile()">Сохранить</button>
            </div>
            
            <div class="profile-section">
                <h3>История заказов</h3>
                <div id="orders-list">
                    ${this.userData.orders.length === 0 ? 
                        '<p style="color: #94A3B8;">У вас пока нет заказов</p>' : 
                        this.userData.orders.map(order => `
                            <div class="cart-item">
                                <div class="cart-item-info">
                                    <h4>Заказ #${order.id}</h4>
                                    <p>${order.total} ₽ • ${new Date(order.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
        `;
    }

    saveProfile() {
        this.userData.firstName = document.getElementById('user-name').value;
        this.userData.phone = document.getElementById('user-phone').value;
        this.userData.email = document.getElementById('user-email').value;
        this.saveUserData();
        alert('Профиль сохранён!');
    }

    addOrder(order) {
        this.userData.orders.push({
            id: Date.now(),
            date: new Date().toISOString(),
            total: order.total,
            items: order.items
        });
        this.saveUserData();
        this.render();
    }
}