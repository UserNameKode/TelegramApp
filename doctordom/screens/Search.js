;(function(){
  function render(query){
    const q=(query||'').trim();
    const container=document.getElementById('home-screen');
    if(!container) return;
    if(q.length<1){ HomeScreen.render(window.app); return; }

    // skeleton first
    container.innerHTML = `<div class="skeleton-line" style="width:50%"></div>
      <div class="products" style="grid-template-columns:repeat(2,1fr);gap:12px;margin:12px 0;">
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-card"></div>
      </div>`;

    let results = DataService.searchProducts(q);
    // если ничего не найдено, пробуем разложить запрос по словам
    if(results.length===0){
      const words=q.split(/\s+/).filter(Boolean);
      if(words.length>1){
        results = DataService.getProducts().filter(p=> words.every(w=> (p.title+" "+(p.article||"")) .toLowerCase().includes(w.toLowerCase())));
      }
    }
    // Примитивная сортировка/фильтры из query-параметров, например: "фильтр популярные" или "в наличии"
    const lower=q.toLowerCase();
    if(lower.includes('популяр')) results = results.sort((a,b)=>b.rating-a.rating);
    if(lower.includes('в наличии')) results = results.filter(p=>p.inStock);

    const mark = (text) => {
      const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`,'ig');
      return (text||'').replace(re,'<mark>$1</mark>');
    };

    container.innerHTML = `
      <div class="search-results fade-in">
        <div class="search-header">
          <button class="btn-back" onclick="HomeScreen.render(window.app)">← Назад</button>
          <h2>Результаты поиска: "${q}"</h2>
          <p class="search-count">Найдено ${results.length} товаров</p>
        </div>
        <div class="quick-filters" style="margin-bottom:8px;">
          <button class="filter-chip" data-sort="popular">Популярные</button>
          <button class="filter-chip" data-filter="inStock">В наличии</button>
        </div>
        <div class="search-input-container">
          <input type="text" id="search-input" value="${q}" placeholder="Поиск по артикулу, названию или VIN..." autofocus>
          <button class="search-btn" id="search-btn">🔍</button>
        </div>
        <div class="products">
          ${results.map(p=>`
            <div class="card product-card" data-product-id="${p.id}">
              <div class="product-badge">⭐ ${p.rating}</div>
              <img src="${p.image}" alt="${p.title}">
              <div class="product-info">
                <h4>${mark(p.title)}</h4>
                <p class="product-brand">${DataService.getCarBrand(p.brandId)?.name||''}</p>
                <p class="product-price">${p.price.toLocaleString()} ₽</p>
                <div class="product-actions">
                  <button class="btn-favorite ${DataService.userData.favorites.includes(p.id)?'active':''}" data-product-id="${p.id}">♡</button>
                  <button class="btn-add" data-product-id="${p.id}">В корзину</button>
                </div>
              </div>
            </div>`).join('')}
        </div>
      </div>`;

    const input=document.getElementById('search-input');
    const btn=document.getElementById('search-btn');
    if(input){
      // вернуть фокус принудительно в WebView
      setTimeout(()=>{ try{ input.focus(); input.setSelectionRange(input.value.length, input.value.length); }catch(_){} }, 0);
      input.addEventListener('keypress', e=>{ if(e.key==='Enter') render(input.value);});
      // сохраняем историю
      const hist = JSON.parse(localStorage.getItem('search_history')||'[]');
      if(q && !hist.includes(q)){ hist.unshift(q); localStorage.setItem('search_history', JSON.stringify(hist.slice(0,10))); }
    }
    if(btn){ btn.addEventListener('click', ()=> render(input.value)); }

    // quick filters actions
    container.querySelectorAll('[data-sort="popular"]').forEach(b=> b.addEventListener('click', ()=>{
      render(q + ' популярные');
    }));
    container.querySelectorAll('[data-filter="inStock"]').forEach(b=> b.addEventListener('click', ()=>{
      render(q + ' в наличии');
    }));

    container.querySelectorAll('.product-card').forEach(card=>{
      card.addEventListener('click', ()=> window.app.product.render(card.getAttribute('data-product-id')));
    });
  }

  window.SearchScreen={ render };
})();

