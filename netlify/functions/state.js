// CDN-cached read of the Apps Script state snapshot.
// Response is cached at Netlify's edge (5 min) so heavy site traffic never
// hits Apps Script - only the rare cache revalidation does.
const SCRIPT_URL = process.env.APPSCRIPT_URL || 'https://script.google.com/macros/s/AKfycbx0264DeANeZ2LPitsFxPUiluflR763JPaH_aQXTOLOcvZKeg8XgsmpGiYQ2hUeWeV2zQ/exec';

exports.handler = async function (event, context) {
  try {
    var r = await fetch(SCRIPT_URL);
    if (!r.ok) throw new Error('Apps Script ' + r.status);
    var text = await r.text();
    return {
      statusCode: 200,
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
        'cache-control': 'public, max-age=300, stale-while-revalidate=600'
      },
      body: text
    };
  } catch (e) {
    return {
      statusCode: 502,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: e.message })
    };
  }
};
