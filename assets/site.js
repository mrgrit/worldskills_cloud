(function () {
  // mobile nav
  var t = document.querySelector('.nav-toggle');
  if (t) t.addEventListener('click', function () { document.body.classList.toggle('nav-open'); });

  // copy buttons + highlight
  document.querySelectorAll('.doc pre').forEach(function (pre) {
    var b = document.createElement('button');
    b.className = 'copy-btn'; b.textContent = '복사';
    b.addEventListener('click', function () {
      var code = pre.querySelector('code');
      navigator.clipboard.writeText(code ? code.innerText : pre.innerText).then(function () {
        b.textContent = '복사됨'; setTimeout(function () { b.textContent = '복사'; }, 1200);
      });
    });
    pre.appendChild(b);
  });
  window.addEventListener('load', function () {
    if (window.hljs) document.querySelectorAll('.doc pre code').forEach(function (c) {
      if (/language-(text|plaintext|output)/.test(c.className)) return;
      try { window.hljs.highlightElement(c); } catch (e) {}
    });
  });

  // TOC scroll spy
  var links = Array.prototype.slice.call(document.querySelectorAll('.toc a'));
  if (links.length) {
    var heads = links.map(function (a) { return document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1))); });
    var onScroll = function () {
      var y = window.scrollY + 90, idx = 0;
      heads.forEach(function (h, i) { if (h && h.offsetTop <= y) idx = i; });
      links.forEach(function (a, i) { a.classList.toggle('active', i === idx); });
    };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  // home filters
  var q = document.getElementById('q');
  if (q) {
    var level = 'all';
    var apply = function () {
      var term = q.value.trim().toLowerCase(), any = false;
      document.querySelectorAll('.card').forEach(function (c) {
        var ok = (level === 'all' || c.dataset.level === level) && (!term || c.dataset.search.indexOf(term) >= 0);
        c.hidden = !ok; if (ok) any = true;
      });
      document.querySelectorAll('.level-block').forEach(function (b) { b.hidden = !b.querySelector('.card:not([hidden])'); });
      document.querySelectorAll('.year').forEach(function (s) { s.hidden = !s.querySelector('.card:not([hidden])'); });
      document.querySelector('.empty').hidden = any;
    };
    q.addEventListener('input', apply);
    document.querySelectorAll('.chip').forEach(function (ch) {
      ch.addEventListener('click', function () {
        document.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('on'); });
        ch.classList.add('on'); level = ch.dataset.f; apply();
      });
    });
  }
})();
