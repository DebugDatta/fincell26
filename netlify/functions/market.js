exports.handler = async function (event, context) {
  try {
    var r = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI?interval=1d&range=5d',
      { headers: { 'user-agent': 'Mozilla/5.0' } });
    if (!r.ok) throw new Error('NSEI ' + r.status);
    var data = await r.json();
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
