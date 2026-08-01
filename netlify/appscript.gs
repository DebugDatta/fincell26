/**
 * FINCELL content backend - Google Apps Script
 * =============================================
 * Makes admin edits on the deployed site persist to a Google Sheet so every
 * device/browser sees the same content.
 *
 * SETUP (sheet + folder already wired in below)
 *  1. Open the FINCELL sheet, then Extensions > Apps Script.
 *  2. Replace the default file with this one (or paste this into Code.gs).
 *     - It finds the sheet and media folder by the hardcoded IDs below, so it
 *       works even as a standalone script.
 *     - Default admin password is 'fincellgoats'. To change it, set the
 *       ADMIN_PASS script property (gear icon > Project settings > Script
 *       properties) and/or MEDIA_FOLDER_ID to point to a different folder.
 *  3. Deploy > New deployment > Web app:
 *       Execute as:  Me
 *       Who can access:  Anyone
 *     Copy the /exec URL.
 *  4. Paste that URL into js/state.js as SCRIPT_URL
 *     and into netlify/functions/state.js as SCRIPT_URL.
 *  5. Redeploy the Netlify site.
 *
 * NOTE ON CORS / STATUS CODES
 *  - Deploy with access "Anyone" - browsers can then fetch() the /exec URL.
 *  - ContentService always returns HTTP 200; auth failures are signalled with
 *    { error: 'unauthorized' } in the JSON body, and the client checks the body.
 */

var SHEET_NAME = 'state';   // sheet holding the JSON snapshot in one cell
var CELL_REF = 'A1';
var PASS_KEY = 'ADMIN_PASS';
var FOLDER_KEY = 'MEDIA_FOLDER_ID';

// Pre-wired for this site - the Apps Script can run standalone and still
// reach these resources by ID, or you can bind the script to the sheet.
var SHEET_ID = '14vun-Je1A_UsJfKxYaycSEMM6RSbZW7XCarwpbX_D7c';
var FOLDER_ID = '1MTikqwrDtVB82oFM8_c5pLaLOsSBNg22';

// Default admin password. Override anytime by setting the ADMIN_PASS
// script property (gear icon > Project settings > Script properties).
var DEFAULT_PASS = 'fincellgoats';

/* ── Read: served to the site (via netlify/functions/state.js) ─────── */
function doGet(e) {
  // The cell already holds a JSON string - serve it raw (do not re-encode).
  return ContentService.createTextOutput(readState() || '{}').setMimeType(ContentService.MimeType.JSON);
}

/* ── Write: verify / media / save ───────────────────────────────────── */
function doPost(e) {
  var body = parseBody(e);
  var action = (e && e.parameter && e.parameter.action) || (body && body.action) || 'save';

  if (action === 'verify') {
    return jsonOut({ ok: body.password === getPass() });
  }

  if (body.password !== getPass()) {
    return jsonOut({ error: 'unauthorized' });
  }

  if (action === 'media') {
    try {
      return jsonOut({ url: storeMedia(body.dataUrl, body.name) });
    } catch (err) {
      return jsonOut({ error: String(err) });
    }
  }

  try {
    var state = body.state || {};
    convertMedia(state);                  // any leftover data:image URLs -> Drive
    writeState(JSON.stringify(state));
    return jsonOut({ ok: true, state: state });
  } catch (err) {
    return jsonOut({ error: String(err) });
  }
}

/* ── Sheet helpers ──────────────────────────────────────────────────── */
function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openById(SHEET_ID);
  var s = ss.getSheetByName(SHEET_NAME);
  if (!s) s = ss.insertSheet(SHEET_NAME);
  return s;
}

function readState() {
  return getSheet_().getRange(CELL_REF).getValue();
}

function writeState(json) {
  getSheet_().getRange(CELL_REF).setValue(json);
}

/* ── Media (Drive) helpers ──────────────────────────────────────────── */
function getMediaFolder_() {
  var id = PropertiesService.getScriptProperties().getProperty(FOLDER_KEY) || FOLDER_ID;
  return id ? DriveApp.getFolderById(id) : DriveApp.getRootFolder();
}

function storeMedia(dataUrl, name) {
  if (!dataUrl || dataUrl.indexOf(';base64,') < 0) return dataUrl;
  var mime = dataUrl.split(';')[0].split(':')[1] || 'image/png';
  var ext = ({ 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' })[mime] || 'png';
  var blob = Utilities.newBlob(Utilities.base64Decode(dataUrl.split(',')[1]), mime,
    (name || 'image') + '_' + new Date().getTime() + '.' + ext);
  var file = getMediaFolder_().createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return 'https://drive.google.com/uc?export=view&id=' + file.getId();
}

function convertMedia(o) {
  if (!o || typeof o !== 'object') return;
  if (Array.isArray(o)) { o.forEach(convertMedia); return }
  Object.keys(o).forEach(function (k) {
    var v = o[k];
    // Only base64 raster images are pushed to Drive. SVG placeholders (the
    // default gallery art) stay inline in the JSON - decoding them here would
    // fail because SVG data URIs are URL-encoded, not base64.
    if (typeof v === 'string' && /^data:image\/(?:png|jpe?g|webp|gif);base64/.test(v)) o[k] = storeMedia(v, 'image');
    else if (v && typeof v === 'object') convertMedia(v);
  });
}

/* ── Helpers ────────────────────────────────────────────────────────── */
function getPass() {
  return PropertiesService.getScriptProperties().getProperty(PASS_KEY) || DEFAULT_PASS;
}

function parseBody(e) {
  var raw = e && e.postData && e.postData.contents;
  if (!raw) return {};
  try { return JSON.parse(raw) } catch (err) {}
  var out = {};
  raw.split('&').forEach(function (kv) {
    var p = kv.split('=');
    if (p.length === 2) out[decodeURIComponent(p[0])] = decodeURIComponent(p[1].replace(/\+/g, ' '));
  });
  return out;
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
