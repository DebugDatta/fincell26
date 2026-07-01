import { state, app, routes } from './state.js';
import { $, $$, esc, pathOf, pageFromPath, applyType, foot, toast, counters, charts } from './utils.js';
import { initMarket } from './market.js';
import { bindDash } from './pages/dashboard.js';
import home from './pages/home.js';
import about from './pages/about.js';
import departments from './pages/departments.js';
import projects from './pages/projects.js';
import dashboard from './pages/dashboard.js';
import gallery from './pages/gallery.js';
import events from './pages/events.js';
import blogs from './pages/blogs.js';
import news from './pages/news.js';
import contact from './pages/contact.js';
import { adminPage, adminPanel } from './pages/admin.js';

function bindRoutes(r) {
  $$('[data-route]', r || document).forEach(function (a) {
    a.onclick = function (e) {
      e.preventDefault();
      document.body.classList.remove('nav-open');
      nav(a.dataset.route, true)
    }
  })
}

app.navigate = nav;
function nav(p, push) {
  if (state.hidden[p] && p !== 'admin') p = 'home';
  app.current = p;
  applyType(p);
  render();
  if (push) history.pushState({ p: p }, '', pathOf(p));
  scrollTo(0, 0)
}

function header() {
  var h = '';
  state.order.forEach(function (id) {
    if (!state.hidden[id]) {
      h += '<a href="' + pathOf(id) + '" data-route="' + id + '" class="' + (app.current === id ? 'active' : '') + '">' +
        routes.find(function (r) { return r[0] === id })[1] + '</a>'
    }
  });
  $('#primaryNav').innerHTML = h;
  bindRoutes()
}

function footer() {
  var f = state.footer;
  return '<div class="container"><div class="footer-grid"><div><a class="brand" data-route="home" href="/"><img class="brand-mark" src="./fincelllogo.png" alt=""><span><strong>FINCELL</strong><small>St. Xavier\'s College</small></span></a><p class="muted">' + esc(f.body) + '</p></div><div class="footer-col"><h3>Navigate</h3>' +
    ['home', 'about', 'departments', 'projects', 'dashboard'].map(foot).join('') +
    '</div><div class="footer-col"><h3>Content</h3>' +
    ['news', 'events', 'blogs', 'gallery'].map(foot).join('') +
    '</div><div class="footer-col"><h3>Contact</h3><a>' + esc(f.address) + '</a><a href="mailto:' + esc(f.email) + '">' + esc(f.email) + '</a></div></div><div class="footer-bottom"><span>© 2026 FINCELL, St. Xavier\'s College. All rights reserved.</span><div class="socials">' +
    f.socials.map(function (s) { return '<a href="' + esc(s[1]) + '">' + esc(s[0]) + '</a>' }).join('') +
    '</div></div></div>'
}

function page(p) {
  if (p === 'admin') return adminPage();
  var pages = { home: home, about: about, departments: departments, projects: projects, dashboard: dashboard, gallery: gallery, events: events, blogs: blogs, news: news, contact: contact };
  return (pages[p] || home)()
}

function render() {
  header();
  $('#main').innerHTML = page(app.current);
  $('#siteFooter').innerHTML = footer();
  bindRoutes();
  bind();
  charts();
  counters();
  initMarket();
  if (app.current === 'dashboard') bindDash()
}

function bind() {
  $$('[data-dept]').forEach(function (b) {
    b.onclick = function () { app.dept = b.dataset.dept; render() }
  });
  $$('[data-filter]').forEach(function (b) {
    b.onclick = function () { app.galFilter = b.dataset.filter; render() }
  });
  $$('[data-acc]').forEach(function (b) {
    b.onclick = function () { b.parentElement.classList.toggle('open') }
  });
  $$('[data-lightbox]').forEach(function (b) {
    b.onclick = function () {
      var g = state.gallery.find(function (x) { return x.id === b.dataset.lightbox });
      if (g) {
        $('#lightboxImage').src = g.url;
        $('#lightbox').classList.add('open')
      }
    }
  });
  var cf = $('#contactForm');
  if (cf) {
    cf.onsubmit = function (e) { e.preventDefault(); toast('Message drafted. Connect a mail service before launch.'); e.target.reset() }
  }
  var lb = $('#loginBtn');
  if (lb) {
    lb.onclick = function () {
      if ($('#loginUser').value === 'admin' && $('#loginPass').value === 'fincellgoats') {
        app.admin = true;
        sessionStorage.setItem('fcadmin', '1');
        render()
      } else toast('Incorrect credentials')
    }
  }
  var lob = $('#logoutBtn');
  if (lob) {
    lob.onclick = function () { app.admin = false; sessionStorage.removeItem('fcadmin'); render() }
  }
  $$('[data-admin-tab]').forEach(function (b) {
    b.onclick = function () {
      app.adminTab = b.dataset.adminTab;
      $$('[data-admin-tab]').forEach(function (t) { t.classList.remove('active') });
      b.classList.add('active');
      adminPanel(render)
    }
  });
  adminPanel(render)
}

