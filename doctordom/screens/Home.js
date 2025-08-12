// Home screen renderer: hero, search, brands, categories, popular products
;(function(){
  function render(app){
    const home = document.getElementById('home-screen');
    if(!home) return;

    home.innerHTML = `
      <div class="hero-banner fade-in">
        <div class="car-animation">
          <div class="car-photo-container">
            <div id="car-lottie" class="car-photo" aria-label="Анимация автомобиля"></div>
          </div>
        </div>
        <div class="hero-content">
          <h1>Запчасти для любого автомобиля</h1>
          <p>В наличии и под заказ • Оригинальные и аналоги • Быстрая доставка</p>
        </div>
      </div>

      <div class="search-section slide-up">
        <div class="search-container">
          <input type="text" id="search-input" placeholder="Поиск по артикулу, названию или VIN...">
          <button class="search-btn" id="search-btn">🔍</button>
        </div>
        <div class="quick-filters">
          <button class="filter-chip active" data-filter="all">Все</button>
          <button class="filter-chip" data-filter="inStock">В наличии</button>
          <button class="filter-chip" data-filter="popular">Популярные</button>
        </div>
        <div id="live-search-results"></div>
      </div>

      <div class="section-header"><h3>Выберите марку автомобиля</h3><p class="section-subtitle">Найдите запчасти для вашего авто</p></div>
      <div class="car-brands">
        ${DataService.getCarBrands(true).map(brand => `
          <div class="brand-card" data-brand="${brand.id}">
            <div class="brand-logo"><img src="${brand.logo}" alt="${brand.name}"></div>
            <span class="brand-name">${brand.name}</span>
          </div>
        `).join('')}
        <div class="brand-card more-brands" data-brand="all">
          <div class="brand-logo"><span class="more-icon">+${DataService.getCarBrands(false).length}</span></div>
          <span class="brand-name">Ещё марки</span>
        </div>
      </div>

      <div class="section-header"><h3>Категории запчастей</h3></div>
      <div class="categories">
        ${DataService.getCategories().map(c => `
          <div class="card category-card" data-category="${c.id}">
            <div class="category-icon">${c.icon}</div>
            <h4>${c.title}</h4>
            <p class="category-description">${c.description}</p>
          </div>
        `).join('')}
      </div>

      <div class="section-header"><h3>Популярные товары</h3><p class="section-subtitle">Часто покупаемые запчасти</p></div>
      <div class="products">
        ${DataService.getProducts().slice(0,6).map(p => `
          <div class="card product-card" data-product-id="${p.id}">
            <div class="product-badge">⭐ ${p.rating}</div>
            <img src="${p.image}" alt="${p.title}">
            <div class="product-info">
              <h4>${p.title}</h4>
              <p class="product-brand">${DataService.getCarBrand(p.brandId)?.name||''}</p>
              <p class="product-price">${p.price.toLocaleString()} ₽</p>
              <div class="product-actions">
                <button class="btn-favorite ${DataService.userData.favorites.includes(p.id)?'active':''}" data-product-id="${p.id}">♡</button>
                <button class="btn-add" data-product-id="${p.id}">В корзину</button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      ${renderRecent()}
    `;

    // Init Lottie if available (app contains loader)
    if(window.lottie){
      try{
        if(window.__carLottie && window.__carLottie.destroy) window.__carLottie.destroy();
        window.__carLottie = lottie.loadAnimation({
          container: document.getElementById('car-lottie'),
          renderer: 'svg', loop: true, autoplay: true,
          path: 'Mustang.json'
        });
        window.__carLottie.setSpeed && window.__carLottie.setSpeed(1.15);
      }catch(_){}
    }

    // Search handlers
    const input = document.getElementById('search-input');
    const btn = document.getElementById('search-btn');
    const live = document.getElementById('live-search-results');
    let t=null;
    if(input){
      input.addEventListener('input', e=>{
        const v=e.target.value; clearTimeout(t);
        // live-подсказки под полем
        t=setTimeout(()=>{
          const q=v.trim();
          if(q.length<2){
            // История поисков
            const hist = JSON.parse(localStorage.getItem('search_history')||'[]');
            if(live){
              live.innerHTML = hist.length? `<div class="history"><div class="controls"><span>Недавние запросы</span><span class="clear" id="hs-clear">Очистить</span></div>${hist.slice(0,5).map(h=>`<div class=\"item\" data-q=\"${h}\">${h}</div>`).join('')}</div>` : '';
              const clear=live.querySelector('#hs-clear'); if(clear){ clear.addEventListener('click',()=>{ localStorage.removeItem('search_history'); live.innerHTML=''; }); }
              live.querySelectorAll('.item').forEach(it=> it.addEventListener('click',()=> app.search.render(it.getAttribute('data-q'))));
            }
            return;
          }
          const res=DataService.searchProducts(q).slice(0,6);
          if(live){
            const mark=(txt)=>{ const re=new RegExp(`(${q.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')})`,'ig'); return (txt||'').replace(re,'<mark>$1</mark>'); };
            live.innerHTML = res.length ? `
              <div class="products search-products mini">
                ${res.map(p=>`
                  <div class=\"card product-card\" data-product-id=\"${p.id}\">
                    <img src=\"${p.image}\" alt=\"${p.title}\"/>
                    <div class=\"product-info\">
                      <h4>${mark(p.title)}</h4>
                      <p class=\"product-price\">${p.price.toLocaleString()} ₽</p>
                    </div>
                  </div>`).join('')}
              </div>
            ` : '<div class="no-results small">Ничего не найдено</div>';
            live.querySelectorAll('.product-card').forEach(card=> card.addEventListener('click',()=> app.product.render(card.getAttribute('data-product-id'))));
          }
        },180);
      });
      input.addEventListener('keypress', e=>{ if(e.key==='Enter'){ app.search.render(input.value.trim()); }});
    }
    if(btn){ btn.addEventListener('click', ()=> app.search.render(input.value.trim())); }

    // Brands
    home.querySelectorAll('.brand-card[data-brand]').forEach(b=>{
      b.addEventListener('click', ()=>{
        const id=b.getAttribute('data-brand');
        if(id==='all'){ app.catalog.renderAllBrands(); } else { app.catalog.renderBrand(id); }
      });
    });

    // Categories
    home.querySelectorAll('.category-card').forEach(c=>{
      c.addEventListener('click', ()=> app.catalog.renderCategory(c.getAttribute('data-category')));
    });

    // Product cards
    home.querySelectorAll('.product-card .btn-add').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        const id=btn.getAttribute('data-product-id');
        const p=DataService.getProduct(id); if(p) window.cart.addItem(p);
        e.stopPropagation();
      });
    });
    home.querySelectorAll('.product-card').forEach(card=>{
      card.addEventListener('click', ()=> app.product.render(card.getAttribute('data-product-id')));
    });
  }

  function renderRecent(){
    try{
      const fromService = (DataService.userData && DataService.userData.viewHistory)||[];
      const fromLS = JSON.parse(localStorage.getItem('view_history')||'[]');
      const ids = Array.from(new Set([...(fromService||[]), ...(fromLS||[])]));
      const items = ids.map(id=>DataService.getProduct(id)).filter(Boolean).slice(0,6);
      if(items.length===0) return '';
      return `
        <div class="section-header"><h3>Недавно просмотренные</h3></div>
        <div class="products recent-mini">
          ${items.map(p=>`
            <div class=\"card product-card\" data-product-id=\"${p.id}\">
              <img src=\"${p.image}\" alt=\"${p.title}\">
              <div class=\"product-info\">
                <h4>${p.title}</h4>
                <p class=\"product-price\">${p.price.toLocaleString()} ₽</p>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }catch(_){ return ''; }
  }

  window.HomeScreen = { render };
})();

