(function () {
  var html = document.documentElement;
  var hero = document.querySelector('.hero');

  function setTheme(t) {
    html.classList.remove('theme-night', 'theme-day');
    html.classList.add('theme-' + t);
    try { localStorage.setItem('tf7-theme', t); } catch (e) {}
  }
  document.querySelectorAll('.toggle button').forEach(function (b) {
    b.addEventListener('click', function () { setTheme(html.classList.contains('theme-day') ? 'night' : 'day'); });
  });

  // Torch: follows the pointer, drifts on its own when idle
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cur = null, tgt = null, last = 0, t0 = performance.now(), visible = true, raf = null;
  function move(e) {
    var p = e.touches ? e.touches[0] : e;
    if (!p) return;
    var r = hero.getBoundingClientRect();
    tgt = { x: p.clientX - r.left, y: p.clientY - r.top };
    last = performance.now();
  }
  hero.addEventListener('pointermove', move);
  hero.addEventListener('touchmove', move, { passive: true });
  hero.addEventListener('pointerleave', function () { tgt = null; });
  function tick(now) {
    if (!visible) { raf = null; return; }
    var w = hero.clientWidth, h = hero.clientHeight;
    var idle = !tgt || now - last > 5000, t = tgt;
    if (idle) {
      if (reduce) { t = { x: -2000, y: -2000 }; }
      else {
        var s = (now - t0) / 1000;
        t = { x: w * (0.5 + 0.33 * Math.sin(s * 0.31)), y: h * (0.46 + 0.24 * Math.sin(s * 0.47 + 1.2)) };
      }
    }
    if (!cur) cur = { x: t.x, y: t.y };
    var k = idle ? 0.04 : 0.2;
    cur.x += (t.x - cur.x) * k;
    cur.y += (t.y - cur.y) * k;
    hero.style.setProperty('--x', cur.x.toFixed(1));
    hero.style.setProperty('--y', cur.y.toFixed(1));
    raf = requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    }).observe(hero);
  }
  raf = requestAnimationFrame(tick);

  // Countdown to the start of 30 Dec 2026 (visitor's local time)
  var target = new Date(2026, 11, 30, 0, 0, 0).getTime();
  var box = document.querySelector('.countdown');
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function countdown() {
    var ms = target - Date.now();
    if (ms <= 0) { box.innerHTML = '<div class="cd"><b>On y est</b><span>See you at the bend</span></div>'; return; }
    var m = Math.floor(ms / 60000);
    box.querySelector('[data-cd="d"]').textContent = Math.floor(m / 1440);
    box.querySelector('[data-cd="h"]').textContent = pad(Math.floor((m % 1440) / 60));
    box.querySelector('[data-cd="m"]').textContent = pad(m % 60);
    setTimeout(countdown, 20000);
  }
  if (box) countdown();
})();
