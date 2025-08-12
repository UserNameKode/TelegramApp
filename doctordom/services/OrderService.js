;(function(){
  async function createOrderFromCart(customer){
    const items = (window.cart?.items||[]).slice();
    const total = window.cart?.calculateTotal?.()||0;
    const order = {
      id: Math.floor(Date.now()/1000),
      date: new Date().toISOString(),
      total, items,
      customer: customer||{},
      status: 'new'
    };
    try{
      // Здесь могла бы быть интеграция в CRM (Bitrix24 / др.)
      console.log('[CRM] Отправка заказа', order);
      window.profile?.addOrder?.(order);
      return { ok:true, order };
    }catch(err){
      console.error('Ошибка создания заказа', err);
      return { ok:false, error: err };
    }
  }

  async function quickBuy(product, customer){
    // Быстрая покупка одного товара
    const order = {
      id: Math.floor(Date.now()/1000),
      date: new Date().toISOString(),
      total: product.price,
      items: [{ id: product.id, title: product.title, price: product.price, quantity:1, image: product.image }],
      customer: customer||{},
      status: 'new'
    };
    try{
      console.log('[CRM] Быстрый заказ', order);
      window.profile?.addOrder?.(order);
      return { ok:true, order };
    }catch(err){
      console.error('Ошибка быстрого заказа', err);
      return { ok:false, error: err };
    }
  }

  window.OrderService = { createOrderFromCart, quickBuy };
})();

