/* JICO Properties — site interactions */

/* ============================================================================
   FORMS CONFIG — one line to make the Contact + Notify-me forms email you.
   1. Go to https://formspree.io, sign up (use chris@jicoproperties.com), create
      a new form, and copy its endpoint — it looks like https://formspree.io/f/abcwxyz
   2. Paste that full URL between the quotes below.
   3. Leave it '' to keep the current behavior (opens the visitor's email app).
   ============================================================================ */
var JICO_FORM_ENDPOINT = 'https://formspree.io/f/xojgrjva';

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
  /* Recently LEASED properties (real), shown as portfolio examples while there
     are no active vacancies. Add new available units here with status:'available'. */
  var SAMPLE_UNITS = [
    { type:'commercial',  status:'leased', title:'Storefront retail / office', addr:'4873 US Hwy 17 Bypass S, Myrtle Beach', beds:'—', bath:'—', sqft:'—',   rent:'$2,300', img:'assets/img/lease-storefront-mb.jpg' },
    { type:'commercial',  status:'leased', title:'Flex / office suite',        addr:'3926 Wesley St, Myrtle Beach', beds:'—',    bath:'—',  sqft:'2,000 sqft', rent:'$2,200', img:'assets/img/lease-flex-wesley.jpg' },
    { type:'residential', status:'leased', title:'3 bed · 2 bath townhouse',   addr:'1802 Barberry Dr, Conway, SC', beds:'3 bd', bath:'2 ba', sqft:'—',   rent:'$1,750', img:'assets/img/lease-townhouse-conway.jpg' }
  ];

  var grid = $('#unitGrid');
  if (grid) {
    grid.innerHTML = SAMPLE_UNITS.map(function (u) {
      var leased = u.status === 'leased';
      var href = leased ? '#notify' : 'https://jicoproperties.tenantcloud.com';
      var target = leased ? '' : ' target="_blank" rel="noopener"';
      var overlay = leased
        ? '<span class="unit-stamp">Leased</span>'
        : (u.status === 'soon'
            ? '<span class="unit-badge unit-badge--soon">Coming soon</span>'
            : '<span class="unit-badge">Available now</span>');
      var meta = [];
      meta.push('<span><b>' + (u.beds !== '—' ? u.beds : (u.type === 'commercial' ? 'Commercial' : '—')) + '</b></span>');
      if (u.bath && u.bath !== '—') meta.push('<span><b>' + u.bath + '</b></span>');
      if (u.sqft && u.sqft !== '—') meta.push('<span><b>' + u.sqft + '</b></span>');
      return '' +
        '<a class="unit-card reveal" href="' + href + '"' + target + ' data-cat="' + u.type + '">' +
          '<div class="unit-shot' + (leased ? ' is-leased' : '') + '">' + overlay +
            '<img src="' + u.img + '" alt="' + u.title + ' in ' + u.addr + '" loading="lazy"></div>' +
          '<div class="unit-body">' +
            '<h3>' + u.title + '</h3>' +
            '<div class="unit-addr">' +
              '<svg viewBox="0 0 24 24" width="14" height="14" fill="#D71F27"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/></svg>' + u.addr +
            '</div>' +
            '<div class="unit-meta">' + meta.join('') +
              '<span class="unit-rent"><span class="n">' + u.rent + '</span><small>' + (leased ? 'leased' : 'per month') + '</small></span>' +
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
      var action = JICO_FORM_ENDPOINT || '';
      var configured = action.indexOf('formspree.io') > -1;
      function ok() {
        cForm.reset(); btn.disabled = false; btn.textContent = orig;
        cNote.textContent = 'Thanks — we got it and will be in touch, usually the same day.'; cNote.className = 'quote__note ok';
      }
      function fallback() {
        btn.disabled = false; btn.textContent = orig;
        var body = 'NEW INQUIRY — JICO Properties\n\n' +
          'Name: ' + name + '\nPhone: ' + phone + '\nEmail: ' + q('email') +
          '\nInterested in: ' + q('interest') + '\n\nMessage:\n' + q('message') + '\n';
        var mailto = 'mailto:chris@jicoproperties.com?subject=' +
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
    'assets/video/hero-retail-plaza.mp4',     // 1 commercial retail strip
    'assets/video/hero-homes-aerial.mp4',     // 2 residential aerial
    'assets/video/hero-coastal-travel.mp4',   // 3 beach
    'assets/video/hero-office-exterior.mp4',  // 4 commercial office
    'assets/video/hero-suburban-aerial.mp4',  // 5 residential development aerial
    'assets/video/hero-coastal-sunrise.mp4'   // 6 beach
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


/* ============ FAQ accordion ============ */
(function(){
  'use strict';
  var items = Array.prototype.slice.call(document.querySelectorAll('.faq__item'));
  items.forEach(function(item){
    var q = item.querySelector('.faq__q'), a = item.querySelector('.faq__a');
    if(!q || !a) return;
    q.setAttribute('aria-expanded','false');
    q.addEventListener('click', function(){
      var open = item.classList.toggle('open');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
      a.style.maxHeight = open ? (a.scrollHeight + 'px') : '0px';
    });
  });
})();

/* ============ Notify-me form (Formspree when configured, mailto fallback) ============ */
(function(){
  'use strict';
  var form = document.getElementById('notifyForm'), note = document.getElementById('notifyNote');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var q = function(n){ var el = form.querySelector('[name="'+n+'"]'); return el ? el.value.trim() : ''; };
    var name = q('name'), email = q('email');
    if(!name || !email){ note.textContent = 'Please add your name and email.'; return; }
    var btn = form.querySelector('.notify__btn'), orig = btn.textContent;
    btn.disabled = true; btn.textContent = 'Sending...';
    var action = JICO_FORM_ENDPOINT || '';
    var configured = action.indexOf('formspree.io') > -1;
    function ok(){ form.reset(); btn.disabled = false; btn.textContent = orig;
      note.textContent = "You're on the list - we'll reach out when something fits."; }
    function fallback(){
      btn.disabled = false; btn.textContent = orig;
      var body = 'NOTIFY-ME REQUEST - JICO Properties\n\nName: '+name+'\nEmail: '+email+
        '\nPhone: '+q('phone')+'\nPreferred area: '+(q('area')||'Any')+'\nType: '+(q('type')||'Any')+'\n';
      var mailto = 'mailto:chris@jicoproperties.com?subject='+encodeURIComponent('Notify me - new availability')+
        '&body='+encodeURIComponent(body);
      var w = window.open(mailto,'_blank'); if(!w) window.location.href = mailto;
      note.textContent = 'Opening your email app to send...';
    }
    if(configured){
      fetch(action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}})
        .then(function(r){ r.ok ? ok() : fallback(); }).catch(fallback);
    } else { fallback(); }
  });
})();

