class Checkout {
    constructor() {
        this.deliveryMethods = [
            { id: 'courier', title: 'Курьером', price: 300, time: '1-2 дня', icon: `
                <svg viewBox="0 0 24 24">
                    <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
            ` },
            { id: 'pickup', title: 'Самовывоз', price: 0, time: 'Сегодня', icon: `
                <svg viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
            ` },
            { id: 'post', title: 'Почтой России', price: 350, time: '5-7 дней', icon: `
                <svg viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
            ` }
        ];

        this.paymentMethods = [
            { id: 'card', title: 'Банковской картой', icon: `
                <svg viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                </svg>
            ` },
            { id: 'cash', title: 'Наличными при получении', icon: `
                <svg viewBox="0 0 24 24">
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
            ` },
            { id: 'online', title: 'Онлайн оплата', icon: `
                <svg viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>
            ` }
        ];

        this.init();
    }

    init() {
        this.render();
    }

    render() {
        const checkoutScreen = document.getElementById('checkout-screen');
        if (!checkoutScreen) return;

        const cart = window.cart.items;
        const subtotal = window.cart.calculateTotal();
        const userData = window.profile.userData;

        checkoutScreen.innerHTML = `
            <div class="checkout-content">
                <div class="checkout-main">
                    <form id="checkout-form" class="checkout-form">
                        <!-- Личные данные -->
                        <div class="checkout-section">
                            <div class="section-header">
                                <h3>Личные данные</h3>
                                <svg class="section-icon" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                            </div>
                            <div class="form-group">
                                <label>Имя*</label>
                                <input type="text" name="firstName" required 
                                    value="${userData.firstName || ''}" 
                                    placeholder="Введите имя">
                            </div>
                            <div class="form-group">
                                <label>Телефон*</label>
                                <input type="tel" name="phone" required 
                                    value="${userData.phone || ''}" 
                                    placeholder="+7 (___) ___-__-__">
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" name="email" 
                                    value="${userData.email || ''}" 
                                    placeholder="example@mail.com">
                            </div>
                        </div>

                        <!-- Способ доставки -->
                        <div class="checkout-section">
                            <div class="section-header">
                                <h3>Способ доставки</h3>
                                <svg class="section-icon" viewBox="0 0 24 24">
                                    <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z"/>
                                </svg>
                            </div>
                            <div class="delivery-methods">
                                ${this.deliveryMethods.map(method => `
                                    <label class="delivery-method">
                                        <input type="radio" name="delivery" 
                                            value="${method.id}" 
                                            ${method.id === 'courier' ? 'checked' : ''}>
                                        <div class="method-content">
                                            <div class="method-icon">${method.icon}</div>
                                            <div class="method-info">
                                                <h4>${method.title}</h4>
                                                <div class="method-details">
                                                    <span class="method-time">${method.time}</span>
                                                    <span class="method-price">
                                                        ${method.price > 0 ? `${method.price} ₽` : 'Бесплатно'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Адрес доставки -->
                        <div class="checkout-section" id="delivery-address">
                            <div class="section-header">
                                <h3>Адрес доставки</h3>
                                <svg class="section-icon" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                            </div>
                            ${userData.addresses.length > 0 ? `
                                <div class="saved-addresses">
                                    <select name="savedAddress" class="form-select">
                                        <option value="">Выбрать сохраненный адрес</option>
                                        ${userData.addresses.map(address => `
                                            <option value="${address.id}">
                                                ${address.title}: ${address.street}, ${address.city}
                                            </option>
                                        `).join('')}
                                    </select>
                                </div>
                            ` : ''}
                            <div class="form-group">
                                <label>Город*</label>
                                <input type="text" name="city" required placeholder="Введите город">
                            </div>
                            <div class="form-group">
                                <label>Улица, дом, квартира*</label>
                                <input type="text" name="street" required placeholder="Введите адрес">
                            </div>
                            <div class="form-group">
                                <label>Комментарий к доставке</label>
                                <textarea name="comment" placeholder="Например: код домофона, этаж"></textarea>
                            </div>
                        </div>

                        <!-- Способ оплаты -->
                        <div class="checkout-section">
                            <div class="section-header">
                                <h3>Способ оплаты</h3>
                                <svg class="section-icon" viewBox="0 0 24 24">
                                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                                </svg>
                            </div>
                            <div class="payment-methods">
                                ${this.paymentMethods.map(method => `
                                    <label class="payment-method">
                                        <input type="radio" name="payment" 
                                            value="${method.id}" 
                                            ${method.id === 'card' ? 'checked' : ''}>
                                        <div class="method-content">
                                            <div class="method-icon">${method.icon}</div>
                                            <span class="method-title">${method.title}</span>
                                        </div>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    </form>
                </div>

                <!-- Сводка заказа -->
                <div class="checkout-sidebar">
                    <div class="order-summary">
                        <div class="section-header">
                            <h3>Ваш заказ</h3>
                            <span class="items-count">${cart.length} ${this.getItemsText(cart.length)}</span>
                        </div>
                        <div class="order-items">
                            ${cart.map(item => `
                                <div class="order-item">
                                    <img src="${item.image}" alt="${item.title}">
                                    <div class="item-details">
                                        <h4>${item.title}</h4>
                                        <p class="item-article">Артикул: ${item.article}</p>
                                        <div class="item-price">
                                            <span class="quantity">${item.quantity} ×</span>
                                            <span class="price">${item.price} ₽</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="order-totals">
                            <div class="total-line">
                                <span>Товары</span>
                                <span>${subtotal} ₽</span>
                            </div>
                            <div class="total-line">
                                <span>Доставка</span>
                                <span id="delivery-cost">300 ₽</span>
                            </div>
                            <div class="total-line total">
                                <span>Итого</span>
                                <span id="total-cost">${subtotal + 300} ₽</span>
                            </div>
                        </div>
                        <button type="button" class="btn-primary btn-lg" onclick="window.checkout.submitOrder()">
                            Оформить заказ
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    getItemsText(count) {
        const cases = [2, 0, 1, 1, 1, 2];
        const titles = ['товар', 'товара', 'товаров'];
        return titles[(count % 100 > 4 && count % 100 < 20) ? 2 : cases[(count % 10 < 5) ? count % 10 : 5]];
    }

    setupEventListeners() {
        // Обработка выбора способа доставки
        const deliveryInputs = document.querySelectorAll('input[name="delivery"]');
        deliveryInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const method = this.deliveryMethods.find(m => m.id === e.target.value);
                const deliveryCost = document.getElementById('delivery-cost');
                const totalCost = document.getElementById('total-cost');
                const subtotal = window.cart.calculateTotal();

                deliveryCost.textContent = method.price > 0 ? `${method.price} ₽` : 'Бесплатно';
                totalCost.textContent = `${subtotal + method.price} ₽`;

                // Показываем/скрываем адрес доставки
                const addressSection = document.getElementById('delivery-address');
                addressSection.style.display = method.id === 'pickup' ? 'none' : 'block';
            });
        });

        // Обработка выбора сохраненного адреса
        const addressSelect = document.querySelector('select[name="savedAddress"]');
        if (addressSelect) {
            addressSelect.addEventListener('change', (e) => {
                const address = window.profile.userData.addresses.find(a => a.id === e.target.value);
                if (address) {
                    document.querySelector('input[name="city"]').value = address.city;
                    document.querySelector('input[name="street"]').value = address.street;
                }
            });
        }
    }

