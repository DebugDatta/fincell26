async function getCrumb() {
  var r = await fetch('https://fc.yahoo.com/', {
    headers: { 'user-agent': 'Mozilla/5.0' },
    redirect: 'manual'
  });
  var cookie = r.headers.get('set-cookie') || '';
  var a3 = cookie.split(';')[0];
  var r2 = await fetch('https://query2.finance.yahoo.com/v1/test/getcrumb', {
    headers: { 'user-agent': 'Mozilla/5.0', 'cookie': a3 }
  });
  var crumb = (await r2.text()).trim();
  return { cookie: a3, crumb: crumb };
}

exports.handler = async function (event, context) {
  var symbol = (event.queryStringParameters && event.queryStringParameters.symbol) || '';
  if (!symbol) {
    return {
      statusCode: 400,
      headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' },
      body: JSON.stringify({ error: 'Symbol parameter is required' })
    };
  }

  try {
    var auth = await getCrumb();
    var modules = 'financialData,defaultKeyStatistics,summaryDetail,earnings,calendarEvents,recommendationTrend';
    var r = await fetch('https://query2.finance.yahoo.com/v10/finance/quoteSummary/' +
      encodeURIComponent(symbol) + '?modules=' + modules + '&crumb=' + encodeURIComponent(auth.crumb), {
      headers: { 'user-agent': 'Mozilla/5.0', 'cookie': auth.cookie }
    });
    if (!r.ok) throw new Error(symbol + ' ' + r.status);
    var data = await r.json();
    if (data.quoteSummary && data.quoteSummary.error) throw new Error(data.quoteSummary.error.description || 'Yahoo error');
    if (!data.quoteSummary || !data.quoteSummary.result || !data.quoteSummary.result[0]) throw new Error('No data for ' + symbol);
    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' },
      body: JSON.stringify(data)
    };
  } catch (e) {
    return {
      statusCode: 502,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: e.message })
    };
  }
};
