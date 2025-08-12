;(function(){
  function render(){
    const screen=document.getElementById('profile-screen'); if(!screen) return;
    document.querySelectorAll('.screen').forEach(s=> s.classList.remove('active'));
    screen.classList.add('active');
    window.profile?.render?.();
  }
  window.ProfileScreen={ render };
})();