/* ============ Coverage map (pin <-> area-card sync) ============ */
(function(){
  'use strict';
  var pins = Array.prototype.slice.call(document.querySelectorAll('.pin'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.area-card[data-area]'));
  if(!pins.length) return;
  function setActive(area){
    pins.forEach(function(p){ p.classList.toggle('active', p.getAttribute('data-area')===area); });
    cards.forEach(function(c){ c.classList.toggle('active', c.getAttribute('data-area')===area); });
  }
  function clearActive(){ pins.forEach(function(p){p.classList.remove('active');}); cards.forEach(function(c){c.classList.remove('active');}); }
  function wire(el){
    var area = el.getAttribute('data-area');
    el.addEventListener('mouseenter', function(){ setActive(area); });
    el.addEventListener('mouseleave', clearActive);
    el.addEventListener('focus', function(){ setActive(area); });
    el.addEventListener('blur', clearActive);
  }
  pins.forEach(wire); cards.forEach(wire);
  function goRentals(){ var t = document.getElementById('rentals'); if(t) t.scrollIntoView({behavior:'smooth'}); }
  cards.forEach(function(c){ c.addEventListener('click', goRentals); });
  pins.forEach(function(p){
    p.addEventListener('click', goRentals);
    p.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); goRentals(); } });
  });
})();

/* ============ Chat assistant (scripted, client-side) ============ */
(function(){
  'use strict';
  var fab = document.getElementById('chatFab'), panel = document.getElementById('chatPanel');
  var body = document.getElementById('chatBody'), quick = document.getElementById('chatQuick'), close = document.getElementById('chatClose');
  if(!fab || !panel) return;

  var PORTAL = 'https://jicoproperties.tenantcloud.com';
  var KB = [
    { label:'See available units', scroll:'rentals',
      a:"Here's what's open now - browse the cards and open any one to apply. <a href='#rentals'>See available units &rarr;</a>" },
    { label:'How do I apply?', scroll:'rentals',
      a:"Easy: open a unit under Available and hit Apply. It runs through our secure portal and comes straight to us - a real person follows up." },
    { label:'What areas?', scroll:'coverage',
      a:"We own and lease in <b>Conway, Myrtle Beach, and Socastee</b>. <a href='#coverage'>See our areas &rarr;</a>" },
    { label:'Do you allow pets?',
      a:"Some units are pet-friendly with a deposit - the listing will note it. Not sure? <a href='#contact'>Ask us</a> before applying." },
    { label:'Pay rent / maintenance',
      a:"Current tenant? Pay rent and submit maintenance in the <a href='"+PORTAL+"' target='_blank' rel='noopener'>tenant portal</a>. Maintenance is in-house - or call <a href='tel:+13015422542'>301-542-2542</a>." },
    { label:'Commercial space?',
      a:"Yes - retail, office, and storefront space for small businesses, alongside our homes. <a href='#contact'>Tell us what you need &rarr;</a>" },
    { label:'Talk to a person',
      a:"Happy to help directly - call or text <a href='tel:+13015422542'>301-542-2542</a>, or <a href='#contact'>send a message</a> and we'll reply, usually the same day." }
  ];

  function bubble(text, who){
    var d = document.createElement('div');
    d.className = 'chat-msg ' + (who||'bot');
    d.innerHTML = text;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
  }
  function renderQuick(){
    quick.innerHTML = '';
    KB.forEach(function(item){
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = item.label;
      b.addEventListener('click', function(){
        bubble(item.label, 'user');
        setTimeout(function(){ bubble(item.a, 'bot'); }, 260);
      });
      quick.appendChild(b);
    });
  }
  var greeted = false;
  function open(){
    panel.classList.add('open'); fab.classList.add('hide');
    if(!greeted){
      bubble("Hi! I'm the JICO Properties assistant. What can I help you find?", 'bot');
      renderQuick();
      greeted = true;
    }
  }
  function closePanel(){ panel.classList.remove('open'); fab.classList.remove('hide'); }
  fab.addEventListener('click', open);
  close.addEventListener('click', closePanel);
  document.addEventListener('keydown', function(e){ if(e.key==='Escape' && panel.classList.contains('open')) closePanel(); });
})();
