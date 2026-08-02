import { REST, AUTH, STORAGE, STORAGE_PUBLIC_PREFIX, STORAGE_BUCKET, ANON_KEY, ADMIN_EMAIL } from './supabase.js';

export var routes = [
  ['home', 'Home'], ['about', 'About'], ['departments', 'Departments'],
  ['projects', 'Projects'], ['dashboard', 'Dashboard'], ['gallery', 'Gallery'],
  ['blogs', 'Think Tank'], ['contact', 'Contact']
];
export var key = 'fincell.pro.v4';

var sessKey = 'fincell.sess';

function token() {
  try {
    var s = JSON.parse(sessionStorage.getItem(sessKey));
    return (s && s.access_token) || ''
  } catch (e) { return '' }
}

function authHeaders() {
  return { apikey: ANON_KEY, Authorization: 'Bearer ' + (token() || ANON_KEY), 'Content-Type': 'application/json' }
}

export function restoreSession() {
  try {
    var s = JSON.parse(sessionStorage.getItem(sessKey));
    return !!(s && s.access_token && (!s.expires_at || s.expires_at > Date.now()))
  } catch (e) { return false }
}

export function logout() {
  try { sessionStorage.removeItem(sessKey) } catch (e) {}
  app.admin = false
}
export var app = {
  current: 'home',
  admin: false,
  dept: 'core',
  galFilter: 'events',
  galPeriod: 'current',
  adminTab: 'content',
  contentTab: 'hero',
  projTab: 'fundamental',
  projSearch: '',
  projFilters: null,
  thinkTankSection: 'blogs'
};

export var typo = {
  headingFont: 'General Sans', bodyFont: 'Inter', buttonFont: 'Inter',
  headingWeight: 720, bodyWeight: 440, buttonWeight: 700,
  headingSize: 48, bodySize: 16, buttonSize: 14,
  headingLs: 0, bodyLs: 0, buttonLs: 0.02,
  headingLh: 1.03, bodyLh: 1.7, buttonLh: 1.1,
  textColor: '#f4f8fb'
};

