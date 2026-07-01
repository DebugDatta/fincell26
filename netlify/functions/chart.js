exports.handler = async function (event, context) {
  var symbol = (event.queryStringParameters && event.queryStringParameters.symbol) || '^NSEI';
  var months = parseInt((event.queryStringParameters && event.queryStringParameters.months)) || 3;
  var range = months <= 1 ? '1mo' : months <= 3 ? '3mo' : months <= 6 ? '6mo' : months <= 12 ? '1y' : months <= 24 ? '2y' : '5y';
  try {
    var r = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/' + encodeURIComponent(symbol) +
      '?interval=1d&range=' + range, { headers: { 'user-agent': 'Mozilla/5.0' } });
    if (!r.ok) throw new Error(symbol + ' ' + r.status);
    var data = await r.json();
    if (data.chart && data.chart.error) throw new Error(data.chart.error.description || 'Yahoo error');
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
