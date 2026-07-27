/* JICO Properties — interactions (built on the JICON Construction system) */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---- Year ---- */
  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* ---- Mobile nav ---- */
  var burger = $('#hamburger'), nav = $('#nav');
  function closeNav() {
    if (!nav) return;
    nav.classList.remove('open'); burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', closeNav); });
  }

  /* ---- Sticky header ---- */
  var header = $('#header');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* =========================================================
     AVAILABLE UNITS — SAMPLE DATA
     Replace with real listings (or wire to your TenantCloud feed).
     type: 'residential' | 'commercial'  ·  status: 'available' | 'soon'
     ========================================================= */
  var SAMPLE_UNITS = [
    { type:'residential', status:'available', title:'3 bed · 2 bath house',        addr:'Carolina Forest, Myrtle Beach', beds:'3 bd', bath:'2 ba', sqft:'1,650 sqft', rent:'$2,100', img:'assets/img/interior-1.jpg' },
    { type:'residential', status:'available', title:'2 bed · 2 bath condo',        addr:'Barefoot Resort, N. Myrtle Beach', beds:'2 bd', bath:'2 ba', sqft:'1,100 sqft', rent:'$1,650', img:'assets/img/kitchen-2.jpg' },
    { type:'commercial',  status:'available', title:'Retail / office suite',       addr:'Little River',                     beds:'—',   bath:'1 ba', sqft:'1,400 sqft', rent:'$1,900', img:'assets/img/exterior-1.jpg' },
    { type:'residential', status:'soon',      title:'2 bed · 1 bath duplex',       addr:'Surfside Beach',                   beds:'2 bd', bath:'1 ba', sqft:'900 sqft',  rent:'$1,475', img:'assets/img/kitchen-1.jpg' },
    { type:'commercial',  status:'available', title:'Small-business storefront',   addr:'Market Common, Myrtle Beach',      beds:'—',   bath:'1 ba', sqft:'2,000 sqft', rent:'$2,600', img:'assets/img/hero-home.jpg' },
    { type:'residential', status:'available', title:'4 bed · 3 bath house',        addr:'Murrells Inlet',                   beds:'4 bd', bath:'3 ba', sqft:'2,200 sqft', rent:'$2,650', img:'assets/img/interior-1.jpg' }
  ];

  var grid = $('#unitGrid');
  if (grid) {
    grid.innerHTML = SAMPLE_UNITS.map(function (u) {
      var badge = u.status === 'soon'
        ? '<span class="unit-badge unit-badge--soon">Coming soon</span>'
        : '<span class="unit-badge">Available now</span>';
      var bedbits = u.beds !== '—' ? '<span><b>' + u.beds + '</b></span>' : '<span><b>Commercial</b></span>';
      return '' +
        '<a class="unit-card reveal" href="https://jicoproperties.tenantcloud.com" target="_blank" rel="noopener" data-cat="' + u.type + '">' +
          '<div class="unit-shot">' + badge + '<img src="' + u.img + '" alt="' + u.title + ' in ' + u.addr + '" loading="lazy"></div>' +
          '<div class="unit-body">' +
            '<h3>' + u.title + '</h3>' +
            '<div class="unit-addr">' +
              '<svg viewBox="0 0 24 24" width="14" height="14" fill="#D71F27"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/></svg>' + u.addr +
            '</div>' +
            '<div class="unit-meta">' + bedbits + '<span><b>' + u.bath + '</b></span><span><b>' + u.sqft + '</b></span>' +
              '<span class="unit-rent"><span class="n">' + u.rent + '</span><small>per month</small></span>' +
            '</div>' +
          '</div>' +
        '</a>';
    }).join('');
  }

  /* ---- Units filter ---- */
  var filters = $('#filters');
  if (filters) {
    filters.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter'); if (!btn) return;
      $$('.filter', filters).forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var f = btn.getAttribute('data-filter');
      $$('.unit-card', grid).forEach(function (c) {
        var show = (f === 'all' || c.getAttribute('data-cat') === f);
        c.style.display = show ? '' : 'none';
      });
    });
  }

  /* ---- Reveal on scroll ---- */
  var revealEls = $$('.section__head, .svc, .offer__card, .unit-card, .action, .door, .areas li, .tst, .strip__item');
  revealEls.forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.transitionDelay = Math.min((i % 6) * 60, 360) + 'ms';
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else { revealEls.forEach(function (el) { el.classList.add('in'); }); }

  /* ---- Contact form (Formspree when configured, mailto fallback) ---- */
  var cForm = $('#contactForm'), cNote = $('#contactNote');
  if (cForm) {
    cForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = function (n) { var el = cForm.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ''; };
      var name = q('name'), phone = q('phone');
      if (!name || !phone) { cNote.textContent = 'Please add your name and phone.'; cNote.className = 'quote__note err'; return; }
      var btn = cForm.querySelector('button[type="submit"]'), orig = btn.textContent;
      btn.disabled = true; btn.textContent = 'Sending…';
      var action = cForm.getAttribute('action') || '';
      var configured = action.indexOf('formspree.io') > -1 && action.indexOf('your-form-id') === -1;
      function ok() {
        cForm.reset(); btn.disabled = false; btn.textContent = orig;
        cNote.textContent = 'Thanks — we got it and will be in touch, usually the same day.'; cNote.className = 'quote__note ok';
      }
      function fallback() {
        btn.disabled = false; btn.textContent = orig;
        var body = 'NEW INQUIRY — JICO Properties\n\n' +
          'Name: ' + name + '\nPhone: ' + phone + '\nEmail: ' + q('email') +
          '\nInterested in: ' + q('interest') + '\n\nMessage:\n' + q('message') + '\n';
        var mailto = 'mailto:info@jicoproperties.com?subject=' +
          encodeURIComponent('Website inquiry — ' + q('interest')) + '&body=' + encodeURIComponent(body);
        var w = window.open(mailto, '_blank'); if (!w) window.location.href = mailto;
        cNote.textContent = 'Opening your email app to send…'; cNote.className = 'quote__note';
      }
      if (configured) {
        fetch(action, { method: 'POST', body: new FormData(cForm), headers: { Accept: 'application/json' } })
          .then(function (r) { r.ok ? ok() : fallback(); }).catch(fallback);
      } else { fallback(); }
    });
  }
})();


