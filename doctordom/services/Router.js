;(function(){
  const stack = [];
  const scrollPositions = {}; // screen -> scrollTop

  function current(){ return stack[stack.length-1] || 'home'; }

  function navigate(screen){
    const cur = current();
    if(cur !== screen){ stack.push(screen); }
    // Сохраняем скролл текущего экрана
    try {
      const curEl = document.getElementById(cur+'-screen');
      scrollPositions[cur] = (curEl?.scrollTop || document.documentElement.scrollTop || window.scrollY || 0);
    } catch(_) {}
    window.app?.showScreen?.(screen);
    // Восстанавливаем скролл нового экрана
    setTimeout(()=>{
      try {
        const pos = scrollPositions[screen] || 0;
        const el = document.getElementById(screen+'-screen');
        if (el) el.scrollTop = pos; else window.scrollTo(0,pos);
      } catch(_) {}
    },0);
    toggleBack();
  }

  function back(){
    if(stack.length>1){ stack.pop(); }
    const scr = current();
    window.app?.showScreen?.(scr);
    // Восстановить скролл при возврате
    setTimeout(()=>{
      try {
        const pos = scrollPositions[scr] || 0;
        const el = document.getElementById(scr+'-screen');
        if (el) el.scrollTop = pos; else window.scrollTo(0,pos);
      } catch(_) {}
    },0);
    toggleBack();
  }

  function init(initial){
    stack.length = 0; stack.push(initial||'home');
    toggleBack();
  }

  function toggleBack(){
    const show = stack.length>1;
    const backBtn = document.getElementById('nav-back-btn');
    if(backBtn){ backBtn.style.display = show ? 'inline-block' : 'none'; }
  }

  window.Router = { init, navigate, back, current };
})();

