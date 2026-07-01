export var routes = [
  ['home', 'Home'], ['about', 'About'], ['departments', 'Departments'],
  ['projects', 'Projects'], ['dashboard', 'Dashboard'], ['gallery', 'Gallery'],
  ['events', 'Events'], ['blogs', 'Blogs'],
  ['news', 'News'], ['contact', 'Contact']
];
export var key = 'fincell.pro.v2';
export var app = {
  current: 'home',
  admin: false,
  dept: 'core',
  galFilter: 'all',
  adminTab: 'content',
  contentTab: 'hero'
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
  a = a || '#63d0c7'; b = b || '#7aa7ff';
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient><pattern id="p" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M0 40h80M40 0v80" stroke="rgba(255,255,255,.12)"/></pattern></defs><rect width="1200" height="800" fill="#0b1622"/><rect width="1200" height="800" fill="url(#p)"/><circle cx="910" cy="130" r="310" fill="url(#g)" opacity=".28"/><path d="M110 560 C260 410 360 470 470 330 S710 260 850 390 1010 450 1110 300" fill="none" stroke="' + a + '" stroke-width="10" stroke-linecap="round" opacity=".88"/><text x="88" y="150" fill="#f4f8fb" font-family="Arial" font-size="54" font-weight="800">' + label + '</text><text x="92" y="205" fill="#9aa8b4" font-family="Arial" font-size="24">FINCELL visual asset</text></svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
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
        { name: 'Dr. Rajesh Mehta', role: 'Chairperson', image: '', bio: 'Providing strategic guidance and academic oversight to FINCELL\'s research initiatives.' },
        { name: 'Prof. Anita Desai', role: 'Vice Chairperson', image: '', bio: 'Coordinating faculty engagement and research publication standards.' },
        { name: 'Mr. Vikram Sharma', role: 'Fund Manager', image: '', bio: 'Managing the student-managed investment fund and portfolio allocation strategies.' }
      ]
    },
    departments: [
      { id: 'quant', name: 'Quantitative', label: 'Quants', desc: 'Statistical modelling, algorithmic strategies, and factor-based research. The quantitative division builds the mathematical backbone of FINCELL\'s research output.', skills: ['Python', 'R', 'SQL', 'Time Series', 'Risk Models'], image: img('Quantitative'), members: [
        { name: 'Rohit Nair', role: 'Quant Lead', image: '', published: true },
        { name: 'Aditya Sharma', role: 'President', image: '', published: true }
      ]},
      { id: 'fundamental', name: 'Fundamental', label: 'Fundamental', desc: 'Equity research, DCF modelling, sector analysis, and valuation reports. The fundamental team digs deep into company financials to uncover value.', skills: ['DCF', 'Comps', 'Financials', 'Industry Analysis'], image: img('Fundamental'), members: [
        { name: 'Ananya Rao', role: 'Research Lead', image: '', published: true },
        { name: 'Priya Mehta', role: 'Vice President', image: '', published: true }
      ]},
      { id: 'editorial', name: 'Editorial', label: 'Editorial', desc: 'Finance commentary, newsletters, and long-form analysis. The editorial vertical ensures FINCELL\'s research reaches the widest possible audience.', skills: ['Writing', 'Editing', 'Data Viz', 'Content Strategy'], image: img('Editorial'), members: [
        { name: 'Kabir Desai', role: 'Editorial Lead', image: '', published: true }
      ]},
      { id: 'operations', name: 'Operations', label: 'Ops', desc: 'Events, outreach, partnerships, and strategy. Operations keeps the cell running smoothly and drives its growth across the college.', skills: ['Event Mgmt', 'Outreach', 'Design', 'Strategy'], image: img('Operations'), members: [
        { name: 'Sara Khan', role: 'Ops Lead', image: '', published: true }
      ]}
    ],
    projects: {
      pdfs: [
        { name: 'Indian FMCG Sector — Equity Outlook', url: '#' },
        { name: 'Factor Modelling in Indian Markets', url: '#' },
        { name: 'The Rise of Fintech in India', url: '#' }
      ],
      repos: [
        { title: 'fincell-dashboard', url: 'https://github.com/fincell' },
        { title: 'quant-research-kit', url: 'https://github.com/fincell' }
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
    gallery: [
      { id: 'g1', name: 'Markets in Motion 2025', category: 'events', url: img('Event 2025'), published: true },
      { id: 'g2', name: 'Quant Workshop', category: 'workshops', url: img('Workshop'), published: true },
      { id: 'g3', name: 'Team Summit', category: 'team', url: img('Team'), published: true },
      { id: 'g4', name: 'Guest Lecture Series', category: 'events', url: img('Lecture'), published: true }
    ],
    contact: {
      title: 'Get in touch',
      body: 'Have a question, collaboration idea, or want to join FINCELL? We\'d love to hear from you.',
      email: 'fincell@xaviers.edu',
      phone: '+91 22 2265 1234',
      address: 'St. Xavier\'s College, 5 Mahapalika Marg, Mumbai 400001'
    },
    footer: {
      body: 'Student-driven financial research and market intelligence at St. Xavier\'s College, Mumbai.',
      email: 'fincell@xaviers.edu',
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
    return Object.assign(defaultState(), saved);
  }
  catch (e) { return defaultState() }
}

export function save() { localStorage.setItem(key, JSON.stringify(state)) }

export function set(path, val) {
  if (path.indexOf('_repo') === 0) {
    window.tmpRepo = window.tmpRepo || {};
    window.tmpRepo[path.split('.')[1]] = val;
    return;
  }
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
  else if (type === 'repo') {
    var r = window.tmpRepo || {};
    if (r.title && r.url) state.projects.repos.push({ title: r.title, url: r.url });
  } else if (type === 'events') state.events.push({ id: id(), title: 'New Event', date: new Date().toISOString().slice(0, 10), time: '', venue: '', desc: '', published: true });
  else if (type === 'departments') state.departments.push({ id: id(), name: 'New Department', label: 'Label', desc: 'Description', skills: [], image: img('Department'), members: [], published: true });
  else if (type === 'news') state.news.unshift({ id: id(), h: 'New Headline', c: 'Markets', e: 'Summary', d: 'June 2026', l: '', published: true });
  else if (type === 'blogs') state.blogs.unshift({ id: id(), t: 'New Blog', c: 'Finance', p: 'Preview', a: 'FINCELL', rt: '5 min read', l: '', published: true });
  else if (type === 'about-value') state.about.values.push(['New Value', 'Description']);
  else if (type === 'about-timeline') state.about.timeline.push(['New Date', 'Description']);
}

function id() { return Math.random().toString(36).slice(2, 9) }
