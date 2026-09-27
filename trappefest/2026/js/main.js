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
  var torchOn = !html.classList.contains('no-torch');
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
  if (torchOn && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    }).observe(hero);
  }
  if (torchOn) raf = requestAnimationFrame(tick);

  // Dashed route: curves through each sticker row, then drops down the empty side gutter to the next row
  var route = document.querySelector('.route');
  var mainEl = document.querySelector('main');
  function f(n) { return n.toFixed(0); }
  // Each row gets its own line character so the four routes don't repeat
  var STYLES = [
    { dash: '2 9', tension: 6 },
    { dash: '10 8', tension: 6 },
    { dash: '12 6 2 6', tension: 6, tails: 1 },
    { dash: '5 7', tension: 6 }
  ];
  function spline(pts, t) {
    var d = 'M' + f(pts[0][0]) + ' ' + f(pts[0][1]);
    for (var k = 0; k < pts.length - 1; k++) {
      var p0 = pts[k - 1] || pts[k], p1 = pts[k], p2 = pts[k + 1], p3 = pts[k + 2] || p2;
      d += ' C' + f(p1[0] + (p2[0] - p0[0]) / t) + ' ' + f(p1[1] + (p2[1] - p0[1]) / t) + ' ' +
           f(p2[0] - (p3[0] - p1[0]) / t) + ' ' + f(p2[1] - (p3[1] - p1[1]) / t) + ' ' + f(p2[0]) + ' ' + f(p2[1]);
    }
    return d;
  }
  function drawRoute() {
    if (!route) return;
    var b = document.body.getBoundingClientRect();
    var html = '';
    document.querySelectorAll('.trail-row').forEach(function (row, i) {
      var pts = [];
      row.querySelectorAll('.pin:not(.leaf)').forEach(function (p) {
        if (!p.offsetParent) return;
        var r = p.getBoundingClientRect();
        pts.push([r.left + r.width / 2 - b.left, r.top + r.height / 2 - b.top]);
      });
      if (pts.length < 2) return;
      var s = STYLES[i % STYLES.length], rh = row.offsetHeight, out = [], k;
      if (s.wobble) {
        for (k = 0; k < pts.length - 1; k++) {
          var A = pts[k], B = pts[k + 1], dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy) || 1, amp = rh * 0.22 * (k % 2 ? 1 : -1);
          out.push(A, [A[0] + dx * 0.5 - dy / L * amp, A[1] + dy * 0.5 + dx / L * amp]);
        }
        out.push(pts[pts.length - 1]); pts = out;
      }
      if (s.loop) {
        var m = Math.floor(pts.length / 2) - 1, P = pts[m], Q = pts[m + 1], cx = (P[0] + Q[0]) / 2, cy = (P[1] + Q[1]) / 2, rr = rh * 0.16;
        pts.splice(m + 1, 0, [cx - rr, cy + rr * 0.6], [cx, cy + rr * 1.5], [cx + rr * 0.9, cy + rr * 0.5], [cx, cy - rr * 0.2], [cx - rr * 0.2, cy + rr * 0.9], [cx + rr * 1.6, cy + rr * 0.8]);
      }
      var dots = '';
      if (s.tails) {
        var f0 = pts[0], l0 = pts[pts.length - 1];
        pts.unshift([f0[0] - rh * 0.35, f0[1] - rh * 0.28]);
        pts.push([l0[0] + rh * 0.35, l0[1] + rh * 0.24]);
        var e1 = pts[0], e2 = pts[pts.length - 1];
        dots = '<circle cx="' + f(e1[0]) + '" cy="' + f(e1[1]) + '" r="4"/><path class="x" d="M' + f(e2[0] - 6) + ' ' + f(e2[1] - 6) + 'l12 12m0 -12l-12 12"/>';
      }
      html += '<path style="stroke-dasharray:' + s.dash + '" d="' + spline(pts, s.tension) + '"/>' + dots;
    });
    route.innerHTML = html;
  }
  var rt; function queueRoute() { clearTimeout(rt); rt = setTimeout(drawRoute, 60); }
  window.addEventListener('resize', queueRoute);
  window.addEventListener('load', function () {
    drawRoute();
    var sc = new URLSearchParams(location.search).get('scroll'), el = sc && document.getElementById(sc);
    if (el) setTimeout(function () { window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 120, behavior: 'instant' }); }, 300);
  });
  if (document.fonts) document.fonts.ready.then(drawRoute);
  document.querySelectorAll('img').forEach(function (im) { if (!im.complete) im.addEventListener('load', queueRoute); });
  drawRoute();

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
