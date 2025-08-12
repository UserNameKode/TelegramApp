class Checkout {
    constructor() {
        this.deliveryMethods = [
            { id: 'pickup', title: 'Самовывоз', price: 0, description: 'Бесплатно из магазина' },
            { id: 'courier', title: 'Курьером', price: 300, description: 'Доставка по городу' }
        ];
    }

    render() {
        const checkoutScreen = document.getElementById('checkout-screen');
        if (!checkoutScreen) return;

        const cartTotal = window.cart.calculateTotal();

        checkoutScreen.innerHTML = `
            <h3 class="fade-in">Оформление заказа</h3>
            
            <div class="profile-section glass-card slide-up">
                <h4>Контактные данные</h4>
                <div class="profile-field">
                    <label>Имя *</label>
                    <input type="text" id="checkout-name" placeholder="Ваше имя" required>
                </div>
                <div class="profile-field">
                    <label>Телефон *</label>
                    <input type="tel" id="checkout-phone" placeholder="+7 (___) ___-__-__" required>
                </div>
            </div>

            <div class="profile-section glass-card slide-up">
                <h4>Способ получения</h4>
                ${this.deliveryMethods.map(method => `
                    <label style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px; cursor: pointer;">
                        <input type="radio" name="delivery" value="${method.id}" ${method.id === 'pickup' ? 'checked' : ''}>
                        <div>
                            <div style="font-weight: 600;">${method.title}</div>
                            <div style="font-size: 14px; color: #94A3B8;">${method.description} ${method.price > 0 ? `• ${method.price} ₽` : ''}</div>
                        </div>
                    </label>
                `).join('')}
            </div>

            <div class="profile-section glass-card slide-up" id="address-section" style="display: none;">
                <h4>Адрес доставки</h4>
                <div class="profile-field">
                    <label>Адрес</label>
                    <input type="text" id="checkout-address" placeholder="Улица, дом, квартира">
                </div>
                <div class="profile-field">
                    <label>Комментарий</label>
                    <input type="text" id="checkout-comment" placeholder="Код домофона, этаж">
                </div>
            </div>

            <div class="cart-total glass-card fade-in" style="margin-top:12px; padding:16px; border:1px solid var(--line); border-radius:12px;">
                Товары: ${cartTotal} ₽<br>
                Доставка: <span id="delivery-cost">0 ₽</span><br>
                <strong>Итого: <span id="final-total">${cartTotal} ₽</span></strong>
            </div>

            <button class="btn-add" onclick="window.checkout.submitOrder()" style="margin-top: 16px;">
                Подтвердить заказ
            </button>
        `;

        // Обработчики для способа доставки
        document.querySelectorAll('input[name="delivery"]').forEach(radio => {
            radio.addEventListener('change', () => {
                const method = this.deliveryMethods.find(m => m.id === radio.value);
                const addressSection = document.getElementById('address-section');
                const deliveryCost = document.getElementById('delivery-cost');
                const finalTotal = document.getElementById('final-total');
                
                if (method.id === 'courier') {
                    addressSection.style.display = 'block';
                } else {
                    addressSection.style.display = 'none';
                }
                
                deliveryCost.textContent = method.price + ' ₽';
                finalTotal.textContent = (cartTotal + method.price) + ' ₽';
            });
        });
    }

    submitOrder() {
        const name = document.getElementById('checkout-name').value;
        const phone = document.getElementById('checkout-phone').value;
        const delivery = document.querySelector('input[name="delivery"]:checked').value;
        
        if (!name || !phone) {
            alert('Пожалуйста, заполните обязательные поля');
            return;
        }

        const order = {
            items: window.cart.items,
            total: window.cart.calculateTotal(),
            delivery: delivery,
            customer: { name, phone }
        };

        // Добавить заказ в профиль
        window.profile.addOrder(order);
        
        // Очистить корзину
        window.cart.items = [];
        window.cart.saveToStorage();
        
        // Показать успех
        document.getElementById('checkout-screen').innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h3 style="color: #10B981;">✓ Заказ оформлен!</h3>
                <p style="color: #94A3B8; margin: 16px 0;">Мы свяжемся с вами для подтверждения</p>
                <button class="btn-add" onclick="window.app.showScreen('home')">Вернуться к покупкам</button>
            </div>
        `;
    }
}