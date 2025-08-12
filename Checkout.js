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
        const draft = JSON.parse(localStorage.getItem('checkout_draft')||'{}');

        checkoutScreen.innerHTML = `
            <h3 class="fade-in">Оформление заказа</h3>
            
            <div class="profile-section glass-card slide-up">
                <h4>Контактные данные</h4>
                <div class="profile-field">
                    <label>Имя *</label>
                    <input type="text" id="checkout-name" placeholder="Ваше имя" value="${draft.name||''}" required>
                </div>
                <div class="profile-field">
                    <label>Телефон *</label>
                    <input type="tel" id="checkout-phone" placeholder="+7 (___) ___-__-__" value="${draft.phone||''}" required>
                </div>
            </div>

            <div class="profile-section glass-card slide-up">
                <h4>Способ получения</h4>
                ${this.deliveryMethods.map(method => `
                    <label class="delivery-option">
                        <input type="radio" name="delivery" value="${method.id}" ${(draft.delivery||'pickup') === method.id ? 'checked' : ''}>
                        <div class="delivery-info">
                            <div class="delivery-title">${method.title}</div>
                            <div class="delivery-desc">${method.description} ${method.price > 0 ? `• ${method.price} ₽` : ''}</div>
                        </div>
                    </label>
                `).join('')}
            </div>

            <div class="profile-section glass-card slide-up" id="address-section" style="display: none;">
                <h4>Адрес доставки</h4>
                <div class="profile-field">
                    <label>Адрес</label>
                    <input type="text" id="checkout-address" placeholder="Улица, дом, квартира" value="${draft.address||''}">
                </div>
                <div class="profile-field">
                    <label>Комментарий</label>
                    <input type="text" id="checkout-comment" placeholder="Код домофона, этаж" value="${draft.comment||''}">
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

        // Маска телефона (простая)
        const phone = document.getElementById('checkout-phone');
        if(phone){
          phone.addEventListener('input', ()=>{
            let v = phone.value.replace(/\D/g,'').slice(0,11);
            if(v.startsWith('8')) v = '7'+v.slice(1);
            if(!v.startsWith('7')) v = '7'+v;
            const p = `+${v[0]} (${v.slice(1,4)}) ${v.slice(4,7)}-${v.slice(7,9)}-${v.slice(9,11)}`.replace(/[-() ]+$/,'');
            phone.value = p;
          });
        }

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

    async submitOrder() {
        const name = document.getElementById('checkout-name').value.trim();
        const phone = document.getElementById('checkout-phone').value.trim();
        const delivery = document.querySelector('input[name="delivery"]:checked').value;
        
        if (!name || phone.length < 6) {
            alert('Пожалуйста, корректно заполните имя и телефон');
            return;
        }

        // Сохраняем черновик заказа (на случай возврата)
        localStorage.setItem('checkout_draft', JSON.stringify({ name, phone, delivery,
          address: document.getElementById('checkout-address')?.value || '',
          comment: document.getElementById('checkout-comment')?.value || ''
        }));

        // Индикатор загрузки
        const btn = document.querySelector('.btn-add');
        if(btn){ btn.classList.add('btn-loading'); btn.setAttribute('disabled',''); }
        UIService.showLoader('Оформляем заказ...');
        const res = await OrderService.createOrderFromCart({ name, phone, delivery });
        if(!res.ok){ UIService.toast('Не удалось оформить заказ','error'); return; }
        
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
        UIService.toast('Заказ оформлен','success');
        UIService.hideLoader();
    }
}