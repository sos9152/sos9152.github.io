(function () {
  var root = document.documentElement;
  var hasIO = 'IntersectionObserver' in window;

  // 다크 모드 전환 (선택은 브라우저에 저장)
  document.querySelector('.theme-toggle').addEventListener('click', function () {
    var t = root.dataset.theme;
    var dark = t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    var next = dark ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // 첫 화면을 지나면 상단 바에 배경 표시
  var topbar = document.querySelector('.topbar');
  var hero = document.querySelector('.hero');
  function onScroll() {
    topbar.classList.toggle('solid', window.scrollY > hero.offsetHeight - 80);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 기간 계산: "2025-09" 형식, 끝이 비어 있으면 이번 달까지
  function toIndex(ym) {
    if (!ym) { var d = new Date(); return d.getFullYear() * 12 + d.getMonth(); }
    var p = ym.split('-'); return +p[0] * 12 + (+p[1] - 1);
  }
  function label(months) {
    var y = Math.floor(months / 12), m = months % 12;
    return (y ? y + '년 ' : '') + (m ? m + '개월' : '').trim() || '1개월';
  }

  // 프로젝트 카드마다 기간 표시
  document.querySelectorAll('.dur').forEach(function (el) {
    var n = toIndex(el.dataset.to) - toIndex(el.dataset.from) + 1;
    el.textContent = label(n).trim();
  });

  // 총 경력: 경력 기간을 달 단위로 합치되 겹치는 달은 한 번만 셈
  var months = {};
  document.querySelectorAll('.timeline li').forEach(function (li) {
    for (var i = toIndex(li.dataset.from); i <= toIndex(li.dataset.to); i++) months[i] = true;
  });
  var total = Object.keys(months).length;
  document.getElementById('stat-career').textContent = label(total).trim();
  document.getElementById('stat-projects').textContent = document.querySelectorAll('.card').length + '건';

  // 프로젝트 분류 버튼
  var buttons = document.querySelectorAll('.filters button');
  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.dataset.filter;
      buttons.forEach(function (b) { b.classList.toggle('on', b === btn); });
      document.querySelectorAll('.card').forEach(function (c) {
        c.hidden = f !== 'all' && c.dataset.cat.split(' ').indexOf(f) === -1;
      });
    });
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  // 섹션이 화면에 들어오면 나타나기
  if (hasIO) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.block, .contact').forEach(function (b) { b.classList.add('reveal'); io.observe(b); });

    // 현재 보고 있는 섹션을 메뉴에 표시
    var links = document.querySelectorAll('.topbar nav a');
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });
  }
})();
