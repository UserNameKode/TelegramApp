;(function(){
  function render(){
    const screen=document.getElementById('cart-screen'); if(!screen) return;
    document.querySelectorAll('.screen').forEach(s=> s.classList.remove('active'));
    screen.classList.add('active');
    window.cart?.render?.();
  }
  window.CartScreen={ render };
})();

