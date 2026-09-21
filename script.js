(function () {
  document.documentElement.classList.add('js');
  var button = document.querySelector('.menu-button');
  var nav = document.getElementById('navigation');
  if (button && nav) {
    button.addEventListener('click', function () {
      var open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { button.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); });
    });
  }
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.spotlight-card').forEach(function (card) {
      card.addEventListener('pointermove', function (event) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--x', (event.clientX - rect.left) + 'px');
        card.style.setProperty('--y', (event.clientY - rect.top) + 'px');
      });
    });
  }
})();
