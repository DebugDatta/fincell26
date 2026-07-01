(function(){
var routes=[['home','Home'],['about','About'],['departments','Departments'],['projects','Projects'],['dashboard','Dashboard'],['gallery','Gallery'],['team','Team'],['events','Events'],['blogs','Blogs'],['news','News'],['contact','Contact']];
var key='fincell.pro.v2', current='home', admin=false, dept='core', galFilter='all', adminTab='content';
var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
function id(){return Math.random().toString(36).slice(2,9)}
function esc(v){return String(v==null?'':v).replace(/[&<>\"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function img(label,a,b){a=a||'#63d0c7';b=b||'#7aa7ff';var svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+a+'"/><stop offset="1" stop-color="'+b+'"/></linearGradient><pattern id="p" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M0 40h80M40 0v80" stroke="rgba(255,255,255,.12)"/></pattern></defs><rect width="1200" height="800" fill="#0b1622"/><rect width="1200" height="800" fill="url(#p)"/><circle cx="910" cy="130" r="310" fill="url(#g)" opacity=".28"/><path d="M110 560 C260 410 360 470 470 330 S710 260 850 390 1010 450 1110 300" fill="none" stroke="'+a+'" stroke-width="10" stroke-linecap="round" opacity=".88"/><text x="88" y="150" fill="#f4f8fb" font-family="Arial" font-size="54" font-weight="800">'+label+'</text><text x="92" y="205" fill="#9aa8b4" font-family="Arial" font-size="24">FINCELL visual asset</text></svg>';return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)}
var typo={headingFont:'General Sans',bodyFont:'Inter',buttonFont:'Inter',headingWeight:720,bodyWeight:440,buttonWeight:700,headingSize:48,bodySize:16,buttonSize:14,headingLs:0,bodyLs:0,buttonLs:.02,headingLh:1.03,bodyLh:1.7,buttonLh:1.1,textColor:'#f4f8fb'};
function defaultState(){var typography={};routes.forEach(function(r){typography[r[0]]=Object.assign({},typo)});return {order:routes.map(function(r){return r[0]}),hidden:{},typography:typography,hero:{label:'The Finance Cell - St. Xavier\'s College',title:'From Insights to Impact.',subtitle:'Where rigorous research, quantitative craft, and student curiosity converge - building a bridge between the classroom and the markets that move the world.',primaryText:'Explore FINCELL',primaryRoute:'about',secondaryText:'View Research',secondaryRoute:'projects',quote:'The market is a story. We read between the lines.'},stats:[{label:'Departments',value:4},{label:'Members',value:20},{label:'Publications',value:12},{label:'Years',value:3}],about:{title:'Turning curiosity into financial mastery',body:'FINCELL is the Finance Cell of St. Xavier\'s College, Mumbai - a student-driven organisation dedicated to bridging the gap between academic theory and real-world financial markets. Founded on the belief that rigorous analysis and intellectual curiosity are the foundations of exceptional finance professionals.',values:[['Research First','Every insight backed by data, models, and peer review'],['Collaboration','Cross-departmental learning and shared knowledge'],['Excellence','Professional standards in every report and analysis'],['Impact','Insights that shape thinking beyond the classroom']],timeline:[['2022 - Founded','FINCELL established at St. Xavier\'s College with a founding cohort of 12 members across two departments.'],['2023 - First Research Publication','Published first equity research report on the Indian FMCG sector. Launched weekly newsletter with 200+ subscribers.'],['2024 - Quantitative Division','Launched the Quants vertical, introducing algorithmic strategies and factor modelling to the cell\'s research output.'],['2025 - Dashboard Initiative','Began development of an open-source quantitative research dashboard - the cell\'s most ambitious technical project.'],['2026 - Today','20+ active members across 4 departments, 12+ publications, and a growing presence in Mumbai\'s student finance community.']]},departments:[{id:'core',name:'Core Team',label:'Operations & Strategy',desc:'The backbone of FINCELL. Drives strategy, event management, external outreach, and logistics - ensuring every department operates at peak efficiency and the cell functions cohesively.',skills:['Leadership','Event Management','Finance','Outreach','Strategy'],image:img('Core Team','#63d0c7','#e6b968'),published:true},{id:'quants',name:'Quants',label:'Quantitative Research',desc:'Data-driven market analysis, statistical modelling, algorithmic strategies, and factor research. Members work with Python, pandas, yfinance, and real-world datasets to produce original quantitative insights.',skills:['Python','Statistical Modelling','Factor Research','Backtesting','NLP','Data Science'],image:img('Quants'),published:true},{id:'fundamentals',name:'Fundamentals',label:'Fundamental Analysis',desc:'Deep dives into company financials, sector dynamics, and macro trends. Through equity research reports, DCF models, and industry studies - rigorous bottom-up and top-down analysis that meets professional standards.',skills:['Equity Research','DCF Modelling','Sector Analysis','Macro','Financial Statements'],image:img('Fundamentals','#74d99f','#7aa7ff'),published:true},{id:'editorial',name:'Editorial',label:'Content & Media',desc:'Translates complex financial ideas into compelling narratives. From the FINCELL newsletter to market commentary blogs - shaping the cell\'s public voice and making finance accessible to a wider audience.',skills:['Financial Writing','Newsletters','Market Commentary','Social Media','Research Communication'],image:img('Editorial','#e6b968','#63d0c7'),published:true}],projects:{pdfs:[],repos:[]},gallery:[{id:id(),name:'Research workshop',category:'workshops',url:img('Workshop'),published:true},{id:id(),name:'Team discussion',category:'team',url:img('Team Session','#e6b968','#63d0c7'),published:true},{id:id(),name:'Market briefing',category:'events',url:img('Market Briefing','#74d99f','#7aa7ff'),published:true}],team:['Head of Cell|Core Team','Head of Quants|Quantitative','Head of Research|Fundamentals','Head of Editorial|Editorial','Analyst|Quantitative','Analyst|Fundamentals','Associate|Editorial','Associate|Core Team'].map(function(x,i){var p=x.split('|');return {id:id(),name:'Team Member',role:p[0],dept:p[1],bio:'Student researcher focused on disciplined market thinking and collaborative execution.',image:'',published:true,order:i}}),events:[],ongoing:[['Quantitative Research Dashboard','Building an open-source Streamlit dashboard integrating macro data, factor returns, and NLP sentiment signals. Tech: Python, yfinance, FinBERT. Target: Q3 2026.'],['Equity Research Series','Structured programme where members publish professional equity research reports on listed Indian companies each semester - building a track record for future finance careers.'],['FINCELL Newsletter','Weekly market commentary and curated finance content authored by the Editorial team, distributed to 200+ subscribers across the college community.'],['Factor Momentum Strategy','A backtested cross-sectional momentum factor strategy applied to Nifty 500 constituents. Currently in parameter optimisation phase with the Quants team.']],news:[['RBI Holds Rates Steady Amid Global Uncertainty','Markets','The RBI\'s MPC maintained the repo rate at 6.5%, citing persistent inflationary pressure and global headwinds from slowing advanced economies.','June 2026'],['Nifty 50 Crosses New Milestone on FII Inflows','Equities','FIIs poured INR 18,000 crore into Indian equities this quarter, pushing benchmark indices to record highs.','June 2026'],['India\'s GDP Growth Outpaces Global Projections','Macro','IMF revises India\'s FY2026 forecast upward to 7.2%, driven by domestic consumption and infrastructure investment.','June 2026'],['Global Markets React to Fed Pause Signal','Global','US Federal Reserve signals a potential pause in rate hikes, triggering a broad rally across emerging market assets including India.','May 2026'],['Private Credit Boom: Risks and Opportunities','Credit','India\'s alternative credit market surpasses $25 billion, raising questions about systemic risk and regulatory oversight.','May 2026']].map(function(n){return {id:id(),h:n[0],c:n[1],e:n[2],d:n[3],l:'',published:true}}),blogs:[['Quantitative Finance','The Hidden Alpha in Earnings Call Sentiment','Using FinBERT to parse earnings transcripts reveals subtle tone shifts that often precede significant price movements. Our backtested strategy yields 340bps of annualised alpha...','FINCELL Quants','8 min read'],['Macro','India\'s Current Account: Reading the Trade Signals','A closer look at India\'s evolving trade structure, services surplus, and what the current account trajectory implies for the INR through 2026...','FINCELL Fundamentals','6 min read'],['Valuation','DCF in an Uncertain World: Where Models Mislead','Discounted cash flow models are powerful but their outputs are only as clean as their assumptions. Here\'s where student analysts consistently go wrong...','FINCELL Editorial','5 min read'],['Factor Investing','Momentum vs Mean-Reversion in Indian Mid-Caps','We test classic momentum strategies on Nifty Midcap 100 constituents. Surprising result: the 3-month lookback outperforms 12-month on a risk-adjusted basis...','FINCELL Quants','10 min read'],['Credit Markets','Reading the Indian Corporate Bond Spread','Credit spreads are widening in select pockets of Indian corporate debt. What the IG-HY spread compression of 2024 taught us and what it means now...','FINCELL Fundamentals','7 min read'],['Behavioural Finance','Herding in Indian Retail Investing Post-COVID','India added 25 million new retail investors between 2020 and 2022. We examine the behavioural patterns this cohort exhibits and the pricing implications...','FINCELL Editorial','9 min read']].map(function(b){return {id:id(),c:b[0],t:b[1],p:b[2],a:b[3],rt:b[4],l:'',published:true}}),footer:{body:'The Finance Cell of St. Xavier\'s College, Mumbai. Insights to Impact - since 2022.',email:'fincell@xaviers.edu.in',address:'St. Xavier\'s College, Mumbai',socials:[['in','#'],['gh','#'],['tw','#'],['ig','#']]},contact:{title:'Start a conversation with FINCELL',body:'For collaborations, event partnerships, research discussions, or membership enquiries, reach the team through the form or the contact details below.',email:'fincell@xaviers.edu.in',phone:'',address:'St. Xavier\'s College, Mumbai'}}}
var state=load();function load(){try{return Object.assign(defaultState(),JSON.parse(localStorage.getItem(key)||'{}'))}catch(e){return defaultState()}}function save(){localStorage.setItem(key,JSON.stringify(state))}function pathOf(p){return p==='home'?'/':'/'+p}function pageFromPath(){var p=location.pathname.replace(/^\//,'')||'home';if(p==='admin')return 'admin';return routes.some(function(r){return r[0]===p})?p:'home'}function nav(p,push){if(state.hidden[p]&&p!=='admin')p='home';current=p;applyType(p);render();if(push)history.pushState({p:p},'',pathOf(p));scrollTo(0,0)}
function applyType(p){var t=(state.typography&&state.typography[p])||typo,r=document.documentElement.style;r.setProperty('--heading-font','"'+t.headingFont+'",Inter,Arial,sans-serif');r.setProperty('--body-font','"'+t.bodyFont+'",Inter,Arial,sans-serif');r.setProperty('--button-font','"'+t.buttonFont+'",Inter,Arial,sans-serif');['headingWeight','bodyWeight','buttonWeight'].forEach(function(k){r.setProperty('--'+k.replace(/[A-Z]/g,function(m){return '-'+m.toLowerCase()}),t[k])});r.setProperty('--heading-size',t.headingSize+'px');r.setProperty('--body-size',t.bodySize+'px');r.setProperty('--button-size',t.buttonSize+'px');r.setProperty('--heading-ls',t.headingLs+'px');r.setProperty('--body-ls',t.bodyLs+'px');r.setProperty('--button-ls',t.buttonLs+'em');r.setProperty('--heading-lh',t.headingLh);r.setProperty('--body-lh',t.bodyLh);r.setProperty('--button-lh',t.buttonLh);r.setProperty('--page-text',t.textColor)}
function bindRoutes(r){$$('[data-route]',r||document).forEach(function(a){a.onclick=function(e){e.preventDefault();document.body.classList.remove('nav-open');nav(a.dataset.route,true)}})}function header(){var h='';state.order.forEach(function(id){if(!state.hidden[id])h+='<a href="'+pathOf(id)+'" data-route="'+id+'" class="'+(current===id?'active':'')+'">'+routes.find(function(r){return r[0]===id})[1]+'</a>'});$('#primaryNav').innerHTML=h;$('.admin-link').classList.toggle('active',current==='admin');bindRoutes(document)}
function render(){header();$('#main').innerHTML=page(current);$('#siteFooter').innerHTML=footer();bindRoutes($('#main'));bind();charts();counters()}
function shell(title,eye,body){return '<section class="page"><div class="section"><div class="container"><span class="eyebrow">'+eye+'</span><h1 class="section-title">'+title+'</h1>'+body+'</div></div></section>'}
function page(p){if(p==='admin')return adminPage();return ({home:home,about:about,departments:departments,projects:projects,dashboard:dashboard,gallery:gallery,team:team,events:events,blogs:blogs,news:news,contact:contact}[p]||home)()}
function home(){var h=state.hero;return '<section class="page"><div class="hero"><div class="container hero-layout"><div class="hero-copy"><span class="eyebrow">'+esc(h.label)+'</span><h1 class="display">'+esc(h.title)+'</h1><p class="lead">'+esc(h.subtitle)+'</p><div class="hero-actions"><a class="btn primary" data-route="'+h.primaryRoute+'" href="'+pathOf(h.primaryRoute)+'">'+esc(h.primaryText)+'</a><a class="btn secondary" data-route="'+h.secondaryRoute+'" href="'+pathOf(h.secondaryRoute)+'">'+esc(h.secondaryText)+'</a></div><div class="stats">'+state.stats.map(function(s){return '<div class="stat"><strong data-count="'+s.value+'">0</strong><span>'+esc(s.label)+'</span></div>'}).join('')+'</div></div><aside class="terminal"><div class="terminal-head"><span>Market Pulse</span><span class="pulse">Live</span></div><div class="chart" id="heroChart"></div><p class="quote">'+esc(h.quote)+'</p></aside></div></div><div class="feature-strip"><div class="container feature-grid grid">'+[['Quantitative','Statistical models and algo strategies','departments'],['Fundamental','Equity research and DCF modelling','departments'],['Editorial','Finance commentary and newsletters','blogs'],['Operations','Events, outreach and strategy','events']].map(function(f){return '<a class="card feature-card" data-route="'+f[2]+'" href="'+pathOf(f[2])+'"><div class="feature-icon">'+f[0][0]+'</div><h3>'+f[0]+'</h3><p class="muted">'+f[1]+'</p></a>'}).join('')+'</div></div></section>'}
function about(){var a=state.about;return shell(esc(a.title),'Our Story','<div class="split" style="margin-top:28px"><div><p class="lead">'+esc(a.body)+'</p><div class="value-grid grid">'+a.values.map(function(v){return '<div class="card value-card"><h3>'+esc(v[0])+'</h3><p class="muted">'+esc(v[1])+'</p></div>'}).join('')+'</div></div><div class="timeline">'+a.timeline.map(function(t){return '<div class="timeline-item"><strong>'+esc(t[0])+'</strong><p class="muted">'+esc(t[1])+'</p></div>'}).join('')+'</div></div>')}
function departments(){var list=state.departments.filter(function(d){return d.published!==false}),d=list.find(function(x){return x.id===dept})||list[0];return shell('Four departments, one mission','The Cell','<div class="dept-tabs">'+list.map(function(x){return '<button class="tab '+(x.id===d.id?'active':'')+'" data-dept="'+x.id+'">'+esc(x.name)+'</button>'}).join('')+'</div><div class="dept-layout"><article class="card dept-card"><div class="dept-icon">'+esc(d.name[0])+'</div><p class="eyebrow">'+esc(d.label)+'</p><h2>'+esc(d.name)+'</h2><p class="muted">'+esc(d.desc)+'</p><div class="tag-list">'+d.skills.map(function(s){return '<span class="tag">'+esc(s)+'</span>'}).join('')+'</div></article><div class="media-frame"><img src="'+d.image+'" alt="'+esc(d.name)+'"></div></div>')}
function projects(){return shell('Research and projects','Our Work','<div class="project-grid grid" style="margin-top:28px">'+listBox('Fundamental Research','Equity reports and sector analyses',state.projects.pdfs,'No research papers uploaded yet.')+listBox('Quant Repositories','Open-source models and strategies',state.projects.repos,'No repositories added yet.')+'</div>')}function listBox(t,s,arr,empty){return '<article class="card list-card"><div class="list-head"><div class="dept-icon">'+t[0]+'</div><div><h3>'+t+'</h3><p class="muted">'+s+'</p></div></div><div class="item-list">'+(arr.length?arr.map(function(x){return '<a class="resource-item" href="'+esc(x.url)+'"><span>'+esc(x.name||x.title)+'</span><small class="muted">Open</small></a>'}).join(''):'<div class="empty">'+empty+'</div>')+'</div></article>'}
function dashboard(){return shell('FINCELL Research Dashboard','Analytics','<div class="dashboard-grid grid" style="margin-top:28px">'+[['Nifty 50','24,833','+1.24%'],['Sensex','81,508','+0.98%'],['USD/INR','83.42','-0.12%'],['10Y G-Sec','6.85%','+2 bps']].map(function(k){return '<div class="card kpi"><span>'+k[0]+'</span><strong>'+k[1]+'</strong><p class="'+(k[2][0]==='-'?'danger':'accent')+'">'+k[2]+'</p></div>'}).join('')+'</div><div class="dash-main grid"><div class="card dash-panel"><h3>Nifty 50 - Index Trend</h3><div class="chart" id="dashChart"></div></div><div class="card dash-panel"><h3>Watch List</h3>'+['HDFC Bank +2.34%','Reliance Ind. +0.87%','Infosys -0.43%','TCS +1.12%','ITC Ltd. -0.28%'].map(function(x){return '<div class="resource-item"><span>'+x+'</span></div>'}).join('')+'</div></div>')}
function news(){var a=state.news.filter(function(n){return n.published!==false}),f=a[0];return shell('Latest news','Finance Pulse',f?'<div class="news-layout grid" style="margin-top:28px"><article class="card news-card featured"><div><span class="tag">'+esc(f.c)+' - Featured</span><h3>'+esc(f.h)+'</h3><p class="lead">'+esc(f.e)+'</p></div><p class="muted">'+esc(f.d)+'</p></article><div class="grid">'+a.slice(1,4).map(newsCard).join('')+'</div></div><div class="blog-grid grid" style="margin-top:22px">'+a.slice(4).map(newsCard).join('')+'</div>':'<div class="empty">No news published.</div>')}function newsCard(n){return '<article class="card news-card"><span class="tag">'+esc(n.c)+'</span><h3>'+esc(n.h)+'</h3><p class="muted">'+esc(n.e||n.d)+'</p></article>'}
function blogs(){return shell('From the blog','Perspectives','<div class="blog-grid grid" style="margin-top:28px">'+state.blogs.filter(function(b){return b.published!==false}).map(function(b){return '<article class="card blog-card"><span class="tag">'+esc(b.c)+'</span><h3>'+esc(b.t)+'</h3><p class="muted">'+esc(b.p)+'</p><div class="resource-item"><span>'+esc(b.a)+'</span><small>'+esc(b.rt)+'</small></div></article>'}).join('')+'</div>')}
function events(){var ev=state.events.filter(function(e){return e.published!==false});return shell('Events and ongoing work','What\'s On','<div class="event-layout grid" style="margin-top:28px"><div><h3>Upcoming Events</h3><div class="grid" style="margin-top:16px">'+(ev.length?ev.map(function(e){var d=new Date(e.date);return '<article class="card event-card"><div class="event-date"><strong>'+d.getDate()+'</strong><small>'+d.toLocaleString('en',{month:'short'}).toUpperCase()+'</small></div><div><h3>'+esc(e.title)+'</h3><p class="muted">'+esc(e.desc||'')+'</p><p class="muted">'+esc(e.time||'')+' '+esc(e.venue||'')+'</p></div></article>'}).join(''):'<div class="empty">Nothing scheduled yet - check back soon.</div>')+'</div></div><div><h3>Ongoing Projects</h3><div class="accordion" style="margin-top:16px">'+state.ongoing.map(function(o){return '<div class="card acc"><button data-acc>'+esc(o[0])+'<span>+</span></button><p>'+esc(o[1])+'</p></div>'}).join('')+'</div></div></div>')}
function gallery(){var gs=state.gallery.filter(function(g){return g.published!==false&&(galFilter==='all'||g.category===galFilter)});return shell('Event gallery','Moments','<div class="filter-tabs">'+['all','events','workshops','team'].map(function(f){return '<button class="tab '+(galFilter===f?'active':'')+'" data-filter="'+f+'">'+f+'</button>'}).join('')+'</div><div class="gallery-grid">'+gs.map(function(g){return '<article class="card gallery-card"><button data-lightbox="'+g.id+'"><img loading="lazy" src="'+g.url+'" alt="'+esc(g.name)+'"><div class="gallery-info"><strong>'+esc(g.name)+'</strong><p class="muted">'+esc(g.category)+'</p></div></button></article>'}).join('')+'</div>')}
function team(){return shell('Meet the team','The People','<p class="lead" style="margin-top:18px">Twenty-plus driven students across four verticals, united by a shared belief that great finance starts with great thinking.</p><div class="team-grid grid" style="margin-top:28px">'+state.team.filter(function(t){return t.published!==false}).sort(function(a,b){return(a.order||0)-(b.order||0)}).map(function(t){return '<article class="card team-card">'+(t.image?'<img class="avatar" src="'+t.image+'" alt="'+esc(t.name)+'">':'<div class="avatar">'+esc(t.name[0]||'F')+'</div>')+'<h3>'+esc(t.name)+'</h3><p class="accent">'+esc(t.role)+'</p><p class="muted">'+esc(t.dept)+'</p><p class="muted">'+esc(t.bio)+'</p></article>'}).join('')+'</div>')}
function contact(){var c=state.contact;return shell(esc(c.title),'Contact','<div class="contact-grid grid" style="margin-top:28px"><div><p class="lead">'+esc(c.body)+'</p><div class="card value-card" style="margin-top:22px"><p><strong>Email:</strong> '+esc(c.email)+'</p><p><strong>Address:</strong> '+esc(c.address)+'</p><p><strong>Phone:</strong> '+esc(c.phone||'Available on request')+'</p></div></div><form class="card value-card form-grid" id="contactForm"><div class="field"><label>Name</label><input required></div><div class="field"><label>Email</label><input type="email" required></div><div class="field"><label>Message</label><textarea rows="5" required></textarea></div><button class="btn primary">Send Message</button></form></div>')}
function footer(){var f=state.footer;return '<div class="container"><div class="footer-grid"><div><a class="brand" data-route="home" href="/"><span class="brand-mark">F</span><span><strong>FINCELL</strong><small>St. Xavier\'s College</small></span></a><p class="muted">'+esc(f.body)+'</p></div><div class="footer-col"><h3>Navigate</h3>'+['home','about','departments','projects','dashboard'].map(foot).join('')+'</div><div class="footer-col"><h3>Content</h3>'+['news','events','blogs','gallery','team'].map(foot).join('')+'</div><div class="footer-col"><h3>Contact</h3><a>'+esc(f.address)+'</a><a href="mailto:'+esc(f.email)+'">'+esc(f.email)+'</a></div></div><div class="footer-bottom"><span>© 2026 FINCELL, St. Xavier\'s College. All rights reserved.</span><div class="socials">'+f.socials.map(function(s){return '<a href="'+esc(s[1])+'">'+esc(s[0])+'</a>'}).join('')+'</div></div></div>'}function foot(id){return '<a data-route="'+id+'" href="'+pathOf(id)+'">'+routes.find(function(r){return r[0]===id})[1]+'</a>'}
function adminPage(){if(!admin)return '<section class="page"><div class="section"><div class="container"><div class="card login-card"><span class="eyebrow">Admin</span><h1 class="section-title">Secure dashboard</h1><p class="muted">Restricted access — authorized personnel only.</p><div class="form-grid"><div class="field"><label>Username</label><input id="loginUser"></div><div class="field"><label>Password</label><input id="loginPass" type="password"></div><button class="btn primary" id="loginBtn">Sign in</button></div></div></div></div></section>';return '<section class="page"><div class="section"><div class="container"><div class="inline-actions" style="justify-content:space-between;margin-bottom:24px"><div><span class="eyebrow">Admin Panel</span><h1 class="section-title">Content Manager</h1></div><button class="btn subtle" id="logoutBtn">Sign out</button></div><div class="admin-shell"><aside class="card admin-side">'+['content','media','typography','sections','footer'].map(function(x){return '<button class="tab '+(adminTab===x?'active':'')+'" data-admin-tab="'+x+'">'+x+'</button>'}).join('')+'</aside><div id="adminPanel" class="card admin-panel"></div></div></div></div></section>'}
function adminPanel(){var p=$('#adminPanel');if(!p)return;if(adminTab==='media')p.innerHTML=mediaAdmin();else if(adminTab==='typography')p.innerHTML=typoAdmin();else if(adminTab==='sections')p.innerHTML=sectionAdmin();else if(adminTab==='footer')p.innerHTML=footerAdmin();else p.innerHTML=contentAdmin();adminBind()}
function input(label,path,val){return '<label class="field"><span>'+label+'</span><input data-path="'+path+'" value="'+esc(val)+'"></label>'}function area(label,path,val){return '<label class="field"><span>'+label+'</span><textarea rows="4" data-path="'+path+'">'+esc(val)+'</textarea></label>'}
function contentAdmin(){var h=state.hero;return '<h2>Editable Content</h2><div class="admin-tabs">'+['hero','departments','team','events','news','blogs','projects','contact'].map(function(x){return '<button class="tab" data-edit="'+x+'">'+x+'</button>'}).join('')+'</div><div id="editHost">'+heroEdit()+'</div>'}function heroEdit(){var h=state.hero;return '<div class="editor-grid">'+input('Hero label','hero.label',h.label)+input('Hero title','hero.title',h.title)+area('Subtitle','hero.subtitle',h.subtitle)+input('Primary button','hero.primaryText',h.primaryText)+input('Primary route','hero.primaryRoute',h.primaryRoute)+input('Secondary button','hero.secondaryText',h.secondaryText)+input('Secondary route','hero.secondaryRoute',h.secondaryRoute)+area('Quote','hero.quote',h.quote)+'</div><h3>Statistics</h3><div class="admin-list">'+state.stats.map(function(s,i){return '<div class="admin-row"><input data-path="stats.'+i+'.label" value="'+esc(s.label)+'"><input data-path="stats.'+i+'.value" value="'+esc(s.value)+'"><button class="btn subtle danger" data-del="stats.'+i+'">Delete</button></div>'}).join('')+'</div><button class="btn secondary" data-add="stat">Add statistic</button>'}
function coll(name,fields){var arr=state[name];return '<h3>'+name+'</h3><div class="admin-list">'+arr.map(function(it,i){return '<div class="card value-card"><div class="editor-grid">'+fields.map(function(f){return f[2]?area(f[0],name+'.'+i+'.'+f[1],it[f[1]]||''):input(f[0],name+'.'+i+'.'+f[1],Array.isArray(it[f[1]])?it[f[1]].join(', '):it[f[1]]||'')}).join('')+'<label class="field"><span>Published</span><select data-path="'+name+'.'+i+'.published"><option value="true" '+(it.published!==false?'selected':'')+'>Published</option><option value="false" '+(it.published===false?'selected':'')+'>Unpublished</option></select></label></div><button class="btn subtle danger" data-del="'+name+'.'+i+'">Delete</button></div>'}).join('')+'</div><button class="btn secondary" data-add="'+name+'">Add '+name+'</button>'}
function mediaAdmin(){return '<h2>Media Library</h2><div class="field"><label>Upload gallery images</label><input id="galleryUpload" type="file" accept="image/*" multiple></div><div class="admin-list">'+state.gallery.map(function(g,i){return '<div class="admin-row"><img src="'+g.url+'" style="width:74px;height:52px;object-fit:cover;border-radius:8px"><span>'+esc(g.name)+'</span><button class="btn subtle danger" data-del="gallery.'+i+'">Delete</button></div>'}).join('')+'</div><p class="muted">Crop controls are represented by consistent object-fit previews in this static build.</p>'}
function typoAdmin(){var fonts=['General Sans','Satoshi','Neue Montreal','IBM Plex Sans','IBM Plex Mono','Inter','Arial'];return '<h2>Typography Manager</h2>'+routes.map(function(r){var t=state.typography[r[0]];return '<div class="card value-card"><h3>'+r[1]+'</h3><div class="editor-grid"><label class="field"><span>Heading font</span><select data-typo="'+r[0]+'.headingFont">'+fonts.map(function(f){return '<option '+(t.headingFont===f?'selected':'')+'>'+f+'</option>'}).join('')+'</select></label>'+input('Heading size','typography.'+r[0]+'.headingSize',t.headingSize)+input('Body size','typography.'+r[0]+'.bodySize',t.bodySize)+input('Text color','typography.'+r[0]+'.textColor',t.textColor)+'</div></div>'}).join('')}
function sectionAdmin(){return '<h2>Section Order and Visibility</h2><div class="admin-list">'+state.order.map(function(id,i){return '<div class="admin-row"><strong>'+id+'</strong><select data-hidden="'+id+'"><option value="false" '+(!state.hidden[id]?'selected':'')+'>Visible</option><option value="true" '+(state.hidden[id]?'selected':'')+'>Hidden</option></select><button class="btn subtle" data-order="'+i+'.-1">Up</button><button class="btn subtle" data-order="'+i+'.1">Down</button></div>'}).join('')+'</div>'}
function footerAdmin(){return '<h2>Footer and Contact</h2><div class="editor-grid">'+area('Footer body','footer.body',state.footer.body)+input('Footer email','footer.email',state.footer.email)+input('Footer address','footer.address',state.footer.address)+input('Contact title','contact.title',state.contact.title)+area('Contact body','contact.body',state.contact.body)+input('Contact email','contact.email',state.contact.email)+input('Contact phone','contact.phone',state.contact.phone)+input('Contact address','contact.address',state.contact.address)+'</div>'}
function adminBind(){$$('[data-edit]').forEach(function(b){b.onclick=function(){$('#editHost').innerHTML=editor(b.dataset.edit);adminBind()}});$$('[data-path]').forEach(function(el){el.oninput=function(){set(el.dataset.path,el.value==='true'?true:el.value==='false'?false:el.value);save()}});$$('[data-del]').forEach(function(b){b.onclick=function(){del(b.dataset.del);save();render()}});$$('[data-add]').forEach(function(b){b.onclick=function(){add(b.dataset.add);save();render()}});$$('[data-hidden]').forEach(function(el){el.onchange=function(){state.hidden[el.dataset.hidden]=el.value==='true';save();render()}});$$('[data-order]').forEach(function(b){b.onclick=function(){var p=b.dataset.order.split('.'),i=+p[0],j=i+(+p[1]);if(j>=0&&j<state.order.length){var x=state.order[i];state.order[i]=state.order[j];state.order[j]=x;save();render()}}});$('#galleryUpload')&&($('#galleryUpload').onchange=function(e){Array.prototype.forEach.call(e.target.files,function(file){var r=new FileReader();r.onload=function(){state.gallery.push({id:id(),name:file.name,category:'events',url:r.result,published:true});save();render()};r.readAsDataURL(file)})})}
function editor(x){if(x==='hero')return heroEdit();if(x==='departments')return coll('departments',[['Name','name'],['Label','label'],['Description','desc',1],['Skills','skills'],['Image','image']]);if(x==='team')return coll('team',[['Name','name'],['Role','role'],['Department','dept'],['Bio','bio',1],['Image','image']]);if(x==='events')return coll('events',[['Title','title'],['Date','date'],['Time','time'],['Venue','venue'],['Description','desc',1]]);if(x==='news')return coll('news',[['Headline','h'],['Category','c'],['Excerpt','e',1],['Date','d'],['Link','l']]);if(x==='blogs')return coll('blogs',[['Title','t'],['Category','c'],['Preview','p',1],['Author','a'],['Read time','rt'],['Link','l']]);if(x==='contact')return footerAdmin();return '<h3>Projects</h3><p class="muted">Use media upload for image assets. Add project links below.</p>'+input('Repo title','_repo.title','')+input('Repo URL','_repo.url','')+'<button class="btn secondary" data-add="repo">Add repository</button>'}
function set(path,val){if(path.indexOf('_repo')===0){window.tmpRepo=window.tmpRepo||{};window.tmpRepo[path.split('.')[1]]=val;return}var p=path.split('.'),o=state;while(p.length>1)o=o[p.shift()];o[p[0]]=p[0]==='skills'?String(val).split(',').map(function(s){return s.trim()}).filter(Boolean):val}function del(path){var p=path.split('.'),i=+p.pop(),o=state;p.forEach(function(k){o=o[k]});o.splice(i,1)}function add(type){if(type==='stat')state.stats.push({label:'New Stat',value:1});else if(type==='repo'){var r=window.tmpRepo||{};if(r.title&&r.url)state.projects.repos.push({title:r.title,url:r.url})}else if(type==='events')state.events.push({id:id(),title:'New Event',date:new Date().toISOString().slice(0,10),time:'',venue:'',desc:'',published:true});else if(type==='departments')state.departments.push({id:id(),name:'New Department',label:'Label',desc:'Description',skills:[],image:img('Department'),published:true});else if(type==='team')state.team.push({id:id(),name:'New Member',role:'Role',dept:'Department',bio:'Bio',image:'',published:true});else if(type==='news')state.news.unshift({id:id(),h:'New Headline',c:'Markets',e:'Summary',d:'June 2026',l:'',published:true});else if(type==='blogs')state.blogs.unshift({id:id(),t:'New Blog',c:'Finance',p:'Preview',a:'FINCELL',rt:'5 min read',l:'',published:true})}
function bind(){$$('[data-dept]').forEach(function(b){b.onclick=function(){dept=b.dataset.dept;render()}});$$('[data-filter]').forEach(function(b){b.onclick=function(){galFilter=b.dataset.filter;render()}});$$('[data-acc]').forEach(function(b){b.onclick=function(){b.parentElement.classList.toggle('open')}});$$('[data-lightbox]').forEach(function(b){b.onclick=function(){var g=state.gallery.find(function(x){return x.id===b.dataset.lightbox});$('#lightboxImage').src=g.url;$('#lightbox').classList.add('open')}});$('#contactForm')&&($('#contactForm').onsubmit=function(e){e.preventDefault();toast('Message drafted. Connect a mail service before launch.');e.target.reset()});$('#loginBtn')&&($('#loginBtn').onclick=function(){if($('#loginUser').value==='admin'&&$('#loginPass').value==='fincellgoats'){admin=true;sessionStorage.setItem('fcadmin','1');render()}else toast('Incorrect credentials')});$('#logoutBtn')&&($('#logoutBtn').onclick=function(){admin=false;sessionStorage.removeItem('fcadmin');render()});$$('[data-admin-tab]').forEach(function(b){b.onclick=function(){adminTab=b.dataset.adminTab;adminPanel()}});adminPanel()}
function toast(m){var t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t.timer);t.timer=setTimeout(function(){t.classList.remove('show')},2200)}function counters(){$$('[data-count]').forEach(function(e){var target=+e.dataset.count||0,n=0,step=Math.max(1,Math.ceil(target/36)),tm=setInterval(function(){n=Math.min(target,n+step);e.textContent=n;if(n>=target)clearInterval(tm)},22)})}
function charts(){line('#heroChart',[48,61,56,71,67,80,75,89,85,98,92,107,115]);line('#dashChart',[100,104,99,108,115,112,119,125,121,130,128,135,140])}
function line(sel,v){
  var el=$(sel);if(!el)return;
  var w=620,h=200,p=20,
      min=Math.min.apply(null,v)-4,max=Math.max.apply(null,v)+4,
      xs=v.map(function(_,i){return p+i*((w-p*2)/(v.length-1))}),
      ys=v.map(function(y){return h-p-((y-min)/(max-min))*(h-p*2)});
  /* Build smooth cubic bezier path */
  var d='M'+xs[0]+','+ys[0];
  for(var i=1;i<xs.length;i++){
    var cx=(xs[i-1]+xs[i])/2;
    d+=' C'+cx+','+ys[i-1]+' '+cx+','+ys[i]+' '+xs[i]+','+ys[i];
  }
  /* Area fill path */
  var fill=d+' L'+xs[xs.length-1]+','+(h-p)+' L'+xs[0]+','+(h-p)+' Z';
  var gradId='lg'+sel.replace(/[^a-z]/gi,'');
  el.innerHTML='<svg class="spark-line" viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="none">'
    +'<defs>'
    +'<linearGradient id="'+gradId+'a" x1="0" y1="0" x2="0" y2="1">'
    +'<stop offset="0%" stop-color="#4ecdc4" stop-opacity=".18"/>'
    +'<stop offset="100%" stop-color="#4ecdc4" stop-opacity="0"/>'
    +'</linearGradient>'
    +'<linearGradient id="'+gradId+'b" x1="0" y1="0" x2="1" y2="0">'
    +'<stop offset="0%" stop-color="#4ecdc4" stop-opacity=".5"/>'
    +'<stop offset="100%" stop-color="#7aa7ff" stop-opacity=".9"/>'
    +'</linearGradient>'
    +'</defs>'
    +'<path d="'+fill+'" fill="url(#'+gradId+'a)"/>'
    +'<path d="'+d+'" fill="none" stroke="url(#'+gradId+'b)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'
    /* Dot at last point */
    +'<circle cx="'+xs[xs.length-1]+'" cy="'+ys[ys.length-1]+'" r="4" fill="#4ecdc4" opacity=".9"/>'
    +'<circle cx="'+xs[xs.length-1]+'" cy="'+ys[ys.length-1]+'" r="8" fill="rgba(78,205,196,.15)"/>'
    +'</svg>';
}
function bg(){
  var c=$('#market-bg'),ctx=c.getContext('2d'),w,h,mx=0,my=0,t=0;
  var dpr=Math.min(devicePixelRatio,2);
  /* Financial data streams — horizontal scrolling lines with value jitter */
  var streams=Array.from({length:14},function(_,i){
    return {
      y: (i+1)/(14+1),
      speed: .18+Math.random()*.22,
      amp: 18+Math.random()*28,
      freq: .003+Math.random()*.004,
      phase: Math.random()*Math.PI*2,
      alpha: .04+Math.random()*.06,
      color: Math.random()>.65?'122,185,255':'78,205,196'
    };
  });
  /* Sparse floating node clusters */
  var nodes=Array.from({length:28},function(){
    return {
      x:Math.random(),y:Math.random(),
      vx:(Math.random()-.5)*.0004,vy:(Math.random()-.5)*.0003,
      r: .8+Math.random()*.8
    };
  });
  function resize(){
    w=c.width=innerWidth*dpr;h=c.height=innerHeight*dpr;
    c.style.width=innerWidth+'px';c.style.height=innerHeight+'px';
  }
  addEventListener('resize',resize,{passive:true});
  addEventListener('mousemove',function(e){mx=e.clientX/innerWidth;my=e.clientY/innerHeight;},{passive:true});
  resize();
  function tick(){
    t+=.008;
    ctx.clearRect(0,0,w,h);
    /* Streams */
    streams.forEach(function(s){
      var baseY=s.y*h+(my-.5)*18*dpr;
      ctx.beginPath();
      for(var x=0;x<w;x+=3){
        var y=baseY+Math.sin(x*s.freq+t*s.speed+s.phase)*s.amp*dpr;
        x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.strokeStyle='rgba('+s.color+','+s.alpha+')';
      ctx.lineWidth=1*dpr;
      ctx.stroke();
    });
    /* Nodes + edges */
    nodes.forEach(function(n){
      n.x+=n.vx+(mx-.5)*.00012;
      n.y+=n.vy+(my-.5)*.0001;
      if(n.x<0)n.x=1;if(n.x>1)n.x=0;
      if(n.y<0)n.y=1;if(n.y>1)n.y=0;
    });
    for(var i=0;i<nodes.length;i++){
      for(var j=i+1;j<nodes.length;j++){
        var a=nodes[i],b=nodes[j];
        var dx=(a.x-b.x)*w,dy=(a.y-b.y)*h;
        var d=Math.sqrt(dx*dx+dy*dy);
        var thresh=120*dpr;
        if(d<thresh){
          var op=(1-d/thresh)*.07;
          ctx.strokeStyle='rgba(78,205,196,'+op+')';
          ctx.lineWidth=.8*dpr;
          ctx.beginPath();
          ctx.moveTo(a.x*w,a.y*h);
          ctx.lineTo(b.x*w,b.y*h);
          ctx.stroke();
        }
      }
    }
    nodes.forEach(function(n){
      ctx.fillStyle='rgba(78,205,196,.12)';
      ctx.beginPath();
      ctx.arc(n.x*w,n.y*h,n.r*dpr,0,Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }
  tick();
}admin=sessionStorage.getItem('fcadmin')==='1';
$('#menuToggle').onclick=function(){document.body.classList.toggle('nav-open');this.setAttribute('aria-expanded',document.body.classList.contains('nav-open'))};
$('#lightboxClose').onclick=function(){$('#lightbox').classList.remove('open')};
$('#lightbox').onclick=function(e){if(e.target.id==='lightbox')e.currentTarget.classList.remove('open')};
addEventListener('popstate',function(){nav(pageFromPath(),false)});
addEventListener('scroll',function(){$('#siteHeader').classList.toggle('scrolled',scrollY>18)},{passive:true});

/* ── Scroll-reveal ───────────────────────────── */
(function(){
  var style=document.createElement('style');
  style.textContent=
    '[data-reveal]{opacity:0;transform:translateY(22px);transition:opacity .55s cubic-bezier(.22,1,.36,1),transform .55s cubic-bezier(.22,1,.36,1)}'
    +'[data-reveal].revealed{opacity:1;transform:none}'
    +'[data-reveal][data-delay="1"]{transition-delay:.08s}'
    +'[data-reveal][data-delay="2"]{transition-delay:.16s}'
    +'[data-reveal][data-delay="3"]{transition-delay:.24s}'
    +'[data-reveal][data-delay="4"]{transition-delay:.32s}';
  document.head.appendChild(style);
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting)e.target.classList.add('revealed')});
  },{threshold:.12});
  function attachReveal(){
    $$('.card,.eyebrow,.section-title,.lead,.stats,.timeline-item,.feature-card').forEach(function(el,i){
      if(!el.hasAttribute('data-reveal')){
        el.setAttribute('data-reveal','');
        var col=i%4;
        if(col>0)el.setAttribute('data-delay',String(col));
        io.observe(el);
      }
    });
  }
  /* Re-attach after every render */
  var _render=render;
  render=function(){_render();setTimeout(attachReveal,0)};
  attachReveal();
})();

/* ── Magnetic buttons ────────────────────────── */
(function(){
  function magnet(el){
    el.addEventListener('mousemove',function(e){
      var r=el.getBoundingClientRect();
      var dx=(e.clientX-r.left-r.width/2)*.28;
      var dy=(e.clientY-r.top-r.height/2)*.28;
      el.style.transform='translate('+dx+'px,'+dy+'px)';
    });
    el.addEventListener('mouseleave',function(){el.style.transform='';});
  }
  function attachMagnets(){$$('.btn.primary,.btn.secondary').forEach(function(b){if(!b._mag){b._mag=true;magnet(b)}})}
  var _render2=render;
  render=function(){_render2();setTimeout(attachMagnets,0)};
  attachMagnets();
})();

bg();nav(pageFromPath(),false);
})();
