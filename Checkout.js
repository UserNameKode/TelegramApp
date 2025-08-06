class Checkout {
    constructor() {
        this.deliveryMethods = [
            { id: 'courier', title: 'Курьером', price: 300, time: '1-2 дня' },
            { id: 'pickup', title: 'Самовывоз', price: 0, time: 'Сегодня' },
            { id: 'post', title: 'Почтой России', price: 350, time: '5-7 дней' }
        ];

        this.paymentMethods = [
            { id: 'card', title: 'Банковской картой', icon: '💳' },
            { id: 'cash', title: 'Наличными при получении', icon: '💵' },
            { id: 'online', title: 'Онлайн оплата', icon: '🌐' }
        ];

        this.init();
    }

    init() {
        this.render();
    }

    render() {
        const checkoutContainer = document.querySelector('#checkout-screen');
        if (!checkoutContainer) return;

        const cart = window.cart.items;
        const subtotal = window.cart.calculateTotal();
        const userData = window.profile.userData;

        checkoutContainer.innerHTML = `
            <div class="checkout-container">
                <div class="checkout-main">
                    <!-- Форма заказа -->
                    <form id="checkout-form" class="checkout-form">
                        <!-- Личные данные -->
                        <section class="checkout-section">
                            <h3>Личные данные</h3>
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
                        </section>

                        <!-- Способ доставки -->
                        <section class="checkout-section">
                            <h3>Способ доставки</h3>
                            <div class="delivery-methods">
                                ${this.deliveryMethods.map(method => `
                                    <label class="delivery-method">
                                        <input type="radio" name="delivery" 
                                            value="${method.id}" 
                                            ${method.id === 'courier' ? 'checked' : ''}>
                                        <div class="method-content">
                                            <div class="method-title">
                                                <h4>${method.title}</h4>
                                                <span class="method-price">
                                                    ${method.price > 0 ? `${method.price} ₽` : 'Бесплатно'}
                                                </span>
                                            </div>
                                            <p class="method-time">Срок доставки: ${method.time}</p>
                                        </div>
                                    </label>
                                `).join('')}
                            </div>
                        </section>

                        <!-- Адрес доставки -->
                        <section class="checkout-section" id="delivery-address">
                            <h3>Адрес доставки</h3>
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
                        </section>

                        <!-- Способ оплаты -->
                        <section class="checkout-section">
                            <h3>Способ оплаты</h3>
                            <div class="payment-methods">
                                ${this.paymentMethods.map(method => `
                                    <label class="payment-method">
                                        <input type="radio" name="payment" 
                                            value="${method.id}" 
                                            ${method.id === 'card' ? 'checked' : ''}>
                                        <div class="method-content">
                                            <span class="method-icon">${method.icon}</span>
                                            <span class="method-title">${method.title}</span>
                                        </div>
                                    </label>
                                `).join('')}
                            </div>
                        </section>
                    </form>
                </div>

                <!-- Сводка заказа -->
                <div class="checkout-sidebar">
                    <div class="order-summary">
                        <h3>Ваш заказ</h3>
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
                                <span>Товары:</span>
                                <span>${subtotal} ₽</span>
                            </div>
                            <div class="total-line">
                                <span>Доставка:</span>
                                <span id="delivery-cost">300 ₽</span>
                            </div>
                            <div class="total-line total">
                                <span>Итого:</span>
                                <span id="total-cost">${subtotal + 300} ₽</span>
                            </div>
                        </div>
                        <button class="btn btn-primary btn-lg submit-order" onclick="window.checkout.submitOrder()">
                            Оформить заказ
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
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
            window.uiComponents.showLoading();

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
            window.uiComponents.showNotification('Ошибка при оформлении заказа', 'error');
        } finally {
            window.uiComponents.hideLoading();
        }
    }

    validateForm(data) {
        const required = ['firstName', 'phone'];
        const missing = required.filter(field => !data[field]);

        if (missing.length > 0) {
            window.uiComponents.showNotification('Заполните обязательные поля', 'error');
            return false;
        }

        if (data.delivery !== 'pickup' && (!data.city || !data.street)) {
            window.uiComponents.showNotification('Укажите адрес доставки', 'error');
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
                    <div class="checkmark">✓</div>
                </div>
                <h2>Заказ оформлен!</h2>
                <p>Номер заказа: ${order.id}</p>
                <p>Мы отправили детали заказа на ваш email</p>
                <div class="modal-actions">
                    <button class="btn btn-outline" onclick="window.uiComponents.showProfile()">
                        История заказов
                    </button>
                    <button class="btn btn-primary" onclick="window.uiComponents.showHome()">
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
                window.uiComponents.showHome();
            }
        });
    }
}

// Создаем глобальный экземпляр оформления заказа
window.checkout = new Checkout();