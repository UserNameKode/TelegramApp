;(function(){
  function renderAllBrands(){
    const home=document.getElementById('home-screen'); if(!home) return;
    // skeleton
    home.innerHTML = `<div class="skeleton-line" style="width:40%"></div>
      <div class="products" style="grid-template-columns:repeat(2,1fr);gap:12px;margin:12px 0;">
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-card"></div>
      </div>`;
    setTimeout(()=>{
      const brands=DataService.getCarBrands(false);
      home.innerHTML=`
        <div class="brand-header"><button class="btn-back" onclick="HomeScreen.render(window.app)">← Назад</button><h3>Все марки</h3></div>
        <div class="car-brands-all">
          ${brands.map(b=>`
            <div class="brand-card-large" data-brand="${b.id}">
              <img class="brand-logo-large" src="${b.logo}" alt="${b.name}">
              <div class="brand-info"><h4>${b.name}</h4><p>Каталог запчастей</p></div>
            </div>
          `).join('')}
        </div>`;
      home.querySelectorAll('.brand-card-large').forEach(el=> el.addEventListener('click',()=> renderBrand(el.getAttribute('data-brand'))));
    }, 120);
  }

  function renderBrand(brandId){
    const home=document.getElementById('home-screen'); if(!home) return;
    // skeleton
    home.innerHTML = `<div class="skeleton-line" style="width:30%"></div>
      <div class="products" style="grid-template-columns:repeat(2,1fr);gap:12px;margin:12px 0;">
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-card"></div>
      </div>`;
    setTimeout(()=>{
      const brand=DataService.getCarBrand(brandId);
      const categories=DataService.getCategories();
      home.innerHTML=`
        <div class="brand-header"><button class="btn-back" onclick="HomeScreen.render(window.app)">← Назад</button><img class="brand-logo-large" src="${brand.logo}"><h3>${brand.name}</h3></div>
        <div class="categories">
          ${categories.map(c=>`
            <div class="card category-card" data-category="${c.id}" data-brand="${brandId}">
              <div class="category-icon">${c.icon}</div>
              <h4>${c.title}</h4>
              <p class="category-description">${c.description}</p>
            </div>`).join('')}
        </div>`;
      home.querySelectorAll('.category-card').forEach(el=> el.addEventListener('click',()=> renderCategory(el.getAttribute('data-category'), el.getAttribute('data-brand'))));
    }, 120);
  }

  function renderCategory(categoryId, brandId){
    const home=document.getElementById('home-screen'); if(!home) return;
    // skeleton
    home.innerHTML = `<div class="skeleton-line" style="width:30%"></div>
      <div class="products" style="grid-template-columns:repeat(2,1fr);gap:12px;margin:12px 0;">
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-card"></div>
      </div>`;

    setTimeout(()=>{
      let products=DataService.getProducts(brandId, categoryId);
      home.innerHTML=`
        <div class="category-header"><button class="btn-back" onclick="CatalogScreen.renderBrand('${brandId}')">← Назад</button><h3>${DataService.getCategories().find(c=>c.id===categoryId)?.title||'Категория'}</h3></div>
        <div class="toolbar">
          <div class="switch"><label><input type="checkbox" id="tb-instock"> В наличии</label></div>
          <select id="tb-sort">
            <option value="popular">Сначала популярные</option>
            <option value="priceAsc">Цена по возрастанию</option>
            <option value="priceDesc">Цена по убыванию</option>
          </select>
        </div>
        <div class="products">
          ${products.map(p=>`
            <div class="card product-card" data-product-id="${p.id}">
              <span class="stock-badge ${p.inStock?'in':'out'}">${p.inStock?'В наличии':'Нет'}</span>
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
            </div>`).join('')}
        </div>`;
    home.querySelectorAll('.product-card').forEach(card=> card.addEventListener('click',()=> window.app.product.render(card.getAttribute('data-product-id'))));

    // toolbar behavior
    const applyToolbar=()=>{
      const inStock = home.querySelector('#tb-instock').checked;
      const sort = home.querySelector('#tb-sort').value;
      let list = DataService.getProducts(brandId, categoryId).slice();
      if(inStock) list = list.filter(p=>p.inStock);
      if(sort==='popular') list.sort((a,b)=>b.rating-a.rating);
      if(sort==='priceAsc') list.sort((a,b)=>a.price-b.price);
      if(sort==='priceDesc') list.sort((a,b)=>b.price-a.price);
      const grid = home.querySelector('.products');
      if(list.length===0){
        grid.innerHTML = `<div class=\"no-results\" style=\"grid-column:1/-1;\">\n  <div class=\"no-results-icon\">🔎</div>\n  <h3>По фильтрам ничего не найдено</h3>\n  <p>Снимите часть ограничений или измените сортировку.</p>\n</div>`;
        return;
      }
      grid.innerHTML = list.map(p=>`
        <div class=\"card product-card\" data-product-id=\"${p.id}\"> 
          <span class=\"stock-badge ${p.inStock?'in':'out'}\">${p.inStock?'В наличии':'Нет'}</span>
          <img src=\"${p.image}\" alt=\"${p.title}\"> 
          <div class=\"product-info\"> 
            <h4>${p.title}</h4>
            <p class=\"product-brand\">${DataService.getCarBrand(p.brandId)?.name||''}</p>
            <p class=\"product-price\">${p.price.toLocaleString()} ₽</p>
            <div class=\"product-actions\"> 
              <button class=\"btn-favorite ${DataService.userData.favorites.includes(p.id)?'active':''}\" data-product-id=\"${p.id}\">♡</button>
              <button class=\"btn-add\" data-product-id=\"${p.id}\">В корзину</button>
            </div>
          </div>
        </div>`).join('');
      grid.querySelectorAll('.product-card').forEach(card=> card.addEventListener('click',()=> window.app.product.render(card.getAttribute('data-product-id'))));
    };
    home.querySelector('#tb-instock').addEventListener('change', applyToolbar);
    home.querySelector('#tb-sort').addEventListener('change', applyToolbar);
    }, 120);
  }

  window.CatalogScreen={ renderAllBrands, renderBrand, renderCategory };
})();

