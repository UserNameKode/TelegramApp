;(function(){
  function render(){
    const screen=document.getElementById('checkout-screen'); if(!screen) return;
    document.querySelectorAll('.screen').forEach(s=> s.classList.remove('active'));
    screen.classList.add('active');
    window.checkout?.render?.();
  }
  window.CheckoutScreen={ render };
})();