/* ============ Animated stat counters ============ */
(function(){
  'use strict';
  var els = Array.prototype.slice.call(document.querySelectorAll('.stat__num[data-count]'));
  if(!els.length) return;
  var reduce = false; try { reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e) {}
  if (!reduce) els.forEach(function(el){ el.textContent = '0'; });
  function fmt(el,v){
    var plain = el.getAttribute('data-plain');
    var s = plain ? String(v) : v.toLocaleString('en-US');
    return s + (el.getAttribute('data-suffix') || '');
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(!e.isIntersecting) return;
      io.unobserve(e.target);
      var el = e.target, n = parseInt(el.getAttribute('data-count'),10) || 0;
      if(reduce || !('requestAnimationFrame' in window)){ el.textContent = fmt(el,n); return; }
      var t0 = performance.now(), dur = 1500;
      (function tick(t){
        var p = Math.min((t-t0)/dur, 1);
        el.textContent = fmt(el, Math.round(n*(1-Math.pow(1-p,3))));
        if(p<1) requestAnimationFrame(tick);
      })(t0);
    });
  }, {threshold:.5});
  els.forEach(function(el){ io.observe(el); });
})();

/* ============ Before / After slider ============ */
(function(){
  'use strict';
  Array.prototype.slice.call(document.querySelectorAll('.ba')).forEach(function(ba){ initBA(ba); });
  function initBA(ba){
    function setSplit(p){
      p = Math.max(2, Math.min(98, p));
      ba.style.setProperty('--split', p+'%');
      ba.setAttribute('aria-valuenow', Math.round(p));
    }
    function fromEvent(ev){
      var r = ba.getBoundingClientRect();
      var x = (ev.touches ? ev.touches[0].clientX : ev.clientX) - r.left;
      setSplit(x / r.width * 100);
    }
    var drag = false;
    ba.addEventListener('touchstart', function(e){ drag = true; ba.classList.add('dragging'); fromEvent(e); e.preventDefault(); }, {passive:false});
    ba.addEventListener('touchmove', function(e){ if(drag){ fromEvent(e); e.preventDefault(); } }, {passive:false});
    ba.addEventListener('touchend', function(){ drag = false; ba.classList.remove('dragging'); });
    ba.addEventListener('click', function(e){ fromEvent(e); });
    ba.addEventListener('pointerdown', function(e){ drag = true; ba.classList.add('dragging'); try{ ba.setPointerCapture(e.pointerId); }catch(err){} fromEvent(e); });
    ba.addEventListener('pointermove', function(e){ if(drag) fromEvent(e); });
    ba.addEventListener('pointerup', function(){ drag = false; ba.classList.remove('dragging'); });
    ba.addEventListener('pointercancel', function(){ drag = false; ba.classList.remove('dragging'); });
    ba.addEventListener('keydown', function(e){
      var now = parseFloat(getComputedStyle(ba).getPropertyValue('--split')) || 50;
      if(e.key === 'ArrowLeft'){ setSplit(now-4); e.preventDefault(); }
      if(e.key === 'ArrowRight'){ setSplit(now+4); e.preventDefault(); }
    });
  }
})();

/* ============ Hero video montage (self-hosted crossfading clips) ============ */
/* Edit HERO_CLIPS to reorder/swap. Only the first clip preloads eagerly.
   prefers-reduced-motion users just see the hero-home.jpg fallback. */
(function(){
  'use strict';
  var HERO_CLIPS = [
    'assets/video/hero-homes-aerial.mp4',
    'assets/video/hero-coastal-travel.mp4',
    'assets/video/hero-commercial-framing.mp4',
    'assets/video/hero-kitchen-white.mp4',
    'assets/video/hero-paint-roller.mp4',
    'assets/video/hero-coastal-sunrise.mp4'
  ];
  var mount = document.getElementById('heroMontage');
  if(!mount) return;
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var DWELL = 5000, LEAD = 1500;
  var els = HERO_CLIPS.map(function(src, i){
    var v = document.createElement('video');
    v.src = src; v.muted = true; v.loop = true; v.playsInline = true;
    v.setAttribute('muted',''); v.setAttribute('playsinline','');
    v.preload = (i === 0 ? 'auto' : 'none');
    mount.appendChild(v);
    return v;
  });
  if(!els.length) return;
  var cur = 0;
  function play(v){ var p = v.play(); if(p && p['catch']) p['catch'](function(){}); }
  function step(){
    var next = (cur + 1) % els.length;
    els[next].preload = 'auto';
    play(els[next]);
    setTimeout(function(){
      els[next].classList.add('on');
      els[cur].classList.remove('on');
      var old = cur; cur = next;
      setTimeout(function(){ els[old].pause(); }, 950);
      setTimeout(step, DWELL - LEAD);
    }, LEAD);
  }
  function start(){ els[0].classList.add('on'); play(els[0]); setTimeout(step, DWELL - LEAD); }
  if(els[0].readyState >= 3){ start(); }
  else { els[0].addEventListener('canplay', start, { once: true }); els[0].load(); }
})();
