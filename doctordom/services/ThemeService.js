;(function(){
  const KEY = 'theme_pref';
  function apply(mode){
    document.body.classList.toggle('theme-light', mode==='light');
  }
  function init(){
    // По умолчанию включаем светлую тему, как просил пользователь
    const saved = localStorage.getItem(KEY) || 'light';
    apply(saved);
  }
  function setTheme(mode){
    localStorage.setItem(KEY, mode);
    apply(mode);
  }
  function toggle(){
    const cur = document.body.classList.contains('theme-light')?'light':'dark';
    setTheme(cur==='light'?'dark':'light');
  }
  window.ThemeService = { init, setTheme, toggle };
})();