function bg() {
  var c = $('#market-bg'), ctx = c.getContext('2d'), w, h, mx = 0, my = 0, t = 0;
  var dpr = Math.min(devicePixelRatio, 2);
  var streams = Array.from({ length: 14 }, function (_, i) {
    return { y: (i + 1) / (14 + 1), speed: 0.18 + Math.random() * 0.22, amp: 18 + Math.random() * 28, freq: 0.003 + Math.random() * 0.004, phase: Math.random() * Math.PI * 2, alpha: 0.04 + Math.random() * 0.06, color: Math.random() > 0.65 ? '122,185,255' : '78,205,196' }
  });
  var nodes = Array.from({ length: 28 }, function () {
    return { x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 0.0004, vy: (Math.random() - 0.5) * 0.0003, r: 0.8 + Math.random() * 0.8 }
  });
  function resize() { w = c.width = innerWidth * dpr; h = c.height = innerHeight * dpr; c.style.width = innerWidth + 'px'; c.style.height = innerHeight + 'px' }
  addEventListener('resize', resize, { passive: true });
  addEventListener('mousemove', function (e) { mx = e.clientX / innerWidth; my = e.clientY / innerHeight }, { passive: true });
  resize();
  function tick() {
    t += 0.008;
    ctx.clearRect(0, 0, w, h);
    streams.forEach(function (s) {
      var baseY = s.y * h + (my - 0.5) * 18 * dpr;
      ctx.beginPath();
      for (var x = 0; x < w; x += 3) {
        var y = baseY + Math.sin(x * s.freq + t * s.speed + s.phase) * s.amp * dpr;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(' + s.color + ',' + s.alpha + ')';
      ctx.lineWidth = 1 * dpr;
      ctx.stroke()
    });
    nodes.forEach(function (n) {
      n.x += n.vx + (mx - 0.5) * 0.00012;
      n.y += n.vy + (my - 0.5) * 0.0001;
      if (n.x < 0) n.x = 1; if (n.x > 1) n.x = 0;
      if (n.y < 0) n.y = 1; if (n.y > 1) n.y = 0
    });
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var a = nodes[i], b = nodes[j];
        var dx = (a.x - b.x) * w, dy = (a.y - b.y) * h;
        var d = Math.sqrt(dx * dx + dy * dy);
        var thresh = 120 * dpr;
        if (d < thresh) {
          var op = (1 - d / thresh) * 0.07;
          ctx.strokeStyle = 'rgba(78,205,196,' + op + ')';
          ctx.lineWidth = 0.8 * dpr;
          ctx.beginPath();
          ctx.moveTo(a.x * w, a.y * h);
          ctx.lineTo(b.x * w, b.y * h);
          ctx.stroke()
        }
      }
    }
    nodes.forEach(function (n) {
      ctx.fillStyle = 'rgba(78,205,196,.12)';
      ctx.beginPath();
      ctx.arc(n.x * w, n.y * h, n.r * dpr, 0, Math.PI * 2);
      ctx.fill()
    });
    requestAnimationFrame(tick)
  }
  tick()
}

function init() {
  app.admin = sessionStorage.getItem('fcadmin') === '1';

  $('#menuToggle').onclick = function () {
    document.body.classList.toggle('nav-open');
    this.setAttribute('aria-expanded', document.body.classList.contains('nav-open'))
  };
  $('#lightboxClose').onclick = function () { $('#lightbox').classList.remove('open') };
  $('#lightbox').onclick = function (e) { if (e.target.id === 'lightbox') e.currentTarget.classList.remove('open') };

  addEventListener('popstate', function () { nav(pageFromPath(), false) });
  addEventListener('scroll', function () { $('#siteHeader').classList.toggle('scrolled', scrollY > 18) }, { passive: true });

  /* Scroll-reveal */
  (function () {
    var style = document.createElement('style');
    style.textContent =
      '[data-reveal]{opacity:0;transform:translateY(22px);transition:opacity .55s cubic-bezier(.22,1,.36,1),transform .55s cubic-bezier(.22,1,.36,1)}' +
      '[data-reveal].revealed{opacity:1;transform:none}' +
      '[data-reveal][data-delay="1"]{transition-delay:.08s}' +
      '[data-reveal][data-delay="2"]{transition-delay:.16s}' +
      '[data-reveal][data-delay="3"]{transition-delay:.24s}' +
      '[data-reveal][data-delay="4"]{transition-delay:.32s}';
    document.head.appendChild(style);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('revealed') })
    }, { threshold: 0.12 });
    function attachReveal() {
      $$('.card,.eyebrow,.section-title,.lead,.stats,.timeline-item,.feature-card').forEach(function (el, i) {
        if (!el.hasAttribute('data-reveal')) {
          el.setAttribute('data-reveal', '');
          var col = i % 4;
          if (col > 0) el.setAttribute('data-delay', String(col));
          io.observe(el)
        }
      })
    }
    var _render = render;
    render = function () { _render(); setTimeout(attachReveal, 0) };
    attachReveal()
  })();

  /* Magnetic buttons */
  (function () {
    function magnet(el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) * 0.28;
        var dy = (e.clientY - r.top - r.height / 2) * 0.28;
        el.style.transform = 'translate(' + dx + 'px,' + dy + 'px)'
      });
      el.addEventListener('mouseleave', function () { el.style.transform = '' })
    }
    function attachMagnets() { $$('.btn.primary,.btn.secondary').forEach(function (b) { if (!b._mag) { b._mag = true; magnet(b) } }) }
    var _render2 = render;
    render = function () { _render2(); setTimeout(attachMagnets, 0) };
    attachMagnets()
  })();

  bg();
  nav(pageFromPath(), false)
}

document.addEventListener('DOMContentLoaded', init)
