class Checkout {
    constructor() {
        this.deliveryMethods = [
            { 
                id: 'courier', 
                title: 'Курьером', 
                price: 300, 
                time: '1-2 дня', 
                icon: 'truck',
                description: 'Доставка до двери курьером в удобное время'
            },
            { 
                id: 'pickup', 
                title: 'Самовывоз', 
                price: 0, 
                time: 'Сегодня', 
                icon: 'map-pin',
                description: 'Бесплатный самовывоз из нашего магазина'
            },
            { 
                id: 'post', 
                title: 'Почтой России', 
                price: 350, 
                time: '5-7 дней', 
                icon: 'package',
                description: 'Доставка в любую точку России'
            }
        ];

        this.paymentMethods = [
            { 
                id: 'card', 
                title: 'Банковской картой', 
                icon: 'credit-card',
                description: 'Visa, MasterCard, МИР'
            },
            { 
                id: 'cash', 
                title: 'Наличными при получении', 
                icon: 'money',
                description: 'Оплата курьеру при доставке'
            },
            { 
                id: 'online', 
                title: 'Онлайн оплата', 
                icon: 'qr-code',
                description: 'СБП, ЮMoney, QIWI'
            }
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
                    <div class="checkout-progress glass-morphism">
                        <div class="progress-step active">
                            <div class="step-icon">
                                <i class="ph ph-user"></i>
                            </div>
                            <span>Контакты</span>
                        </div>
                        <div class="progress-line"></div>
                        <div class="progress-step">
                            <div class="step-icon">
                                <i class="ph ph-truck"></i>
                            </div>
                            <span>Доставка</span>
                        </div>
                        <div class="progress-line"></div>
                        <div class="progress-step">
                            <div class="step-icon">
                                <i class="ph ph-credit-card"></i>
                            </div>
                            <span>Оплата</span>
                        </div>
                    </div>

                    <form id="checkout-form" class="checkout-form">
                        <!-- Личные данные -->
                        <div class="checkout-section glass-morphism">
                            <div class="section-header">
                                <h3>
                                    <i class="ph ph-user-circle"></i>
                                    Личные данные
                                </h3>
                            </div>
                            <div class="form-group glass-effect">
                                <label>Имя*</label>
                                <input type="text" name="firstName" required 
                                    value="${userData.firstName || ''}" 
                                    placeholder="Введите имя">
                                <i class="ph ph-user"></i>
                            </div>
                            <div class="form-group glass-effect">
                                <label>Телефон*</label>
                                <input type="tel" name="phone" required 
                                    value="${userData.phone || ''}" 
                                    placeholder="+7 (___) ___-__-__">
                                <i class="ph ph-phone"></i>
                            </div>
                            <div class="form-group glass-effect">
                                <label>Email</label>
                                <input type="email" name="email" 
                                    value="${userData.email || ''}" 
                                    placeholder="example@mail.com">
                                <i class="ph ph-envelope"></i>
                            </div>
                        </div>

                        <!-- Способ доставки -->
                        <div class="checkout-section glass-morphism">
                            <div class="section-header">
                                <h3>
                                    <i class="ph ph-truck"></i>
                                    Способ доставки
                                </h3>
                            </div>
                            <div class="delivery-methods">
                                ${this.deliveryMethods.map(method => `
                                    <label class="delivery-method glass-effect">
                                        <input type="radio" name="delivery" 
                                            value="${method.id}" 
                                            ${method.id === 'courier' ? 'checked' : ''}>
                                        <div class="method-content">
                                            <div class="method-icon">
                                                <i class="ph ph-${method.icon}"></i>
                                            </div>
                                            <div class="method-info">
                                                <h4>${method.title}</h4>
                                                <p>${method.description}</p>
                                                <div class="method-details">
                                                    <span class="delivery-time">
                                                        <i class="ph ph-clock"></i>
                                                        ${method.time}
                                                    </span>
                                                    <span class="delivery-price gradient-text">
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
                        <div class="checkout-section glass-morphism" id="delivery-address">
                            <div class="section-header">
                                <h3>
                                    <i class="ph ph-map-pin"></i>
                                    Адрес доставки
                                </h3>
                            </div>
                            ${userData.addresses.length > 0 ? `
                                <div class="saved-addresses">
                                    <div class="form-group glass-effect">
                                        <label>Выберите сохраненный адрес</label>
                                        <select name="savedAddress" class="form-select">
                                            <option value="">Новый адрес</option>
                                            ${userData.addresses.map(address => `
                                                <option value="${address.id}">
                                                    ${address.title}: ${address.street}, ${address.city}
                                                </option>
                                            `).join('')}
                                        </select>
                                        <i class="ph ph-houses"></i>
                                    </div>
                                </div>
                            ` : ''}
                            <div class="address-fields">
                                <div class="form-group glass-effect">
                                    <label>Город*</label>
                                    <input type="text" name="city" required placeholder="Введите город">
                                    <i class="ph ph-buildings"></i>
                                </div>
                                <div class="form-group glass-effect">
                                    <label>Улица, дом, квартира*</label>
                                    <input type="text" name="street" required placeholder="Введите адрес">
                                    <i class="ph ph-house"></i>
                                </div>
                                <div class="form-group glass-effect">
                                    <label>Комментарий к доставке</label>
                                    <textarea name="comment" placeholder="Например: код домофона, этаж"></textarea>
                                    <i class="ph ph-note-pencil"></i>
                                </div>
                            </div>
                        </div>

                        <!-- Способ оплаты -->
                        <div class="checkout-section glass-morphism">
                            <div class="section-header">
                                <h3>
                                    <i class="ph ph-credit-card"></i>
                                    Способ оплаты
                                </h3>
                            </div>
                            <div class="payment-methods">
                                ${this.paymentMethods.map(method => `
                                    <label class="payment-method glass-effect">
                                        <input type="radio" name="payment" 
                                            value="${method.id}" 
                                            ${method.id === 'card' ? 'checked' : ''}>
                                        <div class="method-content">
                                            <div class="method-icon">
                                                <i class="ph ph-${method.icon}"></i>
                                            </div>
                                            <div class="method-info">
                                                <h4>${method.title}</h4>
                                                <p>${method.description}</p>
                                            </div>
                                        </div>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    </form>
                </div>

                <!-- Сводка заказа -->
                <div class="checkout-sidebar">
                    <div class="order-summary glass-morphism">
                        <div class="section-header">
                            <h3>Ваш заказ</h3>
                            <span class="items-count">
                                <i class="ph ph-shopping-cart"></i>
                                ${cart.length} ${this.getItemsText(cart.length)}
                            </span>
                        </div>
                        <div class="order-items">
                            ${cart.map(item => `
                                <div class="order-item glass-effect">
                                    <img src="${item.image}" alt="${item.title}">
                                    <div class="item-details">
                                        <h4>${item.title}</h4>
                                        <p class="item-article">
                                            <i class="ph ph-barcode"></i>
                                            Артикул: ${item.article}
                                        </p>
                                        <div class="item-price">
                                            <span class="quantity">${item.quantity} ×</span>
                                            <span class="price gradient-text">${item.price} ₽</span>
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
                                <span id="total-cost" class="gradient-text">${subtotal + 300} ₽</span>
                            </div>
                        </div>
                        <button type="button" class="gradient-btn btn-lg" onclick="window.checkout.submitOrder()">
                            <span>Оформить заказ</span>
                            <i class="ph ph-check-circle"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Анимируем появление элементов
        gsap.from('.checkout-progress', {
            y: -30,
            opacity: 0,
            duration: 0.5,
            ease: 'power3.out'
        });

        gsap.from('.checkout-section', {
            y: 30,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out'
        });

        gsap.from('.checkout-sidebar', {
            x: 30,
            opacity: 0,
            duration: 0.5,
            delay: 0.3,
            ease: 'power3.out'
        });

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

                gsap.to(deliveryCost, {
                    opacity: 0,
                    duration: 0.2,
                    onComplete: () => {
                        deliveryCost.textContent = method.price > 0 ? `${method.price} ₽` : 'Бесплатно';
                        totalCost.textContent = `${subtotal + method.price} ₽`;
                        gsap.to(deliveryCost, {
                            opacity: 1,
                            duration: 0.2
                        });
                    }
                });

                // Показываем/скрываем адрес доставки
                const addressSection = document.getElementById('delivery-address');
                if (method.id === 'pickup') {
                    gsap.to(addressSection, {
                        height: 0,
                        opacity: 0,
                        duration: 0.3,
                        onComplete: () => {
                            addressSection.style.display = 'none';
                        }
                    });
                } else {
                    addressSection.style.display = 'block';
                    gsap.from(addressSection, {
                        height: 0,
                        opacity: 0,
                        duration: 0.3
                    });
                }
            });
        });

        // Обработка выбора сохраненного адреса
        const addressSelect = document.querySelector('select[name="savedAddress"]');
        if (addressSelect) {
            addressSelect.addEventListener('change', (e) => {
                const address = window.profile.userData.addresses.find(a => a.id === e.target.value);
                if (address) {
                    gsap.to('.address-fields input', {
                        opacity: 0,
                        duration: 0.2,
                        onComplete: () => {
                            document.querySelector('input[name="city"]').value = address.city;
                            document.querySelector('input[name="street"]').value = address.street;
                            gsap.to('.address-fields input', {
                                opacity: 1,
                                duration: 0.2
                            });
                        }
                    });
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
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content glass-morphism">
                <div class="success-animation">
                    <lottie-player
                        src="https://assets2.lottiefiles.com/packages/lf20_s2lryxtd.json"
                        background="transparent"
                        speed="1"
                        style="width: 200px; height: 200px;"
                        autoplay
                    ></lottie-player>
                </div>
                <h2 class="gradient-text">Заказ оформлен!</h2>
                <div class="order-info">
                    <div class="info-item">
                        <i class="ph ph-hash"></i>
                        <span>Номер заказа: ${order.id}</span>
                    </div>
                    <div class="info-item">
                        <i class="ph ph-envelope"></i>
                        <span>Детали отправлены на ваш email</span>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn-outline-gradient" onclick="window.app.showScreen('profile')">
                        <i class="ph ph-list"></i>
                        <span>История заказов</span>
                    </button>
                    <button class="gradient-btn" onclick="window.app.showScreen('home')">
                        <i class="ph ph-shopping-cart"></i>
                        <span>Продолжить покупки</span>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Анимация появления
        gsap.from(modal.querySelector('.modal-content'), {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: 'power3.out'
        });

        // Удаляем модальное окно при клике вне его содержимого
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                gsap.to(modal, {
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => {
                        modal.remove();
                        window.app.showScreen('home');
                    }
                });
            }
        });
    }
}

// Создаем глобальный экземпляр оформления заказа
window.checkout = new Checkout();