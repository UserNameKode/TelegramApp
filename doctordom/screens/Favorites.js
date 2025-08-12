;(function(){
  function render(){
    const screen=document.getElementById('favorites-screen'); if(!screen) return;
    document.querySelectorAll('.screen').forEach(s=> s.classList.remove('active'));
    screen.classList.add('active');

    // skeleton first
    screen.innerHTML = `<div class="skeleton-line" style="width:40%"></div>
    <div class="products" style="grid-template-columns:repeat(2,1fr);gap:12px;margin:12px 0;">
      <div class="skeleton skeleton-card"></div>
      <div class="skeleton skeleton-card"></div>
      <div class="skeleton skeleton-card"></div>
      <div class="skeleton skeleton-card"></div>
    </div>`;

    setTimeout(()=>{
      const ids = DataService.userData.favorites || [];
      const products = ids.map(id=>DataService.getProduct(id)).filter(Boolean);
      screen.innerHTML=`
        <div class="fade-in">
          <div style="margin-bottom:12px"><button class="btn-back" onclick="window.app.showScreen('home')">← На главную</button></div>
          <h3>Избранное</h3>
          ${products.length?`<div class="products">${products.map(p=>`
            <div class=\"card product-card\" data-product-id=\"${p.id}\">\
              <div class=\"product-badge\">⭐ ${p.rating}</div>\
              <img src=\"${p.image}\" alt=\"${p.title}\">\
              <div class=\"product-info\">\
                <h4>${p.title}</h4>\
                <p class=\"product-brand\">${DataService.getCarBrand(p.brandId)?.name||''}</p>\
                <p class=\"product-price\">${p.price.toLocaleString()} ₽</p>\
                <div class=\"product-actions\">\
                  <button class=\"btn-remove\" data-remove-id=\"${p.id}\">🗑️</button>\
                  <button class=\"btn-add\" data-product-id=\"${p.id}\">В корзину</button>\
                </div>\
              </div>\
            </div>`).join('')}</div>`:
            `<div class=\"empty-state\"><div class=\"empty-icon\">💖</div><h4>Нет избранных товаров</h4><p>Добавляйте товары в избранное для быстрого доступа</p></div>`}
        </div>`;

      screen.querySelectorAll('[data-remove-id]').forEach(b=> b.addEventListener('click', ()=>{
        const id=b.getAttribute('data-remove-id');
        DataService.removeFromFavorites(id);
        render();
      }));
      screen.querySelectorAll('.btn-add').forEach(b=> b.addEventListener('click', ()=>{
        const id=b.getAttribute('data-product-id');
        const p=DataService.getProduct(id); if(p) window.cart.addItem(p);
      }));
      screen.querySelectorAll('.product-card').forEach(card=> card.addEventListener('click', (e)=>{
        if(e.target.closest('.btn-add')||e.target.closest('.btn-remove')) return;
        window.app.product.render(card.getAttribute('data-product-id'));
      }));
    }, 120);
  }

  window.FavoritesScreen={ render };
})();