function img(label, a, b) {
  var light = document.documentElement.getAttribute('data-theme') === 'light';
  if (light) { a = a || '#0d857c'; b = b || '#2f6fd0'; }
  else { a = a || '#63d0c7'; b = b || '#7aa7ff'; }
  var bg = light ? '#f4f8fb' : '#0b1622';
  var pat = light ? 'rgba(16,45,70,.08)' : 'rgba(255,255,255,.12)';
  var title = light ? '#0b1e2b' : '#f4f8fb';
  var sub = light ? '#58727f' : '#9aa8b4';
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs>'
    + '<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient>'
    + '<pattern id="p" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M0 40h80M40 0v80" stroke="' + pat + '"/></pattern>'
    + '</defs>'
    + '<rect width="1200" height="800" fill="' + bg + '"/>'
    + '<rect width="1200" height="800" fill="url(#p)"/>'
    + '<circle cx="910" cy="130" r="310" fill="url(#g)" opacity="' + (light ? '.16' : '.28') + '"/>'
    + '<path d="M110 560 C260 410 360 470 470 330 S710 260 850 390 1010 450 1110 300" fill="none" stroke="' + a + '" stroke-width="10" stroke-linecap="round" opacity=".88"/>'
    + '<text x="88" y="150" fill="' + title + '" font-family="Arial" font-size="54" font-weight="800">' + label + '</text>'
    + '<text x="92" y="205" fill="' + sub + '" font-family="Arial" font-size="24">FINCELL visual asset</text></svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function phLabel(url) {
  try {
    var s = decodeURIComponent(String(url).split(';charset=utf-8,')[1] || '');
    var m = s.match(/<text[^>]*>([\s\S]*?)<\/text>/);
    return m ? m[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"') : '';
  } catch (e) { return '' }
}

export function refreshImages() {
  if (!state || !state.gallery) return;
  state.gallery.forEach(function (g) {
    if (/^data:image\/svg\+xml/.test(String(g.url || ''))) {
      g.url = img(phLabel(g.url) || g.name || 'FINCELL');
    }
  });
}

export function defaultState() {
  var t = {};
  routes.forEach(function (r) { t[r[0]] = Object.assign({}, typo) });
  return {
    order: routes.map(function (r) { return r[0] }),
    hidden: {},
    typography: t,
    hero: {
      label: "The Finance Cell - St. Xavier's College",
      title: 'From Insights to Impact.',
      subtitle: 'Where rigorous research, quantitative craft, and student curiosity converge - building a bridge between the classroom and the markets that move the world.',
      primaryText: 'Explore FINCELL', primaryRoute: 'about',
      secondaryText: 'View Research', secondaryRoute: 'projects',
      quote: 'The market is a story. We read between the lines.'
    },
    stats: [
      { label: 'Departments', value: 4 }, { label: 'Members', value: 20 },
      { label: 'Publications', value: 12 }, { label: 'Years', value: 3 }
    ],
    about: {
      title: 'Turning curiosity into financial mastery',
      body: "FINCELL is the Finance Cell of St. Xavier's College, Mumbai - a student-driven organisation dedicated to bridging the gap between academic theory and real-world financial markets. Founded on the belief that rigorous analysis and intellectual curiosity are the foundations of exceptional finance professionals.",
      values: [
        ['Research First', 'Every insight backed by data, models, and peer review'],
        ['Collaboration', 'Cross-departmental learning and shared knowledge'],
        ['Excellence', 'Professional standards in every report and analysis'],
        ['Impact', 'Insights that shape thinking beyond the classroom']
      ],
      timeline: [
        ['2022 - Founded', "FINCELL established at St. Xavier's College with a founding cohort of 12 members across two departments."],
        ['2023 - First Research Publication', 'Published first equity research report on the Indian FMCG sector. Launched weekly newsletter with 200+ subscribers.'],
        ['2024 - Quantitative Division', "Launched the Quants vertical, introducing algorithmic strategies and factor modelling to the cell's research output."],
        ['2025 - Dashboard Initiative', "Began development of an open-source quantitative research dashboard - the cell's most ambitious technical project."],
        ['2026 - The Present', 'Scaling research operations and building tools for the next generation of student analysts at Xavier\'s.']
      ],
      leaders: [
        { name: 'Pritesh Arte', role: 'Faculty In Charge', group: 'faculty', year: '', image: '', bio: 'Providing academic mentorship and guiding the cell\'s research direction with over a decade of experience in finance education.' },
        { name: 'Dhun Chaudhary', role: 'President', group: 'core', year: '', image: '', bio: 'Leading the cell\'s strategic vision, overseeing all verticals and driving FINCELL\'s growth across the college.' },
        { name: 'Arko Dalal', role: 'Vice President', group: 'core', year: '', image: '', bio: 'Supporting daily operations, coordinating cross-departmental projects, and ensuring research quality standards.' },
        { name: 'Aarjav Jain', role: 'Fund Manager', group: 'core', year: '', image: '', bio: 'Managing the student-managed investment fund, portfolio allocation, and quantitative strategy development.' }
      ]
    },
    organization: [
      { name: 'Research House', role: '', level: 0, image: '', bio: '' },
      { name: 'Quantitative Research', role: '', level: 1, image: '', bio: '' },
      { name: 'Vanshika Soni', role: 'Head', level: 2, image: '', bio: 'Leading quantitative research initiatives, building algorithmic models and factor-based strategies for Indian markets.' },
      { name: 'Pramit Datta', role: 'Subhead', level: 2, image: '', bio: 'Supporting quant research with statistical modelling, data analysis, and strategy backtesting.' },
      { name: 'Fundamental Research', role: '', level: 1, image: '', bio: '' },
      { name: 'Shubh Tandon', role: 'Head', level: 2, image: '', bio: 'Driving fundamental equity research with a focus on DCF modelling and sectoral analysis.' },
      { name: 'Sector Heads', role: '', level: 2, image: '', bio: '' },
      { name: 'TMT', role: '', level: 3, image: '', bio: '' },
      { name: 'Shardul Joshi', role: 'TMT Head', level: 4, image: '', bio: 'Covering Technology, Media & Telecom sectors with in-depth equity research and valuation analysis.' },
      { name: 'Healthcare', role: '', level: 3, image: '', bio: '' },
      { name: 'Vijay Mudaliyar', role: 'Healthcare Head', level: 4, image: '', bio: 'Analysing the Healthcare sector including pharmaceuticals, hospitals, and health-tech.' },
      { name: 'Consumer Discretionary', role: '', level: 3, image: '', bio: '' },
      { name: 'Tanishka Goyal', role: 'Consumer Discretionary Head', level: 4, image: '', bio: 'Researching Consumer Discretionary sectors including retail, automobiles, and leisure.' },
      { name: 'Cements', role: '', level: 3, image: '', bio: '' },
      { name: 'Yatharth Agarwal', role: 'Cements Head', level: 4, image: '', bio: 'Covering the Cement and building materials sector with detailed financial analysis.' },
      { name: 'Defence', role: '', level: 3, image: '', bio: '' },
      { name: 'Abhinandan Vajpayee', role: 'Defence Head', level: 4, image: '', bio: 'Analysing the Defence and Aerospace sector including policy-driven growth narratives.' },
      { name: 'IPO', role: '', level: 3, image: '', bio: '' },
      { name: 'Abhishree Rai', role: 'IPO Head', level: 4, image: '', bio: 'Tracking primary market activity, IPO valuations, and listing performance analysis.' },
      { name: 'REITs', role: '', level: 3, image: '', bio: '' },
      { name: 'Prit Daki', role: 'REITs Head', level: 4, image: '', bio: 'Researching Real Estate Investment Trusts and the broader real estate sector.' },
      { name: 'Content House', role: '', level: 0, image: '', bio: '' },
      { name: 'Workshops', role: '', level: 1, image: '', bio: '' },
      { name: 'Anoushkaa Majumdar', role: 'Head', level: 2, image: '', bio: 'Organising and conducting finance workshops, guest lectures, and skill-building sessions.' },
      { name: 'Anushka Dalal', role: 'Subhead', level: 2, image: '', bio: 'Coordinating workshop logistics, speaker outreach, and participant engagement.' },
      { name: 'Administration', role: '', level: 1, image: '', bio: '' },
      { name: 'Helena Maria Joseph', role: 'Head', level: 2, image: '', bio: 'Managing daily operations, records, and administrative workflows of the cell.' },
      { name: 'Nishtha Thakkar', role: 'Subhead', level: 2, image: '', bio: 'Supporting administrative processes, scheduling, and internal communications.' },
      { name: 'Public Relations', role: '', level: 1, image: '', bio: '' },
      { name: 'Ranya Sharma', role: 'Head', level: 2, image: '', bio: 'Managing external communications, media relations, and public outreach initiatives.' },
      { name: 'Anoushka Sircar', role: 'Subhead', level: 2, image: '', bio: 'Assisting with PR campaigns, content distribution, and brand presence.' },
      { name: 'Creatives', role: '', level: 1, image: '', bio: '' },
      { name: 'Digital Creatives', role: '', level: 2, image: '', bio: '' },
      { name: 'Elaine Menezes', role: 'Head', level: 3, image: '', bio: 'Creating visual assets, digital content, and branding materials for all verticals.' },
      { name: 'FnD', role: '', level: 2, image: '', bio: '' },
      { name: 'Ansh Vador', role: 'Head', level: 3, image: '', bio: 'Leading Food & Design initiatives, blending creative concepts with student engagement.' },
      { name: 'Sponsorships & Networking', role: '', level: 1, image: '', bio: '' },
      { name: 'Sponsorships', role: '', level: 2, image: '', bio: '' },
      { name: 'Natania Prabhakar', role: 'Head', level: 3, image: '', bio: 'Securing sponsorships, building corporate partnerships, and managing funding relationships.' },
      { name: 'Networking', role: '', level: 2, image: '', bio: '' },
      { name: 'Yesha D\'Souza', role: 'Head', level: 3, image: '', bio: 'Building industry connections, alumni relations, and professional networking opportunities.' },
      { name: 'Think Tank', role: '', level: 1, image: '', bio: '' },
      { name: 'Blogs', role: '', level: 2, image: '', bio: '' },
      { name: 'Aditi Prabhu', role: 'Head', level: 3, image: '', bio: 'Leading editorial content strategy, blog publishing, and long-form financial writing.' },
      { name: 'Cleandro Rozario', role: 'Subhead', level: 3, image: '', bio: 'Managing blog schedules, editing submissions, and maintaining content quality.' },
      { name: 'Podcasts', role: '', level: 2, image: '', bio: '' },
      { name: 'Anna Cherian', role: 'Head', level: 3, image: '', bio: 'Producing and hosting finance podcasts featuring industry experts and student insights.' },
      { name: 'Darshan', role: 'Subhead', level: 3, image: '', bio: 'Handling audio production, editing, and podcast distribution across platforms.' }
    ],
    projects: {
      fundamental: [
        { title: 'Indian FMCG Sector — Equity Outlook', desc: 'Comprehensive equity research report covering ten major FMCG companies with DCF valuations and industry analysis.', link: '#', year: '2026' },
        { title: 'The Rise of Fintech in India', desc: 'An analysis of India\'s fintech revolution — payments, lending, insurtech, and the regulatory landscape.', link: '#', year: '2026' },
        { title: 'Factor Modelling in Indian Markets', desc: 'A quantitative deep-dive into factor-based investing strategies and their application in Indian equities.', link: '#', year: '2025' }
      ],
      quantitative: [
        { title: 'FINCELL Research Dashboard', desc: 'Open-source quantitative research dashboard with real-time data pipelines and interactive visualizations.', link: '#', year: '2026' },
        { title: 'Volatility Modelling for Indian Indices', desc: 'GARCH and stochastic volatility models applied to Nifty 50 and Bank Nifty for risk estimation.', link: '#', year: '2026' },
        { title: 'Algorithmic Trading Strategy Backtester', desc: 'Python-based framework for backtesting factor-based strategies on Indian equity market data.', link: '#', year: '2025' }
      ]
    },

    events: [
      { id: 'e1', title: 'Markets in Motion 2026', date: '2026-08-20', time: '4:00 PM', venue: 'Xavier\'s Main Hall', desc: 'Flagship annual conference with industry leaders.', published: true },
      { id: 'e2', title: 'Quant Workshop Series', date: '2026-09-05', time: '3:00 PM', venue: 'Finance Lab', desc: 'Hands-on workshop on factor modelling in Python.', published: true }
    ],
    ongoing: [
      ['Dashboard v2.0', 'Rebuilding the research dashboard with real-time data pipelines and interactive visualizations. Completion expected Q4 2026.'],
      ['Sector Report Series', 'A comprehensive analysis of ten Indian sectors. Three reports published, seven in progress.'],
      ['Algo Strategy Lab', 'Internal research group exploring factor-based strategies for the Indian equity market.']
    ],
    news: [
      { id: 'n1', h: 'FINCELL launches Quant vertical', c: 'Announcement', e: 'New quantitative research division established to focus on algorithmic strategies and factor modelling.', d: 'June 2026', l: '', published: true },
      { id: 'n2', h: 'Q2 Markets Review Published', c: 'Research', e: 'Comprehensive Q2 review covering FMCG, banking, and IT sectors with forward guidance.', d: 'May 2026', l: '', published: true },
      { id: 'n3', h: 'Workshop on DCF Modelling', c: 'Events', e: 'Hands-on workshop attracted 40+ participants from across the college.', d: 'April 2026', l: '', published: true }
    ],
    blogs: [
      { id: 'b1', t: 'Understanding the Repo Rate', c: 'Macro', p: 'A deep dive into how repo rate changes affect markets, inflation, and your portfolio.', a: 'FINCELL Editorial', rt: '6 min read', l: '', published: true },
      { id: 'b2', t: 'Factor Investing 101', c: 'Quant', p: 'An introduction to factor-based investing and how it applies to Indian markets.', a: 'Rohit Nair', rt: '8 min read', l: '', published: true },
      { id: 'b3', t: 'The Rise of Retail Investors', c: 'Markets', p: 'How retail participation is reshaping Indian equity markets in 2026.', a: 'Ananya Rao', rt: '5 min read', l: '', published: true }
    ],
    podcasts: [
      { id: 'p1', t: 'FINCELL Markets Podcast', c: 'Markets', p: 'Weekly analysis of Indian equity markets with student analysts.', a: 'Anna Cherian', rt: '25 min', l: '', published: true },
      { id: 'p2', t: 'Interview: Alumni in Finance', c: 'Career', p: 'Conversations with Xavier\'s alumni working in investment banking and asset management.', a: 'Darshan', rt: '35 min', l: '', published: true }
    ],
    gallery: [
      { id: 'g1', name: 'Markets in Motion 2025', category: 'events', period: 'past', url: img('Event 2025'), published: true },
      { id: 'g2', name: 'Quant Workshop', category: 'workshop', period: 'past', url: img('Workshop'), published: true },
      { id: 'g4', name: 'Guest Lecture Series', category: 'events', period: 'past', url: img('Lecture'), published: true }
    ],
    contact: {
      title: 'Get in touch',
      body: 'Have a question, collaboration idea, or want to join FINCELL? We\'d love to hear from you.',
      email: 'fincell.xaviers@gmail.com',
      address: 'St. Xavier\'s College, 5 Mahapalika Marg, Mumbai 400001'
    },
    footer: {
      body: 'Student-driven financial research and market intelligence at St. Xavier\'s College, Mumbai.',
      email: 'fincell.xaviers@gmail.com',
      address: 'St. Xavier\'s College, 5 Mahapalika Marg, Mumbai 400001',
      socials: [
        ['X', '#'], ['LI', '#'], ['IG', '#'], ['GH', '#']
      ]
    }
  };
}

export var state = load();

function load() {
  try {
    var saved = JSON.parse(localStorage.getItem(key) || '{}');
    if (saved.order) saved.order = saved.order.filter(function (id) { return routes.some(function (r) { return r[0] === id }) });
    var s = Object.assign(defaultState(), saved);
    return s;
  }
  catch (e) { return defaultState() }
}

function notify(m) {
  try { document.dispatchEvent(new CustomEvent('state:toast', { detail: m })) } catch (e) {}
}

export function save() {
  try { localStorage.setItem(key, JSON.stringify(state)) } catch (e) {}
  if (app.admin) {
    dirty = true;
    try { localStorage.setItem(key + '.unsynced', '1') } catch (e) {}
    clearTimeout(syncTimer);
    syncTimer = setTimeout(flushSync, 1000)
  }
}

var syncTimer = null, syncing = false, queued = false, dirty = false;

function flushSync() {
  if (syncing) { queued = true; return }
  if (!token()) return;
  syncing = true;
  fetch(REST + '/state?on_conflict=id', {
    method: 'POST',
    headers: Object.assign(authHeaders(), { 'Prefer': 'resolution=merge-duplicates,return=representation' }),
    body: JSON.stringify({ id: 1, data: state })
  })
    .then(function (r) { return r.json() })
    .then(function (d) {
      if (d && d.error) { notify('Save failed. Changes kept locally.'); return }
      if (d && d[0] && d[0].data) applyServerState(d[0].data);
      dirty = false;
      try { localStorage.removeItem(key + '.unsynced') } catch (e) {}
    })
    .catch(function () { notify('Save failed. Changes kept locally.') })
    .then(function () {
      syncing = false;
      if (queued) { queued = false; flushSync() }
    })
}

function applyServerState(remote) {
  var i, l, r;
  if (Array.isArray(remote.gallery))
    for (i = 0; i < remote.gallery.length; i++) {
      l = state.gallery && state.gallery[i]; r = remote.gallery[i];
      if (l && r && /^data:image/.test(l.url || '') && !/^data:image/.test(r.url || '')) l.url = r.url
    }
  if (Array.isArray(remote.organization))
    for (i = 0; i < remote.organization.length; i++) {
      l = state.organization && state.organization[i]; r = remote.organization[i];
      if (l && r && /^data:image/.test(l.image || '') && !/^data:image/.test(r.image || '')) l.image = r.image
    }
  if (remote.about && Array.isArray(remote.about.leaders))
    for (i = 0; i < remote.about.leaders.length; i++) {
      l = state.about && state.about.leaders && state.about.leaders[i]; r = remote.about.leaders[i];
      if (l && r && /^data:image/.test(l.image || '') && !/^data:image/.test(r.image || '')) l.image = r.image
    }
  try { localStorage.setItem(key, JSON.stringify(state)) } catch (e) {}
}

export function loadRemote(cb) {
  fetch(REST + '/state?id=eq.1&select=data', { headers: { apikey: ANON_KEY, Authorization: 'Bearer ' + ANON_KEY } })
    .then(function (r) { if (!r.ok) throw new Error('state ' + r.status); return r.json() })
    .then(function (rows) {
      var remote = rows && rows[0] && rows[0].data;
      if (!remote || typeof remote !== 'object') throw new Error('no state');
      var unsynced = false;
      try { unsynced = localStorage.getItem(key + '.unsynced') } catch (e) {}
      if (!dirty && !unsynced) {
        state = Object.assign(defaultState(), state, remote);
        localStorage.setItem(key, JSON.stringify(state));
      }
      cb && cb()
    })
    .catch(function () {})
}

export function verifyLogin(user, pass) {
  if (String(user || '').trim().toLowerCase() !== 'admin' || !pass) return Promise.resolve(false);
  return fetch(AUTH + '/token?grant_type=password', {
    method: 'POST',
    headers: { apikey: ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: pass })
  })
    .then(function (r) { return r.json() })
    .then(function (d) {
      if (d && d.access_token) {
        try {
          sessionStorage.setItem(sessKey, JSON.stringify({
            access_token: d.access_token,
            refresh_token: d.refresh_token || '',
            expires_at: Date.now() + ((d.expires_in || 3600) * 1000)
          }))
        } catch (e) {}
        return true
      }
      return false
    })
    .catch(function () { return false })
}

