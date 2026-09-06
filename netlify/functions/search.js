exports.handler = async function (event) {
  var q = (event.queryStringParameters && event.queryStringParameters.q) || '';
  if (!q.trim()) {
    return {
      statusCode: 400,
      headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' },
      body: JSON.stringify({ error: 'q parameter is required' })
    };
  }
  try {
    var params = new URLSearchParams({
      q: q.trim(),
      quotes_count: '10',
      news_count: '0',
      lists_count: '0',
      include_cb: 'false'
    });
    var r = await fetch('https://query2.finance.yahoo.com/v1/finance/search?' + params.toString(), {
      headers: { 'user-agent': 'Mozilla/5.0' }
    });
    if (!r.ok) throw new Error('Yahoo search ' + r.status);
    var data = await r.json();
    var quotes = (data.quotes || []).map(function (q) {
      return {
        symbol: q.symbol,
        shortname: q.shortname || q.longname || '',
        longname: q.longname || q.shortname || '',
        exchange: q.exchange || '',
        quoteType: q.quoteType || ''
      };
    });
    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' },
      body: JSON.stringify({ quotes: quotes })
    };
  } catch (e) {
    return {
      statusCode: 502,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: e.message })
    };
  }
};
