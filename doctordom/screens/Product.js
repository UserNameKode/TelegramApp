;(function(){
  function render(productId){
    const p=DataService.getProduct(productId); if(!p) return HomeScreen.render(window.app);
    const screen=document.getElementById('product-screen'); if(!screen) return;
    document.querySelectorAll('.screen').forEach(s=> s.classList.remove('active'));
    screen.classList.add('active');
    const images = (p.images && p.images.length ? p.images : [p.image]).filter(Boolean);
    const first = images[0] || '';
    screen.innerHTML=`
      <div class="product-detail fade-in">
        <div class="product-detail-image">
          <img id="pd-main" src="${first}" alt="${p.title}">
          ${images.length>1?`
            <div class="pd-thumbs">
              ${images.map((src,i)=>`<img class="pd-thumb ${i===0?'active':''}" data-src="${src}" src="${src}" alt="thumb">`).join('')}
            </div>
          `:''}
          <div class="product-rating"><span class="rating-stars">★★★★★</span><span class="rating-value">${p.rating}</span><span class="rating-count">(${p.reviews})</span></div>
        </div>
        <div>
          <div class="product-detail-header">
            <h1>${p.title}</h1>
            <button class="btn-favorite-large ${DataService.userData.favorites.includes(p.id)?'active':''}" data-product-id="${p.id}">♡</button>
          </div>
          <div class="product-meta">
            <div class="meta-item"><span class="meta-label">Марка</span><span class="meta-value">${DataService.getCarBrand(p.brandId)?.name||''}</span></div>
            <div class="meta-item"><span class="meta-label">Категория</span><span class="meta-value">${DataService.getCategories().find(c=>c.id===p.categoryId)?.title||''}</span></div>
            <div class="meta-item"><span class="meta-label">Наличие</span><span class="meta-value ${p.inStock?'in-stock':'out-of-stock'}">${p.inStock?'В наличии':'Нет'}</span></div>
          </div>
          <div class="product-description"><h3>Описание</h3><p>${p.description}</p></div>
          <div class="product-compatibility"><h3>Совместимость</h3><div class="compatibility-list">${(p.compatibility||[]).map(m=>`<span class="compatibility-item">${m}</span>`).join('')}</div></div>
          <div class="product-actions-detail">
            <div class="price-section"><span class="current-price">${p.price.toLocaleString()} ₽</span><span class="price-note">за штуку</span></div>
            <div class="action-buttons">
              <button class="btn-add-large" data-product-id="${p.id}">Добавить в корзину</button>
              <button class="btn-buy-now" data-product-id="${p.id}">Купить сейчас</button>
            </div>
          </div>
        </div>
      </div>`;

    screen.querySelector('.btn-add-large').addEventListener('click', ()=>{ window.cart.addItem(p); UIService.toast('Добавлено в корзину','success'); });
    screen.querySelector('.btn-buy-now').addEventListener('click', async ()=>{
      const customer = { name: window.profile?.userData?.firstName||'', phone: window.profile?.userData?.phone||'' };
      const res = await OrderService.quickBuy(p, customer);
      if(res.ok){ UIService.toast('Заказ создан! Мы свяжемся с вами.','success'); }
    });
    screen.querySelector('.btn-favorite-large').addEventListener('click', (e)=>{
      const id=p.id; const btn=e.currentTarget;
      if(DataService.userData.favorites.includes(id)){ DataService.removeFromFavorites(id); btn.classList.remove('active'); btn.textContent='♡'; }
      else { DataService.addToFavorites(id); btn.classList.add('active'); btn.textContent='♥'; }
    });

    // Thumbnails switching
    const main = screen.querySelector('#pd-main');
    screen.querySelectorAll('.pd-thumb').forEach(th=>{
      th.addEventListener('click', ()=>{
        screen.querySelectorAll('.pd-thumb').forEach(x=>x.classList.remove('active'));
        th.classList.add('active');
        main.src = th.getAttribute('data-src');
      });
    });
  }

  window.ProductScreen={ render };
})();