    async submitOrder() {
        const form = document.getElementById('checkout-form');
        if (!form) return;

        const formData = new FormData(form);
        const orderData = Object.fromEntries(formData.entries());

        // Валидация
        if (!this.validateForm(orderData)) {
            return;
        }

        try {
            // Показываем индикатор загрузки
            window.app.showLoading();

            // Создаем заказ
            const order = await window.DataService.createOrder({
                ...orderData,
                items: window.cart.items,
                status: 'new',
                createdAt: new Date().toISOString()
            });

            // Очищаем корзину
            window.cart.clearCart();

            // Показываем успешное оформление
            this.showOrderSuccess(order);

        } catch (error) {
            console.error('Ошибка при оформлении заказа:', error);
            window.app.showNotification('Ошибка при оформлении заказа', 'error');
        } finally {
            window.app.hideLoading();
        }
    }

    validateForm(data) {
        const required = ['firstName', 'phone'];
        const missing = required.filter(field => !data[field]);

        if (missing.length > 0) {
            window.app.showNotification('Заполните обязательные поля', 'error');
            return false;
        }

        if (data.delivery !== 'pickup' && (!data.city || !data.street)) {
            window.app.showNotification('Укажите адрес доставки', 'error');
            return false;
        }

        return true;
    }

    showOrderSuccess(order) {
        const modal = document.createElement('div');
        modal.className = 'modal success-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="success-animation">
                    <svg class="checkmark" viewBox="0 0 52 52">
                        <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                        <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                </div>
                <h2>Заказ оформлен!</h2>
                <p>Номер заказа: ${order.id}</p>
                <p>Мы отправили детали заказа на ваш email</p>
                <div class="modal-actions">
                    <button class="btn-outline" onclick="window.app.showScreen('profile')">
                        История заказов
                    </button>
                    <button class="btn-primary" onclick="window.app.showScreen('home')">
                        Продолжить покупки
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Удаляем модальное окно при клике вне его содержимого
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                window.app.showScreen('home');
            }
        });
    }
}

// Создаем глобальный экземпляр оформления заказа
window.checkout = new Checkout();