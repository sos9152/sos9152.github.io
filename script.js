(function () {
  var root = document.documentElement;

  // 다크 모드 전환 (선택은 브라우저에 저장)
  var toggle = document.querySelector('.theme-toggle');
  function isDark() {
    var t = root.dataset.theme;
    if (t) return t === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  toggle.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // 푸터 연도
  document.getElementById('year').textContent = new Date().getFullYear();

  // 아직 채우지 않은 [채울 곳] 자리 강조
  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  var nodes = [];
  while (walker.nextNode()) {
    if (walker.currentNode.nodeValue.indexOf('[채울 곳') !== -1) nodes.push(walker.currentNode);
  }
  nodes.forEach(function (n) {
    var mark = document.createElement('span');
    mark.className = 'todo';
    n.parentNode.insertBefore(mark, n);
    mark.appendChild(n);
  });

  // 섹션이 화면에 들어오면 나타나기
  var blocks = document.querySelectorAll('.intro, .block');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    blocks.forEach(function (b) { b.classList.add('reveal'); io.observe(b); });
  }

  // 현재 보고 있는 섹션을 메뉴에 표시
  var links = document.querySelectorAll('.topbar nav a');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('section[id]').forEach(function (s) { spy.observe(s); });
  }
})();
