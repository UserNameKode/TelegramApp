;(function(){
  function toast(message, type='info', timeout=2500){
    const el=document.createElement('div');
    el.className=`toast toast-${type}`;
    el.textContent=message;
    Object.assign(el.style,{
      position:'fixed',left:'50%',bottom:'24px',transform:'translateX(-50%)',
      background: type==='success'?'#10B981':(type==='error'?'#EF4444':'#3B82F6'),
      color:'#fff',padding:'12px 16px',borderRadius:'10px',
      boxShadow:'0 10px 30px rgba(0,0,0,.25)',zIndex:10000,opacity:'0',
      transition:'opacity .2s ease, transform .2s ease'
    });
    document.body.appendChild(el);
    requestAnimationFrame(()=>{ el.style.opacity='1'; el.style.transform='translateX(-50%) translateY(-6px)'; });
    setTimeout(()=>{
      el.style.opacity='0'; el.style.transform='translateX(-50%) translateY(0)';
      setTimeout(()=> el.remove(), 200);
    }, timeout);
  }
  function showLoader(text){
    let ov=document.getElementById('ui-loader');
    if(!ov){
      ov=document.createElement('div'); ov.id='ui-loader';
      ov.innerHTML=`<div class="ui-overlay"><div class="ui-spinner"></div><div class="ui-text"></div></div>`;
      document.body.appendChild(ov);
    }
    ov.querySelector('.ui-text').textContent = text||'Загрузка...';
    ov.style.display='flex';
  }
  function hideLoader(){ const ov=document.getElementById('ui-loader'); if(ov) ov.style.display='none'; }
  window.UIService={ toast, showLoader, hideLoader };
})();

