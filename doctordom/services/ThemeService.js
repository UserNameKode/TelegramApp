;(function(){
  const KEY = 'theme_pref';
  function apply(mode){
    document.body.classList.toggle('theme-light', mode==='light');
  }
  function init(){
    const saved = localStorage.getItem(KEY) || 'dark';
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