export function deleteMedia(url) {
  if (!url || typeof url !== 'string' || url.indexOf(STORAGE_PUBLIC_PREFIX) !== 0) return Promise.resolve(false);
  var path = url.slice(STORAGE_PUBLIC_PREFIX.length);
  if (!path) return Promise.resolve(false);
  return fetch(STORAGE + '/object/' + STORAGE_BUCKET + '/' + path, {
    method: 'DELETE',
    headers: { apikey: ANON_KEY, Authorization: 'Bearer ' + token() }
  })
    .then(function (r) { return r.ok })
    .catch(function () { return false })
}

function beaconFlush() {
  if (!token() || !app.admin || !dirty) return;
  dirty = false;
  try {
    fetch(REST + '/state?on_conflict=id', {
      method: 'POST',
      keepalive: true,
      headers: Object.assign(authHeaders(), { 'Prefer': 'resolution=merge-duplicates' }),
      body: JSON.stringify({ id: 1, data: state })
    })
  } catch (e) {}
}
if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', beaconFlush);
  window.addEventListener('beforeunload', beaconFlush);
}

export function uploadMedia(name, dataUrl) {
  var m = /^data:([^;]+);base64,(.+)$/.exec(String(dataUrl || ''));
  if (!m) return Promise.resolve(null);
  var mime = m[1];
  var ext = ({ 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' })[mime] || 'png';
  var path = 'uploads/' + Date.now() + '-' + String(name || 'image').replace(/[^a-z0-9_.-]/gi, '') + '.' + ext;
  var bin = atob(m[2]);
  var bytes = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return fetch(STORAGE + '/object/' + STORAGE_BUCKET + '/' + path, {
    method: 'POST',
    headers: { apikey: ANON_KEY, Authorization: 'Bearer ' + token(), 'Content-Type': mime },
    body: bytes
  })
    .then(function (r) { return r.json() })
    .then(function (d) { return d && !d.error ? STORAGE_PUBLIC_PREFIX + path : null })
    .catch(function () { return null })
}

export function set(path, val) {
  var p = path.split('.'), o = state;
  while (p.length > 1) o = o[p.shift()];
  o[p[0]] = p[0] === 'skills' ? String(val).split(',').map(function (s) { return s.trim() }).filter(Boolean) : val;
}

export function del(path) {
  var p = path.split('.'), i = +p.pop(), o = state;
  p.forEach(function (k) { o = o[k] });
  o.splice(i, 1);
}

export function add(type) {
  if (type === 'stat') state.stats.push({ label: 'New Stat', value: 1 });
  else if (type === 'events') state.events.push({ id: id(), title: 'New Event', date: new Date().toISOString().slice(0, 10), time: '', venue: '', desc: '', published: true });
  else if (type === 'organization') state.organization.push({ name: 'New Entry', role: '', level: 1, image: '', bio: '' });
  else if (type === 'project-fundamental') state.projects.fundamental.push({ title: 'New Project', desc: '', link: '#', year: '2026' });
  else if (type === 'project-quantitative') state.projects.quantitative.push({ title: 'New Project', desc: '', link: '#', year: '2026' });
  else if (type === 'news') state.news.unshift({ id: id(), h: 'New Headline', c: 'Markets', e: 'Summary', d: 'June 2026', l: '', published: true });
  else if (type === 'blogs') state.blogs.unshift({ id: id(), t: 'New Blog', c: 'Finance', p: 'Preview', a: 'FINCELL', rt: '5 min read', l: '', published: true });
  else if (type === 'podcasts') state.podcasts.unshift({ id: id(), t: 'New Podcast', c: 'Markets', p: 'Description', a: 'Host', rt: '20 min', l: '', published: true });
  else if (type === 'about-value') state.about.values.push(['New Value', 'Description']);
  else if (type === 'about-timeline') state.about.timeline.push(['New Date', 'Description']);
}

function id() { return Math.random().toString(36).slice(2, 9) }
