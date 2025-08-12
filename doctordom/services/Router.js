;(function(){
  const stack = [];

  function current(){ return stack[stack.length-1] || 'home'; }

  function navigate(screen){
    const cur = current();
    if(cur !== screen){ stack.push(screen); }
    window.app?.showScreen?.(screen);
    toggleBack();
  }

  function back(){
    if(stack.length>1){ stack.pop(); }
    const scr = current();
    window.app?.showScreen?.(scr);
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

