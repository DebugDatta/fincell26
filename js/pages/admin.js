import { esc, input, area, $, toast } from '../utils.js';
import { state, save, set, del, add, app, routes, uploadMedia, deleteMedia } from '../state.js';

function imageUpload(label, path, currentVal) {
  var hasImg = currentVal && (/^data:image/.test(currentVal) || /\/api\/media/.test(currentVal) || /^https?:\/\//.test(currentVal));
  return '<div class="field image-upload"><span>' + label + '</span>' +
    (hasImg ? '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px"><img src="' + esc(currentVal) + '" style="width:60px;height:40px;object-fit:cover;border-radius:6px">' +
    '<button class="btn subtle danger" data-clear-image="' + path + '" type="button">Remove</button></div>' : '') +
    '<input type="file" accept="image/*" data-upload-image="' + path + '" style="font-size:12px;color:var(--muted)"></div>'
}

export function adminPage() {
  if (!app.admin) {
    return '<section class="page"><div class="section"><div class="container"><div class="card login-card" style="text-align:center"><span class="eyebrow" style="justify-content:center">Admin</span><h1 class="section-title" style="text-align:center;margin:0 auto">Admin Login</h1><div class="form-grid" style="margin-top:24px;text-align:left"><div class="field"><label>Username</label><input id="loginUser" style="width:100%"></div><div class="field"><label>Password</label><input id="loginPass" type="password" style="width:100%"></div><button class="btn primary" id="loginBtn" style="width:100%;justify-content:center">Sign in</button></div></div></div></div></section>'
  }
  return '<section class="page"><div class="section"><div class="container"><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid var(--line)"><div><span class="eyebrow">Admin Panel</span><h1 class="section-title">Content Manager</h1></div><button class="btn subtle" id="logoutBtn">Sign out</button></div><div class="admin-shell"><aside class="card admin-side">' +
    ['content', 'media', 'typography', 'sections', 'footer'].map(function (x) {
      return '<button class="tab ' + (app.adminTab === x ? 'active' : '') + '" data-admin-tab="' + x + '">' + x + '</button>'
    }).join('') + '</aside><div id="adminPanel" class="card admin-panel"></div></div></div></div></section>'
}

export function adminPanel(renderFn) {
  var p = document.getElementById('adminPanel');
  if (!p) return;
  if (app.adminTab === 'media') p.innerHTML = mediaAdmin();
  else if (app.adminTab === 'typography') p.innerHTML = typoAdmin();
  else if (app.adminTab === 'sections') p.innerHTML = sectionAdmin();
  else if (app.adminTab === 'footer') p.innerHTML = footerAdmin();
  else p.innerHTML = contentAdmin();
  adminBind(renderFn)
}

function contentAdmin() {
  var editors = { hero: heroEdit, about: aboutEdit, departments: orgEditor, blogs: thinkTankEditor, contact: footerAdmin, projects: projEditor };
  return '<h2>Editable Content</h2><div class="admin-tabs">' +
    ['hero', 'about', 'departments', 'blogs', 'projects', 'contact'].map(function (x) {
      return '<button class="tab' + (app.contentTab === x ? ' active' : '') + '" data-edit="' + x + '">' + x + '</button>'
    }).join('') + '</div><div id="editHost">' + (editors[app.contentTab] || heroEdit)() + '</div>'
}

function heroEdit() {
  var h = state.hero;
  return '<div class="admin-section"><h4>Hero Section</h4><div class="editor-grid">' +
    input('Hero label', 'hero.label', h.label) +
    input('Hero title', 'hero.title', h.title) +
    area('Subtitle', 'hero.subtitle', h.subtitle) +
    input('Primary button', 'hero.primaryText', h.primaryText) +
    input('Primary route', 'hero.primaryRoute', h.primaryRoute) +
    input('Secondary button', 'hero.secondaryText', h.secondaryText) +
    input('Secondary route', 'hero.secondaryRoute', h.secondaryRoute) +
    '</div></div><div class="admin-section"><h4>Statistics</h4><div class="admin-list">' +
    state.stats.map(function (s, i) {
      return '<div class="admin-row"><input data-path="stats.' + i + '.label" value="' + esc(s.label) + '"><input data-path="stats.' + i + '.value" value="' + esc(s.value) + '"><button class="btn subtle danger" data-del="stats.' + i + '">Delete</button></div>'
    }).join('') + '</div><button class="btn secondary" data-add="stat" style="margin-top:10px">+ Add Statistic</button></div>'
}

function orgEditor() {
  var org = state.organization || [];
  return '<h3>Core Organization</h3><p class="muted" style="margin-bottom:12px">Level 0 = House, 1 = Department, 2 = Sub-department, 3+ = Person. Order determines nesting.</p><div class="admin-list">' +
    org.map(function (item, i) {
      return '<div class="admin-item-card" style="padding:14px"><div class="editor-grid">' +
        input('Name', 'organization.' + i + '.name', item.name) +
        input('Role (leave blank for headings)', 'organization.' + i + '.role', item.role) +
        input('Level', 'organization.' + i + '.level', item.level) +
        imageUpload('Photo', 'organization.' + i + '.image', item.image) +
        area('Bio', 'organization.' + i + '.bio', item.bio) +
        '</div><div style="display:flex;gap:6px;margin-top:8px">' +
        '<button class="btn subtle" data-order="organization.' + i + '.-1">Up</button>' +
        '<button class="btn subtle" data-order="organization.' + i + '.1">Down</button>' +
        '<button class="btn subtle danger" data-del="organization.' + i + '">Delete</button></div></div>'
    }).join('') + '</div><button class="btn secondary" data-add="organization" style="margin-top:12px">+ Add Entry</button>'
}



function projEditor() {
  var cats = { fundamental: 'Fundamental Research', quantitative: 'Quantitative Research' };
  var html = '<h3>Projects</h3>';
  for (var key in cats) {
    var arr = state.projects[key] || [];
    html += '<div class="admin-section"><h4>' + cats[key] + '</h4><div class="admin-list">' +
      arr.map(function (p, i) {
        return '<div class="admin-item-card"><div class="editor-grid">' +
          input('Title', 'projects.' + key + '.' + i + '.title', p.title) +
          area('Description', 'projects.' + key + '.' + i + '.desc', p.desc) +
          input('Link', 'projects.' + key + '.' + i + '.link', p.link) +
          input('Year', 'projects.' + key + '.' + i + '.year', p.year) +
          '</div><div style="display:flex;gap:6px;margin-top:8px">' +
          '<button class="btn subtle" data-order-proj="' + key + '.' + i + '.-1">Up</button>' +
          '<button class="btn subtle" data-order-proj="' + key + '.' + i + '.1">Down</button>' +
          '<button class="btn subtle danger" data-del="projects.' + key + '.' + i + '">Delete</button></div></div>'
      }).join('') + '</div><button class="btn secondary" data-add="project-' + key + '" style="margin-top:8px">+ Add to ' + cats[key] + '</button></div>'
  }
  return html
}

function coll(name, fields) {
  var arr = state[name];
  if (!arr) return '';
  return '<h3>' + name.charAt(0).toUpperCase() + name.slice(1) + '</h3><div class="admin-list">' +
    arr.map(function (it, i) {
      return '<div class="admin-item-card"><div class="editor-grid">' +
        fields.map(function (f) {
          return f[2] ? area(f[0], name + '.' + i + '.' + f[1], it[f[1]] || '') :
            input(f[0], name + '.' + i + '.' + f[1], Array.isArray(it[f[1]]) ? it[f[1]].join(', ') : it[f[1]] || '')
        }).join('') +
        '<label class="field"><span>Published</span><select data-path="' + name + '.' + i + '.published"><option value="true" ' + (it.published !== false ? 'selected' : '') + '>Published</option><option value="false" ' + (it.published === false ? 'selected' : '') + '>Unpublished</option></select></label></div><button class="btn subtle danger" data-del="' + name + '.' + i + '" style="margin-top:8px">Delete</button></div>'
    }).join('') + '</div><button class="btn secondary" data-add="' + name + '" style="margin-top:10px">+ Add ' + name.charAt(0).toUpperCase() + name.slice(1) + '</button>'
}

function mediaAdmin() {
  var periods = ['current', 'past'];
  var cats = ['events', 'workshop'];
  return '<h2>Media Library</h2><div class="admin-section"><h4>Upload Images</h4>' +
    '<div class="editor-grid" style="grid-template-columns:1fr 1fr">' +
    '<label class="field"><span>Period</span><select id="uploadPeriod" style="width:100%;border:1px solid var(--line);border-radius:4px;padding:8px 10px;background:var(--panel-2);color:var(--text);outline:none">' +
    periods.map(function (p) { return '<option value="' + p + '">' + p.charAt(0).toUpperCase() + p.slice(1) + '</option>' }).join('') +
    '</select></label>' +
    '<label class="field"><span>Category</span><select id="uploadCategory" style="width:100%;border:1px solid var(--line);border-radius:4px;padding:8px 10px;background:var(--panel-2);color:var(--text);outline:none">' +
    cats.map(function (c) { return '<option value="' + c + '">' + (c === 'workshop' ? 'Workshop' : 'Events') + '</option>' }).join('') +
    '</select></label></div>' +
    '<div class="field"><label>Select gallery images</label><input id="galleryUpload" type="file" accept="image/*" multiple></div></div>' +
    '<div class="admin-section"><h4>Gallery Items</h4><div class="admin-list">' +
    (state.gallery.length ? state.gallery.map(function (g, i) {
      return '<div class="admin-row" style="flex-wrap:wrap"><div style="display:flex;align-items:center;gap:10px;flex:1;min-width:140px">' +
        '<img src="' + g.url + '" style="width:60px;height:40px;object-fit:cover;border-radius:6px;flex-shrink:0">' +
        '<span style="font-size:13px">' + esc(g.name) + '</span></div>' +
        '<select data-path="gallery.' + i + '.period" style="border:1px solid var(--line);border-radius:4px;padding:6px 8px;background:var(--panel-2);color:var(--text);font-size:12px;outline:none">' +
        periods.map(function (p) { return '<option value="' + p + '"' + ((g.period || 'past') === p ? ' selected' : '') + '>' + p.charAt(0).toUpperCase() + p.slice(1) + '</option>' }).join('') +
        '</select>' +
        '<select data-path="gallery.' + i + '.category" style="border:1px solid var(--line);border-radius:4px;padding:6px 8px;background:var(--panel-2);color:var(--text);font-size:12px;outline:none">' +
        cats.map(function (c) { return '<option value="' + c + '"' + (g.category === c ? ' selected' : '') + '>' + (c === 'workshop' ? 'Workshop' : 'Events') + '</option>' }).join('') +
        '</select>' +
        '<button class="btn subtle danger" data-del="gallery.' + i + '">Delete</button></div>'
    }).join('') : '<div class="empty" style="padding:16px;font-size:13px">No images uploaded yet.</div>') +
    '</div></div>'
}

function typoAdmin() {
  var fonts = ['General Sans', 'Satoshi', 'Neue Montreal', 'IBM Plex Sans', 'IBM Plex Mono', 'Inter', 'Arial'];
  return '<h2>Typography Manager</h2>' +
    routes.map(function (r) {
      var t = state.typography[r[0]];
      return '<div class="admin-item-card"><h4 style="margin-top:0;margin-bottom:12px;text-transform:none;font-family:var(--heading-font);color:var(--text)">' + r[1] + '</h4><div class="editor-grid">' +
        '<label class="field"><span>Heading font</span><select data-typo="' + r[0] + '.headingFont" style="width:100%;border:1px solid var(--line);border-radius:4px;padding:8px 10px;background:var(--panel-2);color:var(--text);outline:none">' +
        fonts.map(function (f) { return '<option ' + (t.headingFont === f ? 'selected' : '') + '>' + f + '</option>' }).join('') +
        '</select></label>' +
        input('Heading size', 'typography.' + r[0] + '.headingSize', t.headingSize) +
        input('Body size', 'typography.' + r[0] + '.bodySize', t.bodySize) +
        input('Text color', 'typography.' + r[0] + '.textColor', t.textColor) +
        '</div></div>'
    }).join('')
}

function sectionAdmin() {
  return '<h2>Section Order and Visibility</h2><div class="admin-section"><div class="admin-list">' +
    state.order.map(function (id, i) {
      return '<div class="admin-row"><div style="display:flex;align-items:center;gap:10px;flex:1">' +
        '<strong style="min-width:100px;text-transform:capitalize">' + id + '</strong>' +
        '<select data-hidden="' + id + '" style="padding:4px 8px;border:1px solid var(--line);border-radius:4px;background:var(--panel-2);color:var(--text);font-size:12px;outline:none">' +
        '<option value="false" ' + (!state.hidden[id] ? 'selected' : '') + '>Visible</option>' +
        '<option value="true" ' + (state.hidden[id] ? 'selected' : '') + '>Hidden</option></select></div>' +
        '<div style="display:flex;gap:4px"><button class="btn subtle" data-order="' + i + '.-1">Up</button>' +
        '<button class="btn subtle" data-order="' + i + '.1">Down</button></div></div>'
    }).join('') + '</div></div>'
}

function thinkTankEditor() {
  var blogFields = [['Title', 't'], ['Category', 'c'], ['Preview', 'p', 1], ['Author', 'a'], ['Read time', 'rt'], ['Link', 'l']];
  var podcastFields = [['Title', 't'], ['Category', 'c'], ['Description', 'p', 1], ['Host', 'a'], ['Duration', 'rt'], ['Link', 'l']];
  return coll('blogs', blogFields) + coll('podcasts', podcastFields)
}

function footerAdmin() {
  return '<h2>Footer and Contact</h2><div class="admin-section"><h4>Footer Settings</h4><div class="editor-grid">' +
    area('Footer body', 'footer.body', state.footer.body) +
    input('Footer email', 'footer.email', state.footer.email) +
    input('Footer address', 'footer.address', state.footer.address) +
    '</div></div><div class="admin-section"><h4>Contact Page</h4><div class="editor-grid">' +
    input('Contact title', 'contact.title', state.contact.title) +
    area('Contact body', 'contact.body', state.contact.body) +
    input('Contact email', 'contact.email', state.contact.email) +
    input('Contact address', 'contact.address', state.contact.address) +
    '</div></div>'
}

function adminBind(renderFn) {
  Array.prototype.slice.call(document.querySelectorAll('[data-edit]')).forEach(function (b) {
    b.onclick = function () {
      app.contentTab = b.dataset.edit;
      Array.prototype.slice.call(document.querySelectorAll('[data-edit]')).forEach(function (t) { t.classList.remove('active') });
      b.classList.add('active');
      document.getElementById('editHost').innerHTML = editor(b.dataset.edit);
      adminBind(renderFn)
    }
  });
  Array.prototype.slice.call(document.querySelectorAll('[data-path]')).forEach(function (el) {
    el.oninput = function () {
      set(el.dataset.path, el.value === 'true' ? true : el.value === 'false' ? false : el.value);
      save()
    }
  });
  Array.prototype.slice.call(document.querySelectorAll('[data-del]')).forEach(function (b) {
    b.onclick = function () {
      var p = b.dataset.del, url = '';
      if (/^gallery\.\d+$/.test(p)) {
        var gi = +p.split('.')[1];
        if (state.gallery[gi]) url = state.gallery[gi].url || ''
      }
      del(p);
      save();
      adminPanel(renderFn);
      if (url) deleteMedia(url)
    }
  });
  Array.prototype.slice.call(document.querySelectorAll('[data-order]')).forEach(function (b) {
    b.onclick = function () {
      var parts = b.dataset.order.split('.'), arr = state[parts[0]], i = +parts[1], j = i + (+parts[2]);
      if (arr && j >= 0 && j < arr.length) {
        var x = arr[i]; arr[i] = arr[j]; arr[j] = x;
        save(); adminPanel(renderFn)
      }
    }
  });
  Array.prototype.slice.call(document.querySelectorAll('[data-order-proj]')).forEach(function (b) {
    b.onclick = function () {
      var parts = b.dataset.orderProj.split('.'), arr = state.projects[parts[0]], i = +parts[1], j = i + (+parts[2]);
      if (arr && j >= 0 && j < arr.length) {
        var x = arr[i]; arr[i] = arr[j]; arr[j] = x;
        save(); adminPanel(renderFn)
      }
    }
  });
  Array.prototype.slice.call(document.querySelectorAll('[data-add]')).forEach(function (b) {
    b.onclick = function () { add(b.dataset.add); save(); adminPanel(renderFn) }
  });
  Array.prototype.slice.call(document.querySelectorAll('[data-add-leader]')).forEach(function (b) {
    b.onclick = function () {
      if (!state.about.leaders) state.about.leaders = [];
      state.about.leaders.push({ name: 'New Leader', role: 'Role', group: b.dataset.addLeader || 'core', year: '', image: '', bio: '' });
      save();
      adminPanel(renderFn)
    }
  });
  Array.prototype.slice.call(document.querySelectorAll('[data-upload-image]')).forEach(function (el) {
    el.onchange = function () {
      var file = el.files[0];
      if (!file) return;
      var r = new FileReader();
      r.onload = function () {
        uploadMedia(file.name, r.result).then(function (url) {
          try {
            if (url) {
              set(el.dataset.uploadImage, url);
              save();
              adminPanel(renderFn)
            } else {
              toast('Upload failed. Please try again.')
            }
          } catch (err) {
            toast('Upload failed. Please try again.')
          }
        })
      };
      r.readAsDataURL(file)
    }
  });
  Array.prototype.slice.call(document.querySelectorAll('[data-clear-image]')).forEach(function (b) {
    b.onclick = function () {
      set(b.dataset.clearImage, '');
      save();
      adminPanel(renderFn)
    }
  });
  Array.prototype.slice.call(document.querySelectorAll('[data-hidden]')).forEach(function (el) {
    el.onchange = function () { state.hidden[el.dataset.hidden] = el.value === 'true'; save(); adminPanel(renderFn) }
  });
  Array.prototype.slice.call(document.querySelectorAll('[data-order]')).forEach(function (b) {
    b.onclick = function () {
      var p = b.dataset.order.split('.'), i = +p[0], j = i + (+p[1]);
      if (j >= 0 && j < state.order.length) {
        var x = state.order[i];
        state.order[i] = state.order[j];
        state.order[j] = x;
        save();
        adminPanel(renderFn)
      }
    }
  });
  var upload = document.getElementById('galleryUpload');
  if (upload) {
    upload.onchange = function (e) {
      var period = document.getElementById('uploadPeriod').value;
      var cat = document.getElementById('uploadCategory').value;
      Array.prototype.forEach.call(e.target.files, function (file) {
        var r = new FileReader();
        r.onload = function () {
          uploadMedia(file.name, r.result).then(function (url) {
            try {
              if (url) {
                state.gallery.push({ id: Math.random().toString(36).slice(2, 9), name: file.name, category: cat, period: period, url: url, published: true });
                save();
                adminPanel(renderFn)
              } else {
                toast('Upload failed. Please try again.')
              }
            } catch (err) {
              toast('Upload failed. Please try again.')
            }
          })
        };
        r.readAsDataURL(file)
      })
    }
  }
}

function aboutEdit() {
  var a = state.about;
  return '<div class="admin-section"><h4>General</h4><div class="editor-grid">' +
    input('Title', 'about.title', a.title) +
    area('Body', 'about.body', a.body) +
    '</div></div>' +
    '<div class="admin-section"><h4>Core Values</h4><div class="admin-list">' +
    a.values.map(function (v, i) {
      return '<div class="admin-row"><div style="display:flex;gap:6px;flex:1">' +
        '<input data-path="about.values.' + i + '.0" value="' + esc(v[0]) + '" placeholder="Label" style="flex:1">' +
        '<input data-path="about.values.' + i + '.1" value="' + esc(v[1]) + '" placeholder="Description" style="flex:2">' +
        '</div><button class="btn subtle danger" data-del="about.values.' + i + '">Delete</button></div>'
    }).join('') + '</div><button class="btn secondary" data-add="about-value" style="margin-top:8px">+ Add Value</button></div>' +
    '<div class="admin-section"><h4>Timeline</h4><div class="admin-list">' +
    a.timeline.map(function (t, i) {
      return '<div class="admin-row"><div style="display:flex;gap:6px;flex:1">' +
        '<input data-path="about.timeline.' + i + '.0" value="' + esc(t[0]) + '" placeholder="Date/Title" style="flex:1">' +
        '<input data-path="about.timeline.' + i + '.1" value="' + esc(t[1]) + '" placeholder="Description" style="flex:2">' +
        '</div><button class="btn subtle danger" data-del="about.timeline.' + i + '">Delete</button></div>'
    }).join('') + '</div><button class="btn secondary" data-add="about-timeline" style="margin-top:8px">+ Add Timeline Item</button></div>' +
    '<div class="admin-section"><h4>Leadership</h4><div class="admin-list">' +
    (a.leaders || []).map(function (l, i) {
      var grp = l.group || (i === 0 ? 'faculty' : 'core');
      return '<div class="admin-item-card"><div class="editor-grid">' +
        input('Name', 'about.leaders.' + i + '.name', l.name) +
        input('Role', 'about.leaders.' + i + '.role', l.role) +
        '<label class="field"><span>Section</span><select data-path="about.leaders.' + i + '.group">' +
        '<option value="faculty"' + (grp === 'faculty' ? ' selected' : '') + '>Faculty In Charge</option>' +
        '<option value="core"' + (grp === 'core' ? ' selected' : '') + '>Core</option>' +
        '<option value="past"' + (grp === 'past' ? ' selected' : '') + '>Past Members</option>' +
        '</select></label>' +
        input('Year (optional)', 'about.leaders.' + i + '.year', l.year) +
        imageUpload('Image', 'about.leaders.' + i + '.image', l.image) +
        area('Bio', 'about.leaders.' + i + '.bio', l.bio) +
        '</div><button class="btn subtle danger" data-del="about.leaders.' + i + '">Delete Leader</button></div>'
    }).join('') + '</div><button class="btn secondary" data-add-leader="core" style="margin-top:8px">+ Add Leader</button> <button class="btn secondary" data-add-leader="past" style="margin-top:8px">+ Add Past Member</button></div>'
}

function editor(x) {
  if (x === 'hero') return heroEdit();
  if (x === 'about') return aboutEdit();
  if (x === 'departments') return orgEditor();
  if (x === 'blogs') return thinkTankEditor();
  if (x === 'contact') return footerAdmin();
  if (x === 'projects') return projEditor();
  return '<h3>Editable Content</h3><p class="muted">Select a content type from the tabs above.</p>'
}
